/**
 * Delorenzo Property Group - Crop Valuation Form
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wheat, Droplets, Calendar, TrendingUp } from "lucide-react";
import { OCRUpload } from "./OCRUpload";
import { CropValuationResults } from "./CropValuationResults";
import { calculateCropValuation, type CropInputs } from "@/utils/cropCalculations";

const cropSchema = z.object({
  property_address: z.string().min(1, "Property address is required"),
  total_area: z.number().min(0.1, "Total area must be greater than 0"),
  crop_type: z.string().min(1, "Crop type is required"),
  variety: z.string().min(1, "Variety is required"),
  planting_date: z.string().min(1, "Planting date is required"),
  expected_harvest: z.string().min(1, "Expected harvest date is required"),
  irrigation_type: z.string().min(1, "Irrigation type is required"),
  irrigation_coverage: z.number().min(0).max(100, "Coverage must be between 0-100%"),
  soil_type: z.string().min(1, "Soil type is required"),
  yield_per_acre: z.number().min(0, "Yield must be 0 or greater"),
  price_per_unit: z.number().min(0, "Price must be 0 or greater"),
  production_costs: z.number().min(0, "Costs must be 0 or greater"),
  labor_costs: z.number().min(0, "Labor costs must be 0 or greater"),
  equipment_costs: z.number().min(0, "Equipment costs must be 0 or greater"),
  notes: z.string().optional(),
});

type CropFormData = z.infer<typeof cropSchema>;

export function CropValuationForm() {
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

  const form = useForm<CropFormData>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      property_address: "",
      total_area: 0,
      crop_type: "",
      variety: "",
      planting_date: "",
      expected_harvest: "",
      irrigation_type: "",
      irrigation_coverage: 0,
      soil_type: "",
      yield_per_acre: 0,
      price_per_unit: 0,
      production_costs: 0,
      labor_costs: 0,
      equipment_costs: 0,
      notes: "",
    },
  });

  const cropTypes = [
    "Wheat", "Corn", "Soybeans", "Cotton", "Rice", "Barley", "Oats", "Sorghum",
    "Canola", "Sunflower", "Potatoes", "Sugar Beet", "Alfalfa"
  ];

  const irrigationTypes = [
    "Drip Irrigation", "Sprinkler System", "Center Pivot", "Flood Irrigation",
    "Micro-sprinkler", "Subsurface Drip", "Rain-fed", "Combination System"
  ];

  const soilTypes = [
    "Clay", "Sandy Clay", "Silty Clay", "Clay Loam", "Sandy Clay Loam",
    "Silty Clay Loam", "Loam", "Sandy Loam", "Silt Loam", "Sand", "Loamy Sand", "Silt"
  ];

  const handleOCRData = (data: unknown) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key in form.getValues() && value !== null && value !== undefined) {
        form.setValue(key as keyof CropFormData, value as any);
      }
    });
  };

  const onSubmit = (data: CropFormData) => {
    setIsLoading(true);
    try {
      const inputs: CropInputs = data as CropInputs;
      const calculationResults = calculateCropValuation(inputs);
      setResults(calculationResults);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return <CropValuationResults results={results} onReset={() => setResults(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Wheat className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Annual Crop Assessment</h2>
          <p className="text-muted-foreground">Evaluate grain, cereal, and row crop operations</p>
        </div>
      </div>

      <OCRUpload
        onDataExtracted={handleOCRData}
        formType="crop"
        className="mb-6"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {soilTypes.map((soil) => (
                          <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Crop Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wheat className="h-5 w-5" />
                Crop Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="crop_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cropTypes.map((crop) => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variety</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter variety name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planting_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planting Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_harvest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Harvest</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Irrigation System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Irrigation System
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          {/* Production & Economics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Production & Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yield_per_acre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Yield (bushels/acre)</FormLabel>
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
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Bushel ($)</FormLabel>
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
                name="labor_costs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labor Costs ($/acre)</FormLabel>
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
                name="equipment_costs"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Equipment Costs ($/acre)</FormLabel>
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
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes & Comments</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about the crop operation..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Crop Valuation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}