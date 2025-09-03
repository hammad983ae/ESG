/**
 * Delorenzo Property Group - Commodity Forecast Results
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Patent Pending - Proprietary market prediction algorithms
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Globe, DollarSign } from "lucide-react";
import type { CommodityAnalysisResults } from "@/utils/commodityAnalysis";

interface CommodityForecastResultsProps {
  results: CommodityAnalysisResults;
  onReset: () => void;
}

export function CommodityForecastResults({ results, onReset }: CommodityForecastResultsProps) {
  const formatCurrency = (amount: number, currency = "AUD") => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getTrendIcon = (change: number) => {
    return change > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getTrendColor = (change: number) => {
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Market Forecast Results</h2>
            <p className="text-muted-foreground">{results.commodity} - {results.analysis_period}</p>
            <Badge variant="secondary" className="mt-1">™ DeLorenzoAI Analysis</Badge>
          </div>
        </div>
        <Button onClick={onReset} variant="outline">
          New Analysis
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {getTrendIcon(results.price_forecast.change_percent)}
              <span className="text-sm font-medium">Price Forecast</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(results.price_forecast.predicted_price)}</p>
            <p className={`text-sm ${getTrendColor(results.price_forecast.change_percent)}`}>
              {results.price_forecast.change_percent > 0 ? '+' : ''}{formatNumber(results.price_forecast.change_percent, 1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Export Value</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(results.export_analysis.projected_value)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(results.export_analysis.volume_forecast)} tonnes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Exchange Impact</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(results.currency_analysis.exchange_rate, 4)}
            </p>
            <p className={`text-sm ${getTrendColor(results.currency_analysis.impact_percent)}`}>
              {results.currency_analysis.impact_percent > 0 ? '+' : ''}{formatNumber(results.currency_analysis.impact_percent, 1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Risk Score</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {results.risk_assessment.overall_score}
            </p>
            <Badge variant={results.risk_assessment.risk_level === "High" ? "destructive" : 
                          results.risk_assessment.risk_level === "Medium" ? "secondary" : "default"}>
              {results.risk_assessment.risk_level}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply & Demand Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Supply & Demand Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Global Supply</span>
              <div className="text-right">
                <span className="font-semibold">{formatNumber(results.supply_demand.global_supply)} MT</span>
                <p className={`text-sm ${getTrendColor(results.supply_demand.supply_change)}`}>
                  {results.supply_demand.supply_change > 0 ? '+' : ''}{formatNumber(results.supply_demand.supply_change, 1)}%
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Global Demand</span>
              <div className="text-right">
                <span className="font-semibold">{formatNumber(results.supply_demand.global_demand)} MT</span>
                <p className={`text-sm ${getTrendColor(results.supply_demand.demand_change)}`}>
                  {results.supply_demand.demand_change > 0 ? '+' : ''}{formatNumber(results.supply_demand.demand_change, 1)}%
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Supply/Demand Balance</span>
              <Badge variant={results.supply_demand.balance_indicator === "Surplus" ? "default" : "destructive"}>
                {results.supply_demand.balance_indicator}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Inventory Levels</span>
              <span className="font-semibold">{results.supply_demand.inventory_level}</span>
            </div>
          </CardContent>
        </Card>

        {/* Export Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Export Market Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Target Market</span>
              <span className="font-semibold">{results.export_destination}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Current Tariff Rate</span>
              <span className="font-semibold">{formatNumber(results.export_analysis.tariff_rate, 1)}%</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Tariff Impact</span>
              <span className="font-semibold">{formatCurrency(results.export_analysis.tariff_cost)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Market Share</span>
              <span className="font-semibold">{formatNumber(results.export_analysis.market_share, 1)}%</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Competition Level</span>
              <Badge variant={results.export_analysis.competition_level === "High" ? "destructive" : "secondary"}>
                {results.export_analysis.competition_level}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment & Mitigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Weather Risk</p>
              <p className="text-xl font-bold">{results.risk_assessment.weather_risk}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Political Risk</p>
              <p className="text-xl font-bold">{results.risk_assessment.political_risk}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Currency Risk</p>
              <p className="text-xl font-bold">{results.risk_assessment.currency_risk}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Recommended Actions:</h4>
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Market Intelligence Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Analysis Parameters</h4>
              <p className="text-sm text-muted-foreground mb-1">Commodity: {results.commodity}</p>
              <p className="text-sm text-muted-foreground mb-1">Region: {results.region}</p>
              <p className="text-sm text-muted-foreground mb-1">Forecast Period: {results.analysis_period}</p>
              <p className="text-sm text-muted-foreground">Production Volume: {formatNumber(results.production_volume)} tonnes</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Insights</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Price Direction: {results.price_forecast.change_percent > 0 ? "Bullish" : "Bearish"}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Market Volatility: {results.risk_assessment.volatility_level}
              </p>
              <p className="text-sm text-muted-foreground">
                Export Opportunity: {results.export_analysis.opportunity_rating}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}