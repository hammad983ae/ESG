export interface HypotheticalDevelopmentParams {
  gross_income_per_sqm: number;
  net_outgoings_per_sqm: number;
  total_area_sqm: number;
  cap_rate: number;
  building_cost: number;
  professional_fees: number;
  land_cost: number;
  marketing_cost: number;
  developer_profit_rate: number;
  interest_rate: number;
  construction_period_months: number;
}

export interface HypotheticalDevelopmentResult {
  gross_rent: number;
  net_income: number;
  capital_value: number;
  total_construction_cost: number;
  interest_cost: number;
  profit: number;
  total_costs: number;
  residual_land_value: number;
}

export function calculateResidualLandValue(
  gross_income_per_sqm: number,
  net_outgoings_per_sqm: number,
  total_area_sqm: number,
  cap_rate: number,
  building_cost: number,
  professional_fees: number,
  land_cost: number,
  marketing_cost: number,
  developer_profit_rate: number,
  interest_rate: number,
  construction_period_months: number
): HypotheticalDevelopmentResult {
  // Gross rental income
  const gross_rent = gross_income_per_sqm * total_area_sqm;
  
  // Operating income after outgoings
  const net_income = gross_rent - (net_outgoings_per_sqm * total_area_sqm);
  
  // Capitalized value
  const capital_value = net_income / cap_rate;
  
  // Total development costs
  const total_construction_cost = building_cost + professional_fees;
  
  // Interest during construction
  const interest_cost = total_construction_cost * (interest_rate / 12) * construction_period_months;
  
  // Developer's profit
  const profit = developer_profit_rate * total_construction_cost;
  
  // Total costs
  const total_costs = total_construction_cost + interest_cost + land_cost + marketing_cost + profit;
  
  // Residual land value
  const residual_land_value = capital_value - total_costs;
  
  return {
    gross_rent,
    net_income,
    capital_value,
    total_construction_cost,
    interest_cost,
    profit,
    total_costs,
    residual_land_value
  };
}

export function performConventionalValuation(params: HypotheticalDevelopmentParams): HypotheticalDevelopmentResult {
  return calculateResidualLandValue(
    params.gross_income_per_sqm,
    params.net_outgoings_per_sqm,
    params.total_area_sqm,
    params.cap_rate,
    params.building_cost,
    params.professional_fees,
    params.land_cost,
    params.marketing_cost,
    params.developer_profit_rate,
    params.interest_rate,
    params.construction_period_months
  );
}

export function performESDValuation(params: HypotheticalDevelopmentParams): HypotheticalDevelopmentResult {
  // ESD typically has lower interest rates and profit margins due to lower risk/higher sustainability
  return calculateResidualLandValue(
    params.gross_income_per_sqm,
    params.net_outgoings_per_sqm,
    params.total_area_sqm,
    params.cap_rate,
    params.building_cost,
    params.professional_fees,
    params.land_cost,
    params.marketing_cost,
    params.developer_profit_rate,
    params.interest_rate, // Should be lower for ESD
    params.construction_period_months
  );
}