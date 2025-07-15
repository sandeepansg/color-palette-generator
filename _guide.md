# Dadaism Business Card Web App - Project Guide

## Project Overview

A sophisticated web application for creating and customizing business cards with Dadaism aesthetics. The app features responsive design, multi-language support, WCAG compliance, and advanced download capabilities.

## Core Features

### 1. Visual Identity & Design
- **Dadaism Theme**: Non-pure colors, artistic chaos, abstract shapes
- **Material Design 3**: Latest Google Material Design guidelines
- **WCAG Compliance**: AA/AAA color contrast standards
- **Responsive Design**: Mobile-first, adaptive layouts
- **Multi-format Export**: PDF, SVG, PNG with selectable DPI

### 2. Technical Architecture
- **Modular Design**: Microservice-style components
- **Multi-threading**: Web Workers for intensive operations
- **GPU Acceleration**: Canvas/WebGL optimizations
- **Cross-platform**: Adaptive platform detection
- **Open Source**: Only OSS dependencies

### 3. Business Card Features
- **Dual Orientation**: Portrait/landscape with auto-rotation
- **Dual Standards**: ISO-7810/ID-1 (85.6×53.98mm) and Indian (55×90mm)
- **Multi-language Names**: 22 official Indian languages + English
- **Dynamic Colors**: Programmatic color generation
- **Texture Integration**: Web-sourced visual assets

## Directory Structure

```
dadaism-business-card/
├── src/
│   ├── core/
│   │   ├── system/
│   │   │   ├── SystemManager.js
│   │   │   ├── DeviceDetector.js
│   │   │   ├── CacheManager.js
│   │   │   └── ThreadManager.js
│   │   ├── config/
│   │   │   ├── AppConfig.js
│   │   │   ├── ColorConfig.js
│   │   │   └── LocaleConfig.js
│   │   └── utils/
│   │       ├── ColorUtils.js
│   │       ├── MathUtils.js
│   │       └── ValidationUtils.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card/
│   │   │   │   ├── CardRenderer.js
│   │   │   │   ├── CardManager.js
│   │   │   │   └── CardExporter.js
│   │   │   ├── Controls/
│   │   │   │   ├── OrientationToggle.js
│   │   │   │   ├── SizeToggle.js
│   │   │   │   ├── LanguageSelector.js
│   │   │   │   └── ColorPicker.js
│   │   │   ├── Layout/
│   │   │   │   ├── ResponsiveContainer.js
│   │   │   │   ├── NavigationBar.js
│   │   │   │   └── DebugConsole.js
│   │   │   └── Forms/
│   │   │       ├── ContactForm.js
│   │   │       ├── ConfigUploader.js
│   │   │       └── FieldValidator.js
│   │   ├── canvas/
│   │   │   ├── CanvasRenderer.js
│   │   │   ├── ShapeGenerator.js
│   │   │   ├── TextRenderer.js
│   │   │   └── EffectsProcessor.js
│   │   └── export/
│   │       ├── PDFExporter.js
│   │       ├── SVGExporter.js
│   │       └── PNGExporter.js
│   ├── services/
│   │   ├── ColorService.js
│   │   ├── FontService.js
│   │   ├── TextureService.js
│   │   ├── LocaleService.js
│   │   └── AssetService.js
│   ├── data/
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── bn.json
│   │   │   ├── hi.json
│   │   │   └── [other language files]
│   │   ├── names/
│   │   │   ├── IndianNames.js
│   │   │   └── JobTitles.js
│   │   └── constants/
│   │       ├── CardDimensions.js
│   │       ├── ColorPalettes.js
│   │       └── ExportSettings.js
│   ├── workers/
│   │   ├── ColorWorker.js
│   │   ├── ExportWorker.js
│   │   └── ValidationWorker.js
│   ├── styles/
│   │   ├── main.css
│   │   ├── material-theme.css
│   │   ├── responsive.css
│   │   └── print.css
│   └── assets/
│       ├── fonts/
│       ├── icons/
│       ├── textures/
│       └── templates/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── build/
│   ├── webpack.config.js
│   ├── rollup.config.js
│   └── build-tools.js
├── scripts/
│   ├── setup.bat
│   ├── dev-server.js
│   └── build.js
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── LICENSE
```

## Technical Specifications

### 1. System Architecture

#### Core System (SystemManager)
- **Initialization**: Orchestrates component startup
- **Event Management**: Central event bus for component communication
- **Resource Monitoring**: Memory, CPU, GPU usage tracking
- **Error Handling**: Comprehensive error management with recovery

#### Device Detection (DeviceDetector)
- **Platform Detection**: OS, browser, device type
- **Hardware Profiling**: CPU cores, memory, GPU capabilities
- **Feature Detection**: WebGL, Workers, storage APIs
- **Performance Optimization**: Thread recommendations based on hardware

#### Cache Management (CacheManager)
- **IndexedDB Storage**: Persistent client-side storage
- **LRU Eviction**: Intelligent cache cleanup
- **Asset Compression**: Gzip compression for large resources
- **Quota Management**: Storage limit monitoring

#### Thread Management (ThreadManager)
- **Worker Pool**: Pre-initialized Web Workers
- **Task Queue**: FIFO task processing
- **Dynamic Loading**: Runtime worker script generation
- **Load Balancing**: Optimal task distribution

### 2. Business Card System

#### Card Specifications
```javascript
const CARD_DIMENSIONS = {
  ISO_7810_ID1: {
    width: 85.6,    // mm
    height: 53.98,  // mm
    name: "ISO-7810/ID-1",
    pixels: {
      width: 1011,  // at 300 DPI
      height: 638
    }
  },
  INDIAN_STANDARD: {
    width: 55,      // mm
    height: 90,     // mm
    name: "Indian Standard",
    pixels: {
      width: 650,   // at 300 DPI
      height: 1063
    }
  }
};
```

#### Orientation System
- **Auto-rotation**: Device orientation detection
- **Manual Override**: Toggle switch for orientation
- **Consistent Layout**: Maintains design integrity across orientations
- **Animation**: Smooth transitions between orientations

### 3. Color System

#### WCAG Compliance
- **Contrast Calculation**: Real-time contrast ratio computation
- **Color Validation**: AA/AAA compliance checking
- **Adjacent Color Analysis**: Ensures readability across elements
- **Dynamic Adjustment**: Automatic color correction

#### Dadaism Color Generation
```javascript
const generateDadaismPalette = () => {
  const baseHue = Math.random() * 360;
  const palette = [];
  
  // Generate 5 harmonious colors
  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + (i * 72)) % 360;
    const saturation = 40 + Math.random() * 40; // 40-80%
    const lightness = 30 + Math.random() * 40;  // 30-70%
    
    palette.push({
      hue,
      saturation,
      lightness,
      hex: hslToHex(hue, saturation, lightness)
    });
  }
  
  return validateWCAGCompliance(palette);
};
```

### 4. Multi-language Support

#### Language Configuration
```javascript
const SUPPORTED_LANGUAGES = {
  primary: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur'],
  secondary: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur', 'sa', 'sd', 'ne', 'ks', 'do', 'ma', 'ko', 'bo', 'mt']
};

const NAME_MAPPINGS = {
  'Arjun': {
    bn: 'অর্জুন',
    hi: 'अर्जुन',
    ta: 'அர்ஜுன்',
    te: 'అర్జున్',
    // ... other languages
  },
  // ... more names
};
```

#### Name Generation System
- **Gender-neutral Names**: Inclusive name selection
- **Cross-language Mapping**: Consistent names across languages
- **Phonetic Accuracy**: Proper transliteration
- **Cultural Sensitivity**: Appropriate name combinations

### 5. Export System

#### Multi-format Export
- **PDF**: Vector-based, print-ready
- **SVG**: Scalable vector graphics
- **PNG**: Raster with selectable DPI (150, 300, 600, 1200)

#### Export Configuration
```javascript
const EXPORT_SETTINGS = {
  pdf: {
    format: 'A4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    quality: 'high'
  },
  svg: {
    precision: 2,
    embedFonts: true,
    optimized: true
  },
  png: {
    dpi: [150, 300, 600, 1200],
    quality: 95,
    background: 'transparent'
  }
};
```

## Development Workflow

### 1. Setup Process

#### Environment Setup
```bash
# Create project directory
mkdir dadaism-business-card
cd dadaism-business-card

# Initialize npm project
npm init -y

# Install dependencies
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev babel-loader @babel/core @babel/preset-env
npm install --save-dev css-loader style-loader postcss-loader autoprefixer
npm install --save-dev html-webpack-plugin mini-css-extract-plugin
npm install --save-dev eslint prettier jest cypress

# Install runtime dependencies
npm install jspdf html2canvas fabric
npm install workbox-webpack-plugin
npm install @material/web
```

#### Build Configuration
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 3000
  }
};
```

### 2. Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Implementation Guidelines

### 1. Component Architecture

#### Base Component Structure
```javascript
class BaseComponent {
  constructor(config = {}) {
    this.config = { ...this.defaultConfig, ...config };
    this.initialized = false;
    this.eventBus = new EventTarget();
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await this.setup();
      this.initialized = true;
      this.emit('initialized');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async setup() {
    // Override in subclasses
  }

  emit(event, data) {
    this.eventBus.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  on(event, handler) {
    this.eventBus.addEventListener(event, handler);
  }

  destroy() {
    this.initialized = false;
    this.emit('destroyed');
  }
}
```

### 2. State Management

#### Application State
```javascript
class AppState {
  constructor() {
    this.state = {
      card: {
        orientation: 'portrait',
        size: 'ISO_7810_ID1',
        colors: {},
        content: {
          name: { primary: '', secondary: '' },
          title: '',
          contact: {
            phone: '',
            email: '',
            address: ''
          }
        }
      },
      ui: {
        theme: 'light',
        language: 'en',
        debugMode: false
      },
      device: {
        type: 'desktop',
        orientation: 'landscape',
        dpi: 96
      }
    };
    
    this.listeners = new Map();
  }

  setState(path, value) {
    const oldValue = this.getState(path);
    this.setNestedProperty(this.state, path, value);
    this.notifyListeners(path, value, oldValue);
  }

  getState(path) {
    return this.getNestedProperty(this.state, path);
  }

  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path).add(callback);
  }
}
```

### 3. Performance Optimization

#### Lazy Loading
```javascript
const ComponentLoader = {
  async load(componentName) {
    const module = await import(`./components/${componentName}.js`);
    return module.default;
  },

  async loadAsset(assetPath) {
    const response = await fetch(assetPath);
    return response.blob();
  }
};
```

#### Caching Strategy
```javascript
class AssetCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50 * 1024 * 1024; // 50MB
  }

  async get(key) {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      entry.lastAccessed = Date.now();
      return entry.data;
    }
    return null;
  }

  async set(key, data) {
    const size = this.getSize(data);
    if (size > this.maxSize * 0.1) return; // Skip if too large

    this.cache.set(key, {
      data,
      size,
      lastAccessed: Date.now()
    });

    await this.cleanup();
  }

  async cleanup() {
    const totalSize = this.getTotalSize();
    if (totalSize > this.maxSize * 0.9) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      for (const [key] of entries) {
        this.cache.delete(key);
        if (this.getTotalSize() < this.maxSize * 0.7) break;
      }
    }
  }
}
```

## Testing Strategy

### 1. Unit Tests (Jest)
```javascript
describe('ColorUtils', () => {
  test('should calculate WCAG contrast ratio correctly', () => {
    expect(ColorUtils.calculateContrast('#ffffff', '#000000')).toBe(21);
    expect(ColorUtils.calculateContrast('#ffffff', '#ffffff')).toBe(1);
  });

  test('should validate WCAG AA compliance', () => {
    expect(ColorUtils.isWCAGCompliant('#ffffff', '#000000', 'AA')).toBe(true);
    expect(ColorUtils.isWCAGCompliant('#ffffff', '#cccccc', 'AA')).toBe(false);
  });
});
```

### 2. Integration Tests (Cypress)
```javascript
describe('Business Card Generation', () => {
  it('should generate card with correct dimensions', () => {
    cy.visit('/');
    cy.get('[data-cy=orientation-toggle]').click();
    cy.get('[data-cy=size-selector]').select('INDIAN_STANDARD');
    cy.get('[data-cy=generate-button]').click();
    
    cy.get('[data-cy=card-canvas]').should('be.visible');
    cy.get('[data-cy=card-canvas]').should('have.attr', 'width', '650');
    cy.get('[data-cy=card-canvas]').should('have.attr', 'height', '1063');
  });
});
```

### 3. Performance Tests
```javascript
describe('Performance', () => {
  test('should render card within 500ms', async () => {
    const startTime = performance.now();
    await cardRenderer.render(mockCardData);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(500);
  });
});
```

## Deployment

### 1. Build Process
```bash
# Create optimized production build
npm run build

# Generate service worker
npm run sw-build

# Deploy to static hosting
npm run deploy
```

### 2. Progressive Web App (PWA)
```javascript
// manifest.json
{
  "name": "Dadaism Business Card Creator",
  "short_name": "DadaCard",
  "description": "Create artistic business cards with Dadaism aesthetics",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196f3",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 3. Service Worker
```javascript
// sw.js
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return `${request.url}?version=1`;
      },
    }],
  })
);
```

## Security Considerations

### 1. Input Validation
```javascript
const InputValidator = {
  validateName(name) {
    if (typeof name !== 'string') return false;
    if (name.length < 1 || name.length > 50) return false;
    return /^[a-zA-Z\u0080-\uFFFF\s]+$/.test(name);
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }
};
```

### 2. XSS Prevention
```javascript
const sanitizeHTML = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};
```

### 3. CSP Headers
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.dadacard.com;
">
```

## Accessibility Features

### 1. ARIA Labels
```html
<button aria-label="Toggle card orientation" role="switch" aria-checked="false">
  <span class="sr-only">Current orientation: Portrait</span>
</button>
```

### 2. Keyboard Navigation
```javascript
class KeyboardHandler {
  constructor() {
    this.focusableElements = [
      'button', 'input', 'select', 'textarea', '[tabindex]'
    ];
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'Tab':
        this.handleTab(event);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(event);
        break;
      case 'Escape':
        this.handleEscape(event);
        break;
    }
  }
}
```

### 3. Screen Reader Support
```javascript
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};
```

## Monitoring and Analytics

### 1. Performance Monitoring
```javascript
const PerformanceMonitor = {
  trackPageLoad() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    
    this.sendMetric('page_load_time', loadTime);
  },

  trackCardGeneration(startTime, endTime) {
    const duration = endTime - startTime;
    this.sendMetric('card_generation_time', duration);
  },

  sendMetric(name, value) {
    // Send to analytics service
    if (window.gtag) {
      gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(value)
      });
    }
  }
};
```

### 2. Error Tracking
```javascript
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
  
  // Send to error tracking service
  if (window.Sentry) {
    Sentry.captureException(event.error);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  if (window.Sentry) {
    Sentry.captureException(event.reason);
  }
});
```

## Future Enhancements

### 1. AI-Powered Design
- **Color Harmony**: ML-based color palette generation
- **Layout Optimization**: AI-driven layout suggestions
- **Style Transfer**: Apply artistic styles to designs

### 2. Collaboration Features
- **Real-time Sharing**: Live collaboration on card designs
- **Version Control**: Track design iterations
- **Comments**: Design feedback system

### 3. Integration Capabilities
- **CRM Integration**: Import contact information
- **Social Media**: Share designs on social platforms
- **Print Services**: Direct printing API integration

### 4. Advanced Export Options
- **3D Visualization**: Preview cards in 3D
- **Animation**: Animated card presentations
- **AR Preview**: Augmented reality card viewing

## Conclusion

This comprehensive project guide provides the foundation for building a sophisticated, accessible, and performant business card creation application. The modular architecture ensures scalability and maintainability while the focus on open-source technologies keeps the project sustainable and community-friendly.

The implementation emphasizes:
- **User Experience**: Intuitive interface with accessibility features
- **Performance**: Optimized rendering and caching
- **Flexibility**: Multiple export formats and customization options
- **Reliability**: Comprehensive testing and error handling
- **Scalability**: Modular architecture for future enhancements

Follow this guide to create a professional-grade web application that combines artistic expression with technical excellence.
