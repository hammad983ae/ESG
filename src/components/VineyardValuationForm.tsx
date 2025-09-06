/**
 * Delorenzo Property Group - Vineyard Valuation Form
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Grape, Droplets, Wine, Sun, Shield, Calculator } from "lucide-react";
import { OCRUpload } from "./OCRUpload";
import { VarietyManager } from "./VarietyManager";
import { convertAcreage, calculateWaterForecast, formatAreaDisplay, formatWaterDisplay } from "@/utils/conversionUtils";

const vineyardSchema = z.object({
  property_address: z.string().min(1, "Property address is required"),
  total_area: z.number().min(0.1, "Total area must be greater than 0"),
  grape_varieties: z.array(z.string()).min(1, "At least one grape variety is required"),
  clone_selection: z.string().optional(),
  planting_year: z.number().min(1900, "Valid planting year required"),
  vine_age: z.number().min(0, "Vine age must be 0 or greater"),
  vines_per_acre: z.number().min(1, "Vines per acre must be at least 1"),
  row_spacing: z.number().min(0, "Row spacing must be 0 or greater"),
  vine_spacing: z.number().min(0, "Vine spacing must be 0 or greater"),
  trellis_system: z.string().min(1, "Trellis system is required"),
  hail_netting: z.boolean().default(false),
  hail_netting_coverage: z.number().min(0).max(100).default(0),
  irrigation_type: z.string().min(1, "Irrigation type is required"),
  irrigation_coverage: z.number().min(0).max(100),
  irrigation_zone: z.string().min(1, "Irrigation zone is required"),
  soil_type: z.string().min(1, "Soil type is required"),
  climate_zone: z.string().min(1, "Climate zone is required"),
  yield_per_vine: z.number().min(0, "Yield must be 0 or greater"),
  price_per_ton: z.number().min(0, "Price must be 0 or greater"),
  production_costs: z.number().min(0, "Costs must be 0 or greater"),
  harvest_costs: z.number().min(0, "Harvest costs must be 0 or greater"),
  notes: z.string().optional(),
});

type VineyardFormData = z.infer<typeof vineyardSchema>;

export function VineyardValuationForm() {
  const [results, setResults] = useState<{
    totalValue: number;
    netIncome: number;
    profitMargin: number;
    costBreakdown: {
      production: number;
      labor: number;
      equipment: number;
      total: number;
    };
    revenueBreakdown: {
      grossRevenue: number;
      netRevenue: number;
      valuePerAcre: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [waterForecast, setWaterForecast] = useState<{
    mlPerAcre: number;
    mlPerHectare: number;
    totalMlRequired: number;
    irrigationSchedule: {
      frequency: string;
      applicationRate: string;
      seasonalTotal: string;
    };
  } | null>(null);
  const [areaConversion, setAreaConversion] = useState<{
    acres: number;
    hectares: number;
    squareMeters: number;
    squareFeet: number;
  } | null>(null);

  const form = useForm<VineyardFormData>({
    resolver: zodResolver(vineyardSchema),
    defaultValues: {
      property_address: "",
      total_area: 0,
      grape_varieties: [],
      clone_selection: "",
      planting_year: new Date().getFullYear(),
      vine_age: 0,
      vines_per_acre: 0,
      row_spacing: 0,
      vine_spacing: 0,
      trellis_system: "",
      hail_netting: false,
      hail_netting_coverage: 0,
      irrigation_type: "",
      irrigation_coverage: 0,
      irrigation_zone: "",
      soil_type: "",
      climate_zone: "",
      yield_per_vine: 0,
      price_per_ton: 0,
      production_costs: 0,
      harvest_costs: 0,
      notes: "",
    },
  });

  const grapeVarieties = [
    "Cabernet Sauvignon", "Merlot", "Pinot Noir", "Chardonnay", "Sauvignon Blanc",
    "Riesling", "Syrah/Shiraz", "Zinfandel", "Grenache", "Tempranillo",
    "Sangiovese", "Nebbiolo", "Malbec", "Petit Verdot"
  ];

  const trellisSystem = [
    "Vertical Shoot Positioning (VSP)", "Geneva Double Curtain", "Scott Henry",
    "Smart Dyson", "Lyre System", "Minimal Pruning", "Pergola"
  ];

  const irrigationTypes = [
    "Drip Irrigation", "Micro-sprinkler", "Sprinkler System", "Flood Irrigation",
    "Rain-fed", "Combination System"
  ];

  const irrigationZones = [
    "Zone A - High Water Table", "Zone B - Moderate Water Table", "Zone C - Low Water Table",
    "Zone D - Supplemental Only", "Zone E - Rain-fed Primary", "Zone F - Mixed Systems"
  ];

  const climateZones = [
    "Cool Climate (Zone I)", "Moderate Climate (Zone II)", "Warm Climate (Zone III)",
    "Hot Climate (Zone IV)", "Very Hot Climate (Zone V)"
  ];

  const handleOCRData = (data: unknown) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key in form.getValues() && value !== null && value !== undefined) {
        form.setValue(key as keyof VineyardFormData, value as any);
      }
    });
  };

  const onSubmit = (data: VineyardFormData) => {
    setIsLoading(true);
    
    // Calculate water forecast and area conversions
    const forecast = calculateWaterForecast(
      'grape',
      data.irrigation_type,
      data.irrigation_coverage,
      data.climate_zone,
      data.total_area
    );
    const conversion = convertAcreage(data.total_area);
    
    setTimeout(() => {
      setResults({ 
        message: "Vineyard valuation calculated successfully!",
        varieties: data.grape_varieties,
        waterForecast: forecast,
        areaConversion: conversion,
        hailProtection: data.hail_netting
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleVarietySelect = (variety: any) => {
    const varietyName = variety.name;
    if (!selectedVarieties.includes(varietyName)) {
      const newVarieties = [...selectedVarieties, varietyName];
      setSelectedVarieties(newVarieties);
      form.setValue('grape_varieties', newVarieties);
    }
  };

  const removeVariety = (varietyName: string) => {
    const newVarieties = selectedVarieties.filter(v => v !== varietyName);
    setSelectedVarieties(newVarieties);
    form.setValue('grape_varieties', newVarieties);
  };

  // Watch for area changes to update conversions
  const watchedArea = form.watch('total_area');
  const watchedIrrigationType = form.watch('irrigation_type');
  const watchedIrrigationCoverage = form.watch('irrigation_coverage');
  const watchedClimateZone = form.watch('climate_zone');

  // Update conversions and forecasts when relevant fields change
  React.useEffect(() => {
    if (watchedArea > 0) {
      setAreaConversion(convertAcreage(watchedArea));
    }
  }, [watchedArea]);

  React.useEffect(() => {
    if (watchedArea > 0 && watchedIrrigationType && watchedClimateZone) {
      const forecast = calculateWaterForecast(
        'grape',
        watchedIrrigationType,
        watchedIrrigationCoverage,
        watchedClimateZone,
        watchedArea
      );
      setWaterForecast(forecast);
    }
  }, [watchedArea, watchedIrrigationType, watchedIrrigationCoverage, watchedClimateZone]);

  if (results) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold mb-4">Vineyard Assessment Complete</h3>
        <p className="mb-4">{results.message}</p>
        <Button onClick={() => setResults(null)}>New Assessment</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Grape className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Vineyard Assessment</h2>
          <p className="text-muted-foreground">Evaluate grape production and wine operations</p>
        </div>
      </div>

      <OCRUpload
        onDataExtracted={handleOCRData}
        formType="vineyard"
        className="mb-6"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wine className="h-5 w-5" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Area (acres)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    {areaConversion && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatAreaDisplay(areaConversion.acres)}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="climate_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Climate Zone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select climate zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {climateZones.map((zone) => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vineyard Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grape className="h-5 w-5" />
                Vineyard Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variety Management */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Grape className="h-4 w-4" />
                  <span className="font-medium">Grape Varieties</span>
                </div>
                
                <VarietyManager
                  category="grape"
                  onVarietySelect={handleVarietySelect}
                  currentVarieties={selectedVarieties}
                />
                
                {selectedVarieties.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Selected Varieties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVarieties.map((variety) => (
                        <div key={variety} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-sm">
                          {variety}
                          <button
                            type="button"
                            onClick={() => removeVariety(variety)}
                            className="text-muted-foreground hover:text-destructive ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clone_selection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clone Selection (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter clone selection" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planting_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planting Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2020"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vine_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vine Age (years)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trellis_system"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trellis System</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trellis system" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trellisSystem.map((system) => (
                          <SelectItem key={system} value={system}>{system}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="vines_per_acre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vines per Acre</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                {/* Hail Protection */}
                <div className="col-span-2">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="h-4 w-4" />
                        Hail Protection System
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hail_netting"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Hail Netting Installed</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Protective netting system for crop protection
                              </div>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch('hail_netting') && (
                        <FormField
                          control={form.control}
                          name="hail_netting_coverage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hail Netting Coverage (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0-100"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

               <FormField
                 control={form.control}
                 name="irrigation_type"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Irrigation Type</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select irrigation type" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {irrigationTypes.map((type) => (
                           <SelectItem key={type} value={type}>{type}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

                <FormField
                  control={form.control}
                  name="irrigation_coverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Irrigation Coverage (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0-100"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Water Forecast Display */}
                {waterForecast && (
                  <div className="col-span-2">
                    <Card className="bg-blue-50/50 dark:bg-blue-950/20">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Calculator className="h-4 w-4" />
                          Water Requirements Forecast
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Per Acre:</p>
                            <p className="text-muted-foreground">{formatWaterDisplay(waterForecast.mlPerAcre)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Required:</p>
                            <p className="text-muted-foreground">{waterForecast.totalMlRequired} ML</p>
                          </div>
                          <div>
                            <p className="font-medium">Application Frequency:</p>
                            <p className="text-muted-foreground">{waterForecast.irrigationSchedule.frequency}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

               <FormField
                 control={form.control}
                 name="irrigation_zone"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Irrigation Zone</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select irrigation zone" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {irrigationZones.map((zone) => (
                           <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="soil_type"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Soil Type</FormLabel>
                     <FormControl>
                       <Input placeholder="Enter soil type" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="yield_per_vine"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Yield per Vine (lbs)</FormLabel>
                     <FormControl>
                       <Input 
                         type="number" 
                         placeholder="0"
                         {...field}
                         onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="price_per_ton"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Price per Ton ($)</FormLabel>
                     <FormControl>
                       <Input 
                         type="number" 
                         placeholder="0.00"
                         step="0.01"
                         {...field}
                         onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="production_costs"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Production Costs ($/acre)</FormLabel>
                     <FormControl>
                       <Input 
                         type="number" 
                         placeholder="0.00"
                         step="0.01"
                         {...field}
                         onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="harvest_costs"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Harvest Costs ($/acre)</FormLabel>
                     <FormControl>
                       <Input 
                         type="number" 
                         placeholder="0.00"
                         step="0.01"
                         {...field}
                         onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="notes"
                 render={({ field }) => (
                   <FormItem className="col-span-2">
                     <FormLabel>Notes & Comments</FormLabel>
                     <FormControl>
                       <Textarea 
                         placeholder="Any additional information about the vineyard operation..."
                         className="min-h-[100px]"
                         {...field} 
                       />
                     </FormControl>
                     <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Vineyard Valuation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}