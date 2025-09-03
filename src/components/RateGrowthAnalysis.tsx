/**
 * Rate and Growth Analysis Component
 * Comprehensive analysis of interest rates, growth rates, and market forecasting
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Activity, Target, BarChart3, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface RateAnalysis {
  currentRate: number;
  historicalAverage: number;
  projectedRate: number;
  volatility: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
}

interface GrowthMetrics {
  currentGrowthRate: number;
  projectedGrowthRate: number;
  economicIndicators: {
    gdpGrowth: number;
    inflationRate: number;
    unemploymentRate: number;
    consumerConfidence: number;
  };
  sectorPerformance: {
    commercial: number;
    residential: number;
    industrial: number;
    retail: number;
  };
}

interface ForecastParameters {
  timeHorizon: number;
  confidenceLevel: number;
  economicScenario: 'optimistic' | 'base' | 'pessimistic';
  includeVolatility: boolean;
}

interface RateGrowthAnalysisProps {
  onAnalysisComplete: (results: any) => void;
}

const ECONOMIC_SCENARIOS = [
  { 
    value: 'optimistic', 
    label: 'Optimistic', 
    description: 'Strong economic growth, low unemployment, stable inflation',
    multiplier: 1.15 
  },
  { 
    value: 'base', 
    label: 'Base Case', 
    description: 'Moderate economic conditions, stable policy environment',
    multiplier: 1.0 
  },
  { 
    value: 'pessimistic', 
    label: 'Pessimistic', 
    description: 'Economic headwinds, policy uncertainty, market volatility',
    multiplier: 0.85 
  }
];

const CURRENT_MARKET_DATA: GrowthMetrics = {
  currentGrowthRate: 6.8,
  projectedGrowthRate: 7.2,
  economicIndicators: {
    gdpGrowth: 2.1,
    inflationRate: 3.2,
    unemploymentRate: 4.8,
    consumerConfidence: 68.5
  },
  sectorPerformance: {
    commercial: 7.5,
    residential: 8.2,
    industrial: 9.1,
    retail: 6.8
  }
};

const INTEREST_RATE_DATA: RateAnalysis = {
  currentRate: 4.35,
  historicalAverage: 3.8,
  projectedRate: 4.1,
  volatility: 0.8,
  trend: 'decreasing',
  riskLevel: 'medium'
};

export function RateGrowthAnalysis({ onAnalysisComplete }: RateGrowthAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<'rates' | 'growth' | 'forecast'>('rates');
  const [parameters, setParameters] = useState<ForecastParameters>({
    timeHorizon: 5,
    confidenceLevel: 80,
    economicScenario: 'base',
    includeVolatility: true
  });
  
  const [customRates, setCustomRates] = useState({
    cashRate: 4.35,
    bondYield: 4.25,
    mortgageRate: 6.5,
    capitalRate: 6.8
  });

  const runRateAnalysis = () => {
    const results = {
      type: 'Rate Analysis',
      currentData: INTEREST_RATE_DATA,
      customRates,
      analysis: {
        rateSpread: customRates.mortgageRate - customRates.cashRate,
        yieldCurve: customRates.bondYield - customRates.cashRate,
        riskPremium: customRates.capitalRate - customRates.bondYield,
        trend: INTEREST_RATE_DATA.trend,
        recommendation: getRateRecommendation()
      },
      timestamp: new Date().toISOString()
    };

    onAnalysisComplete(results);
    toast.success("Interest rate analysis completed!");
  };

  const runGrowthAnalysis = () => {
    const scenario = ECONOMIC_SCENARIOS.find(s => s.value === parameters.economicScenario);
    const adjustedGrowth = CURRENT_MARKET_DATA.projectedGrowthRate * (scenario?.multiplier || 1);
    
    const results = {
      type: 'Growth Analysis',
      currentData: CURRENT_MARKET_DATA,
      adjustedProjections: {
        ...CURRENT_MARKET_DATA,
        projectedGrowthRate: adjustedGrowth,
        sectorPerformance: Object.fromEntries(
          Object.entries(CURRENT_MARKET_DATA.sectorPerformance).map(([key, value]) => 
            [key, value * (scenario?.multiplier || 1)]
          )
        )
      },
      scenario: parameters.economicScenario,
      confidence: parameters.confidenceLevel,
      riskAssessment: getGrowthRiskAssessment(),
      timestamp: new Date().toISOString()
    };

    onAnalysisComplete(results);
    toast.success("Growth analysis completed!");
  };

  const runForecastAnalysis = () => {
    const scenario = ECONOMIC_SCENARIOS.find(s => s.value === parameters.economicScenario);
    const baseGrowth = CURRENT_MARKET_DATA.projectedGrowthRate;
    const adjustedGrowth = baseGrowth * (scenario?.multiplier || 1);
    
    const yearlyForecasts = Array.from({ length: parameters.timeHorizon }, (_, i) => {
      const year = i + 1;
      const volatilityFactor = parameters.includeVolatility ? 
        1 + (Math.random() - 0.5) * (INTEREST_RATE_DATA.volatility / 100) : 1;
      
      return {
        year,
        growthRate: adjustedGrowth * Math.pow(0.98, i) * volatilityFactor, // Slight decay over time
        interestRate: INTEREST_RATE_DATA.projectedRate + i * 0.1,
        confidence: Math.max(50, parameters.confidenceLevel - i * 5) // Decreasing confidence over time
      };
    });

    const results = {
      type: 'Forecast Analysis',
      parameters,
      yearlyForecasts,
      averages: {
        avgGrowthRate: yearlyForecasts.reduce((sum, f) => sum + f.growthRate, 0) / yearlyForecasts.length,
        avgInterestRate: yearlyForecasts.reduce((sum, f) => sum + f.interestRate, 0) / yearlyForecasts.length,
        overallConfidence: yearlyForecasts.reduce((sum, f) => sum + f.confidence, 0) / yearlyForecasts.length
      },
      risks: getForecastRisks(),
      timestamp: new Date().toISOString()
    };

    onAnalysisComplete(results);
    toast.success("Forecast analysis completed!");
  };

  const getRateRecommendation = (): string => {
    const { currentRate, historicalAverage, trend } = INTEREST_RATE_DATA;
    
    if (currentRate > historicalAverage && trend === 'decreasing') {
      return 'Rates above historical average but declining - Consider timing for refinancing';
    } else if (currentRate < historicalAverage && trend === 'increasing') {
      return 'Rates below historical average but rising - Lock in current rates if possible';
    } else if (trend === 'stable') {
      return 'Stable rate environment - Focus on other value drivers';
    }
    
    return 'Monitor rate movements closely for strategic decisions';
  };

  const getGrowthRiskAssessment = (): string => {
    const { gdpGrowth, inflationRate, unemploymentRate } = CURRENT_MARKET_DATA.economicIndicators;
    
    let riskScore = 0;
    if (gdpGrowth < 2) riskScore += 2;
    if (inflationRate > 4) riskScore += 2;
    if (unemploymentRate > 6) riskScore += 2;
    
    if (riskScore >= 4) return 'High Risk - Multiple economic headwinds present';
    if (riskScore >= 2) return 'Medium Risk - Some economic concerns to monitor';
    return 'Low Risk - Favorable economic conditions';
  };

  const getForecastRisks = (): string[] => {
    const risks = [
      'Interest rate volatility may impact valuation assumptions',
      'Economic policy changes could affect growth projections',
      'Market cycles may diverge from historical patterns'
    ];
    
    if (parameters.timeHorizon > 5) {
      risks.push('Long-term forecasts have higher uncertainty');
    }
    
    if (parameters.economicScenario === 'pessimistic') {
      risks.push('Pessimistic scenario may be overly conservative');
    }
    
    return risks;
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'increasing': return 'text-red-600 dark:text-red-400';
      case 'decreasing': return 'text-green-600 dark:text-green-400';
      case 'stable': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Rate & Growth Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of interest rates, growth patterns, and market forecasting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={analysisType} onValueChange={(value) => setAnalysisType(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rates" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Interest Rates
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Growth Analysis
              </TabsTrigger>
              <TabsTrigger value="forecast" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Forecasting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Market Rates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Market Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cash Rate</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{INTEREST_RATE_DATA.currentRate}%</span>
                          <Badge variant="outline" className={getTrendColor(INTEREST_RATE_DATA.trend)}>
                            {INTEREST_RATE_DATA.trend}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Historical Avg</span>
                        <span className="font-semibold text-muted-foreground">
                          {INTEREST_RATE_DATA.historicalAverage}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Projected Rate</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {INTEREST_RATE_DATA.projectedRate}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Volatility</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{INTEREST_RATE_DATA.volatility}%</span>
                          <Badge variant="outline" className={getRiskColor(INTEREST_RATE_DATA.riskLevel)}>
                            {INTEREST_RATE_DATA.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Rate Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Rate Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Cash Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={customRates.cashRate}
                          onChange={(e) => setCustomRates(prev => ({ ...prev, cashRate: Number(e.target.value) }))}
                          className="h-8"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Bond Yield (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={customRates.bondYield}
                          onChange={(e) => setCustomRates(prev => ({ ...prev, bondYield: Number(e.target.value) }))}
                          className="h-8"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Mortgage Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={customRates.mortgageRate}
                          onChange={(e) => setCustomRates(prev => ({ ...prev, mortgageRate: Number(e.target.value) }))}
                          className="h-8"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Cap Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={customRates.capitalRate}
                          onChange={(e) => setCustomRates(prev => ({ ...prev, capitalRate: Number(e.target.value) }))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={runRateAnalysis} size="lg" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Run Interest Rate Analysis
              </Button>
            </TabsContent>

            <TabsContent value="growth" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Economic Indicators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Economic Indicators</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">GDP Growth</span>
                        <div className="flex items-center gap-2">
                          <Progress value={CURRENT_MARKET_DATA.economicIndicators.gdpGrowth * 20} className="w-16" />
                          <span className="font-semibold text-sm">
                            {CURRENT_MARKET_DATA.economicIndicators.gdpGrowth}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Inflation Rate</span>
                        <div className="flex items-center gap-2">
                          <Progress value={CURRENT_MARKET_DATA.economicIndicators.inflationRate * 20} className="w-16" />
                          <span className="font-semibold text-sm">
                            {CURRENT_MARKET_DATA.economicIndicators.inflationRate}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Unemployment</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(10 - CURRENT_MARKET_DATA.economicIndicators.unemploymentRate) * 10} className="w-16" />
                          <span className="font-semibold text-sm">
                            {CURRENT_MARKET_DATA.economicIndicators.unemploymentRate}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Consumer Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={CURRENT_MARKET_DATA.economicIndicators.consumerConfidence} className="w-16" />
                          <span className="font-semibold text-sm">
                            {CURRENT_MARKET_DATA.economicIndicators.consumerConfidence}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sector Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sector Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {Object.entries(CURRENT_MARKET_DATA.sectorPerformance).map(([sector, rate]) => (
                        <div key={sector} className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{sector}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={rate * 8} className="w-16" />
                            <span className="font-semibold text-sm">
                              {rate}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={runGrowthAnalysis} size="lg" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Run Growth Analysis
              </Button>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time-horizon">Time Horizon (Years)</Label>
                  <Input
                    id="time-horizon"
                    type="number"
                    min="1"
                    max="20"
                    value={parameters.timeHorizon}
                    onChange={(e) => setParameters(prev => ({ ...prev, timeHorizon: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence-level">Confidence Level (%)</Label>
                  <Input
                    id="confidence-level"
                    type="number"
                    min="50"
                    max="95"
                    value={parameters.confidenceLevel}
                    onChange={(e) => setParameters(prev => ({ ...prev, confidenceLevel: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="economic-scenario">Economic Scenario</Label>
                  <Select 
                    value={parameters.economicScenario} 
                    onValueChange={(value) => setParameters(prev => ({ ...prev, economicScenario: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ECONOMIC_SCENARIOS.map(scenario => (
                        <SelectItem key={scenario.value} value={scenario.value}>
                          {scenario.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={parameters.includeVolatility}
                      onChange={(e) => setParameters(prev => ({ ...prev, includeVolatility: e.target.checked }))}
                      className="rounded"
                    />
                    Include Volatility
                  </Label>
                </div>
              </div>

              {/* Scenario Description */}
              {parameters.economicScenario && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <h4 className="font-semibold">
                      {ECONOMIC_SCENARIOS.find(s => s.value === parameters.economicScenario)?.label} Scenario
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ECONOMIC_SCENARIOS.find(s => s.value === parameters.economicScenario)?.description}
                  </p>
                </div>
              )}

              <Button onClick={runForecastAnalysis} size="lg" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Run Forecast Analysis
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default RateGrowthAnalysis;