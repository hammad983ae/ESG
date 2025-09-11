/**
 * CoreLogic Address Matcher API Service with Google Maps Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Integrates with CoreLogic Address Matcher API for property address validation
 * and matching using AddressRight algorithm. Automatically enhances results with
 * Google Maps geocoding for latitude/longitude coordinates when not provided by CoreLogic.
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.1.0
 */

export interface CoreLogicAddressMatch {
  propertyId: string;
  address: string;
  matchCode: string;
  matchType: 'E' | 'A' | 'P' | 'F' | 'B' | 'S' | 'X' | 'D' | 'N' | 'M' | 'Q';
  matchRule: string;
  updateIndicator: 'O' | 'U';
  updateDetail: string;
  confidence: number;
  coordinates?: {
    latitude: number;
    longitude: number;
    source: 'corelogic' | 'google_maps'; // Track coordinate source
  };
  suburb?: string;
  state?: string;
  postcode?: string;
  streetName?: string;
  streetNumber?: string;
  streetType?: string;
}

export interface CoreLogicApiResponse {
  success: boolean;
  data?: CoreLogicAddressMatch;
  error?: string;
  matchQuality?: 'exact' | 'partial' | 'fuzzy' | 'building' | 'street' | 'no-match';
}

class CoreLogicService {
  private readonly baseUrl = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/corelogic`
    : 'https://esg-production.up.railway.app/api/corelogic';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private readonly enableGoogleMapsFallback = true;

  /**
   * Search for a property address using CoreLogic Address Matcher API
   * with Google Maps geocoding fallback for coordinates
   */
  async searchAddress(
    address: string, 
    clientName?: string,
    enableCoordinatesFallback: boolean = true
  ): Promise<CoreLogicApiResponse> {
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

    try {
      const response = await this.makeRequest(trimmedAddress, clientName);
      const parsedResponse = this.parseResponse(response);
      
      // If CoreLogic search was successful but no coordinates, try Google Maps
      if (parsedResponse.success && 
          parsedResponse.data && 
          !parsedResponse.data.coordinates && 
          enableCoordinatesFallback && 
          this.enableGoogleMapsFallback) {
        
        console.log('CoreLogic found address but no coordinates, trying Google Maps...');
        const enhancedData = await this.enhanceWithGoogleMapsCoordinates(parsedResponse.data, trimmedAddress);
        return {
          ...parsedResponse,
          data: enhancedData
        };
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('CoreLogic API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        matchQuality: 'no-match'
      };
    }
  }

  /**
   * Make HTTP request to backend CoreLogic service with retry logic
   */
  private async makeRequest(address: string, clientName?: string): Promise<any> {
    const url = `${this.baseUrl}/search`;
    
    const requestBody = {
      address,
      clientName: clientName?.substring(0, 100) || 'Sustaino Pro'
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Sustaino-Pro-Frontend/1.0.0'
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }


  /**
   * Parse CoreLogic API response into standardized format
   */
  private parseResponse(response: any): CoreLogicApiResponse {
    try {
      if (!response || typeof response !== 'object') {
        return {
          success: false,
          error: 'Invalid response format',
          matchQuality: 'no-match'
        };
      }

      // If response has a 'data' property (from backend), use that
      const responseData = response.data || response;

      // Extract match information from response
      const matchCode = responseData.matchCode || '';
      const matchType = matchCode.charAt(0) as CoreLogicAddressMatch['matchType'];
      const matchRule = matchCode.substring(1, 4) || '';
      const updateIndicator = responseData.updateIndicator || 'U';
      const updateDetail = matchCode.substring(4) || '';

      const addressMatch: CoreLogicAddressMatch = {
        propertyId: responseData.propertyId || '',
        address: responseData.address || responseData.formattedAddress || '',
        matchCode,
        matchType,
        matchRule,
        updateIndicator,
        updateDetail,
        confidence: this.calculateConfidence(matchType, matchRule),
        coordinates: responseData.coordinates ? {
          latitude: parseFloat(responseData.coordinates.latitude) || 0,
          longitude: parseFloat(responseData.coordinates.longitude) || 0,
          source: 'corelogic' as const
        } : undefined,
        suburb: responseData.suburb || responseData.locality,
        state: responseData.state,
        postcode: responseData.postcode,
        streetName: responseData.streetName,
        streetNumber: responseData.streetNumber,
        streetType: responseData.streetType
      };

      const matchQuality = this.determineMatchQuality(matchType);

      return {
        success: true,
        data: addressMatch,
        matchQuality
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
        matchQuality: 'no-match'
      };
    }
  }

  /**
   * Enhance CoreLogic address match with Google Maps coordinates
   */
  private async enhanceWithGoogleMapsCoordinates(
    addressMatch: CoreLogicAddressMatch, 
    originalAddress: string
  ): Promise<CoreLogicAddressMatch> {
    try {
      console.log('Attempting Google Maps geocoding for:', addressMatch.address || originalAddress);
      
      // Dynamically import Google Maps service to avoid circular dependencies
      const { geocodeAddress } = await import('./googleMapsService');
      
      const coordinates = await geocodeAddress(addressMatch.address || originalAddress);
      
      if (coordinates) {
        console.log('Successfully obtained coordinates from Google Maps:', coordinates);
        return {
          ...addressMatch,
          coordinates: {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            source: 'google_maps' as const
          }
        };
      } else {
        console.log('Google Maps geocoding failed, returning address without coordinates');
        return addressMatch;
      }
    } catch (error) {
      console.error('Google Maps geocoding error:', error);
      return addressMatch; // Return original data if Google Maps fails
    }
  }

  /**
   * Calculate confidence score based on match type and rule
   */
  private calculateConfidence(matchType: string, matchRule: string): number {
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

    let confidence = baseConfidence[matchType as keyof typeof baseConfidence] || 0;

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
  private determineMatchQuality(matchType: string): CoreLogicApiResponse['matchQuality'] {
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
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format address for optimal matching
   */
  formatAddressForMatching(address: string): string {
    // Remove extra whitespace and normalize
    let formatted = address.trim().replace(/\s+/g, ' ');
    
    // Ensure proper format: [unitNumber] / [streetNumber] [streetName] [streetType] [suburb] [stateCode] [postcode]
    // This is a basic formatter - in production, you might want more sophisticated parsing
    return formatted;
  }

  /**
   * Validate if an address match is acceptable for business use
   */
  isAcceptableMatch(match: CoreLogicAddressMatch, minConfidence: number = 0.7): boolean {
    if (!match || !match.propertyId) return false;
    if (match.matchType === 'N' || match.matchType === 'M' || match.matchType === 'D') return false;
    if (match.confidence < minConfidence) return false;
    
    return true;
  }

  /**
   * Search for address with weather data integration
   * Returns both CoreLogic data and weather information if coordinates are available
   */
  async searchAddressWithWeather(
    address: string,
    clientName?: string,
    weatherOptions?: {
      includeWeatherData?: boolean;
      cropType?: string;
      forecastDays?: number;
    }
  ): Promise<{
    corelogic: CoreLogicApiResponse;
    weather?: any; // Weather data if coordinates available
  }> {
    // First get CoreLogic data with coordinates
    const corelogicResult = await this.searchAddress(address, clientName, true);
    
    const result: {
      corelogic: CoreLogicApiResponse;
      weather?: any;
    } = {
      corelogic: corelogicResult
    };

    // If we have coordinates and weather is requested, get weather data
    if (corelogicResult.success && 
        corelogicResult.data?.coordinates && 
        weatherOptions?.includeWeatherData) {
      
      try {
        // Dynamically import weather service to avoid circular dependencies
        const { weatherService } = await import('./weatherService');
        
        const weatherData = await weatherService.getAgriculturalInsights(
          {
            lat: corelogicResult.data.coordinates.latitude,
            lon: corelogicResult.data.coordinates.longitude,
            city: corelogicResult.data.suburb || corelogicResult.data.address
          },
          weatherOptions.cropType
        );
        
        result.weather = weatherData;
      } catch (error) {
        console.error('Weather data fetch error:', error);
        // Weather data is optional, so we don't fail the whole request
      }
    }

    return result;
  }

  // ========================================
  // PROPERTY DETAILS API METHODS
  // ========================================

  /**
   * Get OTM Sales campaigns for a property
   */
  async getOTMSales(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/otm/sales`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get OTM Rent campaigns for a property
   */
  async getOTMRent(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/otm/rent`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property timeline
   */
  async getPropertyTimeline(propertyId: string | number, withDevelopmentApplications?: string): Promise<CoreLogicApiResponse> {
    try {
      const params: any = {};
      if (withDevelopmentApplications) {
        params.withDevelopmentApplications = withDevelopmentApplications;
      }
      const response = await this.makePropertyRequest(`/property/${propertyId}/timeline`, params);
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property legal information
   */
  async getPropertyLegal(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/legal`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property contacts
   */
  async getPropertyContacts(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/contacts`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property occupancy information
   */
  async getPropertyOccupancy(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/occupancy`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property development applications
   */
  async getPropertyDevelopmentApplications(propertyId: string | number): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/development-applications`);
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property location information
   */
  async getPropertyLocation(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/location`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property images
   */
  async getPropertyImages(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/images`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property site information
   */
  async getPropertySite(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/site`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property core attributes
   */
  async getPropertyCoreAttributes(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/attributes/core`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property additional attributes
   */
  async getPropertyAdditionalAttributes(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/attributes/additional`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property features
   */
  async getPropertyFeatures(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/features`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get property sales history
   */
  async getPropertySales(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/sales`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Get comprehensive property details (all endpoints)
   */
  async getComprehensivePropertyDetails(propertyId: string | number, includeHistoric: boolean = false): Promise<CoreLogicApiResponse> {
    try {
      const response = await this.makePropertyRequest(`/property/${propertyId}/comprehensive`, { includeHistoric });
      return this.parsePropertyResponse(response);
    } catch (error) {
      return this.handlePropertyError(error);
    }
  }

  /**
   * Make HTTP request to backend property details service
   */
  private async makePropertyRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, value.toString());
      }
    });

    const fullUrl = queryString.toString() ? `${url}?${queryString.toString()}` : url;

    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Sustaino-Pro-Frontend/1.0.0'
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Parse property details API response
   */
  private parsePropertyResponse(response: any): CoreLogicApiResponse {
    try {
      if (!response || typeof response !== 'object') {
        return {
          success: false,
          error: 'Invalid response format',
          matchQuality: 'no-match'
        };
      }

      return {
        success: response.success || false,
        data: response.data || null,
        error: response.error || undefined,
        matchQuality: 'exact' // Property details are always exact matches
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse property response',
        matchQuality: 'no-match'
      };
    }
  }

  /**
   * Handle property details API errors
   */
  private handlePropertyError(error: any): CoreLogicApiResponse {
    console.error('Property Details API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      matchQuality: 'no-match'
    };
  }
}

// Export singleton instance
export const coreLogicService = new CoreLogicService();
