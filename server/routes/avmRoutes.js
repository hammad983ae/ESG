/**
 * CoreLogic AVM API Routes
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * API routes for CoreLogic AVM (Automated Valuation Model) integration
 * Provides endpoints for property valuation data and analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const coreLogicService = require('../services/corelogicService');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// ============================================================================
// CURRENT AVM ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/avm/origination/current/:propertyId
 * @desc    Get current origination AVM for a property
 * @access  Public
 */
router.get('/origination/current/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  query('countryCode').optional().isIn(['au', 'nz']).withMessage('Country code must be au or nz'),
  query('roundTo').optional().isIn(['5', '10', '50', '100', '500', '1000', '5000', '10000']).withMessage('Invalid roundTo value')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { countryCode = 'au', roundTo } = req.query;
    
    const result = await coreLogicService.getCurrentOriginationAVM(propertyId, countryCode, roundTo);
    res.json(result);
  } catch (error) {
    console.error('Origination AVM route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/avm/consumer/band/current/:propertyId
 * @desc    Get current consumer band AVM for a property
 * @access  Public
 */
router.get('/consumer/band/current/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  query('countryCode').optional().isIn(['au', 'nz']).withMessage('Country code must be au or nz')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { countryCode = 'au' } = req.query;
    
    const result = await coreLogicService.getCurrentConsumerBandAVM(propertyId, countryCode);
    res.json(result);
  } catch (error) {
    console.error('Consumer Band AVM route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// ============================================================================
// HISTORICAL AVM ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/avm/consumer/history/:propertyId
 * @desc    Get consumer AVM history for a property
 * @access  Public
 */
router.get('/consumer/history/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  query('countryCode').optional().isIn(['au', 'nz']).withMessage('Country code must be au or nz'),
  query('fromValuationDate').optional().isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  query('roundTo').optional().isIn(['5', '10', '50', '100', '500', '1000', '5000', '10000']).withMessage('Invalid roundTo value')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { countryCode = 'au', fromValuationDate, roundTo } = req.query;
    
    const result = await coreLogicService.getConsumerAVMHistory(propertyId, countryCode, fromValuationDate, roundTo);
    res.json(result);
  } catch (error) {
    console.error('Consumer AVM History route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/avm/origination/history/:propertyId
 * @desc    Get origination AVM history for a property
 * @access  Public
 */
router.get('/origination/history/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  query('fromValuationDate').isISO8601().withMessage('fromValuationDate is required and must be in YYYY-MM-DD format'),
  query('roundTo').optional().isIn(['5', '10', '50', '100', '500', '1000', '5000', '10000']).withMessage('Invalid roundTo value')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { fromValuationDate, roundTo } = req.query;
    
    const result = await coreLogicService.getOriginationAVMHistory(propertyId, fromValuationDate, roundTo);
    res.json(result);
  } catch (error) {
    console.error('Origination AVM History route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/avm/date/:propertyId/:valuationDate
 * @desc    Get AVM for a specific date
 * @access  Public
 */
router.get('/date/:propertyId/:valuationDate', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  param('valuationDate').isISO8601().withMessage('Valuation date must be in YYYY-MM-DD format'),
  query('countryCode').optional().isIn(['au', 'nz']).withMessage('Country code must be au or nz'),
  query('roundTo').optional().isIn(['5', '10', '50', '100', '500', '1000', '5000', '10000']).withMessage('Invalid roundTo value')
], validateRequest, async (req, res) => {
  try {
    const { propertyId, valuationDate } = req.params;
    const { countryCode = 'au', roundTo } = req.query;
    
    const result = await coreLogicService.getAVMForDate(propertyId, valuationDate, countryCode, roundTo);
    res.json(result);
  } catch (error) {
    console.error('AVM Date route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// ============================================================================
// LIVE AVM ENDPOINTS
// ============================================================================

/**
 * @route   POST /api/avm/live/origination/:propertyId
 * @desc    Get live origination AVM with property modifications
 * @access  Public
 */
router.post('/live/origination/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  body('bedrooms').optional().isInt({ min: 0, max: 20 }).withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms').optional().isInt({ min: 0, max: 20 }).withMessage('Bathrooms must be between 0 and 20'),
  body('carSpaces').optional().isInt({ min: 0, max: 20 }).withMessage('Car spaces must be between 0 and 20'),
  body('floorAreaM2').optional().isFloat({ min: 0 }).withMessage('Floor area must be positive'),
  body('landAreaM2').optional().isFloat({ min: 0 }).withMessage('Land area must be positive'),
  body('salePrice').optional().isFloat({ min: 0 }).withMessage('Sale price must be positive'),
  body('yearBuilt').optional().isInt({ min: 1800, max: new Date().getFullYear() + 1 }).withMessage('Year built must be between 1800 and current year + 1'),
  body('propertyType').optional().isString().isLength({ max: 100 }).withMessage('Property type must be a string with max 100 characters'),
  body('saleDate').optional().isISO8601().withMessage('Sale date must be in YYYY-MM-DD format'),
  body('valuationDate').optional().isISO8601().withMessage('Valuation date must be in YYYY-MM-DD format'),
  body('craftsmanshipQuality').optional().isIn(['AVERAGE', 'ABOVE_AVERAGE', 'BELOW_AVERAGE', 'EXCELLENT', 'POOR']).withMessage('Invalid craftsmanship quality')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyData = req.body;
    
    const result = await coreLogicService.getLiveOriginationAVM(propertyId, propertyData);
    res.json(result);
  } catch (error) {
    console.error('Live Origination AVM route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/avm/live/consumer/:propertyId
 * @desc    Get live consumer AVM with property modifications
 * @access  Public
 */
router.post('/live/consumer/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  body('bedrooms').optional().isInt({ min: 0, max: 20 }).withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms').optional().isInt({ min: 0, max: 20 }).withMessage('Bathrooms must be between 0 and 20'),
  body('carSpaces').optional().isInt({ min: 0, max: 20 }).withMessage('Car spaces must be between 0 and 20'),
  body('floorAreaM2').optional().isFloat({ min: 0 }).withMessage('Floor area must be positive'),
  body('landAreaM2').optional().isFloat({ min: 0 }).withMessage('Land area must be positive'),
  body('salePrice').optional().isFloat({ min: 0 }).withMessage('Sale price must be positive'),
  body('yearBuilt').optional().isInt({ min: 1800, max: new Date().getFullYear() + 1 }).withMessage('Year built must be between 1800 and current year + 1'),
  body('propertyType').optional().isString().isLength({ max: 100 }).withMessage('Property type must be a string with max 100 characters'),
  body('saleDate').optional().isISO8601().withMessage('Sale date must be in YYYY-MM-DD format'),
  body('valuationDate').optional().isISO8601().withMessage('Valuation date must be in YYYY-MM-DD format'),
  body('craftsmanshipQuality').optional().isIn(['AVERAGE', 'ABOVE_AVERAGE', 'BELOW_AVERAGE', 'EXCELLENT', 'POOR']).withMessage('Invalid craftsmanship quality')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyData = req.body;
    
    const result = await coreLogicService.getLiveConsumerAVM(propertyId, propertyData);
    res.json(result);
  } catch (error) {
    console.error('Live Consumer AVM route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/avm/live/consumer/band/:propertyId
 * @desc    Get live consumer band AVM with property modifications
 * @access  Public
 */
router.post('/live/consumer/band/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric'),
  body('bedrooms').optional().isInt({ min: 0, max: 20 }).withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms').optional().isInt({ min: 0, max: 20 }).withMessage('Bathrooms must be between 0 and 20'),
  body('carSpaces').optional().isInt({ min: 0, max: 20 }).withMessage('Car spaces must be between 0 and 20'),
  body('floorAreaM2').optional().isFloat({ min: 0 }).withMessage('Floor area must be positive'),
  body('landAreaM2').optional().isFloat({ min: 0 }).withMessage('Land area must be positive'),
  body('salePrice').optional().isFloat({ min: 0 }).withMessage('Sale price must be positive'),
  body('yearBuilt').optional().isInt({ min: 1800, max: new Date().getFullYear() + 1 }).withMessage('Year built must be between 1800 and current year + 1'),
  body('propertyType').optional().isString().isLength({ max: 100 }).withMessage('Property type must be a string with max 100 characters'),
  body('saleDate').optional().isISO8601().withMessage('Sale date must be in YYYY-MM-DD format'),
  body('valuationDate').optional().isISO8601().withMessage('Valuation date must be in YYYY-MM-DD format'),
  body('craftsmanshipQuality').optional().isIn(['AVERAGE', 'ABOVE_AVERAGE', 'BELOW_AVERAGE', 'EXCELLENT', 'POOR']).withMessage('Invalid craftsmanship quality')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyData = req.body;
    
    const result = await coreLogicService.getLiveConsumerBandAVM(propertyId, propertyData);
    res.json(result);
  } catch (error) {
    console.error('Live Consumer Band AVM route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// ============================================================================
// AVM REPORT ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/avm/report/consumer/:propertyId
 * @desc    Get AVM consumer report URL
 * @access  Public
 */
router.get('/report/consumer/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const result = await coreLogicService.getAVMConsumerReport(propertyId);
    res.json(result);
  } catch (error) {
    console.error('AVM Consumer Report route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/avm/report/origination/:propertyId
 * @desc    Get AVM origination report URL
 * @access  Public
 */
router.get('/report/origination/:propertyId', [
  param('propertyId').isNumeric().withMessage('Property ID must be numeric')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const result = await coreLogicService.getAVMOriginationReport(propertyId);
    res.json(result);
  } catch (error) {
    console.error('AVM Origination Report route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// ============================================================================
// UTILITY ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/avm/stats
 * @desc    Get AVM service statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = coreLogicService.getCacheStats();
    res.json({
      success: true,
      data: {
        cache: stats,
        service: 'CoreLogic AVM API',
        version: '2.0.0',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AVM Stats route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/avm/clear-cache
 * @desc    Clear AVM cache
 * @access  Public
 */
router.post('/clear-cache', async (req, res) => {
  try {
    const result = coreLogicService.clearCache();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Clear Cache route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
