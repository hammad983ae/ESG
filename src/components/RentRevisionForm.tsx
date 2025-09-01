/**
 * Sustaino Pro - ESG Property Assessment Platform - Rent Revision System
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Comprehensive rent revision system with property-specific terminology
 * and market analysis for all commercial property types
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Baby, 
  ShoppingCart, 
  Warehouse, 
  Tractor, 
  Hotel, 
  Users, 
  Fuel, 
  MapPin, 
  Heart,
  Home,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  Calculator
} from "lucide-react";
import { RentRevisionInputs, PropertyTypeConfig, defaultRentRevisionInputs, sampleRentRevisionData } from "@/utils/rentRevisionCalculations";

interface RentRevisionFormProps {
  onSubmit: (inputs: RentRevisionInputs) => void;
}

export const RentRevisionForm: React.FC<RentRevisionFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<RentRevisionInputs>(defaultRentRevisionInputs);

  const propertyTypeConfigs: Record<string, PropertyTypeConfig> = {
    childcare: {
      name: "Childcare Facilities",
      icon: Baby,
      unit: "per LDC placement",
      terminology: "LDC Placement Rate",
      description: "Long Day Childcare placement rental rates",
      marketRange: "$2,500 - $4,500 per placement annually",
      benchmarkSources: "Industry childcare operators"
    },
    office: {
      name: "Office Buildings",
      icon: Building2,
      unit: "per sqm",
      terminology: "Office Rent per sqm",
      description: "Net Lettable Area (NLA) rental rates",
      marketRange: "$200 - $800 per sqm annually",
      benchmarkSources: "CBD and suburban office markets"
    },
    retail: {
      name: "Retail Properties",
      icon: ShoppingCart,
      unit: "per sqm",
      terminology: "Retail Rent per sqm",
      description: "Ground Floor Retail (GFR) rental rates",
      marketRange: "$300 - $2,000 per sqm annually",
      benchmarkSources: "Shopping centers and strip retail"
    },
    warehouse: {
      name: "Industrial/Warehouse",
      icon: Warehouse,
      unit: "per sqm",
      terminology: "Warehouse Rent per sqm",
      description: "Gross Lettable Area (GLA) industrial rates",
      marketRange: "$80 - $200 per sqm annually",
      benchmarkSources: "Industrial estates and logistics hubs"
    },
    agricultural: {
      name: "Farming/Agricultural",
      icon: Tractor,
      unit: "per hectare",
      terminology: "Agricultural Rent per ha",
      description: "Arable land and farming property rates",
      marketRange: "$200 - $2,000 per hectare annually",
      benchmarkSources: "Rural land sales and agricultural leases"
    },
    hospitality: {
      name: "Hotels/Motels",
      icon: Hotel,
      unit: "per room/key",
      terminology: "Room Rate/Key Rate",
      description: "Hotel accommodation rental rates",
      marketRange: "$15,000 - $80,000 per room annually",
      benchmarkSources: "Hotel operators and accommodation providers"
    },
    retirement: {
      name: "Retirement Villages",
      icon: Users,
      unit: "per unit",
      terminology: "Village Unit Rate",
      description: "Independent living unit rental rates",
      marketRange: "$300 - $800 per week per unit",
      benchmarkSources: "Aged care and retirement operators"
    },
    petrol: {
      name: "Petrol Stations",
      icon: Fuel,
      unit: "per site",
      terminology: "Service Station Site Rate",
      description: "Fuel retail site rental rates",
      marketRange: "$200,000 - $800,000 per site annually",
      benchmarkSources: "Major fuel retailers and service station operators"
    },
    stadium: {
      name: "Sports Venues",
      icon: MapPin,
      unit: "per seat",
      terminology: "Stadium Seat Rate",
      description: "Sports facility seating rental rates",
      marketRange: "$50 - $300 per seat annually",
      benchmarkSources: "Sports venue operators and event management"
    },
    healthcare: {
      name: "Healthcare Facilities",
      icon: Heart,
      unit: "per bed/room",
      terminology: "Medical Facility Rate",
      description: "Healthcare accommodation rates",
      marketRange: "$400 - $1,200 per sqm annually",
      benchmarkSources: "Healthcare providers and medical centers"
    },
    residential: {
      name: "Residential Properties",
      icon: Home,
      unit: "per week",
      terminology: "Residential Rent per week",
      description: "Residential accommodation rates",
      marketRange: "$300 - $1,500 per week",
      benchmarkSources: "Residential rental market data"
    }
  };

  const handleInputChange = <K extends keyof RentRevisionInputs>(field: K, value: RentRevisionInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const handleLoadSampleData = () => {
    const sampleData = sampleRentRevisionData[inputs.property_type];
    if (sampleData) {
      setInputs(sampleData);
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const currentConfig = propertyTypeConfigs[inputs.property_type];
  const IconComponent = currentConfig?.icon || Building2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Professional Rent Revision Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive rent revision with property-specific terminology and NET BASIS calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select
              value={inputs.property_type}
              onValueChange={(value) => handleInputChange('property_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(propertyTypeConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-4 w-4" />
                      {config.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentConfig && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{currentConfig.terminology}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{currentConfig.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">
                  Unit: {currentConfig.unit}
                </Badge>
                <Badge variant="outline">
                  Range: {currentConfig.marketRange}
                </Badge>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleLoadSampleData}
                className="w-full"
              >
                Load Sample Data for {currentConfig.name}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tenant and Lease Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lease Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lessor">Lessor</Label>
              <Input
                id="lessor"
                value={inputs.lessor}
                onChange={(e) => handleInputChange('lessor', e.target.value)}
                placeholder="Enter lessor name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessee">Lessee (Tenant)</Label>
              <Input
                id="lessee"
                value={inputs.lessee}
                onChange={(e) => handleInputChange('lessee', e.target.value)}
                placeholder="Enter lessee/tenant name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commencement-date">Commencement Date</Label>
              <Input
                id="commencement-date"
                type="date"
                value={inputs.commencement_date}
                onChange={(e) => handleInputChange('commencement_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiring-date">Expiring Date</Label>
              <Input
                id="expiring-date"
                type="date"
                value={inputs.expiring_date}
                onChange={(e) => handleInputChange('expiring_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-date">Review Date</Label>
              <Input
                id="review-date"
                type="date"
                value={inputs.review_date}
                onChange={(e) => handleInputChange('review_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revision-effective-date">Revision Effective Date</Label>
              <Input
                id="revision-effective-date"
                type="date"
                value={inputs.revision_effective_date}
                onChange={(e) => handleInputChange('revision_effective_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="options-further-terms">Options/Further Terms</Label>
            <Textarea
              id="options-further-terms"
              value={inputs.options_further_terms}
              onChange={(e) => handleInputChange('options_further_terms', e.target.value)}
              placeholder="Detail lease options and further terms..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rent Components (NET BASIS) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Rent Components (NET BASIS)
          </CardTitle>
          <CardDescription>
            All rent calculations on NET basis - excluding outgoings and land tax
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="face-rent">Face Rent ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="face-rent"
                type="number"
                value={inputs.face_rent}
                onChange={(e) => handleInputChange('face_rent', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="face-rent-total">Face Rent Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.face_rent * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="effective-rent">Effective Rent ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="effective-rent"
                type="number"
                value={inputs.effective_rent}
                onChange={(e) => handleInputChange('effective_rent', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effective-rent-total">Effective Rent Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.effective_rent * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gross-rent">Gross Rent ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="gross-rent"
                type="number"
                value={inputs.gross_rent}
                onChange={(e) => handleInputChange('gross_rent', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gross-rent-total">Gross Rent Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.gross_rent * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="net-rent">Net Rent ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="net-rent"
                type="number"
                value={inputs.net_rent}
                onChange={(e) => handleInputChange('net_rent', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="net-rent-total">Net Rent Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.net_rent * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incentives">Incentives ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="incentives"
                type="number"
                value={inputs.incentives}
                onChange={(e) => handleInputChange('incentives', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incentives-total">Incentives Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.incentives * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outgoings">Outgoings ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="outgoings"
                type="number"
                value={inputs.outgoings}
                onChange={(e) => handleInputChange('outgoings', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outgoings-total">Outgoings Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.outgoings * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="land-tax">Land Tax ({currentConfig?.unit || 'per unit'})</Label>
              <Input
                id="land-tax"
                type="number"
                value={inputs.land_tax}
                onChange={(e) => handleInputChange('land_tax', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="land-tax-total">Land Tax Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.land_tax * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outgoings-per-sqm">Outgoings per sqm</Label>
              <Input
                id="outgoings-per-sqm"
                type="number"
                step="0.01"
                value={inputs.outgoings_per_sqm}
                onChange={(e) => handleInputChange('outgoings_per_sqm', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outgoings-per-sqm-total">Outgoings per sqm Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.outgoings_per_sqm * inputs.lettable_area)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Area Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lettable-area">
                {inputs.property_type === 'agricultural' ? 'Area (hectares)' :
                 inputs.property_type === 'childcare' ? 'Number of LDC Placements' :
                 inputs.property_type === 'hospitality' ? 'Number of Rooms/Keys' :
                 inputs.property_type === 'petrol' ? 'Site Count' :
                 inputs.property_type === 'stadium' ? 'Number of Seats' :
                 inputs.property_type === 'retirement' ? 'Number of Units' :
                 inputs.property_type === 'healthcare' ? 'Beds/Treatment Rooms' :
                 'Lettable Area (sqm)'}
              </Label>
              <Input
                id="lettable-area"
                type="number"
                value={inputs.lettable_area}
                onChange={(e) => handleInputChange('lettable_area', parseFloat(e.target.value) || 0)}
                placeholder="Enter area/quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="land-area">Land Area (sqm)</Label>
              <Input
                id="land-area"
                type="number"
                value={inputs.land_area}
                onChange={(e) => handleInputChange('land_area', parseFloat(e.target.value) || 0)}
                placeholder="Enter land area"
              />
            </div>
          </div>

          {/* Include/Exclude Toggles for Current Lease */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-current-rent-analysis"
                checked={inputs.include_rent_analysis}
                onCheckedChange={(checked) => handleInputChange('include_rent_analysis', checked)}
              />
              <Label htmlFor="include-current-rent-analysis">Include Current Rent Analysis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-current-land-analysis"
                checked={inputs.include_land_analysis}
                onCheckedChange={(checked) => handleInputChange('include_land_analysis', checked)}
              />
              <Label htmlFor="include-current-land-analysis">Include Current Land Analysis</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="improved-rent-rate-per-sqm">Improved Rent Rate (per sqm)</Label>
            <Input
              id="improved-rent-rate-per-sqm"
              type="number"
              step="0.01"
              value={inputs.improved_rent_rate_per_sqm}
              onChange={(e) => handleInputChange('improved_rent_rate_per_sqm', parseFloat(e.target.value) || 0)}
              placeholder="Enter improved rent rate"
            />
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis & Proposed Revision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Market Analysis & Proposed Revision
          </CardTitle>
          <CardDescription>
            Market-based rent revision with comparable evidence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Market Rent Section - Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="market-rent">
                Market Rent ({currentConfig?.unit || 'per unit'})
              </Label>
              <Input
                id="market-rent"
                type="number"
                value={inputs.market_rent}
                onChange={(e) => handleInputChange('market_rent', parseFloat(e.target.value) || 0)}
                placeholder="Enter market rent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="market-rent-overall">Market Rent Overall</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.market_rent * inputs.lettable_area)}
              </div>
            </div>
          </div>

          {/* Include/Exclude Toggles for Land Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-land-analysis"
                checked={inputs.include_land_analysis}
                onCheckedChange={(checked) => handleInputChange('include_land_analysis', checked)}
              />
              <Label htmlFor="include-land-analysis">Include Land Rate Analysis</Label>
            </div>
          </div>

          {/* Proposed Land Rate Section - Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proposed-land-rate">Proposed Improved Land Rate (per sqm)</Label>
              <Input
                id="proposed-land-rate"
                type="number"
                step="0.01"
                value={inputs.proposed_improved_land_rate}
                onChange={(e) => handleInputChange('proposed_improved_land_rate', parseFloat(e.target.value) || 0)}
                placeholder="Enter proposed land rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="improved-land-rate-overall">Improved Land Rate Overall</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.proposed_improved_land_rate * inputs.land_area)}
              </div>
            </div>
          </div>

          {/* Additional Market Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="proposed-rent">
                Proposed Rent ({currentConfig?.unit || 'per unit'})
              </Label>
              <Input
                id="proposed-rent"
                type="number"
                value={inputs.proposed_rent}
                onChange={(e) => handleInputChange('proposed_rent', parseFloat(e.target.value) || 0)}
                placeholder="Enter proposed rent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposed-rent-total">Proposed Rent Total</Label>
              <div className="p-3 bg-muted/50 rounded-md text-lg font-semibold">
                {formatCurrency(inputs.proposed_rent * inputs.lettable_area)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpi-fixed-adjustments">CPI or Fixed Adjustments (%)</Label>
              <Input
                id="cpi-fixed-adjustments"
                type="number"
                step="0.1"
                value={inputs.cpi_fixed_adjustments}
                onChange={(e) => handleInputChange('cpi_fixed_adjustments', parseFloat(e.target.value) || 0)}
                placeholder="3.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comparable-evidence">Comparable Evidence</Label>
            <Textarea
              id="comparable-evidence"
              value={inputs.comparable_evidence}
              onChange={(e) => handleInputChange('comparable_evidence', e.target.value)}
              placeholder="Detail comparable rental evidence supporting the proposed revision..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market-conditions">Market Conditions</Label>
            <Textarea
              id="market-conditions"
              value={inputs.market_conditions}
              onChange={(e) => handleInputChange('market_conditions', e.target.value)}
              placeholder="Describe current market conditions affecting rental rates..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="include-esg"
              checked={inputs.include_esg_factors}
              onCheckedChange={(checked) => handleInputChange('include_esg_factors', checked)}
            />
            <Label htmlFor="include-esg">Include ESG Sustainability Factors</Label>
          </div>

          {inputs.include_esg_factors && (
            <div className="space-y-2">
              <Label htmlFor="esg-notes">ESG Sustainability Considerations</Label>
              <Textarea
                id="esg-notes"
                value={inputs.esg_notes}
                onChange={(e) => handleInputChange('esg_notes', e.target.value)}
                placeholder="Detail how sustainability and ESG factors influence rental value..."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Calculations */}
      {inputs.net_rent > 0 && inputs.proposed_rent > 0 && inputs.lettable_area > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revision Summary (NET BASIS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(inputs.net_rent * inputs.lettable_area)}
                </div>
                <div className="text-sm text-muted-foreground">Current Net Annual Rent</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(inputs.proposed_rent * inputs.lettable_area)}
                </div>
                <div className="text-sm text-muted-foreground">Proposed Annual Rent</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {(((inputs.proposed_rent - inputs.net_rent) / inputs.net_rent) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Rent Increase</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" size="lg" className="w-full">
        <TrendingUp className="h-4 w-4 mr-2" />
        Generate Professional Rent Revision Report
      </Button>
    </form>
  );
};