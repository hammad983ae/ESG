/**
 * CoreLogic AVM (Automated Valuation Model) Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Comprehensive AVM integration including:
 * - Current origination and consumer AVM estimates
 * - Historical AVM data and trends
 * - Live AVM with property modifications
 * - AVM reporting and analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AVMOriginationData {
  estimate: number;
  lowEstimate: number;
  highEstimate: number;
  fsd: number;
  confidence: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW';
  valuationDate: string;
  isCurrent: boolean;
}

export interface AVMConsumerBandData {
  lowerBand: number;
  upperBand: number;
  confidence: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW';
  valuationDate: string;
}

export interface AVMHistoryData {
  valuations: Array<AVMOriginationData | AVMConsumerBandData>;
}

export interface LiveAVMData {
  estimate: number;
  lowEstimate: number;
  highEstimate: number;
  fsd: number;
  confidence?: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW';
  valuationDate: string;
  avmTrackingId: string;
}

export interface LiveConsumerBandData {
  lowerBand: number;
  upperBand: number;
  confidence: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW';
  valuationDate: string;
  avmTrackingId: string;
}

export interface AVMReportData {
  url: string;
}

export interface PropertyModificationData {
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  floorAreaM2?: number;
  landAreaM2?: number;
  salePrice?: number;
  yearBuilt?: number;
  propertyType?: string;
  saleDate?: string;
  valuationDate?: string;
  craftsmanshipQuality?: 'AVERAGE' | 'ABOVE_AVERAGE' | 'BELOW_AVERAGE' | 'EXCELLENT' | 'POOR';
}

export interface AVMApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  statusCode?: number;
  type?: string;
  timestamp?: string;
}

export interface AVMServiceStats {
  cache: {
    keys: number;
    hits: number;
    misses: number;
    ksize: number;
    vsize: number;
  };
  service: string;
  version: string;
  timestamp: string;
}

// ============================================================================
// AVM SERVICE CLASS
// ============================================================================

class AVMService {
  private readonly baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com/api/avm'
    : 'http://localhost:3001/api/avm';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  /**
   * Get current origination AVM for a property
   */
  async getCurrentOriginationAVM(
    propertyId: string | number,
    countryCode: 'au' | 'nz' = 'au',
    roundTo?: string
  ): Promise<AVMApiResponse<AVMOriginationData>> {
    const params = new URLSearchParams();
    if (countryCode) params.append('countryCode', countryCode);
    if (roundTo) params.append('roundTo', roundTo);

    const url = `${this.baseUrl}/origination/current/${propertyId}?${params.toString()}`;
    return this.makeRequest<AVMOriginationData>(url);
  }

  /**
   * Get current consumer band AVM for a property
   */
  async getCurrentConsumerBandAVM(
    propertyId: string | number,
    countryCode: 'au' | 'nz' = 'au'
  ): Promise<AVMApiResponse<AVMConsumerBandData>> {
    const params = new URLSearchParams();
    if (countryCode) params.append('countryCode', countryCode);

    const url = `${this.baseUrl}/consumer/band/current/${propertyId}?${params.toString()}`;
    return this.makeRequest<AVMConsumerBandData>(url);
  }

  /**
   * Get consumer AVM history for a property
   */
  async getConsumerAVMHistory(
    propertyId: string | number,
    countryCode: 'au' | 'nz' = 'au',
    fromValuationDate?: string,
    roundTo?: string
  ): Promise<AVMApiResponse<AVMHistoryData>> {
    const params = new URLSearchParams();
    if (countryCode) params.append('countryCode', countryCode);
    if (fromValuationDate) params.append('fromValuationDate', fromValuationDate);
    if (roundTo) params.append('roundTo', roundTo);

    const url = `${this.baseUrl}/consumer/history/${propertyId}?${params.toString()}`;
    return this.makeRequest<AVMHistoryData>(url);
  }

  /**
   * Get origination AVM history for a property
   */
  async getOriginationAVMHistory(
    propertyId: string | number,
    fromValuationDate: string,
    roundTo?: string
  ): Promise<AVMApiResponse<AVMHistoryData>> {
    const params = new URLSearchParams();
    params.append('fromValuationDate', fromValuationDate);
    if (roundTo) params.append('roundTo', roundTo);

    const url = `${this.baseUrl}/origination/history/${propertyId}?${params.toString()}`;
    return this.makeRequest<AVMHistoryData>(url);
  }

  /**
   * Get AVM for a specific date
   */
  async getAVMForDate(
    propertyId: string | number,
    valuationDate: string,
    countryCode: 'au' | 'nz' = 'au',
    roundTo?: string
  ): Promise<AVMApiResponse<AVMOriginationData>> {
    const params = new URLSearchParams();
    if (countryCode) params.append('countryCode', countryCode);
    if (roundTo) params.append('roundTo', roundTo);

    const url = `${this.baseUrl}/date/${propertyId}/${valuationDate}?${params.toString()}`;
    return this.makeRequest<AVMOriginationData>(url);
  }

  /**
   * Get live origination AVM with property modifications
   */
  async getLiveOriginationAVM(
    propertyId: string | number,
    propertyData: PropertyModificationData
  ): Promise<AVMApiResponse<LiveAVMData>> {
    const url = `${this.baseUrl}/live/origination/${propertyId}`;
    return this.makeRequest<LiveAVMData>(url, {
      method: 'POST',
      body: JSON.stringify(propertyData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get live consumer AVM with property modifications
   */
  async getLiveConsumerAVM(
    propertyId: string | number,
    propertyData: PropertyModificationData
  ): Promise<AVMApiResponse<LiveAVMData>> {
    const url = `${this.baseUrl}/live/consumer/${propertyId}`;
    return this.makeRequest<LiveAVMData>(url, {
      method: 'POST',
      body: JSON.stringify(propertyData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get live consumer band AVM with property modifications
   */
  async getLiveConsumerBandAVM(
    propertyId: string | number,
    propertyData: PropertyModificationData
  ): Promise<AVMApiResponse<LiveConsumerBandData>> {
    const url = `${this.baseUrl}/live/consumer/band/${propertyId}`;
    return this.makeRequest<LiveConsumerBandData>(url, {
      method: 'POST',
      body: JSON.stringify(propertyData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get AVM consumer report URL
   */
  async getAVMConsumerReport(propertyId: string | number): Promise<AVMApiResponse<AVMReportData>> {
    const url = `${this.baseUrl}/report/consumer/${propertyId}`;
    return this.makeRequest<AVMReportData>(url);
  }

  /**
   * Get AVM origination report URL
   */
  async getAVMOriginationReport(propertyId: string | number): Promise<AVMApiResponse<AVMReportData>> {
    const url = `${this.baseUrl}/report/origination/${propertyId}`;
    return this.makeRequest<AVMReportData>(url);
  }

  /**
   * Get AVM service statistics
   */
  async getStats(): Promise<AVMApiResponse<AVMServiceStats>> {
    const url = `${this.baseUrl}/stats`;
    return this.makeRequest<AVMServiceStats>(url);
  }

  /**
   * Clear AVM cache
   */
  async clearCache(): Promise<AVMApiResponse<{ message: string }>> {
    const url = `${this.baseUrl}/clear-cache`;
    return this.makeRequest<{ message: string }>(url, {
      method: 'POST'
    });
  }

  /**
   * Get comprehensive AVM data for a property
   * Combines multiple AVM endpoints for complete property analysis
   */
  async getComprehensiveAVMData(
    propertyId: string | number,
    countryCode: 'au' | 'nz' = 'au'
  ): Promise<{
    origination?: AVMOriginationData;
    consumerBand?: AVMConsumerBandData;
    consumerHistory?: AVMHistoryData;
    error?: string;
  }> {
    try {
      const [originationResult, consumerBandResult, consumerHistoryResult] = await Promise.allSettled([
        this.getCurrentOriginationAVM(propertyId, countryCode),
        this.getCurrentConsumerBandAVM(propertyId, countryCode),
        this.getConsumerAVMHistory(propertyId, countryCode)
      ]);

      const result: any = {};

      if (originationResult.status === 'fulfilled' && originationResult.value.success) {
        result.origination = originationResult.value.data;
      }

      if (consumerBandResult.status === 'fulfilled' && consumerBandResult.value.success) {
        result.consumerBand = consumerBandResult.value.data;
      }

      if (consumerHistoryResult.status === 'fulfilled' && consumerHistoryResult.value.success) {
        result.consumerHistory = consumerHistoryResult.value.data;
      }

      // Check if any requests failed
      const failures = [originationResult, consumerBandResult, consumerHistoryResult]
        .filter(result => result.status === 'rejected' || 
          (result.status === 'fulfilled' && !result.value.success));

      if (failures.length > 0) {
        result.error = 'Some AVM data could not be retrieved';
      }

      return result;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to retrieve AVM data'
      };
    }
  }

  /**
   * Compare AVM estimates with custom valuation
   */
  compareWithCustomValuation(
    avmData: AVMOriginationData | AVMConsumerBandData,
    customValuation: number
  ): {
    difference: number;
    percentageDifference: number;
    isWithinRange: boolean;
    recommendation: string;
  } {
    let avmEstimate: number;
    
    if ('estimate' in avmData) {
      avmEstimate = avmData.estimate;
    } else {
      // For consumer band data, use the midpoint
      avmEstimate = (avmData.lowerBand + avmData.upperBand) / 2;
    }

    const difference = customValuation - avmEstimate;
    const percentageDifference = (difference / avmEstimate) * 100;
    
    let isWithinRange = false;
    let recommendation = '';

    if ('lowEstimate' in avmData && 'highEstimate' in avmData) {
      isWithinRange = customValuation >= avmData.lowEstimate && customValuation <= avmData.highEstimate;
      recommendation = isWithinRange 
        ? 'Your valuation is within the AVM range - good alignment with market data'
        : `Your valuation is ${customValuation > avmData.highEstimate ? 'above' : 'below'} the AVM range - consider reviewing your assumptions`;
    } else {
      isWithinRange = Math.abs(percentageDifference) <= 10; // Within 10%
      recommendation = isWithinRange
        ? 'Your valuation is close to the AVM estimate - good market alignment'
        : `Your valuation differs significantly from AVM (${percentageDifference.toFixed(1)}%) - consider market validation`;
    }

    return {
      difference,
      percentageDifference,
      isWithinRange,
      recommendation
    };
  }

  /**
   * Format AVM data for display
   */
  formatAVMData(data: AVMOriginationData | AVMConsumerBandData): {
    estimate: string;
    range: string;
    confidence: string;
    date: string;
  } {
    let estimate: string;
    let range: string;

    if ('estimate' in data) {
      estimate = `$${data.estimate.toLocaleString()}`;
      range = `$${data.lowEstimate.toLocaleString()} - $${data.highEstimate.toLocaleString()}`;
    } else {
      estimate = `$${((data.lowerBand + data.upperBand) / 2).toLocaleString()}`;
      range = `$${data.lowerBand.toLocaleString()} - $${data.upperBand.toLocaleString()}`;
    }

    const confidence = data.confidence.replace('_', ' ').toLowerCase();
    const date = new Date(data.valuationDate).toLocaleDateString();

    return {
      estimate,
      range,
      confidence,
      date
    };
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<AVMApiResponse<T>> {
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sustaino-Pro-Frontend/1.0.0'
      }
    };

    const requestOptions = { ...defaultOptions, ...options };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.maxRetries && this.isRetryableError(error as Error)) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.delay(delay);
        } else {
          break;
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed',
      statusCode: 0
    };
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: Error): boolean {
    if (error.message.includes('fetch')) return true;
    if (error.message.includes('network')) return true;
    if (error.message.includes('timeout')) return true;
    return false;
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const avmService = new AVMService();
export default avmService;
