/**
 * Forecasting Growth Functions Component
 * Advanced growth analysis and forecasting tools for property valuations
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, BarChart3, Target, Zap } from "lucide-react";
import { toast } from "sonner";

interface GrowthParameters {
  currentValue: number;
  growthRate: number;
  period: number;
  compoundingFrequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  volatility: number;
  marketCycle: 'expansion' | 'peak' | 'contraction' | 'trough';
}

interface ForecastResults {
  projectedValue: number;
  totalGrowth: number;
  annualizedReturn: number;
  volatilityAdjustedValue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  yearlyProjections: Array<{
    year: number;
    value: number;
    growth: number;
  }>;
}

interface ForecastingGrowthFunctionsProps {
  onForecastComplete: (results: ForecastResults) => void;
}

const MARKET_CYCLES = [
  { value: 'expansion', label: 'Expansion', multiplier: 1.1 },
  { value: 'peak', label: 'Peak', multiplier: 1.05 },
  { value: 'contraction', label: 'Contraction', multiplier: 0.95 },
  { value: 'trough', label: 'Trough', multiplier: 0.9 }
];

const COMPOUNDING_FREQUENCIES = [
  { value: 'annual', label: 'Annual', factor: 1 },
  { value: 'semi-annual', label: 'Semi-Annual', factor: 2 },
  { value: 'quarterly', label: 'Quarterly', factor: 4 },
  { value: 'monthly', label: 'Monthly', factor: 12 }
];

export function ForecastingGrowthFunctions({ onForecastComplete }: ForecastingGrowthFunctionsProps) {
  const [parameters, setParameters] = useState<GrowthParameters>({
    currentValue: 0,
    growthRate: 0,
    period: 5,
    compoundingFrequency: 'annual',
    volatility: 10,
    marketCycle: 'expansion'
  });

  const [forecastType, setForecastType] = useState<'simple' | 'compound' | 'monte-carlo'>('compound');

  const calculateSimpleGrowth = (): ForecastResults => {
    const projectedValue = parameters.currentValue * (1 + (parameters.growthRate / 100) * parameters.period);
    const totalGrowth = projectedValue - parameters.currentValue;
    const annualizedReturn = parameters.growthRate;

    return {
      projectedValue,
      totalGrowth,
      annualizedReturn,
      volatilityAdjustedValue: projectedValue,
      confidenceInterval: {
        lower: projectedValue * 0.9,
        upper: projectedValue * 1.1
      },
      yearlyProjections: Array.from({ length: parameters.period }, (_, i) => ({
        year: i + 1,
        value: parameters.currentValue * (1 + (parameters.growthRate / 100) * (i + 1)),
        growth: parameters.growthRate
      }))
    };
  };

  const calculateCompoundGrowth = (): ForecastResults => {
    const frequency = COMPOUNDING_FREQUENCIES.find(f => f.value === parameters.compoundingFrequency)?.factor || 1;
    const marketMultiplier = MARKET_CYCLES.find(c => c.value === parameters.marketCycle)?.multiplier || 1;
    const adjustedRate = (parameters.growthRate / 100) * marketMultiplier;
    
    const projectedValue = parameters.currentValue * Math.pow(1 + adjustedRate / frequency, frequency * parameters.period);
    const totalGrowth = projectedValue - parameters.currentValue;
    const annualizedReturn = ((projectedValue / parameters.currentValue) ** (1 / parameters.period) - 1) * 100;

    // Volatility adjustment using normal distribution approximation
    const volatilityFactor = parameters.volatility / 100;
    const volatilityAdjustedValue = projectedValue * (1 - volatilityFactor * 0.5);

    const yearlyProjections = Array.from({ length: parameters.period }, (_, i) => {
      const year = i + 1;
      const value = parameters.currentValue * Math.pow(1 + adjustedRate / frequency, frequency * year);
      const growth = year === 1 ? 
        ((value / parameters.currentValue) - 1) * 100 :
        ((value / (parameters.currentValue * Math.pow(1 + adjustedRate / frequency, frequency * (year - 1)))) - 1) * 100;
      
      return { year, value, growth };
    });

    return {
      projectedValue,
      totalGrowth,
      annualizedReturn,
      volatilityAdjustedValue,
      confidenceInterval: {
        lower: projectedValue * (1 - volatilityFactor),
        upper: projectedValue * (1 + volatilityFactor)
      },
      yearlyProjections
    };
  };

  const calculateMonteCarloForecast = (): ForecastResults => {
    const simulations = 1000;
    const results: number[] = [];
    
    for (let i = 0; i < simulations; i++) {
      let value = parameters.currentValue;
      
      for (let year = 0; year < parameters.period; year++) {
        // Add random variation based on volatility
        const randomFactor = 1 + (Math.random() - 0.5) * (parameters.volatility / 100) * 2;
        const growthFactor = 1 + (parameters.growthRate / 100) * randomFactor;
        value *= growthFactor;
      }
      
      results.push(value);
    }

    results.sort((a, b) => a - b);
    
    const projectedValue = results.reduce((sum, val) => sum + val, 0) / results.length;
    const totalGrowth = projectedValue - parameters.currentValue;
    const annualizedReturn = ((projectedValue / parameters.currentValue) ** (1 / parameters.period) - 1) * 100;

    return {
      projectedValue,
      totalGrowth,
      annualizedReturn,
      volatilityAdjustedValue: projectedValue,
      confidenceInterval: {
        lower: results[Math.floor(results.length * 0.05)], // 5th percentile
        upper: results[Math.floor(results.length * 0.95)]  // 95th percentile
      },
      yearlyProjections: Array.from({ length: parameters.period }, (_, i) => ({
        year: i + 1,
        value: parameters.currentValue * Math.pow(1 + parameters.growthRate / 100, i + 1),
        growth: parameters.growthRate
      }))
    };
  };

  const runForecast = () => {
    if (parameters.currentValue <= 0) {
      toast.error("Please enter a valid current value");
      return;
    }

    let results: ForecastResults;

    switch (forecastType) {
      case 'simple':
        results = calculateSimpleGrowth();
        break;
      case 'compound':
        results = calculateCompoundGrowth();
        break;
      case 'monte-carlo':
        results = calculateMonteCarloForecast();
        break;
      default:
        results = calculateCompoundGrowth();
    }

    onForecastComplete(results);
    toast.success(`${forecastType.charAt(0).toUpperCase() + forecastType.slice(1)} forecast completed!`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Forecasting & Growth Functions
          </CardTitle>
          <CardDescription>
            Advanced growth modeling and forecasting tools for property value projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={forecastType} onValueChange={(value) => setForecastType(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Simple Growth
              </TabsTrigger>
              <TabsTrigger value="compound" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Compound Growth
              </TabsTrigger>
              <TabsTrigger value="monte-carlo" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Monte Carlo
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              {/* Base Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-value">Current Value ($)</Label>
                  <Input
                    id="current-value"
                    type="number"
                    value={parameters.currentValue}
                    onChange={(e) => setParameters(prev => ({ ...prev, currentValue: Number(e.target.value) }))}
                    placeholder="1000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growth-rate">Annual Growth Rate (%)</Label>
                  <Input
                    id="growth-rate"
                    type="number"
                    step="0.1"
                    value={parameters.growthRate}
                    onChange={(e) => setParameters(prev => ({ ...prev, growthRate: Number(e.target.value) }))}
                    placeholder="5.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Forecast Period (Years)</Label>
                  <Input
                    id="period"
                    type="number"
                    min="1"
                    max="30"
                    value={parameters.period}
                    onChange={(e) => setParameters(prev => ({ ...prev, period: Number(e.target.value) }))}
                    placeholder="5"
                  />
                </div>
              </div>

              <TabsContent value="simple" className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Simple Growth Model</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Uses linear growth calculation: Future Value = Current Value × (1 + Growth Rate × Time Period)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="compound" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="compounding">Compounding Frequency</Label>
                    <Select 
                      value={parameters.compoundingFrequency} 
                      onValueChange={(value) => setParameters(prev => ({ ...prev, compoundingFrequency: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPOUNDING_FREQUENCIES.map(freq => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market-cycle">Market Cycle</Label>
                    <Select 
                      value={parameters.marketCycle} 
                      onValueChange={(value) => setParameters(prev => ({ ...prev, marketCycle: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MARKET_CYCLES.map(cycle => (
                          <SelectItem key={cycle.value} value={cycle.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{cycle.label}</span>
                              <Badge variant="outline" className="ml-2">
                                {cycle.multiplier}x
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Compound Growth Model</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Uses compound interest formula with market cycle adjustments and various compounding frequencies
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="monte-carlo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="volatility">Volatility (%)</Label>
                  <Input
                    id="volatility"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={parameters.volatility}
                    onChange={(e) => setParameters(prev => ({ ...prev, volatility: Number(e.target.value) }))}
                    placeholder="10.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Standard deviation of annual returns (higher values increase uncertainty)
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Monte Carlo Simulation</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Runs 1,000 simulations with random variations to provide confidence intervals and risk assessment
                  </p>
                </div>
              </TabsContent>

              <Button onClick={runForecast} className="w-full" size="lg">
                <Target className="w-4 h-4 mr-2" />
                Run {forecastType.charAt(0).toUpperCase() + forecastType.slice(1)} Forecast
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}