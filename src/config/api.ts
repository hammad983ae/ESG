/**
 * API Configuration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Centralized API configuration for the frontend
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

// Production API URL
const PRODUCTION_API_URL = 'https://esg-production.up.railway.app/api';

// Development API URL (fallback)
const DEVELOPMENT_API_URL = 'http://localhost:3001/api';

// Determine the API URL based on environment
export const API_BASE_URL = import.meta.env.PROD 
  ? PRODUCTION_API_URL 
  : import.meta.env.VITE_API_URL || DEVELOPMENT_API_URL;

// Service-specific URLs
export const API_URLS = {
  // Core services
  HEALTH: `${API_BASE_URL.replace('/api', '')}/health`,
  STATUS: `${API_BASE_URL}/status`,
  
  // OCR services
  OCR_EXTRACT: `${API_BASE_URL}/ocr/extract`,
  OCR_EXTRACT_BASE64: `${API_BASE_URL}/ocr/extract-base64`,
  
  // Valuation services
  VALUATIONS: `${API_BASE_URL}/valuations`,
  VALUATIONS_SEARCH: `${API_BASE_URL}/valuations/search`,
  VALUATIONS_STATS: `${API_BASE_URL}/valuations/stats`,
  
  // CoreLogic services
  CORELOGIC_SEARCH: `${API_BASE_URL}/corelogic/search`,
  CORELOGIC_PROPERTY: `${API_BASE_URL}/corelogic/property`,
  
  // AVM services
  AVM_ORIGINATION: `${API_BASE_URL}/avm/origination`,
  AVM_CONSUMER: `${API_BASE_URL}/avm/consumer`,
  AVM_CONSUMER_BAND: `${API_BASE_URL}/avm/consumer/band`,
  AVM_LIVE: `${API_BASE_URL}/avm/live`,
  AVM_REPORT: `${API_BASE_URL}/avm/report`,
  
  // Market Insights services
  MARKET_INSIGHTS_AUCTION: `${API_BASE_URL}/market-insights/auction`,
  MARKET_INSIGHTS_CENSUS: `${API_BASE_URL}/market-insights/census`,
  MARKET_INSIGHTS_CHARTS: `${API_BASE_URL}/market-insights/charts`,
  MARKET_INSIGHTS_STATS: `${API_BASE_URL}/market-insights/stats`,
} as const;

// Environment configuration
export const ENV_CONFIG = {
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  API_URL: API_BASE_URL,
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

export default API_BASE_URL;
