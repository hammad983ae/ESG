/**
 * Delorenzo Property Group - Variety Management System
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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Sprout } from "lucide-react";
import { toast } from "sonner";

const varietySchema = z.object({
  name: z.string().min(1, "Variety name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
});

type VarietyData = z.infer<typeof varietySchema>;

interface Variety extends VarietyData {
  id: string;
}

interface VarietyManagerProps {
  category: 'grape' | 'fruit' | 'vegetable' | 'crop' | 'nut';
  onVarietySelect?: (variety: Variety) => void;
  currentVarieties: string[];
}

const defaultVarieties = {
  grape: {
    wine: [
      "Cabernet Sauvignon", "Merlot", "Pinot Noir", "Chardonnay", "Sauvignon Blanc",
      "Riesling", "Syrah/Shiraz", "Zinfandel", "Grenache", "Tempranillo",
      "Sangiovese", "Nebbiolo", "Malbec", "Petit Verdot"
    ],
    table: [
      "Jack Salute", "Red Globe", "Thompson Seedless", "Flame Seedless",
      "Ruby Seedless", "Princess", "Crimson Seedless", "Autumn Royal",
      "Sugraone", "Black Beauty", "Italia", "Cardinal",
      // New SNFL Red Seedless Varieties
      "Navsel 3", "Sunrise Red (Sheegene 8)", "Navsel 20", "Navsel 21",
      "Carlita (Sheegene 25)", "Krissy (Sheegene 12)", "Timco (Sheegene 13)",
      "Allison (Sheegene 20)",
      // SNFL Green Seedless Varieties
      "Kelly (Sheegene 18)", "Navsel 6", "Navsel 5", "Ivory (Sheegene 21)",
      "Timpson (Sheegene 2)", "Great Green (Sheegene 17)", "Navsel 1",
      // SNFL Black Seedless Varieties
      "Sheegene 105", "Sheegene 101", "Sheegene 104"
    ],
    dried: [
      "Sultana (Thompson Seedless)", "Currants (Black Corinth)", "Muscat Gordo Blanco",
      "Carina Currants", "Flame Seedless (Raisins)", "Ruby Seedless (Raisins)",
      "Sunmuscat", "Sultana H5", "Merbein Seedless", "Menindee Seedless"
    ]
  },
  fruit: [
    "Nashi Pear", "Apple - Gala", "Apple - Fuji", "Apple - Granny Smith",
    "Orange - Navel", "Orange - Valencia", "Lemon - Eureka", "Mandarin",
    "Avocado - Hass", "Avocado - Fuerte", "Cherry - Bing", "Peach - Yellow"
  ],
  vegetable: [
    "Tomato - Roma", "Tomato - Cherry", "Lettuce - Iceberg", "Spinach",
    "Carrot - Nantes", "Broccoli - Green Magic", "Cauliflower", "Potato - Russet"
  ],
  crop: [
    "Wheat - Hard Red Winter", "Corn - Field", "Soybeans", "Cotton",
    "Rice - Long Grain", "Barley - Malting", "Oats", "Sorghum"
  ],
  nut: [
    "Almond - Nonpareil", "Walnut - English", "Pecan - Desirable",
    "Pistachio - Kerman", "Macadamia", "Hazelnut"
  ]
};

export function VarietyManager({ category, onVarietySelect, currentVarieties }: VarietyManagerProps) {
  const [customVarieties, setCustomVarieties] = useState<Variety[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const form = useForm<VarietyData>({
    resolver: zodResolver(varietySchema),
    defaultValues: {
      name: "",
      category: category,
      type: "",
      description: "",
    },
  });

  const availableTypes = category === 'grape' 
    ? Object.keys(defaultVarieties.grape) 
    : [category];

  const getVarietiesForType = (type: string): string[] => {
    if (category === 'grape') {
      return defaultVarieties.grape[type as keyof typeof defaultVarieties.grape] || [];
    }
    return defaultVarieties[category as keyof typeof defaultVarieties] as string[] || [];
  };

  const getAllVarieties = (): string[] => {
    let allVarieties: string[] = [];
    
    if (category === 'grape') {
      Object.values(defaultVarieties.grape).forEach(varieties => {
        allVarieties = [...allVarieties, ...varieties];
      });
    } else {
      const categoryVarieties = defaultVarieties[category as keyof typeof defaultVarieties];
      if (Array.isArray(categoryVarieties)) {
        allVarieties = categoryVarieties;
      }
    }
    
    // Add custom varieties
    const customVarietyNames = customVarieties
      .filter(v => v.category === category)
      .map(v => v.name);
    
    return [...allVarieties, ...customVarietyNames];
  };

  const addCustomVariety = (data: VarietyData) => {
    const newVariety: Variety = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    setCustomVarieties([...customVarieties, newVariety]);
    onVarietySelect?.(newVariety);
    
    form.reset({ category, type: "", name: "", description: "" });
    setIsOpen(false);
    toast.success(`Custom variety "${data.name}" added successfully`);
  };

  const removeCustomVariety = (id: string) => {
    setCustomVarieties(customVarieties.filter(v => v.id !== id));
    toast.success("Custom variety removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4" />
          <span className="font-medium">Available Varieties</span>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Custom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom {category} Variety</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addCustomVariety)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variety Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jack Salute, Nashi Pear" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Additional notes about this variety" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Add Variety</Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Show varieties by type for grapes */}
      {category === 'grape' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              🍷 Wine Grapes
              <Badge variant="secondary">{defaultVarieties.grape.wine.length}</Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultVarieties.grape.wine.map((variety) => (
                <Badge 
                  key={variety} 
                  variant={currentVarieties.includes(variety) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onVarietySelect?.({ id: variety, name: variety, category: 'grape', type: 'wine' })}
                >
                  {variety}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              🍇 Table Grapes
              <Badge variant="secondary">{defaultVarieties.grape.table.length}</Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultVarieties.grape.table.map((variety) => (
                <Badge 
                  key={variety} 
                  variant={currentVarieties.includes(variety) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onVarietySelect?.({ id: variety, name: variety, category: 'grape', type: 'table' })}
                >
                  {variety}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              🫐 Dried Fruit Grapes
              <Badge variant="secondary">{defaultVarieties.grape.dried.length}</Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultVarieties.grape.dried.map((variety) => (
                <Badge 
                  key={variety} 
                  variant={currentVarieties.includes(variety) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onVarietySelect?.({ id: variety, name: variety, category: 'grape', type: 'dried' })}
                >
                  {variety}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Show varieties for other categories */}
      {category !== 'grape' && (
        <div className="flex flex-wrap gap-2">
          {(defaultVarieties[category as keyof typeof defaultVarieties] as string[] || []).map((variety) => (
            <Badge 
              key={variety} 
              variant={currentVarieties.includes(variety) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onVarietySelect?.({ id: variety, name: variety, category, type: category })}
            >
              {variety}
            </Badge>
          ))}
        </div>
      )}

      {/* Custom Varieties */}
      {customVarieties.filter(v => v.category === category).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Custom Varieties</h4>
          <div className="space-y-2">
            {customVarieties
              .filter(v => v.category === category)
              .map((variety) => (
                <div key={variety.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{variety.name}</Badge>
                    <span className="text-sm text-muted-foreground">({variety.type})</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCustomVariety(variety.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}