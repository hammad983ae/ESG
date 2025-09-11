/**
 * AVM Display Component - CoreLogic Automated Valuation Model Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Comprehensive AVM display component for showing CoreLogic valuations
 * with comparison tools and market analysis
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
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Building2,
  Target,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  avmService, 
  type AVMOriginationData, 
  type AVMConsumerBandData, 
  type LiveAVMData,
  type PropertyModificationData 
} from '@/lib/avmService';

interface AVMDisplayProps {
  propertyId: string | number;
  propertyAddress?: string;
  customValuation?: number;
  showComparison?: boolean;
  showHistory?: boolean;
  showLiveAVM?: boolean;
  className?: string;
  onAVMDataLoaded?: (data: any) => void;
}

export function AVMDisplay({
  propertyId,
  propertyAddress,
  customValuation,
  showComparison = true,
  showHistory = true,
  showLiveAVM = false,
  className = '',
  onAVMDataLoaded
}: AVMDisplayProps) {
  const [avmData, setAvmData] = useState<{
    origination?: AVMOriginationData;
    consumerBand?: AVMConsumerBandData;
    consumerHistory?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('current');
  const [liveAVMData, setLiveAVMData] = useState<LiveAVMData | null>(null);
  const [isLiveAVMLoading, setIsLiveAVMLoading] = useState(false);
  const { toast } = useToast();

  // Load AVM data on mount
  useEffect(() => {
    if (propertyId) {
      loadAVMData();
    }
  }, [propertyId]);

  const loadAVMData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await avmService.getComprehensiveAVMData(propertyId);
      setAvmData(data);
      onAVMDataLoaded?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AVM data';
      setError(errorMessage);
      toast({
        title: "AVM Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveAVM = async (propertyData: PropertyModificationData) => {
    if (!propertyId) return;

    setIsLiveAVMLoading(true);
    try {
      const result = await avmService.getLiveConsumerAVM(propertyId, propertyData);
      if (result.success && result.data) {
        setLiveAVMData(result.data);
        toast({
          title: "Live AVM Generated",
          description: "Property valuation updated with modifications"
        });
      } else {
        throw new Error(result.error || 'Failed to generate live AVM');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate live AVM';
      toast({
        title: "Live AVM Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLiveAVMLoading(false);
    }
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

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return <CheckCircle className="h-4 w-4" />;
      case 'MEDIUM_HIGH': return <Target className="h-4 w-4" />;
      case 'MEDIUM': return <Info className="h-4 w-4" />;
      case 'MEDIUM_LOW': return <AlertCircle className="h-4 w-4" />;
      case 'LOW': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
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

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            CoreLogic AVM Analysis
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
            <Building2 className="h-5 w-5" />
            CoreLogic AVM Analysis
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
                onClick={loadAVMData}
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

  if (!avmData) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            CoreLogic AVM Analysis
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadAVMData}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        {propertyAddress && (
          <p className="text-sm text-muted-foreground">{propertyAddress}</p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            {showHistory && <TabsTrigger value="history">History</TabsTrigger>}
            {showLiveAVM && <TabsTrigger value="live">Live AVM</TabsTrigger>}
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {/* Origination AVM */}
            {avmData.origination && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Origination AVM</h3>
                  <Badge className={getConfidenceColor(avmData.origination.confidence)}>
                    {getConfidenceIcon(avmData.origination.confidence)}
                    <span className="ml-1">{avmData.origination.confidence.replace('_', ' ')}</span>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estimate</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(avmData.origination.estimate)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Range</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(avmData.origination.lowEstimate)} - {formatCurrency(avmData.origination.highEstimate)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">FSD Score</p>
                    <p className="text-lg font-semibold">{avmData.origination.fsd}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Valuation Date: {formatDate(avmData.origination.valuationDate)}</span>
                  {avmData.origination.isCurrent && (
                    <Badge variant="outline" className="ml-2">Current</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Consumer Band AVM */}
            {avmData.consumerBand && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Consumer Band AVM</h3>
                  <Badge className={getConfidenceColor(avmData.consumerBand.confidence)}>
                    {getConfidenceIcon(avmData.consumerBand.confidence)}
                    <span className="ml-1">{avmData.consumerBand.confidence.replace('_', ' ')}</span>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estimated Range</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(avmData.consumerBand.lowerBand)} - {formatCurrency(avmData.consumerBand.upperBand)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Midpoint</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency((avmData.consumerBand.lowerBand + avmData.consumerBand.upperBand) / 2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Valuation Date: {formatDate(avmData.consumerBand.valuationDate)}</span>
                </div>
              </div>
            )}

            {/* Custom Valuation Comparison */}
            {showComparison && customValuation && avmData.origination && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Valuation Comparison</h3>
                <div className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Your Valuation</p>
                      <p className="text-xl font-bold">{formatCurrency(customValuation)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">AVM Estimate</p>
                      <p className="text-xl font-bold">{formatCurrency(avmData.origination.estimate)}</p>
                    </div>
                  </div>
                  
                  {(() => {
                    const comparison = avmService.compareWithCustomValuation(avmData.origination, customValuation);
                    return (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          {comparison.isWithinRange ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                          )}
                          <span className="text-sm font-medium">
                            Difference: {formatCurrency(Math.abs(comparison.difference))} 
                            ({Math.abs(comparison.percentageDifference).toFixed(1)}%)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comparison.recommendation}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </Button>
            </div>
          </TabsContent>

          {showHistory && (
            <TabsContent value="history" className="space-y-4">
              {avmData.consumerHistory?.valuations ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Historical AVM Data</h3>
                  <div className="space-y-2">
                    {avmData.consumerHistory.valuations.map((valuation: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {formatCurrency(valuation.estimate || (valuation.lowerBand + valuation.upperBand) / 2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(valuation.valuationDate)}
                            </p>
                          </div>
                          <Badge className={getConfidenceColor(valuation.confidence)}>
                            {valuation.confidence.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No historical data available</p>
              )}
            </TabsContent>
          )}

          {showLiveAVM && (
            <TabsContent value="live" className="space-y-4">
              <LiveAVMForm 
                propertyId={propertyId}
                onAVMGenerated={handleLiveAVM}
                isLoading={isLiveAVMLoading}
              />
              {liveAVMData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Live AVM Result</h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Estimate</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(liveAVMData.estimate)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Range</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(liveAVMData.lowEstimate)} - {formatCurrency(liveAVMData.highEstimate)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">FSD</p>
                        <p className="text-lg font-semibold">{liveAVMData.fsd}%</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Tracking ID: {liveAVMData.avmTrackingId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Live AVM Form Component
interface LiveAVMFormProps {
  propertyId: string | number;
  onAVMGenerated: (data: PropertyModificationData) => void;
  isLoading: boolean;
}

function LiveAVMForm({ propertyId, onAVMGenerated, isLoading }: LiveAVMFormProps) {
  const [formData, setFormData] = useState<PropertyModificationData>({
    bedrooms: 0,
    bathrooms: 0,
    carSpaces: 0,
    floorAreaM2: 0,
    landAreaM2: 0,
    yearBuilt: new Date().getFullYear(),
    craftsmanshipQuality: 'AVERAGE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAVMGenerated(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Live AVM with Property Modifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
            className="w-full p-2 border rounded-md"
            min="0"
            max="20"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
            className="w-full p-2 border rounded-md"
            min="0"
            max="20"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Car Spaces</label>
          <input
            type="number"
            value={formData.carSpaces || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, carSpaces: parseInt(e.target.value) || 0 }))}
            className="w-full p-2 border rounded-md"
            min="0"
            max="20"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Floor Area (m²)</label>
          <input
            type="number"
            value={formData.floorAreaM2 || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, floorAreaM2: parseFloat(e.target.value) || 0 }))}
            className="w-full p-2 border rounded-md"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Land Area (m²)</label>
          <input
            type="number"
            value={formData.landAreaM2 || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, landAreaM2: parseFloat(e.target.value) || 0 }))}
            className="w-full p-2 border rounded-md"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Year Built</label>
          <input
            type="number"
            value={formData.yearBuilt || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: parseInt(e.target.value) || new Date().getFullYear() }))}
            className="w-full p-2 border rounded-md"
            min="1800"
            max={new Date().getFullYear() + 1}
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            Generating AVM...
          </>
        ) : (
          <>
            <BarChart3 className="h-4 w-4 mr-1" />
            Generate Live AVM
          </>
        )}
      </Button>
    </form>
  );
}
