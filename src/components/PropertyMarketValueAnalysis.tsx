/**
 * Property Market Value Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';

interface PropertyMarketValueAnalysisProps {
  propertyType: string;
}

const getValueData = (propertyType: string) => {
  const baseData = {
    office: {
      avgValue: "$8,450/sqm",
      yoyChange: "+3.8%",
      capRate: "6.2%",
      totalVolume: "$24.5B",
      valueHistory: [
        { year: '2020', value: 7650, capRate: 6.8, volume: 18.2, priceIndex: 95 },
        { year: '2021', value: 7850, capRate: 6.5, volume: 21.5, priceIndex: 98 },
        { year: '2022', value: 8120, capRate: 6.4, volume: 23.1, priceIndex: 102 },
        { year: '2023', value: 8140, capRate: 6.3, volume: 22.8, priceIndex: 101 },
        { year: '2024', value: 8450, capRate: 6.2, volume: 24.5, priceIndex: 105 }
      ],
      priceRanges: [
        { range: 'Premium ($12k+)', percentage: 15, avgValue: 14500, growth: 4.5 },
        { range: 'Prime ($9k-$12k)', percentage: 25, avgValue: 10200, growth: 3.8 },
        { range: 'Standard ($6k-$9k)', percentage: 40, avgValue: 7400, growth: 3.2 },
        { range: 'Secondary (<$6k)', percentage: 20, avgValue: 4800, growth: 2.1 }
      ]
    },
    retail: {
      avgValue: "$5,200/sqm",
      yoyChange: "+2.5%",
      capRate: "7.1%",
      totalVolume: "$18.3B",
      valueHistory: [
        { year: '2020', value: 4850, capRate: 7.8, volume: 14.2, priceIndex: 92 },
        { year: '2021', value: 4920, capRate: 7.6, volume: 15.8, priceIndex: 94 },
        { year: '2022', value: 5050, capRate: 7.4, volume: 17.1, priceIndex: 97 },
        { year: '2023', value: 5075, capRate: 7.2, volume: 16.9, priceIndex: 98 },
        { year: '2024', value: 5200, capRate: 7.1, volume: 18.3, priceIndex: 101 }
      ],
      priceRanges: [
        { range: 'Major Centers ($8k+)', percentage: 20, avgValue: 9500, growth: 3.2 },
        { range: 'Regional Centers ($5k-$8k)', percentage: 35, avgValue: 6200, growth: 2.8 },
        { range: 'Neighborhood ($3k-$5k)', percentage: 30, avgValue: 4100, growth: 2.1 },
        { range: 'Strip Retail (<$3k)', percentage: 15, avgValue: 2400, growth: 1.5 }
      ]
    },
    industrial: {
      avgValue: "$2,200/sqm",
      yoyChange: "+7.2%",
      capRate: "5.8%",
      totalVolume: "$31.2B",
      valueHistory: [
        { year: '2020', value: 1850, capRate: 6.5, volume: 22.1, priceIndex: 88 },
        { year: '2021', value: 1920, capRate: 6.2, volume: 26.8, priceIndex: 92 },
        { year: '2022', value: 2050, capRate: 6.0, volume: 29.5, priceIndex: 97 },
        { year: '2023', value: 2055, capRate: 5.9, volume: 28.9, priceIndex: 98 },
        { year: '2024', value: 2200, capRate: 5.8, volume: 31.2, priceIndex: 105 }
      ],
      priceRanges: [
        { range: 'Logistics Hubs ($3k+)', percentage: 25, avgValue: 3800, growth: 8.9 },
        { range: 'Modern Warehouses ($2k-$3k)', percentage: 40, avgValue: 2450, growth: 7.5 },
        { range: 'Standard Industrial ($1.5k-$2k)', percentage: 25, avgValue: 1750, growth: 6.2 },
        { range: 'Older Stock (<$1.5k)', percentage: 10, avgValue: 1200, growth: 4.1 }
      ]
    },
    residential: {
      avgValue: "$950,000",
      yoyChange: "+4.1%",
      capRate: "4.8%",
      totalVolume: "$420B",
      valueHistory: [
        { year: '2020', value: 850000, capRate: 5.2, volume: 380, priceIndex: 95 },
        { year: '2021', value: 885000, capRate: 5.0, volume: 395, priceIndex: 98 },
        { year: '2022', value: 920000, capRate: 4.9, volume: 410, priceIndex: 102 },
        { year: '2023', value: 912000, capRate: 4.9, volume: 405, priceIndex: 101 },
        { year: '2024', value: 950000, capRate: 4.8, volume: 420, priceIndex: 106 }
      ],
      priceRanges: [
        { range: 'Luxury ($1.5M+)', percentage: 20, avgValue: 2200000, growth: 5.8 },
        { range: 'Premium ($1M-$1.5M)', percentage: 30, avgValue: 1250000, growth: 4.5 },
        { range: 'Mid-Market ($600k-$1M)', percentage: 35, avgValue: 780000, growth: 3.8 },
        { range: 'Affordable (<$600k)', percentage: 15, avgValue: 485000, growth: 2.9 }
      ]
    },
    hospitality: {
      avgValue: "$485,000/room",
      yoyChange: "+6.8%",
      capRate: "8.2%",
      totalVolume: "$8.9B",
      valueHistory: [
        { year: '2020', value: 385000, capRate: 9.5, volume: 4.2, priceIndex: 82 },
        { year: '2021', value: 420000, capRate: 9.1, volume: 5.8, priceIndex: 89 },
        { year: '2022', value: 445000, capRate: 8.7, volume: 7.2, priceIndex: 95 },
        { year: '2023', value: 454000, capRate: 8.4, volume: 8.1, priceIndex: 97 },
        { year: '2024', value: 485000, capRate: 8.2, volume: 8.9, priceIndex: 103 }
      ],
      priceRanges: [
        { range: 'Luxury Hotels ($800k+)', percentage: 15, avgValue: 1200000, growth: 8.9 },
        { range: 'Upscale ($500k-$800k)', percentage: 30, avgValue: 650000, growth: 7.2 },
        { range: 'Mid-Scale ($300k-$500k)', percentage: 40, avgValue: 395000, growth: 6.1 },
        { range: 'Economy (<$300k)', percentage: 15, avgValue: 220000, growth: 4.8 }
      ]
    },
    mixed: {
      avgValue: "$7,200/sqm",
      yoyChange: "+4.2%",
      capRate: "6.5%",
      totalVolume: "$12.8B",
      valueHistory: [
        { year: '2020', value: 6450, capRate: 7.1, volume: 9.8, priceIndex: 93 },
        { year: '2021', value: 6650, capRate: 6.9, volume: 10.5, priceIndex: 96 },
        { year: '2022', value: 6890, capRate: 6.7, volume: 11.8, priceIndex: 99 },
        { year: '2023', value: 6910, capRate: 6.6, volume: 12.1, priceIndex: 100 },
        { year: '2024', value: 7200, capRate: 6.5, volume: 12.8, priceIndex: 104 }
      ],
      priceRanges: [
        { range: 'Premium Mixed ($10k+)', percentage: 20, avgValue: 12500, growth: 5.2 },
        { range: 'Urban Mixed ($7k-$10k)', percentage: 35, avgValue: 8200, growth: 4.5 },
        { range: 'Suburban Mixed ($5k-$7k)', percentage: 30, avgValue: 5850, growth: 3.8 },
        { range: 'Value Mixed (<$5k)', percentage: 15, avgValue: 3900, growth: 2.9 }
      ]
    }
  };
  
  return baseData[propertyType as keyof typeof baseData] || baseData.office;
};

export const PropertyMarketValueAnalysis = ({ propertyType }: PropertyMarketValueAnalysisProps) => {
  const data = getValueData(propertyType);

  return (
    <div className="space-y-6">
      {/* Key Value Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Average Value</span>
            </div>
            <p className="text-2xl font-bold text-primary">{data.avgValue}</p>
            <p className="text-sm text-muted-foreground">Current Market</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">YoY Change</span>
            </div>
            <p className="text-2xl font-bold text-success">{data.yoyChange}</p>
            <p className="text-sm text-muted-foreground">2024 vs 2023</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Cap Rate</span>
            </div>
            <p className="text-2xl font-bold text-info">{data.capRate}</p>
            <p className="text-sm text-muted-foreground">Market Average</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Total Volume</span>
            </div>
            <p className="text-2xl font-bold text-warning">{data.totalVolume}</p>
            <p className="text-sm text-muted-foreground">2024 Sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Value History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            5-Year Value Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={data.valueHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'value') return [
                    propertyType === 'residential' || propertyType === 'hospitality' 
                      ? `$${(value as number).toLocaleString()}${propertyType === 'hospitality' ? '/room' : ''}` 
                      : `$${value}/sqm`, 
                    'Average Value'
                  ];
                  if (name === 'capRate') return [`${value}%`, 'Cap Rate'];
                  if (name === 'volume') return [`$${value}B`, 'Sales Volume'];
                  if (name === 'priceIndex') return [value, 'Price Index'];
                  return [value, name];
                }}
              />
              <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--muted))" opacity={0.7} />
              <Line yAxisId="left" type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="capRate" stroke="hsl(var(--warning))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="priceIndex" stroke="hsl(var(--success))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Range Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Value Distribution by Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.priceRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{range.range}</p>
                    <Badge variant={range.growth >= 4 ? "default" : "secondary"}>
                      {range.growth >= 0 ? '+' : ''}{range.growth}% YoY
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {range.percentage}% of market
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2 max-w-48">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${range.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold">
                    ${range.avgValue.toLocaleString()}{
                      propertyType === 'residential' ? '' :
                      propertyType === 'hospitality' ? '/room' : '/sqm'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Average</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};