/**
 * Delorenzo Property Group - Pasture Valuation Form
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
import { Tractor, Beef, Wheat, Droplets } from "lucide-react";
import { OCRUpload } from "./OCRUpload";

const pastureSchema = z.object({
  property_address: z.string().min(1, "Property address is required"),
  total_area: z.number().min(0.1, "Total area must be greater than 0"),
  pasture_type: z.string().min(1, "Pasture type is required"),
  grass_variety: z.string().min(1, "Grass variety is required"),
  livestock_type: z.string().min(1, "Livestock type is required"),
  carrying_capacity: z.number().min(0, "Carrying capacity must be 0 or greater"),
  current_stock: z.number().min(0, "Current stock must be 0 or greater"),
  irrigation_type: z.string().min(1, "Irrigation type is required"),
  irrigation_coverage: z.number().min(0).max(100),
  soil_type: z.string().min(1, "Soil type is required"),
  rainfall_annual: z.number().min(0, "Rainfall must be 0 or greater"),
  feed_supplements: z.number().min(0, "Feed supplements cost must be 0 or greater"),
  veterinary_costs: z.number().min(0, "Veterinary costs must be 0 or greater"),
  labor_costs: z.number().min(0, "Labor costs must be 0 or greater"),
  maintenance_costs: z.number().min(0, "Maintenance costs must be 0 or greater"),
  notes: z.string().optional(),
});

type PastureFormData = z.infer<typeof pastureSchema>;

export function PastureValuationForm() {
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

  const form = useForm<PastureFormData>({
    resolver: zodResolver(pastureSchema),
    defaultValues: {
      property_address: "",
      total_area: 0,
      pasture_type: "",
      grass_variety: "",
      livestock_type: "",
      carrying_capacity: 0,
      current_stock: 0,
      irrigation_type: "",
      irrigation_coverage: 0,
      soil_type: "",
      rainfall_annual: 0,
      feed_supplements: 0,
      veterinary_costs: 0,
      labor_costs: 0,
      maintenance_costs: 0,
      notes: "",
    },
  });

  const pastureTypes = [
    "Improved Pasture", "Native Pasture", "Hay Fields", "Silage Fields", 
    "Rotational Grazing", "Continuous Grazing", "Mixed Grazing"
  ];

  const grassVarieties = [
    "Ryegrass", "Fescue", "Timothy", "Clover", "Alfalfa", "Bermuda Grass",
    "Native Grasses", "Mixed Species", "Kikuyu", "Couch Grass"
  ];

  const livestockTypes = [
    "Cattle - Beef", "Cattle - Dairy", "Sheep - Meat", "Sheep - Wool", 
    "Goats", "Horses", "Mixed Livestock", "Hay Production Only"
  ];

  const handleOCRData = (data: Record<string, unknown>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key in form.getValues() && value !== null && value !== undefined) {
        // Type guard for form field values
        if (typeof value === 'string' || typeof value === 'number') {
          form.setValue(key as keyof PastureFormData, value as any);
        }
      }
    });
  };

  const onSubmit = (data: PastureFormData) => {
    setIsLoading(true);
    // Placeholder for calculation
    setTimeout(() => {
      setResults({ message: "Pasture valuation calculated successfully!" });
      setIsLoading(false);
    }, 1000);
  };

  if (results) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold mb-4">Pasture Assessment Complete</h3>
        <p className="mb-4">{results.message}</p>
        <Button onClick={() => setResults(null)}>New Assessment</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Tractor className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Pasture & Livestock Assessment</h2>
          <p className="text-muted-foreground">Evaluate grazing land and livestock operations</p>
        </div>
      </div>

      <OCRUpload
        onDataExtracted={handleOCRData}
        formType="pasture"
        className="mb-6"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wheat className="h-5 w-5" />
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
                name="rainfall_annual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Rainfall (inches)</FormLabel>
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
            </CardContent>
          </Card>

          {/* Pasture Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wheat className="h-5 w-5" />
                Pasture Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pasture_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pasture Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pasture type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pastureTypes.map((type) => (
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
                name="grass_variety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grass Variety</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grass variety" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grassVarieties.map((variety) => (
                          <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Livestock Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beef className="h-5 w-5" />
                Livestock Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="livestock_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Livestock Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select livestock type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {livestockTypes.map((type) => (
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
                name="carrying_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrying Capacity (head)</FormLabel>
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
                name="current_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock (head)</FormLabel>
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
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Pasture Valuation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}