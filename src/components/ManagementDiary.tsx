/**
 * Management Diary - Agricultural Operations Tracking
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sprout, BarChart3, Users, Calculator, Calendar } from "lucide-react";
import { SprayProgramTracker } from "@/components/SprayProgramTracker";
import { YieldTracker } from "@/components/YieldTracker";
import { LaborCalculator } from "@/components/LaborCalculator";
import { ExpenseCalculator } from "@/components/ExpenseCalculator";
import { OCRUpload } from "@/components/OCRUpload";

export const ManagementDiary = () => {
  const [activeTab, setActiveTab] = useState("spray-programs");

  const handleOCRData = (data: Record<string, unknown>) => {
    // Handle OCR data extraction for management diary
    console.log("OCR data extracted for management diary:", data);
    // You can implement specific data mapping here based on the form type
  };

  const diaryTabs = [
    {
      id: "spray-programs",
      name: "Spray Programs",
      icon: Sprout,
      description: "Track chemical applications and spray schedules"
    },
    {
      id: "yields",
      name: "Yield Tracking",
      icon: BarChart3,
      description: "Monitor yields per acre/hectare across seasons"
    },
    {
      id: "labor",
      name: "Labor Management",
      icon: Users,
      description: "Calculate labor requirements and minimum wages"
    },
    {
      id: "expenses",
      name: "Expense Calculator",
      icon: Calculator,
      description: "Track and calculate operational expenses"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Management Diary</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive farm management tracking system for spray programs, yields, 
          labor requirements, and operational expenses.
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <Badge variant="secondary">Real-time Tracking</Badge>
          <Badge variant="outline">Cost Analysis</Badge>
          <Badge variant="outline">Labor Optimization</Badge>
        </div>
      </div>

      {/* OCR Upload Section */}
      <OCRUpload
        onDataExtracted={handleOCRData}
        formType="management-diary"
        className="mb-6"
      />

      {/* Management Diary Tabs */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Farm Operations Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {diaryTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="spray-programs">
              <SprayProgramTracker />
            </TabsContent>

            <TabsContent value="yields">
              <YieldTracker />
            </TabsContent>

            <TabsContent value="labor">
              <LaborCalculator />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};