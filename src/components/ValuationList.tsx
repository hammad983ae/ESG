/**
 * Delorenzo Property Group - Valuation List Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Component for displaying and managing valuation list
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Archive, 
  Eye, 
  Edit, 
  Calendar,
  DollarSign,
  Building2,
  Leaf,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useValuation } from '@/contexts/ValuationContext';
import { ValuationData } from '@/services/valuationApi';
import { format } from 'date-fns';

interface ValuationListProps {
  onSelectValuation?: (valuation: ValuationData) => void;
  onEditValuation?: (valuation: ValuationData) => void;
  showActions?: boolean;
  className?: string;
}

export function ValuationList({ 
  onSelectValuation, 
  onEditValuation, 
  showActions = true,
  className = '' 
}: ValuationListProps) {
  const {
    state,
    loadValuations,
    searchValuations,
    deleteValuation,
    archiveValuation,
    setFilters,
    setSearchQuery,
    toggleValuationSelection,
    clearSelections,
    setSelectedValuations,
    exportValuations,
    filteredValuations,
    selectedValuationData
  } = useValuation();

  const [searchQuery, setSearchQueryLocal] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'propertyName' | 'marketValue'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load valuations on mount
  useEffect(() => {
    loadValuations();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQueryLocal(query);
    setSearchQuery(query);
    if (query.trim()) {
      searchValuations(query, state.filters);
    } else {
      loadValuations(state.filters);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...state.filters, [key]: value };
    setFilters(newFilters);
    loadValuations(newFilters);
  };

  // Handle sort
  const handleSort = (field: 'createdAt' | 'propertyName' | 'marketValue') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort valuations
  const sortedValuations = [...filteredValuations].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
      case 'propertyName':
        aValue = a.propertyName.toLowerCase();
        bValue = b.propertyName.toLowerCase();
        break;
      case 'marketValue':
        aValue = a.results?.marketValue || 0;
        bValue = b.results?.marketValue || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle select all
  const handleSelectAll = () => {
    if (state.selectedValuations.length === sortedValuations.length) {
      clearSelections();
    } else {
      setSelectedValuations(sortedValuations.map(v => v._id || ''));
    }
  };

  // Handle export
  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    exportValuations(format);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this valuation?')) {
      await deleteValuation(id);
    }
  };

  // Handle archive
  const handleArchive = async (id: string) => {
    await archiveValuation(id);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'commercial': return '🏢';
      case 'residential': return '🏠';
      case 'industrial': return '🏭';
      case 'retail': return '🛍️';
      case 'office': return '🏢';
      case 'hospitality': return '🏨';
      case 'childcare': return '👶';
      case 'petrol-station': return '⛽';
      case 'stadium': return '🏟️';
      case 'agricultural': return '🚜';
      default: return '🏗️';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Valuations</h2>
          <p className="text-muted-foreground">
            {state.valuations.length} total valuations
            {state.selectedValuations.length > 0 && ` • ${state.selectedValuations.length} selected`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {state.selectedValuations.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelections}
              >
                Clear Selection
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search valuations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Valuation Type</label>
                  <Select
                    value={state.filters.valuationType || ''}
                    onValueChange={(value) => handleFilterChange('valuationType', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="ary">All Risks Yield</SelectItem>
                      <SelectItem value="esg-ary">ESG-Adjusted ARY</SelectItem>
                      <SelectItem value="dcf">DCF Analysis</SelectItem>
                      <SelectItem value="capitalization-sensitivity">Cap Rate Sensitivity</SelectItem>
                      <SelectItem value="net-income">Net Income Approach</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="childcare">Childcare</SelectItem>
                      <SelectItem value="stadium">Stadium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select
                    value={state.filters.propertyType || ''}
                    onValueChange={(value) => handleFilterChange('propertyType', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All properties</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="childcare">Childcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={state.filters.status || ''}
                    onValueChange={(value) => handleFilterChange('status', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">ESG</label>
                  <Select
                    value={state.filters.esgIncluded?.toString() || ''}
                    onValueChange={(value) => handleFilterChange('esgIncluded', value === 'true' ? true : value === 'false' ? false : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="true">ESG Enabled</SelectItem>
                      <SelectItem value="false">ESG Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant={sortBy === 'createdAt' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('createdAt')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant={sortBy === 'propertyName' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('propertyName')}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Name {sortBy === 'propertyName' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant={sortBy === 'marketValue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('marketValue')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Value {sortBy === 'marketValue' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={state.selectedValuations.length === sortedValuations.length && sortedValuations.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">Select all</span>
        </div>
      </div>

      {/* Loading State */}
      {state.loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading valuations...</p>
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive font-medium">Error loading valuations</p>
              <p className="text-sm text-muted-foreground mt-1">{state.error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadValuations()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Valuations List */}
      {!state.loading && !state.error && (
        <div className="space-y-4">
          {sortedValuations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No valuations found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try adjusting your search criteria' : 'Create your first valuation to get started'}
                  </p>
                  {!searchQuery && (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Valuation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            sortedValuations.map((valuation) => (
              <Card key={valuation._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Checkbox
                        checked={state.selectedValuations.includes(valuation._id || '')}
                        onCheckedChange={() => toggleValuationSelection(valuation._id || '')}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getPropertyTypeIcon(valuation.propertyType)}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{valuation.propertyName}</h3>
                            <p className="text-muted-foreground">{valuation.propertyLocation}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant={getStatusBadgeVariant(valuation.status || 'draft')}>
                            {valuation.status || 'draft'}
                          </Badge>
                          <Badge variant="outline">
                            {valuation.valuationType.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {valuation.propertyType}
                          </Badge>
                          {valuation.esgIncluded && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Leaf className="h-3 w-3" />
                              ESG
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Market Value:</span>
                            <p className="font-semibold">
                              {valuation.results?.marketValue 
                                ? formatCurrency(valuation.results.marketValue)
                                : 'N/A'
                              }
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Method:</span>
                            <p className="font-medium">{valuation.calculationMethod}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <p className="font-medium">
                              {valuation.createdAt 
                                ? format(new Date(valuation.createdAt), 'MMM dd, yyyy')
                                : 'N/A'
                              }
                            </p>
                          </div>
                        </div>

                        {valuation.notes && (
                          <div className="mt-3">
                            <span className="text-muted-foreground text-sm">Notes:</span>
                            <p className="text-sm mt-1">{valuation.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {showActions && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectValuation?.(valuation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditValuation?.(valuation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchive(valuation._id || '')}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(valuation._id || '')}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
