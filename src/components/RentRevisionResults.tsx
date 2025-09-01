/**
 * Sustaino Pro - ESG Property Assessment Platform - Rent Revision Results Display
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Professional rent revision results with comprehensive analysis and reporting
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Target
} from "lucide-react";
import { RentRevisionResults as RentRevisionResultsType } from "@/utils/rentRevisionCalculations";

interface RentRevisionResultsProps {
  results: RentRevisionResultsType;
}

export const RentRevisionResults: React.FC<RentRevisionResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  const getIncreaseStatus = () => {
    if (results.rent_increase_percentage <= 3) {
      return { status: "Conservative", color: "bg-green-500", icon: CheckCircle };
    } else if (results.rent_increase_percentage <= 10) {
      return { status: "Moderate", color: "bg-blue-500", icon: Target };
    } else if (results.rent_increase_percentage <= 20) {
      return { status: "Significant", color: "bg-orange-500", icon: AlertTriangle };
    } else {
      return { status: "Major", color: "bg-red-500", icon: AlertTriangle };
    }
  };

  const increaseStatus = getIncreaseStatus();
  const StatusIcon = increaseStatus.icon;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rent Revision Executive Summary
          </CardTitle>
          <CardDescription>
            Professional analysis for {results.tenant_name} - {results.property_type.charAt(0).toUpperCase() + results.property_type.slice(1)} Property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.current_annual_rent)}
              </div>
              <div className="text-sm text-muted-foreground">Current Annual Rent</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.proposed_annual_rent)}
              </div>
              <div className="text-sm text-muted-foreground">Proposed Annual Rent</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(results.rent_increase_amount)}
              </div>
              <div className="text-sm text-muted-foreground">Annual Increase</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl font-bold text-primary">
                  {formatPercentage(results.rent_increase_percentage)}
                </div>
                {results.rent_increase_percentage > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">Percentage Increase</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Land Value Analysis */}
      {results.include_land_analysis && results.land_analysis.land_area > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Land Value Analysis
            </CardTitle>
            <CardDescription>
              Improved land area rental analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {results.land_analysis.land_area.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Land Area (sqm)</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.land_analysis.market_annual_land_value)}
                </div>
                <div className="text-sm text-muted-foreground">Market Land Value</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.land_analysis.current_annual_land_value)}
                </div>
                <div className="text-sm text-muted-foreground">Current Land Value</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.land_analysis.proposed_annual_land_value)}
                </div>
                <div className="text-sm text-muted-foreground">Proposed Land Value</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-primary">
                    {formatPercentage(results.land_analysis.land_value_increase_percentage)}
                  </div>
                  {results.land_analysis.land_value_increase_percentage > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Land Value Change</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revision Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revision Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${increaseStatus.color}`}>
                <StatusIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{increaseStatus.status} Rent Increase</h3>
                <p className="text-sm text-muted-foreground">{results.recommendation}</p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-4">
              {formatPercentage(results.rent_increase_percentage)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Rate:</span>
                <span className="font-medium">
                  {formatCurrency(results.supporting_analysis.current_rate_per_unit)} per {results.supporting_analysis.unit_type.replace(/s$/, '')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Proposed Rate:</span>
                <span className="font-medium">
                  {formatCurrency(results.supporting_analysis.proposed_rate_per_unit)} per {results.supporting_analysis.unit_type.replace(/s$/, '')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market Rate:</span>
                <span className="font-medium">
                  {formatCurrency(results.supporting_analysis.market_rate_per_unit)} per {results.supporting_analysis.unit_type.replace(/s$/, '')}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total {results.supporting_analysis.unit_type}:</span>
                <span className="font-medium">{results.supporting_analysis.units_or_area.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">CPI Adjusted Rent:</span>
                <span className="font-medium">{formatCurrency(results.cpi_adjusted_rent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market vs Proposed:</span>
                <span className={`font-medium ${results.market_comparison_variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(results.market_comparison_variance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market Annual Rent:</span>
                <span className="font-medium">{formatCurrency(results.market_annual_rent)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Effective Date:</span>
                <span className="font-medium">{new Date(results.revision_effective_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Review:</span>
                <span className="font-medium">{new Date(results.next_review_date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supporting Evidence */}
      <Card>
        <CardHeader>
          <CardTitle>Supporting Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.comparable_evidence && (
            <div>
              <h4 className="font-semibold mb-2">Comparable Evidence</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {results.comparable_evidence}
              </p>
            </div>
          )}
          
          {results.market_conditions && (
            <div>
              <h4 className="font-semibold mb-2">Market Conditions</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {results.market_conditions}
              </p>
            </div>
          )}

          {results.esg_considerations && (
            <div>
              <h4 className="font-semibold mb-2">ESG Sustainability Considerations</h4>
              <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/20">
                {results.esg_considerations}
              </p>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Professional Recommendation</h4>
            <p className="text-sm bg-green-50 text-green-800 p-3 rounded-lg border border-green-200">
              {results.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Review and approve proposed rent revision</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Prepare formal rent review notice for tenant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Schedule tenant meeting to discuss revision</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Set calendar reminder for next review date: {new Date(results.next_review_date).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <FileText className="h-4 w-4 mr-2" />
          Export Rent Review Report
        </Button>
        <Button variant="outline" className="flex-1">
          <DollarSign className="h-4 w-4 mr-2" />
          Generate Tenant Notice
        </Button>
      </div>
    </div>
  );
};