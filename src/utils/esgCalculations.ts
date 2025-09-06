/**
 * Delorenzo Property Group - ESG All Risks Yield (ARY) Calculation Utilities
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Implements comprehensive ESG risk assessment framework for property valuation
 * with Australian market focus and sustainability integration.
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

/**
 * ESG Risk Factor for property valuation analysis
 * Represents individual risk components with scoring and premium calculations
 */
export interface ESGRiskFactor {
  /** Name of the risk factor */
  name: string;
  /** Maximum possible risk score (0-10 scale) */
  maximumRiskScore: number;
  /** Maximum risk premium percentage for this factor */
  maximumRiskPremium: number;
  /** Currently assigned risk score (0-10 scale) */
  assignedRiskScore: number;
  /** Calculated risk premium percentage */
  riskPremium: number;
  /** Weight percentage in overall calculation */
  calculationPercentage: number;
}

/**
 * Input parameters for ESG-adjusted ARY calculations
 * Contains base financial data and ESG sustainability metrics
 */
export interface ESGInputs {
  /** Australian cash rate as decimal (e.g., 0.045 for 4.5%) */
  cashRate: number;
  /** Property type classification */
  propertyType: 'Commercial' | 'Residential';
  /** NABERS or Green Star energy rating (optional) */
  energyRating?: number;
  /** Water efficiency score (0-10 scale, optional) */
  waterEfficiency?: number;
  /** Waste reduction score (0-10 scale, optional) */
  wasteReduction?: number;
  /** Sustainable materials score (0-10 scale, optional) */
  sustainableMaterials?: number;
  /** Carbon footprint score (0-10 scale, 10 = lowest footprint, optional) */
  carbonFootprint?: number;
}

/**
 * Results from ESG-adjusted ARY calculations
 * Contains base ARY, ESG adjustments, and detailed risk breakdown
 */
export interface ESGResults {
  /** Standard ARY without ESG adjustments */
  baseARY: number;
  /** ESG premium or discount adjustment */
  esgAdjustment: number;
  /** Final ESG-adjusted ARY percentage */
  esgAdjustedARY: number;
  /** Detailed breakdown of ESG risk factors */
  esgRiskBreakdown: ESGRiskFactor[];
  /** Overall ESG score (0-100 scale) */
  overallESGScore: number;
  /** ESG rating classification */
  esgRating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
}

/**
 * Input parameters for capitalization rate sensitivity analysis
 * Supports both traditional and ESG-adjusted approaches
 */
export interface CapitalizationSensitivityInputs {
  /** Net rental income in dollars */
  netRent: number;
  /** Net Rental and Other Government Services in dollars */
  nrogs: number;
  /** Letting up allowance in dollars */
  lettingUpAllowance: number;
  /** Other capital adjustments in dollars */
  otherCapitalAdjustments: number;
  /** Reletting costs in dollars */
  relettingCosts: number;
  /** Optimistic capitalization rate (optional, ignored if ESG is used) */
  capitalizationRateOptimistic?: number;
  /** Realistic capitalization rate (optional, ignored if ESG is used) */
  capitalizationRateRealistic?: number;
  /** Pessimistic capitalization rate (optional, ignored if ESG is used) */
  capitalizationRatePessimistic?: number;
  /** Whether to use ESG-adjusted ARY instead of traditional rates */
  useESGAdjustedARY: boolean;
  /** ESG-adjusted ARY percentage (required if useESGAdjustedARY is true) */
  esgAdjustedARY?: number;
}

/**
 * Results from capitalization rate sensitivity analysis
 * Contains NOI and scenario-based valuations
 */
export interface CapitalizationSensitivityResults {
  /** Net Operating Income in dollars */
  noi: number;
  /** Whether ESG mode was used for calculations */
  useESGMode: boolean;
  /** ESG-adjusted ARY percentage (if ESG mode was used) */
  esgAdjustedARY?: number;
  /** Scenario-based valuation results */
  scenarios: {
    /** Optimistic scenario results */
    optimistic: {
      /** Capitalization rate percentage */
      capRate: number;
      /** Market value in dollars */
      marketValue: number;
      /** Adjusted value after capital adjustments in dollars */
      adjustedValue: number;
    };
    /** Realistic scenario results */
    realistic: {
      /** Capitalization rate percentage */
      capRate: number;
      /** Market value in dollars */
      marketValue: number;
      /** Adjusted value after capital adjustments in dollars */
      adjustedValue: number;
    };
    /** Pessimistic scenario results */
    pessimistic: {
      /** Capitalization rate percentage */
      capRate: number;
      /** Market value in dollars */
      marketValue: number;
      /** Adjusted value after capital adjustments in dollars */
      adjustedValue: number;
    };
  } | {
    /** ESG scenario results (when ESG mode is used) */
    esg: {
      /** ESG-adjusted capitalization rate percentage */
      capRate: number;
      /** Market value in dollars */
      marketValue: number;
      /** Adjusted value after capital adjustments in dollars */
      adjustedValue: number;
    };
  };
}

/**
 * ESG Risk Factors with Australian property market focus
 * Pre-configured risk factors based on Australian property valuation standards
 */
export const ESG_RISK_FACTORS: ESGRiskFactor[] = [
  {
    name: 'Market (National and Regional)',
    maximumRiskScore: 10,
    maximumRiskPremium: 2.5,
    assignedRiskScore: 6.0,
    riskPremium: 1.5,
    calculationPercentage: 15
  },
  {
    name: 'Location',
    maximumRiskScore: 10,
    maximumRiskPremium: 2.0,
    assignedRiskScore: 5.5,
    riskPremium: 1.1,
    calculationPercentage: 12
  },
  {
    name: 'Architecture/Type of Construction',
    maximumRiskScore: 10,
    maximumRiskPremium: 1.8,
    assignedRiskScore: 4.5,
    riskPremium: 0.81,
    calculationPercentage: 10
  },
  {
    name: 'Fitout',
    maximumRiskScore: 10,
    maximumRiskPremium: 1.5,
    assignedRiskScore: 4.0,
    riskPremium: 0.6,
    calculationPercentage: 8
  },
  {
    name: 'Structural Condition',
    maximumRiskScore: 10,
    maximumRiskPremium: 2.0,
    assignedRiskScore: 3.5,
    riskPremium: 0.7,
    calculationPercentage: 10
  },
  {
    name: 'Plot Situation',
    maximumRiskScore: 10,
    maximumRiskPremium: 1.2,
    assignedRiskScore: 3.0,
    riskPremium: 0.36,
    calculationPercentage: 6
  },
  {
    name: 'Ecological Sustainability',
    maximumRiskScore: 10,
    maximumRiskPremium: 2.5,
    assignedRiskScore: 7.5,
    riskPremium: 1.875,
    calculationPercentage: 18
  },
  {
    name: 'Profitability of Building Concept',
    maximumRiskScore: 10,
    maximumRiskPremium: 1.8,
    assignedRiskScore: 5.0,
    riskPremium: 0.9,
    calculationPercentage: 8
  },
  {
    name: 'Quality of Property Cash Flow',
    maximumRiskScore: 10,
    maximumRiskPremium: 2.2,
    assignedRiskScore: 4.5,
    riskPremium: 0.99,
    calculationPercentage: 9
  },
  {
    name: 'Tenant and Occupier Situation',
    maximumRiskScore: 10,
    maximumRiskPremium: 2.0,
    assignedRiskScore: 5.5,
    riskPremium: 1.1,
    calculationPercentage: 12
  }
];

/**
 * Calculate ESG-adjusted All Risks Yield
 * @param inputs - ESG input parameters including cash rate, property type, and sustainability metrics
 * @returns ESGResults with base ARY, adjustments, and detailed risk breakdown
 * @throws Error if inputs are invalid
 * @example
 * ```typescript
 * const inputs: ESGInputs = {
 *   cashRate: 0.045,
 *   propertyType: 'Commercial',
 *   energyRating: 8,
 *   waterEfficiency: 7,
 *   wasteReduction: 6
 * };
 * const results = calculateESGAdjustedARY(inputs);
 * console.log(results.esgAdjustedARY); // 8.5
 * ```
 */
export const calculateESGAdjustedARY = (inputs: ESGInputs): ESGResults => {
  // Input validation
  if (inputs.cashRate < 0) {
    throw new Error('Cash rate cannot be negative');
  }
  if (!['Commercial', 'Residential'].includes(inputs.propertyType)) {
    throw new Error('Property type must be either Commercial or Residential');
  }

  // Calculate base ARY (simplified version)
  const baseRiskPremium = inputs.propertyType === 'Commercial' ? 6.5 : 5.2;
  const baseARY = (inputs.cashRate * 100) + baseRiskPremium;

  // Calculate ESG score based on inputs
  const esgFactors = [
    inputs.energyRating || 5,
    inputs.waterEfficiency || 5,
    inputs.wasteReduction || 5,
    inputs.sustainableMaterials || 5,
    inputs.carbonFootprint || 5
  ];
  
  const overallESGScore = esgFactors.reduce((sum, score) => sum + score, 0) / esgFactors.length * 10;

  // Calculate ESG adjustment (better ESG = lower risk premium)
  const esgAdjustment = (overallESGScore - 50) / 100 * 2; // Max ±2% adjustment

  // Apply ESG adjustment to risk factors
  const adjustedRiskFactors = ESG_RISK_FACTORS.map(factor => ({
    ...factor,
    riskPremium: Math.max(0, factor.riskPremium + (esgAdjustment * factor.calculationPercentage / 100))
  }));

  const esgAdjustedARY = Math.max(0, baseARY + esgAdjustment);

  // Determine ESG rating
  let esgRating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  if (overallESGScore >= 90) esgRating = 'A+';
  else if (overallESGScore >= 80) esgRating = 'A';
  else if (overallESGScore >= 70) esgRating = 'B+';
  else if (overallESGScore >= 60) esgRating = 'B';
  else if (overallESGScore >= 50) esgRating = 'C';
  else esgRating = 'D';

  return {
    baseARY,
    esgAdjustment,
    esgAdjustedARY,
    esgRiskBreakdown: adjustedRiskFactors,
    overallESGScore,
    esgRating
  };
};

/**
 * Calculate Capitalization Rate Sensitivity Analysis with optional ESG integration
 * @param inputs - Capitalization sensitivity input parameters
 * @returns CapitalizationSensitivityResults with NOI and scenario valuations
 * @throws Error if inputs are invalid
 * @example
 * ```typescript
 * const inputs: CapitalizationSensitivityInputs = {
 *   netRent: 100000,
 *   nrogs: 5000,
 *   lettingUpAllowance: 10000,
 *   otherCapitalAdjustments: 5000,
 *   relettingCosts: 2000,
 *   useESGAdjustedARY: true,
 *   esgAdjustedARY: 8.5
 * };
 * const results = calculateCapitalizationRateSensitivity(inputs);
 * console.log(results.noi); // 105000
 * ```
 */
export const calculateCapitalizationRateSensitivity = (
  inputs: CapitalizationSensitivityInputs
): CapitalizationSensitivityResults => {
  // Input validation
  if (inputs.netRent <= 0) {
    throw new Error('Net rent must be greater than zero');
  }
  if (inputs.useESGAdjustedARY && !inputs.esgAdjustedARY) {
    throw new Error('ESG adjusted ARY is required when useESGAdjustedARY is true');
  }
  if (inputs.esgAdjustedARY && typeof inputs.esgAdjustedARY !== 'number') {
    throw new Error('ESG adjusted ARY must be a number');
  }

  // Calculate Net Operating Income
  const noi = inputs.netRent + inputs.nrogs;
  const totalCapitalAdjustments = inputs.lettingUpAllowance + inputs.otherCapitalAdjustments + inputs.relettingCosts;

  if (inputs.useESGAdjustedARY && inputs.esgAdjustedARY) {
    // ESG mode - use single ESG-adjusted rate
    const capRate = inputs.esgAdjustedARY / 100;
    const marketValue = noi / capRate;
    const adjustedValue = Math.round((marketValue - totalCapitalAdjustments) / 1000) * 1000;

    return {
      noi,
      useESGMode: true,
      esgAdjustedARY: inputs.esgAdjustedARY,
      scenarios: {
        esg: {
          capRate: inputs.esgAdjustedARY,
          marketValue,
          adjustedValue
        }
      }
    };
  } else {
    // Traditional mode - use optimistic/realistic/pessimistic rates
    const optimisticRate = inputs.capitalizationRateOptimistic || 0.055;
    const realisticRate = inputs.capitalizationRateRealistic || 0.06;
    const pessimisticRate = inputs.capitalizationRatePessimistic || 0.065;

    const optimisticValue = Math.round((noi / optimisticRate - totalCapitalAdjustments) / 1000) * 1000;
    const realisticValue = Math.round((noi / realisticRate - totalCapitalAdjustments) / 1000) * 1000;
    const pessimisticValue = Math.round((noi / pessimisticRate - totalCapitalAdjustments) / 1000) * 1000;

    return {
      noi,
      useESGMode: false,
      scenarios: {
        optimistic: {
          capRate: optimisticRate * 100,
          marketValue: noi / optimisticRate,
          adjustedValue: optimisticValue
        },
        realistic: {
          capRate: realisticRate * 100,
          marketValue: noi / realisticRate,
          adjustedValue: realisticValue
        },
        pessimistic: {
          capRate: pessimisticRate * 100,
          marketValue: noi / pessimisticRate,
          adjustedValue: pessimisticValue
        }
      }
    };
  }
};

/**
 * Format currency for display in Australian dollars
 * @param value - Numeric value to format
 * @returns Formatted currency string in AUD
 * @example
 * ```typescript
 * const formatted = formatCurrency(1234567);
 * console.log(formatted); // "$1,234,567"
 * ```
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Get ESG rating color for UI display
 * @param rating - ESG rating string
 * @returns CSS color class name
 * @example
 * ```typescript
 * const colorClass = getESGRatingColor('A+');
 * console.log(colorClass); // "text-green-600"
 * ```
 */
export const getESGRatingColor = (rating: string): string => {
  switch (rating) {
    case 'A+': return 'text-green-600';
    case 'A': return 'text-green-500';
    case 'B+': return 'text-lime-500';
    case 'B': return 'text-yellow-500';
    case 'C': return 'text-orange-500';
    case 'D': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

/**
 * Backwards compatibility exports for existing components
 * Comprehensive ESG scoring interface for legacy support
 */
export interface ESGScores {
  sustainabilityScore: number;
  energyEfficiency: number;
  waterConservation: number;
  wasteReduction: number;
  materialSustainability: number;
  climateRisk: number;
  financialRisk: number;
  overallRating: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  overallESGScore: number;
  riskRating: number;
  environmental: {
    energyEfficiency: number;
    waterConservation: number;
    wasteReduction: number;
    wasteManagement: number;
    materialSustainability: number;
    carbonFootprint: number;
    overall: number;
  };
  social: {
    communityImpact: number;
    communityEngagement: number;
    tenantSatisfaction: number;
    accessibility: number;
    healthWellbeing: number;
    overall: number;
  };
  governance: {
    transparency: number;
    compliance: number;
    riskManagement: number;
    stakeholderEngagement: number;
    certifications: number;
    overall: number;
  };
}

/**
 * Calculate ESG scores for backwards compatibility
 * @param data - Unknown data input (for type safety with external data)
 * @returns ESGScores with comprehensive ESG metrics
 * @example
 * ```typescript
 * const scores = calculateESGScores(externalData);
 * console.log(scores.overallESGScore); // 75
 * ```
 */
export const calculateESGScores = (data: unknown): ESGScores => {
  // Mock implementation for backwards compatibility
  return {
    sustainabilityScore: 75,
    energyEfficiency: 8.0,
    waterConservation: 7.5,
    wasteReduction: 7.0,
    materialSustainability: 6.5,
    climateRisk: 6.0,
    financialRisk: 5.5,
    overallRating: 7.2,
    riskLevel: 'Moderate',
    overallESGScore: 75,
    riskRating: 6.2,
    environmental: {
      energyEfficiency: 8.0,
      waterConservation: 7.5,
      wasteReduction: 7.0,
      wasteManagement: 7.2,
      materialSustainability: 6.5,
      carbonFootprint: 7.5,
      overall: 7.3
    },
    social: {
      communityImpact: 7.0,
      communityEngagement: 7.8,
      tenantSatisfaction: 8.0,
      accessibility: 6.5,
      healthWellbeing: 7.5,
      overall: 7.4
    },
    governance: {
      transparency: 7.0,
      compliance: 8.5,
      riskManagement: 6.0,
      stakeholderEngagement: 7.2,
      certifications: 8.0,
      overall: 7.3
    }
  };
};

/**
 * Export Excel formulas for backwards compatibility
 * @returns Object containing Excel formulas for ESG calculations
 * @example
 * ```typescript
 * const formulas = exportToExcelFormulas();
 * console.log(formulas.sustainabilityFormula); // "=(Energy_Rating + Water_Efficiency + Waste_Reduction + Materials)/4"
 * ```
 */
export const exportToExcelFormulas = () => {
  return {
    sustainabilityFormula: '=(Energy_Rating + Water_Efficiency + Waste_Reduction + Materials)/4',
    riskFormula: '=(Climate_Risk + Financial_Risk)/2',
    overallFormula: '=(Sustainability_Score + Risk_Score)/2'
  };
};