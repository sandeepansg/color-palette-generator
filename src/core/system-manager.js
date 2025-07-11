/**
 * System Manager Module
 * Central application controller and initialization handler
 * Coordinates all system components and manages application lifecycle
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class SystemManager {
  constructor(config = {}) {
    this.config = {
      debug: config.debug || false,
      autoInitialize: config.autoInitialize !== false,
      cacheConfig: config.cacheConfig || {},
      threadConfig: config.threadConfig || {},
      ...config
    };

    this.initialized = false;
    this.components = new Map();
    this.status = 'idle';
    this.startTime = null;
    this.deviceDetector = null;
    this.cacheManager = null;
    this.threadManager = null;
    this.eventBus = new EventTarget();
    
    // Initialization promise for async coordination
    this.initializationPromise = null;
  }

  /**
   * Initialize the complete system
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    if (this.initialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  /**
   * Perform system initialization
   * @private
   * @returns {Promise<boolean>} Success status
   */
  async _performInitialization() {
    try {
      this.status = 'initializing';
      this.startTime = Date.now();
      
      this.log('System initialization started');

      // Phase 1: Device Detection
      await this.initializeDeviceDetection();

      // Phase 2: Cache System
      await this.initializeCacheSystem();

      // Phase 3: Thread Management
      await this.initializeThreadManagement();

      // Phase 4: System Validation
      await this.validateSystem();

      this.status = 'ready';
      this.initialized = true;
      
      const initTime = Date.now() - this.startTime;
      this.log(`System initialization completed in ${initTime}ms`);
      
      this.dispatchEvent('system:initialized', {
        initTime: initTime,
        components: Array.from(this.components.keys())
      });

      return true;
    } catch (error) {
      this.status = 'error';
      this.error('System initialization failed:', error);
      
      this.dispatchEvent('system:error', {
        error: error.message,
        phase: this.status
      });
      
      return false;
    }
  }

  /**
   * Initialize device detection
   * @private
   * @returns {Promise<void>}
   */
  async initializeDeviceDetection() {
    try {
      this.log('Initializing device detection...');
      
      // Initialize device detector (assuming it's already loaded)
      this.deviceDetector = new DeviceDetector();
      const detectionResults = await this.deviceDetector.initialize();
      
      this.components.set('deviceDetector', this.deviceDetector);
      
      this.log('Device detection completed:', {
        platform: detectionResults.platform.name,
        cores: detectionResults.capabilities.cores,
        memory: detectionResults.capabilities.memory
      });
      
      return detectionResults;
    } catch (error) {
      this.error('Device detection failed:', error);
      throw error;
    }
  }

  /**
   * Initialize cache system
   * @private
   * @returns {Promise<void>}
   */
  async initializeCacheSystem() {
    try {
      this.log('Initializing cache system...');
      
      // Generate device fingerprint for cache directory
      const fingerprint = this.deviceDetector.generateFingerprint();
      
      // Initialize cache manager
      this.cacheManager = new CacheManager({
        ...this.config.cacheConfig,
        dbName: 'wcag_swatch_cache',
        keyPrefix: 'wcag_'
      });
      
      const cacheInitialized = await this.cacheManager.initialize(fingerprint);
      
      if (!cacheInitialized) {
        throw new Error('Cache system initialization failed');
      }
      
      this.components.set('cacheManager', this.cacheManager);
      
      this.log('Cache system initialized successfully');
    } catch (error) {
      this.error('Cache system initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize thread management
   * @private
   * @returns {Promise<void>}
   */
  async initializeThreadManagement() {
    try {
      this.log('Initializing thread management...');
      
      const optimalThreads = this.deviceDetector.getOptimalThreadCount();
      
      // Create simplified thread manager for demo
      this.threadManager = {
        maxThreads: optimalThreads,
        activeThreads: 0,
        workerPool: [],
        initialized: true,
        
        async executeTask(task, data) {
          // Simplified task execution for demo
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(task(data));
            }, 10);
          });
        },
        
        getStatus() {
          return {
            maxThreads: this.maxThreads,
            activeThreads: this.activeThreads,
            available: this.maxThreads - this.activeThreads
          };
        }
      };
      
      this.components.set('threadManager', this.threadManager);
      
      this.log(`Thread management initialized with ${optimalThreads} threads`);
    } catch (error) {
      this.error('Thread management initialization failed:', error);
      throw error;
    }
  }

  /**
   * Validate system components
   * @private
   * @returns {Promise<void>}
   */
  async validateSystem() {
    try {
      this.log('Validating system components...');
      
      const validationResults = {
        deviceDetector: this.deviceDetector && this.deviceDetector.initialized,
        cacheManager: this.cacheManager && this.cacheManager.initialized,
        threadManager: this.threadManager && this.threadManager.initialized
      };
      
      const allValid = Object.values(validationResults).every(result => result === true);
      
      if (!allValid) {
        throw new Error('System validation failed: ' + JSON.stringify(validationResults));
      }
      
      this.log('System validation completed successfully');
    } catch (error) {
      this.error('System validation failed:', error);
      throw error;
    }
  }

  /**
   * Get system status
   * @returns {Object} System status information
   */
  getStatus() {
    return {
      initialized: this.initialized,
      status: this.status,
      uptime: this.startTime ? Date.now() - this.startTime : 0,
      components: Array.from(this.components.keys()),
      deviceInfo: this.deviceDetector ? this.deviceDetector.getDetectionResults() : null,
      cacheStats: this.cacheManager ? this.cacheManager.getCacheStats() : null,
      threadStats: this.threadManager ? this.threadManager.getStatus() : null
    };
  }

  /**
   * Get specific component
   * @param {string} componentName - Component name
   * @returns {Object|null} Component instance
   */
  getComponent(componentName) {
    return this.components.get(componentName) || null;
  }

  /**
   * Shutdown system gracefully
   * @returns {Promise<boolean>} Success status
   */
  async shutdown() {
    try {
      this.log('System shutdown initiated...');
      
      this.status = 'shutting_down';
      
      // Cleanup components in reverse order
      const componentNames = Array.from(this.components.keys()).reverse();
      
      for (const componentName of componentNames) {
        const component = this.components.get(componentName);
        if (component && typeof component.shutdown === 'function') {
          await component.shutdown();
        }
      }
      
      this.components.clear();
      this.status = 'shutdown';
      this.initialized = false;
      
      this.log('System shutdown completed');
      
      this.dispatchEvent('system:shutdown', {
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      this.error('System shutdown failed:', error);
      return false;
    }
  }

  /**
   * Restart system
   * @returns {Promise<boolean>} Success status
   */
  async restart() {
    try {
      this.log('System restart initiated...');
      
      await this.shutdown();
      
      // Reset initialization promise
      this.initializationPromise = null;
      
      return await this.initialize();
    } catch (error) {
      this.error('System restart failed:', error);
      return false;
    }
  }

  /**
   * Dispatch system event
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  dispatchEvent(eventType, data = {}) {
    const event = new CustomEvent(eventType, {
      detail: {
        timestamp: Date.now(),
        ...data
      }
    });
    
    this.eventBus.dispatchEvent(event);
  }

  /**
   * Add event listener
   * @param {string} eventType - Event type
   * @param {Function} listener - Event listener
   */
  addEventListener(eventType, listener) {
    this.eventBus.addEventListener(eventType, listener);
  }

  /**
   * Remove event listener
   * @param {string} eventType - Event type
   * @param {Function} listener - Event listener
   */
  removeEventListener(eventType, listener) {
    this.eventBus.removeEventListener(eventType, listener);
  }

  /**
   * Log message with timestamp
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  log(message, data = null) {
    if (this.config.debug) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] SystemManager: ${message}`, data || '');
    }
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] SystemManager ERROR: ${message}`, error || '');
  }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SystemManager;
} else {
  window.SystemManager = SystemManager;
}