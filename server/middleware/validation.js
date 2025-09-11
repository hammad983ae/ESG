/**
 * Delorenzo Property Group - Validation Middleware
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Express middleware for request validation
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validate MongoDB ObjectId
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid ObjectId
 */
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

/**
 * Validate valuation data
 */
const validateValuationData = [
  body('propertyName')
    .notEmpty()
    .withMessage('Property name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Property name must be between 1 and 200 characters')
    .trim(),
  
  body('propertyLocation')
    .notEmpty()
    .withMessage('Property location is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Property location must be between 1 and 200 characters')
    .trim(),
  
  body('propertyType')
    .notEmpty()
    .withMessage('Property type is required')
    .isIn([
      'residential', 'commercial', 'industrial', 'retail', 'office', 
      'hospitality', 'childcare', 'petrol-station', 'stadium', 
      'agricultural', 'mixed-use', 'other'
    ])
    .withMessage('Invalid property type'),
  
  body('valuationType')
    .notEmpty()
    .withMessage('Valuation type is required')
    .isIn([
      'ary', 'esg-ary', 'capitalization-sensitivity', 'net-income',
      'esg-capitalization', 'esg-comparable-sales', 'cap-net-income',
      'summation', 'direct-comparison', 'hypothetical-development',
      'hospitality', 'childcare', 'comprehensive-esg', 'petrol-station',
      'deferred-management', 'dcf', 'stadium'
    ])
    .withMessage('Invalid valuation type'),
  
  body('userId')
    .optional()
    .isString()
    .withMessage('User ID must be a string'),
  
  body('sessionId')
    .optional()
    .isString()
    .withMessage('Session ID must be a string'),
  
  body('results')
    .notEmpty()
    .withMessage('Results are required')
    .isObject()
    .withMessage('Results must be an object'),
  
  body('inputs')
    .notEmpty()
    .withMessage('Inputs are required')
    .isObject()
    .withMessage('Inputs must be an object'),
  
  body('calculationMethod')
    .notEmpty()
    .withMessage('Calculation method is required')
    .isString()
    .withMessage('Calculation method must be a string'),
  
  body('esgIncluded')
    .optional()
    .isBoolean()
    .withMessage('ESG included must be a boolean'),
  
  body('esgFactor')
    .optional()
    .isNumeric()
    .withMessage('ESG factor must be a number')
    .isFloat({ min: -100, max: 100 })
    .withMessage('ESG factor must be between -100 and 100'),
  
  body('status')
    .optional()
    .isIn(['draft', 'completed', 'archived'])
    .withMessage('Invalid status'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('Is public must be a boolean'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  handleValidationErrors
];

/**
 * Validate valuation ID parameter
 */
const validateValuationId = [
  param('id')
    .notEmpty()
    .withMessage('Valuation ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid valuation ID format');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validate user ID query parameter
 */
const validateUserId = [
  query('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),
  
  handleValidationErrors
];

/**
 * Validate search query parameters
 */
const validateSearchQuery = [
  query('q')
    .optional()
    .isString()
    .withMessage('Search query must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('valuationType')
    .optional()
    .isIn([
      'ary', 'esg-ary', 'capitalization-sensitivity', 'net-income',
      'esg-capitalization', 'esg-comparable-sales', 'cap-net-income',
      'summation', 'direct-comparison', 'hypothetical-development',
      'hospitality', 'childcare', 'comprehensive-esg', 'petrol-station',
      'deferred-management', 'dcf', 'stadium'
    ])
    .withMessage('Invalid valuation type filter'),
  
  query('propertyType')
    .optional()
    .isIn([
      'residential', 'commercial', 'industrial', 'retail', 'office', 
      'hospitality', 'childcare', 'petrol-station', 'stadium', 
      'agricultural', 'mixed-use', 'other'
    ])
    .withMessage('Invalid property type filter'),
  
  query('status')
    .optional()
    .isIn(['draft', 'completed', 'archived'])
    .withMessage('Invalid status filter'),
  
  query('esgIncluded')
    .optional()
    .isBoolean()
    .withMessage('ESG included filter must be a boolean'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer'),
  
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO 8601 date'),
  
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

/**
 * Validate export request
 */
const validateExportRequest = [
  body('valuationIds')
    .notEmpty()
    .withMessage('Valuation IDs are required')
    .isArray({ min: 1 })
    .withMessage('Valuation IDs must be a non-empty array'),
  
  body('valuationIds.*')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid valuation ID format in array');
      }
      return true;
    }),
  
  body('format')
    .optional()
    .isIn(['json', 'csv', 'pdf'])
    .withMessage('Export format must be json, csv, or pdf'),
  
  body('userId')
    .optional()
    .isString()
    .withMessage('User ID must be a string'),
  
  handleValidationErrors
];

/**
 * Validate share request
 */
const validateShareRequest = [
  body('shareWithUserId')
    .notEmpty()
    .withMessage('Share with user ID is required')
    .isString()
    .withMessage('Share with user ID must be a string'),
  
  body('permission')
    .optional()
    .isIn(['read', 'write', 'admin'])
    .withMessage('Permission must be read, write, or admin'),
  
  body('ownerId')
    .optional()
    .isString()
    .withMessage('Owner ID must be a string'),
  
  handleValidationErrors
];

/**
 * Validate ARY calculation inputs
 */
const validateARYInputs = [
  body('inputs.riskFreeRate')
    .isNumeric()
    .withMessage('Risk-free rate must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Risk-free rate must be between 0 and 100'),
  
  body('inputs.liquidityRisk')
    .isNumeric()
    .withMessage('Liquidity risk must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Liquidity risk must be between 0 and 100'),
  
  body('inputs.managementRisk')
    .isNumeric()
    .withMessage('Management risk must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Management risk must be between 0 and 100'),
  
  body('inputs.marketRisk')
    .isNumeric()
    .withMessage('Market risk must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Market risk must be between 0 and 100'),
  
  body('inputs.specificRisk')
    .isNumeric()
    .withMessage('Specific risk must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Specific risk must be between 0 and 100'),
  
  handleValidationErrors
];

/**
 * Validate DCF calculation inputs
 */
const validateDCFInputs = [
  body('inputs.initialInvestment')
    .isNumeric()
    .withMessage('Initial investment must be a number')
    .isFloat({ min: 0 })
    .withMessage('Initial investment must be non-negative'),
  
  body('inputs.discountRate')
    .isNumeric()
    .withMessage('Discount rate must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount rate must be between 0 and 100'),
  
  body('inputs.cashFlows')
    .isArray({ min: 1 })
    .withMessage('Cash flows must be a non-empty array'),
  
  body('inputs.cashFlows.*')
    .isNumeric()
    .withMessage('Each cash flow must be a number'),
  
  handleValidationErrors
];

/**
 * Validate weather request parameters
 */
const validateWeatherRequest = [
  query('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  query('lon')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  query('asl')
    .optional()
    .isFloat({ min: -500, max: 9000 })
    .withMessage('Altitude above sea level must be between -500 and 9000 meters'),
  
  query('city')
    .optional()
    .isString()
    .withMessage('City must be a string')
    .isLength({ max: 100 })
    .withMessage('City name must not exceed 100 characters'),
  
  query('tz')
    .optional()
    .isString()
    .withMessage('Timezone must be a string'),
  
  query('imageType')
    .optional()
    .isIn([
      'meteogram', 'meteogram_verify', 'meteogram_solar', 'meteogram_solar_season',
      'agronomy', 'aviation', 'picto_1d', 'picto_3d', 'picto_7d', 'picto_14d',
      'sounding', 'cross_section'
    ])
    .withMessage('Invalid image type'),
  
  query('forecastDays')
    .optional()
    .isInt({ min: 1, max: 14 })
    .withMessage('Forecast days must be between 1 and 14'),
  
  query('historyDays')
    .optional()
    .isInt({ min: 0, max: 7 })
    .withMessage('History days must be between 0 and 7'),
  
  query('look')
    .optional()
    .isIn([
      'CELSIUS_MILLIMETER_METER_PER_SECOND',
      'FAHRENHEIT_INCH_MILE_PER_HOUR',
      'CELSIUS_MILLIMETER_KILOMETER_PER_HOUR',
      'CELSIUS_MILLIMETER_KNOT',
      'CELSIUS_MILLIMETER_BEAUFORT',
      'FAHRENHEIT_INCH_KILOMETER_PER_HOUR',
      'FAHRENHEIT_INCH_KNOT',
      'FAHRENHEIT_INCH_BEAUFORT'
    ])
    .withMessage('Invalid units format'),
  
  query('lang')
    .optional()
    .isIn([
      'en', 'de', 'fr', 'it', 'es', 'pt', 'ro', 'ru', 'nl', 'tr', 'hu', 'bg',
      'ar', 'cs', 'el', 'ka', 'pl', 'sk', 'sr'
    ])
    .withMessage('Invalid language code'),
  
  query('dpi')
    .optional()
    .isInt({ min: 50, max: 300 })
    .withMessage('DPI must be between 50 and 300'),
  
  query('noLogo')
    .optional()
    .isBoolean()
    .withMessage('No logo must be a boolean'),
  
  handleValidationErrors
];

/**
 * Validate weather location parameters
 */
const validateWeatherLocation = [
  param('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  param('lon')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

module.exports = {
  validateValuationData,
  validateValuationId,
  validateUserId,
  validateSearchQuery,
  validateExportRequest,
  validateShareRequest,
  validateARYInputs,
  validateDCFInputs,
  validateWeatherRequest,
  validateWeatherLocation,
  handleValidationErrors
};
