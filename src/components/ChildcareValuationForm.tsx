import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Baby, Building, DollarSign, BarChart3, Home, Trash2, Plus } from "lucide-react";
import { ChildcareInputs, ComparisonProperty, defaultChildcareInputs } from "@/utils/childcareCalculations";

interface ChildcareValuationFormProps {
  onSubmit: (inputs: ChildcareInputs) => void;
}

export const ChildcareValuationForm: React.FC<ChildcareValuationFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<ChildcareInputs>(defaultChildcareInputs);

  const handleInputChange = <K extends keyof ChildcareInputs>(field: K, value: ChildcareInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleComparisonDataChange = (index: number, field: keyof ComparisonProperty, value: string | number) => {
    const updatedComparisons = [...inputs.comparison_data];
    updatedComparisons[index] = { ...updatedComparisons[index], [field]: value };
    setInputs(prev => ({ ...prev, comparison_data: updatedComparisons }));
  };

  const addComparisonProperty = () => {
    const newProperty: ComparisonProperty = {
      id: Date.now().toString(),
      sale_price: 0,
      size: 0,
      rent: 0,
      value: 0,
      location: '',
      sale_date: ''
    };
    setInputs(prev => ({ 
      ...prev, 
      comparison_data: [...prev.comparison_data, newProperty] 
    }));
  };

  const removeComparisonProperty = (index: number) => {
    setInputs(prev => ({ 
      ...prev, 
      comparison_data: prev.comparison_data.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ESG Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            ESG Settings for Childcare Facility
          </CardTitle>
          <CardDescription>
            Configure environmental, social, and governance factors for childcare property valuation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="esg-included"
              checked={inputs.esg_included}
              onCheckedChange={(checked) => handleInputChange('esg_included', checked)}
            />
            <Label htmlFor="esg-included">Include ESG Adjustments</Label>
          </div>
          
          {inputs.esg_included && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>General ESG Factor: {formatPercentage(inputs.esg_factor)}</Label>
                <Slider
                  value={[inputs.esg_factor]}
                  onValueChange={([value]) => handleInputChange('esg_factor', value)}
                  max={0.2}
                  min={-0.1}
                  step={0.005}
                />
              </div>
              <div className="space-y-2">
                <Label>Land ESG Factor: {formatPercentage(inputs.esg_land_factor)}</Label>
                <Slider
                  value={[inputs.esg_land_factor]}
                  onValueChange={([value]) => handleInputChange('esg_land_factor', value)}
                  max={0.2}
                  min={-0.1}
                  step={0.005}
                />
              </div>
              <div className="space-y-2">
                <Label>Construction ESG Factor: {formatPercentage(inputs.esg_construction_factor)}</Label>
                <Slider
                  value={[inputs.esg_construction_factor]}
                  onValueChange={([value]) => handleInputChange('esg_construction_factor', value)}
                  max={0.2}
                  min={-0.1}
                  step={0.005}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LCD Land & Construction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Land, Construction & Development (LCD) Approach
          </CardTitle>
          <CardDescription>
            Calculate total property value based on land and construction costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="land-value">Land Value</Label>
              <Input
                id="land-value"
                type="number"
                value={inputs.land_value}
                onChange={(e) => handleInputChange('land_value', parseFloat(e.target.value) || 0)}
                placeholder="300,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="construction-cost">Construction Cost</Label>
              <Input
                id="construction-cost"
                type="number"
                value={inputs.construction_cost}
                onChange={(e) => handleInputChange('construction_cost', parseFloat(e.target.value) || 0)}
                placeholder="700,000"
              />
            </div>
          </div>
          
          {inputs.esg_included && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Estimated LCD Total with ESG: {formatCurrency((inputs.land_value * (1 + inputs.esg_land_factor)) + (inputs.construction_cost * (1 + inputs.esg_construction_factor)))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Direct Comparison Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparable Sales Data
          </CardTitle>
          <CardDescription>
            Add comparable childcare facility sales for direct comparison analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.comparison_data.map((comp, index) => (
            <div key={comp.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Comparable {index + 1}</Badge>
                {inputs.comparison_data.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComparisonProperty(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sale Price</Label>
                  <Input
                    type="number"
                    value={comp.sale_price}
                    onChange={(e) => handleComparisonDataChange(index, 'sale_price', parseFloat(e.target.value) || 0)}
                    placeholder="1,200,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Size (sqm)</Label>
                  <Input
                    type="number"
                    value={comp.size}
                    onChange={(e) => handleComparisonDataChange(index, 'size', parseFloat(e.target.value) || 0)}
                    placeholder="5,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Rent</Label>
                  <Input
                    type="number"
                    value={comp.rent}
                    onChange={(e) => handleComparisonDataChange(index, 'rent', parseFloat(e.target.value) || 0)}
                    placeholder="50,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assessed Value</Label>
                  <Input
                    type="number"
                    value={comp.value}
                    onChange={(e) => handleComparisonDataChange(index, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="1,100,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    type="text"
                    value={comp.location || ''}
                    onChange={(e) => handleComparisonDataChange(index, 'location', e.target.value)}
                    placeholder="Brisbane North"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sale Date</Label>
                  <Input
                    type="date"
                    value={comp.sale_date || ''}
                    onChange={(e) => handleComparisonDataChange(index, 'sale_date', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addComparisonProperty}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comparable Property
          </Button>
        </CardContent>
      </Card>

      {/* Rent Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Rent-Based Valuation
          </CardTitle>
          <CardDescription>
            Calculate property value using rental income and market multipliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual-rent">Annual Rent</Label>
              <Input
                id="annual-rent"
                type="number"
                value={inputs.annual_rent}
                onChange={(e) => handleInputChange('annual_rent', parseFloat(e.target.value) || 0)}
                placeholder="52,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cap-rate">Capitalization Rate</Label>
              <Input
                id="cap-rate"
                type="number"
                step="0.001"
                value={inputs.cap_rate}
                onChange={(e) => handleInputChange('cap_rate', parseFloat(e.target.value) || 0)}
                placeholder="0.06"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent-multiplier">Rent Multiplier</Label>
              <Input
                id="rent-multiplier"
                type="number"
                step="0.1"
                value={inputs.rent_multiplier}
                onChange={(e) => handleInputChange('rent_multiplier', parseFloat(e.target.value) || 0)}
                placeholder="20"
              />
            </div>
          </div>
          
          {inputs.annual_rent > 0 && inputs.esg_included && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Cap Rate Approach: {formatCurrency((inputs.annual_rent * (1 + inputs.esg_factor)) / inputs.cap_rate)}</div>
                <div>Rent Multiplier Approach: {formatCurrency(inputs.annual_rent * inputs.rent_multiplier * (1 + inputs.esg_factor))}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        <Baby className="h-4 w-4 mr-2" />
        Calculate Childcare Property Valuation
      </Button>
    </form>
  );
};