import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Building2, DollarSign, Calculator, Home, Users, Zap } from "lucide-react";
import { HospitalityInputs, defaultHospitalityInputs } from "@/utils/hospitalityCalculations";

interface HospitalityValuationFormProps {
  onSubmit: (inputs: HospitalityInputs) => void;
}

export const HospitalityValuationForm: React.FC<HospitalityValuationFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<HospitalityInputs>(defaultHospitalityInputs);

  const handleInputChange = (field: keyof HospitalityInputs, value: number | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Hospitality & Commercial Property Valuation
        </CardTitle>
        <CardDescription>
          Comprehensive valuation using five specialized approaches for hospitality and commercial properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ESG Settings */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">ESG Adjustments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="esg-included"
                checked={inputs.esg_included}
                onCheckedChange={(checked) => handleInputChange('esg_included', checked)}
              />
              <Label htmlFor="esg-included">Include ESG Factor</Label>
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
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-10% Discount</span>
                  <span>20% Premium</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Income Approach */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Income Approach</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="noi">Net Operating Income (NOI)</Label>
                <Input
                  id="noi"
                  type="number"
                  value={inputs.noi}
                  onChange={(e) => handleInputChange('noi', parseFloat(e.target.value) || 0)}
                  placeholder="1,200,000"
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
                  placeholder="0.08"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* GIM Approach */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Gross Income Multiplier (GIM)</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gross-income">Gross Income</Label>
                <Input
                  id="gross-income"
                  type="number"
                  value={inputs.gross_income}
                  onChange={(e) => handleInputChange('gross_income', parseFloat(e.target.value) || 0)}
                  placeholder="2,000,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gim">GIM Factor</Label>
                <Input
                  id="gim"
                  type="number"
                  step="0.1"
                  value={inputs.gim}
                  onChange={(e) => handleInputChange('gim', parseFloat(e.target.value) || 0)}
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Per Unit Approach */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Per Unit Approach (Keys/Rooms/Seats)</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number-units">Number of Units</Label>
                <Input
                  id="number-units"
                  type="number"
                  value={inputs.number_of_units}
                  onChange={(e) => handleInputChange('number_of_units', parseFloat(e.target.value) || 0)}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="per-unit-value">Value per Unit</Label>
                <Input
                  id="per-unit-value"
                  type="number"
                  value={inputs.per_unit_value}
                  onChange={(e) => handleInputChange('per_unit_value', parseFloat(e.target.value) || 0)}
                  placeholder="50,000"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Revenue Multiplier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Revenue Multiplier Approach</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-revenue">Room Revenue</Label>
                <Input
                  id="room-revenue"
                  type="number"
                  value={inputs.room_revenue}
                  onChange={(e) => handleInputChange('room_revenue', parseFloat(e.target.value) || 0)}
                  placeholder="1,500,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue-multiplier">Revenue Multiplier</Label>
                <Input
                  id="revenue-multiplier"
                  type="number"
                  step="0.1"
                  value={inputs.revenue_multiplier}
                  onChange={(e) => handleInputChange('revenue_multiplier', parseFloat(e.target.value) || 0)}
                  placeholder="4"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Replacement Cost */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Replacement Cost Method</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost-per-sf">Cost per Square Foot</Label>
                <Input
                  id="cost-per-sf"
                  type="number"
                  value={inputs.cost_per_sf}
                  onChange={(e) => handleInputChange('cost_per_sf', parseFloat(e.target.value) || 0)}
                  placeholder="2,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building-area">Building Area (SF)</Label>
                <Input
                  id="building-area"
                  type="number"
                  value={inputs.building_area_sf}
                  onChange={(e) => handleInputChange('building_area_sf', parseFloat(e.target.value) || 0)}
                  placeholder="10,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-costs">Site Costs</Label>
                <Input
                  id="site-costs"
                  type="number"
                  value={inputs.site_costs}
                  onChange={(e) => handleInputChange('site_costs', parseFloat(e.target.value) || 0)}
                  placeholder="200,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other-costs">Other Costs</Label>
                <Input
                  id="other-costs"
                  type="number"
                  value={inputs.other_costs}
                  onChange={(e) => handleInputChange('other_costs', parseFloat(e.target.value) || 0)}
                  placeholder="100,000"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Calculate All Valuations
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};