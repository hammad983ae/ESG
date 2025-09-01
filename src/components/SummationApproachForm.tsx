import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, DollarSign, Plus, Minus, Leaf } from 'lucide-react';
import { SummationInputs, SummationComponent, defaultSummationComponents } from '@/utils/summationCalculations';

interface SummationApproachFormProps {
  onSubmit: (inputs: SummationInputs) => void;
}

export function SummationApproachForm({ onSubmit }: SummationApproachFormProps) {
  const [components, setComponents] = useState<SummationComponent[]>(defaultSummationComponents);
  const [esgFactor, setEsgFactor] = useState<string>('1.0');

  const handleComponentChange = (index: number, field: keyof SummationComponent, value: string | number) => {
    setComponents(prev => prev.map((component, i) => 
      i === index ? { ...component, [field]: value } : component
    ));
  };

  const addComponent = () => {
    setComponents(prev => [...prev, { name: '', area: 0, rate: 0 }]);
  };

  const removeComponent = (index: number) => {
    if (components.length > 1) {
      setComponents(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: SummationInputs = {
      components: components.map(comp => ({
        name: comp.name,
        area: Number(comp.area),
        rate: Number(comp.rate)
      })),
      esg_factor: parseFloat(esgFactor)
    };

    onSubmit(inputs);
  };

  const calculatePreview = () => {
    return components.reduce((total, comp) => total + (comp.area * comp.rate), 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Summation Approach Components
          </CardTitle>
          <CardDescription>
            Enter the area and rate for each property component. The total value will be calculated as the sum of all components.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {components.map((component, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Component Name</Label>
                <Input
                  id={`name-${index}`}
                  value={component.name}
                  onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                  placeholder="e.g., Land Value"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`area-${index}`}>Area (sqm)</Label>
                <Input
                  id={`area-${index}`}
                  type="number"
                  step="0.01"
                  value={component.area}
                  onChange={(e) => handleComponentChange(index, 'area', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`rate-${index}`}>Rate ($/sqm)</Label>
                <Input
                  id={`rate-${index}`}
                  type="number"
                  step="0.01"
                  value={component.rate}
                  onChange={(e) => handleComponentChange(index, 'rate', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeComponent(index)}
                  disabled={components.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                  Value: ${(component.area * component.rate).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addComponent}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
          
          <Separator />
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Base Total Value:</span>
              <span className="text-lg font-semibold text-primary">
                ${calculatePreview().toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            ESG Adjustment Factor
          </CardTitle>
          <CardDescription>
            Apply an Environmental, Social, and Governance (ESG) factor to adjust the final valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="esg_factor">ESG Factor</Label>
              <Input
                id="esg_factor"
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={esgFactor}
                onChange={(e) => setEsgFactor(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                1.0 = No adjustment, &gt;1.0 = Positive ESG impact, &lt;1.0 = Negative ESG impact
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-700 dark:text-green-300">ESG Adjusted Total:</span>
                <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                  ${(calculatePreview() * parseFloat(esgFactor || '1')).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Calculate Summation Valuation
      </Button>
    </form>
  );
}