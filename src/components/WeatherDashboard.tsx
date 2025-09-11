/**
 * Weather Dashboard Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Comprehensive weather visualization dashboard for agricultural and property applications
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  RefreshCw,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { weatherService, WeatherLocation, WeatherImageType, AgriculturalWeatherData } from '@/lib/weatherService';
import { useToast } from '@/hooks/use-toast';

interface WeatherDashboardProps {
  location: WeatherLocation;
  cropType?: string;
  showAgriculturalInsights?: boolean;
  className?: string;
}

export function WeatherDashboard({ 
  location, 
  cropType, 
  showAgriculturalInsights = true,
  className = '' 
}: WeatherDashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<AgriculturalWeatherData | null>(null);
  const [weatherImages, setWeatherImages] = useState<Record<string, string>>({});
  const [selectedImageType, setSelectedImageType] = useState<WeatherImageType>('meteogram');

  // Load weather data on component mount
  useEffect(() => {
    loadWeatherData();
  }, [location, cropType]);

  const loadWeatherData = async () => {
    setIsLoading(true);
    try {
      const [agriculturalData, meteogram, agriculturalChart, weeklyForecast] = await Promise.allSettled([
        weatherService.getAgriculturalInsights(location, cropType),
        weatherService.getMeteogram(location, 7, 1),
        weatherService.getAgriculturalWeatherChart(location, 7),
        weatherService.getWeeklyForecast(location)
      ]);

      if (agriculturalData.status === 'fulfilled') {
        setWeatherData(agriculturalData.value);
      }

      // Store weather images
      const images: Record<string, string> = {};
      if (meteogram.status === 'fulfilled' && meteogram.value.success) {
        images.meteogram = meteogram.value.imageUrl!;
      }
      if (agriculturalChart.status === 'fulfilled' && agriculturalChart.value.success) {
        images.agriculturalChart = agriculturalChart.value.imageUrl!;
      }
      if (weeklyForecast.status === 'fulfilled' && weeklyForecast.value.success) {
        images.weeklyForecast = weeklyForecast.value.imageUrl!;
      }
      setWeatherImages(images);

    } catch (error) {
      console.error('Weather data loading error:', error);
      toast({
        title: "Weather Data Error",
        description: "Failed to load weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return <Sun className="h-5 w-5 text-yellow-500" />;
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return <Cloud className="h-5 w-5 text-gray-500" />;
    if (conditionLower.includes('rain') || conditionLower.includes('shower')) return <CloudRain className="h-5 w-5 text-blue-500" />;
    return <Cloud className="h-5 w-5 text-gray-400" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'optimal': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'caution': return 'text-yellow-600';
      case 'avoid': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Weather Dashboard</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadWeatherData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {location.city || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}
            {cropType && ` • ${cropType}`}
          </p>
        </CardHeader>
      </Card>

      {/* Current Conditions */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Current Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getWeatherIcon(weatherData.currentConditions.temperature > 20 ? 'sunny' : 'cloudy')}
                </div>
                <div className="text-2xl font-bold">{weatherData.currentConditions.temperature.toFixed(1)}°C</div>
                <div className="text-sm text-muted-foreground">Temperature</div>
              </div>
              <div className="text-center">
                <Droplets className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{weatherData.currentConditions.humidity}%</div>
                <div className="text-sm text-muted-foreground">Humidity</div>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                <div className="text-2xl font-bold">{weatherData.currentConditions.windSpeed.toFixed(1)} m/s</div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
              </div>
              <div className="text-center">
                <CloudRain className="h-5 w-5 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{weatherData.currentConditions.precipitation.toFixed(1)}mm</div>
                <div className="text-sm text-muted-foreground">Precipitation</div>
              </div>
              <div className="text-center">
                <Sun className="h-5 w-5 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{weatherData.currentConditions.uvIndex}</div>
                <div className="text-sm text-muted-foreground">UV Index</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Visualizations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Weather Visualizations
            </CardTitle>
            <Select value={selectedImageType} onValueChange={(value: WeatherImageType) => setSelectedImageType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meteogram">Meteogram</SelectItem>
                <SelectItem value="agronomy">Agricultural Chart</SelectItem>
                <SelectItem value="picto_7d">Weekly Forecast</SelectItem>
                <SelectItem value="meteogram_solar">Solar Meteogram</SelectItem>
                <SelectItem value="sounding">Atmospheric Sounding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
              <TabsTrigger value="agricultural">Agricultural</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              {weatherImages[selectedImageType] ? (
                <div className="text-center">
                  <img 
                    src={weatherImages[selectedImageType]} 
                    alt={`${selectedImageType} weather chart`}
                    className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Weather chart not available. Please try refreshing the data.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="forecast" className="mt-4">
              {weatherData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {weatherData.forecast.daily.map((day, index) => (
                      <Card key={index} className="text-center">
                        <CardContent className="p-4">
                          <div className="text-sm font-medium mb-2">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="flex justify-center mb-2">
                            {getWeatherIcon(day.conditions)}
                          </div>
                          <div className="text-lg font-bold">{day.maxTemp.toFixed(0)}°</div>
                          <div className="text-sm text-muted-foreground">{day.minTemp.toFixed(0)}°</div>
                          <div className="text-xs text-blue-600 mt-1">
                            {day.precipitation.toFixed(1)}mm
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="agricultural" className="mt-4">
              {weatherData && showAgriculturalInsights && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Growing Degree Days</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{weatherData.agriculturalInsights.growingDegreeDays}</div>
                        <div className="text-xs text-muted-foreground">Accumulated heat units</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chill Hours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{weatherData.agriculturalInsights.chillHours}</div>
                        <div className="text-xs text-muted-foreground">Cold hours for dormancy</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Frost Risk</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {weatherData.agriculturalInsights.frostRisk ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <span className="font-medium">
                            {weatherData.agriculturalInsights.frostRisk ? 'High Risk' : 'Low Risk'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Drought Risk</span>
                          <Badge className={getRiskColor(weatherData.agriculturalInsights.droughtRisk)}>
                            {weatherData.agriculturalInsights.droughtRisk}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Irrigation</span>
                          <Badge variant="outline">
                            {weatherData.agriculturalInsights.irrigationRecommendation}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Planting</span>
                          <Badge 
                            variant="outline" 
                            className={getRecommendationColor(weatherData.agriculturalInsights.plantingRecommendation)}
                          >
                            {weatherData.agriculturalInsights.plantingRecommendation}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Crop Advice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {weatherData.agriculturalInsights.cropSpecificAdvice}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="charts" className="mt-4">
              <div className="space-y-4">
                {weatherImages.meteogram && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Meteogram</h4>
                    <img 
                      src={weatherImages.meteogram} 
                      alt="Meteogram"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
                {weatherImages.agriculturalChart && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Agricultural Weather Chart</h4>
                    <img 
                      src={weatherImages.agriculturalChart} 
                      alt="Agricultural Weather Chart"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default WeatherDashboard;
