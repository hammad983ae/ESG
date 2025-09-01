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
      name: "LDC Direct Comparison",
      icon: Building,
      value: results.ldc_direct_comparison_value,
      description: "Long Day Childcare per placement valuation",
      breakdown: `${results.childcare_placements} placements × ${formatCurrency(results.value_per_placement)}`
    },
    {
      name: "Rental Capitalization",
      icon: DollarSign,
      value: results.capitalized_value,
      description: "Gross rents capitalized after outgoings",
      breakdown: `NOI: ${formatCurrency(results.net_operating_income)}`
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
                <li>• Total LDC placements: {results.childcare_placements} children</li>
                <li>• Value per placement: {formatCurrency(results.value_per_placement)}</li>
                <li>• Average comparable value per placement: {formatCurrency(results.average_value_per_placement)}</li>
                <li>• Placement value range: {formatCurrency(results.placement_value_range.low)} - {formatCurrency(results.placement_value_range.high)}</li>
                <li>• Gross rent per placement: {formatCurrency(results.average_gross_rent_per_placement)}</li>
                <li>• Net rent per placement: {formatCurrency(results.average_net_rent_per_placement)}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LDC Rental Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Rental Income Breakdown</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gross annual rent: {formatCurrency(results.gross_annual_rent)}</li>
                <li>• Total outgoings: {formatCurrency(results.total_outgoings)}</li>
                <li>• Net operating income: {formatCurrency(results.net_operating_income)}</li>
                <li>• Capitalized value: {formatCurrency(results.capitalized_value)}</li>
                <li>• Assessment based on comparable LDC facilities</li>
              </ul>
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