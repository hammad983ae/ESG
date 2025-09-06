/**
 * Delorenzo Property Group - ESG Property Assessment Platform - Valuation Types
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Comprehensive TypeScript interfaces for property valuation analysis including:
 * - All Risks Yield (ARY) calculations
 * - ESG-adjusted ARY with sustainability factors
 * - Capitalization rate sensitivity analysis
 * - Net income approach valuations
 * - Comparable sales analysis with ESG weighting
 * - Direct comparison and summation approaches
 * - Advanced weighted attribute analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

/**
 * Capitalization of Net Income Inputs
 * Used for basic capitalization approach calculations
 */
export interface CapNetIncomeInputs {
  /** Net Operating Income in dollars */
  noi: number;
  /** Capitalization rate as a percentage */
  capitalizationRate: number;
  /** Risk premium adjustment as a percentage */
  riskPremium: number;
}

/**
 * Capitalization of Net Income Results
 * Contains calculated market value and adjusted rates
 */
export interface CapNetIncomeResults {
  /** Calculated market value in dollars */
  marketValue: number;
  /** Market value rounded to nearest dollar */
  marketValueRounded: number;
  /** Adjusted risk premium percentage */
  adjustedRiskPremium: number;
  /** Adjusted capitalization rate percentage */
  adjustedCapRate: number;
}

/**
 * Direct Comparison Property Information
 * Represents a single comparable property in direct comparison analysis
 */
export interface ComparableProperty {
  /** Unique identifier for the comparable property */
  id: string;
  /** Property name or description */
  property: string;
  /** Property location */
  location: string;
  /** Date of sale */
  saleDate: string;
  /** Sale price in dollars */
  price: number;
  /** Price per square meter */
  pricePerSqm: number;
  /** Adjusted price after adjustments */
  adjustedPrice: number;
}

/**
 * Direct Comparison Valuation Summary
 * Contains the overall valuation results for direct comparison approach
 */
export interface DirectComparisonValuation {
  /** Number of comparable properties used */
  comparablesCount: number;
  /** Average price per square meter */
  averagePricePerSqm: number;
  /** Estimated property value in dollars */
  estimatedValue: number;
  /** Value range with low and high estimates */
  valueRange: {
    /** Low estimate in dollars */
    low: number;
    /** High estimate in dollars */
    high: number;
  };
}

/**
 * Direct Comparison Inputs
 * Complete input data for direct comparison valuation
 */
export interface DirectComparisonInputs {
  /** Subject property information */
  subjectProperty: {
    /** Property name */
    name: string;
    /** Property location */
    location: string;
  };
  /** Valuation summary and results */
  valuation: DirectComparisonValuation;
  /** Array of comparable properties */
  comparables: ComparableProperty[];
}

/**
 * Direct Comparison Results
 * Results from direct comparison analysis (same structure as inputs)
 */
export interface DirectComparisonResults {
  /** Subject property information */
  subjectProperty: {
    /** Property name */
    name: string;
    /** Property location */
    location: string;
  };
  /** Valuation summary and results */
  valuation: DirectComparisonValuation;
  /** Array of comparable properties */
  comparables: ComparableProperty[];
}

/**
 * DCF Analysis Inputs
 * Input parameters for Discounted Cash Flow analysis
 */
export interface DCFInputs {
  /** Initial investment amount in dollars */
  initialInvestment: number;
  /** Discount rate as a decimal (e.g., 0.10 for 10%) */
  discountRate: number;
  /** Array of projected cash flows for each period */
  cashFlows: number[];
}

/**
 * DCF Analysis Results
 * Calculated results from DCF analysis
 */
export interface DCFResults {
  /** Net Present Value in dollars */
  netPresentValue: number;
  /** Internal Rate of Return as a decimal */
  irr: number;
  /** Profitability Index ratio */
  profitabilityIndex: number;
  /** Payback period in years */
  paybackPeriod: number;
}

/**
 * Form Handler Types
 * Utility types for form submission and updates
 */

/**
 * Generic form submission handler
 * @template T - The input type for the form
 */
export type FormSubmitHandler<T> = (inputs: T) => void;

/**
 * Generic form field update handler
 * @template T - The input type for the form
 * @template K - The key type for the field being updated
 */
export type FormUpdateHandler<T, K extends keyof T> = (field: K, value: T[K]) => void;

/**
 * Generic form reset handler
 * @template T - The input type for the form
 */
export type FormResetHandler<T> = (tab: string) => void;

/**
 * Valuation Calculation Patterns
 * Common patterns used across different valuation methods
 */

/**
 * Value Range Pattern
 * Represents a range of values with low and high estimates
 */
export interface ValueRange {
  /** Low estimate in dollars */
  low: number;
  /** High estimate in dollars */
  high: number;
}

/**
 * Property Information Pattern
 * Basic property identification information
 */
export interface PropertyInfo {
  /** Property name or description */
  name: string;
  /** Property location */
  location: string;
}

/**
 * Financial Metrics Pattern
 * Common financial calculation results
 */
export interface FinancialMetrics {
  /** Present value in dollars */
  presentValue: number;
  /** Net present value in dollars */
  netPresentValue: number;
  /** Internal rate of return as decimal */
  irr: number;
  /** Payback period in years */
  paybackPeriod: number;
}

/**
 * ESG Adjustment Pattern
 * ESG-related adjustments for valuation calculations
 */
export interface ESGAdjustment {
  /** ESG factor multiplier (0 = no adjustment) */
  esgFactor: number;
  /** Whether ESG adjustments are included */
  esgIncluded: boolean;
  /** ESG risk premium adjustment */
  esgRiskPremium?: number;
  /** ESG-adjusted capitalization rate */
  esgAdjustedCapRate?: number;
}

/**
 * Sensitivity Analysis Pattern
 * Common structure for sensitivity analysis results
 */
export interface SensitivityAnalysis {
  /** Base case scenario */
  baseCase: number;
  /** Optimistic scenario */
  optimistic: number;
  /** Pessimistic scenario */
  pessimistic: number;
  /** Range between optimistic and pessimistic */
  range: ValueRange;
}

/**
 * Type Guards
 * Runtime type checking utilities
 */

/**
 * Type guard to check if a value is a valid CapNetIncomeInputs object
 * @param value - The value to check
 * @returns True if the value is a valid CapNetIncomeInputs object
 */
export function isCapNetIncomeInputs(value: unknown): value is CapNetIncomeInputs {
  return (
    typeof value === 'object' &&
    value !== null &&
    'noi' in value &&
    'capitalizationRate' in value &&
    'riskPremium' in value &&
    typeof (value as any).noi === 'number' &&
    typeof (value as any).capitalizationRate === 'number' &&
    typeof (value as any).riskPremium === 'number'
  );
}

/**
 * Type guard to check if a value is a valid DCFInputs object
 * @param value - The value to check
 * @returns True if the value is a valid DCFInputs object
 */
export function isDCFInputs(value: unknown): value is DCFInputs {
  return (
    typeof value === 'object' &&
    value !== null &&
    'initialInvestment' in value &&
    'discountRate' in value &&
    'cashFlows' in value &&
    typeof (value as any).initialInvestment === 'number' &&
    typeof (value as any).discountRate === 'number' &&
    Array.isArray((value as any).cashFlows)
  );
}

/**
 * Type guard to check if a value is a valid ComparableProperty object
 * @param value - The value to check
 * @returns True if the value is a valid ComparableProperty object
 */
export function isComparableProperty(value: unknown): value is ComparableProperty {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'property' in value &&
    'location' in value &&
    'saleDate' in value &&
    'price' in value &&
    'pricePerSqm' in value &&
    'adjustedPrice' in value &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).property === 'string' &&
    typeof (value as any).location === 'string' &&
    typeof (value as any).saleDate === 'string' &&
    typeof (value as any).price === 'number' &&
    typeof (value as any).pricePerSqm === 'number' &&
    typeof (value as any).adjustedPrice === 'number'
  );
}

/**
 * Utility Types
 * Helper types for common patterns
 */

/**
 * Make all properties of T optional
 * @template T - The type to make optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties of T required
 * @template T - The type to make required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Pick specific properties from T
 * @template T - The source type
 * @template K - The keys to pick
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omit specific properties from T
 * @template T - The source type
 * @template K - The keys to omit
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Create a union type from the values of T
 * @template T - The object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a type that represents the keys of T as string literals
 * @template T - The object type
 */
export type Keys<T> = keyof T;

/**
 * Create a type that represents the values of T
 * @template T - The object type
 */
export type Values<T> = T[Keys<T>];
