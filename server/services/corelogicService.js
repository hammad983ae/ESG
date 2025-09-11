
 
 
 
 /**
 * CoreLogic API Service - Address Matcher & AVM Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Comprehensive CoreLogic API integration including:
 * - Address Matcher API for property address validation
 * - AVM (Automated Valuation Model) API for property valuations
 * - IntelliVal® origination and consumer AVM services
 * - Live AVM services with property attribute modifications
 * - AVM reporting and historical data
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 2.0.0
 */

const axios = require('axios');
const NodeCache = require('node-cache');

class CoreLogicService {
  constructor() {
    this.baseUrl = 'https://api-sbox.corelogic.asia';
    this.tokenUrl = 'https://api-sbox.corelogic.asia/access/as/token.oauth2';
    this.clientKey = process.env.CORELOGIC_CLIENT_KEY;
    this.clientSecret = process.env.CORELOGIC_CLIENT_SECRET;
    
    // Validate credentials
    if (!this.clientKey || !this.clientSecret) {
      console.error('❌ CoreLogic API credentials not configured!');
      console.error('Please set CORELOGIC_CLIENT_KEY and CORELOGIC_CLIENT_SECRET environment variables');
      throw new Error('CoreLogic API credentials not configured');
    }
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.timeout = 10000;
    
    // OAuth token management
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // Cache for address matches (5 minute TTL)
    this.cache = new NodeCache({ stdTTL: 300 });
    
    // Rate limiting
    this.requestCount = 0;
    this.rateLimitWindow = 60000; // 1 minute
    this.maxRequestsPerMinute = 100;
    this.requestTimestamps = [];
  }

  /**
   * Search for a property address using CoreLogic Address Matcher API
   */
  async searchAddress(address, clientName = 'Sustaino Pro') {
    if (!address || address.trim().length === 0) {
      return {
        success: false,
        error: 'Address is required',
        matchQuality: 'no-match'
      };
    }

    const trimmedAddress = address.trim();
    
    if (trimmedAddress.length > 1000) {
      return {
        success: false,
        error: 'Address exceeds maximum length of 1000 characters',
        matchQuality: 'no-match'
      };
    }

    // Check cache first
    const cacheKey = `address_${Buffer.from(trimmedAddress).toString('base64')}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached address match result');
      return cachedResult;
    }

    // Check rate limiting
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        matchQuality: 'no-match'
      };
    }

    try {
      const response = await this.makeRequest(trimmedAddress, clientName);
      const result = this.parseResponse(response, trimmedAddress);
      
      // Cache successful results
      if (result.success) {
        this.cache.set(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      console.error('CoreLogic API Error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        matchQuality: 'no-match'
      };
    }
  }

  /**
   * Make HTTP request to CoreLogic API with retry logic
   */
  async makeRequest(address, clientName) {
    // Get OAuth token first
    const accessToken = await this.getAccessToken();
    
    const url = `${this.baseUrl}/search/au/matcher/address`;
    const params = {
      q: address,
      clientName: clientName.substring(0, 100)
    };

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'User-Agent': 'Sustaino-Pro-Backend/1.0.0'
    };

    let lastError = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.get(url, {
          params,
          headers,
          timeout: this.timeout,
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        });

        if (response.status === 200) {
          return response.data;
        } else if (response.status === 401) {
          throw new Error('Unauthorized: Invalid API credentials');
        } else if (response.status === 403) {
          throw new Error('Forbidden: API access denied');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
        
        if (attempt < this.maxRetries && this.isRetryableError(error)) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`Retry attempt ${attempt} after ${delay}ms delay`);
          await this.delay(delay);
        } else {
          break;
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return true;
    }
    if (error.response && error.response.status >= 500) {
      return true;
    }
    return false;
  }

  /**
   * Get OAuth 2.0 access token
   */
  async getAccessToken() {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔑 Requesting OAuth token from CoreLogic...');
      
      const response = await axios.post(this.tokenUrl, {
        grant_type: 'client_credentials',
        client_id: this.clientKey,
        client_secret: this.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: this.timeout
      });

      if (response.data && response.data.access_token) {
        this.accessToken = response.data.access_token;
        // Set expiry time (usually 3600 seconds = 1 hour)
        const expiresIn = response.data.expires_in || 3600;
        this.tokenExpiry = Date.now() + (expiresIn * 1000) - 60000; // 1 minute buffer
        
        console.log('✅ OAuth token obtained successfully');
        return this.accessToken;
      } else {
        throw new Error('Invalid token response from CoreLogic');
      }
    } catch (error) {
      console.error('❌ Failed to get OAuth token:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw new Error(`OAuth token request failed: ${error.message}`);
    }
  }

  /**
   * Parse CoreLogic API response into standardized format
   */
  parseResponse(response, originalAddress = '') {
    try {
      if (!response || typeof response !== 'object') {
        return {
          success: false,
          error: 'Invalid response format',
          matchQuality: 'no-match'
        };
      }

      // Check if response has matchDetails (CoreLogic format)
      const matchDetails = response.matchDetails || response;
      
      // Extract match information from response
      const matchType = matchDetails.matchType || 'N';
      const matchRule = matchDetails.matchRule || '';
      const updateIndicator = matchDetails.updateIndicator || 'U';
      const updateDetail = matchDetails.updateDetail || '';
      const propertyId = matchDetails.propertyId || '';

      // Create match code from available data
      const matchCode = matchType + matchRule + updateDetail;

      // Use the original search query as the display address
      // since CoreLogic API doesn't return formatted addresses in the response
      let formattedAddress = response.address || response.formattedAddress || originalAddress;

      const addressMatch = {
        propertyId: propertyId.toString(),
        address: formattedAddress,
        matchCode,
        matchType,
        matchRule,
        updateIndicator,
        updateDetail,
        confidence: this.calculateConfidence(matchType, matchRule),
        coordinates: response.coordinates ? {
          latitude: parseFloat(response.coordinates.latitude) || 0,
          longitude: parseFloat(response.coordinates.longitude) || 0
        } : undefined,
        suburb: response.suburb || response.locality,
        state: response.state,
        postcode: response.postcode,
        streetName: response.streetName,
        streetNumber: response.streetNumber,
        streetType: response.streetType
      };

      const matchQuality = this.determineMatchQuality(matchType);

      return {
        success: true,
        data: addressMatch,
        matchQuality
      };
    } catch (error) {
      console.error('Parse response error:', error);
      return {
        success: false,
        error: 'Failed to parse response',
        matchQuality: 'no-match'
      };
    }
  }

  /**
   * Calculate confidence score based on match type and rule
   */
  calculateConfidence(matchType, matchRule) {
    const baseConfidence = {
      'E': 0.95, // Exact match
      'A': 0.90, // Alias match
      'P': 0.80, // Partial match
      'F': 0.70, // Fuzzy match
      'B': 0.60, // Building level match
      'S': 0.50, // Street level match
      'X': 0.30, // Postal record
      'D': 0.00, // Duplicate
      'N': 0.00, // No match
      'M': 0.00, // Missing elements
      'Q': 0.00  // Query only
    };

    let confidence = baseConfidence[matchType] || 0;

    // Adjust confidence based on specific rules
    if (matchRule === '000' || matchRule === '001' || matchRule === '002') {
      confidence += 0.05; // High confidence rules
    } else if (matchRule.startsWith('0') && parseInt(matchRule) < 50) {
      confidence += 0.02; // Medium confidence rules
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Determine match quality category
   */
  determineMatchQuality(matchType) {
    switch (matchType) {
      case 'E':
      case 'A':
        return 'exact';
      case 'P':
        return 'partial';
      case 'F':
        return 'fuzzy';
      case 'B':
        return 'building';
      case 'S':
        return 'street';
      case 'X':
      case 'D':
      case 'N':
      case 'M':
      case 'Q':
      default:
        return 'no-match';
    }
  }

  /**
   * Check rate limiting
   */
  checkRateLimit() {
    const now = Date.now();
    
    // Remove timestamps older than the window
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.rateLimitWindow
    );
    
    // Check if we're under the limit
    if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
      return false;
    }
    
    // Add current request timestamp
    this.requestTimestamps.push(now);
    return true;
  }

  /**
   * Format address for optimal matching
   */
  formatAddressForMatching(address) {
    // Remove extra whitespace and normalize
    let formatted = address.trim().replace(/\s+/g, ' ');
    
    // Ensure proper format: [unitNumber] / [streetNumber] [streetName] [streetType] [suburb] [stateCode] [postcode]
    return formatted;
  }

  /**
   * Validate if an address match is acceptable for business use
   */
  isAcceptableMatch(match, minConfidence = 0.7) {
    if (!match || !match.propertyId) return false;
    if (match.matchType === 'N' || match.matchType === 'M' || match.matchType === 'D') return false;
    if (match.confidence < minConfidence) return false;
    
    return true;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      ksize: this.cache.getStats().ksize,
      vsize: this.cache.getStats().vsize
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.flushAll();
    return { message: 'Cache cleared successfully' };
  }

  // ============================================================================
  // AVM (AUTOMATED VALUATION MODEL) API METHODS
  // ============================================================================

  /**
   * Get Current Origination AVM for a property
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {string} countryCode - Country code (au, nz)
   * @param {string} roundTo - Optional rounding value
   * @returns {Promise<Object>} AVM origination data
   */
  async getCurrentOriginationAVM(propertyId, countryCode = 'au', roundTo = null) {
    const cacheKey = `origination_${propertyId}_${countryCode}_${roundTo || 'none'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached origination AVM result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/${countryCode}/properties/${propertyId}/avm/intellival/origination/current`;
      
      const params = {};
      if (roundTo) {
        params.roundTo = roundTo;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'origination',
        timestamp: new Date().toISOString()
      };

      // Cache successful results for 10 minutes
      this.cache.set(cacheKey, result, 600);
      return result;

    } catch (error) {
      console.error('Origination AVM Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get Current Consumer Band AVM for a property
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {string} countryCode - Country code (au, nz)
   * @returns {Promise<Object>} AVM consumer band data
   */
  async getCurrentConsumerBandAVM(propertyId, countryCode = 'au') {
    const cacheKey = `consumer_band_${propertyId}_${countryCode}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached consumer band AVM result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/${countryCode}/properties/${propertyId}/avm/intellival/consumer/band/current`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'consumer_band',
        timestamp: new Date().toISOString()
      };

      // Cache successful results for 10 minutes
      this.cache.set(cacheKey, result, 600);
      return result;

    } catch (error) {
      console.error('Consumer Band AVM Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get Consumer AVM history for a property
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {string} countryCode - Country code (au, nz)
   * @param {string} fromValuationDate - Optional start date (YYYY-MM-DD)
   * @param {string} roundTo - Optional rounding value
   * @returns {Promise<Object>} AVM consumer history data
   */
  async getConsumerAVMHistory(propertyId, countryCode = 'au', fromValuationDate = null, roundTo = null) {
    const cacheKey = `consumer_history_${propertyId}_${countryCode}_${fromValuationDate || 'all'}_${roundTo || 'none'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached consumer AVM history result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/${countryCode}/properties/${propertyId}/avm/intellival/consumer`;
      
      const params = {};
      if (fromValuationDate) {
        params.fromValuationDate = fromValuationDate;
      }
      if (roundTo) {
        params.roundTo = roundTo;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'consumer_history',
        timestamp: new Date().toISOString()
      };

      // Cache successful results for 15 minutes
      this.cache.set(cacheKey, result, 900);
      return result;

    } catch (error) {
      console.error('Consumer AVM History Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get Origination AVM history for a property
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {string} fromValuationDate - Start date (YYYY-MM-DD)
   * @param {string} roundTo - Optional rounding value
   * @returns {Promise<Object>} AVM origination history data
   */
  async getOriginationAVMHistory(propertyId, fromValuationDate, roundTo = null) {
    const cacheKey = `origination_history_${propertyId}_${fromValuationDate}_${roundTo || 'none'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached origination AVM history result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/au/properties/${propertyId}/avm/intellival/origination`;
      
      const params = { fromValuationDate };
      if (roundTo) {
        params.roundTo = roundTo;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'origination_history',
        timestamp: new Date().toISOString()
      };

      // Cache successful results for 15 minutes
      this.cache.set(cacheKey, result, 900);
      return result;

    } catch (error) {
      console.error('Origination AVM History Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get Live Origination AVM with property modifications
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {Object} propertyData - Property attributes to modify
   * @returns {Promise<Object>} Live AVM origination data
   */
  async getLiveOriginationAVM(propertyId, propertyData) {
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/au/properties/${propertyId}/liveavm/intellival/origination`;

      const response = await axios.post(url, propertyData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      return {
        success: true,
        data: response.data,
        type: 'live_origination',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Live Origination AVM Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get Live Consumer AVM with property modifications
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {Object} propertyData - Property attributes to modify
   * @returns {Promise<Object>} Live AVM consumer data
   */
  async getLiveConsumerAVM(propertyId, propertyData) {
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/au/properties/${propertyId}/liveavm/intellival/consumer`;

      const response = await axios.post(url, propertyData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      return {
        success: true,
        data: response.data,
        type: 'live_consumer',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Live Consumer AVM Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get Live Consumer Band AVM with property modifications
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {Object} propertyData - Property attributes to modify
   * @returns {Promise<Object>} Live AVM consumer band data
   */
  async getLiveConsumerBandAVM(propertyId, propertyData) {
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/au/properties/${propertyId}/liveavm/intellival/consumer/band`;

      const response = await axios.post(url, propertyData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      return {
        success: true,
        data: response.data,
        type: 'live_consumer_band',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Live Consumer Band AVM Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get AVM Consumer Report URL
   * @param {string|number} propertyId - CoreLogic property ID
   * @returns {Promise<Object>} AVM report URL
   */
  async getAVMConsumerReport(propertyId) {
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm-report/au/properties/${propertyId}/avm/intellival/consumer`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': '*/*',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      return {
        success: true,
        data: response.data,
        type: 'consumer_report',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AVM Consumer Report Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get AVM Origination Report URL
   * @param {string|number} propertyId - CoreLogic property ID
   * @returns {Promise<Object>} AVM report URL
   */
  async getAVMOriginationReport(propertyId) {
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm-report/au/properties/${propertyId}/avm/intellival/origination`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': '*/*',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      return {
        success: true,
        data: response.data,
        type: 'origination_report',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AVM Origination Report Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get AVM for specific date
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {string} valuationDate - Date in YYYY-MM-DD format
   * @param {string} countryCode - Country code (au, nz)
   * @param {string} roundTo - Optional rounding value
   * @returns {Promise<Object>} AVM data for specific date
   */
  async getAVMForDate(propertyId, valuationDate, countryCode = 'au', roundTo = null) {
    const cacheKey = `avm_date_${propertyId}_${valuationDate}_${countryCode}_${roundTo || 'none'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached AVM date result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/avm/${countryCode}/properties/${propertyId}/avm/intellival/consumer/${valuationDate}`;
      
      const params = {};
      if (roundTo) {
        params.roundTo = roundTo;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'avm_date',
        timestamp: new Date().toISOString()
      };

      // Cache successful results for 30 minutes
      this.cache.set(cacheKey, result, 1800);
      return result;

    } catch (error) {
      console.error('AVM Date Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Handle AVM API errors consistently
   * @param {Error} error - Error object
   * @returns {Object} Standardized error response
   */
  handleAVMError(error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return {
            success: false,
            error: 'Invalid request parameters',
            details: data?.errors || data?.messages || 'Bad request',
            statusCode: 400
          };
        case 401:
          return {
            success: false,
            error: 'Unauthorized - Invalid or expired token',
            details: data?.messages || 'Authentication failed',
            statusCode: 401
          };
        case 403:
          return {
            success: false,
            error: 'Forbidden - Access denied',
            details: data?.messages || 'Insufficient permissions',
            statusCode: 403
          };
        case 404:
          return {
            success: false,
            error: 'Property not found or AVM not available',
            details: data?.errors || data?.messages || 'No AVM estimate available',
            statusCode: 404
          };
        case 429:
          return {
            success: false,
            error: 'Rate limit exceeded',
            details: 'Too many requests. Please try again later.',
            statusCode: 429
          };
        case 500:
          return {
            success: false,
            error: 'Internal server error',
            details: data?.messages || 'CoreLogic service temporarily unavailable',
            statusCode: 500
          };
        case 502:
          return {
            success: false,
            error: 'Service temporarily unavailable',
            details: 'Unable to fetch AVM data at this time',
            statusCode: 502
          };
        default:
          return {
            success: false,
            error: 'AVM request failed',
            details: data?.messages || error.message,
            statusCode: status
          };
      }
    }

    return {
      success: false,
      error: 'Network error',
      details: error.message,
      statusCode: 0
    };
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========================================
  // MARKET INSIGHTS API METHODS
  // ========================================

  /**
   * Get auction summaries for a state
   */
  async getAuctionSummaries(state, capitalCityOnly = false) {
    const cacheKey = `auction_summaries_${state}_${capitalCityOnly}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached auction summaries result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/auction/au/summaries/state/${state}`;

      const params = {};
      if (capitalCityOnly !== undefined) {
        params.capitalCityOnly = capitalCityOnly;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'auction_summaries',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Auction Summaries Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get latest auction results for a state
   */
  async getAuctionResults(state, capitalCityOnly = false, stats = null) {
    const cacheKey = `auction_results_${state}_${capitalCityOnly}_${stats || 'all'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached auction results result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/auction/au/results/state/${state}`;

      const params = {};
      if (capitalCityOnly !== undefined) {
        params.capitalCityOnly = capitalCityOnly;
      }
      if (stats) {
        params.stats = Array.isArray(stats) ? stats.join(',') : stats;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'auction_results',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Auction Results Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get auction results for past n weeks
   */
  async getAuctionResultsByWeeks(state, noOfWeeks, capitalCityOnly = false, stats = null) {
    const cacheKey = `auction_results_weeks_${state}_${noOfWeeks}_${capitalCityOnly}_${stats || 'all'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached auction results by weeks result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/auction/au/results/state/${state}/weeks/${noOfWeeks}`;

      const params = {};
      if (capitalCityOnly !== undefined) {
        params.capitalCityOnly = capitalCityOnly;
      }
      if (stats) {
        params.stats = Array.isArray(stats) ? stats.join(',') : stats;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'auction_results_weeks',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Auction Results by Weeks Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Search auction results by date range
   */
  async searchAuctionResults(state, fromDate, toDate, capitalCityOnly = false, stats = null) {
    const cacheKey = `auction_search_${state}_${fromDate}_${toDate}_${capitalCityOnly}_${stats || 'all'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached auction search result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/auction/au/results/state/${state}/search`;

      const params = {
        fromDate,
        toDate
      };
      if (capitalCityOnly !== undefined) {
        params.capitalCityOnly = capitalCityOnly;
      }
      if (stats) {
        params.stats = Array.isArray(stats) ? stats.join(',') : stats;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'auction_search',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Auction Search Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get auction results comparison by years
   */
  async getAuctionResultsComparison(state, years, capitalCityOnly = false, stats = null) {
    const cacheKey = `auction_comparison_${state}_${years}_${capitalCityOnly}_${stats || 'all'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached auction comparison result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/auction/au/results/state/${state}/compare/years/${years}`;

      const params = {};
      if (capitalCityOnly !== undefined) {
        params.capitalCityOnly = capitalCityOnly;
      }
      if (stats) {
        params.stats = Array.isArray(stats) ? stats.join(',') : stats;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'auction_comparison',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Auction Comparison Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get auction details for a specific suburb
   */
  async getAuctionDetails(state, postcode, suburb) {
    const cacheKey = `auction_details_${state}_${postcode}_${suburb}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached auction details result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/auction/au/details/state/${state}/postcode/${postcode}/suburb/${encodeURIComponent(suburb)}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'auction_details',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Auction Details Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get census statistics data
   */
  async getCensusStatistics(censusRequestList, forLatestCensusYear = true) {
    const cacheKey = `census_stats_${JSON.stringify(censusRequestList)}_${forLatestCensusYear}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached census statistics result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/census/v1/geographic`;

      const params = {};
      if (forLatestCensusYear !== undefined) {
        params.forLatestCensusYear = forLatestCensusYear;
      }

      const response = await axios.post(url, {
        censusRequestList
      }, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'census_statistics',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Census Statistics Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get census summary information
   */
  async getCensusSummary(locationId, locationTypeId) {
    const cacheKey = `census_summary_${locationId}_${locationTypeId}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached census summary result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/census/v1/geographic/summary`;

      const params = {
        locationId,
        locationTypeId
      };

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'census_summary',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Census Summary Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get statistics time series data
   */
  async getStatisticsTimeSeries(seriesRequestList) {
    const cacheKey = `statistics_series_${JSON.stringify(seriesRequestList)}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached statistics time series result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/statistics/v1/statistics.json`;

      const response = await axios.post(url, {
        seriesRequestList
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'statistics_time_series',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Statistics Time Series Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get census chart
   */
  async getCensusChart(chartSize, metricTypeGroupId, locationId, locationTypeId, chartTypeId = null, chartType = null) {
    const cacheKey = `census_chart_${chartSize}_${metricTypeGroupId}_${locationId}_${locationTypeId}_${chartTypeId || 'default'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached census chart result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/charts/census`;

      const params = {
        chartSize,
        metricTypeGroupId,
        's1.lId': locationId,
        's1.lTId': locationTypeId
      };

      if (chartTypeId) {
        params.chartTypeId = chartTypeId;
      }
      if (chartType) {
        params['s1.cTId'] = chartType;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'image/png',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout,
        responseType: 'arraybuffer'
      });

      const result = {
        success: true,
        data: {
          image: Buffer.from(response.data).toString('base64'),
          contentType: 'image/png',
          size: chartSize
        },
        type: 'census_chart',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Census Chart Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get time series chart
   */
  async getTimeSeriesChart(chartSize, locationId, locationTypeId, propertyTypeId, metricTypeId, fromDate = null, toDate = null, interval = 1, scale = 1) {
    const cacheKey = `timeseries_chart_${chartSize}_${locationId}_${locationTypeId}_${propertyTypeId}_${metricTypeId}_${fromDate || 'default'}_${toDate || 'default'}_${interval}_${scale}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached time series chart result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/charts/v2/chart.png`;

      const params = {
        chartSize,
        's1.lId': locationId,
        's1.lTId': locationTypeId,
        's1.pTId': propertyTypeId,
        's1.mTId': metricTypeId,
        's1.i': interval,
        scale
      };

      if (fromDate) {
        params.fromDate = fromDate;
      }
      if (toDate) {
        params.toDate = toDate;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'image/png',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout,
        responseType: 'arraybuffer'
      });

      const result = {
        success: true,
        data: {
          image: Buffer.from(response.data).toString('base64'),
          contentType: 'image/png',
          size: chartSize,
          scale
        },
        type: 'timeseries_chart',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Time Series Chart Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  // ========================================
  // PROPERTY DETAILS API METHODS
  // ========================================

  /**
   * Get OTM Sales campaigns for a property
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} OTM sales data
   */
  async getOTMSales(propertyId, includeHistoric = false) {
    const cacheKey = `otm_sales_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached OTM sales result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/otm/campaign/sales`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'otm_sales',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('OTM Sales Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get OTM Rent campaigns for a property
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} OTM rent data
   */
  async getOTMRent(propertyId, includeHistoric = false) {
    const cacheKey = `otm_rent_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached OTM rent result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/otm/campaign/rent`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'otm_rent',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('OTM Rent Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property timeline
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {string} withDevelopmentApplications - Include development applications
   * @returns {Promise<Object>} Property timeline data
   */
  async getPropertyTimeline(propertyId, withDevelopmentApplications = null) {
    const cacheKey = `property_timeline_${propertyId}_${withDevelopmentApplications || 'none'}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property timeline result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-timeline/au/properties/${propertyId}/timeline`;

      const params = {};
      if (withDevelopmentApplications) {
        params.withDevelopmentApplications = withDevelopmentApplications;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_timeline',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Property Timeline Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property legal information
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property legal data
   */
  async getPropertyLegal(propertyId, includeHistoric = false) {
    const cacheKey = `property_legal_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property legal result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/legal`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_legal',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Legal Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property contacts
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property contacts data
   */
  async getPropertyContacts(propertyId, includeHistoric = false) {
    const cacheKey = `property_contacts_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property contacts result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/contacts`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_contacts',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Contacts Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property occupancy information
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property occupancy data
   */
  async getPropertyOccupancy(propertyId, includeHistoric = false) {
    const cacheKey = `property_occupancy_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property occupancy result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/occupancy`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_occupancy',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Occupancy Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property development applications
   * @param {string|number} propertyId - CoreLogic property ID
   * @returns {Promise<Object>} Property development applications data
   */
  async getPropertyDevelopmentApplications(propertyId) {
    const cacheKey = `property_dev_apps_${propertyId}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property development applications result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/developmentApplication`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_development_applications',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Development Applications Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property location information
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property location data
   */
  async getPropertyLocation(propertyId, includeHistoric = false) {
    const cacheKey = `property_location_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property location result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/location`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_location',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Location Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property images
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property images data
   */
  async getPropertyImages(propertyId, includeHistoric = false) {
    const cacheKey = `property_images_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property images result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/images`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_images',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Images Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property site information
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property site data
   */
  async getPropertySite(propertyId, includeHistoric = false) {
    const cacheKey = `property_site_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property site result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/site`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_site',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Site Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property core attributes
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property core attributes data
   */
  async getPropertyCoreAttributes(propertyId, includeHistoric = false) {
    const cacheKey = `property_core_attrs_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property core attributes result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/attributes/core`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_core_attributes',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Core Attributes Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property additional attributes
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property additional attributes data
   */
  async getPropertyAdditionalAttributes(propertyId, includeHistoric = false) {
    const cacheKey = `property_additional_attrs_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property additional attributes result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/attributes/additional`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_additional_attributes',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Additional Attributes Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property features
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property features data
   */
  async getPropertyFeatures(propertyId, includeHistoric = false) {
    const cacheKey = `property_features_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property features result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/features`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_features',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Features Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Get property sales history
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Property sales data
   */
  async getPropertySales(propertyId, includeHistoric = false) {
    const cacheKey = `property_sales_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached property sales result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}/sales`;

      const params = {};
      if (includeHistoric !== undefined) {
        params.includeHistoric = includeHistoric;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });

      const result = {
        success: true,
        data: response.data,
        type: 'property_sales',
        timestamp: new Date().toISOString()
      };

      this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      return result;

    } catch (error) {
      console.error('Property Sales Error:', error.message);
      return this.handleAVMError(error);
    }
  }

  /**
   * Find a valid property ID by searching for a real address
   * @returns {Promise<Object>} Valid property data
   */
  async findValidProperty() {
    console.log('=== FINDING VALID PROPERTY ===');
    
    // Try some common Australian addresses that should exist in CoreLogic
    const testAddresses = [
      '1 Collins Street, Melbourne VIC 3000',
      '123 George Street, Sydney NSW 2000',
      '1 Queen Street, Brisbane QLD 4000',
      '1 King Street, Perth WA 6000',
      '1 North Terrace, Adelaide SA 5000',
      '1 Elizabeth Street, Hobart TAS 7000',
      '1 London Circuit, Canberra ACT 2601',
      '1 Mitchell Street, Darwin NT 0800'
    ];
    
    for (const address of testAddresses) {
      try {
        console.log(`Trying address: ${address}`);
        const searchResult = await this.searchAddress(address);
        
        if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
          const property = searchResult.data[0];
          console.log(`✅ Found valid property: ${property.propertyId}`);
          console.log(`Address: ${property.fullAddress}`);
          console.log(`Confidence: ${property.confidence}`);
          
          return {
            success: true,
            propertyId: property.propertyId,
            address: property.fullAddress,
            confidence: property.confidence,
            data: property
          };
        }
      } catch (error) {
        console.log(`❌ Failed for ${address}: ${error.message}`);
        continue;
      }
    }
    
    return {
      success: false,
      error: 'No valid properties found in CoreLogic database'
    };
  }

  /**
   * Test method to get basic property data
   * @param {string|number} propertyId - CoreLogic property ID
   * @returns {Promise<Object>} Basic property data
   */
  async testPropertyData(propertyId) {
    console.log('=== TESTING PROPERTY DATA ===');
    console.log('Property ID:', propertyId);
    
    try {
      const accessToken = await this.getAccessToken();
      console.log('Access Token obtained:', !!accessToken);
      
      // Try a simple property details endpoint
      const url = `${this.baseUrl}/property-details/au/properties/${propertyId}`;
      console.log('Testing URL:', url);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'User-Agent': 'Sustaino-Pro-Backend/2.0.0'
        },
        timeout: this.timeout
      });
      
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.log('Test Error:', error.message);
      console.log('Error Status:', error.response?.status);
      console.log('Error Data:', error.response?.data);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get comprehensive property details (all endpoints)
   * @param {string|number} propertyId - CoreLogic property ID
   * @param {boolean} includeHistoric - Include historical data
   * @returns {Promise<Object>} Comprehensive property data
   */
  async getComprehensivePropertyDetails(propertyId, includeHistoric = false) {
    const cacheKey = `comprehensive_property_${propertyId}_${includeHistoric}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached comprehensive property details result');
      return cachedResult;
    }

    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    try {
      // Execute all property detail requests in parallel
      const [
        otmSales,
        otmRent,
        timeline,
        legal,
        contacts,
        occupancy,
        devApplications,
        location,
        images,
        site,
        coreAttributes,
        additionalAttributes,
        features,
        sales
      ] = await Promise.allSettled([
        this.getOTMSales(propertyId, includeHistoric),
        this.getOTMRent(propertyId, includeHistoric),
        this.getPropertyTimeline(propertyId),
        this.getPropertyLegal(propertyId, includeHistoric),
        this.getPropertyContacts(propertyId, includeHistoric),
        this.getPropertyOccupancy(propertyId, includeHistoric),
        this.getPropertyDevelopmentApplications(propertyId),
        this.getPropertyLocation(propertyId, includeHistoric),
        this.getPropertyImages(propertyId, includeHistoric),
        this.getPropertySite(propertyId, includeHistoric),
        this.getPropertyCoreAttributes(propertyId, includeHistoric),
        this.getPropertyAdditionalAttributes(propertyId, includeHistoric),
        this.getPropertyFeatures(propertyId, includeHistoric),
        this.getPropertySales(propertyId, includeHistoric)
      ]);

      // Debug: Log what data we're getting
      console.log('=== COMPREHENSIVE PROPERTY DATA DEBUG ===');
      console.log('Property ID:', propertyId);
      console.log('OTM Sales:', otmSales.status, otmSales.status === 'fulfilled' ? otmSales.value.success : 'rejected');
      console.log('Core Attributes:', coreAttributes.status, coreAttributes.status === 'fulfilled' ? coreAttributes.value.success : 'rejected');
      console.log('Sales:', sales.status, sales.status === 'fulfilled' ? sales.value.success : 'rejected');
      
      // Log actual response data for debugging
      if (otmSales.status === 'fulfilled') {
        console.log('OTM Sales Response:', JSON.stringify(otmSales.value, null, 2));
      }
      if (coreAttributes.status === 'fulfilled') {
        console.log('Core Attributes Response:', JSON.stringify(coreAttributes.value, null, 2));
      }
      console.log('==========================================');

      const result = {
        success: true,
        data: {
          otmSales: otmSales.status === 'fulfilled' && otmSales.value.success ? otmSales.value.data : null,
          otmRent: otmRent.status === 'fulfilled' && otmRent.value.success ? otmRent.value.data : null,
          timeline: timeline.status === 'fulfilled' && timeline.value.success ? timeline.value.data : null,
          legal: legal.status === 'fulfilled' && legal.value.success ? legal.value.data : null,
          contacts: contacts.status === 'fulfilled' && contacts.value.success ? contacts.value.data : null,
          occupancy: occupancy.status === 'fulfilled' && occupancy.value.success ? occupancy.value.data : null,
          developmentApplications: devApplications.status === 'fulfilled' && devApplications.value.success ? devApplications.value.data : null,
          location: location.status === 'fulfilled' && location.value.success ? location.value.data : null,
          images: images.status === 'fulfilled' && images.value.success ? images.value.data : null,
          site: site.status === 'fulfilled' && site.value.success ? site.value.data : null,
          coreAttributes: coreAttributes.status === 'fulfilled' && coreAttributes.value.success ? coreAttributes.value.data : null,
          additionalAttributes: additionalAttributes.status === 'fulfilled' && additionalAttributes.value.success ? additionalAttributes.value.data : null,
          features: features.status === 'fulfilled' && features.value.success ? features.value.data : null,
          sales: sales.status === 'fulfilled' && sales.value.success ? sales.value.data : null
        },
        type: 'comprehensive_property_details',
        timestamp: new Date().toISOString(),
        errors: [
          otmSales.status === 'rejected' ? { endpoint: 'otmSales', error: otmSales.reason.message } : 
          (otmSales.status === 'fulfilled' && !otmSales.value.success ? { endpoint: 'otmSales', error: otmSales.value.error } : null),
          otmRent.status === 'rejected' ? { endpoint: 'otmRent', error: otmRent.reason.message } : 
          (otmRent.status === 'fulfilled' && !otmRent.value.success ? { endpoint: 'otmRent', error: otmRent.value.error } : null),
          timeline.status === 'rejected' ? { endpoint: 'timeline', error: timeline.reason.message } : 
          (timeline.status === 'fulfilled' && !timeline.value.success ? { endpoint: 'timeline', error: timeline.value.error } : null),
          legal.status === 'rejected' ? { endpoint: 'legal', error: legal.reason.message } : 
          (legal.status === 'fulfilled' && !legal.value.success ? { endpoint: 'legal', error: legal.value.error } : null),
          contacts.status === 'rejected' ? { endpoint: 'contacts', error: contacts.reason.message } : 
          (contacts.status === 'fulfilled' && !contacts.value.success ? { endpoint: 'contacts', error: contacts.value.error } : null),
          occupancy.status === 'rejected' ? { endpoint: 'occupancy', error: occupancy.reason.message } : 
          (occupancy.status === 'fulfilled' && !occupancy.value.success ? { endpoint: 'occupancy', error: occupancy.value.error } : null),
          devApplications.status === 'rejected' ? { endpoint: 'developmentApplications', error: devApplications.reason.message } : 
          (devApplications.status === 'fulfilled' && !devApplications.value.success ? { endpoint: 'developmentApplications', error: devApplications.value.error } : null),
          location.status === 'rejected' ? { endpoint: 'location', error: location.reason.message } : 
          (location.status === 'fulfilled' && !location.value.success ? { endpoint: 'location', error: location.value.error } : null),
          images.status === 'rejected' ? { endpoint: 'images', error: images.reason.message } : 
          (images.status === 'fulfilled' && !images.value.success ? { endpoint: 'images', error: images.value.error } : null),
          site.status === 'rejected' ? { endpoint: 'site', error: site.reason.message } : 
          (site.status === 'fulfilled' && !site.value.success ? { endpoint: 'site', error: site.value.error } : null),
          coreAttributes.status === 'rejected' ? { endpoint: 'coreAttributes', error: coreAttributes.reason.message } : 
          (coreAttributes.status === 'fulfilled' && !coreAttributes.value.success ? { endpoint: 'coreAttributes', error: coreAttributes.value.error } : null),
          additionalAttributes.status === 'rejected' ? { endpoint: 'additionalAttributes', error: additionalAttributes.reason.message } : 
          (additionalAttributes.status === 'fulfilled' && !additionalAttributes.value.success ? { endpoint: 'additionalAttributes', error: additionalAttributes.value.error } : null),
          features.status === 'rejected' ? { endpoint: 'features', error: features.reason.message } : 
          (features.status === 'fulfilled' && !features.value.success ? { endpoint: 'features', error: features.value.error } : null),
          sales.status === 'rejected' ? { endpoint: 'sales', error: sales.reason.message } : 
          (sales.status === 'fulfilled' && !sales.value.success ? { endpoint: 'sales', error: sales.value.error } : null)
        ].filter(Boolean)
      };

      this.cache.set(cacheKey, result, 1800); // Cache for 30 minutes
      return result;

    } catch (error) {
      console.error('Comprehensive Property Details Error:', error.message);
      return this.handleAVMError(error);
    }
  }
}

// Export singleton instance
module.exports = new CoreLogicService();
