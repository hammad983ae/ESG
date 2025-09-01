import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Building, ShoppingCart, TrendingUp, Users, DollarSign, Target, TrendingDown, MapPin } from "lucide-react";
import { StadiumResults } from "@/utils/stadiumCalculations";

interface StadiumValuationResultsProps {
  results: StadiumResults;
}

export const StadiumValuationResults: React.FC<StadiumValuationResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const valuationMethods = [
    {
      name: "Sublease Income",
      icon: Building,
      value: results.sublease_enabled ? results.sublease_present_value : 0,
      enabled: results.sublease_enabled,
      description: "Present value of sublease income over forecast period",
      breakdown: `Annual Income: ${formatCurrency(results.sublease_annual_income)}`
    },
    {
      name: "Retail Income",
      icon: ShoppingCart,
      value: results.retail_enabled ? results.retail_valuation : 0,
      enabled: results.retail_enabled,
      description: "Valuation based on retail income from attendees",
      breakdown: `Annual Retail: ${formatCurrency(results.retail_annual_income)}`
    },
    {
      name: "Turnover Method",
      icon: TrendingUp,
      value: results.turnover_enabled ? results.turnover_valuation : 0,
      enabled: results.turnover_enabled,
      description: "Valuation based on annual sales turnover",
      breakdown: `Annual Sales: ${formatCurrency(results.turnover_annual_sales)}`
    }
  ];

  const activeMethodsCount = valuationMethods.filter(method => method.enabled && method.value > 0).length;
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
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Sports Stadium</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Specialized valuation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stadium Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Stadium Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {results.capacity.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Seating Capacity</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {results.event_days}
              </div>
              <div className="text-sm text-muted-foreground">Event Days/Year</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.avg_spend_per_attendee)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Spend/Attendee</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Method Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Stadium Valuation Methods
          </CardTitle>
          <CardDescription>
            Comprehensive analysis using multiple approaches for sports stadium facilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {valuationMethods.map((method, index) => {
            const Icon = method.icon;
            const variance = results.valuation_average > 0 ? ((method.value - results.valuation_average) / results.valuation_average) * 100 : 0;
            const isActive = method.enabled && method.value > 0;
            
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
                      {isActive ? formatCurrency(method.value) : 'Disabled'}
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
                      <span>{((method.value / Math.max(...valuationMethods.filter(m => m.enabled).map(m => m.value))) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={(method.value / Math.max(...valuationMethods.filter(m => m.enabled).map(m => m.value))) * 100} 
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

      {/* Revenue Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Streams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Annual Revenue Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stadium capacity: {results.capacity.toLocaleString()} seats</li>
                <li>• Event days per year: {results.event_days}</li>
                <li>• Annual attendees: {(results.capacity * results.event_days).toLocaleString()}</li>
                <li>• Average spend per attendee: {formatCurrency(results.avg_spend_per_attendee)}</li>
                <li>• Total annual spending: {formatCurrency(results.capacity * results.event_days * results.avg_spend_per_attendee)}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valuation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Method Breakdown</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {results.sublease_enabled && (
                  <li>• Sublease PV: {formatCurrency(results.sublease_present_value)}</li>
                )}
                {results.retail_enabled && (
                  <li>• Retail valuation: {formatCurrency(results.retail_valuation)}</li>
                )}
                {results.turnover_enabled && (
                  <li>• Turnover valuation: {formatCurrency(results.turnover_valuation)}</li>
                )}
                <li>• Average valuation: {formatCurrency(results.valuation_average)}</li>
                <li>• Valuation range: {formatCurrency(results.valuation_range.low)} - {formatCurrency(results.valuation_range.high)}</li>
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
                  Stadium
                </div>
                <div className="text-sm text-muted-foreground">Sports Facility</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};