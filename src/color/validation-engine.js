/**
 * Validation Engine Module
 * File: src/color/validation-engine.js
 * Validates color swatches against WCAG standards and other criteria
 * 
 * @author Sandeepan Sengupta
 * @website http://sandeepan.net
 * @copyright © 2025 Sandeepan Sengupta. All rights reserved.
 */

class ValidationEngine {
  constructor() {
    this.colorParser = new ColorParser();
    this.wcagCalculator = new WCAGCalculator();
    this.validationRules = new Map();
    this.initializeDefaultRules();
  }

  /**
   * Initialize default validation rules
   */
  initializeDefaultRules() {
    // WCAG compliance rule
    this.validationRules.set('wcag_compliance', {
      name: 'WCAG Compliance',
      description: 'Ensures all adjacent color pairs meet WCAG standards',
      validate: (swatch, params) => this.validateWCAGCompliance(swatch, params)
    });

    // No duplicate colors rule
    this.validationRules.set('no_duplicates', {
      name: 'No Duplicate Colors',
      description: 'Ensures no color appears more than once in the swatch',
      validate: (swatch, params) => this.validateNoDuplicates(swatch, params)
    });

    // Minimum contrast rule
    this.validationRules.set('min_contrast', {
      name: 'Minimum Contrast',
      description: 'Ensures minimum contrast ratio between adjacent colors',
      validate: (swatch, params) => this.validateMinContrast(swatch, params)
    });

    // Color count rule
    this.validationRules.set('color_count', {
      name: 'Color Count',
      description: 'Validates the number of colors in the swatch',
      validate: (swatch, params) => this.validateColorCount(swatch, params)
    });

    // Color format rule
    this.validationRules.set('color_format', {
      name: 'Color Format',
      description: 'Validates that all colors are in valid hex format',
      validate: (swatch, params) => this.validateColorFormat(swatch, params)
    });
  }

  /**
   * Validate a swatch against specified rules
   * @param {Object} swatch - Swatch object to validate
   * @param {Object} options - Validation options
   * @returns {Object} - Validation result
   */
  validateSwatch(swatch, options = {}) {
    const {
      wcagLevel = 'AA',
      textSize = 'normal',
      minContrast = null,
      maxColors = 5,
      minColors = 2,
      rules = ['wcag_compliance', 'no_duplicates', 'color_count', 'color_format']
    } = options;

    const validationResult = {
      valid: true,
      swatch: swatch,
      options: options,
      results: [],
      errors: [],
      warnings: [],
      overallRating: null,
      timestamp: new Date().toISOString()
    };

    // Run each specified rule
    rules.forEach(ruleId => {
      const rule = this.validationRules.get(ruleId);
      if (!rule) {
        validationResult.warnings.push(`Unknown validation rule: ${ruleId}`);
        return;
      }

      try {
        const ruleResult = rule.validate(swatch, {
          wcagLevel,
          textSize,
          minContrast,
          maxColors,
          minColors
        });

        validationResult.results.push({
          rule: ruleId,
          name: rule.name,
          ...ruleResult
        });

        if (!ruleResult.valid) {
          validationResult.valid = false;
          validationResult.errors.push(...ruleResult.errors);
        }

        if (ruleResult.warnings) {
          validationResult.warnings.push(...ruleResult.warnings);
        }

      } catch (error) {
        validationResult.valid = false;
        validationResult.errors.push(`Rule ${ruleId} failed: ${error.message}`);
      }
    });

    // Calculate overall rating
    this.calculateOverallRating(validationResult);

    return validationResult;
  }

  /**
   * Validate WCAG compliance
   * @param {Object} swatch - Swatch object
   * @param {Object} params - Validation parameters
   * @returns {Object} - Validation result
   */
  validateWCAGCompliance(swatch, params) {
    const { wcagLevel = 'AA', textSize = 'normal' } = params;
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      details: {
        adjacentPairs: [],
        overallCompliant: true,
        lowestContrast: Infinity
      }
    };

    if (!swatch.colors || swatch.colors.length < 2) {
      result.valid = false;
      result.errors.push('Swatch must have at least 2 colors');
      return result;
    }

    // Check adjacent pairs
    for (let i = 0; i < swatch.colors.length; i++) {
      const nextIndex = (i + 1) % swatch.colors.length;
      const color1 = swatch.colors[i];
      const color2 = swatch.colors[nextIndex];

      try {
        const compliance = this.wcagCalculator.checkCompliance(
          color1, color2, wcagLevel, textSize
        );

        result.details.adjacentPairs.push({
          pair: [i, nextIndex],
          colors: [color1, color2],
          contrastRatio: compliance.contrastRatio,
          compliant: compliance.compliant,
          requiredRatio: compliance.requiredRatio
        });

        if (!compliance.compliant) {
          result.valid = false;
          result.details.overallCompliant = false;
          result.errors.push(
            `Adjacent colors ${color1} and ${color2} do not meet ${wcagLevel} standards ` +
            `(${compliance.contrastRatio}:1 < ${compliance.requiredRatio}:1)`
          );
        }

        if (compliance.contrastRatio < result.details.lowestContrast) {
          result.details.lowestContrast = compliance.contrastRatio;
        }

      } catch (error) {
        result.valid = false;
        result.errors.push(`Failed to calculate contrast for ${color1} and ${color2}: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Validate no duplicate colors
   * @param {Object} swatch - Swatch object
   * @param {Object} params - Validation parameters
   * @returns {Object} - Validation result
   */
  validateNoDuplicates(swatch, params) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      details: {
        uniqueColors: 0,
        duplicates: []
      }
    };

    if (!swatch.colors || !Array.isArray(swatch.colors)) {
      result.valid = false;
      result.errors.push('Swatch colors must be an array');
      return result;
    }

    const colorCounts = new Map();
    
    // Count occurrences of each color
    swatch.colors.forEach((color, index) => {
      const normalizedColor = this.colorParser.normalizeHex(color);
      if (!colorCounts.has(normalizedColor)) {
        colorCounts.set(normalizedColor, []);
      }
      colorCounts.get(normalizedColor).push(index);
    });

    // Check for duplicates
    colorCounts.forEach((indices, color) => {
      if (indices.length > 1) {
        result.valid = false;
        result.details.duplicates.push({
          color,
          indices
        });
        result.errors.push(`Color ${color} appears at positions: ${indices.join(', ')}`);
      }
    });

    result.details.uniqueColors = colorCounts.size;

    return result;
  }

  /**
   * Validate minimum contrast requirement
   * @param {Object} swatch - Swatch object
   * @param {Object} params - Validation parameters
   * @returns {Object} - Validation result
   */
  validateMinContrast(swatch, params) {
    const { minContrast } = params;
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      details: {
        requiredContrast: minContrast,
        actualLowestContrast: Infinity,
        failingPairs: []
      }
    };

    if (!minContrast) {
      result.warnings.push('No minimum contrast specified');
      return result;
    }

    // Check all adjacent pairs
    for (let i = 0; i < swatch.colors.length; i++) {
      const nextIndex = (i + 1) % swatch.colors.length;
      const color1 = swatch.colors[i];
      const color2 = swatch.colors[nextIndex];

      try {
        const contrastRatio = this.wcagCalculator.calculateContrast(color1, color2);
        
        if (contrastRatio < result.details.actualLowestContrast) {
          result.details.actualLowestContrast = contrastRatio;
        }

        if (contrastRatio < minContrast) {
          result.valid = false;
          result.details.failingPairs.push({
            pair: [i, nextIndex],
            colors: [color1, color2],
            contrastRatio
          });
          result.errors.push(
            `Contrast between ${color1} and ${color2} is ${contrastRatio}:1, ` +
            `below required ${minContrast}:1`
          );
        }

      } catch (error) {
        result.valid = false;
        result.errors.push(`Failed to calculate contrast: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Validate color count
   * @param {Object} swatch - Swatch object
   * @param {Object} params - Validation parameters
   * @returns {Object} - Validation result
   */
  validateColorCount(swatch, params) {
    const { minColors = 2, maxColors = 5 } = params;
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      details: {
        actualCount: 0,
        minRequired: minColors,
        maxAllowed: maxColors
      }
    };

    if (!swatch.colors || !Array.isArray(swatch.colors)) {
      result.valid = false;
      result.errors.push('Swatch colors must be an array');
      return result;
    }

    result.details.actualCount = swatch.colors.length;

    if (swatch.colors.length < minColors) {
      result.valid = false;
      result.errors.push(`Swatch has ${swatch.colors.length} colors, minimum required is ${minColors}`);
    }

    if (swatch.colors.length > maxColors) {
      result.valid = false;
      result.errors.push(`Swatch has ${swatch.colors.length} colors, maximum allowed is ${maxColors}`);
    }

    return result;
  }

  /**
   * Validate color format
   * @param {Object} swatch - Swatch object
   * @param {Object} params - Validation parameters
   * @returns {Object} - Validation result
   */
  validateColorFormat(swatch, params) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      details: {
        validColors: [],
        invalidColors: []
      }
    };

    if (!swatch.colors || !Array.isArray(swatch.colors)) {
      result.valid = false;
      result.errors.push('Swatch colors must be an array');
      return result;
    }

    swatch.colors.forEach((color, index) => {
      try {
        const parsedColor = this.colorParser.parseColor(color);
        result.details.validColors.push({
          index,
          original: color,
          parsed: parsedColor
        });
      } catch (error) {
        result.valid = false;
        result.details.invalidColors.push({
          index,
          color,
          error: error.message
        });
        result.errors.push(`Invalid color at position ${index}: ${color} (${error.message})`);
      }
    });

    return result;
  }

  /**
   * Calculate overall rating for validation result
   * @param {Object} validationResult - Validation result to update
   */
  calculateOverallRating(validationResult) {
    if (!validationResult.valid) {
      validationResult.overallRating = 0;
      return;
    }

    // Find WCAG compliance result
    const wcagResult = validationResult.results.find(r => r.rule === 'wcag_compliance');
    if (wcagResult && wcagResult.details && wcagResult.details.lowestContrast) {
      validationResult.overallRating = wcagResult.details.lowestContrast;
    } else {
      validationResult.overallRating = null;
    }
  }

  /**
   * Add custom validation rule
   * @param {string} id - Rule ID
   * @param {Object} rule - Rule definition
   */
  addCustomRule(id, rule) {
    if (!rule.name || !rule.validate || typeof rule.validate !== 'function') {
      throw new Error('Custom rule must have name and validate function');
    }

    this.validationRules.set(id, rule);
  }

  /**
   * Remove validation rule
   * @param {string} id - Rule ID
   */
  removeRule(id) {
    return this.validationRules.delete(id);
  }

  /**
   * Get all available validation rules
   * @returns {Array} - Array of rule information
   */
  getAvailableRules() {
    return Array.from(this.validationRules.entries()).map(([id, rule]) => ({
      id,
      name: rule.name,
      description: rule.description
    }));
  }

  /**
   * Batch validate multiple swatches
   * @param {Array} swatches - Array of swatch objects
   * @param {Object} options - Validation options
   * @returns {Array} - Array of validation results
   */
  