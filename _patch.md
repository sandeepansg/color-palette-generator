# Business Card Generator - Completion Guide

## Current Status
The monolithic HTML file is 50% complete. Canvas setup, partial shape drawing, and contact info rendering are partially implemented. The file cuts off at `drawTextGroup()` function.

## Missing Critical Functions

### 1. Text Rendering System
**Status**: Partially implemented - needs completion

```javascript
function drawTextGroup(textItems, centerX, centerY) {
    let yOffset = 0;
    textItems.forEach((item, index) => {
        if (item.text) {
            const chaosX = randomFloat(-chaosOffset, chaosOffset);
            const chaosY = randomFloat(-chaosOffset/2, chaosOffset/2);
            
            ctx.save();
            ctx.font = `${item.fontWeight} ${item.fontSize}px ${item.font}`;
            ctx.fillStyle = currentConfig.colorPalette[0].hex;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillText(item.text, centerX + chaosX, centerY + yOffset + chaosY);
            ctx.restore();
            
            yOffset += item.fontSize + 10;
        }
    });
}
```

### 2. Logo Area Implementation
**Status**: Missing - needs complete implementation

```javascript
function drawLogoArea() {
    const logoSize = Math.min(canvas.width, canvas.height) * 0.15;
    const logoX = canvas.width * 0.85 - logoSize/2;
    const logoY = canvas.height * 0.15;
    
    ctx.save();
    ctx.translate(logoX, logoY);
    ctx.fillStyle = currentConfig.colorPalette[1].hex;
    ctx.globalAlpha = 0.7;
    
    // Create abstract geometric logo
    drawHexagon({ size: logoSize, x: 0, y: 0 });
    
    ctx.restore();
}
```

### 3. Border Drawing
**Status**: Missing

```javascript
function drawBorder() {
    ctx.strokeStyle = currentConfig.colorPalette[0].hex;
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
}
```

### 4. Event Handlers System
**Status**: Missing - critical for interactivity

```javascript
function setupEventListeners() {
    // Input field updates
    ['nameEnglish', 'nameLocal', 'jobTitle', 'phone', 'email'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            currentConfig.contact[id] = e.target.value;
            generateCard();
        });
    });
    
    // Control buttons
    document.getElementById('generateBtn').addEventListener('click', generateCard);
    document.getElementById('chaosBtn').addEventListener('click', () => {
        currentConfig.chaosLevel = randomInt(0, 100);
        document.getElementById('chaosLevel').value = currentConfig.chaosLevel;
        generateCard();
    });
    
    // Settings updates
    document.getElementById('standard').addEventListener('change', (e) => {
        currentConfig.standard = e.target.value;
        updateCanvasDimensions();
        generateCard();
    });
    
    document.getElementById('orientation').addEventListener('change', (e) => {
        currentConfig.orientation = e.target.value;
        updateCanvasDimensions();
        generateCard();
    });
    
    document.getElementById('chaosLevel').addEventListener('input', (e) => {
        currentConfig.chaosLevel = parseInt(e.target.value);
        generateCard();
    });
}
```

### 5. Color Palette Functions
**Status**: Partially implemented - needs completion

```javascript
function updateColorSwatches() {
    const container = document.getElementById('colorSwatches');
    container.innerHTML = '';
    
    currentConfig.colorPalette.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.title = `${color.name} (${color.wcag})`;
        
        swatch.addEventListener('click', () => {
            // Color picker integration would go here
            console.log('Color selected:', color.hex);
        });
        
        container.appendChild(swatch);
    });
}
```

### 6. Keyboard Shortcuts
**Status**: Missing

```javascript
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'g':
                    e.preventDefault();
                    generateCard();
                    break;
                case 'r':
                    e.preventDefault();
                    generateWCAGPalette();
                    break;
                case ' ':
                    e.preventDefault();
                    document.getElementById('chaosBtn').click();
                    break;
            }
        }
    });
}
```

### 7. Drag and Drop System
**Status**: Missing - low priority

```javascript
function setupDragAndDrop() {
    let isDragging = false;
    let dragElement = null;
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Simple element selection (placeholder)
        const element = currentConfig.elements.find(el => 
            Math.abs(el.x - x) < 50 && Math.abs(el.y - y) < 50
        );
        
        if (element) {
            isDragging = true;
            dragElement = element;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && dragElement) {
            const rect = canvas.getBoundingClientRect();
            dragElement.x = e.clientX - rect.left;
            dragElement.y = e.clientY - rect.top;
            generateCard();
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        dragElement = null;
    });
}
```

## Required Additions to HTML

### 1. Missing HTML Elements
Add before closing `</main>`:
```html
<div class="export-section">
    <h2>Export Options</h2>
    <button id="exportPng">Export PNG</button>
    <button id="exportConfig">Save Config</button>
    <input type="file" id="importConfig" accept=".json" style="display:none">
    <button onclick="document.getElementById('importConfig').click()">Load Config</button>
</div>
```

### 2. Missing CSS Classes
Add to styles:
```css
.color-swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 8px;
    margin-top: 10px;
}

.color-swatch {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid #e0e0e0;
    transition: transform 0.2s ease;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.export-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}
```

## Completion Checklist

### High Priority (Must Complete)
- [ ] Complete `drawTextGroup()` function
- [ ] Implement `drawLogoArea()` function  
- [ ] Add `drawBorder()` function
- [ ] Complete `setupEventListeners()` function
- [ ] Implement `updateColorSwatches()` function
- [ ] Add missing HTML elements for export section
- [ ] Complete initialization in `window.onload`

### Medium Priority (Should Complete)
- [ ] Add `setupKeyboardShortcuts()` function
- [ ] Implement basic drag and drop for elements
- [ ] Add PNG export functionality
- [ ] Create config save/load system
- [ ] Add chaos level display value
- [ ] Implement color palette generation buttons

### Low Priority (Nice to Have)
- [ ] Add notification system for user feedback
- [ ] Implement advanced color picker
- [ ] Add mobile touch support
- [ ] Create shape selection interface
- [ ] Add undo/redo functionality

## Missing Utility Functions

```javascript
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function calculateContrast(color1, color2) {
    // Basic contrast calculation
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const lum1 = (rgb1.r * 0.299 + rgb1.g * 0.587 + rgb1.b * 0.114) / 255;
    const lum2 = (rgb2.r * 0.299 + rgb2.g * 0.587 + rgb2.b * 0.114) / 255;
    
    return Math.max(lum1, lum2) / Math.min(lum1, lum2);
}

function isWCAGCompliant(color) {
    return calculateContrast(color, '#ffffff') >= 4.5;
}
```

## Critical Fixes Needed

1. **Complete the cut-off function**: The `drawTextGroup()` function is incomplete
2. **Window initialization**: Add `window.onload = initializeCanvas;` at the end
3. **Color palette initialization**: Ensure `generateWCAGPalette()` runs on load
4. **Export functionality**: Implement basic PNG export using `canvas.toDataURL()`
5. **Form validation**: Add basic input validation for email and phone fields

## Testing Requirements

- Canvas renders properly on page load
- All shape types draw correctly
- Text doesn't overlap with background elements
- Color palette generates WCAG-compliant colors
- Controls respond to user input
- Chaos level affects randomization appropriately

## Performance Considerations

- Limit background elements to prevent lag
- Use `requestAnimationFrame` for smooth updates
- Implement basic collision detection for text placement
- Optimize canvas redraws to avoid unnecessary operations

The completion should result in a fully functional business card generator with professional output and interactive controls.