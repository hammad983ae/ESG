/**
 * Delorenzo Property Group - Crop Valuation Calculations
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

export interface CropInputs {
  property_address: string;
  total_area: number;
  crop_type: string;
  variety: string;
  planting_date: string;
  expected_harvest: string;
  irrigation_type: string;
  irrigation_coverage: number;
  soil_type: string;
  yield_per_acre: number;
  price_per_unit: number;
  production_costs: number;
  labor_costs: number;
  equipment_costs: number;
  notes?: string;
}

export interface CropResults {
  property_address: string;
  total_area: number;
  crop_type: string;
  variety: string;
  total_production: number;
  gross_revenue: number;
  total_costs: number;
  net_income: number;
  net_income_per_acre: number;
  profit_margin: number;
  irrigation_efficiency: number;
  cost_breakdown: {
    production: number;
    labor: number;
    equipment: number;
  };
  seasonal_analysis: {
    planting_date: string;
    expected_harvest: string;
    growing_season_days: number;
  };
  recommendations: string[];
}

export function calculateCropValuation(inputs: CropInputs): CropResults {
  // Calculate total production
  const total_production = inputs.total_area * inputs.yield_per_acre;
  
  // Calculate gross revenue
  const gross_revenue = total_production * inputs.price_per_unit;
  
  // Calculate total costs
  const total_costs = inputs.total_area * (
    inputs.production_costs + 
    inputs.labor_costs + 
    inputs.equipment_costs
  );
  
  // Calculate net income
  const net_income = gross_revenue - total_costs;
  const net_income_per_acre = net_income / inputs.total_area;
  
  // Calculate profit margin
  const profit_margin = gross_revenue > 0 ? (net_income / gross_revenue) * 100 : 0;
  
  // Calculate irrigation efficiency factor
  const irrigation_efficiency = calculateIrrigationEfficiency(inputs.irrigation_type, inputs.irrigation_coverage);
  
  // Calculate growing season
  const planting = new Date(inputs.planting_date);
  const harvest = new Date(inputs.expected_harvest);
  const growing_season_days = Math.ceil((harvest.getTime() - planting.getTime()) / (1000 * 60 * 60 * 24));
  
  // Cost breakdown
  const cost_breakdown = {
    production: inputs.total_area * inputs.production_costs,
    labor: inputs.total_area * inputs.labor_costs,
    equipment: inputs.total_area * inputs.equipment_costs,
  };
  
  // Generate recommendations
  const recommendations = generateCropRecommendations(inputs, {
    net_income_per_acre,
    profit_margin,
    irrigation_efficiency,
  });
  
  return {
    property_address: inputs.property_address,
    total_area: inputs.total_area,
    crop_type: inputs.crop_type,
    variety: inputs.variety,
    total_production,
    gross_revenue,
    total_costs,
    net_income,
    net_income_per_acre,
    profit_margin,
    irrigation_efficiency,
    cost_breakdown,
    seasonal_analysis: {
      planting_date: inputs.planting_date,
      expected_harvest: inputs.expected_harvest,
      growing_season_days,
    },
    recommendations,
  };
}

function calculateIrrigationEfficiency(type: string, coverage: number): number {
  const baseEfficiency = {
    "Drip Irrigation": 0.95,
    "Sprinkler System": 0.85,
    "Center Pivot": 0.80,
    "Flood Irrigation": 0.60,
    "Micro-sprinkler": 0.90,
    "Subsurface Drip": 0.98,
    "Rain-fed": 0.70,
    "Combination System": 0.85,
  };
  
  const efficiency = baseEfficiency[type as keyof typeof baseEfficiency] || 0.75;
  return efficiency * (coverage / 100);
}

function generateCropRecommendations(
  inputs: CropInputs,
  metrics: { net_income_per_acre: number; profit_margin: number; irrigation_efficiency: number }
): string[] {
  const recommendations: string[] = [];
  
  // Profitability recommendations
  if (metrics.net_income_per_acre < 200) {
    recommendations.push("Consider crop rotation or higher-value varieties to improve profitability");
  }
  
  if (metrics.profit_margin < 15) {
    recommendations.push("Profit margin is below industry standards - review cost structure and pricing");
  }
  
  // Irrigation recommendations
  if (metrics.irrigation_efficiency < 0.8) {
    recommendations.push("Consider upgrading irrigation system to improve water efficiency");
  }
  
  if (inputs.irrigation_coverage < 80) {
    recommendations.push("Expand irrigation coverage to maximize yield potential");
  }
  
  // Yield recommendations
  const yieldBenchmarks = {
    "Wheat": 60,
    "Corn": 180,
    "Soybeans": 50,
    "Cotton": 800,
    "Rice": 150,
  };
  
  const benchmark = yieldBenchmarks[inputs.crop_type as keyof typeof yieldBenchmarks];
  if (benchmark && inputs.yield_per_acre < benchmark * 0.8) {
    recommendations.push(`Yield is below average for ${inputs.crop_type} - consider soil testing and fertilization program`);
  }
  
  // Cost recommendations
  if (inputs.labor_costs > inputs.production_costs) {
    recommendations.push("Labor costs are high - evaluate mechanization opportunities");
  }
  
  // Seasonal recommendations
  const planting = new Date(inputs.planting_date);
  const harvest = new Date(inputs.expected_harvest);
  const growing_season = Math.ceil((harvest.getTime() - planting.getTime()) / (1000 * 60 * 60 * 24));
  
  if (growing_season > 200) {
    recommendations.push("Long growing season - consider double cropping opportunities");
  }
  
  return recommendations;
}