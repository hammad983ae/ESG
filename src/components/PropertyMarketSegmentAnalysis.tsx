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
  geographicLevel: string;
}

const getMarketData = (propertyType: string, geographicLevel: string = 'total') => {
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
    },
    agricultural: {
      marketSize: "$89B",
      yoyGrowth: "4.8%",
      segments: [
        { name: 'Broadacre Cropping', share: 45, growth: 5.2, avgPrice: 8500 },
        { name: 'Grazing Land', share: 35, growth: 4.1, avgPrice: 4200 },
        { name: 'Horticulture', share: 12, growth: 6.8, avgPrice: 28000 },
        { name: 'Viticulture', share: 8, growth: 3.9, avgPrice: 35000 }
      ],
      yearlyData: [
        { year: '2020', value: 78, growth: 2.1 },
        { year: '2021', value: 81, growth: 3.8 },
        { year: '2022', value: 84, growth: 3.7 },
        { year: '2023', value: 85, growth: 1.2 },
        { year: '2024', value: 89, growth: 4.8 }
      ]
    },
    development: {
      marketSize: "$156B",
      yoyGrowth: "8.9%",
      segments: [
        { name: 'Residential Subdivision', share: 55, growth: 9.8, avgPrice: 485000 },
        { name: 'Commercial Development', share: 25, growth: 8.1, avgPrice: 1200000 },
        { name: 'Industrial Development', share: 15, growth: 7.5, avgPrice: 280000 },
        { name: 'Mixed-Use Development', share: 5, growth: 12.1, avgPrice: 2400000 }
      ],
      yearlyData: [
        { year: '2020', value: 125, growth: 1.8 },
        { year: '2021', value: 135, growth: 8.0 },
        { year: '2022', value: 142, growth: 5.2 },
        { year: '2023', value: 143, growth: 0.7 },
        { year: '2024', value: 156, growth: 8.9 }
      ]
    }
  };
  
  // Geographic breakdown data
  const geographicData = {
    total: baseData[propertyType as keyof typeof baseData] || baseData.office,
    state: getStateBreakdown(propertyType),
    capital: getCapitalCityBreakdown(propertyType),
    'major-regional': getMajorRegionalBreakdown(propertyType),
    regional: getRegionalBreakdown(propertyType)
  };
  
  return geographicData[geographicLevel as keyof typeof geographicData];
};

const getStateBreakdown = (propertyType: string) => {
  const stateData = {
    agricultural: {
      marketSize: "$89B",
      yoyGrowth: "4.8%",
      segments: [
        { name: 'NSW', share: 32, growth: 4.9, avgPrice: 9200 },
        { name: 'VIC', share: 18, growth: 5.1, avgPrice: 12500 },
        { name: 'QLD', share: 22, growth: 4.2, avgPrice: 7800 },
        { name: 'WA', share: 15, growth: 5.8, avgPrice: 6200 },
        { name: 'SA', share: 8, growth: 3.9, avgPrice: 8100 },
        { name: 'TAS', share: 3, growth: 4.5, avgPrice: 15200 },
        { name: 'NT', share: 1.5, growth: 2.8, avgPrice: 4500 },
        { name: 'ACT', share: 0.5, growth: 6.2, avgPrice: 28000 }
      ],
      yearlyData: [
        { year: '2020', value: 78, growth: 2.1 },
        { year: '2021', value: 81, growth: 3.8 },
        { year: '2022', value: 84, growth: 3.7 },
        { year: '2023', value: 85, growth: 1.2 },
        { year: '2024', value: 89, growth: 4.8 }
      ]
    },
    development: {
      marketSize: "$156B", 
      yoyGrowth: "8.9%",
      segments: [
        { name: 'NSW', share: 35, growth: 9.2, avgPrice: 580000 },
        { name: 'VIC', share: 28, growth: 8.8, avgPrice: 485000 },
        { name: 'QLD', share: 20, growth: 9.8, avgPrice: 380000 },
        { name: 'WA', share: 10, growth: 7.2, avgPrice: 420000 },
        { name: 'SA', share: 5, growth: 6.8, avgPrice: 320000 },
        { name: 'TAS', share: 1.5, growth: 8.1, avgPrice: 285000 },
        { name: 'NT', share: 0.3, growth: 5.2, avgPrice: 195000 },
        { name: 'ACT', share: 0.2, growth: 12.5, avgPrice: 750000 }
      ],
      yearlyData: [
        { year: '2020', value: 125, growth: 1.8 },
        { year: '2021', value: 135, growth: 8.0 },
        { year: '2022', value: 142, growth: 5.2 },
        { year: '2023', value: 143, growth: 0.7 },
        { year: '2024', value: 156, growth: 8.9 }
      ]
    }
  };
  
  return stateData[propertyType as keyof typeof stateData] || {
    marketSize: "$0B", yoyGrowth: "0%", segments: [], yearlyData: []
  };
};

const getCapitalCityBreakdown = (propertyType: string) => {
  const capitalData = {
    development: {
      marketSize: "$98B",
      yoyGrowth: "9.5%", 
      segments: [
        { name: 'Sydney', share: 38, growth: 9.8, avgPrice: 650000 },
        { name: 'Melbourne', share: 32, growth: 9.1, avgPrice: 520000 },
        { name: 'Brisbane', share: 15, growth: 10.2, avgPrice: 420000 },
        { name: 'Perth', share: 8, growth: 7.8, avgPrice: 480000 },
        { name: 'Adelaide', share: 5, growth: 8.2, avgPrice: 380000 },
        { name: 'Canberra', share: 2, growth: 12.8, avgPrice: 780000 }
      ],
      yearlyData: [
        { year: '2020', value: 78, growth: 0.8 },
        { year: '2021', value: 85, growth: 9.0 },
        { year: '2022', value: 89, growth: 4.7 },
        { year: '2023', value: 89, growth: 0.0 },
        { year: '2024', value: 98, growth: 9.5 }
      ]
    }
  };
  
  return capitalData[propertyType as keyof typeof capitalData] || {
    marketSize: "$0B", yoyGrowth: "0%", segments: [], yearlyData: []
  };
};

const getMajorRegionalBreakdown = (propertyType: string) => {
  const majorRegionalData = {
    agricultural: {
      marketSize: "$52B",
      yoyGrowth: "5.2%",
      segments: [
        { name: 'Hunter Valley NSW', share: 15, growth: 5.8, avgPrice: 11200 },
        { name: 'Goulburn Valley VIC', share: 12, growth: 4.9, avgPrice: 14800 },
        { name: 'Darling Downs QLD', share: 18, growth: 4.2, avgPrice: 8500 },
        { name: 'Wheatbelt WA', share: 22, growth: 6.1, avgPrice: 6800 },
        { name: 'Riverland SA', share: 8, growth: 4.5, avgPrice: 9200 },
        { name: 'Northwest TAS', share: 5, growth: 5.2, avgPrice: 18500 }
      ],
      yearlyData: [
        { year: '2020', value: 45, growth: 2.8 },
        { year: '2021', value: 47, growth: 4.4 },
        { year: '2022', value: 49, growth: 4.3 },
        { year: '2023', value: 49, growth: 0.0 },
        { year: '2024', value: 52, growth: 5.2 }
      ]
    },
    development: {
      marketSize: "$42B",
      yoyGrowth: "7.8%",
      segments: [
        { name: 'Gold Coast QLD', share: 28, growth: 8.9, avgPrice: 485000 },
        { name: 'Geelong VIC', share: 18, growth: 7.2, avgPrice: 380000 },
        { name: 'Newcastle NSW', share: 15, growth: 8.1, avgPrice: 420000 },
        { name: 'Sunshine Coast QLD', share: 12, growth: 9.2, avgPrice: 465000 },
        { name: 'Wollongong NSW', share: 10, growth: 6.8, avgPrice: 520000 },
        { name: 'Townsville QLD', share: 8, growth: 5.9, avgPrice: 285000 }
      ],
      yearlyData: [
        { year: '2020', value: 34, growth: 2.1 },
        { year: '2021', value: 36, growth: 5.9 },
        { year: '2022', value: 38, growth: 5.6 },
        { year: '2023', value: 39, growth: 2.6 },
        { year: '2024', value: 42, growth: 7.8 }
      ]
    }
  };
  
  return majorRegionalData[propertyType as keyof typeof majorRegionalData] || {
    marketSize: "$0B", yoyGrowth: "0%", segments: [], yearlyData: []
  };
};

const getRegionalBreakdown = (propertyType: string) => {
  const regionalData = {
    agricultural: {
      marketSize: "$37B", 
      yoyGrowth: "3.8%",
      segments: [
        { name: 'Broadacre Wheat', share: 35, growth: 4.1, avgPrice: 6200 },
        { name: 'Cattle Grazing', share: 28, growth: 3.2, avgPrice: 3800 },
        { name: 'Mixed Farming', share: 20, growth: 4.8, avgPrice: 7500 },
        { name: 'Sheep Grazing', share: 12, growth: 2.9, avgPrice: 4200 },
        { name: 'Specialty Crops', share: 5, growth: 6.2, avgPrice: 18500 }
      ],
      yearlyData: [
        { year: '2020', value: 33, growth: 1.2 },
        { year: '2021', value: 34, growth: 3.0 },
        { year: '2022', value: 35, growth: 2.9 },
        { year: '2023', value: 36, growth: 2.9 },
        { year: '2024', value: 37, growth: 3.8 }
      ]
    },
    development: {
      marketSize: "$16B",
      yoyGrowth: "6.2%", 
      segments: [
        { name: 'Residential Estates', share: 65, growth: 6.8, avgPrice: 285000 },
        { name: 'Rural Residential', share: 25, growth: 5.1, avgPrice: 185000 },
        { name: 'Tourist Development', share: 8, growth: 8.2, avgPrice: 420000 },
        { name: 'Industrial Estates', share: 2, growth: 4.5, avgPrice: 125000 }
      ],
      yearlyData: [
        { year: '2020', value: 13, growth: 1.8 },
        { year: '2021', value: 14, growth: 7.7 },
        { year: '2022', value: 15, growth: 7.1 },
        { year: '2023', value: 15, growth: 0.0 },
        { year: '2024', value: 16, growth: 6.2 }
      ]
    }
  };
  
  return regionalData[propertyType as keyof typeof regionalData] || {
    marketSize: "$0B", yoyGrowth: "0%", segments: [], yearlyData: []
  };
};

export const PropertyMarketSegmentAnalysis = ({ propertyType, geographicLevel }: PropertyMarketSegmentAnalysisProps) => {
  const data = getMarketData(propertyType, geographicLevel);

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