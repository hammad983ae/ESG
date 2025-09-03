/**
 * Delorenzo Property Group - Mixed Farm Operations Form
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tractor, Plus, Calculator, FileText } from "lucide-react";
import { PropertyManager } from "./PropertyManager";
import { CropValuationForm } from "./CropValuationForm";
import { OrchardValuationForm } from "./OrchardValuationForm";
import { VineyardValuationForm } from "./VineyardValuationForm";
import { PastureValuationForm } from "./PastureValuationForm";
import { HorticultureValuationForm } from "./HorticultureValuationForm";
import { toast } from "sonner";

interface MixedFarmProperty {
  id: string;
  address: string;
  area_acres: number;
  property_name: string;
  coordinates?: string;
}

interface CropBlock {
  id: string;
  propertyId: string;
  type: 'crop' | 'orchard' | 'vineyard' | 'pasture' | 'horticulture';
  name: string;
  area: number;
  variety?: string;
  data: any;
}

export function MixedFarmForm() {
  const [properties, setProperties] = useState<MixedFarmProperty[]>([]);
  const [cropBlocks, setCropBlocks] = useState<CropBlock[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [addingBlockType, setAddingBlockType] = useState<string | null>(null);

  const blockTypes = [
    { id: 'crop', name: 'Annual Crops', icon: '🌾', form: CropValuationForm },
    { id: 'orchard', name: 'Orchard', icon: '🍎', form: OrchardValuationForm },
    { id: 'vineyard', name: 'Vineyard', icon: '🍇', form: VineyardValuationForm },
    { id: 'pasture', name: 'Pasture', icon: '🐄', form: PastureValuationForm },
    { id: 'horticulture', name: 'Horticulture', icon: '🌸', form: HorticultureValuationForm },
  ];

  const addCropBlock = (type: string, data: any) => {
    if (properties.length === 0) {
      toast.error("Please add at least one property before adding crop blocks");
      return;
    }

    const newBlock: CropBlock = {
      id: crypto.randomUUID(),
      propertyId: properties[0].id, // Default to first property
      type: type as any,
      name: `${blockTypes.find(b => b.id === type)?.name} Block ${cropBlocks.length + 1}`,
      area: data.total_area || data.area || 0,
      variety: data.crop_type || data.tree_type || data.grape_variety || data.variety_type,
      data,
    };

    setCropBlocks([...cropBlocks, newBlock]);
    setAddingBlockType(null);
    toast.success(`${newBlock.name} added successfully`);
  };

  const removeCropBlock = (blockId: string) => {
    setCropBlocks(cropBlocks.filter(block => block.id !== blockId));
    setActiveBlock(null);
    toast.success("Crop block removed successfully");
  };

  const totalFarmAcres = properties.reduce((sum, prop) => sum + prop.area_acres, 0);
  const totalCropAcres = cropBlocks.reduce((sum, block) => sum + block.area, 0);
  const availableAcres = totalFarmAcres - totalCropAcres;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Tractor className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Mixed Farm Operations</h2>
          <p className="text-muted-foreground">Manage multiple crop types across various properties</p>
        </div>
      </div>

      {/* Property Management */}
      <PropertyManager
        onPropertiesChange={(props) => setProperties(props as MixedFarmProperty[])}
        initialProperties={properties as any[]}
      />

      {/* Farm Overview */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Farm Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{properties.length}</div>
                <div className="text-sm text-muted-foreground">Properties</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalFarmAcres.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Total Acres</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalCropAcres.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Planted Acres</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{availableAcres.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Available Acres</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop Blocks Management */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Crop Blocks ({cropBlocks.length})
              </CardTitle>
              {!addingBlockType && (
                <div className="flex gap-2">
                  {blockTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingBlockType(type.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {type.icon} {type.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Existing Crop Blocks */}
            {cropBlocks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {cropBlocks.map((block) => {
                  const blockType = blockTypes.find(t => t.id === block.type);
                  return (
                    <Card
                      key={block.id}
                      className={`cursor-pointer transition-all ${
                        activeBlock === block.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                      }`}
                      onClick={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{blockType?.icon}</span>
                            <h4 className="font-medium">{block.name}</h4>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCropBlock(block.id);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Area:</span>
                            <Badge variant="secondary">{block.area} acres</Badge>
                          </div>
                          {block.variety && (
                            <div className="flex justify-between text-sm">
                              <span>Variety:</span>
                              <span className="text-muted-foreground">{block.variety}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Property:</span>
                            <span className="text-muted-foreground">
                              {properties.find(p => p.id === block.propertyId)?.property_name}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Add New Block Form */}
            {addingBlockType && (
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Add New {blockTypes.find(t => t.id === addingBlockType)?.name} Block
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setAddingBlockType(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Form integration coming soon...</p>
                </CardContent>
              </Card>
            )}

            {cropBlocks.length === 0 && !addingBlockType && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No crop blocks added yet. Click on a crop type above to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {properties.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Tractor className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Welcome to Mixed Farm Operations</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your properties, then you can add different crop types across them.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
