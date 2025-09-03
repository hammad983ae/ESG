/**
 * Comparable Asset Forecast Component
 * Provides forecasting capabilities for comparable property assets
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart3, TrendingUp, Search, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ComparableProperty {
  id: string;
  name: string;
  location: string;
  type: string;
  currentValue: number;
  lastSaleDate: string;
  size: number;
  pricePerSqm: number;
  growthRate: number;
  marketTrend: 'rising' | 'stable' | 'declining';
}

interface ForecastScenario {
  period: number;
  optimistic: number;
  realistic: number;
  pessimistic: number;
  probability: number;
}

interface ComparableAssetForecastProps {
  onForecastComplete: (results: any) => void;
}

const PROPERTY_TYPES = [
  { value: 'commercial-office', label: 'Commercial Office' },
  { value: 'retail', label: 'Retail' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'residential', label: 'Residential' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'healthcare', label: 'Healthcare' }
];

const SAMPLE_COMPARABLES: ComparableProperty[] = [
  {
    id: '1',
    name: 'Premium Office Tower',
    location: 'Sydney CBD',
    type: 'commercial-office',
    currentValue: 15500000,
    lastSaleDate: '2024-01-15',
    size: 2500,
    pricePerSqm: 6200,
    growthRate: 6.5,
    marketTrend: 'rising'
  },
  {
    id: '2',
    name: 'Shopping Centre Unit',
    location: 'Melbourne Suburbs',
    type: 'retail',
    currentValue: 3200000,
    lastSaleDate: '2023-11-20',
    size: 400,
    pricePerSqm: 8000,
    growthRate: 4.2,
    marketTrend: 'stable'
  },
  {
    id: '3',
    name: 'Warehouse Complex',
    location: 'Brisbane Industrial',
    type: 'industrial',
    currentValue: 8900000,
    lastSaleDate: '2024-02-10',
    size: 3500,
    pricePerSqm: 2543,
    growthRate: 8.1,
    marketTrend: 'rising'
  }
];

export function ComparableAssetForecast({ onForecastComplete }: ComparableAssetForecastProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [comparables, setComparables] = useState<ComparableProperty[]>([]);
  const [selectedComparable, setSelectedComparable] = useState<ComparableProperty | null>(null);
  const [forecastPeriods, setForecastPeriods] = useState<number>(5);
  const [scenarios, setScenarios] = useState<ForecastScenario[]>([]);

  const searchComparables = () => {
    // Filter sample data based on selected criteria
    let filtered = SAMPLE_COMPARABLES;
    
    if (selectedType) {
      filtered = filtered.filter(comp => comp.type === selectedType);
    }
    
    if (location) {
      filtered = filtered.filter(comp => 
        comp.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setComparables(filtered);
    toast.success(`Found ${filtered.length} comparable properties`);
  };

  const selectComparable = (comparable: ComparableProperty) => {
    setSelectedComparable(comparable);
    generateForecastScenarios(comparable);
  };

  const generateForecastScenarios = (property: ComparableProperty) => {
    const baseGrowthRate = property.growthRate / 100;
    const marketMultiplier = getMarketMultiplier(property.marketTrend);
    
    const forecastScenarios: ForecastScenario[] = [];
    
    for (let year = 1; year <= forecastPeriods; year++) {
      // Optimistic scenario (10-20% above base rate)
      const optimisticRate = baseGrowthRate * marketMultiplier * 1.15;
      const optimisticValue = property.currentValue * Math.pow(1 + optimisticRate, year);
      
      // Realistic scenario (base rate with market adjustment)
      const realisticRate = baseGrowthRate * marketMultiplier;
      const realisticValue = property.currentValue * Math.pow(1 + realisticRate, year);
      
      // Pessimistic scenario (10-20% below base rate)
      const pessimisticRate = baseGrowthRate * marketMultiplier * 0.85;
      const pessimisticValue = property.currentValue * Math.pow(1 + pessimisticRate, year);
      
      // Probability based on market trend and time horizon
      const baseProbability = 0.7;
      const timeDecay = Math.exp(-year * 0.1);
      const probability = baseProbability * timeDecay;
      
      forecastScenarios.push({
        period: year,
        optimistic: optimisticValue,
        realistic: realisticValue,
        pessimistic: pessimisticValue,
        probability
      });
    }
    
    setScenarios(forecastScenarios);
  };

  const getMarketMultiplier = (trend: string): number => {
    switch (trend) {
      case 'rising': return 1.1;
      case 'stable': return 1.0;
      case 'declining': return 0.9;
      default: return 1.0;
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'rising': return 'text-green-600 dark:text-green-400';
      case 'stable': return 'text-blue-600 dark:text-blue-400';
      case 'declining': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4" />;
      case 'stable': return <BarChart3 className="w-4 h-4" />;
      case 'declining': return <LineChart className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const completeForecast = () => {
    if (!selectedComparable || scenarios.length === 0) {
      toast.error("Please select a comparable and generate forecast scenarios");
      return;
    }

    const results = {
      selectedComparable,
      scenarios,
      forecastPeriods,
      methodology: 'Comparable Asset Forecast',
      confidence: scenarios.reduce((sum, s) => sum + s.probability, 0) / scenarios.length,
      averageAnnualGrowth: selectedComparable.growthRate,
      marketTrend: selectedComparable.marketTrend
    };

    onForecastComplete(results);
    toast.success("Comparable asset forecast completed!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Comparable Asset Forecast
          </CardTitle>
          <CardDescription>
            Forecast property values based on comparable asset performance and market trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search & Select</TabsTrigger>
              <TabsTrigger value="forecast">Forecast Analysis</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              {/* Search Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location (optional)"
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={searchComparables} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search Comparables
                  </Button>
                </div>
              </div>

              {/* Comparable Properties List */}
              {comparables.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Comparable Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparables.map(comparable => (
                      <Card 
                        key={comparable.id} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedComparable?.id === comparable.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => selectComparable(comparable)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{comparable.name}</h4>
                              <Badge variant="outline" className={getTrendColor(comparable.marketTrend)}>
                                {getTrendIcon(comparable.marketTrend)}
                                {comparable.marketTrend}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {comparable.location}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Current Value:</span>
                                <div className="text-green-600 dark:text-green-400">
                                  ${comparable.currentValue.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Growth Rate:</span>
                                <div className="text-blue-600 dark:text-blue-400">
                                  {comparable.growthRate}% p.a.
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Size:</span>
                                <div>{comparable.size} sqm</div>
                              </div>
                              <div>
                                <span className="font-medium">Price/sqm:</span>
                                <div>${comparable.pricePerSqm.toLocaleString()}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              Last sale: {comparable.lastSaleDate}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="forecast" className="space-y-4">
              {selectedComparable ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Selected Property: {selectedComparable.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="forecast-periods">Forecast Period (Years)</Label>
                          <Input
                            id="forecast-periods"
                            type="number"
                            min="1"
                            max="20"
                            value={forecastPeriods}
                            onChange={(e) => setForecastPeriods(Number(e.target.value))}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            onClick={() => generateForecastScenarios(selectedComparable)}
                            className="w-full"
                          >
                            Generate Forecast
                          </Button>
                        </div>
                      </div>

                      {scenarios.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Forecast Scenarios</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2">Year</th>
                                  <th className="text-right p-2">Optimistic</th>
                                  <th className="text-right p-2">Realistic</th>
                                  <th className="text-right p-2">Pessimistic</th>
                                  <th className="text-right p-2">Confidence</th>
                                </tr>
                              </thead>
                              <tbody>
                                {scenarios.map(scenario => (
                                  <tr key={scenario.period} className="border-b">
                                    <td className="p-2 font-medium">Year {scenario.period}</td>
                                    <td className="p-2 text-right text-green-600 dark:text-green-400">
                                      ${scenario.optimistic.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-2 text-right text-blue-600 dark:text-blue-400">
                                      ${scenario.realistic.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-2 text-right text-red-600 dark:text-red-400">
                                      ${scenario.pessimistic.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-2 text-right">
                                      {(scenario.probability * 100).toFixed(1)}%
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <LineChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No Property Selected</h3>
                  <p>Please select a comparable property from the search tab to generate forecasts.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {scenarios.length > 0 && selectedComparable ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Forecast Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <h4 className="font-semibold text-green-800 dark:text-green-200">Best Case</h4>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${scenarios[scenarios.length - 1]?.optimistic.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {forecastPeriods} year projection
                          </p>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200">Most Likely</h4>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${scenarios[scenarios.length - 1]?.realistic.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {forecastPeriods} year projection
                          </p>
                        </div>
                        
                        <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                          <h4 className="font-semibold text-red-800 dark:text-red-200">Worst Case</h4>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            ${scenarios[scenarios.length - 1]?.pessimistic.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {forecastPeriods} year projection
                          </p>
                        </div>
                      </div>

                      <Button onClick={completeForecast} size="lg" className="w-full">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Complete Forecast Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No Forecast Generated</h3>
                  <p>Generate forecast scenarios to view the results summary.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComparableAssetForecast;