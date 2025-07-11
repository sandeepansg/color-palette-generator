# Core System API Documentation

## Overview
The Core System module provides the fundamental infrastructure for the WCAG Compliant Colour Swatch Generator application. It handles system initialization, device detection, caching, and thread management.

## SystemManager Class

### Constructor
```javascript
new SystemManager(config = {})
```

**Parameters:**
- `config` (Object): Configuration options
  - `debug` (boolean): Enable debug logging (default: false)
  - `autoInitialize` (boolean): Auto-initialize on construction (default: true)
  - `cacheConfig` (Object): Cache manager configuration
  - `threadConfig` (Object): Thread manager configuration

### Methods

#### initialize()
```javascript
async initialize() → Promise<boolean>
```
Initialize the complete system including all components.

**Returns:** Promise resolving to success status

**Example:**
```javascript
const systemManager = new SystemManager({ debug: true });
const success = await systemManager.initialize();
```

#### getStatus()
```javascript
getStatus() → Object
```
Get comprehensive system status information.

**Returns:** Object containing:
- `initialized` (boolean): System initialization status
- `status` (string): Current system status
- `uptime` (number): System uptime in milliseconds
- `components` (Array): List of initialized components
- `deviceInfo` (Object): Device detection results
- `cacheStats` (Object): Cache performance statistics
- `threadStats` (Object): Thread management statistics

#### getComponent(componentName)
```javascript
getComponent(componentName) → Object|null
```
Get reference to specific system component.

**Parameters:**
- `componentName` (string): Component name ('deviceDetector', 'cacheManager', 'threadManager')

**Returns:** Component instance or null if not found

#### shutdown()
```javascript
async shutdown() → Promise<boolean>
```
Gracefully shutdown the system and cleanup resources.

**Returns:** Promise resolving to success status

#### addEventListener(eventType, listener)
```javascript
addEventListener(eventType, listener) → void
```
Add system event listener.

**Parameters:**
- `eventType` (string): Event type to listen for
- `listener` (Function): Event handler function

**Events:**
- `system:initialized`: Fired when system initialization completes
- `system:error`: Fired when system errors occur
- `system:shutdown`: Fired when system shutdown completes

## CacheManager Class

### Constructor
```javascript
new CacheManager(config = {})
```

**Parameters:**
- `config` (Object): Configuration options
  - `dbName` (string): IndexedDB database name
  - `dbVersion` (number): Database version
  - `storeName` (string): Object store name
  - `keyPrefix` (string): Cache key prefix
  - `maxAge` (number): Cache expiration time in milliseconds
  - `maxSize` (number): Maximum cache size in bytes
  - `compressionEnabled` (boolean): Enable data compression

### Methods

#### initialize(deviceFingerprint)
```javascript
async initialize(deviceFingerprint) → Promise<boolean>
```
Initialize cache system with device fingerprint.

**Parameters:**
- `deviceFingerprint` (string): Unique device identifier

**Returns:** Promise resolving to success status

#### storeAsset(key, data, metadata)
```javascript
async storeAsset(key, data, metadata = {}) → Promise<boolean>
```
Store asset in cache with optional metadata.

**Parameters:**
- `key` (string): Asset identifier
- `data` (ArrayBuffer|string): Asset data
- `metadata` (Object): Optional metadata

**Returns:** Promise resolving to success status

#### retrieveAsset(key)
```javascript
async retrieveAsset(key) → Promise<Object|null>
```
Retrieve asset from cache.

**Parameters:**
- `key` (string): Asset identifier

**Returns:** Promise resolving to asset object or null

**Asset Object:**
```javascript
{
  data: ArrayBuffer|string,
  metadata: Object,
  timestamp: number
}
```

#### hasAsset(key)
```javascript
async hasAsset(key) → Promise<boolean>
```
Check if asset exists in cache and is not expired.

**Parameters:**
- `key` (string): Asset identifier

**Returns:** Promise resolving to existence status

#### removeAsset(key)
```javascript
async removeAsset(key) → Promise<boolean>
```
Remove specific asset from cache.

**Parameters:**
- `key` (string): Asset identifier

**Returns:** Promise resolving to success status

#### clearCache()
```javascript
async clearCache() → Promise<boolean>
```
Clear all cached assets.

**Returns:** Promise resolving to success status

#### cleanup(options)
```javascript
async cleanup(options = {}) → Promise<number>
```
Cleanup expired and excess cache entries.

**Parameters:**
- `options` (Object): Cleanup options
  - `urgentCleanup` (boolean): Force aggressive cleanup

**Returns:** Promise resolving to number of cleaned items

#### getCacheStats()
```javascript
getCacheStats() → Object
```
Get cache performance statistics.

**Returns:** Object containing:
- `hits` (number): Cache hits count
- `misses` (number): Cache misses count
- `totalSize` (number): Total cache size in bytes
- `itemCount` (number): Number of cached items
- `hitRate` (number): Cache hit rate (0-1)
- `storageQuota` (Object): Storage quota information

## DeviceDetector Class

### Constructor
```javascript
new DeviceDetector()
```

### Methods

#### initialize()
```javascript
async initialize() → Promise<Object>
```
Initialize device detection and gather system information.

**Returns:** Promise resolving to detection results

#### getDetectionResults()
```javascript
getDetectionResults() → Object
```
Get complete detection results.

**Returns:** Object containing:
- `platform` (Object): Platform information
- `capabilities` (Object): Hardware capabilities
- `optimalThreads` (number): Recommended thread count
- `fontPlatform` (string): Platform key for font selection
- `initialized` (boolean): Detection status

#### generateFingerprint()
```javascript
generateFingerprint() → string
```
Generate unique device fingerprint for cache isolation.

**Returns:** Base64-encoded fingerprint string

#### getOptimalThreadCount()
```javascript
getOptimalThreadCount() → number
```
Get recommended thread count for the device.

**Returns:** Optimal thread count

#### getPlatformFontKey()
```javascript
getPlatformFontKey() → string
```
Get platform identifier for font selection.

**Returns:** Platform key ('darwin', 'windows', 'linux', 'android')

## Usage Examples

### Basic System Initialization
```javascript
// Initialize system
const systemManager = new SystemManager({
  debug: true,
  cacheConfig: {
    maxSize: 104857600, // 100MB
    maxAge: 604800000   // 7 days
  }
});

// Wait for initialization
const success = await systemManager.initialize();
if (success) {
  console.log('System ready');
  console.log(systemManager.getStatus());
}
```

### Cache Operations
```javascript
// Get cache manager
const cacheManager = systemManager.getComponent('cacheManager');

// Store font file
const fontData = await fetch('/fonts/roboto.woff2');
const fontBuffer = await fontData.arrayBuffer();
await cacheManager.storeAsset('font_roboto', fontBuffer, {
  type: 'font',
  format: 'woff2'
});

// Retrieve font file
const cachedFont = await cacheManager.retrieveAsset('font_roboto');
if (cachedFont) {
  console.log('Font loaded from cache');
}
```

### Device Information
```javascript
// Get device detector
const deviceDetector = systemManager.getComponent('deviceDetector');
const deviceInfo = deviceDetector.getDetectionResults();

console.log('Platform:', deviceInfo.platform.name);
console.log('CPU Cores:', deviceInfo.capabilities.cores);
console.log('Memory:', deviceInfo.capabilities.memory);
console.log('GPU:', deviceInfo.capabilities.gpu.vendor);
```

### Event Handling
```javascript
// Listen for system events
systemManager.addEventListener('system:initialized', (event) => {
  console.log('System initialized in', event.detail.initTime, 'ms');
});

systemManager.addEventListener('system:error', (event) => {
  console.error('System error:', event.detail.error);
});
```

## Error Handling

All async methods return promises that may reject with error objects. Always use try-catch blocks:

```javascript
try {
  const success = await systemManager.initialize();
  if (!success) {
    throw new Error('System initialization failed');
  }
} catch (error) {
  console.error('Initialization error:', error);
}
```

## Performance Considerations

- The system automatically optimizes thread count based on device capabilities
- Cache implements LRU cleanup to prevent memory issues
- Asset compression is enabled by default for files >1KB
- IndexedDB operations are asynchronous and non-blocking
- Device detection runs once and caches results

## Browser Compatibility

- Modern browsers with IndexedDB support
- WebGL detection for GPU capabilities
- Progressive enhancement for older browsers
- Mobile-optimized thread management

## Security Notes

- Device fingerprinting is used only for cache isolation
- No sensitive data is stored in fingerprints
- Cache is isolated per device to prevent cross-contamination
- All storage operations respect browser security policies