/**
 * Delorenzo Property Group - Agricultural Hub
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Agricultural and horticultural property assessment platform
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sprout, Droplets, Tractor, Apple, Wheat, TreePine, Flower2, Grape, BarChart3, BookOpen, ArrowLeft, Leaf } from "lucide-react";
import { CropValuationForm } from "@/components/CropValuationForm";
import { OrchardValuationForm } from "@/components/OrchardValuationForm";
import { VineyardValuationForm } from "@/components/VineyardValuationForm";
import { PastureValuationForm } from "@/components/PastureValuationForm";
import { HorticultureValuationForm } from "@/components/HorticultureValuationForm";
import { CommodityMarketAnalysis } from "@/components/CommodityMarketAnalysis";
import { MixedFarmForm } from "@/components/MixedFarmForm";
import { ManagementDiary } from "@/components/ManagementDiary";
import { YieldExpectationDisplay } from "@/components/YieldExpectationDisplay";
import { CarbonCreditCalculator } from "@/components/CarbonCreditCalculator";
import { useNavigate } from "react-router-dom";

const AgriculturalHub = () => {
  const navigate = useNavigate();
  const [activePropertyType, setActivePropertyType] = useState("management-diary");

  const propertyTypes = [
    {
      id: "management-diary",
      name: "Management Diary",
      icon: BookOpen,
      description: "Farm operations tracking and expense management",
      examples: ["Spray Programs", "Yields", "Labor", "Expenses"]
    },
    {
      id: "carbon-credits",
      name: "Carbon Credits",
      icon: Leaf,
      description: "Carbon credit swap calculations and tax savings",
      examples: ["Swap Values", "Tax Savings", "Credit Pricing", "Portfolio Analysis"]
    },
    {
      id: "market-analysis",
      name: "Market Intelligence",
      icon: BarChart3,
      description: "AI-powered commodity forecasting and export analysis",
      examples: ["Supply/Demand", "Exchange Rates", "Export Tariffs", "Price Forecasts"]
    },
    {
      id: "mixed-farm",
      name: "Mixed Farm Operations",
      icon: Tractor,
      description: "Multi-property and multi-crop management",
      examples: ["Multiple Properties", "Custom Varieties", "Mixed Operations"]
    },
    {
      id: "crops",
      name: "Annual Crops",
      icon: Wheat,
      description: "Grain, cereal, and row crop operations",
      examples: ["Wheat", "Corn", "Soybeans", "Cotton", "Rice"]
    },
    {
      id: "orchard",
      name: "Orchard Operations",
      icon: Apple,
      description: "Tree fruit and nut production",
      examples: ["Apples", "Citrus", "Almonds", "Avocados", "Stone Fruits"]
    },
    {
      id: "vineyard",
      name: "Vineyard Operations",
      icon: Grape,
      description: "Grape production and wine operations",
      examples: ["Wine Grapes", "Table Grapes", "Raisins"]
    },
    {
      id: "pasture",
      name: "Pasture & Livestock",
      icon: Tractor,
      description: "Grazing land and livestock operations",
      examples: ["Cattle", "Sheep", "Dairy", "Hay Production"]
    },
    {
      id: "horticulture",
      name: "Horticulture",
      icon: Flower2,
      description: "Vegetable, flower, and nursery operations",
      examples: ["Vegetables", "Cut Flowers", "Nursery Stock", "Herbs"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Main Dashboard Button */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/property-hub')}
            className="flex items-center gap-2 touch-manipulation min-h-[44px]"
          >
            <Sprout className="h-4 w-4" />
            Property Hub
          </Button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Agricultural Hub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive valuation platform for agricultural and horticultural properties. 
            Advanced AI-powered market intelligence, commodity forecasting, and export analysis.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge variant="secondary">™ DeLorenzoAI Market Intelligence</Badge>
            <Badge variant="outline">Patent Pending</Badge>
            <Badge variant="outline">Copyright Protected</Badge>
          </div>
        </div>

        {/* Property Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4 mb-8">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  activePropertyType === type.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:ring-1 hover:ring-muted'
                }`}
                onClick={() => setActivePropertyType(type.id)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-sm mb-2">{type.name}</h3>
                  <div className="space-y-1">
                    {type.examples.slice(0, 2).map((example) => (
                      <Badge key={example} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Droplets className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  {propertyTypes.find(t => t.id === activePropertyType)?.name} Assessment
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {propertyTypes.find(t => t.id === activePropertyType)?.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
          <Tabs value={activePropertyType} onValueChange={setActivePropertyType}>
            <TabsList className="grid w-full grid-cols-8">
              {propertyTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-xs">
                  {type.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="management-diary" className="mt-6">
              <ManagementDiary />
            </TabsContent>

            <TabsContent value="carbon-credits" className="mt-6">
              <CarbonCreditCalculator />
            </TabsContent>

            <TabsContent value="market-analysis" className="mt-6">
              <CommodityMarketAnalysis />
            </TabsContent>

              <TabsContent value="mixed-farm" className="mt-6">
                <MixedFarmForm />
              </TabsContent>

              <TabsContent value="crops" className="mt-6">
                <CropValuationForm />
              </TabsContent>

              <TabsContent value="orchard" className="mt-6">
                <OrchardValuationForm />
              </TabsContent>

              <TabsContent value="vineyard" className="mt-6">
                <VineyardValuationForm />
              </TabsContent>

              <TabsContent value="pasture" className="mt-6">
                <PastureValuationForm />
              </TabsContent>

              <TabsContent value="horticulture" className="mt-6">
                <HorticultureValuationForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgriculturalHub;