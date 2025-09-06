/**
 * Sustaino Pro - ESG Property Assessment Platform - Rent Revision Calculations
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Rent revision calculations with property-specific terminology and market analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

/**
 * Input parameters for rent revision calculations
 * Contains property details, rent components, and market analysis data
 */
export interface RentRevisionInputs {
  /** Property type classification */
  property_type: string;
  /** Lessor (landlord) name */
  lessor: string;
  /** Lessee (tenant) name */
  lessee: string;
  /** Lease commencement date (YYYY-MM-DD) */
  commencement_date: string;
  /** Lease expiry date (YYYY-MM-DD) */
  expiring_date: string;
  /** Options and further terms description */
  options_further_terms: string;
  /** Next rent review date (YYYY-MM-DD) */
  review_date: string;
  
  /** Face rent per unit (NET BASIS) */
  face_rent: number;
  /** Effective rent per unit after incentives (NET BASIS) */
  effective_rent: number;
  /** Gross rent per unit including outgoings */
  gross_rent: number;
  /** Net rent per unit (NET BASIS) */
  net_rent: number;
  /** Incentives per unit */
  incentives: number;
  /** Outgoings per unit */
  outgoings: number;
  /** Land tax per unit */
  land_tax: number;
  
  /** Lettable area in square meters or units */
  lettable_area: number;
  /** Outgoings per square meter */
  outgoings_per_sqm: number;
  /** Land area in square meters */
  land_area: number;
  /** Improved rent rate per square meter */
  improved_rent_rate_per_sqm: number;
  
  /** Market rent per unit */
  market_rent: number;
  /** Market rent per square meter */
  market_rent_per_sqm: number;
  /** Market land rate per square meter */
  market_land_rate: number;
  /** Proposed rent per unit */
  proposed_rent: number;
  /** Proposed improved land rate per square meter */
  proposed_improved_land_rate: number;
  /** CPI fixed adjustments percentage */
  cpi_fixed_adjustments: number;
  /** Revision effective date (YYYY-MM-DD) */
  revision_effective_date: string;
  
  /** Whether to include rent analysis */
  include_rent_analysis: boolean;
  /** Whether to include land analysis */
  include_land_analysis: boolean;
  /** Whether to include ESG factors */
  include_esg_factors: boolean;
  
  /** Comparable evidence description */
  comparable_evidence: string;
  /** Market conditions description */
  market_conditions: string;
  /** ESG considerations notes */
  esg_notes: string;
}

/**
 * Property type configuration for rent revision analysis
 * Contains property-specific terminology and market information
 */
export interface PropertyTypeConfig {
  /** Property type name */
  name: string;
  /** React icon component for UI display */
  icon: React.ElementType;
  /** Unit of measurement (e.g., "sqm", "hectares") */
  unit: string;
  /** Property-specific terminology */
  terminology: string;
  /** Property description */
  description: string;
  /** Market rental range */
  marketRange: string;
  /** Benchmark data sources */
  benchmarkSources: string;
}

/**
 * Results from rent revision calculations
 * Contains comprehensive rent analysis, land analysis, and market comparisons
 */
export interface RentRevisionResults {
  /** Property type classification */
  property_type: string;
  /** Lessor (landlord) name */
  lessor: string;
  /** Lessee (tenant) name */
  lessee: string;
  /** Lease commencement date (YYYY-MM-DD) */
  commencement_date: string;
  /** Lease expiry date (YYYY-MM-DD) */
  expiring_date: string;
  /** Options and further terms description */
  options_further_terms: string;
  
  /** Annual face rent (NET BASIS) */
  face_rent_annual: number;
  /** Annual effective rent after incentives (NET BASIS) */
  effective_rent_annual: number;
  /** Annual gross rent including outgoings */
  gross_rent_annual: number;
  /** Annual net rent (NET BASIS) */
  net_rent_annual: number;
  /** Current annual rent amount */
  current_annual_rent: number;
  /** Proposed annual rent amount */
  proposed_annual_rent: number;
  /** Market annual rent amount */
  market_annual_rent: number;
  /** Rent increase amount in dollars */
  rent_increase_amount: number;
  /** Rent increase percentage */
  rent_increase_percentage: number;
  /** CPI-adjusted annual rent */
  cpi_adjusted_rent: number;
  /** Market comparison variance percentage */
  market_comparison_variance: number;
  
  /** Revision effective date (YYYY-MM-DD) */
  revision_effective_date: string;
  /** Next review date (YYYY-MM-DD) */
  next_review_date: string;
  
  /** Comparable evidence description */
  comparable_evidence: string;
  /** Market conditions description */
  market_conditions: string;
  /** ESG considerations notes */
  esg_considerations: string;
  /** Professional recommendation */
  recommendation: string;
  
  /** Whether rent analysis was included */
  include_rent_analysis: boolean;
  /** Whether land analysis was included */
  include_land_analysis: boolean;
  
  /** Land value analysis results */
  land_analysis: {
    /** Land area in square meters */
    land_area: number;
    /** Market annual land value */
    market_annual_land_value: number;
    /** Current annual land value */
    current_annual_land_value: number;
    /** Proposed annual land value */
    proposed_annual_land_value: number;
    /** Land value increase amount in dollars */
    land_value_increase_amount: number;
    /** Land value increase percentage */
    land_value_increase_percentage: number;
  };
  
  /** Supporting analysis data */
  supporting_analysis: {
    /** Lettable area in square meters or units */
    lettable_area: number;
    /** Annual outgoings amount */
    outgoings_annual: number;
    /** Annual land tax amount */
    land_tax_annual: number;
    /** Annual incentives amount */
    incentives_annual: number;
    /** Improved rent rate per square meter */
    improved_rent_rate_per_sqm: number;
    /** Outgoings per square meter */
    outgoings_per_sqm: number;
    /** Unit type description */
    unit_type: string;
  };
}

/**
 * Rent conversion utility functions
 * Helper functions for converting between different rent types
 */

/**
 * Convert gross rent to net rent after incentives
 * @param grossRent - Gross rent amount
 * @param incentiveRate - Incentive rate as decimal (e.g., 0.1 for 10%)
 * @returns Net rent after incentives
 * @example
 * ```typescript
 * const netRent = grossToNetRent(1000, 0.1);
 * console.log(netRent); // 900
 * ```
 */
export function grossToNetRent(grossRent: number, incentiveRate: number): number {
  return grossRent * (1 - incentiveRate);
}

/**
 * Convert face rent to effective rent after incentives
 * @param faceRent - Face rent amount
 * @param incentiveRate - Incentive rate as decimal (e.g., 0.1 for 10%)
 * @returns Effective rent after incentives
 * @example
 * ```typescript
 * const effectiveRent = faceToEffectiveRent(1000, 0.1);
 * console.log(effectiveRent); // 900
 * ```
 */
export function faceToEffectiveRent(faceRent: number, incentiveRate: number): number {
  return faceRent * (1 - incentiveRate);
}

/**
 * Convert effective rent to net rent after additional deductions
 * @param effectiveRent - Effective rent amount
 * @param additionalDeductions - Additional deductions amount (default: 0)
 * @returns Net rent after additional deductions
 * @example
 * ```typescript
 * const netRent = effectiveToNetRent(900, 50);
 * console.log(netRent); // 850
 * ```
 */
export function effectiveToNetRent(effectiveRent: number, additionalDeductions: number = 0): number {
  return effectiveRent - additionalDeductions;
}

/**
 * Calculate total deductions (outgoings + land tax)
 * @param outgoings - Outgoings amount
 * @param landTax - Land tax amount
 * @returns Total deductions amount
 * @example
 * ```typescript
 * const totalDeductions = calculateTotalDeductions(100, 20);
 * console.log(totalDeductions); // 120
 * ```
 */
export function calculateTotalDeductions(outgoings: number, landTax: number): number {
  return outgoings + landTax;
}

/**
 * Calculate comprehensive rent revision analysis
 * @param inputs - Rent revision input parameters
 * @returns RentRevisionResults with detailed analysis and recommendations
 * @example
 * ```typescript
 * const inputs: RentRevisionInputs = {
 *   property_type: "office",
 *   net_rent: 450,
 *   proposed_rent: 480,
 *   lettable_area: 1000,
 *   // ... other required fields
 * };
 * const results = calculateRentRevision(inputs);
 * console.log(results.rent_increase_percentage); // 6.67
 * ```
 */
export function calculateRentRevision(inputs: RentRevisionInputs): RentRevisionResults {
  // Calculate annual rent values (NET BASIS)
  const face_rent_annual = inputs.face_rent * inputs.lettable_area;
  const effective_rent_annual = inputs.effective_rent * inputs.lettable_area;
  const gross_rent_annual = inputs.gross_rent * inputs.lettable_area;
  const net_rent_annual = inputs.net_rent * inputs.lettable_area;
  const current_annual_rent = net_rent_annual;
  const proposed_annual_rent = inputs.proposed_rent * inputs.lettable_area;
  const market_annual_rent = inputs.market_rent * inputs.lettable_area;
  
  const rent_increase_amount = proposed_annual_rent - current_annual_rent;
  const rent_increase_percentage = inputs.net_rent > 0 
    ? ((inputs.proposed_rent - inputs.net_rent) / inputs.net_rent) * 100 
    : 0;
  
  const cpi_adjusted_rent = inputs.net_rent * (1 + inputs.cpi_fixed_adjustments / 100);
  const market_comparison_variance = inputs.market_rent > 0 
    ? ((inputs.proposed_rent - inputs.market_rent) / inputs.market_rent) * 100 
    : 0;

  // Land value calculations
  const market_annual_land_value = inputs.market_land_rate * inputs.land_area;
  const current_annual_land_value = inputs.improved_rent_rate_per_sqm * inputs.land_area;
  const proposed_annual_land_value = inputs.proposed_improved_land_rate * inputs.land_area;
  const land_value_increase_amount = proposed_annual_land_value - current_annual_land_value;
  const land_value_increase_percentage = inputs.improved_rent_rate_per_sqm > 0 
    ? ((inputs.proposed_improved_land_rate - inputs.improved_rent_rate_per_sqm) / inputs.improved_rent_rate_per_sqm) * 100 
    : 0;

  // Calculate next review date (typically 12 months from revision date)
  const revisionDate = new Date(inputs.revision_effective_date);
  const nextReviewDate = new Date(revisionDate);
  nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);

  // Generate recommendation based on market analysis
  let recommendation = "";
  if (rent_increase_percentage <= 3) {
    recommendation = "Conservative increase aligned with CPI growth";
  } else if (rent_increase_percentage <= 10) {
    recommendation = "Moderate increase supported by market evidence";
  } else if (rent_increase_percentage <= 20) {
    recommendation = "Significant increase requires strong market justification";
  } else {
    recommendation = "Major increase - ensure comprehensive market support";
  }

  // Determine unit type description
  const unitTypeMap: Record<string, string> = {
    childcare: "LDC placements",
    office: "square meters",
    retail: "square meters",
    warehouse: "square meters",
    agricultural: "hectares",
    hospitality: "rooms/keys",
    retirement: "units",
    petrol: "sites",
    stadium: "seats",
    healthcare: "beds/rooms",
    residential: "properties"
  };

  return {
    property_type: inputs.property_type,
    lessor: inputs.lessor,
    lessee: inputs.lessee,
    commencement_date: inputs.commencement_date,
    expiring_date: inputs.expiring_date,
    options_further_terms: inputs.options_further_terms,
    face_rent_annual,
    effective_rent_annual,
    gross_rent_annual,
    net_rent_annual,
    current_annual_rent,
    proposed_annual_rent,
    market_annual_rent,
    rent_increase_amount,
    rent_increase_percentage,
    cpi_adjusted_rent: cpi_adjusted_rent * inputs.lettable_area,
    market_comparison_variance,
    revision_effective_date: inputs.revision_effective_date,
    next_review_date: nextReviewDate.toISOString().split('T')[0],
    comparable_evidence: inputs.comparable_evidence,
    market_conditions: inputs.market_conditions,
    esg_considerations: inputs.include_esg_factors ? inputs.esg_notes : "",
    recommendation,
    include_rent_analysis: inputs.include_rent_analysis,
    include_land_analysis: inputs.include_land_analysis,
    land_analysis: {
      land_area: inputs.land_area,
      market_annual_land_value,
      current_annual_land_value,
      proposed_annual_land_value,
      land_value_increase_amount,
      land_value_increase_percentage
    },
    supporting_analysis: {
      lettable_area: inputs.lettable_area,
      outgoings_annual: inputs.outgoings * inputs.lettable_area,
      land_tax_annual: inputs.land_tax * inputs.lettable_area,
      incentives_annual: inputs.incentives * inputs.lettable_area,
      improved_rent_rate_per_sqm: inputs.improved_rent_rate_per_sqm,
      outgoings_per_sqm: inputs.outgoings_per_sqm,
      unit_type: unitTypeMap[inputs.property_type] || "units"
    }
  };
}

/**
 * Default rent revision inputs for form initialization
 * Provides sensible defaults for all required fields
 */
export const defaultRentRevisionInputs: RentRevisionInputs = {
  property_type: "office",
  lessor: "",
  lessee: "",
  commencement_date: "",
  expiring_date: "",
  options_further_terms: "",
  review_date: "",
  face_rent: 0,
  effective_rent: 0,
  gross_rent: 0,
  net_rent: 0,
  incentives: 0,
  outgoings: 0,
  land_tax: 0,
  lettable_area: 0,
  outgoings_per_sqm: 0,
  land_area: 0,
  improved_rent_rate_per_sqm: 0,
  market_rent: 0,
  market_rent_per_sqm: 0,
  market_land_rate: 0,
  proposed_rent: 0,
  proposed_improved_land_rate: 0,
  cpi_fixed_adjustments: 3.5,
  revision_effective_date: new Date().toISOString().split('T')[0],
  include_rent_analysis: true,
  include_land_analysis: true,
  include_esg_factors: false,
  comparable_evidence: "",
  market_conditions: "",
  esg_notes: ""
};

/**
 * Pre-populated sample data for different property types
 * Contains realistic sample data for testing and demonstration purposes
 */
export const sampleRentRevisionData: Record<string, RentRevisionInputs> = {
  office: {
    property_type: "office",
    lessor: "Melbourne Property Holdings Pty Ltd",
    lessee: "Tech Solutions Australia Pty Ltd",
    commencement_date: "2020-01-01",
    expiring_date: "2025-12-31",
    options_further_terms: "2 x 5 year options",
    review_date: "2025-01-01",
    face_rent: 450,
    effective_rent: 420,
    gross_rent: 520,
    net_rent: 420,
    incentives: 30,
    outgoings: 100,
    land_tax: 15,
    lettable_area: 850,
    outgoings_per_sqm: 100,
    land_area: 1200,
    improved_rent_rate_per_sqm: 420,
    market_rent: 480,
    market_rent_per_sqm: 480,
    market_land_rate: 180,
    proposed_rent: 470,
    proposed_improved_land_rate: 190,
    cpi_fixed_adjustments: 3.5,
    revision_effective_date: "2025-01-01",
    include_rent_analysis: true,
    include_land_analysis: true,
    include_esg_factors: true,
    comparable_evidence: "Recent leasing at 123 Collins Street at $485/sqm, 456 Bourke Street at $475/sqm, and comparable CBD towers achieving $480-$490/sqm for similar A-Grade space with modern fitouts.",
    market_conditions: "Melbourne CBD office market showing moderate growth with increased demand for quality space. ESG-compliant buildings commanding premium rents of 5-10% above market average.",
    esg_notes: "Property features NABERS 4.5 star energy rating, LED lighting, smart HVAC systems, and certified green building materials contributing to ESG compliance."
  },
  retail: {
    property_type: "retail",
    lessor: "Westfield Property Group",
    lessee: "Fashion Retail Pty Ltd",
    commencement_date: "2021-03-01",
    expiring_date: "2026-02-28",
    options_further_terms: "1 x 5 year option",
    review_date: "2025-03-01",
    face_rent: 850,
    effective_rent: 780,
    gross_rent: 950,
    net_rent: 780,
    incentives: 70,
    outgoings: 170,
    land_tax: 25,
    lettable_area: 180,
    outgoings_per_sqm: 170,
    land_area: 200,
    improved_rent_rate_per_sqm: 780,
    market_rent: 820,
    market_rent_per_sqm: 820,
    market_land_rate: 350,
    proposed_rent: 810,
    proposed_improved_land_rate: 360,
    cpi_fixed_adjustments: 3.2,
    revision_effective_date: "2025-03-01",
    include_rent_analysis: true,
    include_land_analysis: true,
    include_esg_factors: true,
    comparable_evidence: "Recent retail leasing in Chadstone Shopping Centre achieving $800-$850/sqm, Westfield Doncaster at $790-$820/sqm for similar fashion retail spaces.",
    market_conditions: "Retail market recovery post-COVID with strong foot traffic returning. Premium shopping centres maintaining rental growth of 3-5% annually.",
    esg_notes: "Shopping centre features solar panels, rainwater harvesting, waste reduction programs, and sustainable design elements supporting tenant ESG objectives."
  },
  childcare: {
    property_type: "childcare",
    lessor: "Educational Properties Trust",
    lessee: "Little Learners Childcare Pty Ltd",
    commencement_date: "2019-07-01",
    expiring_date: "2024-06-30",
    options_further_terms: "2 x 10 year options",
    review_date: "2024-07-01",
    face_rent: 1200,
    effective_rent: 1150,
    gross_rent: 1350,
    net_rent: 1150,
    incentives: 50,
    outgoings: 200,
    land_tax: 35,
    lettable_area: 75, // LDC places
    outgoings_per_sqm: 200,
    land_area: 2500,
    improved_rent_rate_per_sqm: 1150,
    market_rent: 1250,
    market_rent_per_sqm: 1250,
    market_land_rate: 120,
    proposed_rent: 1220,
    proposed_improved_land_rate: 125,
    cpi_fixed_adjustments: 3.8,
    revision_effective_date: "2024-07-01",
    include_rent_analysis: true,
    include_land_analysis: true,
    include_esg_factors: true,
    comparable_evidence: "Recent childcare centre transactions showing $1,200-$1,300 per LDC placement. Similar 75-place centres in growth corridors achieving $1,250-$1,280 per placement.",
    market_conditions: "Strong demand for quality childcare centres driven by government subsidies and population growth. Premium locations with modern facilities commanding higher rents.",
    esg_notes: "Purpose-built childcare facility with natural lighting, sustainable materials, organic gardens, and energy-efficient systems supporting child development and environmental education."
  },
  warehouse: {
    property_type: "warehouse",
    lessor: "Industrial Estates Pty Ltd",
    lessee: "Logistics Solutions Australia",
    commencement_date: "2022-01-01",
    expiring_date: "2027-12-31",
    options_further_terms: "1 x 5 year option",
    review_date: "2025-01-01",
    face_rent: 120,
    effective_rent: 110,
    gross_rent: 140,
    net_rent: 110,
    incentives: 10,
    outgoings: 30,
    land_tax: 8,
    lettable_area: 5000,
    outgoings_per_sqm: 30,
    land_area: 8000,
    improved_rent_rate_per_sqm: 110,
    market_rent: 125,
    market_rent_per_sqm: 125,
    market_land_rate: 45,
    proposed_rent: 122,
    proposed_improved_land_rate: 48,
    cpi_fixed_adjustments: 3.5,
    revision_effective_date: "2025-01-01",
    include_rent_analysis: true,
    include_land_analysis: true,
    include_esg_factors: false,
    comparable_evidence: "Recent warehouse leasing in industrial corridor achieving $120-$130/sqm. Modern facilities with high clearance and good truck access commanding premium rates.",
    market_conditions: "Strong industrial market driven by e-commerce growth and supply chain optimization. Limited supply of quality warehouse space supporting rental growth.",
    esg_notes: ""
  }
};