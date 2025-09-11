/**
 * Enhanced Address Finder with AVM Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Enhanced address finder that includes AVM lookup after address selection
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Building, 
  Shield,
  DollarSign,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { coreLogicService, type CoreLogicAddressMatch, type CoreLogicApiResponse } from "@/lib/corelogicService";
import { avmService, type AVMOriginationData, type AVMConsumerBandData } from "@/lib/avmService";
import { AVMComparison } from "./AVMComparison";

interface EnhancedAddressFinderProps {
  onAddressSelect: (propertyData: CoreLogicAddressMatch & { avmData?: any }) => void;
  placeholder?: string;
  clientName?: string;
  minConfidence?: number;
  showMatchDetails?: boolean;
  showAVM?: boolean;
  customValuation?: number;
  className?: string;
}

export const EnhancedAddressFinder = ({ 
  onAddressSelect, 
  placeholder = "Search property addresses with CoreLogic...",
  clientName = "Sustaino Pro",
  minConfidence = 0.7,
  showMatchDetails = true,
  showAVM = true,
  customValuation,
  className = ""
}: EnhancedAddressFinderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<CoreLogicAddressMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<CoreLogicAddressMatch | null>(null);
  const [avmData, setAvmData] = useState<{
    origination?: AVMOriginationData;
    consumerBand?: AVMConsumerBandData;
  } | null>(null);
  const [isAVMLoading, setIsAVMLoading] = useState(false);
  const [avmError, setAvmError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const formattedAddress = coreLogicService.formatAddressForMatching(searchTerm);
        const response = await coreLogicService.searchAddress(formattedAddress, clientName);
        
        if (response.success && response.data) {
          // Filter by confidence if specified
          if (coreLogicService.isAcceptableMatch(response.data, minConfidence)) {
            setSuggestions([response.data]);
            setIsOpen(true);
          } else {
            setSuggestions([]);
            setError("No suitable matches found. Try a more specific address.");
          }
        } else {
          setSuggestions([]);
          setError(response.error || "No matches found");
        }
      } catch (error) {
        console.error('CoreLogic address search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search addresses. Please try again.",
          variant: "destructive",
        });
        setError("Search failed");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, clientName, minConfidence, toast]);

  const handleAddressSelect = async (propertyData: CoreLogicAddressMatch) => {
    setSearchTerm(propertyData.address);
    setIsOpen(false);
    setSelectedProperty(propertyData);
    
    // Load AVM data if enabled
    if (showAVM && propertyData.propertyId) {
      await loadAVMData(propertyData.propertyId);
    }

    const matchQuality = getMatchQualityLabel(propertyData.matchType);
    toast({
      title: "Property Address Selected",
      description: `Matched with ${matchQuality} confidence (${Math.round(propertyData.confidence * 100)}%)`,
    });

    // Pass property data with AVM data to parent
    onAddressSelect({
      ...propertyData,
      avmData: avmData
    });
  };

  const loadAVMData = async (propertyId: string) => {
    setIsAVMLoading(true);
    setAvmError(null);

    try {
      const data = await avmService.getComprehensiveAVMData(propertyId);
      setAvmData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AVM data';
      setAvmError(errorMessage);
    } finally {
      setIsAVMLoading(false);
    }
  };

  const getMatchQualityLabel = (matchType: string) => {
    switch (matchType) {
      case 'E': return 'Exact Match';
      case 'A': return 'Alias Match';
      case 'P': return 'Partial Match';
      case 'F': return 'Fuzzy Match';
      case 'B': return 'Building Match';
      case 'S': return 'Street Match';
      default: return 'Match';
    }
  };

  const getMatchQualityColor = (matchType: string) => {
    switch (matchType) {
      case 'E': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'P': return 'bg-yellow-100 text-yellow-800';
      case 'F': return 'bg-orange-100 text-orange-800';
      case 'B': return 'bg-purple-100 text-purple-800';
      case 'S': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address Search */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("")}
            disabled={!searchTerm}
          >
            Clear
          </Button>
        </div>

        {/* Search Results */}
        {isOpen && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
            <CardContent className="p-0">
              {suggestions.map((property, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleAddressSelect(property)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{property.address}</span>
                      </div>
                      {showMatchDetails && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge className={getMatchQualityColor(property.matchType)}>
                            {getMatchQualityLabel(property.matchType)}
                          </Badge>
                          <span>Confidence: {Math.round(property.confidence * 100)}%</span>
                          {property.propertyId && (
                            <span>ID: {property.propertyId}</span>
                          )}
                        </div>
                      )}
                      {property.suburb && property.state && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {property.suburb}, {property.state} {property.postcode}
                        </p>
                      )}
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Selected Property with AVM Data */}
      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Selected Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Property Details</TabsTrigger>
                {showAVM && <TabsTrigger value="avm">AVM Analysis</TabsTrigger>}
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedProperty.address}</span>
                  </div>
                  {selectedProperty.suburb && selectedProperty.state && (
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.suburb}, {selectedProperty.state} {selectedProperty.postcode}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge className={getMatchQualityColor(selectedProperty.matchType)}>
                      {getMatchQualityLabel(selectedProperty.matchType)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {Math.round(selectedProperty.confidence * 100)}%
                    </span>
                  </div>
                  {selectedProperty.propertyId && (
                    <p className="text-sm text-muted-foreground">
                      Property ID: {selectedProperty.propertyId}
                    </p>
                  )}
                </div>
              </TabsContent>

              {showAVM && (
                <TabsContent value="avm" className="space-y-4">
                  {isAVMLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : avmError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {avmError}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => selectedProperty.propertyId && loadAVMData(selectedProperty.propertyId)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ) : avmData ? (
                    <div className="space-y-4">
                      {/* Origination AVM */}
                      {avmData.origination && (
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Origination AVM
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="text-center p-3 bg-muted/30 rounded">
                              <p className="text-sm text-muted-foreground">Estimate</p>
                              <p className="font-bold text-primary">
                                {formatCurrency(avmData.origination.estimate)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded">
                              <p className="text-sm text-muted-foreground">Range</p>
                              <p className="text-sm">
                                {formatCurrency(avmData.origination.lowEstimate)} - {formatCurrency(avmData.origination.highEstimate)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded">
                              <p className="text-sm text-muted-foreground">FSD</p>
                              <p className="text-sm font-semibold">{avmData.origination.fsd}%</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Consumer Band AVM */}
                      {avmData.consumerBand && (
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Consumer Band AVM
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="text-center p-3 bg-muted/30 rounded">
                              <p className="text-sm text-muted-foreground">Range</p>
                              <p className="font-bold text-primary">
                                {formatCurrency(avmData.consumerBand.lowerBand)} - {formatCurrency(avmData.consumerBand.upperBand)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded">
                              <p className="text-sm text-muted-foreground">Midpoint</p>
                              <p className="font-semibold">
                                {formatCurrency((avmData.consumerBand.lowerBand + avmData.consumerBand.upperBand) / 2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AVM Comparison if custom valuation provided */}
                      {customValuation && avmData.origination && (
                        <AVMComparison
                          propertyId={selectedProperty.propertyId}
                          customValuation={customValuation}
                          compact={true}
                        />
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No AVM data available for this property</p>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
