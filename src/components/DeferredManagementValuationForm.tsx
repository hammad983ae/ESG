import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Users, Building, TrendingUp } from "lucide-react";
import { DeferredManagementInputs } from "@/utils/deferredManagementCalculations";

interface DeferredManagementValuationFormProps {
  onSubmit: (data: DeferredManagementInputs) => void;
}

export function DeferredManagementValuationForm({ onSubmit }: DeferredManagementValuationFormProps) {
  const [formData, setFormData] = useState<DeferredManagementInputs>({
    propertyName: "",
    currentValue: 0,
    deferralPeriod: 0,
    discountRate: 0.08,
    futureCashFlows: [0, 0, 0, 0, 0],
    managementType: 'deferred-management',
    villageUnits: 100,
    occupancyRate: 95,
    averageAge: 78,
    turnoverRate: 12,
    analysisDate: new Date().toISOString().split('T')[0],
    deferredManagementFeeRate: 25,
    averageUnitValue: 500000,
    expectedAnnualTurnover: 12,
    managementRightsType: 'lease',
    remainingTerm: 25,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof DeferredManagementInputs, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCashFlow = (index: number, value: number) => {
    const newCashFlows = [...formData.futureCashFlows];
    newCashFlows[index] = value;
    setFormData(prev => ({ ...prev, futureCashFlows: newCashFlows }));
  };

  const addCashFlowPeriod = () => {
    setFormData(prev => ({
      ...prev,
      futureCashFlows: [...prev.futureCashFlows, 0]
    }));
  };

  const removeCashFlowPeriod = (index: number) => {
    if (formData.futureCashFlows.length > 1) {
      const newCashFlows = formData.futureCashFlows.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, futureCashFlows: newCashFlows }));
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Users className="h-6 w-6" />
          Deferred Management Fee - Retirement Villages
        </CardTitle>
        <p className="text-muted-foreground">
          Specialized valuation methodology for retirement village management rights with deferred cash flow analysis.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Property Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="propertyName">Retirement Village Name</Label>
                <Input
                  id="propertyName"
                  value={formData.propertyName}
                  onChange={(e) => updateField("propertyName", e.target.value)}
                  placeholder="Enter retirement village name"
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
            </div>
          </div>

          {/* Management Rights Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Management Rights Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="managementType">Management Type</Label>
                <Select 
                  value={formData.managementType} 
                  onValueChange={(value: any) => updateField("managementType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrance-fees">Entrance Fees</SelectItem>
                    <SelectItem value="ongoing-fees">Ongoing Fees</SelectItem>
                    <SelectItem value="deferred-management">Deferred Management Fees</SelectItem>
                    <SelectItem value="combined">Combined Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="managementRightsType">Rights Type</Label>
                <Select 
                  value={formData.managementRightsType} 
                  onValueChange={(value: any) => updateField("managementRightsType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rights type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lease">Leasehold</SelectItem>
                    <SelectItem value="freehold">Freehold</SelectItem>
                    <SelectItem value="license">License Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="remainingTerm">Remaining Term (years)</Label>
                <Input
                  id="remainingTerm"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.remainingTerm}
                  onChange={(e) => updateField("remainingTerm", parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="deferredManagementFeeRate">Deferred Management Fee (%)</Label>
                <Input
                  id="deferredManagementFeeRate"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={formData.deferredManagementFeeRate}
                  onChange={(e) => updateField("deferredManagementFeeRate", parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 25"
                  required
                />
              </div>
            </div>
          </div>

          {/* Village Operations Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Building className="h-5 w-5" />
              Village Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="villageUnits">Total Village Units</Label>
                <Input
                  id="villageUnits"
                  type="number"
                  min="10"
                  value={formData.villageUnits}
                  onChange={(e) => updateField("villageUnits", parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="occupancyRate">Occupancy Rate (%)</Label>
                <Input
                  id="occupancyRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.occupancyRate}
                  onChange={(e) => updateField("occupancyRate", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="turnoverRate">Annual Turnover Rate (%)</Label>
                <Input
                  id="turnoverRate"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={formData.turnoverRate}
                  onChange={(e) => updateField("turnoverRate", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="averageUnitValue">Average Unit Value ($)</Label>
                <Input
                  id="averageUnitValue"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.averageUnitValue}
                  onChange={(e) => updateField("averageUnitValue", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Valuation Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Valuation Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentValue">Current Asset Value ($)</Label>
                <Input
                  id="currentValue"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.currentValue}
                  onChange={(e) => updateField("currentValue", parseFloat(e.target.value) || 0)}
                  placeholder="Current management rights value"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="deferralPeriod">Deferral Period (years)</Label>
                <Input
                  id="deferralPeriod"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.deferralPeriod}
                  onChange={(e) => updateField("deferralPeriod", parseInt(e.target.value) || 0)}
                  placeholder="Years before income starts"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  min="0"
                  max="0.3"
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
            </div>
          </div>

          {/* Future Cash Flow Projections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Future Management Income Projections
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCashFlowPeriod}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Year
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {formData.futureCashFlows.map((cashFlow, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16">
                      <Label className="font-medium">Year {index + 1}</Label>
                    </div>
                    <div className="flex-grow">
                      <Label htmlFor={`cashFlow${index}`}>Management Income ($)</Label>
                      <Input
                        id={`cashFlow${index}`}
                        type="number"
                        step="1000"
                        value={cashFlow}
                        onChange={(e) => updateCashFlow(index, parseFloat(e.target.value) || 0)}
                        placeholder="Expected management income"
                        required
                      />
                    </div>
                    {formData.futureCashFlows.length > 1 && (
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
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs bg-muted/30 p-3 rounded">
                    <div>
                      <span className="text-muted-foreground">Turnover Units:</span>
                      <p className="font-medium">
                        {Math.round((formData.villageUnits * formData.occupancyRate * formData.turnoverRate) / 10000)} units
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Deferred Fees:</span>
                      <p className="font-medium">
                        ${((formData.villageUnits * formData.occupancyRate * formData.turnoverRate * formData.averageUnitValue * formData.deferredManagementFeeRate) / 1000000).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Discount Factor:</span>
                      <p className="font-medium">
                        {(1 / Math.pow(1 + formData.discountRate, index + 1 + formData.deferralPeriod)).toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Present Value:</span>
                      <p className="font-medium">
                        ${(cashFlow / Math.pow(1 + formData.discountRate, index + 1 + formData.deferralPeriod)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-primary">Total Projected Income:</p>
                  <p className="text-lg font-semibold">${formData.futureCashFlows.reduce((sum, cf) => sum + cf, 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Analysis Period:</p>
                  <p className="text-lg font-semibold">{formData.futureCashFlows.length} years</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Occupied Units:</p>
                  <p className="text-lg font-semibold">{Math.round(formData.villageUnits * formData.occupancyRate / 100)} units</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Annual Turnover:</p>
                  <p className="text-lg font-semibold">{Math.round(formData.villageUnits * formData.occupancyRate * formData.turnoverRate / 10000)} units/year</p>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Users className="h-5 w-5 mr-2" />
            Calculate Deferred Management Fee
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}