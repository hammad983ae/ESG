import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Building2, DollarSign, Calculator, Home, Users, TrendingUp, TrendingDown } from "lucide-react";
import { HospitalityResults } from "@/utils/hospitalityCalculations";

interface HospitalityValuationResultsProps {
  results: HospitalityResults;
}

export const HospitalityValuationResults: React.FC<HospitalityValuationResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const valuationMethods = [
    {
      name: "Income Approach",
      icon: DollarSign,
      value: results.income_approach_value,
      baseValue: results.income_approach_base,
      description: "Based on NOI and capitalization rate"
    },
    {
      name: "GIM Approach",
      icon: Calculator,
      value: results.gim_approach_value,
      baseValue: results.gim_approach_base,
      description: "Gross Income Multiplier method"
    },
    {
      name: "Per Unit Approach",
      icon: Users,
      value: results.per_unit_approach_value,
      baseValue: results.per_unit_approach_base,
      description: "Value per key/room/seat"
    },
    {
      name: "Revenue Multiplier",
      icon: TrendingUp,
      value: results.revenue_multiplier_value,
      baseValue: results.revenue_multiplier_base,
      description: "Based on room revenue multiplier"
    },
    {
      name: "Replacement Cost",
      icon: Home,
      value: results.replacement_cost_value,
      baseValue: results.replacement_cost_base,
      description: "Insurance/rebuild cost estimation"
    }
  ];

  const averageValue = valuationMethods.reduce((sum, method) => sum + method.value, 0) / valuationMethods.length;
  const averageBaseValue = valuationMethods.reduce((sum, method) => sum + method.baseValue, 0) / valuationMethods.length;
  const esgImpact = averageValue - averageBaseValue;
  const esgImpactPercentage = (esgImpact / averageBaseValue) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageValue)}</div>
            {results.esg_included && (
              <div className="text-sm text-muted-foreground">
                Base: {formatCurrency(averageBaseValue)}
              </div>
            )}
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
            {results.esg_included && (
              <div className="text-sm text-muted-foreground mt-1">
                Impact: {formatCurrency(esgImpact)} ({esgImpactPercentage >= 0 ? '+' : ''}{esgImpactPercentage.toFixed(1)}%)
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Value Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>High: {formatCurrency(Math.max(...valuationMethods.map(m => m.value)))}</div>
              <div>Low: {formatCurrency(Math.min(...valuationMethods.map(m => m.value)))}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Valuation Method Comparison
          </CardTitle>
          <CardDescription>
            Detailed breakdown of all valuation approaches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {valuationMethods.map((method, index) => {
            const Icon = method.icon;
            const variance = ((method.value - averageValue) / averageValue) * 100;
            const esgAdjustment = method.value - method.baseValue;
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{formatCurrency(method.value)}</div>
                    {results.esg_included && (
                      <div className="text-sm text-muted-foreground">
                        Base: {formatCurrency(method.baseValue)}
                      </div>
                    )}
                  </div>
                </div>
                
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
                        <span className={esgAdjustment >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(esgAdjustment)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">ESG Impact:</span>
                        <span className={results.esg_factor >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(results.esg_factor)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
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
                
                {index < valuationMethods.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Method Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Income approach provides fundamental value based on cash flow</li>
                <li>• GIM offers quick market-based comparison</li>
                <li>• Per unit method reflects operational capacity value</li>
                <li>• Revenue multiplier shows earnings potential</li>
                <li>• Replacement cost indicates insurance/rebuild value</li>
              </ul>
            </div>
            
            {results.esg_included && (
              <div className="space-y-2">
                <h4 className="font-medium">ESG Impact</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ESG factor: {formatPercentage(results.esg_factor)} {results.esg_factor >= 0 ? 'premium' : 'discount'}</li>
                  <li>• Average impact: {formatCurrency(esgImpact)}</li>
                  <li>• ESG adjustments reflect sustainability value</li>
                  <li>• Premium/discount varies by investor profile</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};