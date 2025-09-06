import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calculator, DollarSign, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SwapResult {
  swapValue: number;
  profitLoss: 'profit' | 'loss' | 'neutral';
  percentageChange: number;
}

interface TaxSavingsResult {
  totalSavings: number;
  effectiveRate: number;
  netBenefit: number;
}

export const CarbonCreditCalculator = () => {
  const { toast } = useToast();
  
  // Swap calculation states
  const [swapInputs, setSwapInputs] = useState({
    initialPrice: '',
    futurePrice: '',
    quantity: ''
  });
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null);

  // Tax savings states
  const [taxInputs, setTaxInputs] = useState({
    creditsUsed: '',
    valuePerCredit: '',
    taxRate: ''
  });
  const [taxResult, setTaxResult] = useState<TaxSavingsResult | null>(null);

  const calculateSwapValue = () => {
    const P1 = parseFloat(swapInputs.initialPrice);
    const P2 = parseFloat(swapInputs.futurePrice);
    const Q = parseFloat(swapInputs.quantity);

    if (isNaN(P1) || isNaN(P2) || isNaN(Q) || Q <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for all fields",
        variant: "destructive"
      });
      return;
    }

    const swapValue = (P2 - P1) * Q;
    const percentageChange = ((P2 - P1) / P1) * 100;
    const profitLoss = swapValue > 0 ? 'profit' : swapValue < 0 ? 'loss' : 'neutral';

    setSwapResult({
      swapValue,
      profitLoss,
      percentageChange
    });

    toast({
      title: "Swap Calculated",
      description: `Carbon credit swap value: $${swapValue.toLocaleString()}`
    });
  };

  const calculateTaxSavings = () => {
    const C = parseFloat(taxInputs.creditsUsed);
    const V = parseFloat(taxInputs.valuePerCredit);
    const r = parseFloat(taxInputs.taxRate) / 100;

    if (isNaN(C) || isNaN(V) || isNaN(r) || C <= 0 || V <= 0 || r <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for all fields",
        variant: "destructive"
      });
      return;
    }

    const totalSavings = C * V * r;
    const effectiveRate = r * 100;
    const netBenefit = totalSavings - (C * V * 0.02); // Assuming 2% transaction cost

    setTaxResult({
      totalSavings,
      effectiveRate,
      netBenefit
    });

    toast({
      title: "Tax Savings Calculated",
      description: `Total tax savings: $${totalSavings.toLocaleString()}`
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          Carbon Credit Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate carbon credit swap values and tax savings with real-time analytics
        </p>
      </div>

      <Tabs defaultValue="swaps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swaps" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Carbon Credit Swaps
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Tax Savings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Carbon Credit Swap Calculator
              </CardTitle>
              <CardDescription>
                Calculate the value of carbon credit swaps based on price differences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialPrice">Initial Price (P₁)</Label>
                  <Input
                    id="initialPrice"
                    type="number"
                    step="0.01"
                    placeholder="20.00"
                    value={swapInputs.initialPrice}
                    onChange={(e) => setSwapInputs(prev => ({ ...prev, initialPrice: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="futurePrice">Future Price (P₂)</Label>
                  <Input
                    id="futurePrice"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={swapInputs.futurePrice}
                    onChange={(e) => setSwapInputs(prev => ({ ...prev, futurePrice: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Q)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1000"
                    value={swapInputs.quantity}
                    onChange={(e) => setSwapInputs(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={calculateSwapValue} className="w-full">
                Calculate Swap Value
              </Button>
            </CardContent>
          </Card>

          {swapResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Swap Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(swapResult.swapValue)}
                    </div>
                    <div className="text-sm text-muted-foreground">Swap Value</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold ${
                      swapResult.profitLoss === 'profit' ? 'text-green-600' :
                      swapResult.profitLoss === 'loss' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {swapResult.percentageChange.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Price Change</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold ${
                      swapResult.profitLoss === 'profit' ? 'text-green-600' :
                      swapResult.profitLoss === 'loss' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {swapResult.profitLoss.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">Result</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Savings Calculator
              </CardTitle>
              <CardDescription>
                Calculate tax savings from carbon credit utilization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditsUsed">Credits Used (C)</Label>
                  <Input
                    id="creditsUsed"
                    type="number"
                    placeholder="800"
                    value={taxInputs.creditsUsed}
                    onChange={(e) => setTaxInputs(prev => ({ ...prev, creditsUsed: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valuePerCredit">Value per Credit (V)</Label>
                  <Input
                    id="valuePerCredit"
                    type="number"
                    step="0.01"
                    placeholder="20.00"
                    value={taxInputs.valuePerCredit}
                    onChange={(e) => setTaxInputs(prev => ({ ...prev, valuePerCredit: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    placeholder="21"
                    value={taxInputs.taxRate}
                    onChange={(e) => setTaxInputs(prev => ({ ...prev, taxRate: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={calculateTaxSavings} className="w-full">
                Calculate Tax Savings
              </Button>
            </CardContent>
          </Card>

          {taxResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tax Savings Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(taxResult.totalSavings)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Savings</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {taxResult.effectiveRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Effective Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(taxResult.netBenefit)}
                    </div>
                    <div className="text-sm text-muted-foreground">Net Benefit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};