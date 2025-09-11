/**
 * CoreLogic API Routes
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Express routes for CoreLogic Address Matcher API integration
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const express = require('express');
const { body, query, validationResult } = require('express-validator');
const coreLogicService = require('../services/corelogicService');

const router = express.Router();

/**
 * Validation middleware
 */
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

/**
 * @route   POST /api/corelogic/search
 * @desc    Search for property address using CoreLogic API
 * @access  Public
 */
router.post('/search', [
  body('address')
    .isString()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Address must be between 3 and 1000 characters'),
  body('clientName')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Client name must be less than 100 characters'),
  body('minConfidence')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Min confidence must be between 0 and 1')
], validateRequest, async (req, res) => {
  try {
    const { address, clientName = 'Sustaino Pro', minConfidence = 0.7 } = req.body;
    
    // Format address for optimal matching
    const formattedAddress = coreLogicService.formatAddressForMatching(address);
    
    // Search for address
    const result = await coreLogicService.searchAddress(formattedAddress, clientName);
    
    // Filter by confidence if specified
    if (result.success && result.data) {
      if (!coreLogicService.isAcceptableMatch(result.data, minConfidence)) {
        return res.json({
          success: false,
          error: 'No suitable matches found. Try a more specific address.',
          matchQuality: 'no-match'
        });
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('CoreLogic search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      matchQuality: 'no-match'
    });
  }
});

/**
 * @route   GET /api/corelogic/search
 * @desc    Search for property address using CoreLogic API (GET method)
 * @access  Public
 */
router.get('/search', [
  query('q')
    .isString()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Query must be between 3 and 1000 characters'),
  query('clientName')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Client name must be less than 100 characters'),
  query('minConfidence')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Min confidence must be between 0 and 1')
], validateRequest, async (req, res) => {
  try {
    const { q: address, clientName = 'Sustaino Pro', minConfidence = 0.7 } = req.query;
    
    // Format address for optimal matching
    const formattedAddress = coreLogicService.formatAddressForMatching(address);
    
    // Search for address
    const result = await coreLogicService.searchAddress(formattedAddress, clientName);
    
    // Filter by confidence if specified
    if (result.success && result.data) {
      if (!coreLogicService.isAcceptableMatch(result.data, minConfidence)) {
        return res.json({
          success: false,
          error: 'No suitable matches found. Try a more specific address.',
          matchQuality: 'no-match'
        });
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('CoreLogic search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      matchQuality: 'no-match'
    });
  }
});

/**
 * @route   GET /api/corelogic/stats
 * @desc    Get CoreLogic service statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = coreLogicService.getCacheStats();
    res.json({
      success: true,
      data: {
        cache: stats,
        service: {
          maxRetries: coreLogicService.maxRetries,
          timeout: coreLogicService.timeout,
          rateLimitWindow: coreLogicService.rateLimitWindow,
          maxRequestsPerMinute: coreLogicService.maxRequestsPerMinute
        }
      }
    });
  } catch (error) {
    console.error('CoreLogic stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

/**
 * @route   DELETE /api/corelogic/cache
 * @desc    Clear CoreLogic service cache
 * @access  Public
 */
router.delete('/cache', async (req, res) => {
  try {
    const result = coreLogicService.clearCache();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('CoreLogic cache clear error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

/**
 * @route   GET /api/corelogic/health
 * @desc    Health check for CoreLogic service
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    // Test with a simple address to verify service is working
    const testResult = await coreLogicService.searchAddress('123 Collins Street Melbourne VIC 3000', 'Health Check');
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        service: 'CoreLogic Address Matcher',
        version: '1.0.0',
        testResult: testResult.success ? 'API accessible' : 'API error'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Service unavailable',
      details: error.message
    });
  }
});

// ========================================
// PROPERTY DETAILS API ROUTES
// ========================================

/**
 * @route   GET /api/corelogic/property/:propertyId/otm/sales
 * @desc    Get OTM sales campaigns for a property
 * @access  Public
 */
router.get('/property/:propertyId/otm/sales', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getOTMSales(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('OTM Sales error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get OTM sales data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/otm/rent
 * @desc    Get OTM rent campaigns for a property
 * @access  Public
 */
router.get('/property/:propertyId/otm/rent', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getOTMRent(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('OTM Rent error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get OTM rent data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/timeline
 * @desc    Get property timeline
 * @access  Public
 */
router.get('/property/:propertyId/timeline', [
  query('withDevelopmentApplications')
    .optional()
    .isString()
    .withMessage('withDevelopmentApplications must be a string')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { withDevelopmentApplications = null } = req.query;
    
    const result = await coreLogicService.getPropertyTimeline(propertyId, withDevelopmentApplications);
    res.json(result);
  } catch (error) {
    console.error('Property Timeline error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property timeline'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/legal
 * @desc    Get property legal information
 * @access  Public
 */
router.get('/property/:propertyId/legal', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyLegal(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Legal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property legal data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/contacts
 * @desc    Get property contacts
 * @access  Public
 */
router.get('/property/:propertyId/contacts', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyContacts(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property contacts'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/occupancy
 * @desc    Get property occupancy information
 * @access  Public
 */
router.get('/property/:propertyId/occupancy', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyOccupancy(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Occupancy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property occupancy data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/development-applications
 * @desc    Get property development applications
 * @access  Public
 */
router.get('/property/:propertyId/development-applications', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const result = await coreLogicService.getPropertyDevelopmentApplications(propertyId);
    res.json(result);
  } catch (error) {
    console.error('Property Development Applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property development applications'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/location
 * @desc    Get property location information
 * @access  Public
 */
router.get('/property/:propertyId/location', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyLocation(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Location error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property location data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/images
 * @desc    Get property images
 * @access  Public
 */
router.get('/property/:propertyId/images', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyImages(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Images error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property images'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/site
 * @desc    Get property site information
 * @access  Public
 */
router.get('/property/:propertyId/site', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertySite(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Site error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property site data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/attributes/core
 * @desc    Get property core attributes
 * @access  Public
 */
router.get('/property/:propertyId/attributes/core', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyCoreAttributes(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Core Attributes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property core attributes'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/attributes/additional
 * @desc    Get property additional attributes
 * @access  Public
 */
router.get('/property/:propertyId/attributes/additional', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyAdditionalAttributes(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Additional Attributes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property additional attributes'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/features
 * @desc    Get property features
 * @access  Public
 */
router.get('/property/:propertyId/features', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertyFeatures(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Features error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property features'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/sales
 * @desc    Get property sales history
 * @access  Public
 */
router.get('/property/:propertyId/sales', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getPropertySales(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Property Sales error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property sales data'
    });
  }
});

/**
 * @route   GET /api/corelogic/property/:propertyId/comprehensive
 * @desc    Get comprehensive property details (all endpoints)
 * @access  Public
 */
router.get('/property/:propertyId/comprehensive', [
  query('includeHistoric')
    .optional()
    .isBoolean()
    .withMessage('includeHistoric must be a boolean')
], validateRequest, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { includeHistoric = false } = req.query;
    
    const result = await coreLogicService.getComprehensivePropertyDetails(propertyId, includeHistoric);
    res.json(result);
  } catch (error) {
    console.error('Comprehensive Property Details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get comprehensive property details'
    });
  }
});

/**
 * @route   GET /api/corelogic/find-valid
 * @desc    Find a valid property ID
 * @access  Public
 */
router.get('/find-valid', async (req, res) => {
  try {
    const result = await coreLogicService.findValidProperty();
    res.json(result);
  } catch (error) {
    console.error('Find valid property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find valid property'
    });
  }
});

/**
 * @route   GET /api/corelogic/test/:propertyId
 * @desc    Test property data endpoint
 * @access  Public
 */
router.get('/test/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const result = await coreLogicService.testPropertyData(propertyId);
    res.json(result);
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test property data'
    });
  }
});

module.exports = router;
