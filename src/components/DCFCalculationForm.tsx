import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Plus, X, TrendingUp } from "lucide-react";
import { DCFData } from "@/utils/dcfCalculations";

interface DCFCalculationFormProps {
  onSubmit: (data: DCFData) => void;
}

export function DCFCalculationForm({ onSubmit }: DCFCalculationFormProps) {
  const [formData, setFormData] = useState({
    propertyName: "",
    initialInvestment: 0,
    cashFlows: [0, 0, 0, 0, 0], // Default 5 years
    discountRate: 0.08, // 8% default
    terminalValue: 0,
    analysisDate: new Date().toISOString().split('T')[0],
    growthRate: 0.02, // 2% default
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCashFlow = (index: number, value: number) => {
    const newCashFlows = [...formData.cashFlows];
    newCashFlows[index] = value;
    setFormData(prev => ({ ...prev, cashFlows: newCashFlows }));
  };

  const addCashFlowPeriod = () => {
    setFormData(prev => ({
      ...prev,
      cashFlows: [...prev.cashFlows, 0]
    }));
  };

  const removeCashFlowPeriod = (index: number) => {
    if (formData.cashFlows.length > 1) {
      const newCashFlows = formData.cashFlows.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, cashFlows: newCashFlows }));
    }
  };

  const calculateTerminalValue = () => {
    if (formData.cashFlows.length > 0 && formData.growthRate < formData.discountRate) {
      const finalYearCashFlow = formData.cashFlows[formData.cashFlows.length - 1];
      const terminalValue = (finalYearCashFlow * (1 + formData.growthRate)) / (formData.discountRate - formData.growthRate);
      updateField("terminalValue", Math.round(terminalValue));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Discounted Cash Flow (DCF) Analysis
        </CardTitle>
        <p className="text-muted-foreground">
          Calculate Net Present Value (NPV), Internal Rate of Return (IRR), and comprehensive cash flow analysis.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="propertyName">Property/Investment Name</Label>
              <Input
                id="propertyName"
                value={formData.propertyName}
                onChange={(e) => updateField("propertyName", e.target.value)}
                placeholder="Enter property or investment name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="analysisDate">Analysis Date</Label>
              <Input
                id="analysisDate"
                type="date"
                value={formData.analysisDate}
                onChange={(e) => updateField("analysisDate", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
              <Input
                id="initialInvestment"
                type="number"
                min="0"
                step="1000"
                value={formData.initialInvestment}
                onChange={(e) => updateField("initialInvestment", parseFloat(e.target.value) || 0)}
                placeholder="Enter initial investment amount"
                required
              />
            </div>
          </div>

          {/* DCF Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="discountRate">Discount Rate (%)</Label>
              <Input
                id="discountRate"
                type="number"
                min="0"
                max="1"
                step="0.001"
                value={formData.discountRate}
                onChange={(e) => updateField("discountRate", parseFloat(e.target.value) || 0)}
                placeholder="e.g., 0.08 for 8%"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter as decimal (e.g., 0.08 for 8%)
              </p>
            </div>
            
            <div>
              <Label htmlFor="growthRate">Terminal Growth Rate (%)</Label>
              <Input
                id="growthRate"
                type="number"
                min="0"
                max="0.1"
                step="0.001"
                value={formData.growthRate}
                onChange={(e) => updateField("growthRate", parseFloat(e.target.value) || 0)}
                placeholder="e.g., 0.02 for 2%"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Long-term growth assumption
              </p>
            </div>
            
            <div>
              <Label htmlFor="terminalValue">Terminal Value ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="terminalValue"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.terminalValue}
                  onChange={(e) => updateField("terminalValue", parseFloat(e.target.value) || 0)}
                  placeholder="Optional"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={calculateTerminalValue}
                  className="shrink-0"
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click calculator to auto-calculate
              </p>
            </div>
          </div>

          {/* Cash Flow Projections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-primary">Cash Flow Projections</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCashFlowPeriod}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Period
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {formData.cashFlows.map((cashFlow, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Label className="font-medium">Year {index + 1}</Label>
                    </div>
                    <div className="flex-grow">
                      <Label htmlFor={`cashFlow${index}`}>Cash Flow ($)</Label>
                      <Input
                        id={`cashFlow${index}`}
                        type="number"
                        step="1000"
                        value={cashFlow}
                        onChange={(e) => updateCashFlow(index, parseFloat(e.target.value) || 0)}
                        placeholder="Enter expected cash flow"
                        required
                      />
                    </div>
                    {formData.cashFlows.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCashFlowPeriod(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                    <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                      <div>Period: {index + 1}</div>
                      <div>Present Value: ${(cashFlow / Math.pow(1 + formData.discountRate, index + 1)).toLocaleString()}</div>
                      <div>Discount Factor: {(1 / Math.pow(1 + formData.discountRate, index + 1)).toFixed(4)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-primary">Total Cash Flows:</p>
                  <p className="text-lg font-semibold">${formData.cashFlows.reduce((sum, cf) => sum + cf, 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Analysis Period:</p>
                  <p className="text-lg font-semibold">{formData.cashFlows.length} years</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Average Annual CF:</p>
                  <p className="text-lg font-semibold">
                    ${(formData.cashFlows.reduce((sum, cf) => sum + cf, 0) / formData.cashFlows.length).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <TrendingUp className="h-5 w-5 mr-2" />
            Calculate DCF Analysis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}