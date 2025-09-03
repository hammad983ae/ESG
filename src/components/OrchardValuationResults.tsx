/**
 * Delorenzo Property Group - Orchard Valuation Results
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TreePine, Apple, DollarSign, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import type { OrchardResults } from "@/utils/orchardCalculations";

interface OrchardValuationResultsProps {
  results: OrchardResults;
  onReset: () => void;
}

export function OrchardValuationResults({ results, onReset }: OrchardValuationResultsProps) {
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
          <Apple className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Orchard Valuation Results</h2>
            <p className="text-muted-foreground">{results.tree_type} - {results.variety}</p>
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
              <DollarSign className="h-4 w-4 text-green-600" />
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
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Tree Value</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(results.tree_value_per_acre)}
            </p>
            <p className="text-sm text-muted-foreground">per acre</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Maturity Factor</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(results.maturity_factor * 100, 0)}%
            </p>
            <Badge variant={results.maturity_factor > 0.8 ? "default" : "secondary"}>
              {results.tree_analysis.maturity_status.split(' ')[0]}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tree Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Tree Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Trees</span>
              <span className="font-semibold">{formatNumber(results.total_trees)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Tree Age</span>
              <span className="font-semibold">{results.tree_analysis.age} years</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Productive Life Remaining</span>
              <span className="font-semibold">{results.tree_analysis.productive_life_remaining} years</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Replacement Cost</span>
              <span className="font-semibold">{formatCurrency(results.tree_analysis.replacement_cost)}</span>
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
              <span>Maintenance Costs</span>
              <span className="font-semibold">{formatCurrency(results.cost_breakdown.maintenance)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Harvest Costs</span>
              <span className="font-semibold">{formatCurrency(results.cost_breakdown.harvest)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center font-bold">
              <span>Total Costs</span>
              <span>{formatCurrency(results.total_costs)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Cost per Tree</span>
              <span className="font-semibold">{formatCurrency(results.total_costs / results.total_trees)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Production Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Production</p>
              <p className="text-xl font-bold">{formatNumber(results.total_production)} units</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Production per Tree</p>
              <p className="text-xl font-bold">{formatNumber(results.total_production / results.total_trees, 1)} units</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Production per Acre</p>
              <p className="text-xl font-bold">{formatNumber(results.total_production / results.total_area, 0)} units</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <p>No specific recommendations - orchard appears well-managed.</p>
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
              <h4 className="font-semibold mb-2">Orchard Details</h4>
              <p className="text-sm text-muted-foreground mb-1">Address: {results.property_address}</p>
              <p className="text-sm text-muted-foreground mb-1">Total Area: {formatNumber(results.total_area)} acres</p>
              <p className="text-sm text-muted-foreground mb-1">Tree Type: {results.tree_type} ({results.variety})</p>
              <p className="text-sm text-muted-foreground">Maturity: {results.tree_analysis.maturity_status}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Performance Metrics</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Revenue per Acre: {formatCurrency(results.gross_revenue / results.total_area)}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Tree Value per Acre: {formatCurrency(results.tree_value_per_acre)}
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