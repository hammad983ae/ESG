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
  property_type: string;
  tenant_name: string;
  lease_expiry_date: string;
  current_rent: number;
  market_rent: number;
  market_land_rate: number;
  proposed_rent: number;
  units_or_area: number;
  land_area: number;
  current_improved_land_rate: number;
  proposed_improved_land_rate: number;
  include_rent_analysis: boolean;
  include_land_analysis: boolean;
  cpi_adjustment: number;
  revision_date: string;
  comparable_evidence: string;
  market_conditions: string;
  include_esg_factors: boolean;
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
  tenant_name: string;
  current_annual_rent: number;
  proposed_annual_rent: number;
  market_annual_rent: number;
  rent_increase_amount: number;
  rent_increase_percentage: number;
  cpi_adjusted_rent: number;
  market_comparison_variance: number;
  revision_effective_date: string;
  next_review_date: string;
  comparable_evidence: string;
  market_conditions: string;
  esg_considerations: string;
  recommendation: string;
  include_rent_analysis: boolean;
  include_land_analysis: boolean;
  land_analysis: {
    land_area: number;
    market_annual_land_value: number;
    current_annual_land_value: number;
    proposed_annual_land_value: number;
    land_value_increase_amount: number;
    land_value_increase_percentage: number;
  };
  supporting_analysis: {
    current_rate_per_unit: number;
    proposed_rate_per_unit: number;
    market_rate_per_unit: number;
    units_or_area: number;
    unit_type: string;
  };
}

export function calculateRentRevision(inputs: RentRevisionInputs): RentRevisionResults {
  const current_annual_rent = inputs.current_rent * inputs.units_or_area;
  const proposed_annual_rent = inputs.proposed_rent * inputs.units_or_area;
  const market_annual_rent = inputs.market_rent * inputs.units_or_area;
  
  const rent_increase_amount = proposed_annual_rent - current_annual_rent;
  const rent_increase_percentage = inputs.current_rent > 0 
    ? ((inputs.proposed_rent - inputs.current_rent) / inputs.current_rent) * 100 
    : 0;
  
  const cpi_adjusted_rent = inputs.current_rent * (1 + inputs.cpi_adjustment / 100);
  const market_comparison_variance = inputs.market_rent > 0 
    ? ((inputs.proposed_rent - inputs.market_rent) / inputs.market_rent) * 100 
    : 0;

  // Land value calculations
  const market_annual_land_value = inputs.market_land_rate * inputs.land_area;
  const current_annual_land_value = inputs.current_improved_land_rate * inputs.land_area;
  const proposed_annual_land_value = inputs.proposed_improved_land_rate * inputs.land_area;
  const land_value_increase_amount = proposed_annual_land_value - current_annual_land_value;
  const land_value_increase_percentage = inputs.current_improved_land_rate > 0 
    ? ((inputs.proposed_improved_land_rate - inputs.current_improved_land_rate) / inputs.current_improved_land_rate) * 100 
    : 0;

  // Calculate next review date (typically 12 months from revision date)
  const revisionDate = new Date(inputs.revision_date);
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
    tenant_name: inputs.tenant_name,
    current_annual_rent,
    proposed_annual_rent,
    market_annual_rent,
    rent_increase_amount,
    rent_increase_percentage,
    cpi_adjusted_rent: cpi_adjusted_rent * inputs.units_or_area,
    market_comparison_variance,
    revision_effective_date: inputs.revision_date,
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
      current_rate_per_unit: inputs.current_rent,
      proposed_rate_per_unit: inputs.proposed_rent,
      market_rate_per_unit: inputs.market_rent,
      units_or_area: inputs.units_or_area,
      unit_type: unitTypeMap[inputs.property_type] || "units"
    }
  };
}

export const defaultRentRevisionInputs: RentRevisionInputs = {
  property_type: "office",
  tenant_name: "",
  lease_expiry_date: "",
  current_rent: 0,
  market_rent: 0,
  market_land_rate: 0,
  proposed_rent: 0,
  units_or_area: 0,
  land_area: 0,
  current_improved_land_rate: 0,
  proposed_improved_land_rate: 0,
  include_rent_analysis: true,
  include_land_analysis: true,
  cpi_adjustment: 3.5,
  revision_date: new Date().toISOString().split('T')[0],
  comparable_evidence: "",
  market_conditions: "",
  include_esg_factors: false,
  esg_notes: ""
};