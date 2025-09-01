import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, ShoppingCart, TrendingUp, Users, DollarSign, MapPin } from "lucide-react";
import { StadiumInputs, defaultStadiumInputs } from "@/utils/stadiumCalculations";

interface StadiumValuationFormProps {
  onSubmit: (inputs: StadiumInputs) => void;
}

export const StadiumValuationForm: React.FC<StadiumValuationFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<StadiumInputs>(defaultStadiumInputs);

  const handleInputChange = <K extends keyof StadiumInputs>(field: K, value: StadiumInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
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
            <MapPin className="h-5 w-5" />
            ESG Settings for Sports Stadium
          </CardTitle>
          <CardDescription>
            Configure environmental, social, and governance factors for stadium property valuation
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

      {/* Stadium Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Stadium Details
          </CardTitle>
          <CardDescription>
            Basic stadium capacity and event information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Stadium Seating Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={inputs.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                placeholder="50,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-days">Event Days per Year</Label>
              <Input
                id="event-days"
                type="number"
                value={inputs.event_days}
                onChange={(e) => handleInputChange('event_days', parseInt(e.target.value) || 0)}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg-spend">Average Spend per Attendee</Label>
              <Input
                id="avg-spend"
                type="number"
                value={inputs.avg_spend_per_attendee}
                onChange={(e) => handleInputChange('avg_spend_per_attendee', parseFloat(e.target.value) || 0)}
                placeholder="45"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sublease Income Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sublease Income Approach
          </CardTitle>
          <CardDescription>
            Calculate present value of sublease income based on capacity utilization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="sublease-enabled"
              checked={inputs.sublease_enabled}
              onCheckedChange={(checked) => handleInputChange('sublease_enabled', checked)}
            />
            <Label htmlFor="sublease-enabled">Enable Sublease Income Valuation</Label>
          </div>
          
          {inputs.sublease_enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentable-area">Rentable Area (sqm)</Label>
                  <Input
                    id="rentable-area"
                    type="number"
                    value={inputs.rentable_area_sqm}
                    onChange={(e) => handleInputChange('rentable_area_sqm', parseFloat(e.target.value) || 0)}
                    placeholder="15,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent-per-sqm">Annual Rent per sqm</Label>
                  <Input
                    id="rent-per-sqm"
                    type="number"
                    value={inputs.rent_per_sqm}
                    onChange={(e) => handleInputChange('rent_per_sqm', parseFloat(e.target.value) || 0)}
                    placeholder="250"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupancy-rate">Occupancy Rate: {formatPercentage(inputs.occupancy_rate)}</Label>
                  <Slider
                    id="occupancy-rate"
                    value={[inputs.occupancy_rate]}
                    onValueChange={([value]) => handleInputChange('occupancy_rate', value)}
                    max={1}
                    min={0.1}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-rate">Discount Rate: {formatPercentage(inputs.discount_rate)}</Label>
                  <Slider
                    id="discount-rate"
                    value={[inputs.discount_rate]}
                    onValueChange={([value]) => handleInputChange('discount_rate', value)}
                    max={0.2}
                    min={0.01}
                    step={0.001}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forecast-years">Forecast Period (Years)</Label>
                  <Input
                    id="forecast-years"
                    type="number"
                    value={inputs.forecast_years}
                    onChange={(e) => handleInputChange('forecast_years', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retail Income Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Retail Income Approach
          </CardTitle>
          <CardDescription>
            Estimate valuation based on retail income from attendee spending
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="retail-enabled"
              checked={inputs.retail_enabled}
              onCheckedChange={(checked) => handleInputChange('retail_enabled', checked)}
            />
            <Label htmlFor="retail-enabled">Enable Retail Income Valuation</Label>
          </div>
          
          {inputs.retail_enabled && (
            <div className="space-y-2">
              <Label htmlFor="retail-multiplier">Retail Industry Multiplier</Label>
              <Input
                id="retail-multiplier"
                type="number"
                step="0.1"
                value={inputs.retail_multiplier}
                onChange={(e) => handleInputChange('retail_multiplier', parseFloat(e.target.value) || 0)}
                placeholder="2.5"
              />
              <div className="text-sm text-muted-foreground">
                Typical range: 1.5 - 3.0 for sports venues
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Turnover Method Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Turnover Method Approach
          </CardTitle>
          <CardDescription>
            Calculate valuation based on turnover/sales with industry multipliers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="turnover-enabled"
              checked={inputs.turnover_enabled}
              onCheckedChange={(checked) => handleInputChange('turnover_enabled', checked)}
            />
            <Label htmlFor="turnover-enabled">Enable Turnover Method Valuation</Label>
          </div>
          
          {inputs.turnover_enabled && (
            <div className="space-y-2">
              <Label htmlFor="industry-multiplier">Industry Multiplier</Label>
              <Input
                id="industry-multiplier"
                type="number"
                step="0.1"
                value={inputs.industry_multiplier}
                onChange={(e) => handleInputChange('industry_multiplier', parseFloat(e.target.value) || 0)}
                placeholder="1.8"
              />
              <div className="text-sm text-muted-foreground">
                Stadium industry multiplier based on comparable sales
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        <MapPin className="h-4 w-4 mr-2" />
        Calculate Stadium Property Valuation
      </Button>
    </form>
  );
};