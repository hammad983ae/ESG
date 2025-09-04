/**
 * Economic Activity Analysis - Year-on-Year Data & CAGR
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Comprehensive economic activity tracking with sector performance analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, DollarSign, Globe, Activity } from "lucide-react";
import { CommoditySectorAnalysis } from "@/components/CommoditySectorAnalysis";
import { EconomicSectorPerformance } from "@/components/EconomicSectorPerformance";

const EconomicActivity = () => {
  const [activeTab, setActiveTab] = useState<'commodities' | 'sectors'>('commodities');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  Economic Activity Analysis
                </h1>
                <p className="text-lg text-muted-foreground">
                  Year-on-Year Data & CAGR Performance Tracking
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Real-Time Data
            </Badge>
            <Badge variant="outline">2024 Analysis</Badge>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">GDP Growth</span>
              </div>
              <p className="text-2xl font-bold text-success">3.2%</p>
              <p className="text-sm text-muted-foreground">YoY (Q4 2024)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-info" />
                <span className="text-sm font-medium">Export Value</span>
              </div>
              <p className="text-2xl font-bold text-info">$485B</p>
              <p className="text-sm text-muted-foreground">+8.5% YoY</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Trade Balance</span>
              </div>
              <p className="text-2xl font-bold text-warning">$124B</p>
              <p className="text-sm text-muted-foreground">+12.3% YoY</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Sector CAGR</span>
              </div>
              <p className="text-2xl font-bold text-primary">5.7%</p>
              <p className="text-sm text-muted-foreground">5-Year Avg</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'commodities' | 'sectors')}>
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
            <TabsTrigger value="commodities" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Commodity Analysis
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Economic Sectors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commodities" className="mt-8">
            <CommoditySectorAnalysis />
          </TabsContent>

          <TabsContent value="sectors" className="mt-8">
            <EconomicSectorPerformance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EconomicActivity;