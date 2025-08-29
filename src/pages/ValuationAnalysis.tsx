import { useState } from "react";
import { ArrowLeft, Calculator, TrendingUp, Building, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ValuationInputs {
  propertyType: string;
  landSize: number;
  buildingSize: number;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  yearBuilt: number;
  location: string;
  marketValue: number;
  rentalIncome: number;
  operatingExpenses: number;
  capRate: number;
  discountRate: number;
  growthRate: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

interface ValuationResults {
  marketValue: number;
  incomeValue: number;
  costValue: number;
  noi: number;
  cashFlow: number;
  roi: number;
  irr: number;
  paybackPeriod: number;
  loanToValue: number;
  debtServiceCoverage: number;
}

export default function ValuationAnalysis() {
  const [inputs, setInputs] = useState<ValuationInputs>({
    propertyType: "",
    landSize: 0,
    buildingSize: 0,
    bedrooms: 0,
    bathrooms: 0,
    carSpaces: 0,
    yearBuilt: 2020,
    location: "",
    marketValue: 0,
    rentalIncome: 0,
    operatingExpenses: 0,
    capRate: 5.0,
    discountRate: 8.0,
    growthRate: 3.0,
    loanAmount: 0,
    interestRate: 6.0,
    loanTerm: 30,
  });

  const [results, setResults] = useState<ValuationResults | null>(null);
  const [activeMethod, setActiveMethod] = useState<string>("market");

  const calculateValuation = () => {
    const {
      marketValue,
      rentalIncome,
      operatingExpenses,
      capRate,
      discountRate,
      growthRate,
      loanAmount,
      interestRate,
      loanTerm,
    } = inputs;

    // Net Operating Income
    const noi = rentalIncome - operatingExpenses;
    
    // Income Approach Valuation
    const incomeValue = noi / (capRate / 100);
    
    // Cost Approach (simplified)
    const costValue = marketValue * 0.9; // Assuming 10% depreciation
    
    // Cash Flow Analysis
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -loanTerm * 12))
      : 0;
    
    const annualDebtService = monthlyPayment * 12;
    const cashFlow = noi - annualDebtService;
    
    // Investment Metrics
    const roi = marketValue > 0 ? (cashFlow / marketValue) * 100 : 0;
    const irr = discountRate; // Simplified IRR calculation
    const paybackPeriod = cashFlow > 0 ? marketValue / cashFlow : 0;
    const loanToValue = marketValue > 0 ? (loanAmount / marketValue) * 100 : 0;
    const debtServiceCoverage = annualDebtService > 0 ? noi / annualDebtService : 0;

    const calculatedResults: ValuationResults = {
      marketValue,
      incomeValue,
      costValue,
      noi,
      cashFlow,
      roi,
      irr,
      paybackPeriod,
      loanToValue,
      debtServiceCoverage,
    };

    setResults(calculatedResults);
    toast.success("Valuation analysis completed!");
  };

  const handleInputChange = (field: keyof ValuationInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getValueBadgeVariant = (method: string) => {
    return activeMethod === method ? "default" : "secondary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Valuation Analysis</h1>
            <p className="text-muted-foreground">Comprehensive property valuation and investment analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Property Details & Financial Inputs
                </CardTitle>
                <CardDescription>
                  Enter property characteristics and financial parameters for valuation analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="property" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="property">Property Details</TabsTrigger>
                    <TabsTrigger value="financial">Financial Data</TabsTrigger>
                    <TabsTrigger value="investment">Investment Metrics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="property" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="Enter location"
                          value={inputs.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="landSize">Land Size (sqm)</Label>
                        <Input
                          id="landSize"
                          type="number"
                          value={inputs.landSize}
                          onChange={(e) => handleInputChange('landSize', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buildingSize">Building Size (sqm)</Label>
                        <Input
                          id="buildingSize"
                          type="number"
                          value={inputs.buildingSize}
                          onChange={(e) => handleInputChange('buildingSize', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={inputs.bedrooms}
                          onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={inputs.bathrooms}
                          onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="financial" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="marketValue">Market Value ($)</Label>
                        <Input
                          id="marketValue"
                          type="number"
                          value={inputs.marketValue}
                          onChange={(e) => handleInputChange('marketValue', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rentalIncome">Annual Rental Income ($)</Label>
                        <Input
                          id="rentalIncome"
                          type="number"
                          value={inputs.rentalIncome}
                          onChange={(e) => handleInputChange('rentalIncome', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="operatingExpenses">Operating Expenses ($)</Label>
                        <Input
                          id="operatingExpenses"
                          type="number"
                          value={inputs.operatingExpenses}
                          onChange={(e) => handleInputChange('operatingExpenses', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="capRate">Cap Rate (%)</Label>
                        <Input
                          id="capRate"
                          type="number"
                          step="0.1"
                          value={inputs.capRate}
                          onChange={(e) => handleInputChange('capRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="investment" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                        <Input
                          id="loanAmount"
                          type="number"
                          value={inputs.loanAmount}
                          onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="interestRate">Interest Rate (%)</Label>
                        <Input
                          id="interestRate"
                          type="number"
                          step="0.1"
                          value={inputs.interestRate}
                          onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="loanTerm">Loan Term (years)</Label>
                        <Input
                          id="loanTerm"
                          type="number"
                          value={inputs.loanTerm}
                          onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="discountRate">Discount Rate (%)</Label>
                        <Input
                          id="discountRate"
                          type="number"
                          step="0.1"
                          value={inputs.discountRate}
                          onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <Button onClick={calculateValuation} className="w-full">
                    Calculate Valuation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Valuation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-4">
                    {/* Valuation Methods */}
                    <div>
                      <h4 className="font-semibold mb-3">Valuation Approaches</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Market Approach</span>
                          <Badge variant={getValueBadgeVariant("market")}>
                            {formatCurrency(results.marketValue)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Income Approach</span>
                          <Badge variant={getValueBadgeVariant("income")}>
                            {formatCurrency(results.incomeValue)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Cost Approach</span>
                          <Badge variant={getValueBadgeVariant("cost")}>
                            {formatCurrency(results.costValue)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Investment Metrics */}
                    <div>
                      <h4 className="font-semibold mb-3">Investment Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">NOI</span>
                          <span className="font-medium">{formatCurrency(results.noi)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Cash Flow</span>
                          <span className={`font-medium ${results.cashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(results.cashFlow)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">ROI</span>
                          <span className="font-medium">{results.roi.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Payback Period</span>
                          <span className="font-medium">{results.paybackPeriod.toFixed(1)} years</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Metrics */}
                    <div>
                      <h4 className="font-semibold mb-3">Risk Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">LTV Ratio</span>
                          <span className="font-medium">{results.loanToValue.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">DSCR</span>
                          <span className={`font-medium ${results.debtServiceCoverage >= 1.25 ? 'text-success' : 'text-warning'}`}>
                            {results.debtServiceCoverage.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter property details to calculate valuation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}