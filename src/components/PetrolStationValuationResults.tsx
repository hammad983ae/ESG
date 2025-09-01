import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Fuel, DollarSign, Building, BarChart3, Calculator, MapPin, TrendingUp, TrendingDown, Target } from "lucide-react";
import { PetrolStationResults } from "@/utils/petrolStationCalculations";

interface PetrolStationValuationResultsProps {
  results: PetrolStationResults;
}

export const PetrolStationValuationResults: React.FC<PetrolStationValuationResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const valuationMethods = [
    {
      name: "Income Method",
      icon: DollarSign,
      value: results.income_method_value,
      baseValue: results.income_method_base,
      description: "NOI divided by capitalization rate",
      color: "text-blue-600"
    },
    {
      name: "Sales Comparison",
      icon: BarChart3,
      value: results.sales_comparison_value,
      baseValue: results.sales_comparison_base,
      description: "Average of comparable station sales",
      color: "text-green-600"
    },
    {
      name: "Land/Asset Value",
      icon: MapPin,
      value: results.land_asset_value,
      baseValue: results.land_asset_base,
      description: "Land and asset valuation estimate",
      color: "text-purple-600"
    },
    {
      name: "Replacement Cost",
      icon: Building,
      value: results.replacement_cost_value,
      baseValue: results.replacement_cost_base,
      description: "Insurance/rebuild cost estimation",
      color: "text-orange-600"
    },
    {
      name: "Rent Approach",
      icon: Target,
      value: results.rent_approach_value,
      baseValue: results.rent_approach_base,
      description: "Annual rent capitalized at market rate",
      color: "text-teal-600"
    },
    {
      name: "Multiplier Method",
      icon: Calculator,
      value: results.multiplier_method_value,
      baseValue: results.multiplier_method_base,
      description: "Gross income times industry multiplier",
      color: "text-red-600"
    }
  ];

  const activeMethodsCount = valuationMethods.filter(method => method.value > 0).length;
  const getVarianceIndicator = (variance: number) => {
    if (variance < 10) return { label: 'Low', color: 'text-green-600', variant: 'default' as const };
    if (variance < 25) return { label: 'Moderate', color: 'text-yellow-600', variant: 'secondary' as const };
    return { label: 'High', color: 'text-red-600', variant: 'destructive' as const };
  };

  const varianceIndicator = getVarianceIndicator(results.method_variance);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(results.average_valuation)}</div>
            <div className="text-sm text-muted-foreground">
              Based on {activeMethodsCount} methods
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valuation Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatCurrency(results.valuation_range.low)} - {formatCurrency(results.valuation_range.high)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={varianceIndicator.variant}>{varianceIndicator.label}</Badge>
              <span className="text-xs text-muted-foreground">
                {results.method_variance.toFixed(1)}% variance
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Value per Pump</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatCurrency(results.value_per_pump)}</div>
            <div className="text-sm text-muted-foreground">Industry benchmark</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ESG Impact</CardTitle>
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
            {results.esg_included && (
              <div className="text-sm text-muted-foreground mt-1">
                Impact: {formatCurrency(results.total_esg_impact)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Method Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Petrol Station Valuation Methods
          </CardTitle>
          <CardDescription>
            Comprehensive analysis using six different valuation approaches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {valuationMethods.map((method, index) => {
            const Icon = method.icon;
            const variance = results.average_valuation > 0 ? ((method.value - results.average_valuation) / results.average_valuation) * 100 : 0;
            const esgImpact = method.value - method.baseValue;
            const isActive = method.value > 0;
            
            return (
              <div key={index} className={`space-y-3 ${!isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-4 w-4 ${isActive ? method.color : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {isActive ? formatCurrency(method.value) : 'N/A'}
                    </div>
                    {isActive && results.esg_included && (
                      <div className="text-sm text-muted-foreground">
                        Base: {formatCurrency(method.baseValue)}
                      </div>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Variance from Average:</span>
                      <div className="flex items-center gap-1">
                        {variance >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={variance >= 0 ? "text-green-600" : "text-red-600"}>
                          {variance >= 0 ? '+' : ''}{variance.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    {results.esg_included && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">ESG Adjustment:</span>
                          <span className={esgImpact >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(esgImpact)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">ESG Factor:</span>
                          <span className={results.esg_factor >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatPercentage(results.esg_factor)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
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

      {/* Station Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Station Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.value_per_pump)}
              </div>
              <div className="text-sm text-muted-foreground">Value per Pump</div>
              <div className="text-xs text-muted-foreground mt-1">
                Industry benchmark for efficiency
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.value_per_sf)}
              </div>
              <div className="text-sm text-muted-foreground">Value per Sq Ft</div>
              <div className="text-xs text-muted-foreground mt-1">
                Building efficiency metric
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                <Badge variant={varianceIndicator.variant}>{varianceIndicator.label}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Method Consistency</div>
              <div className="text-xs text-muted-foreground mt-1">
                {results.method_variance.toFixed(1)}% variance across methods
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Valuation Insights</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Income method reflects ongoing operational profitability</li>
                <li>• Sales comparison shows current market valuations</li>
                <li>• Land value represents underlying asset worth</li>
                <li>• Replacement cost indicates insurance/rebuild value</li>
                <li>• Rent approach shows investment yield potential</li>
                <li>• Multiplier method uses industry-standard ratios</li>
              </ul>
            </div>
            
            {results.esg_included && (
              <div className="space-y-2">
                <h4 className="font-medium">ESG Impact Analysis</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ESG factor: {formatPercentage(results.esg_factor)} {results.esg_factor >= 0 ? 'premium' : 'discount'}</li>
                  <li>• Total impact: {formatCurrency(results.total_esg_impact)}</li>
                  <li>• Sustainability features add market value</li>
                  <li>• Environmental compliance reduces risk</li>
                  <li>• Modern facilities attract premium tenants</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};