/**
 * Swatch Generator Module
 * File: src/color/swatch-generator.js
 * Generates color combinations and permutations for swatches
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class SwatchGenerator {
  constructor() {
    this.colorParser = new ColorParser();
    this.wcagCalculator = new WCAGCalculator();
    this.generatedSwatches = new Map();
    this.uniqueSwatches = new Set();
  }

  /**
   * Generate all valid permutations for a given number of colors
   * @param {number} colorCount - Number of colors in swatch (2-5)
   * @param {string} wcagLevel - WCAG level ('AA' or 'AAA')
   * @returns {Object} - Generation results
   */
  generatePermutations(colorCount, wcagLevel = 'AA') {
    if (colorCount < 2 || colorCount > 5) {
      throw new Error('Color count must be between 2 and 5');
    }

    const allColors = this.colorParser.getAllHexValues();
    const results = {
      colorCount,
      wcagLevel,
      totalCombinations: 0,
      validSwatches: [],
      processingTime: 0,
      stats: {
        generated: 0,
        validated: 0,
        compliant: 0,
        duplicatesSkipped: 0
      }
    };

    const startTime = performance.now();
    
    // Generate combinations
    const combinations = this.generateCombinations(allColors, colorCount);
    results.totalCombinations = combinations.length;

    // Process in batches for performance
    const batchSize = 100;
    for (let i = 0; i < combinations.length; i += batchSize) {
      const batch = combinations.slice(i, i + batchSize);
      this.processBatch(batch, wcagLevel, results);
    }

    results.processingTime = performance.now() - startTime;
    return results;
  }

  /**
   * Generate combinations of colors
   * @param {string[]} colors - Array of available colors
   * @param {number} count - Number of colors to select
   * @returns {Array} - Array of color combinations
   */
  generateCombinations(colors, count) {
    const combinations = [];
    
    const generate = (current, start) => {
      if (current.length === count) {
        combinations.push([...current]);
        return;
      }
      
      for (let i = start; i < colors.length; i++) {
        current.push(colors[i]);
        generate(current, i + 1);
        current.pop();
      }
    };
    
    generate([], 0);
    return combinations;
  }

  /**
   * Process a batch of color combinations
   * @param {Array} batch - Batch of combinations
   * @param {string} wcagLevel - WCAG level
   * @param {Object} results - Results object to update
   */
  processBatch(batch, wcagLevel, results) {
    batch.forEach(combination => {
      results.stats.generated++;
      
      // Check if this combination is unique (considering rotations)
      const normalizedKey = this.getNormalizedKey(combination);
      if (this.uniqueSwatches.has(normalizedKey)) {
        results.stats.duplicatesSkipped++;
        return;
      }
      
      // Generate all rotations of the combination
      const rotations = this.generateRotations(combination);
      
      // Test each rotation
      rotations.forEach(rotation => {
        const swatchResult = this.validateSwatch(rotation, wcagLevel);
        results.stats.validated++;
        
        if (swatchResult.compliant) {
          results.stats.compliant++;
          results.validSwatches.push(swatchResult);
          this.uniqueSwatches.add(normalizedKey);
        }
      });
    });
  }

  /**
   * Generate all rotations of a color array
   * @param {string[]} colors - Array of colors
   * @returns {Array} - Array of rotations
   */
  generateRotations(colors) {
    const rotations = [];
    
    for (let i = 0; i < colors.length; i++) {
      const rotation = [...colors.slice(i), ...colors.slice(0, i)];
      rotations.push(rotation);
    }
    
    return rotations;
  }

  /**
   * Get normalized key for duplicate detection
   * @param {string[]} colors - Array of colors
   * @returns {string} - Normalized key
   */
  getNormalizedKey(colors) {
    // Sort colors to create a consistent key regardless of order
    const sorted = [...colors].sort();
    return sorted.join('|');
  }

  /**
   * Validate a swatch for WCAG compliance
   * @param {string[]} colors - Array of colors in order
   * @param {string} wcagLevel - WCAG level
   * @returns {Object} - Validation result
   */
  validateSwatch(colors, wcagLevel) {
    const swatch = {
      id: this.generateSwatchId(),
      colors: colors.map(c => this.colorParser.parseColor(c)),
      adjacentContrasts: [],
      overallRating: Infinity,
      compliant: true,
      wcagLevel
    };

    // Calculate adjacent pairs contrast
    for (let i = 0; i < colors.length; i++) {
      const nextIndex = (i + 1) % colors.length;
      const contrastResult = this.wcagCalculator.checkCompliance(
        colors[i], 
        colors[nextIndex], 
        wcagLevel
      );
      
      swatch.adjacentContrasts.push({
        pair: [i, nextIndex],
        contrastRatio: contrastResult.contrastRatio,
        compliant: contrastResult.compliant
      });
      
      // Track lowest contrast
      if (contrastResult.contrastRatio < swatch.overallRating) {
        swatch.overallRating = contrastResult.contrastRatio;
      }
      
      // If any pair fails, entire swatch fails
      if (!contrastResult.compliant) {
        swatch.compliant = false;
      }
    }

    return swatch;
  }

  /**
   * Generate unique swatch ID
   * @returns {string} - Unique ID
   */
  generateSwatchId() {
    return `swatch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get swatches by specific criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Array} - Filtered swatches
   */
  getSwatchesByCriteria(criteria = {}) {
    const {
      colorCount,
      wcagLevel,
      minContrast,
      maxContrast,
      includeColors,
      excludeColors,
      sortBy = 'overallRating',
      sortOrder = 'desc'
    } = criteria;

    let swatches = Array.from(this.generatedSwatches.values());

    // Apply filters
    if (colorCount) {
      swatches = swatches.filter(s => s.colors.length === colorCount);
    }

    if (wcagLevel) {
      swatches = swatches.filter(s => s.wcagLevel === wcagLevel);
    }

    if (minContrast !== undefined) {
      swatches = swatches.filter(s => s.overallRating >= minContrast);
    }

    if (maxContrast !== undefined) {
      swatches = swatches.filter(s => s.overallRating <= maxContrast);
    }

    if (includeColors && includeColors.length > 0) {
      swatches = swatches.filter(s => 
        includeColors.every(color => s.colors.includes(color))
      );
    }

    if (excludeColors && excludeColors.length > 0) {
      swatches = swatches.filter(s => 
        !excludeColors.some(color => s.colors.includes(color))
      );
    }

    // Sort results
    swatches.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    return swatches;
  }

  /**
   * Generate specific swatch from color array
   * @param {string[]} colors - Array of colors
   * @param {string} wcagLevel - WCAG level
   * @returns {Object} - Swatch object
   */
  generateSpecificSwatch(colors, wcagLevel = 'AA') {
    if (colors.length < 2 || colors.length > 5) {
      throw new Error('Swatch must have 2-5 colors');
    }

    // Check for duplicates
    const uniqueColors = [...new Set(colors)];
    if (uniqueColors.length !== colors.length) {
      throw new Error('Swatch cannot contain duplicate colors');
    }

    const swatch = this.validateSwatch(colors, wcagLevel);
    
    // Store in cache
    this.generatedSwatches.set(swatch.id, swatch);
    
    return swatch;
  }

  /**
   * Get random compliant swatch
   * @param {number} colorCount - Number of colors
   * @param {string} wcagLevel - WCAG level
   * @returns {Object|null} - Random swatch or null if none found
   */
  getRandomCompliantSwatch(colorCount, wcagLevel = 'AA') {
    const compliantSwatches = this.getSwatchesByCriteria({
      colorCount,
      wcagLevel
    }).filter(s => s.compliant);

    if (compliantSwatches.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * compliantSwatches.length);
    return compliantSwatches[randomIndex];
  }

  /**
   * Clear cache and reset generator
   */
  reset() {
    this.generatedSwatches.clear();
    this.uniqueSwatches.clear();
  }

  /**
   * Get generator statistics
   * @returns {Object} - Statistics
   */
  getStats() {
    return {
      totalSwatches: this.generatedSwatches.size,
      uniqueSwatches: this.uniqueSwatches.size,
      colorParserStats: this.colorParser.getStats(),
      wcagCalculatorStats: this.wcagCalculator.getStats()
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SwatchGenerator;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.SwatchGenerator = SwatchGenerator;
}