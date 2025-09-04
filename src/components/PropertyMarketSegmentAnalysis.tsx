/**
 * Property Market Segment Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Target, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PropertyMarketSegmentAnalysisProps {
  propertyType: string;
}

const getMarketData = (propertyType: string) => {
  const baseData = {
    office: {
      marketSize: "$485B",
      yoyGrowth: "3.2%",
      segments: [
        { name: 'CBD Premium', share: 35, growth: 4.1, avgPrice: 8500 },
        { name: 'CBD Secondary', share: 25, growth: 2.8, avgPrice: 6200 },
        { name: 'Suburban Premium', share: 20, growth: 3.5, avgPrice: 4800 },
        { name: 'Suburban Secondary', share: 20, growth: 1.9, avgPrice: 3200 }
      ],
      yearlyData: [
        { year: '2020', value: 442, growth: -2.1 },
        { year: '2021', value: 451, growth: 2.0 },
        { year: '2022', value: 467, growth: 3.5 },
        { year: '2023', value: 470, growth: 0.6 },
        { year: '2024', value: 485, growth: 3.2 }
      ]
    },
    retail: {
      marketSize: "$324B",
      yoyGrowth: "2.1%",
      segments: [
        { name: 'Regional Shopping Centers', share: 40, growth: 2.8, avgPrice: 5500 },
        { name: 'Neighborhood Centers', share: 30, growth: 1.9, avgPrice: 4200 },
        { name: 'Strip Retail', share: 20, growth: 1.2, avgPrice: 3800 },
        { name: 'Specialty Retail', share: 10, growth: 4.5, avgPrice: 7200 }
      ],
      yearlyData: [
        { year: '2020', value: 301, growth: -4.2 },
        { year: '2021', value: 310, growth: 3.0 },
        { year: '2022', value: 315, growth: 1.6 },
        { year: '2023', value: 317, growth: 0.6 },
        { year: '2024', value: 324, growth: 2.1 }
      ]
    },
    industrial: {
      marketSize: "$267B",
      yoyGrowth: "5.8%",
      segments: [
        { name: 'Logistics & Distribution', share: 45, growth: 7.2, avgPrice: 220 },
        { name: 'Manufacturing', share: 30, growth: 4.1, avgPrice: 185 },
        { name: 'Cold Storage', share: 15, growth: 8.9, avgPrice: 310 },
        { name: 'Flex/R&D', share: 10, growth: 6.3, avgPrice: 280 }
      ],
      yearlyData: [
        { year: '2020', value: 215, growth: 2.8 },
        { year: '2021', value: 228, growth: 6.0 },
        { year: '2022', value: 241, growth: 5.7 },
        { year: '2023', value: 252, growth: 4.6 },
        { year: '2024', value: 267, growth: 5.8 }
      ]
    },
    residential: {
      marketSize: "$1.2T",
      yoyGrowth: "4.3%",
      segments: [
        { name: 'Luxury Apartments', share: 25, growth: 5.8, avgPrice: 1200000 },
        { name: 'Mid-Market Apartments', share: 35, growth: 4.1, avgPrice: 850000 },
        { name: 'Affordable Housing', share: 25, growth: 2.9, avgPrice: 580000 },
        { name: 'Student Housing', share: 15, growth: 6.7, avgPrice: 420000 }
      ],
      yearlyData: [
        { year: '2020', value: 1050, growth: 1.2 },
        { year: '2021', value: 1089, growth: 3.7 },
        { year: '2022', value: 1134, growth: 4.1 },
        { year: '2023', value: 1151, growth: 1.5 },
        { year: '2024', value: 1200, growth: 4.3 }
      ]
    },
    hospitality: {
      marketSize: "$156B",
      yoyGrowth: "6.2%",
      segments: [
        { name: 'Luxury Hotels', share: 30, growth: 7.8, avgPrice: 580000 },
        { name: 'Business Hotels', share: 35, growth: 5.9, avgPrice: 420000 },
        { name: 'Budget Hotels', share: 25, growth: 4.2, avgPrice: 280000 },
        { name: 'Extended Stay', share: 10, growth: 8.1, avgPrice: 350000 }
      ],
      yearlyData: [
        { year: '2020', value: 95, growth: -18.2 },
        { year: '2021', value: 118, growth: 24.2 },
        { year: '2022', value: 138, growth: 16.9 },
        { year: '2023', value: 147, growth: 6.5 },
        { year: '2024', value: 156, growth: 6.2 }
      ]
    },
    mixed: {
      marketSize: "$198B",
      yoyGrowth: "3.7%",
      segments: [
        { name: 'Mixed-Use Towers', share: 40, growth: 4.2, avgPrice: 950000 },
        { name: 'Live/Work Spaces', share: 30, growth: 3.8, avgPrice: 720000 },
        { name: 'Transit-Oriented Dev', share: 20, growth: 5.1, avgPrice: 840000 },
        { name: 'Urban Villages', share: 10, growth: 2.9, avgPrice: 650000 }
      ],
      yearlyData: [
        { year: '2020', value: 175, growth: 0.8 },
        { year: '2021', value: 182, growth: 4.0 },
        { year: '2022', value: 187, growth: 2.7 },
        { year: '2023', value: 191, growth: 2.1 },
        { year: '2024', value: 198, growth: 3.7 }
      ]
    }
  };
  
  return baseData[propertyType as keyof typeof baseData] || baseData.office;
};

export const PropertyMarketSegmentAnalysis = ({ propertyType }: PropertyMarketSegmentAnalysisProps) => {
  const data = getMarketData(propertyType);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Market Size</span>
            </div>
            <p className="text-2xl font-bold text-primary">{data.marketSize}</p>
            <p className="text-sm text-muted-foreground">2024 Total Value</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">YoY Growth</span>
            </div>
            <p className="text-2xl font-bold text-success">{data.yoyGrowth}</p>
            <p className="text-sm text-muted-foreground">2024 vs 2023</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Market Segments</span>
            </div>
            <p className="text-2xl font-bold text-info">{data.segments.length}</p>
            <p className="text-sm text-muted-foreground">Active Segments</p>
          </CardContent>
        </Card>
      </div>

      {/* Year-on-Year Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            5-Year Market Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'value' ? `$${value}B` : `${value}%`,
                  name === 'value' ? 'Market Value' : 'Growth Rate'
                ]}
              />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="growth" stroke="hsl(var(--success))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Segments Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Market Share */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Market Share by Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.segments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                <Bar dataKey="share" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Segment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Segment Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{segment.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{segment.share}% Market Share</span>
                      <Badge variant={segment.growth >= 3 ? "default" : "secondary"}>
                        {segment.growth >= 0 ? '+' : ''}{segment.growth}% Growth
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${segment.avgPrice.toLocaleString()}{propertyType === 'industrial' ? '/sqft' : propertyType === 'residential' ? '' : '/sqm'}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};