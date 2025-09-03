/**
 * Delorenzo Property Group - Orchard Valuation Form
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
import { Apple, TreePine, Calendar, Droplets } from "lucide-react";
import { OCRUpload } from "./OCRUpload";
import { OrchardValuationResults } from "./OrchardValuationResults";
import { calculateOrchardValuation, type OrchardInputs } from "@/utils/orchardCalculations";

const orchardSchema = z.object({
  property_address: z.string().min(1, "Property address is required"),
  total_area: z.number().min(0.1, "Total area must be greater than 0"),
  tree_type: z.string().min(1, "Tree type is required"),
  variety: z.string().min(1, "Variety is required"),
  planting_year: z.number().min(1900, "Valid planting year required"),
  trees_per_acre: z.number().min(1, "Trees per acre must be at least 1"),
  rootstock: z.string().optional(),
  irrigation_type: z.string().min(1, "Irrigation type is required"),
  irrigation_coverage: z.number().min(0).max(100),
  irrigation_zone: z.string().min(1, "Irrigation zone is required"),
  tree_age: z.number().min(0, "Tree age must be 0 or greater"),
  maturity_status: z.string().min(1, "Maturity status is required"),
  yield_per_tree: z.number().min(0, "Yield must be 0 or greater"),
  price_per_unit: z.number().min(0, "Price must be 0 or greater"),
  production_costs: z.number().min(0, "Costs must be 0 or greater"),
  maintenance_costs: z.number().min(0, "Maintenance costs must be 0 or greater"),
  harvest_costs: z.number().min(0, "Harvest costs must be 0 or greater"),
  notes: z.string().optional(),
});

type OrchardFormData = z.infer<typeof orchardSchema>;

export function OrchardValuationForm() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OrchardFormData>({
    resolver: zodResolver(orchardSchema),
    defaultValues: {
      property_address: "",
      total_area: 0,
      tree_type: "",
      variety: "",
      planting_year: new Date().getFullYear(),
      trees_per_acre: 0,
      rootstock: "",
      irrigation_type: "",
      irrigation_coverage: 0,
      irrigation_zone: "",
      tree_age: 0,
      maturity_status: "",
      yield_per_tree: 0,
      price_per_unit: 0,
      production_costs: 0,
      maintenance_costs: 0,
      harvest_costs: 0,
      notes: "",
    },
  });

  const treeTypes = [
    "Apple", "Orange", "Lemon", "Grapefruit", "Lime", "Avocado", "Almond", 
    "Walnut", "Pecan", "Peach", "Plum", "Cherry", "Apricot", "Pear", "Fig"
  ];

  const irrigationTypes = [
    "Drip Irrigation", "Micro-sprinkler", "Sprinkler System", "Flood Irrigation",
    "Rain-fed", "Combination System"
  ];

  const irrigationZones = [
    "Zone A - High Water Table", "Zone B - Moderate Water Table", "Zone C - Low Water Table",
    "Zone D - Supplemental Only", "Zone E - Rain-fed Primary", "Zone F - Mixed Systems"
  ];

  const maturityStatuses = [
    "Non-bearing (0-3 years)", "Young bearing (4-7 years)", 
    "Mature bearing (8-15 years)", "Peak production (16-25 years)", 
    "Declining (25+ years)"
  ];

  const handleOCRData = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key in form.getValues() && value !== null && value !== undefined) {
        form.setValue(key as keyof OrchardFormData, value as any);
      }
    });
  };

  const onSubmit = (data: OrchardFormData) => {
    setIsLoading(true);
    try {
      const inputs: OrchardInputs = data as OrchardInputs;
      const calculationResults = calculateOrchardValuation(inputs);
      setResults(calculationResults);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return <OrchardValuationResults results={results} onReset={() => setResults(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Apple className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Orchard Assessment</h2>
          <p className="text-muted-foreground">Evaluate tree fruit and nut production operations</p>
        </div>
      </div>

      <OCRUpload
        onDataExtracted={handleOCRData}
        formType="orchard"
        className="mb-6"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
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
                name="trees_per_acre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trees per Acre</FormLabel>
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

          {/* Tree Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                Tree Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tree_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tree Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tree type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treeTypes.map((tree) => (
                          <SelectItem key={tree} value={tree}>{tree}</SelectItem>
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
                name="tree_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tree Age (years)</FormLabel>
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
                name="maturity_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maturity Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select maturity status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maturityStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rootstock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rootstock (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter rootstock type" {...field} />
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

               <FormField
                 control={form.control}
                 name="irrigation_zone"
                 render={({ field }) => (
                   <FormItem className="col-span-2">
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
            </CardContent>
          </Card>

          {/* Production & Economics */}
          <Card>
            <CardHeader>
              <CardTitle>Production & Economics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yield_per_tree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield per Tree (lbs/boxes)</FormLabel>
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
                    <FormLabel>Price per Unit ($)</FormLabel>
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
                name="maintenance_costs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Costs ($/acre)</FormLabel>
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
                  <FormItem className="col-span-2">
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
                        placeholder="Any additional information about the orchard operation..."
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
            {isLoading ? "Calculating..." : "Calculate Orchard Valuation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}