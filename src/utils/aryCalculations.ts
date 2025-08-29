// All Risks Yield (ARY) Calculation Utilities
// Implements comprehensive risk assessment framework with dynamic cash rate

export interface RiskFactor {
  name: string;
  assignedRiskScore: number; // 0-10 scale
  maximumRiskPremium: number; // percentage
}

export interface ARYInputs {
  cashRate: number; // Australian cash rate as decimal (e.g., 0.0425 for 4.25%)
  propertyType: 'Commercial' | 'Residential';
  annualRentalIncome?: number; // Optional for yield-based calculation
  propertyValue?: number; // Optional for yield-based calculation
}

export interface ARYResults {
  riskFreeRate: number;
  totalRiskPremia: number;
  allRisksYield: number;
  yieldBasedARY?: number; // Alternative calculation if rental income/value provided
  riskBreakdown: Array<{
    factor: string;
    assignedScore: number;
    maxPremium: number;
    calculatedPremium: number;
  }>;
}

// Fixed Risk Premia Constants (based on risk assessment framework)
export const COMMERCIAL_RISK_FACTORS: RiskFactor[] = [
  { name: 'Market Risk', assignedRiskScore: 6.5, maximumRiskPremium: 2.5 },
  { name: 'Location Risk', assignedRiskScore: 5.0, maximumRiskPremium: 2.0 },
  { name: 'Architecture Risk', assignedRiskScore: 4.0, maximumRiskPremium: 1.5 },
  { name: 'Fitout Risk', assignedRiskScore: 3.5, maximumRiskPremium: 1.0 },
  { name: 'Tenant Risk', assignedRiskScore: 7.0, maximumRiskPremium: 3.0 },
  { name: 'Lease Risk', assignedRiskScore: 5.5, maximumRiskPremium: 2.0 },
  { name: 'Management Risk', assignedRiskScore: 4.5, maximumRiskPremium: 1.5 },
  { name: 'Environmental Risk', assignedRiskScore: 3.0, maximumRiskPremium: 1.0 },
  { name: 'Ecological Sustainability', assignedRiskScore: 2.5, maximumRiskPremium: 1.5 },
  { name: 'Building Efficiency', assignedRiskScore: 3.0, maximumRiskPremium: 1.0 },
  { name: 'Climate Resilience', assignedRiskScore: 4.0, maximumRiskPremium: 2.0 },
];

export const RESIDENTIAL_RISK_FACTORS: RiskFactor[] = [
  { name: 'Market Risk', assignedRiskScore: 5.5, maximumRiskPremium: 2.0 },
  { name: 'Location Risk', assignedRiskScore: 4.5, maximumRiskPremium: 1.8 },
  { name: 'Property Condition', assignedRiskScore: 4.0, maximumRiskPremium: 1.5 },
  { name: 'Neighborhood Quality', assignedRiskScore: 3.5, maximumRiskPremium: 1.2 },
  { name: 'Tenant Risk', assignedRiskScore: 6.0, maximumRiskPremium: 2.5 },
  { name: 'Vacancy Risk', assignedRiskScore: 5.0, maximumRiskPremium: 2.0 },
  { name: 'Maintenance Risk', assignedRiskScore: 4.5, maximumRiskPremium: 1.5 },
  { name: 'Environmental Risk', assignedRiskScore: 2.5, maximumRiskPremium: 0.8 },
  { name: 'Energy Efficiency', assignedRiskScore: 3.0, maximumRiskPremium: 1.0 },
  { name: 'Sustainability Features', assignedRiskScore: 2.0, maximumRiskPremium: 1.2 },
  { name: 'Climate Adaptation', assignedRiskScore: 3.5, maximumRiskPremium: 1.5 },
];

/**
 * Calculate individual risk premium percentage
 * Formula: (Assigned Risk Score / 10) * Maximum Risk Premium %
 */
export const calculateRiskPremium = (assignedScore: number, maxPremium: number): number => {
  if (assignedScore < 0 || assignedScore > 10) {
    throw new Error('Assigned risk score must be between 0 and 10');
  }
  if (maxPremium < 0) {
    throw new Error('Maximum risk premium must be non-negative');
  }
  return (assignedScore / 10) * maxPremium;
};

/**
 * Calculate Total Risk Premia for property type
 */
export const calculateTotalRiskPremia = (propertyType: 'Commercial' | 'Residential'): {
  totalPremia: number;
  breakdown: Array<{
    factor: string;
    assignedScore: number;
    maxPremium: number;
    calculatedPremium: number;
  }>;
} => {
  const riskFactors = propertyType === 'Commercial' ? COMMERCIAL_RISK_FACTORS : RESIDENTIAL_RISK_FACTORS;
  
  const breakdown = riskFactors.map(factor => ({
    factor: factor.name,
    assignedScore: factor.assignedRiskScore,
    maxPremium: factor.maximumRiskPremium,
    calculatedPremium: calculateRiskPremium(factor.assignedRiskScore, factor.maximumRiskPremium),
  }));

  const totalPremia = breakdown.reduce((sum, item) => sum + item.calculatedPremium, 0);

  return { totalPremia, breakdown };
};

/**
 * Main ARY calculation function
 * Implements both risk-based and yield-based approaches
 */
export const calculateAllRisksYield = (inputs: ARYInputs): ARYResults => {
  // Input validation
  if (inputs.cashRate < 0) {
    throw new Error('Cash rate cannot be negative');
  }
  if (typeof inputs.cashRate !== 'number' || isNaN(inputs.cashRate)) {
    throw new Error('Cash rate must be a valid number');
  }
  if (!['Commercial', 'Residential'].includes(inputs.propertyType)) {
    throw new Error('Property type must be either Commercial or Residential');
  }

  // Risk-free rate is the cash rate
  const riskFreeRate = inputs.cashRate * 100; // Convert to percentage

  // Calculate total risk premia
  const { totalPremia, breakdown } = calculateTotalRiskPremia(inputs.propertyType);

  // Primary ARY calculation: Risk Free Rate + Total Risk Premia
  const allRisksYield = riskFreeRate + totalPremia;

  // Optional yield-based calculation if rental income and property value provided
  let yieldBasedARY: number | undefined;
  if (inputs.annualRentalIncome && inputs.propertyValue && inputs.propertyValue > 0) {
    yieldBasedARY = (inputs.annualRentalIncome / inputs.propertyValue) * 100;
  }

  return {
    riskFreeRate,
    totalRiskPremia: totalPremia,
    allRisksYield,
    yieldBasedARY,
    riskBreakdown: breakdown,
  };
};

/**
 * Validate ARY inputs
 */
export const validateARYInputs = (inputs: Partial<ARYInputs>): string[] => {
  const errors: string[] = [];

  if (inputs.cashRate === undefined || inputs.cashRate === null) {
    errors.push('Cash rate is required');
  } else if (inputs.cashRate < 0) {
    errors.push('Cash rate cannot be negative');
  } else if (inputs.cashRate > 1) {
    errors.push('Cash rate should be entered as a decimal (e.g., 0.0425 for 4.25%)');
  }

  if (!inputs.propertyType) {
    errors.push('Property type is required');
  }

  if (inputs.annualRentalIncome !== undefined && inputs.annualRentalIncome < 0) {
    errors.push('Annual rental income cannot be negative');
  }

  if (inputs.propertyValue !== undefined && inputs.propertyValue <= 0) {
    errors.push('Property value must be greater than zero');
  }

  return errors;
};

/**
 * Get current Australian cash rate (placeholder - in real implementation would fetch from RBA API)
 */
export const getCurrentCashRate = (): number => {
  // Placeholder implementation - in production this would fetch from RBA API or database
  return 0.0425; // 4.25% as example
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Export Excel formulas for ARY calculation
 */
export const exportARYExcelFormulas = () => {
  return {
    riskPremiumFormula: '=(Assigned_Risk_Score/10)*Maximum_Risk_Premium',
    totalRiskPremiaFormula: '=SUM(All_Risk_Premiums)',
    aryFormulaRiskBased: '=Risk_Free_Rate + Total_Risk_Premia',
    aryFormulaYieldBased: '=(Annual_Rental_Income/Property_Value)*100',
    cashRateNote: 'Cash rate should be entered as decimal (e.g., 0.0425 for 4.25%)',
  };
};