/**
 * Economic Sector Performance Analysis
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Building2, Factory, Truck, Home, Banknote, Users, Stethoscope, GraduationCap } from "lucide-react";

interface SectorData {
  name: string;
  icon: React.ReactNode;
  gdpContribution: number;
  employmentShare: number;
  yoyGrowth: number;
  cagr5yr: number;
  exportShare: number;
  productivity: number;
  color: string;
  yearData: {
    year: number;
    gdpValue: number;
    employment: number;
    productivity: number;
    growth: number;
  }[];
}

const sectorsData: SectorData[] = [
  {
    name: "Mining",
    icon: <Factory className="h-5 w-5" />,
    gdpContribution: 13.2,
    employmentShare: 2.1,
    yoyGrowth: 8.7,
    cagr5yr: 12.4,
    exportShare: 67.8,
    productivity: 485.2,
    color: "orange",
    yearData: [
      { year: 2020, gdpValue: 187.5, employment: 245, productivity: 398.3, growth: -2.1 },
      { year: 2021, gdpValue: 215.8, employment: 251, productivity: 425.7, growth: 15.1 },
      { year: 2022, gdpValue: 234.2, employment: 258, productivity: 448.2, growth: 8.5 },
      { year: 2023, gdpValue: 221.8, employment: 263, productivity: 465.1, growth: -5.3 },
      { year: 2024, gdpValue: 241.1, employment: 268, productivity: 485.2, growth: 8.7 }
    ]
  },
  {
    name: "Agriculture",
    icon: <Building2 className="h-5 w-5" />,
    gdpContribution: 2.8,
    employmentShare: 2.6,
    yoyGrowth: 4.2,
    cagr5yr: 3.8,
    exportShare: 18.4,
    productivity: 98.5,
    color: "green",
    yearData: [
      { year: 2020, gdpValue: 48.2, employment: 312, productivity: 84.2, growth: -8.4 },
      { year: 2021, gdpValue: 52.1, employment: 318, productivity: 87.9, growth: 8.1 },
      { year: 2022, gdpValue: 55.8, employment: 324, productivity: 92.1, growth: 7.1 },
      { year: 2023, gdpValue: 54.3, employment: 328, productivity: 95.2, growth: -2.7 },
      { year: 2024, gdpValue: 56.6, employment: 332, productivity: 98.5, growth: 4.2 }
    ]
  },
  {
    name: "Manufacturing",
    icon: <Factory className="h-5 w-5" />,
    gdpContribution: 6.4,
    employmentShare: 7.8,
    yoyGrowth: 2.3,
    cagr5yr: 1.8,
    exportShare: 8.7,
    productivity: 152.3,
    color: "blue",
    yearData: [
      { year: 2020, gdpValue: 108.5, employment: 978, productivity: 142.1, growth: -6.2 },
      { year: 2021, gdpValue: 112.8, employment: 985, productivity: 145.8, growth: 4.0 },
      { year: 2022, gdpValue: 115.2, employment: 991, productivity: 148.2, growth: 2.1 },
      { year: 2023, gdpValue: 114.7, employment: 996, productivity: 149.8, growth: -0.4 },
      { year: 2024, gdpValue: 117.3, employment: 1001, productivity: 152.3, growth: 2.3 }
    ]
  },
  {
    name: "Construction",
    icon: <Home className="h-5 w-5" />,
    gdpContribution: 7.9,
    employmentShare: 9.2,
    yoyGrowth: -1.8,
    cagr5yr: 2.4,
    exportShare: 0.3,
    productivity: 124.8,
    color: "yellow",
    yearData: [
      { year: 2020, gdpValue: 132.4, employment: 1148, productivity: 115.2, growth: -8.1 },
      { year: 2021, gdpValue: 142.8, employment: 1165, productivity: 118.9, growth: 7.9 },
      { year: 2022, gdpValue: 148.2, employment: 1182, productivity: 121.7, growth: 3.8 },
      { year: 2023, gdpValue: 147.9, employment: 1194, productivity: 122.9, growth: -0.2 },
      { year: 2024, gdpValue: 145.2, employment: 1201, productivity: 124.8, growth: -1.8 }
    ]
  },
  {
    name: "Financial Services",
    icon: <Banknote className="h-5 w-5" />,
    gdpContribution: 9.1,
    employmentShare: 4.2,
    yoyGrowth: 5.4,
    cagr5yr: 4.7,
    exportShare: 2.8,
    productivity: 412.5,
    color: "purple",
    yearData: [
      { year: 2020, gdpValue: 152.8, employment: 524, productivity: 368.2, growth: 2.1 },
      { year: 2021, gdpValue: 161.4, employment: 531, productivity: 385.7, growth: 5.6 },
      { year: 2022, gdpValue: 168.9, employment: 538, productivity: 398.1, growth: 4.6 },
      { year: 2023, gdpValue: 172.1, employment: 542, productivity: 405.8, growth: 1.9 },
      { year: 2024, gdpValue: 181.4, employment: 547, productivity: 412.5, growth: 5.4 }
    ]
  },
  {
    name: "Tourism & Hospitality",
    icon: <Users className="h-5 w-5" />,
    gdpContribution: 3.1,
    employmentShare: 6.8,
    yoyGrowth: 12.8,
    cagr5yr: -2.1,
    exportShare: 8.9,
    productivity: 68.9,
    color: "pink",
    yearData: [
      { year: 2020, gdpValue: 41.2, employment: 742, productivity: 55.5, growth: -27.8 },
      { year: 2021, gdpValue: 35.8, employment: 698, productivity: 51.3, growth: -13.1 },
      { year: 2022, gdpValue: 48.7, employment: 721, productivity: 58.9, growth: 36.0 },
      { year: 2023, gdpValue: 54.9, employment: 756, productivity: 63.2, growth: 12.7 },
      { year: 2024, gdpValue: 61.9, employment: 785, productivity: 68.9, growth: 12.8 }
    ]
  },
  {
    name: "Healthcare",
    icon: <Stethoscope className="h-5 w-5" />,
    gdpContribution: 7.2,
    employmentShare: 13.1,
    yoyGrowth: 3.8,
    cagr5yr: 4.2,
    exportShare: 0.8,
    productivity: 98.7,
    color: "red",
    yearData: [
      { year: 2020, gdpValue: 118.5, employment: 1542, productivity: 89.2, growth: 6.2 },
      { year: 2021, gdpValue: 125.8, employment: 1578, productivity: 92.1, growth: 6.2 },
      { year: 2022, gdpValue: 131.2, employment: 1612, productivity: 94.8, growth: 4.3 },
      { year: 2023, gdpValue: 134.9, employment: 1648, productivity: 96.7, growth: 2.8 },
      { year: 2024, gdpValue: 140.0, employment: 1684, productivity: 98.7, growth: 3.8 }
    ]
  },
  {
    name: "Education",
    icon: <GraduationCap className="h-5 w-5" />,
    gdpContribution: 5.3,
    employmentShare: 8.4,
    yoyGrowth: 2.1,
    cagr5yr: 2.8,
    exportShare: 3.2,
    productivity: 112.4,
    color: "indigo",
    yearData: [
      { year: 2020, gdpValue: 85.2, employment: 984, productivity: 102.8, growth: 1.8 },
      { year: 2021, gdpValue: 88.4, employment: 998, productivity: 105.2, growth: 3.8 },
      { year: 2022, gdpValue: 91.1, employment: 1012, productivity: 107.9, growth: 3.1 },
      { year: 2023, gdpValue: 92.8, employment: 1026, productivity: 110.1, growth: 1.9 },
      { year: 2024, gdpValue: 94.7, employment: 1041, productivity: 112.4, growth: 2.1 }
    ]
  }
];

export function EconomicSectorPerformance() {
  const [sortBy, setSortBy] = useState<string>("gdpContribution");
  const [activeView, setActiveView] = useState<string>("overview");

  const sortedSectors = [...sectorsData].sort((a, b) => {
    switch (sortBy) {
      case "yoyGrowth":
        return Math.abs(b.yoyGrowth) - Math.abs(a.yoyGrowth);
      case "cagr5yr":
        return b.cagr5yr - a.cagr5yr;
      case "gdpContribution":
        return b.gdpContribution - a.gdpContribution;
      case "employmentShare":
        return b.employmentShare - a.employmentShare;
      case "productivity":
        return b.productivity - a.productivity;
      default:
        return 0;
    }
  });

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? "text-success" : "text-destructive";
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      orange: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
      green: "from-green-500/10 to-green-500/5 border-green-500/20",
      blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
      yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
      purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
      pink: "from-pink-500/10 to-pink-500/5 border-pink-500/20",
      red: "from-red-500/10 to-red-500/5 border-red-500/20",
      indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20"
    };
    return colorMap[color] || "from-gray-500/10 to-gray-500/5 border-gray-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gdpContribution">GDP Contribution</SelectItem>
              <SelectItem value="employmentShare">Employment Share</SelectItem>
              <SelectItem value="yoyGrowth">YoY Growth</SelectItem>
              <SelectItem value="cagr5yr">5-Year CAGR</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Total GDP: $1.83T | Total Employment: 12.8M
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="overview">Sector Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4">
            {sortedSectors.map((sector, index) => (
              <Card 
                key={sector.name} 
                className={`bg-gradient-to-br ${getColorClass(sector.color)} hover:shadow-md transition-all duration-200`}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center">
                    {/* Sector Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full">
                          {sector.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{sector.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Rank #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GDP Contribution */}
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {sector.gdpContribution.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">GDP Share</p>
                      <Progress 
                        value={sector.gdpContribution} 
                        className="w-20 h-2 mt-1 mx-auto" 
                      />
                    </div>

                    {/* Employment */}
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {sector.employmentShare.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Employment</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(sector.employmentShare * 128).toFixed(0)}k jobs
                      </p>
                    </div>

                    {/* YoY Growth */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getTrendIcon(sector.yoyGrowth)}
                        <span className={`text-lg font-bold ${getTrendColor(sector.yoyGrowth)}`}>
                          {sector.yoyGrowth > 0 ? "+" : ""}{sector.yoyGrowth.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">YoY Growth</p>
                    </div>

                    {/* 5-Year CAGR */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getTrendIcon(sector.cagr5yr)}
                        <span className={`text-lg font-bold ${getTrendColor(sector.cagr5yr)}`}>
                          {sector.cagr5yr > 0 ? "+" : ""}{sector.cagr5yr.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">5-Yr CAGR</p>
                    </div>

                    {/* Productivity */}
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        ${sector.productivity.toFixed(0)}k
                      </p>
                      <p className="text-sm text-muted-foreground">Per Worker</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Export: {sector.exportShare.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {sortedSectors.map((sector) => (
              <Card key={sector.name} className={`bg-gradient-to-br ${getColorClass(sector.color)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {sector.icon}
                    {sector.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">GDP Value</p>
                        <p className="text-xl font-bold">
                          ${(sector.gdpContribution * 18.3).toFixed(0)}B
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Employment</p>
                        <p className="text-xl font-bold">
                          {(sector.employmentShare * 1.28).toFixed(1)}M
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white/10 rounded">
                        <p className={`text-lg font-bold ${getTrendColor(sector.yoyGrowth)}`}>
                          {sector.yoyGrowth > 0 ? "+" : ""}{sector.yoyGrowth.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">YoY</p>
                      </div>
                      <div className="p-2 bg-white/10 rounded">
                        <p className={`text-lg font-bold ${getTrendColor(sector.cagr5yr)}`}>
                          {sector.cagr5yr > 0 ? "+" : ""}{sector.cagr5yr.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">CAGR</p>
                      </div>
                      <div className="p-2 bg-white/10 rounded">
                        <p className="text-lg font-bold">
                          ${sector.productivity.toFixed(0)}k
                        </p>
                        <p className="text-xs text-muted-foreground">Productivity</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Export Share</span>
                        <span>{sector.exportShare.toFixed(1)}%</span>
                      </div>
                      <Progress value={sector.exportShare} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <div className="space-y-6">
            {sortedSectors.map((sector) => (
              <Card key={sector.name} className={`bg-gradient-to-br ${getColorClass(sector.color)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {sector.icon}
                    {sector.name} - Historical Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {sector.yearData.map((year, index) => (
                      <div key={year.year} className="text-center">
                        <div className="font-semibold text-lg mb-2">{year.year}</div>
                        <div className="space-y-2 p-3 bg-white/10 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">GDP Value</p>
                            <p className="font-semibold">${year.gdpValue.toFixed(0)}B</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Employment</p>
                            <p className="font-semibold">{year.employment}k</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Growth</p>
                            <p className={`font-semibold ${getTrendColor(year.growth)}`}>
                              {year.growth > 0 ? "+" : ""}{year.growth.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Productivity</p>
                            <p className="font-semibold">${year.productivity.toFixed(0)}k</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}