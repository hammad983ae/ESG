/**
 * Property Sale Volumes Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, ShoppingCart, Calendar, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';

interface PropertySaleVolumesAnalysisProps {
  propertyType: string;
  geographicLevel: string;
}

const getSalesData = (propertyType: string) => {
  const baseData = {
    office: {
      totalVolume: "$24.5B",
      transactionCount: "1,247",
      avgDealSize: "$19.6M",
      yoyVolumeChange: "+7.4%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 5.2, transactions: 285, avgSize: 18.2, days: 145 },
        { quarter: 'Q2 2023', volume: 6.1, transactions: 320, avgSize: 19.1, days: 138 },
        { quarter: 'Q3 2023', volume: 5.8, transactions: 298, avgSize: 19.5, days: 142 },
        { quarter: 'Q4 2023', volume: 5.7, transactions: 294, avgSize: 19.4, days: 148 },
        { quarter: 'Q1 2024', volume: 5.9, transactions: 310, avgSize: 19.0, days: 135 },
        { quarter: 'Q2 2024', volume: 6.8, transactions: 345, avgSize: 19.7, days: 132 },
        { quarter: 'Q3 2024', volume: 6.2, transactions: 315, avgSize: 19.7, days: 128 },
        { quarter: 'Q4 2024', volume: 5.6, transactions: 277, avgSize: 20.2, days: 141 }
      ],
      sizeSegments: [
        { segment: 'Major Deals (>$50M)', volume: 8.9, count: 45, percentage: 36 },
        { segment: 'Large Deals ($20M-$50M)', volume: 7.2, count: 158, percentage: 29 },
        { segment: 'Mid Deals ($5M-$20M)', volume: 5.8, count: 385, percentage: 24 },
        { segment: 'Small Deals (<$5M)', volume: 2.6, count: 659, percentage: 11 }
      ]
    },
    retail: {
      totalVolume: "$18.3B",
      transactionCount: "2,156",
      avgDealSize: "$8.5M",
      yoyVolumeChange: "+4.2%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 4.1, transactions: 485, avgSize: 8.5, days: 125 },
        { quarter: 'Q2 2023', volume: 4.8, transactions: 520, avgSize: 9.2, days: 118 },
        { quarter: 'Q3 2023', volume: 4.4, transactions: 498, avgSize: 8.8, days: 122 },
        { quarter: 'Q4 2023', volume: 4.2, transactions: 485, avgSize: 8.7, days: 128 },
        { quarter: 'Q1 2024', volume: 4.3, transactions: 510, avgSize: 8.4, days: 115 },
        { quarter: 'Q2 2024', volume: 5.1, transactions: 565, avgSize: 9.0, days: 112 },
        { quarter: 'Q3 2024', volume: 4.7, transactions: 542, avgSize: 8.7, days: 108 },
        { quarter: 'Q4 2024', volume: 4.2, transactions: 539, avgSize: 7.8, days: 118 }
      ],
      sizeSegments: [
        { segment: 'Shopping Centers (>$25M)', volume: 7.8, count: 28, percentage: 43 },
        { segment: 'Large Retail ($10M-$25M)', volume: 5.2, count: 95, percentage: 28 },
        { segment: 'Mid Retail ($2M-$10M)', volume: 3.8, count: 485, percentage: 21 },
        { segment: 'Small Retail (<$2M)', volume: 1.5, count: 1548, percentage: 8 }
      ]
    },
    industrial: {
      totalVolume: "$31.2B",
      transactionCount: "1,895",
      avgDealSize: "$16.5M",
      yoyVolumeChange: "+12.8%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 6.8, transactions: 425, avgSize: 16.0, days: 95 },
        { quarter: 'Q2 2023', volume: 7.5, transactions: 465, avgSize: 16.1, days: 88 },
        { quarter: 'Q3 2023', volume: 7.2, transactions: 448, avgSize: 16.1, days: 92 },
        { quarter: 'Q4 2023', volume: 6.4, transactions: 398, avgSize: 16.1, days: 98 },
        { quarter: 'Q1 2024', volume: 7.8, transactions: 485, avgSize: 16.1, days: 82 },
        { quarter: 'Q2 2024', volume: 8.9, transactions: 528, avgSize: 16.9, days: 78 },
        { quarter: 'Q3 2024', volume: 8.2, transactions: 498, avgSize: 16.5, days: 75 },
        { quarter: 'Q4 2024', volume: 6.3, transactions: 384, avgSize: 16.4, days: 88 }
      ],
      sizeSegments: [
        { segment: 'Logistics Hubs (>$40M)', volume: 12.8, count: 38, percentage: 41 },
        { segment: 'Large Industrial ($15M-$40M)', volume: 9.2, count: 165, percentage: 30 },
        { segment: 'Mid Industrial ($5M-$15M)', volume: 6.8, count: 425, percentage: 22 },
        { segment: 'Small Industrial (<$5M)', volume: 2.4, count: 1267, percentage: 7 }
      ]
    },
    residential: {
      totalVolume: "$420B",
      transactionCount: "485,200",
      avgDealSize: "$865K",
      yoyVolumeChange: "+5.8%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 98, transactions: 115000, avgSize: 852, days: 42 },
        { quarter: 'Q2 2023', volume: 108, transactions: 128000, avgSize: 844, days: 38 },
        { quarter: 'Q3 2023', volume: 102, transactions: 118000, avgSize: 864, days: 45 },
        { quarter: 'Q4 2023', volume: 89, transactions: 105000, avgSize: 848, days: 52 },
        { quarter: 'Q1 2024', volume: 105, transactions: 122000, avgSize: 861, days: 35 },
        { quarter: 'Q2 2024', volume: 118, transactions: 135000, avgSize: 874, days: 32 },
        { quarter: 'Q3 2024', volume: 112, transactions: 128000, avgSize: 875, days: 38 },
        { quarter: 'Q4 2024', volume: 85, transactions: 100200, avgSize: 848, days: 48 }
      ],
      sizeSegments: [
        { segment: 'Luxury (>$2M)', volume: 156, count: 48500, percentage: 37 },
        { segment: 'Premium ($1M-$2M)', volume: 142, count: 98500, percentage: 34 },
        { segment: 'Mid-Market ($600K-$1M)', volume: 89, count: 148000, percentage: 21 },
        { segment: 'Affordable (<$600K)', volume: 33, count: 190200, percentage: 8 }
      ]
    },
    hospitality: {
      totalVolume: "$8.9B",
      transactionCount: "185",
      avgDealSize: "$48.1M",
      yoyVolumeChange: "+15.2%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 1.8, transactions: 38, avgSize: 47.4, days: 185 },
        { quarter: 'Q2 2023', volume: 2.2, transactions: 45, avgSize: 48.9, days: 175 },
        { quarter: 'Q3 2023', volume: 1.9, transactions: 42, avgSize: 45.2, days: 182 },
        { quarter: 'Q4 2023', volume: 1.8, transactions: 38, avgSize: 47.4, days: 198 },
        { quarter: 'Q1 2024', volume: 2.1, transactions: 42, avgSize: 50.0, days: 165 },
        { quarter: 'Q2 2024', volume: 2.8, transactions: 54, avgSize: 51.9, days: 158 },
        { quarter: 'Q3 2024', volume: 2.4, transactions: 48, avgSize: 50.0, days: 162 },
        { quarter: 'Q4 2024', volume: 1.6, transactions: 41, avgSize: 39.0, days: 178 }
      ],
      sizeSegments: [
        { segment: 'Resort/Casino (>$100M)', volume: 4.2, count: 12, percentage: 47 },
        { segment: 'Major Hotels ($50M-$100M)', volume: 2.8, count: 18, percentage: 31 },
        { segment: 'Mid Hotels ($20M-$50M)', volume: 1.5, count: 45, percentage: 17 },
        { segment: 'Small Hotels (<$20M)', volume: 0.4, count: 110, percentage: 5 }
      ]
    },
    mixed: {
      totalVolume: "$12.8B",
      transactionCount: "485",
      avgDealSize: "$26.4M",
      yoyVolumeChange: "+8.9%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 2.8, transactions: 108, avgSize: 25.9, days: 155 },
        { quarter: 'Q2 2023', volume: 3.2, transactions: 125, avgSize: 25.6, days: 148 },
        { quarter: 'Q3 2023', volume: 2.9, transactions: 115, avgSize: 25.2, days: 152 },
        { quarter: 'Q4 2023', volume: 2.9, transactions: 112, avgSize: 25.9, days: 165 },
        { quarter: 'Q1 2024', volume: 3.1, transactions: 118, avgSize: 26.3, days: 142 },
        { quarter: 'Q2 2024', volume: 3.8, transactions: 135, avgSize: 28.1, days: 138 },
        { quarter: 'Q3 2024', volume: 3.4, transactions: 128, avgSize: 26.6, days: 135 },
        { quarter: 'Q4 2024', volume: 2.5, transactions: 104, avgSize: 24.0, days: 158 }
      ],
      sizeSegments: [
        { segment: 'Major Mixed-Use (>$75M)', volume: 5.8, count: 18, percentage: 45 },
        { segment: 'Urban Mixed ($25M-$75M)', volume: 4.2, count: 48, percentage: 33 },
        { segment: 'Mid Mixed ($10M-$25M)', volume: 2.1, count: 85, percentage: 16 },
        { segment: 'Small Mixed (<$10M)', volume: 0.7, count: 334, percentage: 6 }
      ]
    },
    agricultural: {
      totalVolume: "$28.5B",
      transactionCount: "12,485",
      avgDealSize: "$2.28M",
      yoyVolumeChange: "+4.2%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 6.8, transactions: 2850, avgSize: 2.39, days: 185 },
        { quarter: 'Q2 2023', volume: 7.2, transactions: 3125, avgSize: 2.31, days: 165 },
        { quarter: 'Q3 2023', volume: 6.9, transactions: 2985, avgSize: 2.31, days: 175 },
        { quarter: 'Q4 2023', volume: 6.4, transactions: 2685, avgSize: 2.38, days: 198 },
        { quarter: 'Q1 2024', volume: 7.1, transactions: 3058, avgSize: 2.32, days: 168 },
        { quarter: 'Q2 2024', volume: 7.8, transactions: 3485, avgSize: 2.24, days: 152 },
        { quarter: 'Q3 2024', volume: 7.5, transactions: 3285, avgSize: 2.28, days: 162 },
        { quarter: 'Q4 2024', volume: 6.1, transactions: 2657, avgSize: 2.30, days: 185 }
      ],
      sizeSegments: [
        { segment: 'Large Farms (>$5M)', volume: 12.8, count: 485, percentage: 45 },
        { segment: 'Medium Farms ($1M-$5M)', volume: 9.2, count: 2850, percentage: 32 },
        { segment: 'Small Farms ($500K-$1M)', volume: 4.8, count: 4250, percentage: 17 },
        { segment: 'Lifestyle Blocks (<$500K)', volume: 1.7, count: 4900, percentage: 6 }
      ]
    },
    development: {
      totalVolume: "$89.2B",
      transactionCount: "3,285",
      avgDealSize: "$27.2M",
      yoyVolumeChange: "+15.8%",
      volumeHistory: [
        { quarter: 'Q1 2023', volume: 18.5, transactions: 745, avgSize: 24.8, days: 285 },
        { quarter: 'Q2 2023', volume: 21.2, transactions: 825, avgSize: 25.7, days: 265 },
        { quarter: 'Q3 2023', volume: 19.8, transactions: 785, avgSize: 25.2, days: 275 },
        { quarter: 'Q4 2023', volume: 17.3, transactions: 695, avgSize: 24.9, days: 295 },
        { quarter: 'Q1 2024', volume: 20.8, transactions: 758, avgSize: 27.4, days: 245 },
        { quarter: 'Q2 2024', volume: 25.2, transactions: 885, avgSize: 28.5, days: 225 },
        { quarter: 'Q3 2024', volume: 23.5, transactions: 845, avgSize: 27.8, days: 235 },
        { quarter: 'Q4 2024', volume: 19.7, transactions: 797, avgSize: 24.7, days: 268 }
      ],
      sizeSegments: [
        { segment: 'Major Developments (>$100M)', volume: 38.5, count: 28, percentage: 43 },
        { segment: 'Large Projects ($25M-$100M)', volume: 28.2, count: 185, percentage: 32 },
        { segment: 'Medium Developments ($5M-$25M)', volume: 16.8, count: 785, percentage: 19 },
        { segment: 'Small Parcels (<$5M)', volume: 5.7, count: 2287, percentage: 6 }
      ]
    }
  };
  
  return baseData[propertyType as keyof typeof baseData] || baseData.office;
};

export const PropertySaleVolumesAnalysis = ({ propertyType, geographicLevel }: PropertySaleVolumesAnalysisProps) => {
  const data = getSalesData(propertyType);

  return (
    <div className="space-y-6">
      {/* Key Volume Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Volume</span>
            </div>
            <p className="text-2xl font-bold text-primary">{data.totalVolume}</p>
            <p className="text-sm text-muted-foreground">2024 Sales</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Transactions</span>
            </div>
            <p className="text-2xl font-bold text-success">{data.transactionCount}</p>
            <p className="text-sm text-muted-foreground">Total Deals</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Avg Deal Size</span>
            </div>
            <p className="text-2xl font-bold text-info">{data.avgDealSize}</p>
            <p className="text-sm text-muted-foreground">Per Transaction</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">YoY Change</span>
            </div>
            <p className="text-2xl font-bold text-warning">{data.yoyVolumeChange}</p>
            <p className="text-sm text-muted-foreground">Volume Growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Volume History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quarterly Sales Volume Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={data.volumeHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'volume') return [`$${value}B`, 'Sales Volume'];
                  if (name === 'transactions') return [value?.toLocaleString(), 'Transactions'];
                  if (name === 'avgSize') return [
                    propertyType === 'residential' ? `$${(value as number).toLocaleString()}K` : `$${value}M`, 
                    'Avg Deal Size'
                  ];
                  if (name === 'days') return [`${value} days`, 'Days on Market'];
                  return [value, name];
                }}
              />
              <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--primary))" opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="hsl(var(--success))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="days" stroke="hsl(var(--warning))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Deal Size Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Volume by Deal Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.sizeSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{segment.segment}</p>
                    <Badge variant={segment.percentage >= 30 ? "default" : "secondary"}>
                      {segment.percentage}% of volume
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {segment.count.toLocaleString()} transactions
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2 max-w-48">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(segment.percentage * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold">
                    ${segment.volume}B
                  </p>
                  <p className="text-sm text-muted-foreground">Volume</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Market Activity Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Volume Trends</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Peak activity in Q2 2024 with strong institutional demand</li>
                <li>• {propertyType === 'industrial' ? 'Logistics and distribution driving growth' : 
                    propertyType === 'hospitality' ? 'Tourism recovery fueling investment' :
                    propertyType === 'residential' ? 'First home buyer activity increasing' :
                    'Corporate relocations supporting demand'}</li>
                <li>• Foreign investment remains {parseFloat(data.yoyVolumeChange.replace('%', '').replace('+', '')) > 5 ? 'strong' : 'moderate'}</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-success">Market Dynamics</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Average time on market: {data.volumeHistory[data.volumeHistory.length - 1]?.days || 'N/A'} days</li>
                <li>• Deal competition remains {parseFloat(data.yoyVolumeChange.replace('%', '').replace('+', '')) > 8 ? 'intense' : 'moderate'}</li>
                <li>• Premium assets commanding strong pricing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};