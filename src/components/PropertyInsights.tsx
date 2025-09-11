/**
 * Property Insights Component - Market Analysis and Property Intelligence
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Provides comprehensive property insights using CoreLogic Property Data API
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Building2,
  Users,
  Phone,
  Mail,
  Camera,
  FileText,
  Shield,
  Home,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink,
  BarChart3,
  Target,
  Activity
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { coreLogicService, type CoreLogicApiResponse } from '@/lib/corelogicService';
import { AddressFinder } from './AddressFinder';

interface PropertyInsightsProps {
  propertyId?: string | number;
  propertyAddress?: string;
  className?: string;
  onInsightsLoaded?: (data: any) => void;
}

interface PropertyInsightData {
  otmSales?: any;
  otmRent?: any;
  timeline?: any;
  sales?: any;
  occupancy?: any;
  location?: any;
  images?: any;
  coreAttributes?: any;
  additionalAttributes?: any;
}

export function PropertyInsights({
  propertyId,
  propertyAddress,
  className = '',
  onInsightsLoaded
}: PropertyInsightsProps) {
  const [insightData, setInsightData] = useState<PropertyInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('market');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { toast } = useToast();

  // Use selectedProperty if no propertyId is provided
  const currentPropertyId = propertyId || selectedProperty?.propertyId;
  const currentPropertyAddress = propertyAddress || selectedProperty?.address;

  // Load property insights on mount
  useEffect(() => {
    if (currentPropertyId) {
      loadPropertyInsights();
    }
  }, [currentPropertyId]);

  const handleAddressSelect = (data: any) => {
    toast({
      title: "Property Selected",
      description: `Selected: ${data.address}`,
    });
    setSelectedProperty(data);
  };

  const clearSearch = () => {
    setSelectedProperty(null);
    setInsightData(null);
  };

  const loadPropertyInsights = async () => {
    if (!currentPropertyId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Load key market data in parallel
      const [
        otmSalesResponse,
        otmRentResponse,
        timelineResponse,
        salesResponse,
        occupancyResponse,
        locationResponse,
        imagesResponse,
        coreAttributesResponse,
        additionalAttributesResponse
      ] = await Promise.allSettled([
        coreLogicService.getOTMSales(currentPropertyId, false),
        coreLogicService.getOTMRent(currentPropertyId, false),
        coreLogicService.getPropertyTimeline(currentPropertyId),
        coreLogicService.getPropertySales(currentPropertyId, false),
        coreLogicService.getPropertyOccupancy(currentPropertyId, false),
        coreLogicService.getPropertyLocation(currentPropertyId, false),
        coreLogicService.getPropertyImages(currentPropertyId, false),
        coreLogicService.getPropertyCoreAttributes(currentPropertyId, false),
        coreLogicService.getPropertyAdditionalAttributes(currentPropertyId, false)
      ]);

      const data: PropertyInsightData = {
        otmSales: otmSalesResponse.status === 'fulfilled' && otmSalesResponse.value.success ? otmSalesResponse.value.data : null,
        otmRent: otmRentResponse.status === 'fulfilled' && otmRentResponse.value.success ? otmRentResponse.value.data : null,
        timeline: timelineResponse.status === 'fulfilled' && timelineResponse.value.success ? timelineResponse.value.data : null,
        sales: salesResponse.status === 'fulfilled' && salesResponse.value.success ? salesResponse.value.data : null,
        occupancy: occupancyResponse.status === 'fulfilled' && occupancyResponse.value.success ? occupancyResponse.value.data : null,
        location: locationResponse.status === 'fulfilled' && locationResponse.value.success ? locationResponse.value.data : null,
        images: imagesResponse.status === 'fulfilled' && imagesResponse.value.success ? imagesResponse.value.data : null,
        coreAttributes: coreAttributesResponse.status === 'fulfilled' && coreAttributesResponse.value.success ? coreAttributesResponse.value.data : null,
        additionalAttributes: additionalAttributesResponse.status === 'fulfilled' && additionalAttributesResponse.value.success ? additionalAttributesResponse.value.data : null
      };

      setInsightData(data);
      onInsightsLoaded?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load property insights';
      setError(errorMessage);
      toast({
        title: "Property Insights Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMarketTrend = () => {
    if (!insightData?.sales?.saleList || insightData.sales.saleList.length < 2) {
      return { trend: 'stable', change: 0 };
    }

    const sales = insightData.sales.saleList.slice(0, 2);
    const latest = sales[0];
    const previous = sales[1];

    if (!latest.price || !previous.price) {
      return { trend: 'stable', change: 0 };
    }

    const change = ((latest.price - previous.price) / previous.price) * 100;
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: Math.abs(change)
    };
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Property Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Property Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={loadPropertyInsights}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show AddressFinder if no property is selected
  if (!currentPropertyId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Property Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Search for a property to view comprehensive market insights, sales history, and property details.
            </p>
            <AddressFinder
              onAddressSelect={handleAddressSelect}
              showPropertyDetails={false}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insightData) {
    return null;
  }

  const marketTrend = getMarketTrend();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Property Insights
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadPropertyInsights}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        {currentPropertyAddress && (
          <p className="text-sm text-muted-foreground">{currentPropertyAddress}</p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            {/* Market Overview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Overview
              </h3>
              
              {/* Market Trend */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Market Trend</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {marketTrend.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {marketTrend.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {marketTrend.trend === 'stable' && <Activity className="h-4 w-4 text-gray-600" />}
                    <span className="font-semibold capitalize">{marketTrend.trend}</span>
                  </div>
                  {marketTrend.change > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {marketTrend.change.toFixed(1)}% change
                    </p>
                  )}
                </div>

                {/* Current Listings */}
                {insightData.otmSales?.forSalePropertyCampaign?.campaigns?.length > 0 && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Sales</p>
                    <p className="text-2xl font-bold text-primary">
                      {insightData.otmSales.forSalePropertyCampaign.campaigns.filter((c: any) => c.isActiveCampaign).length}
                    </p>
                  </div>
                )}

                {/* Current Rentals */}
                {insightData.otmRent?.forRentPropertyCampaign?.campaigns?.length > 0 && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Rentals</p>
                    <p className="text-2xl font-bold text-primary">
                      {insightData.otmRent.forRentPropertyCampaign.campaigns.filter((c: any) => c.isActiveCampaign).length}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Sales */}
            {insightData.sales?.saleList && insightData.sales.saleList.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Recent Sales
                </h3>
                <div className="space-y-2">
                  {insightData.sales.saleList.slice(0, 3).map((sale: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {sale.price ? formatCurrency(sale.price) : 'Price Withheld'}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(sale.contractDate)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Agency</p>
                          <p>{sale.agencyName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Agent</p>
                          <p>{sale.agentName || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Listings */}
            {(insightData.otmSales?.forSalePropertyCampaign?.campaigns?.length > 0 || 
              insightData.otmRent?.forRentPropertyCampaign?.campaigns?.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Listings
                </h3>
                
                {/* Sales Listings */}
                {insightData.otmSales?.forSalePropertyCampaign?.campaigns?.map((campaign: any, index: number) => (
                  <div key={`sales-${index}`} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={campaign.isActiveCampaign ? 'default' : 'secondary'}>
                        {campaign.isActiveCampaign ? 'Active Sale' : 'Inactive Sale'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.daysOnMarket} days on market
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold">{campaign.priceDescription || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agency</p>
                        <p className="font-semibold">{campaign.agency?.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-semibold">{campaign.agent?.agent || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rental Listings */}
                {insightData.otmRent?.forRentPropertyCampaign?.campaigns?.map((campaign: any, index: number) => (
                  <div key={`rent-${index}`} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={campaign.isActiveCampaign ? 'default' : 'secondary'}>
                        {campaign.isActiveCampaign ? 'Active Rental' : 'Inactive Rental'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.daysOnMarket} days on market
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Rent</p>
                        <p className="font-semibold">{campaign.priceDescription || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agency</p>
                        <p className="font-semibold">{campaign.agency?.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-semibold">{campaign.agent?.agent || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Property Timeline */}
            {insightData.timeline?.eventTimeline && insightData.timeline.eventTimeline.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Property Timeline
                </h3>
                <div className="space-y-2">
                  {insightData.timeline.eventTimeline.slice(0, 10).map((event: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold capitalize">{event.type}</p>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      {event.detail && (
                        <div className="text-sm text-muted-foreground">
                          {event.detail.priceDescription && (
                            <p>Price: {event.detail.priceDescription}</p>
                          )}
                          {event.detail.agency && (
                            <p>Agency: {event.detail.agency}</p>
                          )}
                          {event.detail.agent && (
                            <p>Agent: {event.detail.agent}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Occupancy Status */}
            {insightData.occupancy && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Occupancy Status
                </h3>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {insightData.occupancy.occupancyType || 'Unknown'}
                  </Badge>
                  <Badge 
                    variant={insightData.occupancy.confidenceScore === 'High' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {insightData.occupancy.confidenceScore || 'Unknown'} Confidence
                  </Badge>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Property Attributes Summary */}
            {insightData.coreAttributes && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">{insightData.coreAttributes.propertyType || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{insightData.coreAttributes.beds || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{insightData.coreAttributes.baths || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Car Spaces</p>
                    <p className="font-semibold">{insightData.coreAttributes.carSpaces || 'N/A'}</p>
                  </div>
                </div>
                {insightData.coreAttributes.landArea && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Land Area</p>
                    <p className="font-semibold">{insightData.coreAttributes.landArea}m²</p>
                  </div>
                )}
              </div>
            )}

            {/* Key Features */}
            {insightData.additionalAttributes && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Key Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {insightData.additionalAttributes.airConditioned && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Air Conditioning</span>
                    </div>
                  )}
                  {insightData.additionalAttributes.pool && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Swimming Pool</span>
                    </div>
                  )}
                  {insightData.additionalAttributes.fireplace && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Fireplace</span>
                    </div>
                  )}
                  {insightData.additionalAttributes.solarPower && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Solar Power</span>
                    </div>
                  )}
                  {insightData.additionalAttributes.yearBuilt && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Built {insightData.additionalAttributes.yearBuilt}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Insights */}
            {insightData.location && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Insights
                </h3>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">{insightData.location.singleLine}</p>
                  {insightData.location.councilArea && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Council: {insightData.location.councilArea}
                    </p>
                  )}
                  {insightData.location.coordinates && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {insightData.location.latitude}, {insightData.location.longitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
