/**
 * Delorenzo Property Group - Horticulture Valuation Form
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
import { Flower2, Sprout, Building, Droplets } from "lucide-react";
import { OCRUpload } from "./OCRUpload";

const horticultureSchema = z.object({
  property_address: z.string().min(1, "Property address is required"),
  total_area: z.number().min(0.1, "Total area must be greater than 0"),
  operation_type: z.string().min(1, "Operation type is required"),
  crop_variety: z.string().min(1, "Crop variety is required"),
  growing_method: z.string().min(1, "Growing method is required"),
  greenhouse_area: z.number().min(0, "Greenhouse area must be 0 or greater"),
  outdoor_area: z.number().min(0, "Outdoor area must be 0 or greater"),
  irrigation_type: z.string().min(1, "Irrigation type is required"),
  irrigation_coverage: z.number().min(0).max(100),
  climate_control: z.string().min(1, "Climate control is required"),
  production_cycles: z.number().min(0, "Production cycles must be 0 or greater"),
  yield_per_cycle: z.number().min(0, "Yield must be 0 or greater"),
  price_per_unit: z.number().min(0, "Price must be 0 or greater"),
  seed_costs: z.number().min(0, "Seed costs must be 0 or greater"),
  fertilizer_costs: z.number().min(0, "Fertilizer costs must be 0 or greater"),
  labor_costs: z.number().min(0, "Labor costs must be 0 or greater"),
  utilities_costs: z.number().min(0, "Utilities costs must be 0 or greater"),
  notes: z.string().optional(),
});

type HorticultureFormData = z.infer<typeof horticultureSchema>;

export function HorticultureValuationForm() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HorticultureFormData>({
    resolver: zodResolver(horticultureSchema),
    defaultValues: {
      property_address: "",
      total_area: 0,
      operation_type: "",
      crop_variety: "",
      growing_method: "",
      greenhouse_area: 0,
      outdoor_area: 0,
      irrigation_type: "",
      irrigation_coverage: 0,
      climate_control: "",
      production_cycles: 0,
      yield_per_cycle: 0,
      price_per_unit: 0,
      seed_costs: 0,
      fertilizer_costs: 0,
      labor_costs: 0,
      utilities_costs: 0,
      notes: "",
    },
  });

  const operationTypes = [
    "Vegetable Production", "Cut Flower Production", "Potted Plant Nursery", 
    "Bedding Plant Production", "Herb Production", "Microgreen Production",
    "Hydroponic Production", "Organic Production"
  ];

  const growingMethods = [
    "Soil-based", "Hydroponic", "Aeroponic", "Aquaponic", 
    "Container Growing", "Raised Beds", "Field Production"
  ];

  const climateControls = [
    "Fully Climate Controlled", "Heated Greenhouse", "Ventilated Greenhouse",
    "Shade House", "Outdoor - Natural", "Polytunnel", "Cold Frame"
  ];

  const handleOCRData = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key in form.getValues() && value !== null && value !== undefined) {
        form.setValue(key as keyof HorticultureFormData, value as any);
      }
    });
  };

  const onSubmit = (data: HorticultureFormData) => {
    setIsLoading(true);
    // Placeholder for calculation
    setTimeout(() => {
      setResults({ message: "Horticulture valuation calculated successfully!" });
      setIsLoading(false);
    }, 1000);
  };

  if (results) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold mb-4">Horticulture Assessment Complete</h3>
        <p className="mb-4">{results.message}</p>
        <Button onClick={() => setResults(null)}>New Assessment</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Flower2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Horticulture Assessment</h2>
          <p className="text-muted-foreground">Evaluate vegetable, flower, and nursery operations</p>
        </div>
      </div>

      <OCRUpload
        onDataExtracted={handleOCRData}
        formType="horticulture"
        className="mb-6"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" />
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
                name="operation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operation Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operationTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Growing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Growing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="crop_variety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Crop/Variety</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter crop or variety name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="growing_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growing Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select growing method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {growingMethods.map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="greenhouse_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Greenhouse Area (sq ft)</FormLabel>
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
                name="outdoor_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outdoor Growing Area (sq ft)</FormLabel>
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
                name="climate_control"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Climate Control</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select climate control" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {climateControls.map((control) => (
                          <SelectItem key={control} value={control}>{control}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="production_cycles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Cycles/Year</FormLabel>
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
            {isLoading ? "Calculating..." : "Calculate Horticulture Valuation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}