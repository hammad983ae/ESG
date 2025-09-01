export interface ProjectCosts {
  building: number;
  financing: number;
  professional_fees: number;
  land: number;
  marketing: number;
}

export interface HypotheticalDevelopmentParams {
  gross_income_per_sqm: number;
  net_outgoings_per_sqm: number;
  total_area_sqm: number;
  cap_rate: number;
  project_costs: ProjectCosts;
  profit_margin: number;
  interest_rate: number;
  construction_period_months: number;
}

export interface HypotheticalDevelopmentResult {
  gross_rent: number;
  net_income: number;
  capitalized_value: number;
  total_construction_cost: number;
  interest_cost: number;
  total_costs: number;
  residual_land_value: number;
  adjusted_value: number;
  risk_factor: number;
}

export function calculateResidualLandValue(
  gross_income_per_sqm: number,
  net_outgoings_per_sqm: number,
  total_area_sqm: number,
  cap_rate: number,
  project_costs: ProjectCosts,
  profit_margin: number,
  interest_rate: number,
  construction_period_months: number
): Omit<HypotheticalDevelopmentResult, 'adjusted_value' | 'risk_factor'> {
  // Calculate gross rental income
  const gross_rent = gross_income_per_sqm * total_area_sqm;
  
  // Net income after operating expenses
  const net_income = gross_rent - (net_outgoings_per_sqm * total_area_sqm);
  
  // Capitalized value at given cap rate
  const capitalized_value = net_income / cap_rate;
  
  // Total construction costs
  const total_construction_cost = (
    project_costs.building +
    project_costs.financing +
    project_costs.professional_fees
  );
  
  // Interest during construction
  const interest_cost = total_construction_cost * (interest_rate / 12) * construction_period_months;
  
  // Total costs including profit margin
  const total_costs = total_construction_cost + interest_cost + project_costs.land + project_costs.marketing + (profit_margin * total_construction_cost);
  
  // Residual land value
  const residual_land_value = capitalized_value - total_costs;
  
  return {
    gross_rent,
    net_income,
    capitalized_value,
    total_construction_cost,
    interest_cost,
    total_costs,
    residual_land_value
  };
}

export function applyRiskAdjustment(base_value: number, risk_factor: number): number {
  return base_value * risk_factor;
}

export function performHypotheticalDevelopmentValuation(
  params: HypotheticalDevelopmentParams,
  risk_factor: number = 1.0
): HypotheticalDevelopmentResult {
  const base_result = calculateResidualLandValue(
    params.gross_income_per_sqm,
    params.net_outgoings_per_sqm,
    params.total_area_sqm,
    params.cap_rate,
    params.project_costs,
    params.profit_margin,
    params.interest_rate,
    params.construction_period_months
  );
  
  const adjusted_value = applyRiskAdjustment(base_result.residual_land_value, risk_factor);
  
  return {
    ...base_result,
    adjusted_value,
    risk_factor
  };
}

export interface SensitivityParams {
  [key: string]: number[];
}

export function sensitivityAnalysis(
  base_params: HypotheticalDevelopmentParams,
  parameter_changes: SensitivityParams
): { [key: string]: number[] } {
  const results: { [key: string]: number[] } = {};
  
  for (const [param, changes] of Object.entries(parameter_changes)) {
    const values: number[] = [];
    for (const change of changes) {
      const params_copy = { ...base_params };
      
      // Apply the change to the appropriate parameter
      if (param === 'gross_income_per_sqm') {
        params_copy.gross_income_per_sqm += change;
      } else if (param === 'cap_rate') {
        params_copy.cap_rate += change;
      } else if (param === 'profit_margin') {
        params_copy.profit_margin += change;
      } else if (param === 'interest_rate') {
        params_copy.interest_rate += change;
      }
      
      const result = calculateResidualLandValue(
        params_copy.gross_income_per_sqm,
        params_copy.net_outgoings_per_sqm,
        params_copy.total_area_sqm,
        params_copy.cap_rate,
        params_copy.project_costs,
        params_copy.profit_margin,
        params_copy.interest_rate,
        params_copy.construction_period_months
      );
      
      values.push(result.residual_land_value);
    }
    results[param] = values;
  }
  
  return results;
}