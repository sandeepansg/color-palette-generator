/**
 * Color Parser Module
 * File: src/color/color-parser.js
 * Handles HTML color name to hex conversion and color space operations
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class ColorParser {
  constructor() {
    this.htmlColors = new Map();
    this.initialized = false;
    this.initializeHTMLColors();
  }

  /**
   * Initialize HTML color names mapping
   */
  initializeHTMLColors() {
    const colors = {
      'aliceblue': '#F0F8FF', 'antiquewhite': '#FAEBD7', 'aqua': '#00FFFF',
      'aquamarine': '#7FFFD4', 'azure': '#F0FFFF', 'beige': '#F5F5DC',
      'bisque': '#FFE4C4', 'black': '#000000', 'blanchedalmond': '#FFEBCD',
      'blue': '#0000FF', 'blueviolet': '#8A2BE2', 'brown': '#A52A2A',
      'burlywood': '#DEB887', 'cadetblue': '#5F9EA0', 'chartreuse': '#7FFF00',
      'chocolate': '#D2691E', 'coral': '#FF7F50', 'cornflowerblue': '#6495ED',
      'cornsilk': '#FFF8DC', 'crimson': '#DC143C', 'cyan': '#00FFFF',
      'darkblue': '#00008B', 'darkcyan': '#008B8B', 'darkgoldenrod': '#B8860B',
      'darkgray': '#A9A9A9', 'darkgreen': '#006400', 'darkgrey': '#A9A9A9',
      'darkkhaki': '#BDB76B', 'darkmagenta': '#8B008B', 'darkolivegreen': '#556B2F',
      'darkorange': '#FF8C00', 'darkorchid': '#9932CC', 'darkred': '#8B0000',
      'darksalmon': '#E9967A', 'darkseagreen': '#8FBC8F', 'darkslateblue': '#483D8B',
      'darkslategray': '#2F4F4F', 'darkslategrey': '#2F4F4F', 'darkturquoise': '#00CED1',
      'darkviolet': '#9400D3', 'deeppink': '#FF1493', 'deepskyblue': '#00BFFF',
      'dimgray': '#696969', 'dimgrey': '#696969', 'dodgerblue': '#1E90FF',
      'firebrick': '#B22222', 'floralwhite': '#FFFAF0', 'forestgreen': '#228B22',
      'fuchsia': '#FF00FF', 'gainsboro': '#DCDCDC', 'ghostwhite': '#F8F8FF',
      'gold': '#FFD700', 'goldenrod': '#DAA520', 'gray': '#808080',
      'green': '#008000', 'greenyellow': '#ADFF2F', 'grey': '#808080',
      'honeydew': '#F0FFF0', 'hotpink': '#FF69B4', 'indianred': '#CD5C5C',
      'indigo': '#4B0082', 'ivory': '#FFFFF0', 'khaki': '#F0E68C',
      'lavender': '#E6E6FA', 'lavenderblush': '#FFF0F5', 'lawngreen': '#7CFC00',
      'lemonchiffon': '#FFFACD', 'lightblue': '#ADD8E6', 'lightcoral': '#F08080',
      'lightcyan': '#E0FFFF', 'lightgoldenrodyellow': '#FAFAD2', 'lightgray': '#D3D3D3',
      'lightgreen': '#90EE90', 'lightgrey': '#D3D3D3', 'lightpink': '#FFB6C1',
      'lightsalmon': '#FFA07A', 'lightseagreen': '#20B2AA', 'lightskyblue': '#87CEFA',
      'lightslategray': '#778899', 'lightslategrey': '#778899', 'lightsteelblue': '#B0C4DE',
      'lightyellow': '#FFFFE0', 'lime': '#00FF00', 'limegreen': '#32CD32',
      'linen': '#FAF0E6', 'magenta': '#FF00FF', 'maroon': '#800000',
      'mediumaquamarine': '#66CDAA', 'mediumblue': '#0000CD', 'mediumorchid': '#BA55D3',
      'mediumpurple': '#9370DB', 'mediumseagreen': '#3CB371', 'mediumslateblue': '#7B68EE',
      'mediumspringgreen': '#00FA9A', 'mediumturquoise': '#48D1CC', 'mediumvioletred': '#C71585',
      'midnightblue': '#191970', 'mintcream': '#F5FFFA', 'mistyrose': '#FFE4E1',
      'moccasin': '#FFE4B5', 'navajowhite': '#FFDEAD', 'navy': '#000080',
      'oldlace': '#FDF5E6', 'olive': '#808000', 'olivedrab': '#6B8E23',
      'orange': '#FFA500', 'orangered': '#FF4500', 'orchid': '#DA70D6',
      'palegoldenrod': '#EEE8AA', 'palegreen': '#98FB98', 'paleturquoise': '#AFEEEE',
      'palevioletred': '#DB7093', 'papayawhip': '#FFEFD5', 'peachpuff': '#FFDAB9',
      'peru': '#CD853F', 'pink': '#FFC0CB', 'plum': '#DDA0DD',
      'powderblue': '#B0E0E6', 'purple': '#800080', 'red': '#FF0000',
      'rosybrown': '#BC8F8F', 'royalblue': '#4169E1', 'saddlebrown': '#8B4513',
      'salmon': '#FA8072', 'sandybrown': '#F4A460', 'seagreen': '#2E8B57',
      'seashell': '#FFF5EE', 'sienna': '#A0522D', 'silver': '#C0C0C0',
      'skyblue': '#87CEEB', 'slateblue': '#6A5ACD', 'slategray': '#708090',
      'slategrey': '#708090', 'snow': '#FFFAFA', 'springgreen': '#00FF7F',
      'steelblue': '#4682B4', 'tan': '#D2B48C', 'teal': '#008080',
      'thistle': '#D8BFD8', 'tomato': '#FF6347', 'turquoise': '#40E0D0',
      'violet': '#EE82EE', 'wheat': '#F5DEB3', 'white': '#FFFFFF',
      'whitesmoke': '#F5F5F5', 'yellow': '#FFFF00', 'yellowgreen': '#9ACD32'
    };

    // Store unique hex values only
    const uniqueHexValues = new Set();
    
    Object.entries(colors).forEach(([name, hex]) => {
      const normalizedHex = hex.toUpperCase();
      if (!uniqueHexValues.has(normalizedHex)) {
        this.htmlColors.set(name.toLowerCase(), normalizedHex);
        uniqueHexValues.add(normalizedHex);
      }
    });

    this.initialized = true;
  }

  /**
   * Convert HTML color name to hex
   * @param {string} colorName - HTML color name
   * @returns {string|null} - Hex color value or null if not found
   */
  htmlToHex(colorName) {
    if (!this.initialized) {
      this.initializeHTMLColors();
    }
    
    const normalizedName = colorName.toLowerCase().replace(/\s/g, '');
    return this.htmlColors.get(normalizedName) || null;
  }

  /**
   * Get all HTML color names
   * @returns {string[]} - Array of color names
   */
  getAllColorNames() {
    if (!this.initialized) {
      this.initializeHTMLColors();
    }
    
    return Array.from(this.htmlColors.keys());
  }

  /**
   * Get all unique hex values
   * @returns {string[]} - Array of unique hex values
   */
  getAllHexValues() {
    if (!this.initialized) {
      this.initializeHTMLColors();
    }
    
    return Array.from(this.htmlColors.values());
  }

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color value
   * @returns {Object} - RGB object {r, g, b}
   */
  hexToRgb(hex) {
    const normalizedHex = hex.replace('#', '');
    
    if (normalizedHex.length === 3) {
      // Convert 3-digit hex to 6-digit
      const r = parseInt(normalizedHex[0] + normalizedHex[0], 16);
      const g = parseInt(normalizedHex[1] + normalizedHex[1], 16);
      const b = parseInt(normalizedHex[2] + normalizedHex[2], 16);
      return { r, g, b };
    } else if (normalizedHex.length === 6) {
      const r = parseInt(normalizedHex.substring(0, 2), 16);
      const g = parseInt(normalizedHex.substring(2, 4), 16);
      const b = parseInt(normalizedHex.substring(4, 6), 16);
      return { r, g, b };
    }
    
    throw new Error(`Invalid hex color: ${hex}`);
  }

  /**
   * Convert RGB to hex
   * @param {number} r - Red component (0-255)
   * @param {number} g - Green component (0-255)
   * @param {number} b - Blue component (0-255)
   * @returns {string} - Hex color value
   */
  rgbToHex(r, g, b) {
    const toHex = (component) => {
      const hex = Math.round(Math.max(0, Math.min(255, component))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  /**
   * Convert RGB to relative luminance
   * @param {Object} rgb - RGB object {r, g, b}
   * @returns {number} - Relative luminance (0-1)
   */
  rgbToLuminance(rgb) {
    const { r, g, b } = rgb;
    
    // Convert to sRGB
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    // Apply gamma correction
    const gamma = (component) => {
      return component <= 0.03928 
        ? component / 12.92 
        : Math.pow((component + 0.055) / 1.055, 2.4);
    };
    
    const rLinear = gamma(rsRGB);
    const gLinear = gamma(gsRGB);
    const bLinear = gamma(bsRGB);
    
    // Calculate relative luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * Convert hex to relative luminance
   * @param {string} hex - Hex color value
   * @returns {number} - Relative luminance (0-1)
   */
  hexToLuminance(hex) {
    const rgb = this.hexToRgb(hex);
    return this.rgbToLuminance(rgb);
  }

  /**
   * Validate hex color format
   * @param {string} hex - Hex color value
   * @returns {boolean} - Whether hex is valid
   */
  isValidHex(hex) {
    const hexRegex = /^#?[0-9A-Fa-f]{3}$|^#?[0-9A-Fa-f]{6}$/;
    return hexRegex.test(hex);
  }

  /**
   * Normalize hex color format
   * @param {string} hex - Hex color value
   * @returns {string} - Normalized hex color
   */
  normalizeHex(hex) {
    if (!this.isValidHex(hex)) {
      throw new Error(`Invalid hex color: ${hex}`);
    }
    
    let normalized = hex.toUpperCase();
    
    if (!normalized.startsWith('#')) {
      normalized = '#' + normalized;
    }
    
    // Convert 3-digit to 6-digit
    if (normalized.length === 4) {
      normalized = '#' + normalized[1] + normalized[1] + 
                   normalized[2] + normalized[2] + 
                   normalized[3] + normalized[3];
    }
    
    return normalized;
  }

  /**
   * Parse any color input (hex or HTML name)
   * @param {string} color - Color input
   * @returns {string} - Normalized hex color
   */
  parseColor(color) {
    // Try as hex first
    if (this.isValidHex(color)) {
      return this.normalizeHex(color);
    }
    
    // Try as HTML color name
    const hexFromName = this.htmlToHex(color);
    if (hexFromName) {
      return hexFromName;
    }
    
    throw new Error(`Unable to parse color: ${color}`);
  }

  /**
   * Get color statistics
   * @returns {Object} - Color statistics
   */
  getStats() {
    return {
      totalHTMLColors: this.htmlColors.size,
      uniqueHexValues: new Set(this.htmlColors.values()).size,
      initialized: this.initialized
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorParser;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.ColorParser = ColorParser;
}