/**
 * Meteoblue Weather API Service - Backend Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Backend service for Meteoblue Weather Image API integration
 * Provides weather data processing and caching for agricultural and property applications
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const axios = require('axios');
const NodeCache = require('node-cache');

class WeatherService {
  constructor() {
    this.baseUrl = 'https://my.meteoblue.com/visimage';
    this.apiKey = process.env.METEOBLUE_API_KEY;
    
    // Validate API key
    if (!this.apiKey) {
      console.error('❌ Meteoblue API key not configured!');
      console.error('Please set METEOBLUE_API_KEY environment variable');
      throw new Error('Meteoblue API key not configured');
    }
    
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.timeout = 15000;
    
    // Cache for weather images (10 minute TTL)
    this.cache = new NodeCache({ stdTTL: 600 });
    
    // Rate limiting
    this.requestCount = 0;
    this.rateLimitWindow = 60000; // 1 minute
    this.maxRequestsPerMinute = 60; // Meteoblue rate limit
    this.requestTimestamps = [];
  }

  /**
   * Get weather image URL
   */
  async getWeatherImage(params) {
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
    } = params;

    const cacheKey = `weather_${lat}_${lon}_${imageType}_${forecastDays}_${historyDays}_${look}_${lang}`;
    const cachedResult = this.cache.get(cacheKey);
    
    if (cachedResult) {
      console.log('Returning cached weather image');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const imageUrl = this.buildImageUrl({
        lat,
        lon,
        asl,
        city,
        tz,
        imageType,
        forecastDays,
        historyDays,
        look,
        lang,
        dpi,
        noLogo
      });

      const result = {
        success: true,
        imageUrl,
        metadata: {
          location: { lat, lon, asl, city, tz },
          imageType,
          forecastDays,
          historyDays,
          look,
          lang,
          generatedAt: new Date().toISOString()
        }
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      this.requestCount++;

      return result;
    } catch (error) {
      console.error('Weather image generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate weather image'
      };
    }
  }

  /**
   * Get agricultural weather chart
   */
  async getAgriculturalWeatherChart(lat, lon, options = {}) {
    const {
      asl,
      city,
      tz,
      forecastDays = 7,
      look = 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang = 'en'
    } = options;

    return this.getWeatherImage({
      lat,
      lon,
      asl,
      city,
      tz,
      imageType: 'agronomy',
      forecastDays,
      look,
      lang,
      noLogo: true
    });
  }

  /**
   * Get standard meteogram
   */
  async getMeteogram(lat, lon, options = {}) {
    const {
      asl,
      city,
      tz,
      forecastDays = 7,
      historyDays = 1,
      look = 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang = 'en'
    } = options;

    return this.getWeatherImage({
      lat,
      lon,
      asl,
      city,
      tz,
      imageType: 'meteogram',
      forecastDays,
      historyDays,
      look,
      lang,
      noLogo: true
    });
  }

  /**
   * Get weekly forecast pictogram
   */
  async getWeeklyForecast(lat, lon, options = {}) {
    const {
      asl,
      city,
      tz,
      look = 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang = 'en'
    } = options;

    return this.getWeatherImage({
      lat,
      lon,
      asl,
      city,
      tz,
      imageType: 'picto_7d',
      look,
      lang,
      noLogo: true
    });
  }

  /**
   * Get solar meteogram for agricultural planning
   */
  async getSolarMeteogram(lat, lon, options = {}) {
    const {
      asl,
      city,
      tz,
      forecastDays = 7,
      look = 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang = 'en'
    } = options;

    return this.getWeatherImage({
      lat,
      lon,
      asl,
      city,
      tz,
      imageType: 'meteogram_solar',
      forecastDays,
      look,
      lang,
      noLogo: true
    });
  }

  /**
   * Get atmospheric sounding
   */
  async getAtmosphericSounding(lat, lon, options = {}) {
    const {
      asl,
      city,
      tz,
      look = 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang = 'en'
    } = options;

    return this.getWeatherImage({
      lat,
      lon,
      asl,
      city,
      tz,
      imageType: 'sounding',
      look,
      lang
    });
  }

  /**
   * Get comprehensive weather data for agricultural analysis
   */
  async getAgriculturalWeatherData(lat, lon, cropType = null) {
    try {
      // Get multiple weather visualizations
      const [meteogram, agriculturalChart, weeklyForecast] = await Promise.allSettled([
        this.getMeteogram(lat, lon, { forecastDays: 7 }),
        this.getAgriculturalWeatherChart(lat, lon, { forecastDays: 7 }),
        this.getWeeklyForecast(lat, lon)
      ]);

      const result = {
        success: true,
        location: { lat, lon },
        images: {
          meteogram: meteogram.status === 'fulfilled' ? meteogram.value : null,
          agriculturalChart: agriculturalChart.status === 'fulfilled' ? agriculturalChart.value : null,
          weeklyForecast: weeklyForecast.status === 'fulfilled' ? weeklyForecast.value : null
        },
        agriculturalInsights: this.generateAgriculturalInsights(cropType),
        generatedAt: new Date().toISOString()
      };

      return result;
    } catch (error) {
      console.error('Agricultural weather data error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve agricultural weather data'
      };
    }
  }

  /**
   * Generate agricultural insights based on weather data
   */
  generateAgriculturalInsights(cropType) {
    // This is a simplified mock implementation
    // In production, this would analyze actual weather data
    const insights = {
      growingDegreeDays: Math.floor(Math.random() * 500) + 1000,
      chillHours: Math.floor(Math.random() * 200) + 600,
      frostRisk: Math.random() > 0.8,
      droughtRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      irrigationRecommendation: ['none', 'light', 'moderate', 'heavy'][Math.floor(Math.random() * 4)],
      plantingRecommendation: ['optimal', 'good', 'caution', 'avoid'][Math.floor(Math.random() * 4)],
      cropSpecificAdvice: this.getCropSpecificAdvice(cropType)
    };

    return insights;
  }

  /**
   * Get crop-specific agricultural advice
   */
  getCropSpecificAdvice(cropType) {
    const advice = {
      'wheat': 'Monitor soil moisture levels. Consider irrigation if rainfall is below 25mm/week.',
      'corn': 'Ensure adequate water during tasseling stage. Watch for heat stress above 35°C.',
      'grapes': 'Monitor for fungal diseases during humid periods. Prune for air circulation.',
      'apples': 'Check for frost damage during flowering. Ensure adequate chilling hours.',
      'citrus': 'Protect from frost below -2°C. Monitor for citrus canker in humid conditions.',
      'cotton': 'Plant when soil temperature reaches 15°C. Monitor for boll weevil activity.',
      'rice': 'Maintain 5-10cm water depth. Watch for blast disease in humid conditions.'
    };

    return advice[cropType?.toLowerCase()] || 'Monitor weather conditions and adjust management practices accordingly.';
  }

  /**
   * Build Meteoblue image URL
   */
  buildImageUrl(params) {
    const {
      lat,
      lon,
      asl,
      city,
      tz,
      imageType,
      forecastDays,
      historyDays,
      look,
      lang,
      dpi,
      noLogo
    } = params;

    const urlParams = new URLSearchParams();
    urlParams.append('lat', lat.toString());
    urlParams.append('lon', lon.toString());
    urlParams.append('apikey', this.apiKey);
    
    if (asl) urlParams.append('asl', asl.toString());
    if (city) urlParams.append('city', city);
    if (tz) urlParams.append('tz', tz);
    if (forecastDays) urlParams.append('forecast_days', forecastDays.toString());
    if (historyDays) urlParams.append('history_days', historyDays.toString());
    if (look) urlParams.append('look', look);
    if (lang) urlParams.append('lang', lang);
    if (dpi) urlParams.append('dpi', dpi.toString());

    const imageTypeWithLogo = noLogo ? `${imageType}_nologo` : imageType;
    
    return `${this.baseUrl}/${imageTypeWithLogo}?${urlParams.toString()}`;
  }

  /**
   * Check rate limiting
   */
  checkRateLimit() {
    const now = Date.now();
    
    // Remove timestamps older than the rate limit window
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.rateLimitWindow
    );
    
    if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
      return false;
    }
    
    this.requestTimestamps.push(now);
    return true;
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      service: 'WeatherService',
      version: '1.0.0',
      cache: {
        keys: this.cache.keys().length,
        hits: 0, // Would need to track this
        misses: 0, // Would need to track this
        ksize: this.cache.getStats().keys,
        vsize: this.cache.getStats().vsize
      },
      requests: this.requestCount,
      rateLimit: {
        current: this.requestTimestamps.length,
        max: this.maxRequestsPerMinute,
        window: this.rateLimitWindow
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear weather cache
   */
  clearCache() {
    this.cache.flushAll();
    return {
      success: true,
      message: 'Weather cache cleared'
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      // Test API connectivity with a simple request
      const testUrl = this.buildImageUrl({
        lat: -37.8136,
        lon: 144.9631,
        imageType: 'picto_1d',
        forecastDays: 1
      });

      const response = await axios.get(testUrl, { timeout: 5000 });
      
      return {
        success: true,
        status: 'healthy',
        apiKey: this.apiKey ? 'configured' : 'missing',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = WeatherService;
