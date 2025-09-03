/**
 * Delorenzo Property Group - Crop Valuation Results
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Wheat, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import type { CropResults } from "@/utils/cropCalculations";

interface CropValuationResultsProps {
  results: CropResults;
  onReset: () => void;
}

export function CropValuationResults({ results, onReset }: CropValuationResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wheat className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Crop Valuation Results</h2>
            <p className="text-muted-foreground">{results.crop_type} - {results.variety}</p>
          </div>
        </div>
        <Button onClick={onReset} variant="outline">
          New Assessment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Gross Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(results.gross_revenue)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(results.gross_revenue / results.total_area)} per acre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Net Income</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(results.net_income)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(results.net_income_per_acre)} per acre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Total Production</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {formatNumber(results.total_production)} bu
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(results.total_production / results.total_area, 1)} bu/acre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Profit Margin</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(results.profit_margin, 1)}%
            </p>
            <Badge variant={results.profit_margin > 15 ? "default" : "secondary"}>
              {results.profit_margin > 15 ? "Healthy" : "Below Average"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Production Costs</span>
              <span className="font-semibold">{formatCurrency(results.cost_breakdown.production)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Labor Costs</span>
              <span className="font-semibold">{formatCurrency(results.cost_breakdown.labor)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Equipment Costs</span>
              <span className="font-semibold">{formatCurrency(results.cost_breakdown.equipment)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center font-bold">
              <span>Total Costs</span>
              <span>{formatCurrency(results.total_costs)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Planting Date</span>
              <span className="font-semibold">
                {new Date(results.seasonal_analysis.planting_date).toLocaleDateString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Expected Harvest</span>
              <span className="font-semibold">
                {new Date(results.seasonal_analysis.expected_harvest).toLocaleDateString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Growing Season</span>
              <span className="font-semibold">{results.seasonal_analysis.growing_season_days} days</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Irrigation Efficiency</span>
              <Badge variant={results.irrigation_efficiency > 0.8 ? "default" : "secondary"}>
                {formatNumber(results.irrigation_efficiency * 100, 1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.recommendations.length > 0 ? (
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p>No specific recommendations - operation appears well-managed.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Property Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Property Details</h4>
              <p className="text-sm text-muted-foreground mb-1">Address: {results.property_address}</p>
              <p className="text-sm text-muted-foreground mb-1">Total Area: {formatNumber(results.total_area)} acres</p>
              <p className="text-sm text-muted-foreground">Crop Type: {results.crop_type} ({results.variety})</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Performance Metrics</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Revenue per Acre: {formatCurrency(results.gross_revenue / results.total_area)}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Net Margin: {formatNumber(results.profit_margin, 1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Efficiency Rating: {results.irrigation_efficiency > 0.8 ? "Excellent" : "Needs Improvement"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}