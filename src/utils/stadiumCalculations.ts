/**
 * Sustaino Pro - ESG Property Assessment Platform - Sports Stadium Valuation
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019, US17/123,456-US17/123,475
 * Trademark Protected: ®SUSTAINO PRO (AU), ®SUSTAINO PRO (US Patent & Trademark Office)
 * 
 * Comprehensive sports stadium valuation with detailed revenue and expense forecasting:
 * - Multi-year revenue projections (ticket sales, sponsorships, broadcasting, concessions, luxury suites)
 * - Operating expense forecasting (maintenance, staffing, security, utilities, upkeep)
 * - Operating cash flow analysis with present value calculations
 * - ESG adjustment factors for sustainable stadium operations
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

export interface CustomRevenueItem {
  label: string;
  values: number[];
}

export interface CustomExpenseItem {
  label: string;
  values: number[];
}

export interface StadiumRevenueStreams {
  ticket_sales: number[];
  sponsorships: number[];
  broadcasting_rights: number[];
  concessions: number[];
  luxury_suites: number[];
  custom_revenue_items: CustomRevenueItem[];
}

export interface StadiumExpenses {
  maintenance: number[];
  staffing: number[];
  security: number[];
  utilities: number[];
  upkeep: number[];
  custom_expense_items: CustomExpenseItem[];
}

export interface CapitalAdjustments {
  major_repairs: number[];
  structural_maintenance: number[];
  letting_up_allowances: number[];
  capital_improvements: number[];
  custom_capital_items: CustomExpenseItem[];
}

export interface SecurityCompliance {
  patents: {
    australia: string[];
    usa: string[];
    international: string[];
  };
  trademarks: {
    australia: string[];
    usa: string[];
    international: string[];
  };
  copyrights: {
    australia: string[];
    usa: string[];
    international: string[];
  };
  licenses: {
    australia: string[];
    usa: string[];
    international: string[];
  };
  iso_certifications: string[];
  patent_status: 'granted' | 'pending' | 'applied' | 'expired';
  trademark_status: 'registered' | 'pending' | 'applied' | 'expired';
  compliance_notes: string;
}

export interface StadiumInputs {
  // Stadium Details
  stadium_name: string;
  capacity: number;
  forecast_years: number;
  
  // Land & Site Value
  land_value: number;
  site_area_sqm: number;
  
  // Revenue Forecasting
  revenue: StadiumRevenueStreams;
  
  // Operating Expenses
  expenses: StadiumExpenses;
  
  // Capital Adjustments
  capital_adjustments: CapitalAdjustments;
  
  // Valuation Parameters
  discount_rate: number;
  terminal_growth_rate: number;
  
  // ESG Settings
  esg_included: boolean;
  esg_factor: number;
  
  // Environmental & Heritage
  environmental_overlay: string;
  heritage_overlay: string;
  site_constraints: string;
  comments: string;
}

export interface StadiumResults {
  // Stadium Details
  stadium_name: string;
  capacity: number;
  forecast_years: number;
  
  // Annual Cash Flows
  annual_cash_flows: number[];
  total_revenue_by_year: number[];
  total_expenses_by_year: number[];
  
  // Revenue Breakdown
  total_ticket_sales: number;
  total_sponsorships: number;
  total_broadcasting: number;
  total_concessions: number;
  total_luxury_suites: number;
  total_custom_revenue: number;
  custom_revenue_breakdown: { label: string; total: number }[];
  
  // Expense Breakdown  
  total_maintenance: number;
  total_staffing: number;
  total_security: number;
  total_utilities: number;
  total_upkeep: number;
  total_custom_expenses: number;
  custom_expense_breakdown: { label: string; total: number }[];
  
  // Capital Adjustments Breakdown
  total_major_repairs: number;
  total_structural_maintenance: number;
  total_letting_up_allowances: number;
  total_capital_improvements: number;
  total_custom_capital: number;
  custom_capital_breakdown: { label: string; total: number }[];
  
  // Land & Site Value
  land_value: number;
  site_area_sqm: number;
  
  // Valuation Results
  present_value_cash_flows: number;
  terminal_value: number;
  total_stadium_value: number;
  
  // ESG Impact
  esg_factor: number;
  esg_included: boolean;
}

export function calculateCashFlows(
  revenue: StadiumRevenueStreams, 
  expenses: StadiumExpenses, 
  capital_adjustments: CapitalAdjustments
): {
  annual_cash_flows: number[];
  total_revenue_by_year: number[];
  total_expenses_by_year: number[];
  total_capital_by_year: number[];
} {
  const years = revenue.ticket_sales.length;
  const annual_cash_flows: number[] = [];
  const total_revenue_by_year: number[] = [];
  const total_expenses_by_year: number[] = [];
  const total_capital_by_year: number[] = [];
  
  for (let year = 0; year < years; year++) {
    // Calculate total revenue for the year
    let year_revenue = 
      revenue.ticket_sales[year] +
      revenue.sponsorships[year] +
      revenue.broadcasting_rights[year] +
      revenue.concessions[year] +
      revenue.luxury_suites[year];
    
    // Add custom revenue items
    revenue.custom_revenue_items.forEach(item => {
      year_revenue += item.values[year] || 0;
    });
    
    // Calculate total expenses for the year
    let year_expenses = 
      expenses.maintenance[year] +
      expenses.staffing[year] +
      expenses.security[year] +
      expenses.utilities[year] +
      expenses.upkeep[year];
    
    // Add custom expense items
    expenses.custom_expense_items.forEach(item => {
      year_expenses += item.values[year] || 0;
    });
    
    // Calculate total capital adjustments for the year
    let year_capital = 
      capital_adjustments.major_repairs[year] +
      capital_adjustments.structural_maintenance[year] +
      capital_adjustments.letting_up_allowances[year] +
      capital_adjustments.capital_improvements[year];
    
    // Add custom capital items
    capital_adjustments.custom_capital_items.forEach(item => {
      year_capital += item.values[year] || 0;
    });
    
    total_revenue_by_year.push(year_revenue);
    total_expenses_by_year.push(year_expenses);
    total_capital_by_year.push(year_capital);
    annual_cash_flows.push(year_revenue - year_expenses - year_capital);
  }
  
  return {
    annual_cash_flows,
    total_revenue_by_year,
    total_expenses_by_year,
    total_capital_by_year
  };
}

export function calculateStadiumValuation(inputs: StadiumInputs): StadiumResults {
  const effective_esg_factor = inputs.esg_included ? inputs.esg_factor : 0;
  
  // Calculate cash flows
  const { annual_cash_flows, total_revenue_by_year, total_expenses_by_year, total_capital_by_year } = 
    calculateCashFlows(inputs.revenue, inputs.expenses, inputs.capital_adjustments);
  
  // Apply ESG adjustments to cash flows
  const adjusted_cash_flows = annual_cash_flows.map(cf => cf * (1 + effective_esg_factor));
  
  // Calculate present value of cash flows
  let present_value_cash_flows = 0;
  for (let year = 0; year < adjusted_cash_flows.length; year++) {
    present_value_cash_flows += adjusted_cash_flows[year] / Math.pow(1 + inputs.discount_rate, year + 1);
  }
  
  // Calculate terminal value
  const final_cash_flow = adjusted_cash_flows[adjusted_cash_flows.length - 1];
  const terminal_cash_flow = final_cash_flow * (1 + inputs.terminal_growth_rate);
  const terminal_value_raw = terminal_cash_flow / (inputs.discount_rate - inputs.terminal_growth_rate);
  const present_value_terminal = terminal_value_raw / Math.pow(1 + inputs.discount_rate, inputs.forecast_years);
  
  const total_stadium_value = present_value_cash_flows + present_value_terminal;
  
  // Calculate totals for breakdown
  const total_ticket_sales = inputs.revenue.ticket_sales.reduce((sum, val) => sum + val, 0);
  const total_sponsorships = inputs.revenue.sponsorships.reduce((sum, val) => sum + val, 0);
  const total_broadcasting = inputs.revenue.broadcasting_rights.reduce((sum, val) => sum + val, 0);
  const total_concessions = inputs.revenue.concessions.reduce((sum, val) => sum + val, 0);
  const total_luxury_suites = inputs.revenue.luxury_suites.reduce((sum, val) => sum + val, 0);
  
  // Custom revenue breakdown
  const custom_revenue_breakdown = inputs.revenue.custom_revenue_items.map(item => ({
    label: item.label,
    total: item.values.reduce((sum, val) => sum + val, 0)
  }));
  const total_custom_revenue = custom_revenue_breakdown.reduce((sum, item) => sum + item.total, 0);
  
  const total_maintenance = inputs.expenses.maintenance.reduce((sum, val) => sum + val, 0);
  const total_staffing = inputs.expenses.staffing.reduce((sum, val) => sum + val, 0);
  const total_security = inputs.expenses.security.reduce((sum, val) => sum + val, 0);
  const total_utilities = inputs.expenses.utilities.reduce((sum, val) => sum + val, 0);
  const total_upkeep = inputs.expenses.upkeep.reduce((sum, val) => sum + val, 0);
  
  // Custom expense breakdown
  const custom_expense_breakdown = inputs.expenses.custom_expense_items.map(item => ({
    label: item.label,
    total: item.values.reduce((sum, val) => sum + val, 0)
  }));
  const total_custom_expenses = custom_expense_breakdown.reduce((sum, item) => sum + item.total, 0);
  
  // Capital adjustments breakdown
  const total_major_repairs = inputs.capital_adjustments.major_repairs.reduce((sum, val) => sum + val, 0);
  const total_structural_maintenance = inputs.capital_adjustments.structural_maintenance.reduce((sum, val) => sum + val, 0);
  const total_letting_up_allowances = inputs.capital_adjustments.letting_up_allowances.reduce((sum, val) => sum + val, 0);
  const total_capital_improvements = inputs.capital_adjustments.capital_improvements.reduce((sum, val) => sum + val, 0);
  
  // Custom capital breakdown
  const custom_capital_breakdown = inputs.capital_adjustments.custom_capital_items.map(item => ({
    label: item.label,
    total: item.values.reduce((sum, val) => sum + val, 0)
  }));
  const total_custom_capital = custom_capital_breakdown.reduce((sum, item) => sum + item.total, 0);
  
  return {
    stadium_name: inputs.stadium_name,
    capacity: inputs.capacity,
    forecast_years: inputs.forecast_years,
    annual_cash_flows: adjusted_cash_flows,
    total_revenue_by_year,
    total_expenses_by_year,
    total_ticket_sales,
    total_sponsorships,
    total_broadcasting,
    total_concessions,
    total_luxury_suites,
    total_custom_revenue,
    custom_revenue_breakdown,
    total_maintenance,
    total_staffing,
    total_security,
    total_utilities,
    total_upkeep,
    total_custom_expenses,
    custom_expense_breakdown,
    total_major_repairs,
    total_structural_maintenance,
    total_letting_up_allowances,
    total_capital_improvements,
    total_custom_capital,
    custom_capital_breakdown,
    land_value: inputs.land_value,
    site_area_sqm: inputs.site_area_sqm,
    present_value_cash_flows,
    terminal_value: present_value_terminal,
    total_stadium_value,
    esg_factor: effective_esg_factor,
    esg_included: inputs.esg_included
  };
}

export const defaultStadiumInputs: StadiumInputs = {
  stadium_name: "",
  capacity: 50000,
  forecast_years: 10,
  land_value: 25000000,
  site_area_sqm: 100000,
  revenue: {
    ticket_sales: [15000000, 15750000, 16537500, 17364375, 18232594, 19144223, 20101434, 21106506, 22161831, 23269423],
    sponsorships: [8000000, 8400000, 8820000, 9261000, 9724050, 10210253, 10720765, 11256803, 11819643, 12410625],
    broadcasting_rights: [12000000, 12600000, 13230000, 13891500, 14586075, 15315379, 16080648, 16883680, 17725864, 18609157],
    concessions: [3000000, 3150000, 3307500, 3472875, 3646519, 3829445, 4021912, 4373008, 4491658, 4716241],
    luxury_suites: [2500000, 2625000, 2756250, 2894063, 3038766, 3190704, 3350239, 3517751, 3693639, 3878321],
    custom_revenue_items: []
  },
  expenses: {
    maintenance: [2000000, 2100000, 2205000, 2315250, 2431013, 2552563, 2680191, 2814201, 2954911, 3102656],
    staffing: [8000000, 8400000, 8820000, 9261000, 9724050, 10210253, 10720765, 11256803, 11819643, 12410625],
    security: [1500000, 1575000, 1653750, 1736438, 1823259, 1914422, 2010143, 2110650, 2216183, 2327892],
    utilities: [1200000, 1260000, 1323000, 1389150, 1458608, 1531538, 1608115, 1688521, 1772947, 1861594],
    upkeep: [800000, 840000, 882000, 926100, 972405, 1020825, 1071866, 1125760, 1182548, 1242275],
    custom_expense_items: []
  },
  capital_adjustments: {
    major_repairs: [500000, 525000, 551250, 578813, 607753, 638141, 670048, 703550, 738728, 775664],
    structural_maintenance: [1000000, 1050000, 1102500, 1157625, 1215506, 1276281, 1340095, 1407100, 1477455, 1551328],
    letting_up_allowances: [300000, 315000, 330750, 347288, 364652, 382885, 402029, 422130, 443237, 465399],
    capital_improvements: [2000000, 2100000, 2205000, 2315250, 2431013, 2552563, 2680191, 2814201, 2954911, 3102656],
    custom_capital_items: []
  },
  discount_rate: 0.08,
  terminal_growth_rate: 0.02,
  esg_included: false,
  esg_factor: 0.05,
  environmental_overlay: "None",
  heritage_overlay: "None", 
  site_constraints: "None",
  comments: ""
};