export interface PetrolStationInputs {
  // Income Method
  noi: number;
  cap_rate: number;
  
  // Sales Comparison
  comparable_sales: ComparableSale[];
  
  // Land/Asset Value
  land_value: number;
  
  // Replacement Cost
  cost_per_sf: number;
  building_sf: number;
  site_costs: number;
  other_costs: number;
  
  // Rent Approach
  annual_rent: number;
  
  // Multiplier Method
  gross_income: number;
  industry_multiplier: number;
  
  // ESG Settings
  esg_included: boolean;
  esg_factor: number;
  
  // Station Details
  station_type: string;
  fuel_brands: string[];
  location_type: string;
  number_of_pumps: number;
  convenience_store: boolean;
}

export interface ComparableSale {
  id: string;
  sale_price: number;
  location: string;
  sale_date: string;
  station_type: string;
  pumps: number;
  notes?: string;
}

export interface PetrolStationResults {
  // Method Results
  income_method_value: number;
  sales_comparison_value: number;
  land_asset_value: number;
  replacement_cost_value: number;
  rent_approach_value: number;
  multiplier_method_value: number;
  
  // Base Values (without ESG)
  income_method_base: number;
  sales_comparison_base: number;
  land_asset_base: number;
  replacement_cost_base: number;
  rent_approach_base: number;
  multiplier_method_base: number;
  
  // Analysis
  average_valuation: number;
  valuation_range: {
    low: number;
    high: number;
  };
  method_variance: number;
  
  // ESG Impact
  esg_factor: number;
  esg_included: boolean;
  total_esg_impact: number;
  
  // Station Metrics
  value_per_pump: number;
  value_per_sf: number;
}

export function calculateIncomeMethod(noi: number, cap_rate: number, esg_factor: number = 0): number {
  if (cap_rate === 0) return 0;
  return (noi * (1 + esg_factor)) / cap_rate;
}

export function calculateSalesComparison(comp_sales: number[], esg_factor: number = 0): number {
  if (comp_sales.length === 0) return 0;
  const avg_price = comp_sales.reduce((sum, price) => sum + price, 0) / comp_sales.length;
  return avg_price * (1 + esg_factor);
}

export function calculateLandAssetValue(land_value: number, esg_factor: number = 0): number {
  return land_value * (1 + esg_factor);
}

export function calculateReplacementCostPetrol(
  cost_per_sf: number,
  building_sf: number,
  site_costs: number = 0,
  other_costs: number = 0,
  esg_factor: number = 0
): number {
  const base_cost = (cost_per_sf * building_sf) + site_costs + other_costs;
  return base_cost * (1 + esg_factor);
}

export function calculateRentApproach(annual_rent: number, cap_rate: number, esg_factor: number = 0): number {
  if (cap_rate === 0) return 0;
  return (annual_rent * (1 + esg_factor)) / cap_rate;
}

export function calculateMultiplierValue(gross_income: number, multiplier: number, esg_factor: number = 0): number {
  return gross_income * multiplier * (1 + esg_factor);
}

export function calculatePetrolStationValuation(inputs: PetrolStationInputs): PetrolStationResults {
  const effective_esg_factor = inputs.esg_included ? inputs.esg_factor : 0;
  const comp_sales_prices = inputs.comparable_sales.map(sale => sale.sale_price);
  
  // Calculate base values (without ESG)
  const income_method_base = calculateIncomeMethod(inputs.noi, inputs.cap_rate, 0);
  const sales_comparison_base = calculateSalesComparison(comp_sales_prices, 0);
  const land_asset_base = calculateLandAssetValue(inputs.land_value, 0);
  const replacement_cost_base = calculateReplacementCostPetrol(
    inputs.cost_per_sf, 
    inputs.building_sf, 
    inputs.site_costs, 
    inputs.other_costs, 
    0
  );
  const rent_approach_base = calculateRentApproach(inputs.annual_rent, inputs.cap_rate, 0);
  const multiplier_method_base = calculateMultiplierValue(inputs.gross_income, inputs.industry_multiplier, 0);
  
  // Calculate ESG-adjusted values
  const income_method_value = calculateIncomeMethod(inputs.noi, inputs.cap_rate, effective_esg_factor);
  const sales_comparison_value = calculateSalesComparison(comp_sales_prices, effective_esg_factor);
  const land_asset_value = calculateLandAssetValue(inputs.land_value, effective_esg_factor);
  const replacement_cost_value = calculateReplacementCostPetrol(
    inputs.cost_per_sf, 
    inputs.building_sf, 
    inputs.site_costs, 
    inputs.other_costs, 
    effective_esg_factor
  );
  const rent_approach_value = calculateRentApproach(inputs.annual_rent, inputs.cap_rate, effective_esg_factor);
  const multiplier_method_value = calculateMultiplierValue(inputs.gross_income, inputs.industry_multiplier, effective_esg_factor);
  
  // Calculate statistics
  const valuations = [
    income_method_value,
    sales_comparison_value,
    land_asset_value,
    replacement_cost_value,
    rent_approach_value,
    multiplier_method_value
  ].filter(val => val > 0);
  
  const average_valuation = valuations.length > 0 ? valuations.reduce((sum, val) => sum + val, 0) / valuations.length : 0;
  const valuation_range = {
    low: valuations.length > 0 ? Math.min(...valuations) : 0,
    high: valuations.length > 0 ? Math.max(...valuations) : 0
  };
  const method_variance = average_valuation > 0 ? 
    ((valuation_range.high - valuation_range.low) / average_valuation) * 100 : 0;
  
  // Calculate ESG impact
  const base_average = [
    income_method_base,
    sales_comparison_base,
    land_asset_base,
    replacement_cost_base,
    rent_approach_base,
    multiplier_method_base
  ].filter(val => val > 0).reduce((sum, val) => sum + val, 0) / 6;
  
  const total_esg_impact = average_valuation - base_average;
  
  // Station-specific metrics
  const value_per_pump = inputs.number_of_pumps > 0 ? average_valuation / inputs.number_of_pumps : 0;
  const value_per_sf = inputs.building_sf > 0 ? average_valuation / inputs.building_sf : 0;
  
  return {
    income_method_value,
    sales_comparison_value,
    land_asset_value,
    replacement_cost_value,
    rent_approach_value,
    multiplier_method_value,
    income_method_base,
    sales_comparison_base,
    land_asset_base,
    replacement_cost_base,
    rent_approach_base,
    multiplier_method_base,
    average_valuation,
    valuation_range,
    method_variance,
    esg_factor: effective_esg_factor,
    esg_included: inputs.esg_included,
    total_esg_impact,
    value_per_pump,
    value_per_sf
  };
}

export const defaultPetrolStationInputs: PetrolStationInputs = {
  noi: 180000,
  cap_rate: 0.08,
  comparable_sales: [
    {
      id: '1',
      sale_price: 2200000,
      location: 'Brisbane North',
      sale_date: '2024-02-15',
      station_type: 'Full Service',
      pumps: 8,
      notes: 'Major brand, highway location'
    },
    {
      id: '2',
      sale_price: 1850000,
      location: 'Brisbane South',
      sale_date: '2024-01-20',
      station_type: 'Self Service',
      pumps: 6,
      notes: 'Independent brand, suburban'
    },
    {
      id: '3',
      sale_price: 2450000,
      location: 'Brisbane West',
      sale_date: '2024-03-10',
      station_type: 'Full Service',
      pumps: 10,
      notes: 'Premium location with convenience store'
    }
  ],
  land_value: 800000,
  cost_per_sf: 150,
  building_sf: 2500,
  site_costs: 150000,
  other_costs: 75000,
  annual_rent: 120000,
  gross_income: 450000,
  industry_multiplier: 4.5,
  esg_included: true,
  esg_factor: 0.05,
  station_type: 'Full Service',
  fuel_brands: ['Shell', 'BP'],
  location_type: 'Highway',
  number_of_pumps: 8,
  convenience_store: true
};