/**
 * Property Class Analysis - Comprehensive Market Analysis by Property Type
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Home, Store, Warehouse, Hotel, ShoppingCart } from "lucide-react";
import { PropertyMarketSegmentAnalysis } from "@/components/PropertyMarketSegmentAnalysis";
import { PropertyRentalAnalysis } from "@/components/PropertyRentalAnalysis";
import { PropertyMarketValueAnalysis } from "@/components/PropertyMarketValueAnalysis";
import { PropertySaleVolumesAnalysis } from "@/components/PropertySaleVolumesAnalysis";
import { PropertySWOTAnalysis } from "@/components/PropertySWOTAnalysis";
import { PropertyPESTELAnalysis } from "@/components/PropertyPESTELAnalysis";

type PropertyType = 'office' | 'retail' | 'industrial' | 'residential' | 'hospitality' | 'mixed';

const propertyTypes = [
  { id: 'office', name: 'Office', icon: Building2, color: 'primary' },
  { id: 'retail', name: 'Retail', icon: Store, color: 'success' },
  { id: 'industrial', name: 'Industrial', icon: Warehouse, color: 'info' },
  { id: 'residential', name: 'Residential', icon: Home, color: 'warning' },
  { id: 'hospitality', name: 'Hospitality', icon: Hotel, color: 'destructive' },
  { id: 'mixed', name: 'Mixed Use', icon: ShoppingCart, color: 'secondary' },
];

export const PropertyClassAnalysis = () => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>('office');
  const [analysisType, setAnalysisType] = useState<string>('market-segment');

  const selectedPropertyData = propertyTypes.find(p => p.id === selectedProperty);

  return (
    <div className="space-y-6">
      {/* Property Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Class Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {propertyTypes.map((property) => {
              const Icon = property.icon;
              const isSelected = selectedProperty === property.id;
              return (
                <button
                  key={property.id}
                  onClick={() => setSelectedProperty(property.id as PropertyType)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected 
                      ? `border-${property.color} bg-${property.color}/10` 
                      : 'border-muted hover:border-accent'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    isSelected ? `text-${property.color}` : 'text-muted-foreground'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? `text-${property.color}` : 'text-foreground'
                  }`}>
                    {property.name}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Property Header */}
      <div className="flex items-center gap-3">
        {selectedPropertyData && (
          <>
            <selectedPropertyData.icon className={`h-8 w-8 text-${selectedPropertyData.color}`} />
            <div>
              <h2 className="text-2xl font-bold">{selectedPropertyData.name} Property Analysis</h2>
              <p className="text-muted-foreground">Comprehensive market analysis and performance metrics</p>
            </div>
          </>
        )}
        <Badge variant="outline" className="ml-auto">
          2024 Data
        </Badge>
      </div>

      {/* Analysis Type Tabs */}
      <Tabs value={analysisType} onValueChange={setAnalysisType}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="market-segment">Market Segment</TabsTrigger>
          <TabsTrigger value="rental">Rental Analysis</TabsTrigger>
          <TabsTrigger value="market-value">Market Value</TabsTrigger>
          <TabsTrigger value="sale-volumes">Sale Volumes</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          <TabsTrigger value="pestel">PESTEL Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="market-segment" className="mt-6">
          <PropertyMarketSegmentAnalysis propertyType={selectedProperty} />
        </TabsContent>

        <TabsContent value="rental" className="mt-6">
          <PropertyRentalAnalysis propertyType={selectedProperty} />
        </TabsContent>

        <TabsContent value="market-value" className="mt-6">
          <PropertyMarketValueAnalysis propertyType={selectedProperty} />
        </TabsContent>

        <TabsContent value="sale-volumes" className="mt-6">
          <PropertySaleVolumesAnalysis propertyType={selectedProperty} />
        </TabsContent>

        <TabsContent value="swot" className="mt-6">
          <PropertySWOTAnalysis propertyType={selectedProperty} />
        </TabsContent>

        <TabsContent value="pestel" className="mt-6">
          <PropertyPESTELAnalysis propertyType={selectedProperty} />
        </TabsContent>
      </Tabs>
    </div>
  );
};