/**
 * WCAG Calculator Module
 * File: src/color/wcag-calculator.js
 * Calculates WCAG contrast ratios and compliance levels
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class WCAGCalculator {
  constructor() {
    this.colorParser = new ColorParser();
    
    // WCAG thresholds
    this.thresholds = {
      AA: {
        normal: 4.5,
        large: 3.0
      },
      AAA: {
        normal: 7.0,
        large: 4.5
      }
    };
  }

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (hex or HTML name)
   * @param {string} color2 - Second color (hex or HTML name)
   * @returns {number} - Contrast ratio (1:1 to 21:1)
   */
  calculateContrast(color1, color2) {
    try {
      // Parse colors to hex
      const hex1 = this.colorParser.parseColor(color1);
      const hex2 = this.colorParser.parseColor(color2);
      
      // Get relative luminance values
      const luminance1 = this.colorParser.hexToLuminance(hex1);
      const luminance2 = this.colorParser.hexToLuminance(hex2);
      
      // Calculate contrast ratio
      const lighter = Math.max(luminance1, luminance2);
      const darker = Math.min(luminance1, luminance2);
      
      const contrastRatio = (lighter + 0.05) / (darker + 0.05);
      
      // Round to 2 decimal places
      return Math.round(contrastRatio * 100) / 100;
      
    } catch (error) {
      throw new Error(`Failed to calculate contrast: ${error.message}`);
    }
  }

  /**
   * Check WCAG compliance for a color pair
   * @param {string} color1 - First color
   * @param {string} color2 - Second color
   * @param {string} level - WCAG level ('AA' or 'AAA')
   * @param {string} textSize - Text size ('normal' or 'large')
   * @returns {Object} - Compliance result
   */
  checkCompliance(color1, color2, level = 'AA', textSize = 'normal') {
    const contrastRatio = this.calculateContrast(color1, color2);
    const requiredRatio = this.thresholds[level][textSize];
    const compliant = contrastRatio >= requiredRatio;
    
    return {
      contrastRatio,
      requiredRatio,
      compliant,
      level,
      textSize,
      color1: this.colorParser.parseColor(color1),
      color2: this.colorParser.parseColor(color2)
    };
  }

  /**
   * Get all possible compliance levels for a color pair
   * @param {string} color1 - First color
   * @param {string} color2 - Second color
   * @returns {Object} - All compliance results
   */
  getAllCompliance(color1, color2) {
    const contrastRatio = this.calculateContrast(color1, color2);
    
    const results = {
      contrastRatio,
      hex1: this.colorParser.parseColor(color1),
      hex2: this.colorParser.parseColor(color2),
      compliance: {}
    };
    
    // Check all combinations
    ['AA', 'AAA'].forEach(level => {
      results.compliance[level] = {
        normal: contrastRatio >= this.thresholds[level].normal,
        large: contrastRatio >= this.thresholds[level].large
      };
    });
    
    // Determine highest level achieved
    results.highestLevel = this.getHighestLevel(results.compliance);
    
    return results;
  }

  /**
   * Get the highest WCAG level achieved
   * @param {Object} compliance - Compliance results
   * @returns {string} - Highest level ('None', 'AA-Large', 'AA', 'AAA-Large', 'AAA')
   */
  getHighestLevel(compliance) {
    if (compliance.AAA.normal) return 'AAA';
    if (compliance.AAA.large) return 'AAA-Large';
    if (compliance.AA.normal) return 'AA';
    if (compliance.AA.large) return 'AA-Large';
    return 'None';
  }

  /**
   * Calculate contrast for multiple color pairs
   * @param {string[]} colors - Array of colors
   * @param {string} level - WCAG level to check
   * @returns {Object} - Results for all pairs
   */
  calculateMultipleContrasts(colors, level = 'AA') {
    const results = {
      colors: colors.map(c => this.colorParser.parseColor(c)),
      pairs: [],
      allCompliant: true,
      lowestRatio: Infinity,
      averageRatio: 0
    };
    
    // Calculate all unique pairs
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const pairResult = this.checkCompliance(colors[i], colors[j], level);
        results.pairs.push({
          color1: colors[i],
          color2: colors[j],
          ...pairResult
        });
        
        if (!pairResult.compliant) {
          results.allCompliant = false;
        }
        
        if (pairResult.contrastRatio < results.lowestRatio) {
          results.lowestRatio = pairResult.contrastRatio;
        }
      }
    }
    
    // Calculate average
    if (results.pairs.length > 0) {
      results.averageRatio = results.pairs.reduce((sum, pair) => 
        sum + pair.contrastRatio, 0) / results.pairs.length;
      results.averageRatio = Math.round(results.averageRatio * 100) / 100;
    }
    
    return results;
  }

  /**
   * Calculate adjacent pairs contrast (for swatch wheel)
   * @param {string[]} colors - Array of colors in circular order
   * @param {string} level - WCAG level to check
   * @returns {Object} - Adjacent pairs analysis
   */
  calculateAdjacentContrasts(colors, level = 'AA') {
    const results = {
      colors: colors.map(c => this.colorParser.parseColor(c)),
      adjacentPairs: [],
      allAdjacentCompliant: true,
      lowestAdjacentRatio: Infinity,
      overallRating: Infinity
    };
    
    // Calculate adjacent pairs (including wraparound)
    for (let i = 0; i < colors.length; i++) {
      const nextIndex = (i + 1) % colors.length;
      const pairResult = this.checkCompliance(colors[i], colors[nextIndex], level);
      
      results.adjacentPairs.push({
        index1: i,
        index2: nextIndex,
        color1: colors[i],
        color2: colors[nextIndex],
        ...pairResult
      });
      
      if (!pair