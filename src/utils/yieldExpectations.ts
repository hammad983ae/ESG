/**
 * Yield Expectations Database
 * Expected yields per acre/hectare for different varieties
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 */

import { convertAcreToHectare } from "./conversionUtils";

export interface YieldExpectation {
  variety: string;
  category: string;
  type: string;
  yieldPerAcre: {
    min: number;
    max: number;
    average: number;
    unit: string;
  };
  yieldPerHectare: {
    min: number;
    max: number;
    average: number;
    unit: string;
  };
  factors: {
    climate: string[];
    soil: string[];
    irrigation: string[];
  };
  notes: string;
}

// Conversion rates for different units
const CONVERSION_RATES = {
  tons_to_kg: 1000,
  tons_to_pounds: 2204.62,
  acres_to_hectares: 0.404686,
  hectares_to_acres: 2.47105
};

const createYieldExpectation = (
  variety: string,
  category: string,
  type: string,
  minTonsPerAcre: number,
  maxTonsPerAcre: number,
  unit: string = "tons",
  factors?: Partial<YieldExpectation['factors']>,
  notes?: string
): YieldExpectation => {
  const avgTonsPerAcre = (minTonsPerAcre + maxTonsPerAcre) / 2;
  const minTonsPerHectare = minTonsPerAcre * CONVERSION_RATES.hectares_to_acres;
  const maxTonsPerHectare = maxTonsPerAcre * CONVERSION_RATES.hectares_to_acres;
  const avgTonsPerHectare = avgTonsPerAcre * CONVERSION_RATES.hectares_to_acres;

  return {
    variety,
    category,
    type,
    yieldPerAcre: {
      min: minTonsPerAcre,
      max: maxTonsPerAcre,
      average: avgTonsPerAcre,
      unit
    },
    yieldPerHectare: {
      min: minTonsPerHectare,
      max: maxTonsPerHectare,
      average: avgTonsPerHectare,
      unit
    },
    factors: {
      climate: factors?.climate || ['Moderate', 'Warm'],
      soil: factors?.soil || ['Well-drained', 'Fertile'],
      irrigation: factors?.irrigation || ['Drip', 'Micro-sprinkler']
    },
    notes: notes || 'Yields vary based on management practices, climate, and soil conditions'
  };
};

export const YIELD_EXPECTATIONS: YieldExpectation[] = [
  // Wine Grapes (tons per acre)
  createYieldExpectation('Cabernet Sauvignon', 'grape', 'wine', 3, 8, 'tons',
    { climate: ['Warm', 'Hot'], soil: ['Well-drained', 'Clay-loam'] },
    'Premium quality typically at lower yields (3-5 tons/acre)'
  ),
  createYieldExpectation('Merlot', 'grape', 'wine', 4, 9, 'tons',
    { climate: ['Moderate', 'Warm'] },
    'Higher yields possible but may reduce quality'
  ),
  createYieldExpectation('Pinot Noir', 'grape', 'wine', 2, 6, 'tons',
    { climate: ['Cool', 'Moderate'], soil: ['Limestone', 'Clay'] },
    'Delicate variety requiring precise management'
  ),
  createYieldExpectation('Chardonnay', 'grape', 'wine', 4, 10, 'tons',
    { climate: ['Cool', 'Moderate', 'Warm'] },
    'Adaptable variety with wide yield range'
  ),
  createYieldExpectation('Sauvignon Blanc', 'grape', 'wine', 5, 12, 'tons',
    { climate: ['Cool', 'Moderate'] },
    'Higher yields for commercial production'
  ),
  createYieldExpectation('Riesling', 'grape', 'wine', 4, 8, 'tons',
    { climate: ['Cool', 'Moderate'] },
    'Quality focused production typically 4-6 tons/acre'
  ),
  createYieldExpectation('Syrah/Shiraz', 'grape', 'wine', 3, 7, 'tons',
    { climate: ['Warm', 'Hot'], soil: ['Well-drained', 'Rocky'] },
    'Heat-loving variety with good yield potential'
  ),
  createYieldExpectation('Zinfandel', 'grape', 'wine', 4, 10, 'tons',
    { climate: ['Warm', 'Hot'] },
    'California specialty with variable yields'
  ),

  // Table Grapes (tons per acre)
  createYieldExpectation('Thompson Seedless', 'grape', 'table', 8, 15, 'tons',
    { irrigation: ['Drip', 'Micro-sprinkler', 'Flood'] },
    'Most common table grape variety'
  ),
  createYieldExpectation('Flame Seedless', 'grape', 'table', 10, 18, 'tons',
    { climate: ['Warm', 'Hot'] },
    'High-yielding red table grape'
  ),
  createYieldExpectation('Ruby Seedless', 'grape', 'table', 9, 16, 'tons',
    { climate: ['Warm', 'Hot'] },
    'Late season red variety'
  ),
  createYieldExpectation('Red Globe', 'grape', 'table', 12, 20, 'tons',
    { irrigation: ['Drip', 'Micro-sprinkler'] },
    'Large berry size, high commercial yields'
  ),
  createYieldExpectation('Jack Salute', 'grape', 'table', 10, 17, 'tons',
    { climate: ['Warm', 'Hot'] },
    'Premium table grape variety'
  ),
  createYieldExpectation('Princess', 'grape', 'table', 11, 19, 'tons',
    { climate: ['Warm', 'Hot'] },
    'High-quality seedless variety'
  ),
  createYieldExpectation('Crimson Seedless', 'grape', 'table', 8, 14, 'tons',
    { climate: ['Warm', 'Hot'] },
    'Late harvest variety with good storage'
  ),

  // SNFL New Varieties (estimated based on similar types)
  createYieldExpectation('Navsel 3', 'grape', 'table', 9, 16, 'tons',
    { climate: ['Warm', 'Hot'] },
    'New SNFL variety - early season'
  ),
  createYieldExpectation('Sunrise Red', 'grape', 'table', 10, 17, 'tons',
    { climate: ['Warm', 'Hot'] },
    'SNFL premium red variety'
  ),
  createYieldExpectation('Carlita', 'grape', 'table', 11, 18, 'tons',
    { climate: ['Warm', 'Hot'] },
    'High-yielding SNFL variety'
  ),

  // Dried Fruit Grapes (tons fresh weight per acre - 4:1 ratio for dried)
  createYieldExpectation('Sultana (Thompson Seedless)', 'grape', 'dried', 12, 20, 'tons fresh',
    { irrigation: ['Drip', 'Flood'], climate: ['Hot', 'Very Hot'] },
    'Yields 3-5 tons dried fruit per acre (4:1 ratio)'
  ),
  createYieldExpectation('Currants (Black Corinth)', 'grape', 'dried', 6, 12, 'tons fresh',
    { climate: ['Hot', 'Very Hot'] },
    'Specialty dried fruit - yields 1.5-3 tons dried per acre'
  ),
  createYieldExpectation('Muscat Gordo Blanco', 'grape', 'dried', 10, 16, 'tons fresh',
    { climate: ['Hot', 'Very Hot'] },
    'Dual purpose - table and dried fruit'
  ),

  // Tree Fruits (tons per acre)
  createYieldExpectation('Nashi Pear', 'fruit', 'tree', 15, 30, 'tons',
    { climate: ['Moderate', 'Warm'], soil: ['Well-drained'] },
    'Asian pear variety with good commercial potential'
  ),
  createYieldExpectation('Apple - Gala', 'fruit', 'tree', 20, 45, 'tons',
    { climate: ['Cool', 'Moderate'], irrigation: ['Drip', 'Micro-sprinkler'] },
    'Popular commercial variety with consistent yields'
  ),
  createYieldExpectation('Apple - Fuji', 'fruit', 'tree', 18, 42, 'tons',
    { climate: ['Moderate', 'Warm'] },
    'High-quality variety with good storage'
  ),
  createYieldExpectation('Orange - Navel', 'fruit', 'citrus', 15, 35, 'tons',
    { climate: ['Warm', 'Hot'], soil: ['Well-drained', 'Sandy-loam'] },
    'Premium citrus variety'
  ),
  createYieldExpectation('Orange - Valencia', 'fruit', 'citrus', 20, 45, 'tons',
    { climate: ['Warm', 'Hot'] },
    'Juice variety with higher yields'
  ),
  createYieldExpectation('Avocado - Hass', 'fruit', 'tree', 4, 12, 'tons',
    { climate: ['Mediterranean', 'Subtropical'], irrigation: ['Drip'] },
    'Premium variety, yields increase with tree age'
  ),

  // Nuts (tons per acre)
  createYieldExpectation('Almond - Nonpareil', 'nut', 'tree', 1.5, 4, 'tons',
    { climate: ['Mediterranean', 'Warm'], irrigation: ['Drip'] },
    'Premium almond variety - nuts in shell weight'
  ),
  createYieldExpectation('Walnut - English', 'nut', 'tree', 2, 5, 'tons',
    { climate: ['Moderate', 'Warm'], soil: ['Deep', 'Well-drained'] },
    'In-shell weight, requires cross-pollination'
  ),
  createYieldExpectation('Pistachio - Kerman', 'nut', 'tree', 1, 3, 'tons',
    { climate: ['Hot', 'Arid'], irrigation: ['Drip'] },
    'Alternate bearing - yields vary by year'
  ),

  // Field Crops (tons per acre)
  createYieldExpectation('Wheat - Hard Red Winter', 'crop', 'grain', 2, 5, 'tons',
    { climate: ['Temperate', 'Continental'], soil: ['Loam', 'Clay-loam'] },
    'Yield depends on rainfall and soil fertility'
  ),
  createYieldExpectation('Corn - Field', 'crop', 'grain', 6, 15, 'tons',
    { climate: ['Warm', 'Hot'], irrigation: ['Center Pivot', 'Drip'] },
    'High-input crop with excellent yield potential'
  ),
  createYieldExpectation('Soybeans', 'crop', 'legume', 2, 4, 'tons',
    { climate: ['Warm', 'Hot'], soil: ['Well-drained', 'Fertile'] },
    'Nitrogen-fixing crop, moderate yields'
  ),
  createYieldExpectation('Cotton', 'crop', 'fiber', 0.5, 1.5, 'tons lint',
    { climate: ['Hot'], irrigation: ['Drip', 'Center Pivot'] },
    'Lint yield - total biomass much higher'
  ),

  // Vegetables (tons per acre)
  createYieldExpectation('Tomato - Roma', 'vegetable', 'processing', 25, 60, 'tons',
    { climate: ['Warm', 'Hot'], irrigation: ['Drip'] },
    'Processing variety with high yields'
  ),
  createYieldExpectation('Lettuce - Iceberg', 'vegetable', 'leafy', 15, 25, 'tons',
    { climate: ['Cool', 'Moderate'], irrigation: ['Sprinkler', 'Drip'] },
    'Cool season crop with quick turnover'
  ),
  createYieldExpectation('Potato - Russet', 'vegetable', 'tuber', 20, 50, 'tons',
    { climate: ['Cool', 'Moderate'], soil: ['Sandy-loam', 'Well-drained'] },
    'Storage variety with good yield potential'
  ),
  createYieldExpectation('Carrot - Nantes', 'vegetable', 'root', 15, 35, 'tons',
    { climate: ['Cool', 'Moderate'], soil: ['Sandy', 'Deep'] },
    'Fresh market variety'
  )
];

/**
 * Get yield expectation for a specific variety
 */
export const getYieldExpectation = (variety: string): YieldExpectation | null => {
  return YIELD_EXPECTATIONS.find(ye => 
    ye.variety.toLowerCase().includes(variety.toLowerCase()) ||
    variety.toLowerCase().includes(ye.variety.toLowerCase())
  ) || null;
};

/**
 * Get all yield expectations for a category and type
 */
export const getYieldExpectationsByType = (category: string, type?: string): YieldExpectation[] => {
  return YIELD_EXPECTATIONS.filter(ye => 
    ye.category === category && (!type || ye.type === type)
  );
};

/**
 * Calculate expected yield for given area
 */
export const calculateExpectedYield = (
  variety: string, 
  acres: number, 
  qualityLevel: 'premium' | 'commercial' | 'maximum' = 'commercial'
): {
  acres: number;
  hectares: number;
  expectedYield: {
    tons: number;
    unit: string;
  };
  yieldRange: {
    min: number;
    max: number;
  };
  notes: string;
} | null => {
  const expectation = getYieldExpectation(variety);
  if (!expectation) return null;

  const hectares = convertAcreToHectare(acres);
  
  let yieldPerAcre: number;
  switch (qualityLevel) {
    case 'premium':
      yieldPerAcre = expectation.yieldPerAcre.min + 
        (expectation.yieldPerAcre.average - expectation.yieldPerAcre.min) * 0.5;
      break;
    case 'maximum':
      yieldPerAcre = expectation.yieldPerAcre.max;
      break;
    default: // commercial
      yieldPerAcre = expectation.yieldPerAcre.average;
  }

  const totalYield = yieldPerAcre * acres;
  
  return {
    acres,
    hectares,
    expectedYield: {
      tons: totalYield,
      unit: expectation.yieldPerAcre.unit
    },
    yieldRange: {
      min: expectation.yieldPerAcre.min * acres,
      max: expectation.yieldPerAcre.max * acres
    },
    notes: expectation.notes
  };
};