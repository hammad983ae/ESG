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

export interface RentRevisionInputs {
  // Property and Tenant Details
  property_type: string;
  lessor: string;
  lessee: string;
  commencement_date: string;
  expiring_date: string;
  options_further_terms: string;
  review_date: string;
  
  // Rent Components (NET BASIS)
  face_rent: number;
  effective_rent: number;
  gross_rent: number;
  net_rent: number;
  incentives: number;
  outgoings: number;
  land_tax: number;
  
  // Area and Rate Details
  lettable_area: number;
  outgoings_per_sqm: number;
  land_area: number;
  improved_rent_rate_per_sqm: number;
  
  // Market Analysis
  market_rent: number;
  market_rent_per_sqm: number;
  market_land_rate: number;
  proposed_rent: number;
  proposed_improved_land_rate: number;
  cpi_fixed_adjustments: number;
  revision_effective_date: string;
  
  // Analysis Options
  include_rent_analysis: boolean;
  include_land_analysis: boolean;
  include_esg_factors: boolean;
  
  // Supporting Information
  comparable_evidence: string;
  market_conditions: string;
  esg_notes: string;
}

export interface PropertyTypeConfig {
  name: string;
  icon: any;
  unit: string;
  terminology: string;
  description: string;
  marketRange: string;
  benchmarkSources: string;
}

export interface RentRevisionResults {
  property_type: string;
  lessor: string;
  lessee: string;
  commencement_date: string;
  expiring_date: string;
  options_further_terms: string;
  
  // Rent Analysis (NET BASIS)
  face_rent_annual: number;
  effective_rent_annual: number;
  gross_rent_annual: number;
  net_rent_annual: number;
  current_annual_rent: number;
  proposed_annual_rent: number;
  market_annual_rent: number;
  rent_increase_amount: number;
  rent_increase_percentage: number;
  cpi_adjusted_rent: number;
  market_comparison_variance: number;
  
  // Date Information
  revision_effective_date: string;
  next_review_date: string;
  
  // Supporting Information
  comparable_evidence: string;
  market_conditions: string;
  esg_considerations: string;
  recommendation: string;
  
  // Analysis Options
  include_rent_analysis: boolean;
  include_land_analysis: boolean;
  
  // Land Analysis
  land_analysis: {
    land_area: number;
    market_annual_land_value: number;
    current_annual_land_value: number;
    proposed_annual_land_value: number;
    land_value_increase_amount: number;
    land_value_increase_percentage: number;
  };
  
  // Supporting Analysis
  supporting_analysis: {
    lettable_area: number;
    outgoings_annual: number;
    land_tax_annual: number;
    incentives_annual: number;
    improved_rent_rate_per_sqm: number;
    outgoings_per_sqm: number;
    unit_type: string;
  };
}

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