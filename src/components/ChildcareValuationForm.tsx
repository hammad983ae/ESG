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
import { OCRUpload } from "@/components/OCRUpload";

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
      placements: 0,
      value_per_placement: 0,
      gross_rent_per_placement: 0,
      net_rent_per_placement: 0,
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

  const handleOCRDataExtracted = (data: any) => {
    const updatedInputs: Partial<ChildcareInputs> = { ...inputs };
    
    if (data.capacity !== undefined) updatedInputs.childcare_placements = data.capacity;
    if (data.licensedPlaces !== undefined) updatedInputs.childcare_placements = data.licensedPlaces;
    if (data.weeklyFees !== undefined) updatedInputs.gross_rent_per_placement = data.weeklyFees * 52; // Convert weekly to annual
    if (data.operationalCosts !== undefined) updatedInputs.outgoings_allowance = data.operationalCosts;
    if (data.valuePerPlacement !== undefined) updatedInputs.value_per_placement = data.valuePerPlacement;
    
    setInputs(prev => ({ ...prev, ...updatedInputs }));
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <OCRUpload
        formType="childcare"
        onDataExtracted={handleOCRDataExtracted}
      />
      
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
            <div className="space-y-2">
              <Label>ESG Factor: {formatPercentage(inputs.esg_factor)}</Label>
              <Slider
                value={[inputs.esg_factor]}
                onValueChange={([value]) => handleInputChange('esg_factor', value)}
                max={0.2}
                min={-0.1}
                step={0.005}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* LDC Direct Comparison Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Long Day Childcare (LDC) Direct Comparison Approach
          </CardTitle>
          <CardDescription>
            Calculate property value using per placement valuation method based on comparable LDC sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childcare-placements">Number of LDC Placements</Label>
              <Input
                id="childcare-placements"
                type="number"
                value={inputs.childcare_placements}
                onChange={(e) => handleInputChange('childcare_placements', parseInt(e.target.value) || 0)}
                placeholder="169"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value-per-placement">Value per LDC Placement</Label>
              <Input
                id="value-per-placement"
                type="number"
                value={inputs.value_per_placement}
                onChange={(e) => handleInputChange('value_per_placement', parseFloat(e.target.value) || 0)}
                placeholder="60,000"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="land-value-included"
                checked={inputs.land_value_included}
                onCheckedChange={(checked) => handleInputChange('land_value_included', checked)}
              />
              <Label htmlFor="land-value-included">Include Land Value Component</Label>
            </div>
            
            {inputs.land_value_included && (
              <div className="space-y-2">
                <Label htmlFor="land-value">Land Value</Label>
                <Input
                  id="land-value"
                  type="number"
                  value={inputs.land_value}
                  onChange={(e) => handleInputChange('land_value', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Placement Value: {formatCurrency(inputs.childcare_placements * inputs.value_per_placement * (inputs.esg_included ? 1 + inputs.esg_factor : 1))}</div>
              {inputs.land_value_included && (
                <div>Land Value: {formatCurrency(inputs.land_value)}</div>
              )}
              <div className="font-medium">
                Total LDC Value: {formatCurrency((inputs.childcare_placements * inputs.value_per_placement * (inputs.esg_included ? 1 + inputs.esg_factor : 1)) + (inputs.land_value_included ? inputs.land_value : 0))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LDC Comparable Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            LDC Comparable Sales Analysis
          </CardTitle>
          <CardDescription>
            Add comparable LDC facility sales for per placement analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.comparison_data.map((comp, index) => (
            <div key={comp.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">LDC Comparable {index + 1}</Badge>
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
                    placeholder="10,140,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LDC Placements</Label>
                  <Input
                    type="number"
                    value={comp.placements}
                    onChange={(e) => handleComparisonDataChange(index, 'placements', parseFloat(e.target.value) || 0)}
                    placeholder="169"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value per Placement</Label>
                  <Input
                    type="number"
                    value={comp.value_per_placement}
                    onChange={(e) => handleComparisonDataChange(index, 'value_per_placement', parseFloat(e.target.value) || 0)}
                    placeholder="60,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gross Rent per Placement</Label>
                  <Input
                    type="number"
                    value={comp.gross_rent_per_placement}
                    onChange={(e) => handleComparisonDataChange(index, 'gross_rent_per_placement', parseFloat(e.target.value) || 0)}
                    placeholder="2,959"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net Rent per Placement</Label>
                  <Input
                    type="number"
                    value={comp.net_rent_per_placement}
                    onChange={(e) => handleComparisonDataChange(index, 'net_rent_per_placement', parseFloat(e.target.value) || 0)}
                    placeholder="2,800"
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
            Add LDC Comparable
          </Button>
        </CardContent>
      </Card>

      {/* LDC Rental Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            LDC Rental Capitalization Approach
          </CardTitle>
          <CardDescription>
            Calculate property value using gross LDC rents with outgoings and land tax allowances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gross-rent">Gross Rent per LDC Placement (Annual)</Label>
              <Input
                id="gross-rent"
                type="number"
                value={inputs.gross_rent_per_placement}
                onChange={(e) => handleInputChange('gross_rent_per_placement', parseFloat(e.target.value) || 0)}
                placeholder="2,959"
              />
              <div className="text-sm text-muted-foreground">
                Industry standard: $2,500 - $4,500 per LDC placement annually
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cap-rate">LDC Capitalization Rate</Label>
              <Input
                id="cap-rate"
                type="number"
                step="0.001"
                value={inputs.cap_rate}
                onChange={(e) => handleInputChange('cap_rate', parseFloat(e.target.value) || 0)}
                placeholder="0.055"
              />
              <div className="text-sm text-muted-foreground">
                Childcare sector cap rates typically 4.5% - 6.5%
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outgoings-allowance">Outgoings Allowance (% of Gross Rent)</Label>
              <Input
                id="outgoings-allowance"
                type="number"
                step="0.001"
                value={inputs.outgoings_allowance}
                onChange={(e) => handleInputChange('outgoings_allowance', parseFloat(e.target.value) || 0)}
                placeholder="0.01"
              />
              <div className="text-sm text-muted-foreground">
                Typically 1% - 3% for childcare facilities
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="land-tax-allowance">Land Tax Allowance (Annual)</Label>
              <Input
                id="land-tax-allowance"
                type="number"
                value={inputs.land_tax_allowance}
                onChange={(e) => handleInputChange('land_tax_allowance', parseFloat(e.target.value) || 0)}
                placeholder="5,000"
              />
            </div>
          </div>
          
          {inputs.gross_rent_per_placement > 0 && inputs.cap_rate > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Gross Annual Rent: {formatCurrency(inputs.childcare_placements * inputs.gross_rent_per_placement * (inputs.esg_included ? 1 + inputs.esg_factor : 1))}</div>
                <div>Less Outgoings: {formatCurrency((inputs.childcare_placements * inputs.gross_rent_per_placement * inputs.outgoings_allowance) + inputs.land_tax_allowance)}</div>
                <div>Net Operating Income: {formatCurrency((inputs.childcare_placements * inputs.gross_rent_per_placement * (inputs.esg_included ? 1 + inputs.esg_factor : 1)) - ((inputs.childcare_placements * inputs.gross_rent_per_placement * inputs.outgoings_allowance) + inputs.land_tax_allowance))}</div>
                <div>Capitalized Value: {formatCurrency(((inputs.childcare_placements * inputs.gross_rent_per_placement * (inputs.esg_included ? 1 + inputs.esg_factor : 1)) - ((inputs.childcare_placements * inputs.gross_rent_per_placement * inputs.outgoings_allowance) + inputs.land_tax_allowance)) / inputs.cap_rate)}</div>
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
    </div>
  );
};