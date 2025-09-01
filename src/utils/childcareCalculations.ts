export interface ChildcareInputs {
  // LDC Long Day Childcare
  land_value: number;
  construction_cost: number;
  childcare_placements: number;
  cost_per_placement: number;
  esg_land_factor: number;
  esg_construction_factor: number;
  
  // Direct Comparison Data
  comparison_data: ComparisonProperty[];
  
  // Rent Approach
  annual_rent: number;
  cap_rate: number;
  rent_multiplier: number;
  
  // ESG Settings
  esg_included: boolean;
  esg_factor: number;
}

export interface ComparisonProperty {
  id: string;
  sale_price: number;
  size: number;
  rent: number;
  value: number;
  location?: string;
  sale_date?: string;
}

export interface ChildcareResults {
  // LDC Results
  ldc_land_value: number;
  ldc_construction_value: number;
  total_ldc_value: number;
  childcare_placements: number;
  cost_per_placement: number;
  
  // Comparison Results
  average_sale_price: number;
  average_size: number;
  average_rent: number;
  average_value: number;
  price_per_sqm: number;
  
  // Rent Approach Results
  rent_based_value: number;
  rent_multiplier_value: number;
  
  // Summary
  valuation_average: number;
  valuation_range: {
    low: number;
    high: number;
  };
  
  esg_factor: number;
  esg_included: boolean;
}

export function calculateLDCLandValue(land_value: number, esg_factor: number = 0): number {
  return land_value * (1 + esg_factor);
}

export function calculateLDCConstructionValue(construction_cost: number, esg_factor: number = 0): number {
  return construction_cost * (1 + esg_factor);
}

export function calculateCostPerPlacement(construction_cost: number, childcare_placements: number): number {
  return childcare_placements > 0 ? construction_cost / childcare_placements : 0;
}

export function calculateTotalLDCValue(
  land_value: number, 
  construction_cost: number, 
  esg_land: number = 0, 
  esg_construction: number = 0
): number {
  const land_adj = calculateLDCLandValue(land_value, esg_land);
  const construction_adj = calculateLDCConstructionValue(construction_cost, esg_construction);
  return land_adj + construction_adj;
}

export function calculateDirectComparisonValue(
  comp_data: ComparisonProperty[], 
  esg_factor: number = 0
): {
  average_sale_price: number;
  average_size: number;
  average_rent: number;
  average_value: number;
  price_per_sqm: number;
} {
  if (comp_data.length === 0) {
    return {
      average_sale_price: 0,
      average_size: 0,
      average_rent: 0,
      average_value: 0,
      price_per_sqm: 0
    };
  }

  const totals = comp_data.reduce((acc, comp) => ({
    sale_price: acc.sale_price + comp.sale_price,
    size: acc.size + comp.size,
    rent: acc.rent + comp.rent,
    value: acc.value + comp.value
  }), { sale_price: 0, size: 0, rent: 0, value: 0 });

  const count = comp_data.length;
  const avg_sale_price = totals.sale_price / count;
  const avg_size = totals.size / count;
  const avg_rent = totals.rent / count;
  const avg_value = totals.value / count;

  // Apply ESG adjustments
  const adjusted_sale_price = avg_sale_price * (1 + esg_factor);
  const adjusted_value = avg_value * (1 + esg_factor);
  const price_per_sqm = avg_size > 0 ? adjusted_sale_price / avg_size : 0;

  return {
    average_sale_price: adjusted_sale_price,
    average_size: avg_size,
    average_rent: avg_rent,
    average_value: adjusted_value,
    price_per_sqm
  };
}

export function calculateRentApproach(
  annual_rent: number, 
  cap_rate: number, 
  esg_factor: number = 0
): number {
  if (cap_rate === 0) return 0;
  return (annual_rent * (1 + esg_factor)) / cap_rate;
}

export function calculateValueFromRent(
  rent_value: number, 
  rent_multiplier: number, 
  esg_factor: number = 0
): number {
  return rent_value * rent_multiplier * (1 + esg_factor);
}

export function calculateChildcareValuation(inputs: ChildcareInputs): ChildcareResults {
  const effective_esg_factor = inputs.esg_included ? inputs.esg_factor : 0;
  const effective_land_esg = inputs.esg_included ? inputs.esg_land_factor : 0;
  const effective_construction_esg = inputs.esg_included ? inputs.esg_construction_factor : 0;

  // LDC Calculations
  const ldc_land_value = calculateLDCLandValue(inputs.land_value, effective_land_esg);
  const ldc_construction_value = calculateLDCConstructionValue(inputs.construction_cost, effective_construction_esg);
  const total_ldc_value = ldc_land_value + ldc_construction_value;
  const cost_per_placement = calculateCostPerPlacement(inputs.construction_cost, inputs.childcare_placements);

  // Direct Comparison Calculations
  const comparison_results = calculateDirectComparisonValue(inputs.comparison_data, effective_esg_factor);

  // Rent Approach Calculations
  const rent_based_value = calculateRentApproach(inputs.annual_rent, inputs.cap_rate, effective_esg_factor);
  const rent_multiplier_value = calculateValueFromRent(inputs.annual_rent, inputs.rent_multiplier, effective_esg_factor);

  // Calculate valuation average and range
  const valuations = [
    total_ldc_value,
    comparison_results.average_sale_price,
    comparison_results.average_value,
    rent_based_value,
    rent_multiplier_value
  ].filter(val => val > 0);

  const valuation_average = valuations.length > 0 ? valuations.reduce((sum, val) => sum + val, 0) / valuations.length : 0;
  const valuation_range = {
    low: valuations.length > 0 ? Math.min(...valuations) : 0,
    high: valuations.length > 0 ? Math.max(...valuations) : 0
  };

  return {
    ldc_land_value,
    ldc_construction_value,
    total_ldc_value,
    childcare_placements: inputs.childcare_placements,
    cost_per_placement,
    average_sale_price: comparison_results.average_sale_price,
    average_size: comparison_results.average_size,
    average_rent: comparison_results.average_rent,
    average_value: comparison_results.average_value,
    price_per_sqm: comparison_results.price_per_sqm,
    rent_based_value,
    rent_multiplier_value,
    valuation_average,
    valuation_range,
    esg_factor: effective_esg_factor,
    esg_included: inputs.esg_included
  };
}

export const defaultChildcareInputs: ChildcareInputs = {
  land_value: 300000,
  construction_cost: 700000,
  childcare_placements: 75,
  cost_per_placement: 9333, // 700000 / 75
  esg_land_factor: 0.05,
  esg_construction_factor: 0.05,
  comparison_data: [
    {
      id: '1',
      sale_price: 1200000,
      size: 5000,
      rent: 50000,
      value: 1100000,
      location: 'Brisbane North',
      sale_date: '2024-02-15'
    },
    {
      id: '2',
      sale_price: 1250000,
      size: 5200,
      rent: 52000,
      value: 1150000,
      location: 'Brisbane South',
      sale_date: '2024-01-20'
    },
    {
      id: '3',
      sale_price: 1150000,
      size: 4800,
      rent: 49000,
      value: 1050000,
      location: 'Brisbane West',
      sale_date: '2024-03-10'
    }
  ],
  annual_rent: 52000,
  cap_rate: 0.06,
  rent_multiplier: 20,
  esg_included: true,
  esg_factor: 0.05
};