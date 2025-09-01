import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Fuel, DollarSign, Building, BarChart3, Calculator, MapPin, Plus, Trash2 } from "lucide-react";
import { PetrolStationInputs, ComparableSale, defaultPetrolStationInputs } from "@/utils/petrolStationCalculations";

interface PetrolStationValuationFormProps {
  onSubmit: (inputs: PetrolStationInputs) => void;
}

export const PetrolStationValuationForm: React.FC<PetrolStationValuationFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<PetrolStationInputs>(defaultPetrolStationInputs);

  const handleInputChange = <K extends keyof PetrolStationInputs>(field: K, value: PetrolStationInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleComparableChange = (index: number, field: keyof ComparableSale, value: string | number) => {
    const updatedComparables = [...inputs.comparable_sales];
    updatedComparables[index] = { ...updatedComparables[index], [field]: value };
    setInputs(prev => ({ ...prev, comparable_sales: updatedComparables }));
  };

  const addComparable = () => {
    const newComparable: ComparableSale = {
      id: Date.now().toString(),
      sale_price: 0,
      location: '',
      sale_date: '',
      station_type: 'Full Service',
      pumps: 0,
      notes: ''
    };
    setInputs(prev => ({
      ...prev,
      comparable_sales: [...prev.comparable_sales, newComparable]
    }));
  };

  const removeComparable = (index: number) => {
    setInputs(prev => ({
      ...prev,
      comparable_sales: prev.comparable_sales.filter((_, i) => i !== index)
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
      {/* Station Details & ESG Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Petrol Station Configuration
          </CardTitle>
          <CardDescription>
            Configure station details and ESG sustainability factors for valuation analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Station Type</Label>
              <Select value={inputs.station_type} onValueChange={(value) => handleInputChange('station_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Service">Full Service</SelectItem>
                  <SelectItem value="Self Service">Self Service</SelectItem>
                  <SelectItem value="Truck Stop">Truck Stop</SelectItem>
                  <SelectItem value="Highway Service">Highway Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Location Type</Label>
              <Select value={inputs.location_type} onValueChange={(value) => handleInputChange('location_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Highway">Highway</SelectItem>
                  <SelectItem value="Urban">Urban</SelectItem>
                  <SelectItem value="Suburban">Suburban</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Number of Pumps</Label>
              <Input
                type="number"
                value={inputs.number_of_pumps}
                onChange={(e) => handleInputChange('number_of_pumps', parseInt(e.target.value) || 0)}
                placeholder="8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={inputs.convenience_store}
                  onCheckedChange={(checked) => handleInputChange('convenience_store', !!checked)}
                />
                Convenience Store
              </Label>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="esg-included"
                checked={inputs.esg_included}
                onCheckedChange={(checked) => handleInputChange('esg_included', checked)}
              />
              <Label htmlFor="esg-included">Include ESG Sustainability Factors</Label>
            </div>
            
            {inputs.esg_included && (
              <div className="space-y-2">
                <Label>ESG Factor: {formatPercentage(inputs.esg_factor)}</Label>
                <Slider
                  value={[inputs.esg_factor]}
                  onValueChange={([value]) => handleInputChange('esg_factor', value)}
                  max={0.15}
                  min={-0.05}
                  step={0.005}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-5% Discount</span>
                  <span>15% Premium</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Income Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Method Parameters
          </CardTitle>
          <CardDescription>
            Net Operating Income approach and rental income analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Net Operating Income (NOI)</Label>
              <Input
                type="number"
                value={inputs.noi}
                onChange={(e) => handleInputChange('noi', parseFloat(e.target.value) || 0)}
                placeholder="180,000"
              />
            </div>
            <div className="space-y-2">
              <Label>Capitalization Rate</Label>
              <Input
                type="number"
                step="0.001"
                value={inputs.cap_rate}
                onChange={(e) => handleInputChange('cap_rate', parseFloat(e.target.value) || 0)}
                placeholder="0.08"
              />
            </div>
            <div className="space-y-2">
              <Label>Annual Rent Income</Label>
              <Input
                type="number"
                value={inputs.annual_rent}
                onChange={(e) => handleInputChange('annual_rent', parseFloat(e.target.value) || 0)}
                placeholder="120,000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparable Sales Data
          </CardTitle>
          <CardDescription>
            Recent sales of similar petrol stations for comparison analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.comparable_sales.map((comp, index) => (
            <div key={comp.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Comparable {index + 1}</Badge>
                {inputs.comparable_sales.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComparable(index)}
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
                    onChange={(e) => handleComparableChange(index, 'sale_price', parseFloat(e.target.value) || 0)}
                    placeholder="2,200,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={comp.location}
                    onChange={(e) => handleComparableChange(index, 'location', e.target.value)}
                    placeholder="Brisbane North"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sale Date</Label>
                  <Input
                    type="date"
                    value={comp.sale_date}
                    onChange={(e) => handleComparableChange(index, 'sale_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Station Type</Label>
                  <Select value={comp.station_type} onValueChange={(value) => handleComparableChange(index, 'station_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Service">Full Service</SelectItem>
                      <SelectItem value="Self Service">Self Service</SelectItem>
                      <SelectItem value="Truck Stop">Truck Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Pumps</Label>
                  <Input
                    type="number"
                    value={comp.pumps}
                    onChange={(e) => handleComparableChange(index, 'pumps', parseInt(e.target.value) || 0)}
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={comp.notes || ''}
                    onChange={(e) => handleComparableChange(index, 'notes', e.target.value)}
                    placeholder="Additional details"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addComparable} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Comparable Sale
          </Button>
        </CardContent>
      </Card>

      {/* Asset Value & Replacement Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Land & Asset Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Land/Asset Value Estimate</Label>
              <Input
                type="number"
                value={inputs.land_value}
                onChange={(e) => handleInputChange('land_value', parseFloat(e.target.value) || 0)}
                placeholder="800,000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Replacement Cost Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost per Sq Ft</Label>
                <Input
                  type="number"
                  value={inputs.cost_per_sf}
                  onChange={(e) => handleInputChange('cost_per_sf', parseFloat(e.target.value) || 0)}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label>Building Sq Ft</Label>
                <Input
                  type="number"
                  value={inputs.building_sf}
                  onChange={(e) => handleInputChange('building_sf', parseFloat(e.target.value) || 0)}
                  placeholder="2,500"
                />
              </div>
              <div className="space-y-2">
                <Label>Site Costs</Label>
                <Input
                  type="number"
                  value={inputs.site_costs}
                  onChange={(e) => handleInputChange('site_costs', parseFloat(e.target.value) || 0)}
                  placeholder="150,000"
                />
              </div>
              <div className="space-y-2">
                <Label>Other Costs</Label>
                <Input
                  type="number"
                  value={inputs.other_costs}
                  onChange={(e) => handleInputChange('other_costs', parseFloat(e.target.value) || 0)}
                  placeholder="75,000"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multiplier Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Income Multiplier Method
          </CardTitle>
          <CardDescription>
            Industry-standard multiplier applied to gross income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gross Income</Label>
              <Input
                type="number"
                value={inputs.gross_income}
                onChange={(e) => handleInputChange('gross_income', parseFloat(e.target.value) || 0)}
                placeholder="450,000"
              />
            </div>
            <div className="space-y-2">
              <Label>Industry Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={inputs.industry_multiplier}
                onChange={(e) => handleInputChange('industry_multiplier', parseFloat(e.target.value) || 0)}
                placeholder="4.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        <Fuel className="h-4 w-4 mr-2" />
        Calculate Petrol Station Valuation
      </Button>
    </form>
  );
};