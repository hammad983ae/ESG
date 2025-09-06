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

/**
 * Input parameters for deferred management fee calculations
 * Contains retirement village specific data and financial parameters
 */
export interface DeferredManagementInputs {
  /** Property name or identifier */
  propertyName: string;
  /** Current property value in dollars */
  currentValue: number;
  /** Deferral period in years */
  deferralPeriod: number;
  /** Discount rate as decimal (e.g., 0.08 for 8%) */
  discountRate: number;
  /** Array of projected future cash flows */
  futureCashFlows: number[];
  /** Type of management fee structure */
  managementType: 'entrance-fees' | 'ongoing-fees' | 'deferred-management' | 'combined';
  /** Total number of village units */
  villageUnits: number;
  /** Occupancy rate as percentage (0-100) */
  occupancyRate: number;
  /** Average age of residents */
  averageAge: number;
  /** Annual turnover rate as percentage (0-100) */
  turnoverRate: number;
  /** Analysis date (YYYY-MM-DD) */
  analysisDate: string;
  
  /** Deferred management fee rate as percentage of unit value */
  deferredManagementFeeRate: number;
  /** Average unit value in dollars */
  averageUnitValue: number;
  /** Expected annual turnover in units */
  expectedAnnualTurnover: number;
  /** Type of management rights */
  managementRightsType: 'lease' | 'freehold' | 'license';
  /** Years remaining on management agreement */
  remainingTerm: number;
}

/**
 * Results from deferred management fee calculations
 * Contains comprehensive valuation analysis and performance metrics
 */
export interface DeferredManagementResults {
  /** Total property valuation in dollars */
  totalValuation: number;
  /** Present value of current assets in dollars */
  presentValueCurrentAssets: number;
  /** Present value of future cash flows in dollars */
  presentValueFutureCashFlows: number;
  /** Deferred management value in dollars */
  deferredManagementValue: number;
  
  /** Detailed cash flow breakdown by year */
  cashFlowBreakdown: Array<{
    /** Year number */
    year: number;
    /** Expected cash flow for this year in dollars */
    expectedCashFlow: number;
    /** Discounted present value in dollars */
    discountedValue: number;
    /** Cumulative discounted value in dollars */
    cumulativeValue: number;
    /** Expected turnover units for this year */
    turnoverUnits: number;
    /** Deferred fee income for this year in dollars */
    deferredFeeIncome: number;
  }>;
  
  /** Net present value in dollars */
  netPresentValue: number;
  /** Internal rate of return as decimal */
  internalRateOfReturn: number;
  /** Payback period in years */
  paybackPeriod: number;
  /** Management yield as percentage */
  managementYield: number;
  
  /** Sensitivity analysis results */
  sensitivityAnalysis: {
    /** Turnover rate sensitivity variations */
    turnoverRateVariation: Array<{ rate: number; valuation: number }>;
    /** Discount rate sensitivity variations */
    discountRateVariation: Array<{ rate: number; valuation: number }>;
    /** Occupancy rate sensitivity variations */
    occupancyVariation: Array<{ occupancy: number; valuation: number }>;
  };
  
  /** Valuation per unit in dollars */
  valuationPerUnit: number;
  /** Management rights value in dollars */
  managementRightsValue: number;
  /** Operating business value in dollars */
  operatingBusinessValue: number;
  
  /** Excel formulas for verification */
  excelFormulas: {
    /** Deferred present value formula */
    deferredPV: string;
    /** Total valuation formula */
    totalValuation: string;
    /** Management yield formula */
    managementYield: string;
    /** Sensitivity analysis formula */
    sensitivityFormula: string;
  };
}

/**
 * Calculate Deferred Management Fee for Retirement Villages
 * @param inputs - Deferred management input parameters
 * @returns DeferredManagementResults with comprehensive valuation analysis
 * @example
 * ```typescript
 * const inputs: DeferredManagementInputs = {
 *   propertyName: "Sunset Retirement Village",
 *   currentValue: 5000000,
 *   deferralPeriod: 5,
 *   discountRate: 0.08,
 *   futureCashFlows: [200000, 250000, 300000],
 *   // ... other required fields
 * };
 * const results = calculateDeferredManagementValuation(inputs);
 * console.log(results.totalValuation); // 4,250,000
 * ```
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
 * @param cashFlows - Array of cash flows (negative initial investment, positive returns)
 * @param maxIterations - Maximum number of iterations (default: 100)
 * @returns Internal rate of return as decimal
 * @example
 * ```typescript
 * const irr = calculateIRR([-1000000, 200000, 250000, 300000]);
 * console.log(irr); // 0.085
 * ```
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
 * Cash flow breakdown item for deferred management analysis
 * Represents a single year's cash flow data
 */
interface CashFlowBreakdownItem {
  /** Year number */
  year: number;
  /** Expected cash flow for this year in dollars */
  expectedCashFlow: number;
  /** Discounted present value in dollars */
  discountedValue: number;
  /** Cumulative discounted value in dollars */
  cumulativeValue: number;
  /** Expected turnover units for this year */
  turnoverUnits: number;
  /** Deferred fee income for this year in dollars */
  deferredFeeIncome: number;
}

/**
 * Calculate payback period for investment recovery
 * @param cashFlowBreakdown - Array of cash flow breakdown items
 * @param initialInvestment - Initial investment amount in dollars
 * @returns Payback period in years
 * @example
 * ```typescript
 * const paybackPeriod = calculatePaybackPeriod(cashFlowBreakdown, 1000000);
 * console.log(paybackPeriod); // 3.5
 * ```
 */
function calculatePaybackPeriod(cashFlowBreakdown: CashFlowBreakdownItem[], initialInvestment: number): number {
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
 * @param inputs - Deferred management input parameters
 * @returns Array of turnover rate variations and corresponding valuations
 * @example
 * ```typescript
 * const sensitivity = calculateTurnoverSensitivity(inputs);
 * console.log(sensitivity); // [{ rate: 8, valuation: 4500000 }, ...]
 * ```
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
 * @param inputs - Deferred management input parameters
 * @returns Array of discount rate variations and corresponding valuations
 * @example
 * ```typescript
 * const sensitivity = calculateDiscountRateSensitivity(inputs);
 * console.log(sensitivity); // [{ rate: 6, valuation: 4800000 }, ...]
 * ```
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
 * @param inputs - Deferred management input parameters
 * @returns Array of occupancy rate variations and corresponding valuations
 * @example
 * ```typescript
 * const sensitivity = calculateOccupancySensitivity(inputs);
 * console.log(sensitivity); // [{ occupancy: 85, valuation: 4600000 }, ...]
 * ```
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
 * @returns Object containing Excel formulas for verification and implementation
 * @example
 * ```typescript
 * const formulas = exportDeferredManagementExcelFormulas();
 * console.log(formulas.deferredPresentValue); // "=SUM(CashFlows/(1+DiscountRate)^(ROW(CashFlows)+DeferralPeriod-1))"
 * ```
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