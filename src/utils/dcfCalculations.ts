/**
 * DCF (Discounted Cash Flow) and IRR (Internal Rate of Return) Calculations
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000015-AU2025000016
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

export interface DCFData {
  propertyName: string;
  initialInvestment: number;
  cashFlows: number[];
  discountRate: number;
  terminalValue?: number;
  analysisDate: string;
  growthRate?: number;
}

export interface DCFResults {
  presentValue: number;
  netPresentValue: number;
  irr: number;
  profitabilityIndex: number;
  paybackPeriod: number;
  discountedPaybackPeriod: number;
  terminalValuePV?: number;
  cashFlowBreakdown: Array<{
    period: number;
    cashFlow: number;
    discountFactor: number;
    presentValue: number;
    cumulativePV: number;
  }>;
}

/**
 * Calculate Present Value of future cash flows using DCF methodology
 */
export function calculateDCF(data: DCFData): DCFResults {
  const { cashFlows, discountRate, initialInvestment, terminalValue = 0 } = data;
  
  // Calculate present value of each cash flow
  const cashFlowBreakdown = cashFlows.map((cashFlow, index) => {
    const period = index + 1;
    const discountFactor = 1 / Math.pow(1 + discountRate, period);
    const presentValue = cashFlow * discountFactor;
    
    return {
      period,
      cashFlow,
      discountFactor,
      presentValue,
      cumulativePV: 0 // Will be calculated below
    };
  });

  // Calculate cumulative present values
  let cumulativePV = 0;
  cashFlowBreakdown.forEach(item => {
    cumulativePV += item.presentValue;
    item.cumulativePV = cumulativePV;
  });

  // Calculate terminal value present value if provided
  let terminalValuePV = 0;
  if (terminalValue > 0) {
    terminalValuePV = terminalValue / Math.pow(1 + discountRate, cashFlows.length);
  }

  // Total present value of cash flows
  const presentValue = cumulativePV + terminalValuePV;
  
  // Net Present Value (subtract initial investment)
  const netPresentValue = presentValue - initialInvestment;
  
  // Calculate IRR using Newton-Raphson method
  const irr = calculateIRR([initialInvestment * -1, ...cashFlows]);
  
  // Profitability Index
  const profitabilityIndex = presentValue / initialInvestment;
  
  // Simple Payback Period
  const paybackPeriod = calculatePaybackPeriod(cashFlows, initialInvestment);
  
  // Discounted Payback Period
  const discountedPaybackPeriod = calculateDiscountedPaybackPeriod(cashFlowBreakdown, initialInvestment);

  return {
    presentValue,
    netPresentValue,
    irr,
    profitabilityIndex,
    paybackPeriod,
    discountedPaybackPeriod,
    terminalValuePV: terminalValue > 0 ? terminalValuePV : undefined,
    cashFlowBreakdown
  };
}

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 */
export function calculateIRR(cashFlows: number[], maxIterations: number = 100, tolerance: number = 1e-6): number {
  let rate = 0.1; // Initial guess of 10%
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    // Calculate NPV and its derivative
    for (let j = 0; j < cashFlows.length; j++) {
      const period = j;
      npv += cashFlows[j] / Math.pow(1 + rate, period);
      dnpv -= (period * cashFlows[j]) / Math.pow(1 + rate, period + 1);
    }
    
    // Check if we've found the solution
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    // Newton-Raphson iteration
    if (dnpv !== 0) {
      rate = rate - npv / dnpv;
    } else {
      break;
    }
  }
  
  // Fallback to binary search if Newton-Raphson fails
  return calculateIRRBinarySearch(cashFlows);
}

/**
 * Fallback IRR calculation using binary search
 */
function calculateIRRBinarySearch(cashFlows: number[]): number {
  let low = -0.99;
  let high = 10;
  let tolerance = 1e-6;
  let maxIterations = 1000;
  
  for (let i = 0; i < maxIterations; i++) {
    const rate = (low + high) / 2;
    let npv = 0;
    
    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j);
    }
    
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    if (npv > 0) {
      low = rate;
    } else {
      high = rate;
    }
  }
  
  return (low + high) / 2;
}

/**
 * Calculate simple payback period
 */
function calculatePaybackPeriod(cashFlows: number[], initialInvestment: number): number {
  let cumulativeCashFlow = 0;
  
  for (let i = 0; i < cashFlows.length; i++) {
    cumulativeCashFlow += cashFlows[i];
    if (cumulativeCashFlow >= initialInvestment) {
      // Linear interpolation for fractional years
      const previousCumulative = cumulativeCashFlow - cashFlows[i];
      const fraction = (initialInvestment - previousCumulative) / cashFlows[i];
      return i + fraction;
    }
  }
  
  return cashFlows.length; // Payback exceeds analysis period
}

/**
 * Calculate discounted payback period
 */
function calculateDiscountedPaybackPeriod(
  cashFlowBreakdown: Array<{ cumulativePV: number }>, 
  initialInvestment: number
): number {
  for (let i = 0; i < cashFlowBreakdown.length; i++) {
    if (cashFlowBreakdown[i].cumulativePV >= initialInvestment) {
      // Linear interpolation for fractional years
      const previousCumulative = i > 0 ? cashFlowBreakdown[i - 1].cumulativePV : 0;
      const currentPeriodPV = cashFlowBreakdown[i].cumulativePV - previousCumulative;
      const fraction = (initialInvestment - previousCumulative) / currentPeriodPV;
      return i + fraction;
    }
  }
  
  return cashFlowBreakdown.length; // Payback exceeds analysis period
}

/**
 * Calculate terminal value using perpetual growth method
 */
export function calculateTerminalValue(
  finalYearCashFlow: number,
  growthRate: number,
  discountRate: number
): number {
  if (discountRate <= growthRate) {
    throw new Error("Discount rate must be greater than growth rate");
  }
  
  return (finalYearCashFlow * (1 + growthRate)) / (discountRate - growthRate);
}

/**
 * Sensitivity analysis for DCF calculations
 */
export function dcfSensitivityAnalysis(
  baseData: DCFData,
  discountRateRange: number[] = [-0.02, -0.01, 0, 0.01, 0.02],
  cashFlowMultipliers: number[] = [0.8, 0.9, 1.0, 1.1, 1.2]
): Array<{
  discountRateChange: number;
  cashFlowChange: number;
  npv: number;
  irr: number;
}> {
  const results = [];
  
  for (const discountRateChange of discountRateRange) {
    for (const cashFlowMultiplier of cashFlowMultipliers) {
      const adjustedData: DCFData = {
        ...baseData,
        discountRate: baseData.discountRate + discountRateChange,
        cashFlows: baseData.cashFlows.map(cf => cf * cashFlowMultiplier)
      };
      
      const dcfResult = calculateDCF(adjustedData);
      
      results.push({
        discountRateChange,
        cashFlowChange: cashFlowMultiplier - 1,
        npv: dcfResult.netPresentValue,
        irr: dcfResult.irr
      });
    }
  }
  
  return results;
}

/**
 * Export Excel formulas for DCF calculations
 */
export function exportDCFExcelFormulas() {
  return {
    presentValue: 'PV(DiscountRate, Period, 0, -CashFlow, 0)',
    netPresentValue: 'NPV(DiscountRate, CashFlow1:CashFlowN) - InitialInvestment',
    irr: 'IRR(InitialInvestment:CashFlowN)',
    profitabilityIndex: 'PresentValueOfCashFlows / InitialInvestment',
    terminalValue: 'FinalYearCashFlow * (1 + GrowthRate) / (DiscountRate - GrowthRate)',
    discountFactor: '1 / POWER(1 + DiscountRate, Period)',
    paybackPeriod: 'INDEX(MATCH(TRUE, CumulativeCashFlow >= InitialInvestment, 0))',
    sensitivityNPV: 'NPV(DiscountRate + ΔRate, (CashFlows * Multiplier)) - InitialInvestment'
  };
}