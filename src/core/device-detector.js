/**
 * Device Detection Module
 * Detects platform, hardware capabilities, and browser features
 * for optimization and font selection
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class DeviceDetector {
  constructor() {
    this.detectionCache = new Map();
    this.platform = null;
    this.capabilities = null;
    this.initialized = false;
  }

  /**
   * Initialize device detection
   * @returns {Promise<Object>} Detection results
   */
  async initialize() {
    if (this.initialized) {
      return this.getDetectionResults();
    }

    try {
      // Detect platform
      this.platform = await this.detectPlatform();
      
      // Detect hardware capabilities
      this.capabilities = await this.detectCapabilities();
      
      // Cache results
      this.detectionCache.set('platform', this.platform);
      this.detectionCache.set('capabilities', this.capabilities);
      
      this.initialized = true;
      
      return this.getDetectionResults();
    } catch (error) {
      console.error('Device detection failed:', error);
      return this.getFallbackResults();
    }
  }

  /**
   * Detect operating system and platform
   * @returns {Object} Platform information
   */
  async detectPlatform() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    let detectedPlatform = 'unknown';
    let platformName = 'Unknown';
    
    // Platform detection logic
    if (userAgent.includes('Mac OS') || userAgent.includes('macOS') || 
        userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      detectedPlatform = 'darwin';
      platformName = userAgent.includes('iPhone') || userAgent.includes('iPad') ? 'iOS' : 'macOS';
    } else if (userAgent.includes('Windows')) {
      detectedPlatform = 'windows';
      platformName = 'Windows';
    } else if (userAgent.includes('Android')) {
      detectedPlatform = 'android';
      platformName = 'Android';
    } else if (userAgent.includes('Linux') || userAgent.includes('X11')) {
      detectedPlatform = 'linux';
      platformName = 'Linux';
    }

    return {
      type: detectedPlatform,
      name: platformName,
      userAgent: userAgent,
      platform: platform,
      mobile: this.isMobile(),
      touchSupport: this.hasTouchSupport()
    };
  }

  /**
   * Detect hardware capabilities
   * @returns {Object} Hardware information
   */
  async detectCapabilities() {
    const capabilities = {
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4,
      gpu: await this.detectGPU(),
      screen: this.getScreenInfo(),
      browser: this.getBrowserInfo(),
      features: this.getFeatureSupport()
    };

    return capabilities;
  }

  /**
   * Detect GPU capabilities
   * @returns {Object} GPU information
   */
  async detectGPU() {
    const gpu = {
      webgl: false,
      webgl2: false,
      vendor: 'unknown',
      renderer: 'unknown',
      cudaSupport: false
    };

    try {
      // WebGL detection
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        gpu.webgl = true;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpu.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          gpu.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }

      // WebGL2 detection
      const gl2 = canvas.getContext('webgl2');
      if (gl2) {
        gpu.webgl2 = true;
      }

      // Basic CUDA detection (limited in browser)
      gpu.cudaSupport = gpu.vendor.toLowerCase().includes('nvidia') && 
                       gpu.renderer.toLowerCase().includes('nvidia');

    } catch (error) {
      console.warn('GPU detection failed:', error);
    }

    return gpu;
  }

  /**
   * Get screen information
   * @returns {Object} Screen details
   */
  getScreenInfo() {
    return {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: screen.orientation ? screen.orientation.type : 'unknown'
    };
  }

  /**
   * Get browser information
   * @returns {Object} Browser details
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'unknown';
    let version = 'unknown';

    if (ua.includes('Chrome')) {
      browser = 'chrome';
      version = ua.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
    } else if (ua.includes('Firefox')) {
      browser = 'firefox';
      version = ua.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'safari';
      version = ua.match(/Version\/(\d+)/)?.[1] || 'unknown';
    } else if (ua.includes('Edge')) {
      browser = 'edge';
      version = ua.match(/Edge\/(\d+)/)?.[1] || 'unknown';
    }

    return {
      name: browser,
      version: version,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine
    };
  }

  /**
   * Get feature support information
   * @returns {Object} Supported features
   */
  getFeatureSupport() {
    return {
      webWorkers: typeof Worker !== 'undefined',
      serviceWorkers: 'serviceWorker' in navigator,
      indexedDB: 'indexedDB' in window,
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window,
      webGL: this.hasWebGL(),
      webGL2: this.hasWebGL2(),
      webAssembly: 'WebAssembly' in window,
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window,
      performanceObserver: 'PerformanceObserver' in window
    };
  }

  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
  }

  /**
   * Check if device has touch support
   * @returns {boolean} True if touch is supported
   */
  hasTouchSupport() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
  }

  /**
   * Check WebGL support
   * @returns {boolean} True if WebGL is supported
   */
  hasWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Check WebGL2 support
   * @returns {boolean} True if WebGL2 is supported
   */
  hasWebGL2() {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  /**
   * Get optimal thread count for device
   * @returns {number} Recommended thread count
   */
  getOptimalThreadCount() {
    const cores = this.capabilities?.cores || 4;
    const memory = this.capabilities?.memory || 4;
    const isMobile = this.platform?.mobile || false;

    if (isMobile) {
      return Math.min(cores, 2); // Limit threads on mobile
    }

    // Desktop optimization
    if (memory >= 8 && cores >= 8) {
      return Math.min(cores - 1, 8); // Leave one core for UI
    } else if (memory >= 4 && cores >= 4) {
      return Math.min(cores - 1, 4);
    } else {
      return Math.min(cores, 2);
    }
  }

  /**
   * Get platform-specific font preference
   * @returns {string} Platform identifier for font selection
   */
  getPlatformFontKey() {
    return this.platform?.type || 'linux';
  }

  /**
   * Get detection results
   * @returns {Object} Complete detection results
   */
  getDetectionResults() {
    return {
      platform: this.platform,
      capabilities: this.capabilities,
      optimalThreads: this.getOptimalThreadCount(),
      fontPlatform: this.getPlatformFontKey(),
      initialized: this.initialized
    };
  }

  /**
   * Get fallback results if detection fails
   * @returns {Object} Fallback detection results
   */
  getFallbackResults() {
    return {
      platform: {
        type: 'linux',
        name: 'Unknown',
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        mobile: false,
        touchSupport: false
      },
      capabilities: {
        cores: 4,
        memory: 4,
        gpu: { webgl: false, webgl2: false, vendor: 'unknown', renderer: 'unknown' },
        screen: this.getScreenInfo(),
        browser: this.getBrowserInfo(),
        features: this.getFeatureSupport()
      },
      optimalThreads: 2,
      fontPlatform: 'linux',
      initialized: false
    };
  }

  /**
   * Generate device fingerprint for cache directory
   * @returns {string} Device fingerprint
   */
  generateFingerprint() {
    const data = {
      platform: this.platform?.type,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      cores: navigator.hardwareConcurrency,
      memory: navigator.deviceMemory
    };

    return btoa(JSON.stringify(data)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeviceDetector;
} else {
  window.DeviceDetector = DeviceDetector;
}