# Dadaist Business Card Generator - Technical Specification

## Overview
A modern web application for generating printer-friendly business cards with Dadaist design elements. The cards feature minimal color palettes with WCAG compliance checking and creative layouts while maintaining readability.

## Core Features

### 1. Card Design System
- **Background**: White/transparent for printer compatibility
- **Colors**: 3-7 color palette with flat/textured appearance
- **Typography**: Legible but creatively positioned text elements
- **Layout**: Misaligned elements following Dadaist principles while maintaining readability

### 2. Standard Card Formats
- **ISO-7810/ID-1**: 85.60 × 53.98 mm (standard business card)
- **Indian Standard**: 55 × 90 mm
- **Orientation**: Portrait/Landscape toggle

### 3. Contact Information Management
- Primary name field (English/Latin characters)
- Secondary name field (Bengali/local script)
- Job title
- Phone number
- Email address
- Dynamic positioning with controlled chaos

### 4. Color Palette System
- **Palette Size**: Minimum 3, maximum 7 colors
- **WCAG Compliance**: Only checked for overlapping/intersecting elements
- **Color Generation**: Random and curated palette options
- **Display**: Color swatches with hex values
- **Background Handling**: No background color compliance (white/transparent)

### 5. Chaos Control System
- **Chaos Level**: 0-100% slider controlling randomness
- **Element Positioning**: Controlled misalignment
- **Rotation**: Subtle text and shape rotation
- **Texture**: Optional texture overlay

### 6. Export Functionality
- **Formats**: PNG, PDF, SVG
- **Resolution**: 300, 600, 1200 DPI options
- **Print Ready**: Optimized for professional printing

### 7. Configuration Management
- **Export Config**: Save current settings as JSON
- **Import Config**: Load previously saved configurations
- **Palette Export**: Export color palettes separately

## Technical Implementation

### Canvas System
- HTML5 Canvas for rendering
- Only use modern and stable web frameworks and standards that are released uoder open-source licenses
- High-DPI support with scaling
- Responsive design for mobile/desktop
- Touch interaction support

### Color Management
- HSL to Hex conversion
- Contrast ratio calculations
- WCAG 2.1 compliance checking for neighbouring elements
- Luminance calculations

### Typography System
- Only use fonts that are released under open source licenses
- Multiple font families (Inter, Courier Prime, Bebas Neue)
- Dynamic font sizing
- Text rotation and positioning
- Multi-language support

### Shape Generation
- Geometric shapes (circles, squares, triangles)
- Organic/abstract shapes
- Controlled randomness
- Texture generation

### Mobile Optimization
- Touch event handling
- Orientation change detection
- Responsive layout
- Performance optimization

## User Interface Components

### Main Canvas Area
- Card preview with real-time updates
- Zoom and pan functionality
- Touch interaction for mobile

### Control Panel
- Chaos level slider
- Card standard selection
- Orientation toggle
- Generate/Reset buttons

### Contact Information Panel
- Text input fields for all contact details
- Real-time preview updates
- Validation for email/phone formats

### Color Palette Panel
- Color swatch grid
- WCAG compliance indicators
- Palette generation controls
- Color selection interface

### Export Panel
- Format selection (PNG/PDF/SVG)
- DPI/quality settings
- Export buttons
- Configuration save/load

## Default Configuration

### Contact Information
- **Name**: Sandeepan Sengupta
- **Name (Bengali)**: সন্দীপন (smaller font, underneath)
- **Job Title**: Imposter
- **Phone**: +91-72785-93964
- **Email**: mail@sandeepan.net

### Design Settings
- **Chaos Level**: 30%
- **Orientation**: Landscape
- **Standard**: ISO-7810
- **Color Palette**: 5 colors maximum
- **Background**: White

## Performance Considerations

### Canvas Optimization
- Efficient redraw mechanisms
- Memory management for high-DPI exports
- Debounced input handling

### Mobile Performance
- Touch event optimization
- Reduced animation complexity
- Efficient resize handling

## Accessibility Features

### WCAG Compliance
- Color contrast checking
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Responsive Design
- Mobile-first approach
- Flexible layout system
- Touch-friendly controls
- Orientation handling

## Technical Stack

### Frontend
- HTML5 Canvas API
- CSS3 with custom properties
- Vanilla JavaScript (ES6+)
- Web Fonts API

### Libraries
- No external dependencies
- Pure JavaScript implementation
- Browser-native APIs only

## File Structure

```
dadaist-card-generator/
├── index.html (monolithic implementation)
├── README.md
└── assets/
    ├── fonts/
    └── icons/
```

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Advanced Features
- Custom shape uploads
- Advanced typography controls
- Batch card generation
- Template system

### Integration Options
- API for automated generation
- CMS integration
- Print service integration
- Cloud storage support

## Testing Requirements

### Unit Tests
- Color calculation functions
- Canvas rendering accuracy
- Configuration save/load
- Export functionality

### Integration Tests
- Cross-browser compatibility
- Mobile device testing
- Print quality validation
- Performance benchmarking

## Security Considerations

### Data Handling
- No server-side data storage
- Client-side only processing
- No external API calls
- Local storage for preferences

### Input Validation
- Sanitized text inputs
- File upload validation
- Configuration import validation
- Error handling

## Deployment

### Static Hosting
- CDN compatible
- No server requirements
- Progressive Web App capabilities
- Offline functionality potential

This specification provides a comprehensive guide for implementing a modern, printer-friendly Dadaist business card generator with professional features and creative design elements.