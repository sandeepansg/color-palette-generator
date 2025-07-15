# Business Card Generator

A sophisticated web-based business card generator that creates professional, customizable business cards with WCAG-compliant color schemes and support for international standards.

## Features

### Core Functionality
- **Multi-Standard Support**: ISO (85.60 × 53.98 mm) and Indian Standard (55 × 90 mm)
- **Dual Orientation**: Landscape and Portrait modes for both standards
- **WCAG Compliance**: Automatic color contrast validation for accessibility
- **Export Options**: PNG, SVG, and PDF formats with customizable DPI
- **Responsive Design**: Mobile-friendly interface with touch support

### Design Elements
- **Chaos Level Control**: Adjustable randomization from 0-100%
- **Dynamic Color Palettes**: Programmatically generated WCAG-compliant color schemes
- **Geometric Shapes**: Circle, square, triangle, line, and organic shapes
- **Typography**: Support for English and native script (Bengali/Devanagari)
- **Company Logo Area**: Dedicated Dada-styled shape for logo placement
- **Card Border**: Professional border with transparent background export

### Advanced Features
- **Smart Layout**: Grouped contact information with subtle random rotation
- **Color Palette Management**: Save/load color schemes
- **Configuration Export/Import**: Complete card settings backup
- **Real-time Preview**: Instant visual feedback
- **Keyboard Shortcuts**: Quick access to common functions

## Technical Specifications

### Canvas Resolution
- **Default DPI**: 300 DPI for standard quality
- **Export Options**: 300, 600, 1200 DPI
- **Color Depth**: 24-bit RGB
- **Format Support**: PNG (transparent), SVG (vector), PDF (print-ready)

### Card Standards

#### ISO Standard
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
- **Contrast Validation**: Automatic WCAG compliance checking, only between two adjacent or overlapping visual assets on the card

### Layout System

#### Contact Information Grouping
1. **Primary Group** (Top-aligned):
   - Full Name (English)
   - Name in Native Script
   - Job Title

2. **Secondary Group** (Bottom-aligned):
   - Phone Number
   - Email Address

#### Element Positioning
- **Chaos Level 0%**: Perfectly aligned elements
- **Chaos Level 50%**: Moderate randomization
- **Chaos Level 100%**: Maximum creative disorder
- **Text Rotation**: ±9° maximum per chaos level
- **Position Variance**: 25% of canvas dimensions maximum

### Typography

#### Font Stack
- **Primary**: Inter (Sans-serif)
- **Secondary**: Courier Prime (Monospace)
- **Accent**: Bebas Neue (Display)

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
- Local file system access (for import/export)

### Setup
1. Clone or download the project files
2. Open `index.html` in a web browser
3. No additional dependencies or build process required

## Usage

### Basic Operation

#### 1. Initial Setup
- Application launches with precalculated WCAG-compliant palette
- Default card uses ISO standard in landscape orientation
- Contact information pre-filled with sample data

#### 2. Contact Information
```javascript
// Update contact fields
document.getElementById('nameEnglish').value = 'Your Name';
document.getElementById('nameLocal').value = 'আপনার নাম';
document.getElementById('jobTitle').value = 'Your Title';
document.getElementById('phone').value = '+91-XXXXX-XXXXX';
document.getElementById('email').value = 'your.email@domain.com';
```

#### 3. Card Configuration
- **Standard Selection**: Choose between ISO-7810 and Indian standards
- **Orientation Toggle**: Switch between landscape and portrait
- **Chaos Level**: Adjust randomization (0-100%)

#### 4. Color Management
- **Generate Palette**: Create new WCAG-compliant color scheme
- **Random Palette**: Generate random colors with compliance validation
- **Manual Selection**: Click color swatches to select primary color

### Advanced Features

#### Export Options
```javascript
// Export formats
exportCard('png');  // Transparent PNG
exportCard('svg');  // Vector SVG
exportCard('pdf');  // Print-ready PDF
```

#### Configuration Management
```javascript
// Save current configuration
exportConfig();

// Load saved configuration
importConfig(fileEvent);
```

#### Keyboard Shortcuts
- **Ctrl/Cmd + G**: Generate new card
- **Ctrl/Cmd + R**: Randomize layout
- **Ctrl/Cmd + S**: Export as PNG

### Color Palette System

#### Precalculated Palette
```javascript
const basePalette = [
    { hex: '#2c3e50', wcag: 'AA', contrast: 4.5 },
    { hex: '#34495e', wcag: 'AA', contrast: 4.8 },
    { hex: '#e74c3c', wcag: 'AA', contrast: 5.2 },
    { hex: '#f39c12', wcag: 'AA', contrast: 4.7 },
    { hex: '#27ae60', wcag: 'AA', contrast: 4.9 }
];
```

#### Random Generation Algorithm
1. Generate HSL values within acceptable ranges
2. Convert to RGB/HEX format
3. Calculate contrast ratios against white background
4. Validate WCAG compliance
5. Adjust lightness/saturation if needed

#### Color Assignment Logic
- **Background Elements**: Use palette colors with 30-70% opacity
- **Text Elements**: Rotate through palette for groupings
- **Logo Area**: Use complementary color from palette
- **Border**: Use darkest color from palette

## API Reference

### Core Functions

#### Card Generation
```javascript
generateCard()
// Generates new card with current settings
// Updates canvas with all elements
// Applies chaos level to positioning

generateChaos()
// Randomizes chaos level (20-100%)
// Regenerates card with new settings
// Updates UI controls

resetCard()
// Resets chaos level to 30%
// Maintains current palette and contact info
// Regenerates card with default settings
```

#### Color Management
```javascript
generateWCAGPalette()
// Creates 3-7 colors with WCAG compliance
// Uses curated base color set
// Updates color swatches display

generateRandomPalette()
// Creates random HSL-based colors
// Validates WCAG compliance
// Regenerates card with new colors

selectColor(index)
// Selects color from current palette
// Updates primary color selection
// Regenerates card elements
```

#### Export Functions
```javascript
exportCard(format)
// Formats: 'png', 'svg', 'pdf'
// Respects DPI settings
// Handles transparency for PNG/SVG

exportColorPalette()
// Exports current color scheme as JSON
// Includes WCAG compliance data
// Timestamped for version control

exportConfig()
// Exports complete card configuration
// Includes all settings and preferences
// Version-tagged for compatibility
```

### Configuration Object
```javascript
const currentConfig = {
    standard: 'ISO-7810',           // Card standard
    orientation: 'landscape',        // Card orientation
    chaosLevel: 30,                 // Randomization level (0-100)
    colors: [                       // WCAG-compliant palette
        { hex: '#2c3e50', wcag: 'AA', contrast: 4.5 }
    ],
    contact: {                      // Contact information
        nameEnglish: 'Full Name',
        nameLocal: 'Native Script',
        jobTitle: 'Job Title',
        phone: 'Phone Number',
        email: 'Email Address'
    },
    elements: []                    // Generated design elements
};
```

## File Structure

```
business-card-generator/
├── index.html              # Main application file
├── README.md              # This documentation
├── assets/               # Static assets (if any)
│   ├── logo-placeholder.svg
│   └── fonts/
└── exports/              # Generated exports (created on use)
    ├── business-card.png
    ├── business-card.svg
    ├── business-card.pdf
    └── config.json
```

## Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 60+ | Full Support |
| Firefox | 55+ | Full Support |
| Safari | 12+ | Full Support |
| Edge | 79+ | Full Support |
| Mobile Safari | 12+ | Full Support |
| Chrome Mobile | 60+ | Full Support |

## Performance Considerations

### Canvas Optimization
- **Rendering**: 60fps target for smooth interactions
- **Memory**: Efficient canvas context management
- **Scaling**: Responsive canvas sizing for different devices

### Export Performance
- **High DPI**: Separate canvas for export quality
- **Large Files**: Streaming for PDF generation
- **Memory Management**: Cleanup of temporary canvases

## Accessibility Features

### WCAG Compliance
- **Color Contrast**: Automated validation and adjustment
- **Text Size**: Minimum 16px for contact information
- **Focus Indicators**: Keyboard navigation support
- **Screen Reader**: Semantic HTML structure

### International Support
- **Unicode**: Full UTF-8 character support
- **RTL Support**: Right-to-left text rendering capability
- **Font Fallbacks**: System font alternatives for native scripts

## Development Guidelines

### Code Structure
- **Modular Functions**: Single responsibility principle
- **Error Handling**: Comprehensive try-catch blocks
- **Documentation**: Inline comments for complex algorithms
- **Testing**: Manual testing across different browsers

### Contributing
1. Fork the repository
2. Create feature branch
3. Test across browsers
4. Submit pull request with documentation

## Known Limitations

1. **PDF Export**: Simple implementation, may not support all features
2. **Font Loading**: Depends on system fonts for native scripts
3. **SVG Text**: Limited font embedding in SVG exports
4. **Mobile Performance**: May be slower on older devices

## Future Enhancements

### Planned Features
- **QR Code Integration**: Automatic QR code generation
- **Template System**: Pre-designed card templates
- **Cloud Storage**: Save/sync configurations online
- **Batch Processing**: Generate multiple cards at once
- **Advanced Typography**: Custom font upload support

### Technical Improvements
- **WebGL Rendering**: Hardware acceleration for complex designs
- **Worker Threads**: Background processing for exports
- **PWA Support**: Offline functionality
- **Print API**: Direct printing without export

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please refer to the project documentation or create an issue in the project repository.

---

*Generated with Business Card Generator v1.0*