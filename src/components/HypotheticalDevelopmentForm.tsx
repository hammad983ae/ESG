import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, DollarSign, TrendingUp, Clock, Leaf } from 'lucide-react';
import { HypotheticalDevelopmentParams } from '@/utils/hypotheticalDevelopmentCalculations';

interface HypotheticalDevelopmentFormProps {
  onSubmit: (params: HypotheticalDevelopmentParams, approach: 'conventional' | 'esd') => void;
}

export function HypotheticalDevelopmentForm({ onSubmit }: HypotheticalDevelopmentFormProps) {
  const [formData, setFormData] = useState({
    gross_income_per_sqm: '',
    net_outgoings_per_sqm: '',
    total_area_sqm: '',
    cap_rate: '',
    building_cost: '',
    professional_fees: '',
    land_cost: '',
    marketing_cost: '',
    developer_profit_rate: '',
    interest_rate: '',
    construction_period_months: ''
  });

  const [approach, setApproach] = useState<'conventional' | 'esd'>('conventional');

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
      building_cost: parseFloat(formData.building_cost),
      professional_fees: parseFloat(formData.professional_fees),
      land_cost: parseFloat(formData.land_cost),
      marketing_cost: parseFloat(formData.marketing_cost),
      developer_profit_rate: parseFloat(formData.developer_profit_rate) / 100,
      interest_rate: parseFloat(formData.interest_rate) / 100,
      construction_period_months: parseInt(formData.construction_period_months)
    };

    onSubmit(params, approach);
  };

  const getDefaultValues = (selectedApproach: 'conventional' | 'esd') => {
    if (selectedApproach === 'esd') {
      // ESD typically has lower interest rates and profit margins
      setFormData(prev => ({
        ...prev,
        interest_rate: prev.interest_rate || '7.0', // Lower interest rate for ESD
        developer_profit_rate: prev.developer_profit_rate || '15.0' // Lower profit margin for ESD
      }));
    } else {
      // Conventional development
      setFormData(prev => ({
        ...prev,
        interest_rate: prev.interest_rate || '8.0', // Higher interest rate for conventional
        developer_profit_rate: prev.developer_profit_rate || '20.0' // Higher profit margin for conventional
      }));
    }
  };

  const handleApproachChange = (newApproach: 'conventional' | 'esd') => {
    setApproach(newApproach);
    getDefaultValues(newApproach);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Approach</CardTitle>
          <CardDescription>
            Select the development approach: Conventional or Environmentally Sustainable Development (ESD)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={approach} onValueChange={(value: string) => handleApproachChange(value as 'conventional' | 'esd')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conventional" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Conventional
              </TabsTrigger>
              <TabsTrigger value="esd" className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                ESD Development
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conventional" className="mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Conventional development with standard market rates for interest and profit margins.
                  Typically higher risk profile with corresponding returns.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="esd" className="mt-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Environmentally Sustainable Development with lower interest rates and profit margins 
                  due to reduced risk profile and sustainability incentives.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
            Development Costs
          </CardTitle>
          <CardDescription>
            Enter all development-related costs for the project
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
            Set profit margins, interest rates, and construction timeline
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="developer_profit_rate">Developer Profit Rate (%)</Label>
            <Input
              id="developer_profit_rate"
              type="number"
              step="0.01"
              value={formData.developer_profit_rate}
              onChange={(e) => handleInputChange('developer_profit_rate', e.target.value)}
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
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Calculate {approach === 'esd' ? 'ESD' : 'Conventional'} Development Value
      </Button>
    </form>
  );
}