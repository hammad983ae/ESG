/**
 * Market Insights Dashboard Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000018
 * 
 * Comprehensive dashboard for CoreLogic Market Insights data
 * Displays auction data, census information, and market statistics
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp, TrendingDown, BarChart3, MapPin, Calendar, Users, Home, DollarSign, Activity, AlertCircle, RefreshCw } from "lucide-react";
import { marketInsightsService, AuctionSummariesData, AuctionResultsData, CensusSummaryData } from '@/lib/marketInsightsService';
import { coreLogicService } from '@/lib/corelogicService';

interface MarketInsightsDashboardProps {
  className?: string;
}

const MarketInsightsDashboard: React.FC<MarketInsightsDashboardProps> = ({ className }) => {
  // State management
  const [selectedState, setSelectedState] = useState<string>('NSW');
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [selectedPostcode, setSelectedPostcode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [auctionSummaries, setAuctionSummaries] = useState<AuctionSummariesData | null>(null);
  const [auctionResults, setAuctionResults] = useState<AuctionResultsData | null>(null);
  const [censusSummary, setCensusSummary] = useState<CensusSummaryData | null>(null);
  const [propertyInsights, setPropertyInsights] = useState<any>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Australian states
  const states = [
    { code: 'NSW', name: 'New South Wales' },
    { code: 'VIC', name: 'Victoria' },
    { code: 'QLD', name: 'Queensland' },
    { code: 'WA', name: 'Western Australia' },
    { code: 'SA', name: 'South Australia' },
    { code: 'TAS', name: 'Tasmania' },
    { code: 'ACT', name: 'Australian Capital Territory' },
    { code: 'NT', name: 'Northern Territory' }
  ];

  // Load auction summaries for selected state
  const loadAuctionSummaries = async () => {
    if (!selectedState) return;

    setLoading(true);
    setError(null);

    try {
      const response = await marketInsightsService.getAuctionSummaries(selectedState, false);
      if (response.success && response.data) {
        setAuctionSummaries(response.data);
      } else {
        setError(response.error || 'Failed to load auction summaries');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load auction results for selected state
  const loadAuctionResults = async () => {
    if (!selectedState) return;

    setLoading(true);
    setError(null);

    try {
      const response = await marketInsightsService.getAuctionResults(selectedState, false);
      if (response.success && response.data) {
        setAuctionResults(response.data);
      } else {
        // Handle specific error cases
        if (response.statusCode === 500) {
          setError('Auction results are temporarily unavailable. Please try again later or contact support if the issue persists.');
        } else {
          setError(response.error || 'Failed to load auction results');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load census summary for selected location
  const loadCensusSummary = async () => {
    if (!selectedSuburb || !selectedPostcode) return;

    setLoading(true);
    setError(null);

    try {
      // Note: This would need actual location IDs from CoreLogic
      // For demo purposes, using placeholder values
      const response = await marketInsightsService.getCensusSummary(12345, 8); // 8 = Locality
      if (response.success && response.data) {
        setCensusSummary(response.data);
      } else {
        setError(response.error || 'Failed to load census summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load property insights for a specific property
  const loadPropertyInsights = async (propertyId: string) => {
    setLoading(true);
    setError(null);
    setSelectedPropertyId(propertyId);

    try {
      const [salesResult, otmSalesResult, coreAttributesResult] = await Promise.allSettled([
        coreLogicService.getPropertySales(propertyId, false),
        coreLogicService.getOTMSales(propertyId, false),
        coreLogicService.getPropertyCoreAttributes(propertyId, false)
      ]);

      const insights: any = {};
      
      if (salesResult.status === 'fulfilled' && salesResult.value.success) {
        insights.sales = salesResult.value.data;
      }
      if (otmSalesResult.status === 'fulfilled' && otmSalesResult.value.success) {
        insights.otmSales = otmSalesResult.value.data;
      }
      if (coreAttributesResult.status === 'fulfilled' && coreAttributesResult.value.success) {
        insights.attributes = coreAttributesResult.value.data;
      }

      setPropertyInsights(insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property insights');
    } finally {
      setLoading(false);
    }
  };

  // Load all data when state changes
  useEffect(() => {
    if (selectedState) {
      loadAuctionSummaries();
      loadAuctionResults();
    }
  }, [selectedState]);

  // Load census data when suburb and postcode are selected
  useEffect(() => {
    if (selectedSuburb && selectedPostcode) {
      loadCensusSummary();
    }
  }, [selectedSuburb, selectedPostcode]);

  const formatClearanceRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  const formatPropertyCount = (count: number) => {
    return count.toLocaleString();
  };

  const getClearanceRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market Insights Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time auction data, census information, and market statistics
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Live Data
        </Badge>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis Controls</CardTitle>
          <CardDescription>
            Select a state and location to analyze market data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb</Label>
              <Input
                id="suburb"
                placeholder="Enter suburb name"
                value={selectedSuburb}
                onChange={(e) => setSelectedSuburb(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                placeholder="Enter postcode"
                value={selectedPostcode}
                onChange={(e) => setSelectedPostcode(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadAuctionSummaries} disabled={loading || !selectedState}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              Refresh Auction Data
            </Button>
            <Button onClick={loadCensusSummary} disabled={loading || !selectedSuburb || !selectedPostcode}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
              Load Census Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="auctions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auctions">Auction Data</TabsTrigger>
          <TabsTrigger value="census">Census Data</TabsTrigger>
          <TabsTrigger value="statistics">Market Statistics</TabsTrigger>
          <TabsTrigger value="property">Property Insights</TabsTrigger>
        </TabsList>

        {/* Auction Data Tab */}
        <TabsContent value="auctions" className="space-y-4">
          {/* Auction Results Summary */}
          {auctionResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPropertyCount(auctionResults.totalScheduledAuctions)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Results</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPropertyCount(auctionResults.totalAuctionResults)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sold at Auction</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPropertyCount(auctionResults.soldAtAuction)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clearance Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getClearanceRateColor(auctionResults.clearanceRate)}`}>
                    {formatClearanceRate(auctionResults.clearanceRate)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fallback message when auction results are not available */}
          {!auctionResults && !loading && selectedState && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Auction Results Temporarily Unavailable
                </CardTitle>
                <CardDescription>
                  Auction results data is currently not available for {marketInsightsService.getStateDisplayName(selectedState)}. 
                  This may be due to API maintenance or service limitations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You can still view auction summaries and other market data. Please try again later or contact support if the issue persists.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={loadAuctionResults} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                    <Button onClick={loadAuctionSummaries} variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Summaries
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Auction Summaries by Suburb */}
          {auctionSummaries && (
            <Card>
              <CardHeader>
                <CardTitle>Auction Summaries by Suburb</CardTitle>
                <CardDescription>
                  Properties listed for auction in {marketInsightsService.getStateDisplayName(selectedState)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auctionSummaries.auctionSummaries.slice(0, 10).map((summary, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{summary.locality}</div>
                        <div className="text-sm text-muted-foreground">
                          {summary.postcode} • {summary.propertyCount} properties
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {summary.propertyCount} auctions
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {auctionSummaries.auctionSummaries.length > 10 && (
                    <div className="text-center text-sm text-muted-foreground">
                      And {auctionSummaries.auctionSummaries.length - 10} more suburbs...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Census Data Tab */}
        <TabsContent value="census" className="space-y-4">
          {censusSummary ? (
            <Card>
              <CardHeader>
                <CardTitle>Census Summary</CardTitle>
                <CardDescription>
                  Population and demographic data for {censusSummary.localityName || 'Selected Area'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-sm leading-relaxed">
                    {censusSummary.censusSummaryDescription}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Population Change (5 years)</Label>
                    <div className="text-2xl font-bold text-green-600">
                      {censusSummary.fiveYearPopulationChange}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Location Type</Label>
                    <div className="text-sm text-muted-foreground">
                      {censusSummary.locationType}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Census Data</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Enter a suburb and postcode to load census information
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Market Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Statistics</CardTitle>
              <CardDescription>
                Advanced market analysis and trend data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Statistics Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced market statistics and trend analysis will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Insights Tab */}
        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Insights
              </CardTitle>
              <CardDescription>
                Enter a property ID to view detailed property data and market insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Property ID (e.g., 17241185)"
                  value={selectedPropertyId || ''}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                />
                <Button 
                  onClick={() => selectedPropertyId && loadPropertyInsights(selectedPropertyId)}
                  disabled={!selectedPropertyId || loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Load Insights
                </Button>
              </div>

              {propertyInsights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Property Attributes */}
                  {propertyInsights.attributes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Property Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {propertyInsights.attributes.propertyType && (
                          <p className="text-sm"><span className="text-muted-foreground">Type:</span> {propertyInsights.attributes.propertyType}</p>
                        )}
                        {propertyInsights.attributes.beds && (
                          <p className="text-sm"><span className="text-muted-foreground">Bedrooms:</span> {propertyInsights.attributes.beds}</p>
                        )}
                        {propertyInsights.attributes.baths && (
                          <p className="text-sm"><span className="text-muted-foreground">Bathrooms:</span> {propertyInsights.attributes.baths}</p>
                        )}
                        {propertyInsights.attributes.carSpaces && (
                          <p className="text-sm"><span className="text-muted-foreground">Car Spaces:</span> {propertyInsights.attributes.carSpaces}</p>
                        )}
                        {propertyInsights.attributes.landArea && (
                          <p className="text-sm"><span className="text-muted-foreground">Land Area:</span> {propertyInsights.attributes.landArea}m²</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Sales History */}
                  {propertyInsights.sales?.saleList && propertyInsights.sales.saleList.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Recent Sales</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {propertyInsights.sales.saleList.slice(0, 3).map((sale: any, index: number) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">
                              {sale.price ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(sale.price) : 'Price Withheld'}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(sale.contractDate).toLocaleDateString('en-AU')}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Market Listings */}
                  {propertyInsights.otmSales?.forSalePropertyCampaign?.campaigns && propertyInsights.otmSales.forSalePropertyCampaign.campaigns.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Current Market</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Active Listings:</span> {
                            propertyInsights.otmSales.forSalePropertyCampaign.campaigns.filter((c: any) => c.isActiveCampaign).length
                          }
                        </p>
                        {propertyInsights.otmSales.forSalePropertyCampaign.campaigns[0]?.priceDescription && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Price Range:</span> {
                              propertyInsights.otmSales.forSalePropertyCampaign.campaigns[0].priceDescription
                            }
                          </p>
                        )}
                        {propertyInsights.otmSales.forSalePropertyCampaign.campaigns[0]?.daysOnMarket && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Days on Market:</span> {
                              propertyInsights.otmSales.forSalePropertyCampaign.campaigns[0].daysOnMarket
                            }
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {!propertyInsights && selectedPropertyId && (
                <div className="text-center py-8 text-muted-foreground">
                  <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Load Insights" to view property data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketInsightsDashboard;
