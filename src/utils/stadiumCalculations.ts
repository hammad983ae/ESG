export interface StadiumInputs {
  // Stadium Details
  capacity: number;
  event_days: number;
  avg_spend_per_attendee: number;
  
  // Sublease Income Approach
  sublease_enabled: boolean;
  rentable_area_sqm: number;
  rent_per_sqm: number;
  occupancy_rate: number;
  discount_rate: number;
  forecast_years: number;
  
  // Retail Income Approach
  retail_enabled: boolean;
  retail_multiplier: number;
  
  // Turnover Method Approach
  turnover_enabled: boolean;
  industry_multiplier: number;
  
  // ESG Settings
  esg_included: boolean;
  esg_factor: number;
}

export interface StadiumResults {
  // Stadium Details
  capacity: number;
  event_days: number;
  avg_spend_per_attendee: number;
  
  // Sublease Income Results
  sublease_annual_income: number;
  sublease_present_value: number;
  sublease_enabled: boolean;
  
  // Retail Income Results
  retail_annual_income: number;
  retail_valuation: number;
  retail_enabled: boolean;
  
  // Turnover Method Results
  turnover_annual_sales: number;
  turnover_valuation: number;
  turnover_enabled: boolean;
  
  // Summary
  valuation_average: number;
  valuation_range: {
    low: number;
    high: number;
  };
  
  esg_factor: number;
  esg_included: boolean;
}

export function calculateSubleaseIncome(
  capacity: number,
  occupancy_rate: number,
  rentable_area_sqm: number,
  rent_per_sqm: number,
  discount_rate: number,
  years: number = 10,
  esg_factor: number = 0
): { annual_income: number; present_value: number } {
  const annual_income = capacity * occupancy_rate * rent_per_sqm * rentable_area_sqm * (1 + esg_factor);
  
  // Calculate present value using PV formula
  let present_value = 0;
  for (let t = 1; t <= years; t++) {
    present_value += annual_income / Math.pow(1 + discount_rate, t);
  }
  
  return {
    annual_income,
    present_value
  };
}

export function calculateRetailIncome(
  capacity: number,
  event_days: number,
  avg_spend_per_attendee: number,
  retail_multiplier: number,
  esg_factor: number = 0
): { annual_income: number; valuation: number } {
  const total_attendees = capacity * event_days;
  const annual_income = total_attendees * avg_spend_per_attendee * (1 + esg_factor);
  const valuation = annual_income * retail_multiplier;
  
  return {
    annual_income,
    valuation
  };
}

export function calculateTurnoverValue(
  capacity: number,
  event_days: number,
  avg_spend_per_attendee: number,
  industry_multiplier: number,
  esg_factor: number = 0
): { annual_sales: number; valuation: number } {
  const total_attendees = capacity * event_days;
  const annual_sales = total_attendees * avg_spend_per_attendee * (1 + esg_factor);
  const valuation = annual_sales * industry_multiplier;
  
  return {
    annual_sales,
    valuation
  };
}

export function calculateStadiumValuation(inputs: StadiumInputs): StadiumResults {
  const effective_esg_factor = inputs.esg_included ? inputs.esg_factor : 0;
  
  // Sublease Income Calculation
  let sublease_results = { annual_income: 0, present_value: 0 };
  if (inputs.sublease_enabled) {
    sublease_results = calculateSubleaseIncome(
      inputs.capacity,
      inputs.occupancy_rate,
      inputs.rentable_area_sqm,
      inputs.rent_per_sqm,
      inputs.discount_rate,
      inputs.forecast_years,
      effective_esg_factor
    );
  }
  
  // Retail Income Calculation
  let retail_results = { annual_income: 0, valuation: 0 };
  if (inputs.retail_enabled) {
    retail_results = calculateRetailIncome(
      inputs.capacity,
      inputs.event_days,
      inputs.avg_spend_per_attendee,
      inputs.retail_multiplier,
      effective_esg_factor
    );
  }
  
  // Turnover Method Calculation
  let turnover_results = { annual_sales: 0, valuation: 0 };
  if (inputs.turnover_enabled) {
    turnover_results = calculateTurnoverValue(
      inputs.capacity,
      inputs.event_days,
      inputs.avg_spend_per_attendee,
      inputs.industry_multiplier,
      effective_esg_factor
    );
  }
  
  // Calculate valuation average and range
  const valuations = [
    inputs.sublease_enabled ? sublease_results.present_value : 0,
    inputs.retail_enabled ? retail_results.valuation : 0,
    inputs.turnover_enabled ? turnover_results.valuation : 0
  ].filter(val => val > 0);
  
  const valuation_average = valuations.length > 0 ? valuations.reduce((sum, val) => sum + val, 0) / valuations.length : 0;
  const valuation_range = {
    low: valuations.length > 0 ? Math.min(...valuations) : 0,
    high: valuations.length > 0 ? Math.max(...valuations) : 0
  };
  
  return {
    capacity: inputs.capacity,
    event_days: inputs.event_days,
    avg_spend_per_attendee: inputs.avg_spend_per_attendee,
    sublease_annual_income: sublease_results.annual_income,
    sublease_present_value: sublease_results.present_value,
    sublease_enabled: inputs.sublease_enabled,
    retail_annual_income: retail_results.annual_income,
    retail_valuation: retail_results.valuation,
    retail_enabled: inputs.retail_enabled,
    turnover_annual_sales: turnover_results.annual_sales,
    turnover_valuation: turnover_results.valuation,
    turnover_enabled: inputs.turnover_enabled,
    valuation_average,
    valuation_range,
    esg_factor: effective_esg_factor,
    esg_included: inputs.esg_included
  };
}

export const defaultStadiumInputs: StadiumInputs = {
  capacity: 50000,
  event_days: 25,
  avg_spend_per_attendee: 45,
  sublease_enabled: true,
  rentable_area_sqm: 15000,
  rent_per_sqm: 250,
  occupancy_rate: 0.85,
  discount_rate: 0.08,
  forecast_years: 10,
  retail_enabled: true,
  retail_multiplier: 2.5,
  turnover_enabled: true,
  industry_multiplier: 1.8,
  esg_included: false,
  esg_factor: 0.05
};