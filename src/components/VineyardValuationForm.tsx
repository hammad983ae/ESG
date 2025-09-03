/**
 * Delorenzo Property Group - Vineyard Valuation Form
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
import { Grape, Droplets, Wine, Sun } from "lucide-react";
import { OCRUpload } from "./OCRUpload";

const vineyardSchema = z.object({
  property_address: z.string().min(1, "Property address is required"),
  total_area: z.number().min(0.1, "Total area must be greater than 0"),
  grape_variety: z.string().min(1, "Grape variety is required"),
  clone_selection: z.string().optional(),
  planting_year: z.number().min(1900, "Valid planting year required"),
  vine_age: z.number().min(0, "Vine age must be 0 or greater"),
  vines_per_acre: z.number().min(1, "Vines per acre must be at least 1"),
  row_spacing: z.number().min(0, "Row spacing must be 0 or greater"),
  vine_spacing: z.number().min(0, "Vine spacing must be 0 or greater"),
  trellis_system: z.string().min(1, "Trellis system is required"),
  irrigation_type: z.string().min(1, "Irrigation type is required"),
  irrigation_coverage: z.number().min(0).max(100),
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
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VineyardFormData>({
    resolver: zodResolver(vineyardSchema),
    defaultValues: {
      property_address: "",
      total_area: 0,
      grape_variety: "",
      clone_selection: "",
      planting_year: new Date().getFullYear(),
      vine_age: 0,
      vines_per_acre: 0,
      row_spacing: 0,
      vine_spacing: 0,
      trellis_system: "",
      irrigation_type: "",
      irrigation_coverage: 0,
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

  const climateZones = [
    "Cool Climate (Zone I)", "Moderate Climate (Zone II)", "Warm Climate (Zone III)",
    "Hot Climate (Zone IV)", "Very Hot Climate (Zone V)"
  ];

  const handleOCRData = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key in form.getValues() && value !== null && value !== undefined) {
        form.setValue(key as keyof VineyardFormData, value as any);
      }
    });
  };

  const onSubmit = (data: VineyardFormData) => {
    setIsLoading(true);
    // Placeholder for calculation
    setTimeout(() => {
      setResults({ message: "Vineyard valuation calculated successfully!" });
      setIsLoading(false);
    }, 1000);
  };

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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grape_variety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grape Variety</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grape variety" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grapeVarieties.map((variety) => (
                          <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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