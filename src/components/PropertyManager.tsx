/**
 * Delorenzo Property Group - Property Management System
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
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const propertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  area_acres: z.number().min(0.1, "Area must be greater than 0"),
  property_name: z.string().min(1, "Property name is required"),
  coordinates: z.string().optional(),
});

type PropertyData = z.infer<typeof propertySchema>;

interface Property extends PropertyData {
  id: string;
}

interface PropertyManagerProps {
  onPropertiesChange?: (properties: Property[]) => void;
  initialProperties?: Property[];
}

export function PropertyManager({ onPropertiesChange, initialProperties = [] }: PropertyManagerProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  const form = useForm<PropertyData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      area_acres: 0,
      property_name: "",
      coordinates: "",
    },
  });

  const addProperty = (data: PropertyData) => {
    const newProperty: Property = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    const updatedProperties = [...properties, newProperty];
    setProperties(updatedProperties);
    onPropertiesChange?.(updatedProperties);
    
    form.reset();
    setIsAddingProperty(false);
    toast.success(`Property "${data.property_name}" added successfully`);
  };

  const removeProperty = (id: string) => {
    const updatedProperties = properties.filter(p => p.id !== id);
    setProperties(updatedProperties);
    onPropertiesChange?.(updatedProperties);
    toast.success("Property removed successfully");
  };

  const totalAcres = properties.reduce((sum, prop) => sum + prop.area_acres, 0);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <CardTitle>Property Portfolio Management</CardTitle>
          </div>
          <Badge variant="secondary">
            {properties.length} Properties • {totalAcres.toFixed(1)} Acres Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Existing Properties */}
        {properties.length > 0 && (
          <div className="space-y-3 mb-4">
            {properties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{property.property_name}</h4>
                    <Badge variant="outline">{property.area_acres} acres</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{property.address}</p>
                  {property.coordinates && (
                    <p className="text-xs text-muted-foreground mt-1">Coordinates: {property.coordinates}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProperty(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Property */}
        {!isAddingProperty ? (
          <Button 
            onClick={() => setIsAddingProperty(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addProperty)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="property_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. North Block Farm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area_acres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (acres)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full property address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Coordinates (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. -34.123456, 150.789012" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Property
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingProperty(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
