/**
 * Geographic Breakdown Selector Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Globe, Map, Navigation } from "lucide-react";

interface GeographicBreakdownSelectorProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  children: React.ReactNode;
}

const geographicLevels = [
  { id: 'total', name: 'National Total', icon: Globe },
  { id: 'state', name: 'By State', icon: Map },
  { id: 'capital', name: 'Capital Cities', icon: Building },
  { id: 'major-regional', name: 'Major Regional', icon: Navigation },
  { id: 'regional', name: 'Regional Areas', icon: MapPin },
];

export const GeographicBreakdownSelector = ({ 
  selectedLevel, 
  onLevelChange, 
  children 
}: GeographicBreakdownSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Geographic Level Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Analysis Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLevel} onValueChange={onLevelChange}>
            <TabsList className="grid w-full grid-cols-5">
              {geographicLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <TabsTrigger key={level.id} value={level.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{level.name}</span>
                    <span className="md:hidden">{level.name.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analysis Content */}
      {children}
    </div>
  );
};