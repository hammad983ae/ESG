/**
 * Delorenzo Property Group - Orchard Valuation Calculations
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

export interface OrchardInputs {
  property_address: string;
  total_area: number;
  tree_type: string;
  variety: string;
  planting_year: number;
  trees_per_acre: number;
  rootstock?: string;
  irrigation_type: string;
  irrigation_coverage: number;
  tree_age: number;
  maturity_status: string;
  yield_per_tree: number;
  price_per_unit: number;
  production_costs: number;
  maintenance_costs: number;
  harvest_costs: number;
  notes?: string;
}

export interface OrchardResults {
  property_address: string;
  total_area: number;
  tree_type: string;
  variety: string;
  total_trees: number;
  total_production: number;
  gross_revenue: number;
  total_costs: number;
  net_income: number;
  net_income_per_acre: number;
  tree_value_per_acre: number;
  maturity_factor: number;
  irrigation_efficiency: number;
  cost_breakdown: {
    production: number;
    maintenance: number;
    harvest: number;
  };
  tree_analysis: {
    age: number;
    maturity_status: string;
    productive_life_remaining: number;
    replacement_cost: number;
  };
  recommendations: string[];
}

export function calculateOrchardValuation(inputs: OrchardInputs): OrchardResults {
  // Calculate total trees
  const total_trees = inputs.total_area * inputs.trees_per_acre;
  
  // Calculate maturity factor
  const maturity_factor = calculateMaturityFactor(inputs.tree_age, inputs.maturity_status);
  
  // Calculate production adjusted for maturity
  const adjusted_yield = inputs.yield_per_tree * maturity_factor;
  const total_production = total_trees * adjusted_yield;
  
  // Calculate gross revenue
  const gross_revenue = total_production * inputs.price_per_unit;
  
  // Calculate total costs
  const total_costs = inputs.total_area * (
    inputs.production_costs + 
    inputs.maintenance_costs + 
    inputs.harvest_costs
  );
  
  // Calculate net income
  const net_income = gross_revenue - total_costs;
  const net_income_per_acre = net_income / inputs.total_area;
  
  // Calculate tree value per acre
  const tree_value_per_acre = calculateTreeValuePerAcre(inputs);
  
  // Calculate irrigation efficiency
  const irrigation_efficiency = calculateIrrigationEfficiency(inputs.irrigation_type, inputs.irrigation_coverage);
  
  // Calculate productive life remaining
  const productive_life_remaining = calculateProductiveLifeRemaining(inputs.tree_type, inputs.tree_age);
  
  // Calculate replacement cost
  const replacement_cost = calculateReplacementCost(inputs.tree_type, inputs.trees_per_acre);
  
  // Cost breakdown
  const cost_breakdown = {
    production: inputs.total_area * inputs.production_costs,
    maintenance: inputs.total_area * inputs.maintenance_costs,
    harvest: inputs.total_area * inputs.harvest_costs,
  };
  
  // Generate recommendations
  const recommendations = generateOrchardRecommendations(inputs, {
    net_income_per_acre,
    maturity_factor,
    irrigation_efficiency,
    productive_life_remaining,
  });
  
  return {
    property_address: inputs.property_address,
    total_area: inputs.total_area,
    tree_type: inputs.tree_type,
    variety: inputs.variety,
    total_trees,
    total_production,
    gross_revenue,
    total_costs,
    net_income,
    net_income_per_acre,
    tree_value_per_acre,
    maturity_factor,
    irrigation_efficiency,
    cost_breakdown,
    tree_analysis: {
      age: inputs.tree_age,
      maturity_status: inputs.maturity_status,
      productive_life_remaining,
      replacement_cost: replacement_cost * inputs.total_area,
    },
    recommendations,
  };
}

function calculateMaturityFactor(age: number, status: string): number {
  const maturityFactors = {
    "Non-bearing (0-3 years)": Math.min(0.1, age * 0.03),
    "Young bearing (4-7 years)": 0.3 + (age - 4) * 0.15,
    "Mature bearing (8-15 years)": 0.9 + (age - 8) * 0.01,
    "Peak production (16-25 years)": 1.0,
    "Declining (25+ years)": Math.max(0.6, 1.0 - (age - 25) * 0.02),
  };
  
  return maturityFactors[status as keyof typeof maturityFactors] || 0.8;
}

function calculateTreeValuePerAcre(inputs: OrchardInputs): number {
  const baseValues = {
    "Apple": 8000,
    "Orange": 12000,
    "Lemon": 15000,
    "Avocado": 20000,
    "Almond": 18000,
    "Walnut": 16000,
    "Peach": 10000,
    "Cherry": 25000,
  };
  
  const baseValue = baseValues[inputs.tree_type as keyof typeof baseValues] || 10000;
  const maturityFactor = calculateMaturityFactor(inputs.tree_age, inputs.maturity_status);
  
  return baseValue * maturityFactor;
}

function calculateIrrigationEfficiency(type: string, coverage: number): number {
  const baseEfficiency = {
    "Drip Irrigation": 0.95,
    "Micro-sprinkler": 0.90,
    "Sprinkler System": 0.85,
    "Flood Irrigation": 0.60,
    "Rain-fed": 0.70,
    "Combination System": 0.85,
  };
  
  const efficiency = baseEfficiency[type as keyof typeof baseEfficiency] || 0.75;
  return efficiency * (coverage / 100);
}

function calculateProductiveLifeRemaining(treeType: string, age: number): number {
  const productiveLifespans = {
    "Apple": 30,
    "Orange": 50,
    "Lemon": 50,
    "Avocado": 50,
    "Almond": 25,
    "Walnut": 60,
    "Peach": 20,
    "Cherry": 25,
  };
  
  const lifespan = productiveLifespans[treeType as keyof typeof productiveLifespans] || 30;
  return Math.max(0, lifespan - age);
}

function calculateReplacementCost(treeType: string, treesPerAcre: number): number {
  const costPerTree = {
    "Apple": 15,
    "Orange": 20,
    "Lemon": 25,
    "Avocado": 35,
    "Almond": 30,
    "Walnut": 25,
    "Peach": 18,
    "Cherry": 40,
  };
  
  const treeCost = costPerTree[treeType as keyof typeof costPerTree] || 20;
  const establishmentCost = treesPerAcre * treeCost;
  const infrastructureCost = 2000; // Per acre for irrigation, fencing, etc.
  
  return establishmentCost + infrastructureCost;
}

function generateOrchardRecommendations(
  inputs: OrchardInputs,
  metrics: { 
    net_income_per_acre: number; 
    maturity_factor: number; 
    irrigation_efficiency: number;
    productive_life_remaining: number;
  }
): string[] {
  const recommendations: string[] = [];
  
  // Age and maturity recommendations
  if (inputs.tree_age < 5) {
    recommendations.push("Young orchard - focus on proper nutrition and training for future productivity");
  }
  
  if (metrics.productive_life_remaining < 5) {
    recommendations.push("Consider replanting plan - trees approaching end of productive life");
  }
  
  // Profitability recommendations
  if (metrics.net_income_per_acre < 1000) {
    recommendations.push("Below average profitability - review variety selection and marketing strategies");
  }
  
  // Irrigation recommendations
  if (metrics.irrigation_efficiency < 0.8) {
    recommendations.push("Upgrade irrigation system to improve water efficiency and tree health");
  }
  
  // Density recommendations
  if (inputs.trees_per_acre < 100) {
    recommendations.push("Low tree density - consider replanting with higher density for increased production");
  }
  
  // Production recommendations
  const yieldBenchmarks = {
    "Apple": 800,
    "Orange": 600,
    "Almond": 2000,
    "Avocado": 300,
  };
  
  const benchmark = yieldBenchmarks[inputs.tree_type as keyof typeof yieldBenchmarks];
  if (benchmark && inputs.yield_per_tree < benchmark * 0.7) {
    recommendations.push(`Yield below average for ${inputs.tree_type} - consider pruning, fertilization, and pest management improvements`);
  }
  
  // Cost management
  if (inputs.maintenance_costs > 1500) {
    recommendations.push("High maintenance costs - review efficiency of operations and equipment");
  }
  
  return recommendations;
}