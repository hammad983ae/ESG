import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, DollarSign, TrendingUp, Leaf, FileText, Calculator } from 'lucide-react';
import { SummationResults } from '@/utils/summationCalculations';

interface SummationApproachResultsProps {
  results: SummationResults;
  onNewCalculation: () => void;
}

export function SummationApproachResults({ results, onNewCalculation }: SummationApproachResultsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getESGStatus = (factor: number) => {
    if (factor > 1.0) return { status: 'Positive Impact', variant: 'default' as const, color: 'text-green-700 dark:text-green-300' };
    if (factor < 1.0) return { status: 'Negative Impact', variant: 'destructive' as const, color: 'text-red-700 dark:text-red-300' };
    return { status: 'Neutral', variant: 'secondary' as const, color: 'text-muted-foreground' };
  };

  const esgStatus = getESGStatus(results.esg_factor);
  const esgAdjustment = results.adjusted_value_with_esg - results.total_value;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Summation Approach Results</h2>
          <p className="text-muted-foreground">Property valuation based on component summation with ESG adjustment</p>
        </div>
        <Button onClick={onNewCalculation} variant="outline">
          New Calculation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Base Total Value
            </CardTitle>
            <CardDescription>
              Sum of all component values before ESG adjustment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {formatCurrency(results.total_value)}
            </div>
            <p className="text-sm text-muted-foreground">
              Calculated from {results.components.length} components
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              ESG Adjusted Value
            </CardTitle>
            <CardDescription>
              Final value with ESG factor ({results.esg_factor})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {formatCurrency(results.adjusted_value_with_esg)}
            </div>
            <Badge variant={esgStatus.variant} className="mb-2">
              <Leaf className="w-3 h-3 mr-1" />
              {esgStatus.status}
            </Badge>
            <p className={`text-sm ${esgStatus.color}`}>
              ESG adjustment: {esgAdjustment >= 0 ? '+' : ''}{formatCurrency(esgAdjustment)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Component Breakdown
          </CardTitle>
          <CardDescription>
            Detailed analysis of each property component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
              <div>Component</div>
              <div>Area (sqm)</div>
              <div>Rate ($/sqm)</div>
              <div>Value</div>
            </div>
            
            {results.components.map((component, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b last:border-b-0">
                <div className="font-medium">{component.name}</div>
                <div>{component.area.toLocaleString()}</div>
                <div>${component.rate.toLocaleString()}</div>
                <div className="font-semibold">{formatCurrency(component.added_value || 0)}</div>
              </div>
            ))}
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 font-semibold text-lg">
              <div className="md:col-span-3">Total Base Value</div>
              <div className="text-primary">{formatCurrency(results.total_value)}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2">
              <div className="md:col-span-3 flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                ESG Factor ({results.esg_factor})
              </div>
              <div className={esgStatus.color}>
                {esgAdjustment >= 0 ? '+' : ''}{formatCurrency(esgAdjustment)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 font-bold text-xl border-t pt-4">
              <div className="md:col-span-3">Final ESG Adjusted Value</div>
              <div className="text-primary">{formatCurrency(results.adjusted_value_with_esg)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Valuation Summary & Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Summation Approach</h4>
              <p className="text-sm text-muted-foreground mb-4">
                The summation approach calculates property value by adding the individual values of all property 
                components (land, buildings, improvements, etc.) based on their respective areas and rates.
              </p>
              
              <h5 className="font-medium mb-2">Key Benefits:</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Detailed component-by-component analysis</li>
                <li>• Useful for complex properties with multiple elements</li>
                <li>• Transparent calculation methodology</li>
                <li>• Incorporates ESG sustainability factors</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">ESG Integration</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Environmental, Social, and Governance (ESG) factors are applied as a multiplier to reflect 
                the property's sustainability performance and social impact.
              </p>
              
              <h5 className="font-medium mb-2">ESG Factor Guidelines:</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 1.0 = Standard market conditions</li>
                <li>• &gt;1.0 = Premium for sustainable features</li>
                <li>• &lt;1.0 = Discount for ESG concerns</li>
                <li>• Typical range: 0.8 - 1.3</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This valuation is based on the summation of component values with ESG adjustments. 
              Professional valuation advice should be sought for formal property assessment purposes. Market conditions, 
              location factors, and other considerations may significantly impact actual property values.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}