import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Baby, Building, DollarSign, BarChart3, Home, TrendingUp, TrendingDown, Target } from "lucide-react";
import { ChildcareResults } from "@/utils/childcareCalculations";

interface ChildcareValuationResultsProps {
  results: ChildcareResults;
}

export const ChildcareValuationResults: React.FC<ChildcareValuationResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const valuationMethods = [
    {
      name: "LDC Approach",
      icon: Building,
      value: results.total_ldc_value,
      description: "Long Day Childcare facility development",
      breakdown: `Land: ${formatCurrency(results.ldc_land_value)}, Development: ${formatCurrency(results.ldc_construction_value)}`
    },
    {
      name: "Direct Comparison",
      icon: BarChart3,
      value: results.average_sale_price,
      description: "Average of comparable sales",
      breakdown: `Avg Size: ${results.average_size.toLocaleString()} sqm, Price/sqm: ${formatCurrency(results.price_per_sqm)}`
    },
    {
      name: "Comparison Value",
      icon: Target,
      value: results.average_value,
      description: "Average assessed value of comparables",
      breakdown: `Based on ${results.average_rent > 0 ? 'rental data' : 'market assessments'}`
    },
    {
      name: "Rent Capitalization",
      icon: DollarSign,
      value: results.rent_based_value,
      description: "Annual rent capitalized at market rate",
      breakdown: `Annual Rent: ${formatCurrency(results.average_rent || 0)}`
    },
    {
      name: "Rent Multiplier",
      icon: TrendingUp,
      value: results.rent_multiplier_value,
      description: "Rent times industry multiplier",
      breakdown: `Market multiplier approach`
    }
  ];

  const activeMethodsCount = valuationMethods.filter(method => method.value > 0).length;
  const valueRange = results.valuation_range.high - results.valuation_range.low;
  const rangePercentage = results.valuation_average > 0 ? (valueRange / results.valuation_average) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(results.valuation_average)}</div>
            <div className="text-sm text-muted-foreground">
              Based on {activeMethodsCount} methods
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Value Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatCurrency(results.valuation_range.low)} - {formatCurrency(results.valuation_range.high)}
            </div>
            <div className="text-sm text-muted-foreground">
              Variance: {rangePercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ESG Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={results.esg_included ? "default" : "secondary"}>
                {results.esg_included ? "Enabled" : "Disabled"}
              </Badge>
              {results.esg_included && (
                <span className="text-sm font-medium">
                  {formatPercentage(results.esg_factor)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Property Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Baby className="h-4 w-4 text-primary" />
              <span className="font-medium">Childcare Facility</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Specialized valuation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Method Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Long Day Childcare Property Valuation Methods
          </CardTitle>
          <CardDescription>
            Comprehensive analysis using multiple specialized approaches for Long Day Childcare facilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {valuationMethods.map((method, index) => {
            const Icon = method.icon;
            const variance = results.valuation_average > 0 ? ((method.value - results.valuation_average) / results.valuation_average) * 100 : 0;
            const isActive = method.value > 0;
            
            return (
              <div key={index} className={`space-y-3 ${!isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="text-xs text-muted-foreground">{method.breakdown}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {isActive ? formatCurrency(method.value) : 'N/A'}
                    </div>
                    {isActive && results.valuation_average > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        {variance >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={variance >= 0 ? "text-green-600" : "text-red-600"}>
                          {variance >= 0 ? '+' : ''}{variance.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Relative Value</span>
                      <span>{((method.value / Math.max(...valuationMethods.map(m => m.value))) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={(method.value / Math.max(...valuationMethods.map(m => m.value))) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
                
                {index < valuationMethods.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Long Day Childcare Indicators</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Total placements: {results.childcare_placements} children</li>
                <li>• Development cost per placement: {formatCurrency(results.cost_per_placement)}</li>
                <li>• Average price per sqm: {formatCurrency(results.price_per_sqm)}</li>
                <li>• Typical facility size: {results.average_size.toLocaleString()} sqm</li>
                <li>• Annual rental yield indication available</li>
                <li>• Market-specific ESG considerations applied</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valuation Confidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Assessment Quality</h4>
              <div className="flex items-center gap-2">
                <Badge variant={activeMethodsCount >= 4 ? "default" : activeMethodsCount >= 2 ? "secondary" : "destructive"}>
                  {activeMethodsCount >= 4 ? "High" : activeMethodsCount >= 2 ? "Medium" : "Low"} Confidence
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {activeMethodsCount} of 5 methods active
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Range variance: {rangePercentage.toFixed(1)}% 
                {rangePercentage < 15 ? " (Low)" : rangePercentage < 30 ? " (Moderate)" : " (High)"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Impact Summary */}
      {results.esg_included && (
        <Card>
          <CardHeader>
            <CardTitle>ESG Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {formatPercentage(results.esg_factor)}
                </div>
                <div className="text-sm text-muted-foreground">ESG Adjustment</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {results.esg_factor >= 0 ? "Premium" : "Discount"}
                </div>
                <div className="text-sm text-muted-foreground">Market Impact</div>
              </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    Long Day Care
                  </div>
                  <div className="text-sm text-muted-foreground">Childcare Focus</div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};