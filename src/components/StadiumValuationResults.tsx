/**
 * Sustaino Pro - ESG Property Assessment Platform - Stadium Comprehensive Results Display
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019, US17/123,456-US17/123,475
 * Trademark Protected: ®SUSTAINO PRO (AU), ®SUSTAINO PRO (US Patent & Trademark Office)
 * 
 * Comprehensive stadium valuation results with detailed cash flow analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building, 
  Shield,
  Target,
  BarChart3,
  FileText
} from "lucide-react";
import { StadiumResults } from "@/utils/stadiumCalculations";

interface StadiumValuationResultsProps {
  results: StadiumResults;
}

export const StadiumValuationResults: React.FC<StadiumValuationResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const totalRevenue = results.total_ticket_sales + results.total_sponsorships + results.total_broadcasting + 
                      results.total_concessions + results.total_luxury_suites + results.total_other_revenue;
  const totalExpenses = results.total_maintenance + results.total_staffing + results.total_security + 
                       results.total_utilities + results.total_upkeep + results.total_other_expenses;

  const revenueBreakdown = [
    { name: "Ticket Sales", value: results.total_ticket_sales, color: "bg-blue-500" },
    { name: "Sponsorships", value: results.total_sponsorships, color: "bg-green-500" },
    { name: "Broadcasting", value: results.total_broadcasting, color: "bg-purple-500" },
    { name: "Concessions", value: results.total_concessions, color: "bg-orange-500" },
    { name: "Luxury Suites", value: results.total_luxury_suites, color: "bg-red-500" },
    { name: "Other Revenue", value: results.total_other_revenue, color: "bg-cyan-500" }
  ];

  const expenseBreakdown = [
    { name: "Staffing", value: results.total_staffing, color: "bg-gray-600" },
    { name: "Maintenance", value: results.total_maintenance, color: "bg-gray-500" },
    { name: "Security", value: results.total_security, color: "bg-gray-400" },
    { name: "Utilities", value: results.total_utilities, color: "bg-gray-300" },
    { name: "Upkeep", value: results.total_upkeep, color: "bg-gray-200" },
    { name: "Other Expenses", value: results.total_other_expenses, color: "bg-gray-100" }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Stadium Valuation Executive Summary
          </CardTitle>
          <CardDescription>
            {results.stadium_name} - Comprehensive {results.forecast_years}-Year Analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(results.total_stadium_value)}
              </div>
              <div className="text-sm text-muted-foreground">Total Stadium Value</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.present_value_cash_flows)}
              </div>
              <div className="text-sm text-muted-foreground">PV of Cash Flows</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.terminal_value)}
              </div>
              <div className="text-sm text-muted-foreground">Terminal Value</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {results.capacity.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Stadium Capacity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Stream Analysis
          </CardTitle>
          <CardDescription>
            Total projected revenue: {formatCurrency(totalRevenue)} over {results.forecast_years} years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {revenueBreakdown.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(item.value)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((item.value / totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <Progress 
                value={(item.value / totalRevenue) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Operating Expenses Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Operating Expenses Analysis
          </CardTitle>
          <CardDescription>
            Total projected expenses: {formatCurrency(totalExpenses)} over {results.forecast_years} years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenseBreakdown.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(item.value)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((item.value / totalExpenses) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <Progress 
                value={(item.value / totalExpenses) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cash Flow Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Annual Cash Flow Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-sm text-green-700">Total Revenue</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </div>
                <div className="text-sm text-red-700">Total Expenses</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalRevenue - totalExpenses)}
                </div>
                <div className="text-sm text-blue-700">Net Cash Flow</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Year-by-Year Cash Flows</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {results.annual_cash_flows.map((cashFlow, year) => (
                  <div key={year} className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Year {year + 1}:</span>
                    <span className={`font-medium ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cashFlow)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  Sustainable Stadium
                </div>
                <div className="text-sm text-muted-foreground">ESG Integration</div>
              </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Land Value & Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Land Value & Site Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.land_value)}
              </div>
              <div className="text-sm text-muted-foreground">Land Value</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {results.site_area_sqm.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Site Area (sqm)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Key Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Financial Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Total Stadium Valuation: {formatCurrency(results.total_stadium_value)}</li>
                <li>• Land Value: {formatCurrency(results.land_value)}</li>
                <li>• Operating Cash Flow (Total): {formatCurrency(totalRevenue - totalExpenses)}</li>
                <li>• Revenue per Seat: {formatCurrency(totalRevenue / results.capacity)}</li>
                <li>• Operating Margin: {formatPercentage((totalRevenue - totalExpenses) / totalRevenue)}</li>
                <li>• Present Value Factor: {results.forecast_years} years @ 8% discount</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Operational Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stadium Capacity: {results.capacity.toLocaleString()} seats</li>
                <li>• Site Area: {results.site_area_sqm.toLocaleString()} sqm</li>
                <li>• Forecast Period: {results.forecast_years} years</li>
                <li>• Average Annual Revenue: {formatCurrency(totalRevenue / results.forecast_years)}</li>
                <li>• Average Annual Expenses: {formatCurrency(totalExpenses / results.forecast_years)}</li>
                <li>• Average Annual Cash Flow: {formatCurrency((totalRevenue - totalExpenses) / results.forecast_years)}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};