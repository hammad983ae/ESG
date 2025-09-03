/**
 * Deferred Management Fee Calculations for Retirement Villages
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000017
 * 
 * Specialized valuation methodology for retirement village management income
 * with deferred cash flow analysis and present value calculations.
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

export interface DeferredManagementInputs {
  propertyName: string;
  currentValue: number;
  deferralPeriod: number;
  discountRate: number;
  futureCashFlows: number[];
  managementType: 'entrance-fees' | 'ongoing-fees' | 'deferred-management' | 'combined';
  villageUnits: number;
  occupancyRate: number;
  averageAge: number;
  turnoverRate: number;
  analysisDate: string;
  
  // Additional retirement village specific parameters
  deferredManagementFeeRate: number; // Percentage of unit value
  averageUnitValue: number;
  expectedAnnualTurnover: number;
  managementRightsType: 'lease' | 'freehold' | 'license';
  remainingTerm: number; // Years remaining on management agreement
}

export interface DeferredManagementResults {
  totalValuation: number;
  presentValueCurrentAssets: number;
  presentValueFutureCashFlows: number;
  deferredManagementValue: number;
  
  // Breakdown analysis
  cashFlowBreakdown: Array<{
    year: number;
    expectedCashFlow: number;
    discountedValue: number;
    cumulativeValue: number;
    turnoverUnits: number;
    deferredFeeIncome: number;
  }>;
  
  // Performance metrics
  netPresentValue: number;
  internalRateOfReturn: number;
  paybackPeriod: number;
  managementYield: number;
  
  // Risk analysis
  sensitivityAnalysis: {
    turnoverRateVariation: Array<{ rate: number; valuation: number }>;
    discountRateVariation: Array<{ rate: number; valuation: number }>;
    occupancyVariation: Array<{ occupancy: number; valuation: number }>;
  };
  
  // Valuation summary
  valuationPerUnit: number;
  managementRightsValue: number;
  operatingBusinessValue: number;
  
  // Excel formulas for verification
  excelFormulas: {
    deferredPV: string;
    totalValuation: string;
    managementYield: string;
    sensitivityFormula: string;
  };
}

/**
 * Calculate Deferred Management Fee for Retirement Villages
 */
export function calculateDeferredManagementValuation(inputs: DeferredManagementInputs): DeferredManagementResults {
  const {
    currentValue,
    futureCashFlows,
    deferralPeriod,
    discountRate,
    villageUnits,
    occupancyRate,
    turnoverRate,
    deferredManagementFeeRate,
    averageUnitValue,
    expectedAnnualTurnover,
    remainingTerm
  } = inputs;

  // Calculate present value of current assets (discounted for deferral period)
  const presentValueCurrentAssets = currentValue / Math.pow(1 + discountRate, deferralPeriod);

  // Calculate cash flow breakdown with deferred management fee analysis
  const cashFlowBreakdown = futureCashFlows.map((cashFlow, index) => {
    const year = index + 1;
    const adjustedYear = year + deferralPeriod;
    
    // Calculate expected turnover units for this year
    const occupiedUnits = villageUnits * (occupancyRate / 100);
    const turnoverUnits = occupiedUnits * (turnoverRate / 100);
    
    // Calculate deferred management fee income
    const deferredFeeIncome = turnoverUnits * averageUnitValue * (deferredManagementFeeRate / 100);
    
    // Total expected cash flow including deferred fees
    const totalExpectedCashFlow = cashFlow + deferredFeeIncome;
    
    // Discount to present value
    const discountedValue = totalExpectedCashFlow / Math.pow(1 + discountRate, adjustedYear);
    
    return {
      year,
      expectedCashFlow: totalExpectedCashFlow,
      discountedValue,
      cumulativeValue: 0, // Will be calculated below
      turnoverUnits,
      deferredFeeIncome
    };
  });

  // Calculate cumulative values
  let cumulativeValue = 0;
  cashFlowBreakdown.forEach(item => {
    cumulativeValue += item.discountedValue;
    item.cumulativeValue = cumulativeValue;
  });

  // Calculate present value of future cash flows
  const presentValueFutureCashFlows = cashFlowBreakdown.reduce((sum, item) => sum + item.discountedValue, 0);

  // Calculate specific deferred management value (separate from ongoing operations)
  const totalDeferredFeeIncome = cashFlowBreakdown.reduce((sum, item) => sum + item.deferredFeeIncome, 0);
  const deferredManagementValue = totalDeferredFeeIncome / Math.pow(1 + discountRate, deferralPeriod);

  // Total valuation
  const totalValuation = presentValueCurrentAssets + presentValueFutureCashFlows;

  // Calculate performance metrics
  const netPresentValue = totalValuation - currentValue;
  const managementYield = (presentValueFutureCashFlows / currentValue) * 100;
  
  // Calculate IRR (simplified approach for demonstration)
  const cashFlowsForIRR = [-currentValue, ...futureCashFlows];
  const irr = calculateIRR(cashFlowsForIRR);
  
  // Calculate payback period
  const paybackPeriod = calculatePaybackPeriod(cashFlowBreakdown, currentValue);

  // Sensitivity Analysis
  const sensitivityAnalysis = {
    turnoverRateVariation: calculateTurnoverSensitivity(inputs),
    discountRateVariation: calculateDiscountRateSensitivity(inputs),
    occupancyVariation: calculateOccupancySensitivity(inputs)
  };

  // Valuation breakdown
  const valuationPerUnit = totalValuation / villageUnits;
  const managementRightsValue = deferredManagementValue;
  const operatingBusinessValue = totalValuation - managementRightsValue;

  // Excel formulas for verification
  const excelFormulas = {
    deferredPV: `=SUM(FutureCashFlows/(1+DiscountRate)^(Period+DeferralPeriod))`,
    totalValuation: `=CurrentValue/(1+DiscountRate)^DeferralPeriod + DeferredPV`,
    managementYield: `=DeferredPV/CurrentValue*100`,
    sensitivityFormula: `=NPV(DiscountRate±Variation, CashFlows*(1±Sensitivity))`
  };

  return {
    totalValuation,
    presentValueCurrentAssets,
    presentValueFutureCashFlows,
    deferredManagementValue,
    cashFlowBreakdown,
    netPresentValue,
    internalRateOfReturn: irr,
    paybackPeriod,
    managementYield,
    sensitivityAnalysis,
    valuationPerUnit,
    managementRightsValue,
    operatingBusinessValue,
    excelFormulas
  };
}

/**
 * Calculate IRR using Newton-Raphson method
 */
function calculateIRR(cashFlows: number[], maxIterations: number = 100): number {
  let rate = 0.1; // Initial guess
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j);
      dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
    }
    
    if (Math.abs(npv) < 1e-6) return rate;
    
    if (dnpv !== 0) {
      rate = rate - npv / dnpv;
    } else {
      break;
    }
  }
  
  return rate;
}

/**
 * Calculate payback period
 */
function calculatePaybackPeriod(cashFlowBreakdown: any[], initialInvestment: number): number {
  for (let i = 0; i < cashFlowBreakdown.length; i++) {
    if (cashFlowBreakdown[i].cumulativeValue >= initialInvestment) {
      const previousCumulative = i > 0 ? cashFlowBreakdown[i - 1].cumulativeValue : 0;
      const currentPeriodCF = cashFlowBreakdown[i].discountedValue;
      const fraction = (initialInvestment - previousCumulative) / currentPeriodCF;
      return i + 1 + fraction;
    }
  }
  return cashFlowBreakdown.length;
}

/**
 * Sensitivity analysis for turnover rate variations
 */
function calculateTurnoverSensitivity(inputs: DeferredManagementInputs) {
  const variations = [-20, -10, 0, 10, 20]; // Percentage variations
  return variations.map(variation => {
    const adjustedInputs = {
      ...inputs,
      turnoverRate: inputs.turnoverRate * (1 + variation / 100)
    };
    const result = calculateDeferredManagementValuation(adjustedInputs);
    return { rate: inputs.turnoverRate + variation, valuation: result.totalValuation };
  });
}

/**
 * Sensitivity analysis for discount rate variations
 */
function calculateDiscountRateSensitivity(inputs: DeferredManagementInputs) {
  const variations = [-0.02, -0.01, 0, 0.01, 0.02]; // Absolute variations
  return variations.map(variation => {
    const adjustedInputs = {
      ...inputs,
      discountRate: inputs.discountRate + variation
    };
    const result = calculateDeferredManagementValuation(adjustedInputs);
    return { rate: (inputs.discountRate + variation) * 100, valuation: result.totalValuation };
  });
}

/**
 * Sensitivity analysis for occupancy rate variations
 */
function calculateOccupancySensitivity(inputs: DeferredManagementInputs) {
  const variations = [-10, -5, 0, 5, 10]; // Percentage point variations
  return variations.map(variation => {
    const adjustedInputs = {
      ...inputs,
      occupancyRate: Math.max(0, Math.min(100, inputs.occupancyRate + variation))
    };
    const result = calculateDeferredManagementValuation(adjustedInputs);
    return { occupancy: inputs.occupancyRate + variation, valuation: result.totalValuation };
  });
}

/**
 * Export Excel formulas for deferred management calculations
 */
export function exportDeferredManagementExcelFormulas() {
  return {
    deferredPresentValue: '=SUM(CashFlows/(1+DiscountRate)^(ROW(CashFlows)+DeferralPeriod-1))',
    currentAssetsPV: '=CurrentValue/POWER(1+DiscountRate,DeferralPeriod)',
    totalValuation: '=CurrentAssetsPV + DeferredPV',
    managementFeeIncome: '=VillageUnits * OccupancyRate * TurnoverRate * AverageUnitValue * DeferredFeeRate',
    managementYield: '=DeferredPV/CurrentValue',
    sensitivityNPV: '=NPV(DiscountRate*(1+Sensitivity), CashFlows*(1+CashFlowSensitivity)) - InitialInvestment',
    paybackPeriod: '=MATCH(TRUE, CumulativePV>=InitialInvestment, 0)',
    irr: '=IRR(InitialInvestment:CashFlowArray)',
    valuationPerUnit: '=TotalValuation/VillageUnits'
  };
}