/**
 * AVM Comparison Component - Quick AVM Integration for Forms
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Lightweight AVM comparison component for integration into valuation forms
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Building2,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  avmService, 
  type AVMOriginationData, 
  type AVMConsumerBandData 
} from '@/lib/avmService';
import { coreLogicService } from '@/lib/corelogicService';

interface AVMComparisonProps {
  propertyId: string | number;
  customValuation: number;
  onComparisonComplete?: (comparison: AVMComparisonResult) => void;
  className?: string;
  compact?: boolean;
}

interface AVMComparisonResult {
  avmEstimate: number;
  customValuation: number;
  difference: number;
  percentageDifference: number;
  isWithinRange: boolean;
  recommendation: string;
  confidence: string;
  avmData: AVMOriginationData | AVMConsumerBandData;
}

export function AVMComparison({
  propertyId,
  customValuation,
  onComparisonComplete,
  className = '',
  compact = false
}: AVMComparisonProps) {
  const [avmData, setAvmData] = useState<AVMOriginationData | AVMConsumerBandData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<AVMComparisonResult | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [salesHistory, setSalesHistory] = useState<any>(null);
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (propertyId && customValuation > 0) {
      loadAVMData();
    }
  }, [propertyId, customValuation]);

  const loadAVMData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load AVM data and CoreLogic property data in parallel
      const [originationResult, consumerBandResult, propertyDetailsResult, salesResult, otmSalesResult] = await Promise.allSettled([
        avmService.getCurrentOriginationAVM(propertyId),
        avmService.getCurrentConsumerBandAVM(propertyId),
        coreLogicService.getPropertyCoreAttributes(propertyId, false),
        coreLogicService.getPropertySales(propertyId, false),
        coreLogicService.getOTMSales(propertyId, false)
      ]);

      let avmResult: AVMOriginationData | AVMConsumerBandData | null = null;

      if (originationResult.status === 'fulfilled' && originationResult.value.success) {
        avmResult = originationResult.value.data!;
      } else if (consumerBandResult.status === 'fulfilled' && consumerBandResult.value.success) {
        avmResult = consumerBandResult.value.data!;
      }

      // Set CoreLogic data
      if (propertyDetailsResult.status === 'fulfilled' && propertyDetailsResult.value.success) {
        setPropertyDetails(propertyDetailsResult.value.data);
      }
      if (salesResult.status === 'fulfilled' && salesResult.value.success) {
        setSalesHistory(salesResult.value.data);
      }
      if (otmSalesResult.status === 'fulfilled' && otmSalesResult.value.success) {
        setMarketInsights(otmSalesResult.value.data);
      }

      if (avmResult) {
        setAvmData(avmResult);
        const comparisonResult = avmService.compareWithCustomValuation(avmResult, customValuation);
        const result: AVMComparisonResult = {
          ...comparisonResult,
          avmEstimate: 'estimate' in avmResult ? avmResult.estimate : (avmResult.lowerBand + avmResult.upperBand) / 2,
          customValuation,
          avmData: avmResult,
          confidence: avmResult.confidence
        };
        setComparison(result);
        onComparisonComplete?.(result);
      } else {
        throw new Error('No AVM data available for this property');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AVM data';
      setError(errorMessage);
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

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'bg-green-100 text-green-800';
      case 'MEDIUM_HIGH': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'MEDIUM_LOW': return 'bg-orange-100 text-orange-800';
      case 'LOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifferenceIcon = (percentageDifference: number) => {
    if (Math.abs(percentageDifference) <= 5) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (Math.abs(percentageDifference) <= 15) {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className={compact ? "pb-2" : ""}>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            AVM Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className={compact ? "pt-2" : ""}>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className={compact ? "pb-2" : ""}>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            AVM Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className={compact ? "pt-2" : ""}>
          <Alert variant="destructive" className="text-xs">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 h-6 text-xs"
                onClick={loadAVMData}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!comparison) {
    return null;
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              AVM Comparison
            </CardTitle>
            <Badge className={getConfidenceColor(comparison.confidence)}>
              {comparison.confidence.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Your Valuation:</span>
            <span className="font-semibold">{formatCurrency(comparison.customValuation)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>AVM Estimate:</span>
            <span className="font-semibold">{formatCurrency(comparison.avmEstimate)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Difference:</span>
            <div className="flex items-center gap-1">
              {getDifferenceIcon(comparison.percentageDifference)}
              <span className={`font-semibold ${
                Math.abs(comparison.percentageDifference) <= 5 ? 'text-green-600' :
                Math.abs(comparison.percentageDifference) <= 15 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.abs(comparison.percentageDifference).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {comparison.recommendation}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AVM Comparison
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getConfidenceColor(comparison.confidence)}>
              {comparison.confidence.replace('_', ' ')}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadAVMData}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Your Valuation</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(comparison.customValuation)}
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">AVM Estimate</p>
            <p className="text-2xl font-bold">
              {formatCurrency(comparison.avmEstimate)}
            </p>
          </div>
        </div>

        <div className="text-center p-4 border rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getDifferenceIcon(comparison.percentageDifference)}
            <span className="text-lg font-semibold">
              Difference: {formatCurrency(Math.abs(comparison.difference))}
            </span>
          </div>
          <p className={`text-sm font-medium ${
            Math.abs(comparison.percentageDifference) <= 5 ? 'text-green-600' :
            Math.abs(comparison.percentageDifference) <= 15 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            ({Math.abs(comparison.percentageDifference).toFixed(1)}% {comparison.difference > 0 ? 'above' : 'below'} AVM)
          </p>
        </div>

        <div className="p-4 bg-muted/20 rounded-lg">
          <div className="flex items-start gap-2">
            {comparison.isWithinRange ? (
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium">Market Validation</p>
              <p className="text-sm text-muted-foreground">{comparison.recommendation}</p>
            </div>
          </div>
        </div>

        {'lowEstimate' in comparison.avmData && 'highEstimate' in comparison.avmData && (
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <p className="text-sm text-muted-foreground">AVM Range</p>
            <p className="font-semibold">
              {formatCurrency(comparison.avmData.lowEstimate)} - {formatCurrency(comparison.avmData.highEstimate)}
            </p>
          </div>
        )}

        {/* CoreLogic Property Data */}
        {(propertyDetails || salesHistory || marketInsights) && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Property Details */}
              {propertyDetails && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Property Details</h4>
                  <div className="space-y-1 text-sm">
                    {propertyDetails.propertyType && (
                      <p><span className="text-muted-foreground">Type:</span> {propertyDetails.propertyType}</p>
                    )}
                    {propertyDetails.beds && (
                      <p><span className="text-muted-foreground">Bedrooms:</span> {propertyDetails.beds}</p>
                    )}
                    {propertyDetails.baths && (
                      <p><span className="text-muted-foreground">Bathrooms:</span> {propertyDetails.baths}</p>
                    )}
                    {propertyDetails.carSpaces && (
                      <p><span className="text-muted-foreground">Car Spaces:</span> {propertyDetails.carSpaces}</p>
                    )}
                    {propertyDetails.landArea && (
                      <p><span className="text-muted-foreground">Land Area:</span> {propertyDetails.landArea}m²</p>
                    )}
                  </div>
                </div>
              )}

              {/* Sales History */}
              {salesHistory?.saleList && salesHistory.saleList.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Recent Sales</h4>
                  <div className="space-y-2">
                    {salesHistory.saleList.slice(0, 2).map((sale: any, index: number) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">
                          {sale.price ? formatCurrency(sale.price) : 'Price Withheld'}
                        </p>
                        <p className="text-muted-foreground">
                          {new Date(sale.contractDate).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Insights */}
              {marketInsights?.forSalePropertyCampaign?.campaigns && marketInsights.forSalePropertyCampaign.campaigns.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Current Market</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Active Listings:</span> {
                        marketInsights.forSalePropertyCampaign.campaigns.filter((c: any) => c.isActiveCampaign).length
                      }
                    </p>
                    {marketInsights.forSalePropertyCampaign.campaigns[0]?.priceDescription && (
                      <p>
                        <span className="text-muted-foreground">Price Range:</span> {
                          marketInsights.forSalePropertyCampaign.campaigns[0].priceDescription
                        }
                      </p>
                    )}
                    {marketInsights.forSalePropertyCampaign.campaigns[0]?.daysOnMarket && (
                      <p>
                        <span className="text-muted-foreground">Days on Market:</span> {
                          marketInsights.forSalePropertyCampaign.campaigns[0].daysOnMarket
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
