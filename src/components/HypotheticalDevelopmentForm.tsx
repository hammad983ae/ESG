import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { HypotheticalDevelopmentParams } from '@/utils/hypotheticalDevelopmentCalculations';

interface HypotheticalDevelopmentFormProps {
  onSubmit: (params: HypotheticalDevelopmentParams, riskFactor: number) => void;
}

export function HypotheticalDevelopmentForm({ onSubmit }: HypotheticalDevelopmentFormProps) {
  const [formData, setFormData] = useState({
    gross_income_per_sqm: '',
    net_outgoings_per_sqm: '',
    total_area_sqm: '',
    cap_rate: '',
    building_cost: '',
    financing_cost: '',
    professional_fees: '',
    land_cost: '',
    marketing_cost: '',
    profit_margin: '',
    interest_rate: '',
    construction_period_months: '',
    risk_factor: '1.0'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: HypotheticalDevelopmentParams = {
      gross_income_per_sqm: parseFloat(formData.gross_income_per_sqm),
      net_outgoings_per_sqm: parseFloat(formData.net_outgoings_per_sqm),
      total_area_sqm: parseFloat(formData.total_area_sqm),
      cap_rate: parseFloat(formData.cap_rate) / 100,
      project_costs: {
        building: parseFloat(formData.building_cost),
        financing: parseFloat(formData.financing_cost),
        professional_fees: parseFloat(formData.professional_fees),
        land: parseFloat(formData.land_cost),
        marketing: parseFloat(formData.marketing_cost)
      },
      profit_margin: parseFloat(formData.profit_margin) / 100,
      interest_rate: parseFloat(formData.interest_rate) / 100,
      construction_period_months: parseInt(formData.construction_period_months)
    };

    const riskFactor = parseFloat(formData.risk_factor);
    onSubmit(params, riskFactor);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Property Details
          </CardTitle>
          <CardDescription>
            Enter the basic property and income parameters for the development
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gross_income_per_sqm">Gross Income per sqm ($/sqm/year)</Label>
            <Input
              id="gross_income_per_sqm"
              type="number"
              step="0.01"
              value={formData.gross_income_per_sqm}
              onChange={(e) => handleInputChange('gross_income_per_sqm', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="net_outgoings_per_sqm">Net Outgoings per sqm ($/sqm/year)</Label>
            <Input
              id="net_outgoings_per_sqm"
              type="number"
              step="0.01"
              value={formData.net_outgoings_per_sqm}
              onChange={(e) => handleInputChange('net_outgoings_per_sqm', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_area_sqm">Total Area (sqm)</Label>
            <Input
              id="total_area_sqm"
              type="number"
              step="0.01"
              value={formData.total_area_sqm}
              onChange={(e) => handleInputChange('total_area_sqm', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cap_rate">Capitalization Rate (%)</Label>
            <Input
              id="cap_rate"
              type="number"
              step="0.01"
              value={formData.cap_rate}
              onChange={(e) => handleInputChange('cap_rate', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Project Costs
          </CardTitle>
          <CardDescription>
            Enter all project-related costs for the development
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="building_cost">Building Cost ($)</Label>
            <Input
              id="building_cost"
              type="number"
              step="0.01"
              value={formData.building_cost}
              onChange={(e) => handleInputChange('building_cost', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="financing_cost">Financing Cost ($)</Label>
            <Input
              id="financing_cost"
              type="number"
              step="0.01"
              value={formData.financing_cost}
              onChange={(e) => handleInputChange('financing_cost', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professional_fees">Professional Fees ($)</Label>
            <Input
              id="professional_fees"
              type="number"
              step="0.01"
              value={formData.professional_fees}
              onChange={(e) => handleInputChange('professional_fees', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="land_cost">Land Cost ($)</Label>
            <Input
              id="land_cost"
              type="number"
              step="0.01"
              value={formData.land_cost}
              onChange={(e) => handleInputChange('land_cost', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketing_cost">Marketing Cost ($)</Label>
            <Input
              id="marketing_cost"
              type="number"
              step="0.01"
              value={formData.marketing_cost}
              onChange={(e) => handleInputChange('marketing_cost', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Financial Parameters
          </CardTitle>
          <CardDescription>
            Set profit margins, interest rates, and risk adjustments
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profit_margin">Profit Margin (%)</Label>
            <Input
              id="profit_margin"
              type="number"
              step="0.01"
              value={formData.profit_margin}
              onChange={(e) => handleInputChange('profit_margin', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest_rate">Interest Rate (%)</Label>
            <Input
              id="interest_rate"
              type="number"
              step="0.01"
              value={formData.interest_rate}
              onChange={(e) => handleInputChange('interest_rate', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="construction_period_months">Construction Period (months)</Label>
            <Input
              id="construction_period_months"
              type="number"
              value={formData.construction_period_months}
              onChange={(e) => handleInputChange('construction_period_months', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk_factor">Risk Factor</Label>
            <Input
              id="risk_factor"
              type="number"
              step="0.01"
              value={formData.risk_factor}
              onChange={(e) => handleInputChange('risk_factor', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Calculate Hypothetical Development Value
      </Button>
    </form>
  );
}