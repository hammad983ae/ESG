export interface ChildcareInputs {
  // LDC Direct Comparison Approach
  childcare_placements: number;
  value_per_placement: number;
  
  // Land Value Component
  land_value_included: boolean;
  land_value: number;
  
  // Comparable Data for Per Placement Analysis
  comparison_data: ComparisonProperty[];
  
  // Rental Approach (Gross Rents)
  gross_rent_per_placement: number;
  outgoings_allowance: number; // percentage
  land_tax_allowance: number; // annual amount
  cap_rate: number;
  
  // ESG Settings
  esg_included: boolean;
  esg_factor: number;
}

export interface ComparisonProperty {
  id: string;
  sale_price: number;
  placements: number;
  value_per_placement: number;
  gross_rent_per_placement: number;
  net_rent_per_placement: number;
  location?: string;
  sale_date?: string;
}

export interface ChildcareResults {
  // LDC Direct Comparison Results
  ldc_direct_comparison_value: number;
  childcare_placements: number;
  value_per_placement: number;
  land_value: number;
  land_value_included: boolean;
  
  // Comparison Analysis Results
  average_value_per_placement: number;
  average_gross_rent_per_placement: number;
  average_net_rent_per_placement: number;
  placement_value_range: { low: number; high: number; };
  
  // Rental Approach Results
  gross_annual_rent: number;
  total_outgoings: number;
  net_operating_income: number;
  capitalized_value: number;
  
  // Summary
  valuation_average: number;
  valuation_range: {
    low: number;
    high: number;
  };
  
  esg_factor: number;
  esg_included: boolean;
}

export function calculateLDCDirectComparisonValue(
  placements: number, 
  value_per_placement: number, 
  land_value: number = 0,
  land_value_included: boolean = false,
  esg_factor: number = 0
): number {
  const placement_value = placements * value_per_placement * (1 + esg_factor);
  return land_value_included ? placement_value + land_value : placement_value;
}

export function calculateComparisonAnalysis(
  comp_data: ComparisonProperty[], 
  esg_factor: number = 0
): {
  average_value_per_placement: number;
  average_gross_rent_per_placement: number;
  average_net_rent_per_placement: number;
  placement_value_range: { low: number; high: number; };
} {
  if (comp_data.length === 0) {
    return {
      average_value_per_placement: 0,
      average_gross_rent_per_placement: 0,
      average_net_rent_per_placement: 0,
      placement_value_range: { low: 0, high: 0 }
    };
  }

  const totals = comp_data.reduce((acc, comp) => ({
    value_per_placement: acc.value_per_placement + comp.value_per_placement,
    gross_rent_per_placement: acc.gross_rent_per_placement + comp.gross_rent_per_placement,
    net_rent_per_placement: acc.net_rent_per_placement + comp.net_rent_per_placement
  }), { value_per_placement: 0, gross_rent_per_placement: 0, net_rent_per_placement: 0 });

  const count = comp_data.length;
  const avg_value_per_placement = (totals.value_per_placement / count) * (1 + esg_factor);
  const avg_gross_rent_per_placement = (totals.gross_rent_per_placement / count) * (1 + esg_factor);
  const avg_net_rent_per_placement = (totals.net_rent_per_placement / count) * (1 + esg_factor);

  const placement_values = comp_data.map(comp => comp.value_per_placement * (1 + esg_factor));
  const placement_value_range = {
    low: placement_values.length > 0 ? Math.min(...placement_values) : 0,
    high: placement_values.length > 0 ? Math.max(...placement_values) : 0
  };

  return {
    average_value_per_placement: avg_value_per_placement,
    average_gross_rent_per_placement: avg_gross_rent_per_placement,
    average_net_rent_per_placement: avg_net_rent_per_placement,
    placement_value_range
  };
}

export function calculateRentalApproach(
  placements: number,
  gross_rent_per_placement: number,
  outgoings_allowance: number,
  land_tax_allowance: number,
  cap_rate: number,
  esg_factor: number = 0
): {
  gross_annual_rent: number;
  total_outgoings: number;
  net_operating_income: number;
  capitalized_value: number;
} {
  if (cap_rate === 0) {
    return {
      gross_annual_rent: 0,
      total_outgoings: 0,
      net_operating_income: 0,
      capitalized_value: 0
    };
  }

  const gross_annual_rent = placements * gross_rent_per_placement * (1 + esg_factor);
  const outgoings_amount = gross_annual_rent * outgoings_allowance;
  const total_outgoings = outgoings_amount + land_tax_allowance;
  const net_operating_income = gross_annual_rent - total_outgoings;
  const capitalized_value = net_operating_income / cap_rate;

  return {
    gross_annual_rent,
    total_outgoings,
    net_operating_income,
    capitalized_value
  };
}

export function calculateChildcareValuation(inputs: ChildcareInputs): ChildcareResults {
  const effective_esg_factor = inputs.esg_included ? inputs.esg_factor : 0;

  // LDC Direct Comparison Calculation
  const ldc_direct_comparison_value = calculateLDCDirectComparisonValue(
    inputs.childcare_placements, 
    inputs.value_per_placement, 
    inputs.land_value,
    inputs.land_value_included,
    effective_esg_factor
  );

  // Comparison Analysis
  const comparison_results = calculateComparisonAnalysis(inputs.comparison_data, effective_esg_factor);

  // Rental Approach Calculations
  const rental_results = calculateRentalApproach(
    inputs.childcare_placements,
    inputs.gross_rent_per_placement,
    inputs.outgoings_allowance,
    inputs.land_tax_allowance,
    inputs.cap_rate,
    effective_esg_factor
  );

  // Calculate valuation average and range
  const valuations = [
    ldc_direct_comparison_value,
    rental_results.capitalized_value
  ].filter(val => val > 0);

  const valuation_average = valuations.length > 0 ? valuations.reduce((sum, val) => sum + val, 0) / valuations.length : 0;
  const valuation_range = {
    low: valuations.length > 0 ? Math.min(...valuations) : 0,
    high: valuations.length > 0 ? Math.max(...valuations) : 0
  };

  return {
    ldc_direct_comparison_value,
    childcare_placements: inputs.childcare_placements,
    value_per_placement: inputs.value_per_placement * (1 + effective_esg_factor),
    land_value: inputs.land_value,
    land_value_included: inputs.land_value_included,
    average_value_per_placement: comparison_results.average_value_per_placement,
    average_gross_rent_per_placement: comparison_results.average_gross_rent_per_placement,
    average_net_rent_per_placement: comparison_results.average_net_rent_per_placement,
    placement_value_range: comparison_results.placement_value_range,
    gross_annual_rent: rental_results.gross_annual_rent,
    total_outgoings: rental_results.total_outgoings,
    net_operating_income: rental_results.net_operating_income,
    capitalized_value: rental_results.capitalized_value,
    valuation_average,
    valuation_range,
    esg_factor: effective_esg_factor,
    esg_included: inputs.esg_included
  };
}

export const defaultChildcareInputs: ChildcareInputs = {
  childcare_placements: 169,
  value_per_placement: 60000, // Based on user's example ($40,765 to $86,451 range, mid-point $60,000)
  land_value_included: false,
  land_value: 0,
  comparison_data: [
    {
      id: '1',
      sale_price: 6800000,
      placements: 170,
      value_per_placement: 40000,
      gross_rent_per_placement: 3500,
      net_rent_per_placement: 3200,
      location: 'Brisbane North',
      sale_date: '2024-02-15'
    },
    {
      id: '2',
      sale_price: 14700000,
      placements: 170,
      value_per_placement: 86451,
      gross_rent_per_placement: 4406,
      net_rent_per_placement: 4000,
      location: 'Brisbane South',
      sale_date: '2024-01-20'
    },
    {
      id: '3',
      sale_price: 6925000,
      placements: 170,
      value_per_placement: 40765,
      gross_rent_per_placement: 3486,
      net_rent_per_placement: 3200,
      location: 'Brisbane West',
      sale_date: '2024-03-10'
    }
  ],
  gross_rent_per_placement: 2959, // From user's example
  outgoings_allowance: 0.01, // 1% for partial outgoings
  land_tax_allowance: 5000, // Annual land tax allowance
  cap_rate: 0.055, // 5.5% from user's example
  esg_included: true,
  esg_factor: 0.05
};