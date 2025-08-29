import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calculator, DollarSign, Percent } from "lucide-react";
import { SimpleCapNetIncomeInputs, SimpleCapNetIncomeResults } from "./SimpleCapNetIncomeForm";

interface SimpleCapNetIncomeResultsDisplayProps {
  results: SimpleCapNetIncomeResults;
  inputs: SimpleCapNetIncomeInputs;
}

export function SimpleCapNetIncomeResultsDisplay({ 
  results, 
  inputs 
}: SimpleCapNetIncomeResultsDisplayProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Value</p>
                <p className="text-2xl font-bold">${results.marketValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rounded Value</p>
                <p className="text-2xl font-bold">${results.marketValueRounded.toLocaleString()}</p>
              </div>
              <Calculator className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cap Rate Used</p>
                <p className="text-2xl font-bold">{inputs.capitalizationRate}%</p>
              </div>
              <Percent className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">NOI</p>
                <p className="text-2xl font-bold">${inputs.noi.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculation Breakdown
            </CardTitle>
            <CardDescription>
              Step-by-step calculation process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Net Rent</span>
                <span>${inputs.netRent.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">NROG's</span>
                <span>${inputs.nrogs.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">Net Operating Income (NOI)</span>
                <span className="font-bold">${inputs.noi.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Capitalisation Rate</span>
                <span>{inputs.capitalizationRate}%</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center p-3 bg-primary/20 rounded-lg">
                  <span className="font-bold">Market Value</span>
                  <span className="font-bold text-lg">${results.marketValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analysis Summary
            </CardTitle>
            <CardDescription>
              Key insights and risk considerations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Valuation Method</h4>
                <Badge variant="secondary">Capitalisation of Net Income</Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Formula Used</h4>
                <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                  Market Value = NOI ÷ (Cap Rate ÷ 100)
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Risk Premium</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{inputs.riskPremium}%</span>
                  <Badge variant="outline">Applied</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Calculation Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• NOI calculated from Net Rent + NROG's</li>
                  <li>• Market value rounded to nearest dollar</li>
                  <li>• Risk premium factored into analysis</li>
                  <li>• Results suitable for comparison analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}