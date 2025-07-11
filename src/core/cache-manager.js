/**
 * Cache Manager Module
 * Handles persistent storage, caching strategies, and resource management
 * Uses IndexedDB for persistent storage and implements LRU cleanup
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class CacheManager {
  constructor(config = {}) {
    this.config = {
      dbName: config.dbName || 'wcag_swatch_cache',
      dbVersion: config.dbVersion || 1,
      storeName: config.storeName || 'assets',
      keyPrefix: config.keyPrefix || 'wcag_',
      maxAge: config.maxAge || 604800000, // 7 days
      maxSize: config.maxSize || 104857600, // 100MB
      compressionEnabled: config.compressionEnabled || true,
      ...config
    };

    this.db = null;
    this.initialized = false;
    this.storageQuota = null;
    this.fingerprint = null;
    this.cacheStats = {
      hits: 0,
      misses: 0,
      totalSize: 0,
      itemCount: 0
    };
  }

  /**
   * Initialize cache manager
   * @param {string} deviceFingerprint - Device fingerprint for cache directory
   * @returns {Promise<boolean>} Success status
   */
  async initialize(deviceFingerprint) {
    if (this.initialized) {
      return true;
    }

    try {
      this.fingerprint = deviceFingerprint;
      
      // Check storage quota
      await this.checkStorageQuota();
      
      // Initialize IndexedDB
      await this.initializeDB();
      
      // Load cache statistics
      await this.loadCacheStats();
      
      // Schedule periodic cleanup
      this.scheduleCleanup();
      
      this.initialized = true;
      console.log('Cache manager initialized successfully');
      return true;
    } catch (error) {
      console.error('Cache manager initialization failed:', error);
      return false;
    }
  }

  /**
   * Initialize IndexedDB database
   * @returns {Promise<void>}
   */
  async initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create assets store
        if (!db.objectStoreNames.contains('assets')) {
          const assetsStore = db.createObjectStore('assets', { keyPath: 'id' });
          assetsStore.createIndex('type', 'type', { unique: false });
          assetsStore.createIndex('timestamp', 'timestamp', { unique: false });
          assetsStore.createIndex('size', 'size', { unique: false });
        }
        
        // Create metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Check storage quota and availability
   * @returns {Promise<void>}
   */
  async checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        this.storageQuota = {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota - estimate.usage
        };
        
        console.log('Storage quota:', this.storageQuota);
      } catch (error) {
        console.warn('Could not estimate storage quota:', error);
      }
    }
  }

  /**
   * Store asset in cache
   * @param {string} key - Asset key
   * @param {ArrayBuffer|string} data - Asset data
   * @param {Object} metadata - Asset metadata
   * @returns {Promise<boolean>} Success status
   */
  async storeAsset(key, data, metadata = {}) {
    if (!this.initialized) {
      throw new Error('Cache manager not initialized');
    }

    try {
      const id = this.generateCacheKey(key);
      const timestamp = Date.now();
      
      // Prepare data for storage
      let processedData = data;
      let size = this.calculateSize(data);
      
      // Compress if enabled and beneficial
      if (this.config.compressionEnabled && size > 1024) {
        processedData = await this.compressData(data);
        size = this.calculateSize(processedData);
      }

      // Check if we need to clean up space
      if (size > this.config.maxSize * 0.1) { // If single item is >10% of max size
        await this.cleanup({ urgentCleanup: true });
      }

      const cacheEntry = {
        id: id,
        key: key,
        data: processedData,
        metadata: {
          ...metadata,
          originalSize: this.calculateSize(data),
          compressedSize: size,
          compressed: this.config.compressionEnabled && size < this.calculateSize(data)
        },
        timestamp: timestamp,
        accessCount: 0,
        lastAccessed: timestamp,
        type: metadata.type || 'unknown',
        size: size
      };

      // Store in IndexedDB
      await this.dbStore('assets', cacheEntry);
      
      // Update statistics
      this.cacheStats.itemCount++;
      this.cacheStats.totalSize += size;
      
      await this.saveCacheStats();
      
      return true;
    } catch (error) {
      console.error('Failed to store asset:', error);
      return false;
    }
  }

  /**
   * Retrieve asset from cache
   * @param {string} key - Asset key
   * @returns {Promise<Object|null>} Cached asset or null
   */
  async retrieveAsset(key) {
    if (!this.initialized) {
      throw new Error('Cache manager not initialized');
    }

    try {
      const id = this.generateCacheKey(key);
      const cacheEntry = await this.dbGet('assets', id);
      
      if (!cacheEntry) {
        this.cacheStats.misses++;
        return null;
      }

      // Check if expired
      if (this.isExpired(cacheEntry)) {
        await this.removeAsset(key);
        this.cacheStats.misses++;
        return null;
      }

      // Update access tracking
      cacheEntry.accessCount++;
      cacheEntry.lastAccessed = Date.now();
      await this.dbStore('assets', cacheEntry);

      // Decompress if needed
      let data = cacheEntry.data;
      if (cacheEntry.metadata.compressed) {
        data = await this.decompressData(data);
      }

      this.cacheStats.hits++;
      
      return {
        data: data,
        metadata: cacheEntry.metadata,
        timestamp: cacheEntry.timestamp
      };
    } catch (error) {
      console.error('Failed to retrieve asset:', error);
      this.cacheStats.misses++;
      return null;
    }
  }

  /**
   * Remove asset from cache
   * @param {string} key - Asset key
   * @returns {Promise<boolean>} Success status
   */
  async removeAsset(key) {
    if (!this.initialized) {
      return false;
    }

    try {
      const id = this.generateCacheKey(key);
      const cacheEntry = await this.dbGet('assets', id);
      
      if (cacheEntry) {
        await this.dbDelete('assets', id);
        this.cacheStats.itemCount--;
        this.cacheStats.totalSize -= cacheEntry.size;
        await this.saveCacheStats();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to remove asset:', error);
      return false;
    }
  }

  /**
   * Check if asset exists in cache
   * @param {string} key - Asset key
   * @returns {Promise<boolean>} True if exists and not expired
   */
  async hasAsset(key) {
    if (!this.initialized) {
      return false;
    }

    try {
      const id = this.generateCacheKey(key);
      const cacheEntry = await this.dbGet('assets', id);
      
      return cacheEntry && !this.isExpired(cacheEntry);
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all cached assets
   * @returns {Promise<boolean>} Success status
   */
  async clearCache() {
    if (!this.initialized) {
      return false;
    }

    try {
      await this.dbClear('assets');
      
      // Reset statistics
      this.cacheStats = {
        hits: 0,
        misses: 0,
        totalSize: 0,
        itemCount: 0
      };
      
      await this.saveCacheStats();
      
      console.log('Cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Cleanup expired and excess cache entries
   * @param {Object} options - Cleanup options
   * @returns {Promise<number>} Number of items cleaned
   */
  async cleanup(options = {}) {
    if (!this.initialized) {
      return 0;
    }

    try {
      const allEntries = await this.dbGetAll('assets');
      const now = Date.now();
      let cleanedCount = 0;

      // Sort by priority (LRU + size + age)
      const sortedEntries = allEntries.sort((a, b) => {
        const aScore = this.calculateCleanupScore(a, now);
        const bScore = this.calculateCleanupScore(b, now);
        return bScore - aScore; // Higher score = higher priority to keep
      });

      // Remove expired entries
      for (const entry of sortedEntries) {
        if (this.isExpired(entry)) {
          await this.dbDelete('assets', entry.id);
          this.cacheStats.itemCount--;
          this.cacheStats.totalSize -= entry.size;
          cleanedCount++;
        }
      }

      // Remove excess entries if over limits
      const remainingEntries = sortedEntries.filter(entry => !this.isExpired(entry));
      
      if (options.urgentCleanup || 
          this.cacheStats.totalSize > this.config.maxSize * 0.9 || 
          this.cacheStats.itemCount > 1000) {
        
        const targetSize = this.config.maxSize * 0.7;
        const targetCount = 800;
        
        let currentSize = this.cacheStats.totalSize;
        let currentCount = this.cacheStats.itemCount;
        
        for (const entry of remainingEntries.reverse()) {
          if (currentSize <= targetSize && currentCount <= targetCount) {
            break;
          }
          
          await this.dbDelete('assets', entry.id);
          currentSize -= entry.size;
          currentCount--;
          cleanedCount++;
        }
        
        this.cacheStats.totalSize = currentSize;
        this.cacheStats.itemCount = currentCount;
      }

      await this.saveCacheStats();
      
      console.log(`Cleaned up ${cleanedCount} cache entries`);
      return cleanedCount;
    } catch (error) {
      console.error('Cache cleanup failed:', error);
      return 0;
    }
  }

  /**
   * Generate cache key with fingerprint
   * @param {string} key - Original key
   * @returns {string} Cache key
   */
  generateCacheKey(key) {
    return `${this.config.keyPrefix}${this.fingerprint}_${key}`;
  }

  /**
   * Calculate cleanup score for LRU algorithm
   * @param {Object} entry - Cache entry
   * @param {number} now - Current timestamp
   * @returns {number} Cleanup score
   */
  calculateCleanupScore(entry, now) {
    const age = now - entry.timestamp;
    const lastAccessed = now - entry.lastAccessed;
    const accessFrequency = entry.accessCount / (age / 86400000); // accesses per day
    
    // Higher score = higher priority to keep
    return (accessFrequency * 1000) - (lastAccessed / 1000) - (entry.size / 1024);
  }

  /**
   * Check if cache entry is expired
   * @param {Object} entry - Cache entry
   * @returns {boolean} True if expired
   */
  isExpired(entry) {
    return Date.now() - entry.timestamp > this.config.maxAge;
  }

  /**
   * Calculate size of data
   * @param {*} data - Data to measure
   * @returns {number} Size in bytes
   */
  calculateSize(data) {
    if (data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    if (typeof data === 'string') {
      return new Blob([data]).size;
    }
    if (data instanceof Blob) {
      return data.size;
    }
    return JSON.stringify(data).length;
  }

  /**
   * Compress data using gzip-like compression
   * @param {*} data - Data to compress
   * @returns {Promise<ArrayBuffer>} Compressed data
   */
  async compressData(data) {
    // Simple compression using CompressionStream if available
    if ('CompressionStream' in window) {
      try {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        let compressed = new Uint8Array(0);
        
        writer.write(typeof data === 'string' ? new TextEncoder().encode(data) : data);
        writer.close();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const newCompressed = new Uint8Array(compressed.length + value.length);
          newCompressed.set(compressed);
          newCompressed.set(value, compressed.length);
          compressed = newCompressed;
        }
        
        return compressed.buffer;
      } catch (error) {
        console.warn('Compression failed, storing uncompressed:', error);
        return data;
      }
    }
    
    return data; // Return uncompressed if CompressionStream not available
  }

  /**
   * Decompress data
   * @param {ArrayBuffer} compressedData - Compressed data
   * @returns {Promise<*>} Decompressed data
   */
  async decompressData(compressedData) {
    if ('DecompressionStream' in window) {
      try {
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        let decompressed = new Uint8Array(0);
        
        writer.write(compressedData);
        writer.close();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const newDecompressed = new Uint8Array(decompressed.length + value.length);
          newDecompressed.set(decompressed);
          newDecompressed.set(value, decompressed.length);
          decompressed = newDecompressed;
        }
        
        return decompressed.buffer;
      } catch (error) {
        console.warn('Decompression failed:', error);
        return compressedData;
      }
    }
    
    return compressedData;
  }

  /**
   * Schedule periodic cleanup
   */
  scheduleCleanup() {
    // Run cleanup every hour
    setInterval(() => {
      this.cleanup();
    }, 3600000);
  }

  /**
   * Load cache statistics from storage
   */
  async loadCacheStats() {
    try {
      const stats = await this.dbGet('metadata', 'cache_stats');
      if (stats) {
        this.cacheStats = { ...this.cacheStats, ...stats.value };
      }
    } catch (error) {
      console.warn('Failed to load cache stats:', error);
    }
  }

  /**
   * Save cache statistics to storage
   */
  async saveCacheStats() {
    try {
      await this.dbStore('metadata', {
        key: 'cache_stats',
        value: this.cacheStats,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Failed to save cache stats:', error);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      ...this.cacheStats,
      hitRate: this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) || 0,
      storageQuota: this.storageQuota
    };
  }

  // IndexedDB helper methods
  async dbStore(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async dbGet(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async dbGetAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async dbDelete(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  