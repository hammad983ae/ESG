/**
 * Property Rental Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Users2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PropertyRentalAnalysisProps {
  propertyType: string;
}

const getRentalData = (propertyType: string) => {
  const baseData = {
    office: {
      avgRent: "$485/sqm",
      yoyChange: "+4.2%",
      vacancyRate: "8.5%",
      rentalYield: "6.2%",
      rentHistory: [
        { year: '2020', rent: 445, vacancy: 12.1, yield: 5.8 },
        { year: '2021', rent: 458, vacancy: 10.5, yield: 5.9 },
        { year: '2022', rent: 471, vacancy: 9.2, yield: 6.0 },
        { year: '2023', rent: 465, vacancy: 8.9, yield: 5.9 },
        { year: '2024', rent: 485, vacancy: 8.5, yield: 6.2 }
      ],
      submarkets: [
        { area: 'CBD Core', rent: 650, change: 5.8, vacancy: 6.2 },
        { area: 'CBD Fringe', rent: 520, change: 4.1, vacancy: 7.8 },
        { area: 'North Shore', rent: 480, change: 3.9, vacancy: 8.1 },
        { area: 'Eastern Suburbs', rent: 465, change: 4.5, vacancy: 9.2 },
        { area: 'Inner West', rent: 420, change: 3.2, vacancy: 10.5 },
        { area: 'Western Suburbs', rent: 385, change: 2.8, vacancy: 11.8 }
      ]
    },
    retail: {
      avgRent: "$4,250/sqm",
      yoyChange: "+2.8%",
      vacancyRate: "6.2%",
      rentalYield: "7.1%",
      rentHistory: [
        { year: '2020', rent: 3850, vacancy: 9.8, yield: 6.5 },
        { year: '2021', rent: 3920, vacancy: 8.2, yield: 6.7 },
        { year: '2022', rent: 4050, vacancy: 7.1, yield: 6.9 },
        { year: '2023', rent: 4135, vacancy: 6.8, yield: 7.0 },
        { year: '2024', rent: 4250, vacancy: 6.2, yield: 7.1 }
      ],
      submarkets: [
        { area: 'Major Shopping Centers', rent: 5850, change: 3.8, vacancy: 4.2 },
        { area: 'Strip Shopping', rent: 4200, change: 2.9, vacancy: 5.8 },
        { area: 'Neighborhood Centers', rent: 3950, change: 2.1, vacancy: 6.5 },
        { area: 'Bulky Goods', rent: 280, change: 1.8, vacancy: 7.2 },
        { area: 'Factory Outlets', rent: 320, change: 2.5, vacancy: 8.1 },
        { area: 'Convenience Retail', rent: 4800, change: 3.2, vacancy: 5.1 }
      ]
    },
    industrial: {
      avgRent: "$185/sqm",
      yoyChange: "+6.8%",
      vacancyRate: "3.2%",
      rentalYield: "8.4%",
      rentHistory: [
        { year: '2020', rent: 155, vacancy: 5.8, yield: 7.8 },
        { year: '2021', rent: 162, vacancy: 4.9, yield: 8.0 },
        { year: '2022', rent: 168, vacancy: 4.2, yield: 8.1 },
        { year: '2023', rent: 173, vacancy: 3.8, yield: 8.2 },
        { year: '2024', rent: 185, vacancy: 3.2, yield: 8.4 }
      ],
      submarkets: [
        { area: 'Port/Airport Precinct', rent: 220, change: 8.2, vacancy: 2.1 },
        { area: 'Major Arterial', rent: 195, change: 7.1, vacancy: 2.8 },
        { area: 'Industrial Estate', rent: 175, change: 6.5, vacancy: 3.5 },
        { area: 'Urban Fringe', rent: 165, change: 5.9, vacancy: 4.2 },
        { area: 'Secondary Location', rent: 145, change: 4.8, vacancy: 5.1 },
        { area: 'Rural Industrial', rent: 120, change: 3.2, vacancy: 6.8 }
      ]
    },
    residential: {
      avgRent: "$580/week",
      yoyChange: "+5.2%",
      vacancyRate: "2.1%",
      rentalYield: "4.8%",
      rentHistory: [
        { year: '2020', rent: 520, vacancy: 3.5, yield: 4.5 },
        { year: '2021', rent: 535, vacancy: 2.8, yield: 4.6 },
        { year: '2022', rent: 545, vacancy: 2.2, yield: 4.6 },
        { year: '2023', rent: 552, vacancy: 2.0, yield: 4.7 },
        { year: '2024', rent: 580, vacancy: 2.1, yield: 4.8 }
      ],
      submarkets: [
        { area: 'Premium Locations', rent: 850, change: 6.8, vacancy: 1.2 },
        { area: 'CBD Apartments', rent: 720, change: 5.9, vacancy: 1.8 },
        { area: 'Inner Suburbs', rent: 620, change: 5.1, vacancy: 1.9 },
        { area: 'Middle Suburbs', rent: 520, change: 4.8, vacancy: 2.2 },
        { area: 'Outer Suburbs', rent: 450, change: 4.2, vacancy: 2.8 },
        { area: 'Regional Areas', rent: 380, change: 3.5, vacancy: 3.5 }
      ]
    },
    hospitality: {
      avgRent: "$320/room/night",
      yoyChange: "+8.1%",
      vacancyRate: "22.5%",
      rentalYield: "9.2%",
      rentHistory: [
        { year: '2020', rent: 185, vacancy: 45.2, yield: 5.8 },
        { year: '2021', rent: 245, vacancy: 35.1, yield: 7.2 },
        { year: '2022', rent: 285, vacancy: 28.5, yield: 8.5 },
        { year: '2023', rent: 296, vacancy: 25.8, yield: 8.8 },
        { year: '2024', rent: 320, vacancy: 22.5, yield: 9.2 }
      ],
      submarkets: [
        { area: 'CBD Luxury', rent: 550, change: 12.1, vacancy: 18.5 },
        { area: 'CBD Business', rent: 385, change: 8.9, vacancy: 20.2 },
        { area: 'Airport Hotels', rent: 295, change: 7.8, vacancy: 22.1 },
        { area: 'Suburban Hotels', rent: 220, change: 6.5, vacancy: 25.8 },
        { area: 'Budget/Economy', rent: 165, change: 5.2, vacancy: 28.5 },
        { area: 'Extended Stay', rent: 185, change: 7.1, vacancy: 24.2 }
      ]
    },
    mixed: {
      avgRent: "$520/sqm",
      yoyChange: "+4.8%",
      vacancyRate: "5.8%",
      rentalYield: "6.8%",
      rentHistory: [
        { year: '2020', rent: 465, vacancy: 8.5, yield: 6.2 },
        { year: '2021', rent: 485, vacancy: 7.2, yield: 6.4 },
        { year: '2022', rent: 498, vacancy: 6.5, yield: 6.5 },
        { year: '2023', rent: 496, vacancy: 6.1, yield: 6.6 },
        { year: '2024', rent: 520, vacancy: 5.8, yield: 6.8 }
      ],
      submarkets: [
        { area: 'Transit Oriented', rent: 680, change: 6.2, vacancy: 4.2 },
        { area: 'Urban Mixed-Use', rent: 580, change: 5.1, vacancy: 5.1 },
        { area: 'Live/Work Spaces', rent: 495, change: 4.8, vacancy: 5.8 },
        { area: 'Mixed Retail/Res', rent: 450, change: 4.1, vacancy: 6.5 },
        { area: 'Community Hubs', rent: 420, change: 3.8, vacancy: 7.2 },
        { area: 'Suburban Mixed', rent: 385, change: 3.2, vacancy: 8.1 }
      ]
    }
  };
  
  return baseData[propertyType as keyof typeof baseData] || baseData.office;
};

export const PropertyRentalAnalysis = ({ propertyType }: PropertyRentalAnalysisProps) => {
  const data = getRentalData(propertyType);

  return (
    <div className="space-y-6">
      {/* Key Rental Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Average Rent</span>
            </div>
            <p className="text-2xl font-bold text-primary">{data.avgRent}</p>
            <p className="text-sm text-muted-foreground">Current Market Rate</p>
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

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users2 className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Vacancy Rate</span>
            </div>
            <p className="text-2xl font-bold text-warning">{data.vacancyRate}</p>
            <p className="text-sm text-muted-foreground">Current Quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Rental Yield</span>
            </div>
            <p className="text-2xl font-bold text-info">{data.rentalYield}</p>
            <p className="text-sm text-muted-foreground">Average Return</p>
          </CardContent>
        </Card>
      </div>

      {/* Rental History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Year Rental Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data.rentHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'rent') return [`$${value}${propertyType === 'hospitality' ? '/night' : propertyType === 'residential' ? '/week' : '/sqm'}`, 'Average Rent'];
                  if (name === 'vacancy') return [`${value}%`, 'Vacancy Rate'];
                  if (name === 'yield') return [`${value}%`, 'Rental Yield'];
                  return [value, name];
                }}
              />
              <Area yAxisId="left" type="monotone" dataKey="rent" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              <Line yAxisId="right" type="monotone" dataKey="vacancy" stroke="hsl(var(--warning))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="yield" stroke="hsl(var(--success))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Submarket Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Submarket Rental Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.submarkets.map((submarket, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{submarket.area}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant={submarket.change >= 4 ? "default" : "secondary"}>
                      {submarket.change >= 0 ? '+' : ''}{submarket.change}% YoY
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {submarket.vacancy}% Vacancy
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    ${submarket.rent.toLocaleString()}{propertyType === 'hospitality' ? '/night' : propertyType === 'residential' ? '/week' : '/sqm'}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Rent</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};