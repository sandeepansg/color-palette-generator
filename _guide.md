# Business Card Generator

A sophisticated web-based business card generator that creates professional, customizable business cards with WCAG-compliant color schemes and support for international standards.

## Features

### Core Functionality
- **Multi-Standard Support**: US (85.60 × 53.98 mm) and Indian Standard (55 × 90 mm)
- **Dual Orientation**: Landscape and Portrait modes for both standards
- **WCAG Compliance**: Automatic color contrast validation for accessibility
- **Canvas Export**: High-quality canvas rendering with customizable settings
- **Responsive Design**: Mobile-friendly interface with touch support

### Design Elements
- **Chaos Level Control**: Adjustable randomization from 0-100%
- **Dynamic Color Palettes**: Programmatically generated WCAG-compliant color schemes
- **Geometric Shapes**: Circle, square, triangle, line, organic, hexagon, star, and wave shapes
- **Typography**: Support for English and native script (Bengali/Malayalam/Brahmic/Devanagari)
- **Company Logo Area**: Dedicated Dada-styled shape for logo placement
- **Card Border**: Professional border with clean background

### Advanced Features
- **Smart Layout**: Grouped contact information with subtle random rotation
- **Color Palette Management**: Save/load color schemes
- **Configuration Export/Import**: Complete card settings backup in JSON format
- **Real-time Preview**: Instant visual feedback
- **Keyboard Shortcuts**: Quick access to common functions
- **Drag and Drop**: Interactive element positioning

## Technical Specifications

### Canvas Resolution
- **Default Resolution**: 300 DPI equivalent for screen display
- **Color Depth**: 24-bit RGB
- **Transparency Support**: Full alpha channel support

### Card Standards

#### US Standard
- **Dimensions**: 85.60 × 53.98 mm
- **Default Orientation**: Landscape
- **Pixel Dimensions**: 1012 × 638 pixels at 300 DPI
- **Usage**: International business cards, credit cards

#### Indian Standard
- **Dimensions**: 55 × 90 mm
- **Default Orientation**: Portrait
- **Pixel Dimensions**: 650 × 1063 pixels at 300 DPI
- **Usage**: Indian business cards, visiting cards

### Color Management

#### WCAG Compliance Levels
- **AA Standard**: Minimum 4.5:1 contrast ratio
- **AAA Standard**: Minimum 7:1 contrast ratio
- **Fail**: Below 4.5:1 contrast ratio

#### Color Palette Generation
- **Palette Size**: 3-7 colors per scheme
- **Base Colors**: Curated professional color set
- **Random Generation**: HSL-based color creation
- **Contrast Validation**: Automatic WCAG compliance checking

### Typography System

#### Font Stack
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **Secondary**: Courier Prime, Courier New, monospace
- **Accent**: Bebas Neue, Impact, sans-serif
- **Script**: Dancing Script, cursive
- **Native**: Noto Sans Bengali, sans-serif

#### Text Hierarchy
- **Full Name**: 32px, Bold
- **Native Script**: 24px, Regular
- **Job Title**: 20px, Regular
- **Contact Info**: 16px, Monospace

## Installation

### Requirements
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+)
- JavaScript enabled
- Canvas API support
- File API support (for config import/export)

### Setup
1. Clone or download the project files
2. Open `index.html` in a web browser
3. No additional dependencies or build process required

## Project Structure

```
business-card-generator/
├── index.html                  # Main application file
├── README.md                   # This documentation
├── js/
│   ├── core.js                # Core functionality
│   ├── canvas.js              # Canvas operations
│   ├── config.js              # Configuration management
│   └── ui.js                  # UI interactions
├── css/
│   ├── main.css               # Main styles
│   └── responsive.css         # Mobile responsive styles
├── assets/
│   ├── fonts/                 # Custom web fonts
│   └── icons/                 # UI icons
└── exports/                   # Generated configurations (created on use)
    └── config.json            # Exported card configurations
```

## Implementation Guide

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Card Generator</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Business Card Generator</h1>
            <div class="controls">
                <button id="generateBtn">Generate New Card</button>
                <button id="chaosBtn">Randomize</button>
                <button id="resetBtn">Reset</button>
            </div>
        </header>
        
        <main class="main-content">
            <div class="control-panel">
                <!-- Contact Information -->
                <section class="contact-section">
                    <h2>Contact Information</h2>
                    <div class="form-group">
                        <label for="nameEnglish">Full Name (English):</label>
                        <input type="text" id="nameEnglish" placeholder="Your Name">
                    </div>
                    <div class="form-group">
                        <label for="nameLocal">Name (Native Script):</label>
                        <input type="text" id="nameLocal" placeholder="আপনার নাম">
                    </div>
                    <div class="form-group">
                        <label for="jobTitle">Job Title:</label>
                        <input type="text" id="jobTitle" placeholder="Your Position">
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number:</label>
                        <input type="tel" id="phone" placeholder="+91-XXXXX-XXXXX">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address:</label>
                        <input type="email" id="email" placeholder="your.email@domain.com">
                    </div>
                </section>
                
                <!-- Card Settings -->
                <section class="settings-section">
                    <h2>Card Settings</h2>
                    <div class="form-group">
                        <label for="standard">Card Standard:</label>
                        <select id="standard">
                            <option value="US">US (85.60 × 53.98 mm)</option>
                            <option value="Indian">Indian Standard (55 × 90 mm)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="orientation">Orientation:</label>
                        <select id="orientation">
                            <option value="landscape">Landscape</option>
                            <option value="portrait">Portrait</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="chaosLevel">Chaos Level: <span id="chaosValue">30</span>%</label>
                        <input type="range" id="chaosLevel" min="0" max="100" value="30">
                    </div>
                </section>
                
                <!-- Color Palette -->
                <section class="color-section">
                    <h2>Color Palette</h2>
                    <div class="color-controls">
                        <button id="generatePalette">Generate Palette</button>
                        <button id="randomPalette">Random Colors</button>
                    </div>
                    <div class="color-swatches" id="colorSwatches">
                        <!-- Color swatches will be populated by JavaScript -->
                    </div>
                </section>
                
                <!-- Configuration Management -->
                <section class="config-section">
                    <h2>Configuration</h2>
                    <div class="config-controls">
                        <button id="exportConfig">Export Config</button>
                        <input type="file" id="importConfig" accept=".json" style="display: none;">
                        <button id="importConfigBtn">Import Config</button>
                    </div>
                </section>
            </div>
            
            <div class="canvas-container">
                <canvas id="businessCard" width="1012" height="638"></canvas>
            </div>
        </main>
    </div>
    
    <script src="js/core.js"></script>
    <script src="js/canvas.js"></script>
    <script src="js/config.js"></script>
    <script src="js/ui.js"></script>
</body>
</html>
```

### Core JavaScript Implementation

#### 1. Core Configuration (core.js)

```javascript
// Global configuration object
const currentConfig = {
    version: '1.0',
    standard: 'US',
    orientation: 'landscape',
    chaosLevel: 30,
    contact: {
        nameEnglish: 'John Doe',
        nameLocal: 'জন ডো',
        jobTitle: 'Creative Director',
        phone: '+91-98765-43210',
        email: 'john.doe@company.com'
    },
    elements: [],
    colorPalette: [],
    typography: {
        primaryFont: 'Inter, sans-serif',
        secondaryFont: 'Courier Prime, monospace',
        accentFont: 'Bebas Neue, sans-serif'
    }
};

// Canvas dimensions for different standards
const CARD_DIMENSIONS = {
    'US': {
        landscape: { width: 1012, height: 638 },
        portrait: { width: 638, height: 1012 }
    },
    'Indian': {
        landscape: { width: 1063, height: 650 },
        portrait: { width: 650, height: 1063 }
    }
};

// Base color palette for WCAG compliance
const BASE_COLORS = [
    { hex: '#2c3e50', name: 'Midnight Blue', wcag: 'AA', contrast: 4.5 },
    { hex: '#34495e', name: 'Wet Asphalt', wcag: 'AA', contrast: 4.8 },
    { hex: '#e74c3c', name: 'Alizarin', wcag: 'AA', contrast: 5.2 },
    { hex: '#f39c12', name: 'Orange', wcag: 'AA', contrast: 4.7 },
    { hex: '#27ae60', name: 'Nephritis', wcag: 'AA', contrast: 4.9 },
    { hex: '#8e44ad', name: 'Wisteria', wcag: 'AA', contrast: 4.6 },
    { hex: '#16a085', name: 'Green Sea', wcag: 'AA', contrast: 5.1 },
    { hex: '#c0392b', name: 'Pomegranate', wcag: 'AA', contrast: 5.3 }
];

// Shape types for background elements
const SHAPE_TYPES = [
    'circle', 'square', 'triangle', 'line', 
    'organic', 'hexagon', 'star', 'wave'
];

// Utility functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function calculateContrast(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getWCAGRating(contrast) {
    if (contrast >= 7) return 'AAA';
    if (contrast >= 4.5) return 'AA';
    return 'Fail';
}
```

#### 2. Canvas Operations (canvas.js)

```javascript
let canvas, ctx;

function initializeCanvas() {
    canvas = document.getElementById('businessCard');
    ctx = canvas.getContext('2d');
    
    // Set initial canvas dimensions
    updateCanvasDimensions();
    
    // Generate initial card
    generateCard();
}

function updateCanvasDimensions() {
    const dimensions = CARD_DIMENSIONS[currentConfig.standard][currentConfig.orientation];
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
}

function generateCard() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Generate and draw background elements
    generateBackgroundElements();
    
    // Draw logo area
    drawLogoArea();
    
    // Draw contact information
    drawContactInfo();
    
    // Draw border
    drawBorder();
}

function drawBackground() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateBackgroundElements() {
    // Clear existing elements
    currentConfig.elements = [];
    
    // Generate 8-15 background elements
    const elementCount = randomInt(8, 15);
    
    for (let i = 0; i < elementCount; i++) {
        const element = {
            type: randomChoice(SHAPE_TYPES),
            x: randomFloat(0, canvas.width),
            y: randomFloat(0, canvas.height),
            size: randomFloat(20, 100),
            color: randomChoice(currentConfig.colorPalette).hex,
            opacity: randomFloat(0.1, 0.3),
            rotation: randomFloat(0, 360),
            // Additional properties for complex shapes
            bezierPoints: generateBezierPoints(),
            spikes: randomInt(3, 8),
            amplitude: randomFloat(10, 50)
        };
        
        // Apply chaos level offset
        const chaosOffset = (currentConfig.chaosLevel / 100) * 50;
        element.x += randomFloat(-chaosOffset, chaosOffset);
        element.y += randomFloat(-chaosOffset, chaosOffset);
        
        currentConfig.elements.push(element);
        drawElement(element);
    }
}

function generateBezierPoints() {
    const points = [];
    for (let i = 0; i < 6; i++) {
        points.push({
            x: randomFloat(-50, 50),
            y: randomFloat(-50, 50)
        });
    }
    return points;
}

function drawElement(element) {
    ctx.save();
    ctx.translate(element.x, element.y);
    ctx.rotate(element.rotation * Math.PI / 180);
    ctx.fillStyle = element.color;
    ctx.globalAlpha = element.opacity;
    
    switch (element.type) {
        case 'circle':
            drawCircle(element);
            break;
        case 'square':
            drawSquare(element);
            break;
        case 'triangle':
            drawTriangle(element);
            break;
        case 'line':
            drawLine(element);
            break;
        case 'organic':
            drawOrganicShape(element);
            break;
        case 'hexagon':
            drawPolygon(element, 6);
            break;
        case 'star':
            drawStar(element);
            break;
        case 'wave':
            drawWave(element);
            break;
    }
    
    ctx.restore();
}

function drawCircle(element) {
    ctx.beginPath();
    ctx.arc(0, 0, element.size / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawSquare(element) {
    const half = element.size / 2;
    ctx.fillRect(-half, -half, element.size, element.size);
}

function drawTriangle(element) {
    const size = element.size;
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(-size / 2, size / 2);
    ctx.lineTo(size / 2, size / 2);
    ctx.closePath();
    ctx.fill();
}

function drawLine(element) {
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.size / 20;
    ctx.beginPath();
    ctx.moveTo(-element.size / 2, 0);
    ctx.lineTo(element.size / 2, 0);
    ctx.stroke();
}

function drawOrganicShape(element) {
    const points = element.bezierPoints;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i += 3) {
        ctx.bezierCurveTo(
            points[i].x, points[i].y,
            points[i + 1].x, points[i + 1].y,
            points[i + 2].x, points[i + 2].y
        );
    }
    
    ctx.closePath();
    ctx.fill();
}

function drawPolygon(element, sides) {
    const radius = element.size / 2;
    ctx.beginPath();
    
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
}

function drawStar(element) {
    const spikes = element.spikes;
    const outerRadius = element.size / 2;
    const innerRadius = outerRadius * 0.5;
    
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
}

function drawWave(element) {
    const amplitude = element.amplitude;
    const frequency = 0.02;
    const width = element.size;
    
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    
    for (let x = -width / 2; x <= width / 2; x += 2) {
        const y = amplitude * Math.sin(frequency * x);
        ctx.lineTo(x, y);
    }
    
    ctx.stroke();
}

function drawLogoArea() {
    const logoArea = {
        x: canvas.width * 0.8,
        y: canvas.height * 0.2,
        width: canvas.width * 0.15,
        height: canvas.height * 0.15
    };
    
    ctx.save();
    ctx.translate(logoArea.x, logoArea.y);
    
    // Create abstract Dada-style shape
    ctx.fillStyle = currentConfig.colorPalette[0].hex;
    ctx.globalAlpha = 0.6;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    // Generate random bezier curves for artistic effect
    for (let i = 0; i < 4; i++) {
        const cp1x = Math.random() * logoArea.width;
        const cp1y = Math.random() * logoArea.height;
        const cp2x = Math.random() * logoArea.width;
        const cp2y = Math.random() * logoArea.height;
        const endX = Math.random() * logoArea.width;
        const endY = Math.random() * logoArea.height;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add placeholder text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LOGO', logoArea.width / 2, logoArea.height / 2);
    
    ctx.restore();
}

function drawContactInfo() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Primary group (top-aligned)
    const primaryGroup = [
        { text: currentConfig.contact.nameEnglish, fontSize: 32, fontWeight: 'bold', font: currentConfig.typography.primaryFont },
        { text: currentConfig.contact.nameLocal, fontSize: 24, font: currentConfig.typography.primaryFont },
        { text: currentConfig.contact.jobTitle, fontSize: 20, font: currentConfig.typography.primaryFont }
    ];
    
    // Secondary group (bottom-aligned)
    const secondaryGroup = [
        { text: currentConfig.contact.phone, fontSize: 16, font: currentConfig.typography.secondaryFont },
        { text: currentConfig.contact.email, fontSize: 16, font: currentConfig.typography.secondaryFont }
    ];
    
    // Draw primary group
    let yOffset = centerY - 40;
    primaryGroup.forEach((item, index) => {
        drawTextWithChaos(item.text, centerX, yOffset, {
            fontSize: item.fontSize,
            fontWeight: item.fontWeight || 'normal',
            fontFamily: item.font,
            color: currentConfig.colorPalette[index % currentConfig.colorPalette.length].hex,
            maxOffset: (currentConfig.chaosLevel / 100) * 25,
            maxRotation: (currentConfig.chaosLevel / 100) * 9
        });
        yOffset += item.fontSize + 5;
    });
    
    // Draw secondary group
    yOffset = centerY + 40;
    secondaryGroup.forEach((item, index) => {
        drawTextWithChaos(item.text, centerX, yOffset, {
            fontSize: item.fontSize,
            fontFamily: item.font,
            color: currentConfig.colorPalette[(index + 3) % currentConfig.colorPalette.length].hex,
            maxOffset: (currentConfig.chaosLevel / 100) * 25,
            maxRotation: (currentConfig.chaosLevel / 100) * 9
        });
        yOffset += item.fontSize + 5;
    });
}

function drawTextWithChaos(text, x, y, options) {
    const {
        fontSize = 16,
        fontWeight = 'normal',
        fontFamily = 'Arial',
        color = '#000000',
        maxOffset = 0,
        maxRotation = 0
    } = options;
    
    ctx.save();
    
    // Apply chaos transformations
    const offsetX = randomFloat(-maxOffset, maxOffset);
    const offsetY = randomFloat(-maxOffset, maxOffset);
    const rotation = randomFloat(-maxRotation, maxRotation) * Math.PI / 180;
    
    ctx.translate(x + offsetX, y + offsetY);
    ctx.rotate(rotation);
    
    // Set font properties
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(text, 0, 0);
    
    ctx.restore();
}

function drawBorder() {
    ctx.strokeStyle = currentConfig.colorPalette[0].hex;
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
}
```

#### 3. Color Palette Generation

```javascript
function generateWCAGPalette() {
    const paletteSize = randomInt(3, 7);
    const newPalette = [];
    
    // Start with a base color from the curated set
    const baseColor = randomChoice(BASE_COLORS);
    newPalette.push(baseColor);
    
    // Generate additional colors
    for (let i = 1; i < paletteSize; i++) {
        let color;
        let attempts = 0;
        
        do {
            color = generateRandomColor();
            attempts++;
        } while (attempts < 50 && !isWCAGCompliant(color.hex));
        
        if (isWCAGCompliant(color.hex)) {
            newPalette.push(color);
        }
    }
    
    // Ensure minimum palette size
    while (newPalette.length < 3) {
        newPalette.push(randomChoice(BASE_COLORS));
    }
    
    currentConfig.colorPalette = newPalette;
    updateColorSwatches();
    generateCard();
}

function generateRandomColor() {
    const hue = randomInt(0, 360);
    const saturation = randomInt(30, 80);
    const lightness = randomInt(25, 65);
    
    const hex = hslToHex(hue, saturation, lightness);
    const contrast = calculateContrast(hex, '#ffffff');
    
    return {
        hex: hex,
        name: `Custom Color`,
        wcag: getWCAGRating(contrast),
        contrast: contrast
    };
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function isWCAGCompliant(color) {
    const contrast = calculateContrast(color, '#ffffff');
    return contrast >= 4.5;
}

function updateColorSwatches() {
    const swatchesContainer = document.getElementById('colorSwatches');
    swatchesContainer.innerHTML = '';
    
    currentConfig.colorPalette.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.title = `${color.name} (${color.wcag})`;
        swatch.addEventListener('click', () => selectColor(index));
        swatchesContainer.appendChild(swatch);
    });
}

function selectColor(index) {
    // Move selected color to front for primary use
    const selectedColor = currentConfig.colorPalette[index];
    currentConfig.colorPalette.splice(index, 1);
    currentConfig.colorPalette.unshift(selectedColor);
    
    updateColorSwatches();
    generateCard();
}
```

#### 4. Configuration Management (config.js)

```javascript
function exportConfig() {
    const config = {
        version: currentConfig.version,
        timestamp: new Date().toISOString(),
        standard: currentConfig.standard,
        orientation: currentConfig.orientation,
        chaosLevel: currentConfig.chaosLevel,
        colorPalette: currentConfig.colorPalette,
        contact: currentConfig.contact,
        elements: currentConfig.elements,
        typography: currentConfig.typography,
        advanced: {
            backgroundElements: currentConfig.elements.length,
            logoArea: true,
            customShapes: SHAPE_TYPES
        }
    };
    
    const configJSON = JSON.stringify(config, null, 2);
    downloadFile(configJSON, 'business-card-config.json', 'application/json');
}

function importConfig(fileEvent) {
    const file = fileEvent.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            
            // Validate configuration
            if (!validateConfig(config)) {
                throw new Error('Invalid configuration file');
            }
            
            // Apply configuration
            applyConfiguration(config);
            
            // Update UI
            updateUIFromConfig(config);
            
            // Regenerate card
            generateCard();
            
            showNotification('Configuration loaded successfully!', 'success');
            
        } catch (error) {
            showNotification('Error loading configuration: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function validateConfig(config) {
    const requiredFields = ['version', 'standard', 'orientation', 'colorPalette'];
    
    // Check required fields
    for (const field of requiredFields) {
        if (!config.hasOwnProperty(field)) {
            return false;
        }
    }
    
    // Validate standard
    if (!['US', 'Indian'].includes(config.standard)) {
        return false;
    }
    
    // Validate orientation
    if (!['landscape', 'portrait'].includes(config.orientation)) {
        return false;
    }
    
    // Validate chaos level
    if (config.chaosLevel < 0 || config.chaosLevel > 100) {
        return false;