/**
 * Delorenzo Property Group - Commodity Market Analysis
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Advanced market forecasting and commodity analysis platform
 * Patent Pending - Proprietary AI-driven market prediction algorithms
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Globe, BarChart3, AlertTriangle } from "lucide-react";
import { CommodityForecastResults } from "./CommodityForecastResults";
import { calculateCommodityForecast, type CommodityAnalysisInputs } from "@/utils/commodityAnalysis";

const commoditySchema = z.object({
  commodity: z.string().min(1, "Commodity selection is required"),
  region: z.string().min(1, "Region selection is required"),
  analysis_period: z.string().min(1, "Analysis period is required"),
  production_volume: z.number().min(0, "Production volume must be 0 or greater"),
  export_destination: z.string().min(1, "Export destination is required"),
  currency_pair: z.string().min(1, "Currency pair is required"),
  risk_tolerance: z.string().min(1, "Risk tolerance is required"),
});

type CommodityFormData = z.infer<typeof commoditySchema>;

export function CommodityMarketAnalysis() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("forecast");

  const form = useForm<CommodityFormData>({
    resolver: zodResolver(commoditySchema),
    defaultValues: {
      commodity: "",
      region: "",
      analysis_period: "",
      production_volume: 0,
      export_destination: "",
      currency_pair: "",
      risk_tolerance: "",
    },
  });

  const commodities = [
    "Wheat", "Corn", "Soybeans", "Rice", "Cotton", "Sugar", "Coffee", "Cocoa",
    "Beef", "Pork", "Dairy", "Wool", "Almonds", "Citrus", "Apples", "Grapes"
  ];

  const regions = [
    "Australia - East Coast", "Australia - West Coast", "Australia - South", 
    "New Zealand", "USA - Midwest", "USA - West Coast", "Canada", "Brazil", 
    "Argentina", "Europe - EU", "Asia - China", "Asia - Japan", "India"
  ];

  const exportDestinations = [
    "China", "Japan", "South Korea", "Indonesia", "Vietnam", "Thailand",
    "USA", "Canada", "Mexico", "EU - Germany", "EU - Netherlands", "UK",
    "Middle East - UAE", "Middle East - Saudi Arabia", "Egypt"
  ];

  const currencyPairs = [
    "AUD/USD", "AUD/CNY", "AUD/JPY", "AUD/EUR", "USD/CNY", "EUR/USD", 
    "GBP/USD", "NZD/USD", "CAD/USD", "BRL/USD"
  ];

  const riskTolerances = [
    "Conservative", "Moderate", "Aggressive", "High Risk/High Reward"
  ];

  const analysisPeriods = [
    "3 Months", "6 Months", "12 Months", "18 Months", "24 Months", "36 Months"
  ];

  const onSubmit = (data: CommodityFormData) => {
    setIsLoading(true);
    try {
      const inputs: CommodityAnalysisInputs = data as CommodityAnalysisInputs;
      const analysisResults = calculateCommodityForecast(inputs);
      setResults(analysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return <CommodityForecastResults results={results} onReset={() => setResults(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Commodity Market Analysis</h2>
          <p className="text-muted-foreground">Advanced forecasting with supply/demand analysis and export intelligence</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">™ DeLorenzoAI Market Intelligence</Badge>
            <Badge variant="outline">Patent Pending</Badge>
          </div>
        </div>
      </div>

      {/* Quick Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Wheat Futures</span>
            </div>
            <p className="text-xl font-bold text-green-600">$285.50</p>
            <p className="text-sm text-muted-foreground">+2.3% (24h)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AUD/USD</span>
            </div>
            <p className="text-xl font-bold text-blue-600">0.6842</p>
            <p className="text-sm text-muted-foreground">-0.15% (24h)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Export Volume</span>
            </div>
            <p className="text-xl font-bold text-orange-600">12.4M</p>
            <p className="text-sm text-muted-foreground">tonnes (Q4)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Trade Alert</span>
            </div>
            <p className="text-sm font-bold text-red-600">Tariff Changes</p>
            <p className="text-sm text-muted-foreground">China +5% (Wheat)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecast">Market Forecast</TabsTrigger>
          <TabsTrigger value="exchange">Exchange Rates</TabsTrigger>
          <TabsTrigger value="tariffs">Export Tariffs</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Market Analysis Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Analysis Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="commodity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commodity</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select commodity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {commodities.map((commodity) => (
                              <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Production Region</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>{region}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="analysis_period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forecast Period</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {analysisPeriods.map((period) => (
                              <SelectItem key={period} value={period}>{period}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="production_volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Production (tonnes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Export & Currency Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Export & Currency Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="export_destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Export Destination</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exportDestinations.map((destination) => (
                              <SelectItem key={destination} value={destination}>{destination}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency_pair"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency Exposure</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency pair" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencyPairs.map((pair) => (
                              <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_tolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Tolerance</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {riskTolerances.map((tolerance) => (
                              <SelectItem key={tolerance} value={tolerance}>{tolerance}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing Markets..." : "Generate Market Forecast"}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="exchange">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Exchange Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currencyPairs.slice(0, 6).map((pair) => (
                  <Card key={pair} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{pair}</span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold">
                      {pair === "AUD/USD" ? "0.6842" : 
                       pair === "AUD/CNY" ? "4.9524" :
                       pair === "AUD/JPY" ? "106.32" : "0.6234"}
                    </p>
                    <p className="text-sm text-muted-foreground">+0.23% (24h)</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tariffs">
          <Card>
            <CardHeader>
              <CardTitle>Export Tariff Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportDestinations.slice(0, 5).map((destination) => (
                  <Card key={destination} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{destination}</h4>
                        <p className="text-sm text-muted-foreground">Agricultural Products</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {destination.includes("China") ? "15.5%" :
                           destination.includes("Japan") ? "8.2%" :
                           destination.includes("USA") ? "12.1%" : "5.7%"}
                        </p>
                        <Badge variant={destination.includes("China") ? "destructive" : "secondary"}>
                          {destination.includes("China") ? "High" : "Moderate"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}