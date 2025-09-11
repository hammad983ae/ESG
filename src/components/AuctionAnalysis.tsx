/**
 * Auction Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000018
 * 
 * Specialized component for detailed auction analysis
 * Displays auction results, trends, and comparative data
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar, 
  Home, 
  DollarSign, 
  Activity, 
  AlertCircle,
  MapPin,
  Clock,
  Users,
  Target
} from "lucide-react";
import { 
  marketInsightsService, 
  AuctionResultsData, 
  AuctionDetailsData,
  WeeklyAuctionResults 
} from '@/lib/marketInsightsService';

interface AuctionAnalysisProps {
  className?: string;
}

const AuctionAnalysis: React.FC<AuctionAnalysisProps> = ({ className }) => {
  // State management
  const [selectedState, setSelectedState] = useState<string>('NSW');
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [selectedPostcode, setSelectedPostcode] = useState<string>('');
  const [weeksToAnalyze, setWeeksToAnalyze] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [auctionResults, setAuctionResults] = useState<AuctionResultsData | null>(null);
  const [weeklyResults, setWeeklyResults] = useState<WeeklyAuctionResults[]>([]);
  const [auctionDetails, setAuctionDetails] = useState<AuctionDetailsData | null>(null);
  const [comparisonData, setComparisonData] = useState<WeeklyAuctionResults[]>([]);

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

  // Load current auction results
  const loadAuctionResults = async () => {
    if (!selectedState) return;

    setLoading(true);
    setError(null);

    try {
      const response = await marketInsightsService.getAuctionResults(selectedState, false);
      if (response.success && response.data) {
        setAuctionResults(response.data);
      } else {
        setError(response.error || 'Failed to load auction results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load weekly auction results
  const loadWeeklyResults = async () => {
    if (!selectedState) return;

    setLoading(true);
    setError(null);

    try {
      const response = await marketInsightsService.getAuctionResultsByWeeks(selectedState, weeksToAnalyze, false);
      if (response.success && response.data) {
        setWeeklyResults(response.data.weeklyResults);
      } else {
        setError(response.error || 'Failed to load weekly results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load auction details for specific suburb
  const loadAuctionDetails = async () => {
    if (!selectedState || !selectedSuburb || !selectedPostcode) return;

    setLoading(true);
    setError(null);

    try {
      const response = await marketInsightsService.getAuctionDetails(selectedState, selectedPostcode, selectedSuburb);
      if (response.success && response.data) {
        setAuctionDetails(response.data);
      } else {
        setError(response.error || 'Failed to load auction details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load comparison data (year over year)
  const loadComparisonData = async () => {
    if (!selectedState) return;

    setLoading(true);
    setError(null);

    try {
      const response = await marketInsightsService.getAuctionResultsComparison(selectedState, 1, false);
      if (response.success && response.data) {
        setComparisonData(response.data.weeklyResults);
      } else {
        setError(response.error || 'Failed to load comparison data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load all data when state changes
  useEffect(() => {
    if (selectedState) {
      loadAuctionResults();
      loadWeeklyResults();
      loadComparisonData();
    }
  }, [selectedState]);

  // Load weekly results when weeks change
  useEffect(() => {
    if (selectedState && weeksToAnalyze) {
      loadWeeklyResults();
    }
  }, [weeksToAnalyze]);

  // Load auction details when suburb and postcode are selected
  useEffect(() => {
    if (selectedState && selectedSuburb && selectedPostcode) {
      loadAuctionDetails();
    }
  }, [selectedState, selectedSuburb, selectedPostcode]);

  const formatClearanceRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  const formatPropertyCount = (count: number) => {
    return count.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getClearanceRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getClearanceRateTrend = (current: number, previous: number) => {
    const change = current - previous;
    if (change > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${change.toFixed(1)}%` };
    if (change < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${change.toFixed(1)}%` };
    return { icon: Activity, color: 'text-gray-600', text: '0%' };
  };

  const calculateAverageClearanceRate = (results: WeeklyAuctionResults[]) => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.clearanceRate, 0);
    return total / results.length;
  };

  const calculateTotalProperties = (results: WeeklyAuctionResults[]) => {
    return results.reduce((sum, result) => sum + result.totalScheduledAuctions, 0);
  };

  const calculateTotalSold = (results: WeeklyAuctionResults[]) => {
    return results.reduce((sum, result) => sum + result.soldAtAuction, 0);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auction Analysis</h2>
          <p className="text-muted-foreground">
            Detailed auction performance analysis and market trends
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
          <CardTitle>Auction Analysis Controls</CardTitle>
          <CardDescription>
            Configure your analysis parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Label htmlFor="weeks">Analysis Period</Label>
              <Select value={weeksToAnalyze.toString()} onValueChange={(value) => setWeeksToAnalyze(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weeks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Week</SelectItem>
                  <SelectItem value="2">2 Weeks</SelectItem>
                  <SelectItem value="4">4 Weeks</SelectItem>
                  <SelectItem value="8">8 Weeks</SelectItem>
                  <SelectItem value="12">12 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb (Optional)</Label>
              <Input
                id="suburb"
                placeholder="Enter suburb name"
                value={selectedSuburb}
                onChange={(e) => setSelectedSuburb(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode (Optional)</Label>
              <Input
                id="postcode"
                placeholder="Enter postcode"
                value={selectedPostcode}
                onChange={(e) => setSelectedPostcode(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadAuctionResults} disabled={loading || !selectedState}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              Refresh Data
            </Button>
            <Button onClick={loadAuctionDetails} disabled={loading || !selectedSuburb || !selectedPostcode}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              Load Suburb Details
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
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Current Week Results */}
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
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getClearanceRateColor(auctionResults.clearanceRate)}`}>
                    {formatClearanceRate(auctionResults.clearanceRate)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Passed In</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPropertyCount(auctionResults.passedIn)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Weekly Analysis Summary */}
          {weeklyResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Analysis Summary</CardTitle>
                <CardDescription>
                  Performance over the last {weeksToAnalyze} weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatClearanceRate(calculateAverageClearanceRate(weeklyResults))}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Clearance Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatPropertyCount(calculateTotalProperties(weeklyResults))}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {formatPropertyCount(calculateTotalSold(weeklyResults))}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Sold</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          {weeklyResults.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>
                  Clearance rate and auction volume trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyResults.map((result, index) => {
                    const previousResult = index > 0 ? weeklyResults[index - 1] : null;
                    const trend = previousResult ? getClearanceRateTrend(result.clearanceRate, previousResult.clearanceRate) : null;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">
                            Week of {new Date(result.summaryDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPropertyCount(result.totalScheduledAuctions)} scheduled • {formatPropertyCount(result.soldAtAuction)} sold
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getClearanceRateColor(result.clearanceRate)}`}>
                              {formatClearanceRate(result.clearanceRate)}
                            </div>
                            {trend && (
                              <div className={`text-xs flex items-center gap-1 ${trend.color}`}>
                                <trend.icon className="h-3 w-3" />
                                {trend.text}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Trend Data</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Select a state and analysis period to view trends
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          {auctionDetails ? (
            <Card>
              <CardHeader>
                <CardTitle>Auction Details - {auctionDetails.auctionDetails[0]?.locality}</CardTitle>
                <CardDescription>
                  Individual property auction results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auctionDetails.auctionDetails.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{detail.singleLine}</div>
                        <div className="text-sm text-muted-foreground">
                          {detail.propertyType} • {detail.beds} bed, {detail.baths} bath • {detail.carSpaces} car
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {detail.agency} • {new Date(detail.auctionDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {detail.salePrice > 0 ? formatCurrency(detail.salePrice) : 'Not Sold'}
                        </div>
                        <Badge variant={detail.salePrice > 0 ? "default" : "secondary"}>
                          {marketInsightsService.getAuctionResultDisplayName(detail.auctionResult)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Details Available</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Enter a suburb and postcode to view detailed auction results
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          {comparisonData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
                <CardDescription>
                  Comparing current performance with the same period last year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonData.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {index === 0 ? 'Current Year' : 'Previous Year'} - Week of {new Date(result.summaryDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatPropertyCount(result.totalScheduledAuctions)} scheduled • {formatPropertyCount(result.soldAtAuction)} sold
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getClearanceRateColor(result.clearanceRate)}`}>
                          {formatClearanceRate(result.clearanceRate)}
                        </div>
                        <div className="text-xs text-muted-foreground">Clearance Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Comparison Data</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Select a state to view year-over-year comparison
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionAnalysis;
