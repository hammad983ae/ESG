/**
 * Weather API Routes
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * API endpoints for weather data and visualizations
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const express = require('express');
const WeatherService = require('../services/weatherService');
const { validateWeatherRequest } = require('../middleware/validation');

const router = express.Router();
const weatherService = new WeatherService();

/**
 * GET /api/weather/image
 * Get weather image URL
 */
router.get('/image', validateWeatherRequest, async (req, res) => {
  try {
    const {
      lat,
      lon,
      asl,
      city,
      tz,
      imageType = 'meteogram',
      forecastDays = 7,
      historyDays = 1,
      look = 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang = 'en',
      dpi = 100,
      noLogo = true
    } = req.query;

    const result = await weatherService.getWeatherImage({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      asl: asl ? parseFloat(asl) : undefined,
      city,
      tz,
      imageType,
      forecastDays: parseInt(forecastDays),
      historyDays: parseInt(historyDays),
      look,
      lang,
      dpi: parseInt(dpi),
      noLogo: noLogo === 'true'
    });

    res.json(result);
  } catch (error) {
    console.error('Weather image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate weather image'
    });
  }
});

/**
 * GET /api/weather/agricultural/:lat/:lon
 * Get agricultural weather chart
 */
router.get('/agricultural/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const options = req.query;

    const result = await weatherService.getAgriculturalWeatherChart(
      parseFloat(lat),
      parseFloat(lon),
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Agricultural weather error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve agricultural weather data'
    });
  }
});

/**
 * GET /api/weather/meteogram/:lat/:lon
 * Get standard meteogram
 */
router.get('/meteogram/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const options = req.query;

    const result = await weatherService.getMeteogram(
      parseFloat(lat),
      parseFloat(lon),
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Meteogram error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate meteogram'
    });
  }
});

/**
 * GET /api/weather/weekly/:lat/:lon
 * Get weekly forecast
 */
router.get('/weekly/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const options = req.query;

    const result = await weatherService.getWeeklyForecast(
      parseFloat(lat),
      parseFloat(lon),
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Weekly forecast error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate weekly forecast'
    });
  }
});

/**
 * GET /api/weather/solar/:lat/:lon
 * Get solar meteogram
 */
router.get('/solar/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const options = req.query;

    const result = await weatherService.getSolarMeteogram(
      parseFloat(lat),
      parseFloat(lon),
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Solar meteogram error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate solar meteogram'
    });
  }
});

/**
 * GET /api/weather/sounding/:lat/:lon
 * Get atmospheric sounding
 */
router.get('/sounding/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const options = req.query;

    const result = await weatherService.getAtmosphericSounding(
      parseFloat(lat),
      parseFloat(lon),
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Atmospheric sounding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate atmospheric sounding'
    });
  }
});

/**
 * GET /api/weather/agricultural-data/:lat/:lon
 * Get comprehensive agricultural weather data
 */
router.get('/agricultural-data/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const { cropType } = req.query;

    const result = await weatherService.getAgriculturalWeatherData(
      parseFloat(lat),
      parseFloat(lon),
      cropType
    );

    res.json(result);
  } catch (error) {
    console.error('Agricultural data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve agricultural weather data'
    });
  }
});

/**
 * GET /api/weather/stats
 * Get weather service statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = weatherService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Weather stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve weather statistics'
    });
  }
});

/**
 * POST /api/weather/clear-cache
 * Clear weather cache
 */
router.post('/clear-cache', async (req, res) => {
  try {
    const result = weatherService.clearCache();
    res.json(result);
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear weather cache'
    });
  }
});

/**
 * GET /api/weather/health
 * Health check
 */
router.get('/health', async (req, res) => {
  try {
    const health = await weatherService.healthCheck();
    res.json(health);
  } catch (error) {
    console.error('Weather health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Weather service health check failed'
    });
  }
});

module.exports = router;
