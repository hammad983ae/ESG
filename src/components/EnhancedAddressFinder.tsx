/**
 * Enhanced Address Finder with Weather Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Enhanced address finder that combines CoreLogic address matching with Google Maps geocoding
 * and optional weather data integration for agricultural and property applications.
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.1.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Cloud, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Info
} from 'lucide-react';
import { coreLogicService, CoreLogicAddressMatch } from '@/lib/corelogicService';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAddressFinderProps {
  onAddressSelect?: (data: {
    corelogic: CoreLogicAddressMatch;
    coordinates?: {
      lat: number;
      lng: number;
      source: 'corelogic' | 'google_maps';
    };
    weather?: any;
  }) => void;
  showPropertyDetails?: boolean;
  showWeatherData?: boolean;
  enableWeatherIntegration?: boolean;
  cropType?: string;
  className?: string;
}

export function EnhancedAddressFinder({
  onAddressSelect,
  showPropertyDetails = true,
  showWeatherData = false,
  enableWeatherIntegration = true,
  cropType,
  className = ''
}: EnhancedAddressFinderProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<CoreLogicAddressMatch[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CoreLogicAddressMatch | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [showWeather, setShowWeather] = useState(showWeatherData);
  const [includeWeather, setIncludeWeather] = useState(enableWeatherIntegration);

  // Search for addresses
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter an address to search for.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSearchResults([]);
    setSelectedAddress(null);
    setWeatherData(null);

    try {
      const result = await coreLogicService.searchAddressWithWeather(
        searchQuery.trim(),
        'Sustaino Pro',
        {
          includeWeatherData: includeWeather,
          cropType: cropType
        }
      );

      if (result.corelogic.success && result.corelogic.data) {
        setSearchResults([result.corelogic.data]);
        setSelectedAddress(result.corelogic.data);
        
        if (result.weather) {
          setWeatherData(result.weather);
        }

        // Call the callback with enhanced data
        if (onAddressSelect) {
          onAddressSelect({
            corelogic: result.corelogic.data,
            coordinates: result.corelogic.data.coordinates ? {
              lat: result.corelogic.data.coordinates.latitude,
              lng: result.corelogic.data.coordinates.longitude,
              source: result.corelogic.data.coordinates.source
            } : undefined,
            weather: result.weather
          });
        }

        toast({
          title: "Address Found",
          description: `Successfully found address with ${result.corelogic.data.coordinates?.source || 'no'} coordinates`,
        });
      } else {
        toast({
          title: "Address Not Found",
          description: result.corelogic.error || "No matching address found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Address search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get match quality icon
  const getMatchQualityIcon = (matchType: string) => {
    switch (matchType) {
      case 'E':
      case 'A':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'P':
      case 'F':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Enhanced Address Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter property address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !searchQuery.trim()}
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Weather Integration Toggle */}
          {enableWeatherIntegration && (
            <div className="flex items-center space-x-2">
              <Switch
                id="include-weather"
                checked={includeWeather}
                onCheckedChange={setIncludeWeather}
              />
              <Label htmlFor="include-weather" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Include Weather Data
              </Label>
            </div>
          )}

          {/* Crop Type Selection */}
          {includeWeather && cropType && (
            <div className="space-y-2">
              <Label>Crop Type for Weather Analysis</Label>
              <Select defaultValue={cropType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="apples">Apples</SelectItem>
                  <SelectItem value="citrus">Citrus</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Address Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="space-y-3">
                {/* Address Information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{result.address}</h3>
                    <div className="flex items-center gap-2">
                      {getMatchQualityIcon(result.matchType)}
                      <Badge className={getConfidenceColor(result.confidence)}>
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    {result.suburb && <div>Suburb: {result.suburb}</div>}
                    {result.state && <div>State: {result.state}</div>}
                    {result.postcode && <div>Postcode: {result.postcode}</div>}
                    {result.propertyId && <div>Property ID: {result.propertyId}</div>}
                  </div>
                </div>

                {/* Coordinates Information */}
                {result.coordinates && (
                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div>Coordinates: {result.coordinates.latitude.toFixed(6)}, {result.coordinates.longitude.toFixed(6)}</div>
                        <div className="text-xs">
                          Source: {result.coordinates.source === 'corelogic' ? 'CoreLogic' : 'Google Maps'}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Property Details */}
                {showPropertyDetails && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Match Type</div>
                      <div className="text-muted-foreground">{result.matchType}</div>
                    </div>
                    <div>
                      <div className="font-medium">Match Rule</div>
                      <div className="text-muted-foreground">{result.matchRule}</div>
                    </div>
                    <div>
                      <div className="font-medium">Update Indicator</div>
                      <div className="text-muted-foreground">{result.updateIndicator}</div>
                    </div>
                    <div>
                      <div className="font-medium">Confidence</div>
                      <div className="text-muted-foreground">{Math.round(result.confidence * 100)}%</div>
                    </div>
                  </div>
                )}

                {/* Weather Data Toggle */}
                {result.coordinates && includeWeather && (
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Switch
                      id="show-weather"
                      checked={showWeather}
                      onCheckedChange={setShowWeather}
                    />
                    <Label htmlFor="show-weather" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Show Weather Dashboard
                    </Label>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weather Dashboard */}
      {showWeather && selectedAddress?.coordinates && weatherData && (
        <WeatherDashboard
          location={{
            lat: selectedAddress.coordinates.latitude,
            lon: selectedAddress.coordinates.longitude,
            city: selectedAddress.suburb || selectedAddress.address
          }}
          cropType={cropType}
          showAgriculturalInsights={true}
        />
      )}

      {/* No Weather Data Message */}
      {showWeather && selectedAddress?.coordinates && !weatherData && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Weather data is not available for this location. This could be due to API limitations or network issues.
          </AlertDescription>
        </Alert>
      )}

      {/* No Coordinates Message */}
      {selectedAddress && !selectedAddress.coordinates && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No coordinates available for this address. Weather data cannot be displayed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default EnhancedAddressFinder;