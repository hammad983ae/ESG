/**
 * Sustaino Pro - ESG Property Assessment Platform - Sports Stadium Comprehensive Valuation Form
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Comprehensive stadium valuation form with detailed revenue and expense forecasting
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, DollarSign, TrendingUp, Users, Building, Shield } from "lucide-react";
import { StadiumInputs, defaultStadiumInputs } from "@/utils/stadiumCalculations";

interface StadiumValuationFormProps {
  onSubmit: (inputs: StadiumInputs) => void;
}

export const StadiumValuationForm: React.FC<StadiumValuationFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<StadiumInputs>(defaultStadiumInputs);

  const handleInputChange = <K extends keyof StadiumInputs>(field: K, value: StadiumInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleRevenueChange = (category: keyof StadiumInputs['revenue'], year: number, value: number) => {
    setInputs(prev => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        [category]: prev.revenue[category].map((val, idx) => idx === year ? value : val)
      }
    }));
  };

  const handleExpenseChange = (category: keyof StadiumInputs['expenses'], year: number, value: number) => {
    setInputs(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: prev.expenses[category].map((val, idx) => idx === year ? value : val)
      }
    }));
  };

  const addForecastYear = () => {
    if (inputs.forecast_years < 15) {
      const newYear = inputs.forecast_years;
      setInputs(prev => ({
        ...prev,
        forecast_years: prev.forecast_years + 1,
        revenue: {
          ticket_sales: [...prev.revenue.ticket_sales, prev.revenue.ticket_sales[newYear - 1] * 1.05],
          sponsorships: [...prev.revenue.sponsorships, prev.revenue.sponsorships[newYear - 1] * 1.05],
          broadcasting_rights: [...prev.revenue.broadcasting_rights, prev.revenue.broadcasting_rights[newYear - 1] * 1.05],
          concessions: [...prev.revenue.concessions, prev.revenue.concessions[newYear - 1] * 1.05],
          luxury_suites: [...prev.revenue.luxury_suites, prev.revenue.luxury_suites[newYear - 1] * 1.05]
        },
        expenses: {
          maintenance: [...prev.expenses.maintenance, prev.expenses.maintenance[newYear - 1] * 1.05],
          staffing: [...prev.expenses.staffing, prev.expenses.staffing[newYear - 1] * 1.05],
          security: [...prev.expenses.security, prev.expenses.security[newYear - 1] * 1.05],
          utilities: [...prev.expenses.utilities, prev.expenses.utilities[newYear - 1] * 1.05],
          upkeep: [...prev.expenses.upkeep, prev.expenses.upkeep[newYear - 1] * 1.05]
        }
      }));
    }
  };

  const removeForecastYear = () => {
    if (inputs.forecast_years > 3) {
      setInputs(prev => ({
        ...prev,
        forecast_years: prev.forecast_years - 1,
        revenue: {
          ticket_sales: prev.revenue.ticket_sales.slice(0, -1),
          sponsorships: prev.revenue.sponsorships.slice(0, -1),
          broadcasting_rights: prev.revenue.broadcasting_rights.slice(0, -1),
          concessions: prev.revenue.concessions.slice(0, -1),
          luxury_suites: prev.revenue.luxury_suites.slice(0, -1)
        },
        expenses: {
          maintenance: prev.expenses.maintenance.slice(0, -1),
          staffing: prev.expenses.staffing.slice(0, -1),
          security: prev.expenses.security.slice(0, -1),
          utilities: prev.expenses.utilities.slice(0, -1),
          upkeep: prev.expenses.upkeep.slice(0, -1)
        }
      }));
    }
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
            Stadium Details & ESG Settings
          </CardTitle>
          <CardDescription>
            Configure stadium information and ESG sustainability factors for comprehensive valuation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stadium-name">Stadium Name</Label>
              <Input
                id="stadium-name"
                value={inputs.stadium_name}
                onChange={(e) => handleInputChange('stadium_name', e.target.value)}
                placeholder="Enter stadium name"
              />
            </div>
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
          </div>

          <Separator />

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

      {/* Forecast Period Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Forecast Period
            </div>
            <Badge variant="secondary">{inputs.forecast_years} Years</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeForecastYear}
              disabled={inputs.forecast_years <= 3}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Year
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addForecastYear}
              disabled={inputs.forecast_years >= 15}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Year
            </Button>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="space-y-2">
                <Label>Discount Rate: {formatPercentage(inputs.discount_rate)}</Label>
                <Slider
                  value={[inputs.discount_rate]}
                  onValueChange={([value]) => handleInputChange('discount_rate', value)}
                  max={0.15}
                  min={0.03}
                  step={0.001}
                />
              </div>
              <div className="space-y-2">
                <Label>Terminal Growth Rate: {formatPercentage(inputs.terminal_growth_rate)}</Label>
                <Slider
                  value={[inputs.terminal_growth_rate]}
                  onValueChange={([value]) => handleInputChange('terminal_growth_rate', value)}
                  max={0.05}
                  min={0.01}
                  step={0.001}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Forecasts
          </CardTitle>
          <CardDescription>
            Project annual revenue streams across all forecast years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ticket Sales */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ticket Sales Revenue
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.revenue.ticket_sales.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleRevenueChange('ticket_sales', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sponsorships */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Sponsorship Revenue
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.revenue.sponsorships.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleRevenueChange('sponsorships', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Broadcasting Rights */}
          <div className="space-y-3">
            <h4 className="font-semibold">Broadcasting Rights Revenue</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.revenue.broadcasting_rights.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleRevenueChange('broadcasting_rights', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Concessions */}
          <div className="space-y-3">
            <h4 className="font-semibold">Concessions Revenue</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.revenue.concessions.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleRevenueChange('concessions', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Luxury Suites */}
          <div className="space-y-3">
            <h4 className="font-semibold">Luxury Suites Revenue</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.revenue.luxury_suites.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleRevenueChange('luxury_suites', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Operating Expenses Forecasts
          </CardTitle>
          <CardDescription>
            Project annual operating expenses across all categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Maintenance */}
          <div className="space-y-3">
            <h4 className="font-semibold">Maintenance Costs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.expenses.maintenance.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleExpenseChange('maintenance', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Staffing */}
          <div className="space-y-3">
            <h4 className="font-semibold">Staffing Costs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.expenses.staffing.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleExpenseChange('staffing', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Security */}
          <div className="space-y-3">
            <h4 className="font-semibold">Security Costs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.expenses.security.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleExpenseChange('security', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Utilities */}
          <div className="space-y-3">
            <h4 className="font-semibold">Utilities Costs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.expenses.utilities.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleExpenseChange('utilities', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Upkeep */}
          <div className="space-y-3">
            <h4 className="font-semibold">Upkeep & Miscellaneous</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {inputs.expenses.upkeep.map((value, year) => (
                <div key={year} className="space-y-1">
                  <Label className="text-xs">Year {year + 1}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleExpenseChange('upkeep', year, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        <MapPin className="h-4 w-4 mr-2" />
        Calculate Comprehensive Stadium Valuation
      </Button>
    </form>
  );
};
