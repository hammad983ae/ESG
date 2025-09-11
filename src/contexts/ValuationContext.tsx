/**
 * Delorenzo Property Group - Valuation Context
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * React context for valuation state management
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { valuationApi, ValuationData, ValuationFilters, ValuationStats } from '../services/valuationApi';

interface ValuationState {
  valuations: ValuationData[];
  currentValuation: ValuationData | null;
  loading: boolean;
  error: string | null;
  filters: ValuationFilters;
  stats: ValuationStats | null;
  searchQuery: string;
  selectedValuations: string[];
}

type ValuationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VALUATIONS'; payload: ValuationData[] }
  | { type: 'ADD_VALUATION'; payload: ValuationData }
  | { type: 'UPDATE_VALUATION'; payload: ValuationData }
  | { type: 'DELETE_VALUATION'; payload: string }
  | { type: 'SET_CURRENT_VALUATION'; payload: ValuationData | null }
  | { type: 'SET_FILTERS'; payload: ValuationFilters }
  | { type: 'SET_STATS'; payload: ValuationStats | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_VALUATIONS'; payload: string[] }
  | { type: 'TOGGLE_VALUATION_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTIONS' };

const initialState: ValuationState = {
  valuations: [],
  currentValuation: null,
  loading: false,
  error: null,
  filters: {},
  stats: null,
  searchQuery: '',
  selectedValuations: [],
};

function valuationReducer(state: ValuationState, action: ValuationAction): ValuationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_VALUATIONS':
      return { ...state, valuations: action.payload, loading: false, error: null };
    
    case 'ADD_VALUATION':
      return { ...state, valuations: [action.payload, ...state.valuations] };
    
    case 'UPDATE_VALUATION':
      return {
        ...state,
        valuations: state.valuations.map(v => 
          v._id === action.payload._id ? action.payload : v
        ),
        currentValuation: state.currentValuation?._id === action.payload._id 
          ? action.payload 
          : state.currentValuation
      };
    
    case 'DELETE_VALUATION':
      return {
        ...state,
        valuations: state.valuations.filter(v => v._id !== action.payload),
        currentValuation: state.currentValuation?._id === action.payload 
          ? null 
          : state.currentValuation,
        selectedValuations: state.selectedValuations.filter(id => id !== action.payload)
      };
    
    case 'SET_CURRENT_VALUATION':
      return { ...state, currentValuation: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SELECTED_VALUATIONS':
      return { ...state, selectedValuations: action.payload };
    
    case 'TOGGLE_VALUATION_SELECTION':
      return {
        ...state,
        selectedValuations: state.selectedValuations.includes(action.payload)
          ? state.selectedValuations.filter(id => id !== action.payload)
          : [...state.selectedValuations, action.payload]
      };
    
    case 'CLEAR_SELECTIONS':
      return { ...state, selectedValuations: [] };
    
    default:
      return state;
  }
}

interface ValuationContextType {
  state: ValuationState;
  // Actions
  loadValuations: (filters?: ValuationFilters) => Promise<void>;
  loadValuationById: (id: string) => Promise<void>;
  createValuation: (data: Omit<ValuationData, 'userId' | 'sessionId'>) => Promise<boolean>;
  updateValuation: (id: string, data: Partial<ValuationData>) => Promise<boolean>;
  deleteValuation: (id: string) => Promise<boolean>;
  archiveValuation: (id: string) => Promise<boolean>;
  searchValuations: (query: string, filters?: ValuationFilters) => Promise<void>;
  loadStats: () => Promise<void>;
  exportValuations: (format: 'json' | 'csv' | 'pdf') => Promise<void>;
  setCurrentValuation: (valuation: ValuationData | null) => void;
  setFilters: (filters: ValuationFilters) => void;
  setSearchQuery: (query: string) => void;
  toggleValuationSelection: (id: string) => void;
  clearSelections: () => void;
  setSelectedValuations: (ids: string[]) => void;
  // Computed values
  filteredValuations: ValuationData[];
  selectedValuationData: ValuationData[];
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export function ValuationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(valuationReducer, initialState);

  // Load valuations
  const loadValuations = async (filters: ValuationFilters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.getValuations(filters);
      if (response.success && response.data) {
        dispatch({ type: 'SET_VALUATIONS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to load valuations' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  // Load single valuation
  const loadValuationById = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.getValuationById(id);
      if (response.success && response.data) {
        dispatch({ type: 'SET_CURRENT_VALUATION', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to load valuation' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  // Create valuation
  const createValuation = async (data: Omit<ValuationData, 'userId' | 'sessionId'>): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.createValuation(data);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_VALUATION', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to create valuation' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  // Update valuation
  const updateValuation = async (id: string, data: Partial<ValuationData>): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.updateValuation(id, data);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_VALUATION', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update valuation' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  // Delete valuation
  const deleteValuation = async (id: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.deleteValuation(id);
      if (response.success) {
        dispatch({ type: 'DELETE_VALUATION', payload: id });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete valuation' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  // Archive valuation
  const archiveValuation = async (id: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.archiveValuation(id);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_VALUATION', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to archive valuation' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  // Search valuations
  const searchValuations = async (query: string, filters: ValuationFilters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await valuationApi.searchValuations({ q: query, ...filters });
      if (response.success && response.data) {
        dispatch({ type: 'SET_VALUATIONS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to search valuations' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await valuationApi.getValuationStats();
      if (response.success && response.data) {
        dispatch({ type: 'SET_STATS', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Export valuations
  const exportValuations = async (format: 'json' | 'csv' | 'pdf') => {
    if (state.selectedValuations.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'No valuations selected for export' });
      return;
    }

    try {
      const response = await valuationApi.exportValuations(state.selectedValuations, format);
      if (response.success && response.data) {
        // Handle file download
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { 
          type: 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `valuations.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to export valuations' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  // Set current valuation
  const setCurrentValuation = (valuation: ValuationData | null) => {
    dispatch({ type: 'SET_CURRENT_VALUATION', payload: valuation });
  };

  // Set filters
  const setFilters = (filters: ValuationFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Set search query
  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  // Toggle valuation selection
  const toggleValuationSelection = (id: string) => {
    dispatch({ type: 'TOGGLE_VALUATION_SELECTION', payload: id });
  };

  // Clear selections
  const clearSelections = () => {
    dispatch({ type: 'CLEAR_SELECTIONS' });
  };

  // Set selected valuations
  const setSelectedValuations = (ids: string[]) => {
    dispatch({ type: 'SET_SELECTED_VALUATIONS', payload: ids });
  };

  // Computed values
  const filteredValuations = state.valuations.filter(valuation => {
    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const matchesSearch = 
        valuation.propertyName.toLowerCase().includes(query) ||
        valuation.propertyLocation.toLowerCase().includes(query) ||
        valuation.valuationType.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Apply filters
    if (state.filters.valuationType && valuation.valuationType !== state.filters.valuationType) {
      return false;
    }
    if (state.filters.propertyType && valuation.propertyType !== state.filters.propertyType) {
      return false;
    }
    if (state.filters.status && valuation.status !== state.filters.status) {
      return false;
    }
    if (state.filters.esgIncluded !== undefined && valuation.esgIncluded !== state.filters.esgIncluded) {
      return false;
    }

    return true;
  });

  const selectedValuationData = state.valuations.filter(v => 
    state.selectedValuations.includes(v._id || '')
  );

  // Load initial data
  useEffect(() => {
    loadValuations();
    loadStats();
  }, []);

  const contextValue: ValuationContextType = {
    state,
    loadValuations,
    loadValuationById,
    createValuation,
    updateValuation,
    deleteValuation,
    archiveValuation,
    searchValuations,
    loadStats,
    exportValuations,
    setCurrentValuation,
    setFilters,
    setSearchQuery,
    toggleValuationSelection,
    clearSelections,
    setSelectedValuations,
    filteredValuations,
    selectedValuationData,
  };

  return (
    <ValuationContext.Provider value={contextValue}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuation() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
}
