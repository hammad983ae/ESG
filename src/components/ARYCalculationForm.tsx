import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Info, TrendingUp } from "lucide-react";
import { ARYInputs, validateARYInputs, getCurrentCashRate } from "@/utils/aryCalculations";

interface ARYCalculationFormProps {
  onSubmit: (inputs: ARYInputs) => void;
}

export const ARYCalculationForm = ({ onSubmit }: ARYCalculationFormProps) => {
  const [inputs, setInputs] = useState<Partial<ARYInputs>>({
    cashRate: getCurrentCashRate(),
    propertyType: undefined,
    annualRentalIncome: undefined,
    propertyValue: undefined,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleInputChange = (field: keyof ARYInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateARYInputs(inputs);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convert to complete ARYInputs object
    const completeInputs: ARYInputs = {
      cashRate: inputs.cashRate!,
      propertyType: inputs.propertyType as 'Commercial' | 'Residential',
      annualRentalIncome: inputs.annualRentalIncome,
      propertyValue: inputs.propertyValue,
    };

    onSubmit(completeInputs);
  };

  const loadCurrentCashRate = () => {
    const currentRate = getCurrentCashRate();
    setInputs(prev => ({ ...prev, cashRate: currentRate }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          All Risks Yield (ARY) Calculator
        </CardTitle>
        <CardDescription>
          Calculate ARY using dynamic risk-free rate and comprehensive risk assessment framework
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="required" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="required">Required Inputs</TabsTrigger>
            <TabsTrigger value="optional">Optional (Yield Comparison)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="required" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The ARY calculation uses fixed risk premia based on property type and a dynamic cash rate as the risk-free rate.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cashRate">Australian Cash Rate</Label>
                <div className="flex gap-2">
                  <Input
                    id="cashRate"
                    type="number"
                    step="0.0001"
                    placeholder="e.g., 0.0425 for 4.25%"
                    value={inputs.cashRate || ''}
                    onChange={(e) => handleInputChange('cashRate', parseFloat(e.target.value) || 0)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadCurrentCashRate}
                    className="whitespace-nowrap"
                  >
                    Current Rate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter as decimal (e.g., 0.0425 for 4.25%)
                </p>
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Different risk factors apply to each property type
                </p>
              </div>
            </div>

            {inputs.cashRate && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Risk-Free Rate:</strong> {(inputs.cashRate * 100).toFixed(3)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  This forms the base rate for the ARY calculation
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optional" className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Optional: Enter rental income and property value to compare with yield-based ARY calculation.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualRentalIncome">Annual Rental Income ($)</Label>
                <Input
                  id="annualRentalIncome"
                  type="number"
                  placeholder="e.g., 120000"
                  value={inputs.annualRentalIncome || ''}
                  onChange={(e) => handleInputChange('annualRentalIncome', parseFloat(e.target.value) || undefined)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Gross annual rental income
                </p>
              </div>

              <div>
                <Label htmlFor="propertyValue">Property Value ($)</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  placeholder="e.g., 2000000"
                  value={inputs.propertyValue || ''}
                  onChange={(e) => handleInputChange('propertyValue', parseFloat(e.target.value) || undefined)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current market value of property
                </p>
              </div>
            </div>

            {inputs.annualRentalIncome && inputs.propertyValue && inputs.propertyValue > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Yield-Based ARY Preview:</strong> {((inputs.annualRentalIncome / inputs.propertyValue) * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Formula: (Annual Rental Income ÷ Property Value) × 100
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {errors.length > 0 && (
          <Alert className="mt-4">
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Calculate All Risks Yield
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};