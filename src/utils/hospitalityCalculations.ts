export interface HospitalityInputs {
  // Income Approach
  noi: number;
  cap_rate: number;
  
  // GIM Approach
  gross_income: number;
  gim: number;
  
  // Per Unit Approach
  number_of_units: number;
  per_unit_value: number;
  
  // Revenue Multiplier Approach
  room_revenue: number;
  revenue_multiplier: number;
  
  // Replacement Cost Approach
  cost_per_sf: number;
  building_area_sf: number;
  site_costs: number;
  other_costs: number;
  
  // ESG Settings
  esg_included: boolean;
  esg_factor: number;
}

export interface HospitalityResults {
  income_approach_value: number;
  gim_approach_value: number;
  per_unit_approach_value: number;
  revenue_multiplier_value: number;
  replacement_cost_value: number;
  
  // Base values (without ESG)
  income_approach_base: number;
  gim_approach_base: number;
  per_unit_approach_base: number;
  revenue_multiplier_base: number;
  replacement_cost_base: number;
  
  esg_factor: number;
  esg_included: boolean;
}

export function calculateIncomeApproach(noi: number, cap_rate: number, esg_factor: number = 0): number {
  return (noi * (1 + esg_factor)) / cap_rate;
}

export function calculateGIM(gross_income: number, gim: number, esg_factor: number = 0): number {
  return gross_income * gim * (1 + esg_factor);
}

export function calculatePerUnitValue(number_of_units: number, per_unit_value: number, esg_factor: number = 0): number {
  return number_of_units * per_unit_value * (1 + esg_factor);
}

export function calculateRevenueMultiplier(room_revenue: number, revenue_multiplier: number, esg_factor: number = 0): number {
  return room_revenue * revenue_multiplier * (1 + esg_factor);
}

export function calculateReplacementCost(
  cost_per_sf: number, 
  building_area_sf: number, 
  site_costs: number, 
  other_costs: number, 
  esg_factor: number = 0
): number {
  const base_cost = (cost_per_sf * building_area_sf) + site_costs + other_costs;
  return base_cost * (1 + esg_factor);
}

export function calculateHospitalityValuation(inputs: HospitalityInputs): HospitalityResults {
  const effective_esg_factor = inputs.esg_included ? inputs.esg_factor : 0;
  
  // Calculate base values (without ESG)
  const income_approach_base = calculateIncomeApproach(inputs.noi, inputs.cap_rate, 0);
  const gim_approach_base = calculateGIM(inputs.gross_income, inputs.gim, 0);
  const per_unit_approach_base = calculatePerUnitValue(inputs.number_of_units, inputs.per_unit_value, 0);
  const revenue_multiplier_base = calculateRevenueMultiplier(inputs.room_revenue, inputs.revenue_multiplier, 0);
  const replacement_cost_base = calculateReplacementCost(
    inputs.cost_per_sf, 
    inputs.building_area_sf, 
    inputs.site_costs, 
    inputs.other_costs, 
    0
  );
  
  // Calculate ESG-adjusted values
  const income_approach_value = calculateIncomeApproach(inputs.noi, inputs.cap_rate, effective_esg_factor);
  const gim_approach_value = calculateGIM(inputs.gross_income, inputs.gim, effective_esg_factor);
  const per_unit_approach_value = calculatePerUnitValue(inputs.number_of_units, inputs.per_unit_value, effective_esg_factor);
  const revenue_multiplier_value = calculateRevenueMultiplier(inputs.room_revenue, inputs.revenue_multiplier, effective_esg_factor);
  const replacement_cost_value = calculateReplacementCost(
    inputs.cost_per_sf, 
    inputs.building_area_sf, 
    inputs.site_costs, 
    inputs.other_costs, 
    effective_esg_factor
  );
  
  return {
    income_approach_value,
    gim_approach_value,
    per_unit_approach_value,
    revenue_multiplier_value,
    replacement_cost_value,
    income_approach_base,
    gim_approach_base,
    per_unit_approach_base,
    revenue_multiplier_base,
    replacement_cost_base,
    esg_factor: effective_esg_factor,
    esg_included: inputs.esg_included
  };
}

export const defaultHospitalityInputs: HospitalityInputs = {
  noi: 1200000,
  cap_rate: 0.08,
  gross_income: 2000000,
  gim: 8,
  number_of_units: 50,
  per_unit_value: 50000,
  room_revenue: 1500000,
  revenue_multiplier: 4,
  cost_per_sf: 2000,
  building_area_sf: 10000,
  site_costs: 200000,
  other_costs: 100000,
  esg_included: true,
  esg_factor: 0.05
};