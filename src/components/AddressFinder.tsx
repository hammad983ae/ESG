/**
 * CoreLogic Address Finder Component
 * Provides address search with CoreLogic Address Matcher API integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Integrates with CoreLogic AddressRight algorithm for professional property matching
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, CheckCircle, AlertCircle, Loader2, Building, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { coreLogicService, type CoreLogicAddressMatch, type CoreLogicApiResponse } from "@/lib/corelogicService";
import { PropertyDetailsPanel } from "./PropertyDetailsPanel";

interface AddressFinderProps {
  onAddressSelect: (propertyData: CoreLogicAddressMatch) => void;
  placeholder?: string;
  clientName?: string;
  minConfidence?: number;
  showMatchDetails?: boolean;
  showPropertyDetails?: boolean;
}

export const AddressFinder = ({ 
  onAddressSelect, 
  placeholder = "Search property addresses with CoreLogic...",
  clientName = "Sustaino Pro",
  minConfidence = 0.7,
  showMatchDetails = true,
  showPropertyDetails = false
}: AddressFinderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<CoreLogicAddressMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<CoreLogicAddressMatch | null>(null);
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
    }, 500); // Slightly longer delay for API calls

    return () => clearTimeout(timeoutId);
  }, [searchTerm, clientName, minConfidence, toast]);

  const handleAddressSelect = (propertyData: CoreLogicAddressMatch) => {
    setSearchTerm(propertyData.address);
    setIsOpen(false);
    setSelectedProperty(propertyData);
    onAddressSelect(propertyData);
    
    // Only show toast if showPropertyDetails is false (standalone mode)
    if (!showPropertyDetails) {
      const matchQuality = getMatchQualityLabel(propertyData.matchType);
      toast({
        title: "Property Address Selected",
        description: `Matched with ${matchQuality} confidence (${Math.round(propertyData.confidence * 100)}%)`,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length < 3) {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding to allow for click events
    setTimeout(() => setIsOpen(false), 200);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    setError(null);
    setSelectedProperty(null);
    inputRef.current?.focus();
  };

  const getMatchQualityLabel = (matchType: string): string => {
    const labels = {
      'E': 'Exact Match',
      'A': 'Alias Match', 
      'P': 'Partial Match',
      'F': 'Fuzzy Match',
      'B': 'Building Level',
      'S': 'Street Level',
      'X': 'Postal Record',
      'D': 'Duplicate',
      'N': 'No Match',
      'M': 'Missing Elements',
      'Q': 'Query Only'
    };
    return labels[matchType as keyof typeof labels] || 'Unknown';
  };

  const getMatchQualityColor = (matchType: string): string => {
    const colors = {
      'E': 'text-green-600',
      'A': 'text-green-500',
      'P': 'text-yellow-600',
      'F': 'text-orange-500',
      'B': 'text-blue-500',
      'S': 'text-blue-400',
      'X': 'text-gray-500',
      'D': 'text-red-500',
      'N': 'text-red-600',
      'M': 'text-red-500',
      'Q': 'text-gray-400'
    };
    return colors[matchType as keyof typeof colors] || 'text-gray-500';
  };

  const getMatchQualityIcon = (matchType: string) => {
    if (['E', 'A'].includes(matchType)) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (['P', 'F'].includes(matchType)) return <Building className="h-4 w-4 text-yellow-600" />;
    if (['B', 'S'].includes(matchType)) return <MapPin className="h-4 w-4 text-blue-500" />;
    return <AlertCircle className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {searchTerm && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              ×
            </Button>
          )}
        </div>

        {isOpen && suggestions.length > 0 && (
          <Card className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto shadow-lg border">
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-muted cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddressSelect(suggestion);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getMatchQualityIcon(suggestion.matchType)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{suggestion.address}</p>
                      {suggestion.suburb && suggestion.state && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.suburb}, {suggestion.state} {suggestion.postcode}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getMatchQualityColor(suggestion.matchType)}`}
                        >
                          {getMatchQualityLabel(suggestion.matchType)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                        {suggestion.propertyId && (
                          <Badge variant="outline" className="text-xs">
                            ID: {suggestion.propertyId.substring(0, 8)}...
                          </Badge>
                        )}
                      </div>
                      {showMatchDetails && suggestion.updateIndicator === 'U' && (
                        <p className="text-xs text-amber-600 mt-1">
                          Address was updated for better matching
                        </p>
                      )}
                    </div>
                    <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <p className="text-xs text-muted-foreground mt-1">
            Enter at least 3 characters to search
          </p>
        )}
      </div>

      {/* Property Details Panel */}
      {showPropertyDetails && selectedProperty && selectedProperty.propertyId && (
        <PropertyDetailsPanel
          propertyId={selectedProperty.propertyId}
          propertyAddress={selectedProperty.address}
          className="mt-4"
        />
      )}
    </div>
  );
};