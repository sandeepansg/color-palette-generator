/**
 * Thread Manager Module
 * Handles multi-threading with Web Workers
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class ThreadManager {
  constructor() {
    this.workers = new Map();
    this.workerPool = [];
    this.taskQueue = [];
    this.activeThreads = 0;
    this.maxThreads = 4;
    this.initialized = false;
  }

  /**
   * Initialize thread manager
   * @param {number} maxThreads - Maximum number of threads
   * @returns {Promise<boolean>} Success status
   */
  async initialize(maxThreads = 4) {
    if (this.initialized) return true;

    try {
      this.maxThreads = Math.max(1, Math.min(maxThreads, 8));
      
      // Create worker pool
      for (let i = 0; i < this.maxThreads; i++) {
        const worker = await this.createWorker();
        if (worker) {
          this.workerPool.push({
            worker: worker,
            busy: false,
            id: i
          });
        }
      }

      this.initialized = true;
      console.log(`Thread manager initialized with ${this.workerPool.length} workers`);
      return true;
    } catch (error) {
      console.error('Thread manager initialization failed:', error);
      return false;
    }
  }

  /**
   * Create a new worker
   * @returns {Promise<Worker|null>} Worker instance or null
   */
  async createWorker() {
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers not supported');
      return null;
    }

    try {
      const workerScript = this.generateWorkerScript();
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      
      worker.onerror = (error) => {
        console.error('Worker error:', error);
      };

      return worker;
    } catch (error) {
      console.error('Worker creation failed:', error);
      return null;
    }
  }

  /**
   * Generate worker script for color calculations
   * @returns {string} Worker script
   */
  generateWorkerScript() {
    return `
      // WCAG Color Calculation Worker
      self.onmessage = function(e) {
        const { taskId, type, data } = e.data;
        
        try {
          let result;
          
          switch (type) {
            case 'calculateContrast':
              result = calculateContrast(data.color1, data.color2);
              break;
            case 'generatePermutations':
              result = generatePermutations(data.colors, data.count);
              break;
            case 'validateSwatch':
              result = validateSwatch(data.swatch, data.standard);
              break;
            default:
              throw new Error('Unknown task type: ' + type);
          }
          
          self.postMessage({
            taskId: taskId,
            success: true,
            result: result
          });
        } catch (error) {
          self.postMessage({
            taskId: taskId,
            success: false,
            error: error.message
          });
        }
      };

      // WCAG contrast calculation
      function calculateContrast(color1, color2) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        const l1 = getLuminance(rgb1);
        const l2 = getLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
      }

      // Convert hex to RGB
      function hexToRgb(hex) {
        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

      // Get relative luminance
      function getLuminance(rgb) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      // Generate color permutations
      function generatePermutations(colors, count) {
        const result = [];
        const used = new Set();
        
        function generateCombinations(current, remaining) {
          if (current.length === count) {
            const sorted = [...current].sort();
            const key = sorted.join('');
            if (!used.has(key)) {
              used.add(key);
              result.push([...current]);
            }
            return;
          }
          
          for (let i = 0; i < remaining.length; i++) {
            const next = [...current, remaining[i]];
            const newRemaining = remaining.filter((_, idx) => idx !== i);
            generateCombinations(next, newRemaining);
          }
        }
        
        generateCombinations([], colors);
        return result;
      }

      // Validate swatch against WCAG standards
      function validateSwatch(swatch, standard) {
        const threshold = standard === 'AAA' ? 7 : 4.5;
        const contrasts = [];
        
        for (let i = 0; i < swatch.length; i++) {
          const next = (i + 1) % swatch.length;
          const contrast = calculateContrast(swatch[i], swatch[next]);
          contrasts.push(contrast);
          
          if (contrast < threshold) {
            return { valid: false, contrasts, minContrast: Math.min(...contrasts) };
          }
        }
        
        return { valid: true, contrasts, minContrast: Math.min(...contrasts) };
      }
    `;
  }

  /**
   * Execute task in thread pool
   * @param {string} type - Task type
   * @param {Object} data - Task data
   * @returns {Promise<*>} Task result
   */
  async executeTask(type, data) {
    if (!this.initialized) {
      throw new Error('Thread manager not initialized');
    }

    return new Promise((resolve, reject) => {
      const taskId = Date.now() + Math.random();
      const task = {
        id: taskId,
        type: type,
        data: data,
        resolve: resolve,
        reject: reject,
        timestamp: Date.now()
      };

      this.taskQueue.push(task);
      this.processQueue();
    });
  }

  /**
   * Process task queue
   */
  processQueue() {
    if (this.taskQueue.length === 0) return;

    const availableWorker = this.workerPool.find(w => !w.busy);
    if (!availableWorker) return;

    const task = this.taskQueue.shift();
    availableWorker.busy = true;
    this.activeThreads++;

    const worker = availableWorker.worker;
    
    const handleMessage = (e) => {
      const { taskId, success, result, error } = e.data;
      
      if (taskId === task.id) {
        worker.removeEventListener('message', handleMessage);
        availableWorker.busy = false;
        this.activeThreads--;
        
        if (success) {
          task.resolve(result);
        } else {
          task.reject(new Error(error));
        }
        
        // Process next task
        this.processQueue();
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({
      taskId: task.id,
      type: task.type,
      data: task.data
    });
  }

  /**
   * Get thread pool statistics
   * @returns {Object} Thread statistics
   */
  getStats() {
    return {
      maxThreads: this.maxThreads,
      activeThreads: this.activeThreads,
      queueLength: this.taskQueue.length,
      availableWorkers: this.workerPool.filter(w => !w.busy).length
    };
  }

  /**
   * Terminate all workers
   * @returns {Promise<boolean>} Success status
   */
  async terminate() {
    try {
      // Clear task queue
      this.taskQueue.forEach(task => {
        task.reject(new Error('Thread manager terminated'));
      });
      this.taskQueue = [];

      // Terminate all workers
      this.workerPool.forEach(({ worker }) => {
        worker.terminate();
      });
      this.workerPool = [];

      this.activeThreads = 0;
      this.initialized = false;
      
      console.log('Thread manager terminated');
      return true;
    } catch (error) {
      console.error('Thread manager termination failed:', error);
      return false;
    }
  }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreadManager;
} else {
  window.ThreadManager = ThreadManager;
}