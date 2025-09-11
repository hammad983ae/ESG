/**
 * CoreLogic Market Insights API Routes
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000018
 * 
 * API routes for CoreLogic Market Insights integration
 * Provides endpoints for auction data, census data, and market statistics
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

// ========================================
// AUCTION ENDPOINTS
// ========================================

/**
 * @route   GET /api/market-insights/auction/summaries/:state
 * @desc    Get auction summaries for a state
 * @access  Public
 */
router.get('/auction/summaries/:state', [
  param('state').isLength({ min: 2, max: 3 }).withMessage('State must be 2-3 characters'),
  query('capitalCityOnly').optional().isBoolean().withMessage('capitalCityOnly must be boolean')
], validateRequest, async (req, res) => {
  try {
    const { state } = req.params;
    const { capitalCityOnly } = req.query;
    const result = await coreLogicService.getAuctionSummaries(state, capitalCityOnly === 'true');
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /auction/summaries:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/auction/results/:state
 * @desc    Get latest auction results for a state
 * @access  Public
 */
router.get('/auction/results/:state', [
  param('state').isLength({ min: 2, max: 3 }).withMessage('State must be 2-3 characters'),
  query('capitalCityOnly').optional().isBoolean().withMessage('capitalCityOnly must be boolean'),
  query('stats').optional().isString().withMessage('stats must be string')
], validateRequest, async (req, res) => {
  try {
    const { state } = req.params;
    const { capitalCityOnly, stats } = req.query;
    const statsArray = stats ? stats.split(',') : null;
    const result = await coreLogicService.getAuctionResults(state, capitalCityOnly === 'true', statsArray);
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /auction/results:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/auction/results/:state/weeks/:noOfWeeks
 * @desc    Get auction results for past n weeks
 * @access  Public
 */
router.get('/auction/results/:state/weeks/:noOfWeeks', [
  param('state').isLength({ min: 2, max: 3 }).withMessage('State must be 2-3 characters'),
  param('noOfWeeks').isInt({ min: 1, max: 52 }).withMessage('noOfWeeks must be between 1 and 52'),
  query('capitalCityOnly').optional().isBoolean().withMessage('capitalCityOnly must be boolean'),
  query('stats').optional().isString().withMessage('stats must be string')
], validateRequest, async (req, res) => {
  try {
    const { state, noOfWeeks } = req.params;
    const { capitalCityOnly, stats } = req.query;
    const statsArray = stats ? stats.split(',') : null;
    const result = await coreLogicService.getAuctionResultsByWeeks(state, parseInt(noOfWeeks), capitalCityOnly === 'true', statsArray);
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /auction/results/weeks:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/auction/results/:state/search
 * @desc    Search auction results by date range
 * @access  Public
 */
router.get('/auction/results/:state/search', [
  param('state').isLength({ min: 2, max: 3 }).withMessage('State must be 2-3 characters'),
  query('fromDate').isISO8601().withMessage('fromDate must be valid ISO date'),
  query('toDate').isISO8601().withMessage('toDate must be valid ISO date'),
  query('capitalCityOnly').optional().isBoolean().withMessage('capitalCityOnly must be boolean'),
  query('stats').optional().isString().withMessage('stats must be string')
], validateRequest, async (req, res) => {
  try {
    const { state } = req.params;
    const { fromDate, toDate, capitalCityOnly, stats } = req.query;
    const statsArray = stats ? stats.split(',') : null;
    const result = await coreLogicService.searchAuctionResults(state, fromDate, toDate, capitalCityOnly === 'true', statsArray);
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /auction/results/search:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/auction/results/:state/compare/years/:years
 * @desc    Get auction results comparison by years
 * @access  Public
 */
router.get('/auction/results/:state/compare/years/:years', [
  param('state').isLength({ min: 2, max: 3 }).withMessage('State must be 2-3 characters'),
  param('years').isInt({ min: 2, max: 10 }).withMessage('years must be between 2 and 10'),
  query('capitalCityOnly').optional().isBoolean().withMessage('capitalCityOnly must be boolean'),
  query('stats').optional().isString().withMessage('stats must be string')
], validateRequest, async (req, res) => {
  try {
    const { state, years } = req.params;
    const { capitalCityOnly, stats } = req.query;
    const statsArray = stats ? stats.split(',') : null;
    const result = await coreLogicService.getAuctionResultsComparison(state, parseInt(years), capitalCityOnly === 'true', statsArray);
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /auction/results/compare:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/auction/details/:state/:postcode/:suburb
 * @desc    Get auction details for a specific suburb
 * @access  Public
 */
router.get('/auction/details/:state/:postcode/:suburb', [
  param('state').isLength({ min: 2, max: 3 }).withMessage('State must be 2-3 characters'),
  param('postcode').isLength({ min: 1, max: 4 }).withMessage('Postcode must be 1-4 characters'),
  param('suburb').isLength({ min: 1 }).withMessage('Suburb is required')
], validateRequest, async (req, res) => {
  try {
    const { state, postcode, suburb } = req.params;
    const result = await coreLogicService.getAuctionDetails(state, postcode, suburb);
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /auction/details:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ========================================
// CENSUS ENDPOINTS
// ========================================

/**
 * @route   POST /api/market-insights/census/statistics
 * @desc    Get census statistics data
 * @access  Public
 */
router.post('/census/statistics', [
  body('censusRequestList').isArray().withMessage('censusRequestList must be an array'),
  body('censusRequestList.*.locationId').isInt().withMessage('locationId must be integer'),
  body('censusRequestList.*.locationTypeId').isInt().withMessage('locationTypeId must be integer'),
  query('forLatestCensusYear').optional().isBoolean().withMessage('forLatestCensusYear must be boolean')
], validateRequest, async (req, res) => {
  try {
    const { censusRequestList } = req.body;
    const { forLatestCensusYear } = req.query;
    const result = await coreLogicService.getCensusStatistics(censusRequestList, forLatestCensusYear === 'true');
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /census/statistics:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/census/summary
 * @desc    Get census summary information
 * @access  Public
 */
router.get('/census/summary', [
  query('locationId').isInt().withMessage('locationId must be integer'),
  query('locationTypeId').isInt().withMessage('locationTypeId must be integer')
], validateRequest, async (req, res) => {
  try {
    const { locationId, locationTypeId } = req.query;
    const result = await coreLogicService.getCensusSummary(parseInt(locationId), parseInt(locationTypeId));
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /census/summary:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ========================================
// STATISTICS ENDPOINTS
// ========================================

/**
 * @route   POST /api/market-insights/statistics/timeseries
 * @desc    Get statistics time series data
 * @access  Public
 */
router.post('/statistics/timeseries', [
  body('seriesRequestList').isArray().withMessage('seriesRequestList must be an array'),
  body('seriesRequestList.*.locationId').isInt().withMessage('locationId must be integer'),
  body('seriesRequestList.*.locationTypeId').isInt().withMessage('locationTypeId must be integer'),
  body('seriesRequestList.*.metricTypeId').isInt().withMessage('metricTypeId must be integer'),
  body('seriesRequestList.*.propertyTypeId').isInt().withMessage('propertyTypeId must be integer')
], validateRequest, async (req, res) => {
  try {
    const { seriesRequestList } = req.body;
    const result = await coreLogicService.getStatisticsTimeSeries(seriesRequestList);
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /statistics/timeseries:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ========================================
// CHART ENDPOINTS
// ========================================

/**
 * @route   GET /api/market-insights/charts/census
 * @desc    Get census chart
 * @access  Public
 */
router.get('/charts/census', [
  query('chartSize').matches(/^\d+x\d+$/).withMessage('chartSize must be in format WIDTHxHEIGHT'),
  query('metricTypeGroupId').isInt().withMessage('metricTypeGroupId must be integer'),
  query('s1.lId').isInt().withMessage('s1.lId must be integer'),
  query('s1.lTId').isInt().withMessage('s1.lTId must be integer'),
  query('chartTypeId').optional().isInt().withMessage('chartTypeId must be integer'),
  query('s1.cTId').optional().isInt().withMessage('s1.cTId must be integer')
], validateRequest, async (req, res) => {
  try {
    const { chartSize, metricTypeGroupId, 's1.lId': locationId, 's1.lTId': locationTypeId, chartTypeId, 's1.cTId': chartType } = req.query;
    const result = await coreLogicService.getCensusChart(chartSize, parseInt(metricTypeGroupId), parseInt(locationId), parseInt(locationTypeId), chartTypeId ? parseInt(chartTypeId) : null, chartType ? parseInt(chartType) : null);
    if (result.success) {
      res.set('Content-Type', 'image/png');
      res.send(Buffer.from(result.data.image, 'base64'));
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /charts/census:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/market-insights/charts/timeseries
 * @desc    Get time series chart
 * @access  Public
 */
router.get('/charts/timeseries', [
  query('chartSize').matches(/^\d+x\d+$/).withMessage('chartSize must be in format WIDTHxHEIGHT'),
  query('s1.lId').isInt().withMessage('s1.lId must be integer'),
  query('s1.lTId').isInt().withMessage('s1.lTId must be integer'),
  query('s1.pTId').isInt().withMessage('s1.pTId must be integer'),
  query('s1.mTId').isInt().withMessage('s1.mTId must be integer'),
  query('fromDate').optional().isISO8601().withMessage('fromDate must be valid ISO date'),
  query('toDate').optional().isISO8601().withMessage('toDate must be valid ISO date'),
  query('s1.i').optional().isInt().withMessage('s1.i must be integer'),
  query('scale').optional().isFloat({ min: 0.1, max: 5 }).withMessage('scale must be between 0.1 and 5')
], validateRequest, async (req, res) => {
  try {
    const { 
      chartSize, 
      's1.lId': locationId, 
      's1.lTId': locationTypeId, 
      's1.pTId': propertyTypeId, 
      's1.mTId': metricTypeId, 
      fromDate, 
      toDate, 
      's1.i': interval = 1, 
      scale = 1 
    } = req.query;
    
    const result = await coreLogicService.getTimeSeriesChart(
      chartSize, 
      parseInt(locationId), 
      parseInt(locationTypeId), 
      parseInt(propertyTypeId), 
      parseInt(metricTypeId), 
      fromDate, 
      toDate, 
      parseInt(interval), 
      parseFloat(scale)
    );
    
    if (result.success) {
      res.set('Content-Type', 'image/png');
      res.send(Buffer.from(result.data.image, 'base64'));
    } else {
      res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    console.error('API Error in /charts/timeseries:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ========================================
// HEALTH CHECK
// ========================================

/**
 * @route   GET /api/market-insights/stats
 * @desc    Get Market Insights service statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const result = await coreLogicService.getAVMStats();
    res.json({
      ...result,
      data: {
        ...result.data,
        service: 'CoreLogic Market Insights API',
        features: [
          'Auction Summaries',
          'Auction Results',
          'Auction Details',
          'Census Statistics',
          'Census Summary',
          'Statistics Time Series',
          'Census Charts',
          'Time Series Charts'
        ]
      }
    });
  } catch (error) {
    console.error('API Error in /stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
