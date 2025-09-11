/**
 * CoreLogic Market Insights Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000018
 * 
 * Frontend service for CoreLogic Market Insights API integration
 * Provides methods for auction data, census data, and market statistics
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

export interface CoreLogicApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any[];
  statusCode?: number;
  type?: string;
  timestamp?: string;
}

// ========================================
// AUCTION DATA INTERFACES
// ========================================

export interface AuctionSummary {
  locality: string;
  postcode: string;
  propertyCount: number;
  link: string;
}

export interface AuctionSummariesData {
  summaryDate: string;
  stateCode: string;
  auctionSummaries: AuctionSummary[];
}

export interface AuctionResultsData {
  summaryDate: string;
  totalScheduledAuctions: number;
  totalAuctionResults: number;
  soldPriorToAuction: number;
  soldAtAuction: number;
  soldAfterAuction: number;
  passedIn: number;
  withdrawn: number;
  clearanceRate: number;
}

export interface WeeklyAuctionResults {
  summaryDate: string;
  totalScheduledAuctions: number;
  totalAuctionResults: number;
  soldPriorToAuction: number;
  soldAtAuction: number;
  soldAfterAuction: number;
  passedIn: number;
  withdrawn: number;
  clearanceRate: number;
}

export interface AuctionResultsByWeeksData {
  weeklyResults: WeeklyAuctionResults[];
}

export interface AuctionDetails {
  locality: string;
  postcode: string;
  singleLine: string;
  propertyId: number;
  propertyType: string;
  beds: number;
  baths: number;
  carSpaces: number;
  salePrice: number;
  highestBid: number;
  vendorBid: number;
  auctionResult: string;
  auctionDate: string;
  saleDate: string;
  agency: string;
}

export interface AuctionDetailsData {
  summaryDate: string;
  auctionDetails: AuctionDetails[];
}

// ========================================
// CENSUS DATA INTERFACES
// ========================================

export interface CensusRequest {
  locationId: number;
  locationTypeId: number;
  metricTypeGroupId?: number;
  metricTypeId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface SeriesData {
  dateTime: string;
  value: number;
}

export interface CensusResponse {
  locationType: string;
  countryName?: string;
  stateName?: string;
  postcodeName?: string;
  localityName?: string;
  councilAreaName?: string;
  territorialAuthorityName?: string;
  metricTypeId: number;
  metricType: string;
  metricTypeDescription: string;
  metricTypeGroupId?: number;
  metricTypeGroup?: string;
  metricTypeGroupDescription?: string;
  metricTypeOrderId?: number;
  metricTypeShort: string;
  metricDisplayType: string;
  isSumStatistic: boolean;
  seriesDataList: SeriesData[];
}

export interface CensusStatisticsData {
  censusResponseList: CensusResponse[];
}

export interface CensusSummaryData {
  censusSummaryDescription: string;
  fiveYearPopulationChange: string;
  locationType: string;
  localityName?: string;
  councilAreaName?: string;
  territorialAuthorityName?: string;
  stateName?: string;
  postcodeName?: string;
  countryName: string;
}

// ========================================
// STATISTICS DATA INTERFACES
// ========================================

export interface SeriesRequest {
  fromDate?: string;
  interval?: number;
  locationId: number;
  locationTypeId: number;
  metricTypeGroupId?: number;
  metricTypeId?: number;
  propertyTypeId?: number;
  toDate?: string;
}

export interface StatisticsTimeSeriesData {
  // This will be dynamically typed based on the response structure
  [key: string]: any;
}

// ========================================
// CHART DATA INTERFACES
// ========================================

export interface ChartData {
  image: string;
  contentType: string;
  size: string;
  scale?: number;
}

// ========================================
// MARKET INSIGHTS SERVICE
// ========================================

class MarketInsightsService {
  private readonly baseUrl = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/market-insights`
    : 'https://esg-production.up.railway.app/api/market-insights';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private async makeRequest<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: object,
    params?: Record<string, any>
  ): Promise<CoreLogicApiResponse<T>> {
    const url = new URL(path, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const response = await fetch(url.toString(), {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
      } catch (error) {
        retries++;
        if (retries >= this.maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
      }
    }

    throw new Error('Max retries exceeded');
  }

  // ========================================
  // AUCTION METHODS
  // ========================================

  async getAuctionSummaries(
    state: string,
    capitalCityOnly: boolean = false
  ): Promise<CoreLogicApiResponse<AuctionSummariesData>> {
    return this.makeRequest<AuctionSummariesData>('GET', `/api/market-insights/auction/summaries/${state}`, undefined, {
      capitalCityOnly
    });
  }

  async getAuctionResults(
    state: string,
    capitalCityOnly: boolean = false,
    stats?: string[]
  ): Promise<CoreLogicApiResponse<AuctionResultsData>> {
    return this.makeRequest<AuctionResultsData>('GET', `/api/market-insights/auction/results/${state}`, undefined, {
      capitalCityOnly,
      stats: stats ? stats.join(',') : undefined
    });
  }

  async getAuctionResultsByWeeks(
    state: string,
    noOfWeeks: number,
    capitalCityOnly: boolean = false,
    stats?: string[]
  ): Promise<CoreLogicApiResponse<AuctionResultsByWeeksData>> {
    return this.makeRequest<AuctionResultsByWeeksData>('GET', `/api/market-insights/auction/results/${state}/weeks/${noOfWeeks}`, undefined, {
      capitalCityOnly,
      stats: stats ? stats.join(',') : undefined
    });
  }

  async searchAuctionResults(
    state: string,
    fromDate: string,
    toDate: string,
    capitalCityOnly: boolean = false,
    stats?: string[]
  ): Promise<CoreLogicApiResponse<AuctionResultsByWeeksData>> {
    return this.makeRequest<AuctionResultsByWeeksData>('GET', `/api/market-insights/auction/results/${state}/search`, undefined, {
      fromDate,
      toDate,
      capitalCityOnly,
      stats: stats ? stats.join(',') : undefined
    });
  }

  async getAuctionResultsComparison(
    state: string,
    years: number,
    capitalCityOnly: boolean = false,
    stats?: string[]
  ): Promise<CoreLogicApiResponse<AuctionResultsByWeeksData>> {
    return this.makeRequest<AuctionResultsByWeeksData>('GET', `/api/market-insights/auction/results/${state}/compare/years/${years}`, undefined, {
      capitalCityOnly,
      stats: stats ? stats.join(',') : undefined
    });
  }

  async getAuctionDetails(
    state: string,
    postcode: string,
    suburb: string
  ): Promise<CoreLogicApiResponse<AuctionDetailsData>> {
    return this.makeRequest<AuctionDetailsData>('GET', `/api/market-insights/auction/details/${state}/${postcode}/${encodeURIComponent(suburb)}`);
  }

  // ========================================
  // CENSUS METHODS
  // ========================================

  async getCensusStatistics(
    censusRequestList: CensusRequest[],
    forLatestCensusYear: boolean = true
  ): Promise<CoreLogicApiResponse<CensusStatisticsData>> {
    return this.makeRequest<CensusStatisticsData>('POST', '/api/market-insights/census/statistics', {
      censusRequestList
    }, {
      forLatestCensusYear
    });
  }

  async getCensusSummary(
    locationId: number,
    locationTypeId: number
  ): Promise<CoreLogicApiResponse<CensusSummaryData>> {
    return this.makeRequest<CensusSummaryData>('GET', '/api/market-insights/census/summary', undefined, {
      locationId,
      locationTypeId
    });
  }

  // ========================================
  // STATISTICS METHODS
  // ========================================

  async getStatisticsTimeSeries(
    seriesRequestList: SeriesRequest[]
  ): Promise<CoreLogicApiResponse<StatisticsTimeSeriesData>> {
    return this.makeRequest<StatisticsTimeSeriesData>('POST', '/api/market-insights/statistics/timeseries', {
      seriesRequestList
    });
  }

  // ========================================
  // CHART METHODS
  // ========================================

  async getCensusChart(
    chartSize: string,
    metricTypeGroupId: number,
    locationId: number,
    locationTypeId: number,
    chartTypeId?: number,
    chartType?: number
  ): Promise<string> {
    const params: Record<string, any> = {
      chartSize,
      metricTypeGroupId,
      's1.lId': locationId,
      's1.lTId': locationTypeId
    };

    if (chartTypeId) params.chartTypeId = chartTypeId;
    if (chartType) params['s1.cTId'] = chartType;

    const url = new URL('/charts/census', this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async getTimeSeriesChart(
    chartSize: string,
    locationId: number,
    locationTypeId: number,
    propertyTypeId: number,
    metricTypeId: number,
    fromDate?: string,
    toDate?: string,
    interval: number = 1,
    scale: number = 1
  ): Promise<string> {
    const params: Record<string, any> = {
      chartSize,
      's1.lId': locationId,
      's1.lTId': locationTypeId,
      's1.pTId': propertyTypeId,
      's1.mTId': metricTypeId,
      's1.i': interval,
      scale
    };

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const url = new URL('/charts/timeseries', this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async getServiceStats(): Promise<CoreLogicApiResponse<any>> {
    return this.makeRequest<any>('GET', '/api/market-insights/stats');
  }

  // Helper method to format clearance rate
  formatClearanceRate(rate: number): string {
    return `${rate.toFixed(1)}%`;
  }

  // Helper method to format property count
  formatPropertyCount(count: number): string {
    return count.toLocaleString();
  }

  // Helper method to get state display name
  getStateDisplayName(stateCode: string): string {
    const stateNames: Record<string, string> = {
      'NSW': 'New South Wales',
      'VIC': 'Victoria',
      'QLD': 'Queensland',
      'WA': 'Western Australia',
      'SA': 'South Australia',
      'TAS': 'Tasmania',
      'ACT': 'Australian Capital Territory',
      'NT': 'Northern Territory'
    };
    return stateNames[stateCode] || stateCode;
  }

  // Helper method to get auction result display name
  getAuctionResultDisplayName(result: string): string {
    const resultNames: Record<string, string> = {
      'SOLD': 'Sold',
      'PASSED_IN': 'Passed In',
      'WITHDRAWN': 'Withdrawn',
      'SOLD_PRIOR': 'Sold Prior',
      'SOLD_AFTER': 'Sold After'
    };
    return resultNames[result] || result;
  }
}

export const marketInsightsService = new MarketInsightsService();
