/**
 * Commodity Sector Analysis with YoY and CAGR Data
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Filter } from "lucide-react";

interface CommodityData {
  name: string;
  category: string;
  currentPrice: number;
  currency: string;
  yoyChange: number;
  cagr5yr: number;
  volume: number;
  unit: string;
  exportValue: number;
  marketShare: number;
  yearData: {
    year: number;
    price: number;
    volume: number;
    value: number;
  }[];
}

const commoditiesData: CommodityData[] = [
  {
    name: "Iron Ore",
    category: "Mining",
    currentPrice: 124.50,
    currency: "USD",
    yoyChange: 8.3,
    cagr5yr: 12.4,
    volume: 915,
    unit: "Mt",
    exportValue: 113.8,
    marketShare: 23.4,
    yearData: [
      { year: 2020, price: 95.2, volume: 897, value: 85.4 },
      { year: 2021, price: 118.7, volume: 905, value: 107.4 },
      { year: 2022, price: 106.3, volume: 912, value: 97.0 },
      { year: 2023, price: 115.1, volume: 908, value: 104.5 },
      { year: 2024, price: 124.5, volume: 915, value: 113.8 }
    ]
  },
  {
    name: "Wheat",
    category: "Agriculture",
    currentPrice: 285.75,
    currency: "AUD",
    yoyChange: -2.1,
    cagr5yr: 6.8,
    volume: 31.2,
    unit: "Mt",
    exportValue: 8.9,
    marketShare: 1.8,
    yearData: [
      { year: 2020, price: 245.3, volume: 28.5, value: 7.0 },
      { year: 2021, price: 278.9, volume: 29.8, value: 8.3 },
      { year: 2022, price: 324.5, volume: 30.1, value: 9.8 },
      { year: 2023, price: 291.8, volume: 30.5, value: 8.9 },
      { year: 2024, price: 285.8, volume: 31.2, value: 8.9 }
    ]
  },
  {
    name: "Coal (Thermal)",
    category: "Mining",
    currentPrice: 156.20,
    currency: "USD",
    yoyChange: 15.7,
    cagr5yr: 18.2,
    volume: 388,
    unit: "Mt",
    exportValue: 60.6,
    marketShare: 12.5,
    yearData: [
      { year: 2020, price: 67.8, volume: 354, value: 24.0 },
      { year: 2021, price: 142.3, volume: 372, value: 52.9 },
      { year: 2022, price: 198.4, volume: 381, value: 75.6 },
      { year: 2023, price: 135.0, volume: 385, value: 52.0 },
      { year: 2024, price: 156.2, volume: 388, value: 60.6 }
    ]
  },
  {
    name: "Beef",
    category: "Agriculture",
    currentPrice: 8.45,
    currency: "AUD",
    yoyChange: 4.2,
    cagr5yr: 3.9,
    volume: 1.85,
    unit: "Mt",
    exportValue: 15.6,
    marketShare: 3.2,
    yearData: [
      { year: 2020, price: 7.2, volume: 1.72, value: 12.4 },
      { year: 2021, price: 8.1, volume: 1.78, value: 14.4 },
      { year: 2022, price: 8.9, volume: 1.81, value: 16.1 },
      { year: 2023, price: 8.1, volume: 1.83, value: 14.8 },
      { year: 2024, price: 8.5, volume: 1.85, value: 15.7 }
    ]
  },
  {
    name: "LNG",
    category: "Energy",
    currentPrice: 12.85,
    currency: "USD",
    yoyChange: -8.4,
    cagr5yr: 14.6,
    volume: 81.2,
    unit: "Mt",
    exportValue: 104.3,
    marketShare: 21.5,
    yearData: [
      { year: 2020, price: 7.2, volume: 68.4, value: 49.2 },
      { year: 2021, price: 18.4, volume: 74.6, value: 137.3 },
      { year: 2022, price: 22.1, volume: 78.2, value: 172.8 },
      { year: 2023, price: 14.0, volume: 79.8, value: 111.7 },
      { year: 2024, price: 12.9, volume: 81.2, value: 104.7 }
    ]
  },
  {
    name: "Gold",
    category: "Mining",
    currentPrice: 3245.60,
    currency: "AUD",
    yoyChange: 12.8,
    cagr5yr: 8.9,
    volume: 314,
    unit: "tonnes",
    exportValue: 102.0,
    marketShare: 21.0,
    yearData: [
      { year: 2020, price: 2585.3, volume: 287, value: 74.2 },
      { year: 2021, price: 2512.8, volume: 295, value: 74.1 },
      { year: 2022, price: 2687.4, volume: 301, value: 80.9 },
      { year: 2023, price: 2876.2, volume: 308, value: 88.6 },
      { year: 2024, price: 3245.6, volume: 314, value: 102.0 }
    ]
  }
];

export function CommoditySectorAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("exportValue");
  const [activeView, setActiveView] = useState<string>("overview");

  const categories = ["all", ...new Set(commoditiesData.map(c => c.category))];
  
  const filteredData = selectedCategory === "all" 
    ? commoditiesData 
    : commoditiesData.filter(c => c.category === selectedCategory);

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "yoyChange":
        return Math.abs(b.yoyChange) - Math.abs(a.yoyChange);
      case "cagr5yr":
        return b.cagr5yr - a.cagr5yr;
      case "exportValue":
        return b.exportValue - a.exportValue;
      case "marketShare":
        return b.marketShare - a.marketShare;
      default:
        return 0;
    }
  });

  const calculateCAGR = (startValue: number, endValue: number, years: number): number => {
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? "text-success" : "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exportValue">Export Value</SelectItem>
              <SelectItem value="yoyChange">YoY Change</SelectItem>
              <SelectItem value="cagr5yr">5-Year CAGR</SelectItem>
              <SelectItem value="marketShare">Market Share</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4">
            {sortedData.map((commodity, index) => (
              <Card key={commodity.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Commodity Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{commodity.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {commodity.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Current Price */}
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {commodity.currency} {commodity.currentPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        per {commodity.unit === "Mt" ? "tonne" : commodity.unit}
                      </p>
                    </div>

                    {/* YoY Change */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getTrendIcon(commodity.yoyChange)}
                        <span className={`text-lg font-bold ${getTrendColor(commodity.yoyChange)}`}>
                          {commodity.yoyChange > 0 ? "+" : ""}{commodity.yoyChange.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">YoY Change</p>
                    </div>

                    {/* 5-Year CAGR */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-info" />
                        <span className="text-lg font-bold text-info">
                          {commodity.cagr5yr.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">5-Yr CAGR</p>
                    </div>

                    {/* Export Value & Market Share */}
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        ${commodity.exportValue.toFixed(1)}B
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <Progress 
                          value={commodity.marketShare} 
                          className="w-16 h-2" 
                        />
                        <span className="text-sm text-muted-foreground">
                          {commodity.marketShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="mt-6">
          <div className="grid gap-6">
            {sortedData.map((commodity) => (
              <Card key={commodity.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{commodity.name}</span>
                    <Badge>{commodity.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="text-xl font-bold">
                        {commodity.currency} {commodity.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Volume ({commodity.unit})</p>
                      <p className="text-xl font-bold">
                        {commodity.volume.toFixed(1)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Export Value</p>
                      <p className="text-xl font-bold">
                        ${commodity.exportValue.toFixed(1)}B
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Market Share</p>
                      <p className="text-xl font-bold">
                        {commodity.marketShare.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="font-medium">YoY Performance</span>
                      </div>
                      <p className={`text-2xl font-bold ${getTrendColor(commodity.yoyChange)}`}>
                        {commodity.yoyChange > 0 ? "+" : ""}{commodity.yoyChange.toFixed(1)}%
                      </p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-info/10 to-info/5">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-info" />
                        <span className="font-medium">5-Year CAGR</span>
                      </div>
                      <p className="text-2xl font-bold text-info">
                        {commodity.cagr5yr.toFixed(1)}%
                      </p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-warning" />
                        <span className="font-medium">Value Growth</span>
                      </div>
                      <p className="text-2xl font-bold text-warning">
                        {calculateCAGR(
                          commodity.yearData[0].value,
                          commodity.yearData[commodity.yearData.length - 1].value,
                          commodity.yearData.length - 1
                        ).toFixed(1)}%
                      </p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance Trends (2020-2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {sortedData.map((commodity) => (
                  <div key={commodity.name} className="space-y-4">
                    <h3 className="text-lg font-semibold">{commodity.name}</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {commodity.yearData.map((year) => (
                        <Card key={year.year} className="p-3 text-center">
                          <div className="font-semibold text-sm text-muted-foreground mb-2">
                            {year.year}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Price:</span> {year.price.toFixed(1)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Volume:</span> {year.volume.toFixed(1)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Value:</span> ${year.value.toFixed(1)}B
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}