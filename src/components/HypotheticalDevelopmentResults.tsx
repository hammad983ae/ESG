import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, DollarSign, TrendingUp, AlertTriangle, FileText, Leaf } from 'lucide-react';
import { HypotheticalDevelopmentResult } from '@/utils/hypotheticalDevelopmentCalculations';

interface HypotheticalDevelopmentResultsProps {
  results: HypotheticalDevelopmentResult;
  approach: 'conventional' | 'esd';
  onNewCalculation: () => void;
}

export function HypotheticalDevelopmentResults({ results, approach, onNewCalculation }: HypotheticalDevelopmentResultsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getValueStatus = (value: number) => {
    if (value > 0) return { status: 'Positive', variant: 'default' as const, icon: TrendingUp };
    if (value < 0) return { status: 'Negative', variant: 'destructive' as const, icon: AlertTriangle };
    return { status: 'Break Even', variant: 'secondary' as const, icon: TrendingUp };
  };

  const residualStatus = getValueStatus(results.residual_land_value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {approach === 'esd' ? <Leaf className="w-6 h-6 text-green-600" /> : <Building2 className="w-6 h-6" />}
            {approach === 'esd' ? 'ESD' : 'Conventional'} Development Results
          </h2>
          <p className="text-muted-foreground">
            Residual land value analysis based on {approach === 'esd' ? 'sustainable' : 'conventional'} development feasibility
          </p>
        </div>
        <Button onClick={onNewCalculation} variant="outline">
          New Calculation
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Residual Land Value
          </CardTitle>
          <CardDescription>
            Final calculated land value for {approach === 'esd' ? 'ESD' : 'conventional'} development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(results.residual_land_value)}
          </div>
          <Badge variant={residualStatus.variant} className="mb-4">
            <residualStatus.icon className="w-3 h-3 mr-1" />
            {residualStatus.status}
          </Badge>
          {approach === 'esd' && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✓ ESD development benefits: Lower financing costs, reduced risk profile, and sustainability incentives
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Development Analysis Breakdown
          </CardTitle>
          <CardDescription>
            Detailed calculation components for the {approach === 'esd' ? 'sustainable' : 'conventional'} development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Revenue Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Rental Income:</span>
                  <span className="font-medium">{formatCurrency(results.gross_rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Operating Income:</span>
                  <span className="font-medium">{formatCurrency(results.net_income)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Capital Value:</span>
                  <span>{formatCurrency(results.capital_value)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Cost Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Construction Costs:</span>
                  <span className="font-medium">{formatCurrency(results.total_construction_cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest During Construction:</span>
                  <span className="font-medium">{formatCurrency(results.interest_cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Developer's Profit:</span>
                  <span className="font-medium">{formatCurrency(results.profit)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Development Costs:</span>
                  <span>{formatCurrency(results.total_costs)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className={`p-4 rounded-lg ${approach === 'esd' ? 'bg-green-50 dark:bg-green-950' : 'bg-muted/50'}`}>
            <h4 className="font-semibold mb-2">Development Feasibility Summary</h4>
            <p className="text-sm text-muted-foreground mb-3">
              The {approach === 'esd' ? 'ESD ' : ''}development approach determines the residual land value by calculating the difference 
              between the completed development's capital value and all development costs including profit margin.
              {approach === 'esd' && ' ESD developments typically benefit from lower interest rates and profit margins due to reduced risk and sustainability incentives.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Capital Value:</span>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(results.capital_value)}
                </div>
              </div>
              <div>
                <span className="font-medium">Total Development Costs:</span>
                <div className="text-lg font-semibold">
                  {formatCurrency(results.total_costs)}
                </div>
              </div>
              <div>
                <span className="font-medium">Residual Land Value:</span>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(results.residual_land_value)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Key Assumptions & Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">Method Strengths:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Reflects development potential</li>
                <li>• Market-driven approach</li>
                <li>• Considers all development costs</li>
                <li>• Includes profit margin requirements</li>
                {approach === 'esd' && <li>• Incorporates sustainability benefits</li>}
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Important Notes:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Based on development scenario assumptions</li>
                <li>• Sensitive to cost and revenue inputs</li>
                <li>• Market conditions may vary</li>
                <li>• Professional validation recommended</li>
                {approach === 'esd' && <li>• ESD incentives may vary by location</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}