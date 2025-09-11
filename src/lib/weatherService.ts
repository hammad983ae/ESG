/**
 * Meteoblue Weather Image API Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Comprehensive weather data integration using Meteoblue Image API
 * Provides weather visualizations and data for agricultural and property applications
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WeatherLocation {
  lat: number;
  lon: number;
  asl?: number; // altitude above sea level
  city?: string; // location name for display
  tz?: string; // timezone
}

export interface WeatherImageConfig {
  location: WeatherLocation;
  imageType: WeatherImageType;
  forecastDays?: number;
  historyDays?: number;
  look?: WeatherUnits;
  lang?: WeatherLanguage;
  dpi?: number;
  noLogo?: boolean;
}

export type WeatherImageType = 
  | 'meteogram' // Standard meteogram
  | 'meteogram_verify' // Verification meteogram
  | 'meteogram_solar' // Solar meteogram
  | 'meteogram_solar_season' // Seasonal solar
  | 'agronomy' // Agricultural weather chart
  | 'aviation' // Aviation weather chart
  | 'picto_1d' // 1-day pictogram
  | 'picto_3d' // 3-day pictogram
  | 'picto_7d' // 7-day pictogram
  | 'picto_14d' // 14-day pictogram
  | 'sounding' // Atmospheric sounding
  | 'cross_section'; // Cross-section view

export type WeatherUnits = 
  | 'CELSIUS_MILLIMETER_METER_PER_SECOND'
  | 'FAHRENHEIT_INCH_MILE_PER_HOUR'
  | 'CELSIUS_MILLIMETER_KILOMETER_PER_HOUR'
  | 'CELSIUS_MILLIMETER_KNOT'
  | 'CELSIUS_MILLIMETER_BEAUFORT'
  | 'FAHRENHEIT_INCH_KILOMETER_PER_HOUR'
  | 'FAHRENHEIT_INCH_KNOT'
  | 'FAHRENHEIT_INCH_BEAUFORT';

export type WeatherLanguage = 
  | 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'ro' | 'ru' 
  | 'nl' | 'tr' | 'hu' | 'bg' | 'ar' | 'cs' | 'el' | 'ka' 
  | 'pl' | 'sk' | 'sr';

export interface WeatherImageResponse {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // base64 encoded image
  error?: string;
  metadata?: {
    location: WeatherLocation;
    imageType: WeatherImageType;
    generatedAt: string;
    validUntil: string;
  };
}

export interface WeatherServiceStats {
  requests: number;
  cacheHits: number;
  cacheMisses: number;
  errors: number;
  lastRequest: string;
}

export interface AgriculturalWeatherData {
  location: WeatherLocation;
  currentConditions: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    uvIndex: number;
  };
  forecast: {
    daily: Array<{
      date: string;
      maxTemp: number;
      minTemp: number;
      precipitation: number;
      windSpeed: number;
      conditions: string;
    }>;
    hourly: Array<{
      time: string;
      temperature: number;
      precipitation: number;
      windSpeed: number;
      conditions: string;
    }>;
  };
  agriculturalInsights: {
    growingDegreeDays: number;
    chillHours: number;
    frostRisk: boolean;
    droughtRisk: 'low' | 'medium' | 'high';
    irrigationRecommendation: 'none' | 'light' | 'moderate' | 'heavy';
    plantingRecommendation: 'optimal' | 'good' | 'caution' | 'avoid';
  };
}

// ============================================================================
// WEATHER SERVICE CLASS
// ============================================================================

class WeatherService {
  private readonly baseUrl = 'https://my.meteoblue.com/visimage';
  private readonly apiKey: string;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private readonly cache = new Map<string, { data: WeatherImageResponse; expiry: number }>();
  private readonly cacheTimeout = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.apiKey = import.meta.env.VITE_METEOBLUE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ Meteoblue API key not configured. Weather features will be limited.');
    }
  }

  /**
   * Get weather image URL for embedding in components
   */
  async getWeatherImage(config: WeatherImageConfig): Promise<WeatherImageResponse> {
    const cacheKey = this.generateCacheKey(config);
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    if (!this.apiKey) {
      return {
        success: false,
        error: 'Meteoblue API key not configured'
      };
    }

    try {
      const imageUrl = this.buildImageUrl(config);
      
      // For now, return the URL. In production, you might want to proxy through your backend
      const response: WeatherImageResponse = {
        success: true,
        imageUrl,
        metadata: {
          location: config.location,
          imageType: config.imageType,
          generatedAt: new Date().toISOString(),
          validUntil: new Date(Date.now() + this.cacheTimeout).toISOString()
        }
      };

      // Cache the response
      this.cache.set(cacheKey, {
        data: response,
        expiry: Date.now() + this.cacheTimeout
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate weather image'
      };
    }
  }

  /**
   * Get agricultural weather chart
   */
  async getAgriculturalWeatherChart(
    location: WeatherLocation,
    forecastDays: number = 7
  ): Promise<WeatherImageResponse> {
    return this.getWeatherImage({
      location,
      imageType: 'agronomy',
      forecastDays,
      look: 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang: 'en',
      noLogo: true
    });
  }

  /**
   * Get standard meteogram for property analysis
   */
  async getMeteogram(
    location: WeatherLocation,
    forecastDays: number = 7,
    historyDays: number = 1
  ): Promise<WeatherImageResponse> {
    return this.getWeatherImage({
      location,
      imageType: 'meteogram',
      forecastDays,
      historyDays,
      look: 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang: 'en',
      noLogo: true
    });
  }

  /**
   * Get 7-day weather pictogram
   */
  async getWeeklyForecast(
    location: WeatherLocation
  ): Promise<WeatherImageResponse> {
    return this.getWeatherImage({
      location,
      imageType: 'picto_7d',
      look: 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang: 'en',
      noLogo: true
    });
  }

  /**
   * Get solar meteogram for agricultural planning
   */
  async getSolarMeteogram(
    location: WeatherLocation,
    forecastDays: number = 7
  ): Promise<WeatherImageResponse> {
    return this.getWeatherImage({
      location,
      imageType: 'meteogram_solar',
      forecastDays,
      look: 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang: 'en',
      noLogo: true
    });
  }

  /**
   * Get atmospheric sounding for advanced weather analysis
   */
  async getAtmosphericSounding(
    location: WeatherLocation
  ): Promise<WeatherImageResponse> {
    return this.getWeatherImage({
      location,
      imageType: 'sounding',
      look: 'CELSIUS_MILLIMETER_METER_PER_SECOND',
      lang: 'en'
    });
  }

  /**
   * Generate agricultural weather insights
   * This would typically call a backend service that processes weather data
   */
  async getAgriculturalInsights(
    location: WeatherLocation,
    cropType?: string
  ): Promise<AgriculturalWeatherData> {
    // This is a mock implementation
    // In production, this would call your backend service that processes weather data
    return {
      location,
      currentConditions: {
        temperature: 22.5,
        humidity: 65,
        windSpeed: 3.2,
        precipitation: 0,
        uvIndex: 6
      },
      forecast: {
        daily: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          maxTemp: 20 + Math.random() * 10,
          minTemp: 10 + Math.random() * 5,
          precipitation: Math.random() * 5,
          windSpeed: 2 + Math.random() * 4,
          conditions: ['sunny', 'partly cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)]
        })),
        hourly: Array.from({ length: 24 }, (_, i) => ({
          time: `${i.toString().padStart(2, '0')}:00`,
          temperature: 15 + Math.random() * 15,
          precipitation: Math.random() * 2,
          windSpeed: 1 + Math.random() * 6,
          conditions: ['sunny', 'partly cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)]
        }))
      },
      agriculturalInsights: {
        growingDegreeDays: 1250,
        chillHours: 800,
        frostRisk: false,
        droughtRisk: 'low',
        irrigationRecommendation: 'light',
        plantingRecommendation: 'optimal'
      }
    };
  }

  /**
   * Build Meteoblue image URL
   */
  private buildImageUrl(config: WeatherImageConfig): string {
    const params = new URLSearchParams();
    
    // Required parameters
    params.append('lat', config.location.lat.toString());
    params.append('lon', config.location.lon.toString());
    params.append('apikey', this.apiKey);
    
    // Optional parameters
    if (config.location.asl) params.append('asl', config.location.asl.toString());
    if (config.location.city) params.append('city', config.location.city);
    if (config.location.tz) params.append('tz', config.location.tz);
    if (config.forecastDays) params.append('forecast_days', config.forecastDays.toString());
    if (config.historyDays) params.append('history_days', config.historyDays.toString());
    if (config.look) params.append('look', config.look);
    if (config.lang) params.append('lang', config.lang);
    if (config.dpi) params.append('dpi', config.dpi.toString());
    
    const imageType = config.noLogo ? `${config.imageType}_nologo` : config.imageType;
    
    return `${this.baseUrl}/${imageType}?${params.toString()}`;
  }

  /**
   * Generate cache key for request
   */
  private generateCacheKey(config: WeatherImageConfig): string {
    return JSON.stringify({
      lat: config.location.lat,
      lon: config.location.lon,
      asl: config.location.asl,
      imageType: config.imageType,
      forecastDays: config.forecastDays,
      historyDays: config.historyDays,
      look: config.look,
      lang: config.lang,
      dpi: config.dpi,
      noLogo: config.noLogo
    });
  }

  /**
   * Clear weather cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get service statistics
   */
  getStats(): WeatherServiceStats {
    return {
      requests: this.cache.size,
      cacheHits: 0, // Would need to track this
      cacheMisses: 0, // Would need to track this
      errors: 0, // Would need to track this
      lastRequest: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
export default weatherService;
