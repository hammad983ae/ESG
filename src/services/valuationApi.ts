/**
 * Delorenzo Property Group - Valuation API Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Frontend API service for valuation backend integration
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const API_BASE_URL = 'http://localhost:3001/api';

export interface ValuationData {
  _id?: string;
  propertyName: string;
  propertyLocation: string;
  propertyType: string;
  valuationType: string;
  userId: string;
  sessionId: string;
  status?: 'draft' | 'completed' | 'archived';
  esgIncluded?: boolean;
  esgFactor?: number;
  results: Record<string, any>;
  inputs: Record<string, any>;
  calculationMethod: string;
  isPublic?: boolean;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValuationFilters {
  valuationType?: string;
  propertyType?: string;
  status?: string;
  esgIncluded?: boolean;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  skip?: number;
}

export interface SearchFilters extends ValuationFilters {
  q?: string;
}

export interface ValuationStats {
  totalValuations: number;
  completedValuations: number;
  draftValuations: number;
  archivedValuations: number;
  esgValuations: number;
  averageMarketValue: number;
  totalMarketValue: number;
  valuationTypes: Array<{
    _id: string;
    count: number;
  }>;
}

export interface ValuationType {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: any[];
}

class ValuationApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get current user ID from session or generate one
   */
  private getUserId(): string {
    // In a real app, this would come from authentication
    const storedUserId = localStorage.getItem('valuation_user_id');
    if (storedUserId) {
      return storedUserId;
    }
    
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('valuation_user_id', newUserId);
    return newUserId;
  }

  /**
   * Get current session ID
   */
  private getSessionId(): string {
    const storedSessionId = sessionStorage.getItem('valuation_session_id');
    if (storedSessionId) {
      return storedSessionId;
    }
    
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('valuation_session_id', newSessionId);
    return newSessionId;
  }

  /**
   * Make HTTP request with error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create a new valuation
   */
  async createValuation(valuationData: Omit<ValuationData, 'userId' | 'sessionId'>): Promise<ApiResponse<ValuationData>> {
    const data = {
      ...valuationData,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
    };

    return this.makeRequest<ValuationData>('/valuations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get all valuations for current user
   */
  async getValuations(filters: ValuationFilters = {}): Promise<ApiResponse<ValuationData[]>> {
    const params = new URLSearchParams({
      userId: this.getUserId(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    });

    return this.makeRequest<ValuationData[]>(`/valuations?${params}`);
  }

  /**
   * Get valuation by ID
   */
  async getValuationById(id: string): Promise<ApiResponse<ValuationData>> {
    const params = new URLSearchParams({
      userId: this.getUserId(),
    });

    return this.makeRequest<ValuationData>(`/valuations/${id}?${params}`);
  }

  /**
   * Update valuation
   */
  async updateValuation(id: string, updateData: Partial<ValuationData>): Promise<ApiResponse<ValuationData>> {
    const data = {
      ...updateData,
      userId: this.getUserId(),
    };

    return this.makeRequest<ValuationData>(`/valuations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete valuation
   */
  async deleteValuation(id: string): Promise<ApiResponse<void>> {
    const params = new URLSearchParams({
      userId: this.getUserId(),
    });

    return this.makeRequest<void>(`/valuations/${id}?${params}`, {
      method: 'DELETE',
    });
  }

  /**
   * Archive valuation
   */
  async archiveValuation(id: string): Promise<ApiResponse<ValuationData>> {
    return this.makeRequest<ValuationData>(`/valuations/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: this.getUserId() }),
    });
  }

  /**
   * Share valuation with another user
   */
  async shareValuation(
    id: string,
    shareWithUserId: string,
    permission: 'read' | 'write' | 'admin' = 'read'
  ): Promise<ApiResponse<ValuationData>> {
    return this.makeRequest<ValuationData>(`/valuations/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({
        shareWithUserId,
        permission,
        ownerId: this.getUserId(),
      }),
    });
  }

  /**
   * Search valuations
   */
  async searchValuations(filters: SearchFilters = {}): Promise<ApiResponse<ValuationData[]>> {
    const params = new URLSearchParams({
      userId: this.getUserId(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    });

    return this.makeRequest<ValuationData[]>(`/valuations/search?${params}`);
  }

  /**
   * Get valuation statistics
   */
  async getValuationStats(): Promise<ApiResponse<ValuationStats>> {
    const params = new URLSearchParams({
      userId: this.getUserId(),
    });

    return this.makeRequest<ValuationStats>(`/valuations/stats?${params}`);
  }

  /**
   * Export valuations
   */
  async exportValuations(
    valuationIds: string[],
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/valuations/export', {
      method: 'POST',
      body: JSON.stringify({
        valuationIds,
        format,
        userId: this.getUserId(),
      }),
    });
  }

  /**
   * Get supported valuation types
   */
  async getSupportedValuationTypes(): Promise<ApiResponse<ValuationType[]>> {
    return this.makeRequest<ValuationType[]>('/valuations/types');
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/health');
  }

  /**
   * Get API status
   */
  async getApiStatus(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/status');
  }

  /**
   * Save valuation with auto-save functionality
   */
  async saveValuation(
    valuationData: Omit<ValuationData, 'userId' | 'sessionId'>,
    isDraft: boolean = false
  ): Promise<ApiResponse<ValuationData>> {
    const data = {
      ...valuationData,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      status: isDraft ? 'draft' : 'completed',
    };

    return this.makeRequest<ValuationData>('/valuations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update valuation status
   */
  async updateValuationStatus(
    id: string,
    status: 'draft' | 'completed' | 'archived'
  ): Promise<ApiResponse<ValuationData>> {
    return this.makeRequest<ValuationData>(`/valuations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        userId: this.getUserId(),
      }),
    });
  }

  /**
   * Get valuations by type
   */
  async getValuationsByType(valuationType: string): Promise<ApiResponse<ValuationData[]>> {
    return this.getValuations({ valuationType });
  }

  /**
   * Get valuations by property type
   */
  async getValuationsByPropertyType(propertyType: string): Promise<ApiResponse<ValuationData[]>> {
    return this.getValuations({ propertyType });
  }

  /**
   * Get ESG-enabled valuations
   */
  async getESGValuations(): Promise<ApiResponse<ValuationData[]>> {
    return this.getValuations({ esgIncluded: true });
  }

  /**
   * Get recent valuations
   */
  async getRecentValuations(limit: number = 10): Promise<ApiResponse<ValuationData[]>> {
    return this.getValuations({ limit });
  }

  /**
   * Search valuations by text
   */
  async searchValuationsByText(query: string, filters: ValuationFilters = {}): Promise<ApiResponse<ValuationData[]>> {
    return this.searchValuations({ q: query, ...filters });
  }

  /**
   * Get valuation analytics
   */
  async getValuationAnalytics(): Promise<ApiResponse<any>> {
    const [stats, recentValuations] = await Promise.all([
      this.getValuationStats(),
      this.getRecentValuations(5)
    ]);

    return {
      success: stats.success && recentValuations.success,
      data: {
        stats: stats.data,
        recentValuations: recentValuations.data,
      },
    };
  }
}

// Create and export singleton instance
export const valuationApi = new ValuationApiService();
export default valuationApi;
