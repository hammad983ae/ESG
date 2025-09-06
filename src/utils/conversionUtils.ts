/**
 * Delorenzo Property Group - Conversion Utilities
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

/**
 * Result of area conversion calculations
 * Contains the same area expressed in different units
 */
export interface ConversionResult {
  /** Area in acres */
  acres: number;
  /** Area in hectares */
  hectares: number;
  /** Area in square meters */
  squareMeters: number;
  /** Area in square feet */
  squareFeet: number;
}

/**
 * Water forecast data for agricultural irrigation planning
 * Contains water requirements and irrigation scheduling information
 */
export interface WaterForecast {
  /** Water requirement in megalitres per acre */
  mlPerAcre: number;
  /** Water requirement in megalitres per hectare */
  mlPerHectare: number;
  /** Total water required for the entire area */
  totalMlRequired: number;
  /** Irrigation schedule recommendations */
  irrigationSchedule: {
    /** Recommended irrigation frequency */
    frequency: string;
    /** Application rate per irrigation event */
    applicationRate: string;
    /** Total seasonal water requirement */
    seasonalTotal: string;
  };
}

/**
 * Convert acres to hectares and other units
 * @param acres - Area in acres to convert
 * @returns ConversionResult with area in acres, hectares, square meters, and square feet
 * @example
 * ```typescript
 * const result = convertAcreage(10);
 * console.log(result.hectares); // 4.0469
 * ```
 */
export function convertAcreage(acres: number): ConversionResult {
  const hectares = acres * 0.404686;
  const squareMeters = hectares * 10000;
  const squareFeet = acres * 43560;

  return {
    acres,
    hectares: Number(hectares.toFixed(4)),
    squareMeters: Number(squareMeters.toFixed(2)),
    squareFeet: Number(squareFeet.toFixed(0)),
  };
}

/**
 * Convert hectares to acres and other units
 * @param hectares - Area in hectares to convert
 * @returns ConversionResult with area in acres, hectares, square meters, and square feet
 * @example
 * ```typescript
 * const result = convertHectares(4.0469);
 * console.log(result.acres); // 10.0000
 * ```
 */
export function convertHectares(hectares: number): ConversionResult {
  const acres = hectares * 2.47105;
  const squareMeters = hectares * 10000;
  const squareFeet = acres * 43560;

  return {
    acres: Number(acres.toFixed(4)),
    hectares,
    squareMeters: Number(squareMeters.toFixed(2)),
    squareFeet: Number(squareFeet.toFixed(0)),
  };
}

/**
 * Calculate ML (Megalitres) per acre water requirements
 * @param cropType - Type of crop being grown
 * @param irrigationType - Type of irrigation system used
 * @param coverage - Percentage of area covered by irrigation (0-100)
 * @param climateZone - Climate zone classification
 * @param totalArea - Total area in acres
 * @returns WaterForecast with water requirements and irrigation schedule
 * @example
 * ```typescript
 * const forecast = calculateWaterForecast('Apple', 'Drip Irrigation', 100, 'Temperate', 50);
 * console.log(forecast.mlPerAcre); // 1.89
 * ```
 */
export function calculateWaterForecast(
  cropType: string,
  irrigationType: string,
  coverage: number,
  climateZone: string,
  totalArea: number
): WaterForecast {
  // Base water requirements in ML per acre by crop type
  const baseWaterRequirements: Record<string, number> = {
    // Grapes
    'grape': 1.2,
    'wine-grape': 1.0,
    'table-grape': 1.4,
    
    // Tree fruits
    'Apple': 1.8,
    'Orange': 2.2,
    'Lemon': 2.0,
    'Avocado': 2.5,
    'Almond': 1.6,
    'Walnut': 2.0,
    'Peach': 1.7,
    'Cherry': 1.5,
    'Pear': 1.6,
    
    // Field crops
    'Wheat': 0.8,
    'Corn': 1.5,
    'Cotton': 1.8,
    'Rice': 3.2,
    'Soybeans': 1.0,
    
    // Vegetables
    'Tomato': 2.0,
    'Lettuce': 0.6,
    'Potato': 1.2,
    'Carrot': 0.8,
    
    // Nuts
    'Pistachio': 1.8,
    'Macadamia': 2.2,
  };

  // Climate zone multipliers
  const climateMultipliers: Record<string, number> = {
    'Cool Climate (Zone I)': 0.8,
    'Moderate Climate (Zone II)': 1.0,
    'Warm Climate (Zone III)': 1.2,
    'Hot Climate (Zone IV)': 1.4,
    'Very Hot Climate (Zone V)': 1.6,
    'Temperate': 1.0,
    'Mediterranean': 1.1,
    'Subtropical': 1.3,
    'Tropical': 1.5,
  };

  // Irrigation efficiency factors
  const irrigationEfficiency: Record<string, number> = {
    'Drip Irrigation': 0.95,
    'Micro-sprinkler': 0.90,
    'Sprinkler System': 0.85,
    'Center Pivot': 0.80,
    'Flood Irrigation': 0.60,
    'Subsurface Drip': 0.98,
    'Rain-fed': 0.70,
    'Combination System': 0.85,
  };

  const baseML = baseWaterRequirements[cropType] || 1.0;
  const climateMultiplier = climateMultipliers[climateZone] || 1.0;
  const efficiency = irrigationEfficiency[irrigationType] || 0.80;
  const coverageMultiplier = coverage / 100;

  // Calculate ML per acre with adjustments
  const mlPerAcre = (baseML * climateMultiplier * coverageMultiplier) / efficiency;
  const mlPerHectare = mlPerAcre * 2.47105;
  const totalMlRequired = mlPerAcre * totalArea;

  // Generate irrigation schedule based on crop and system
  const schedule = generateIrrigationSchedule(cropType, irrigationType, mlPerAcre);

  return {
    mlPerAcre: Number(mlPerAcre.toFixed(2)),
    mlPerHectare: Number(mlPerHectare.toFixed(2)),
    totalMlRequired: Number(totalMlRequired.toFixed(2)),
    irrigationSchedule: schedule,
  };
}

/**
 * Irrigation schedule data for agricultural planning
 * Contains timing and application rate information
 */
interface IrrigationScheduleData {
  /** Recommended irrigation frequency */
  frequency: string;
  /** Application rate per irrigation event */
  applicationRate: string;
  /** Total seasonal water requirement */
  seasonalTotal: string;
}

/**
 * Generate irrigation schedule based on crop type and irrigation system
 * @param cropType - Type of crop being grown
 * @param irrigationType - Type of irrigation system used
 * @param mlPerAcre - Water requirement in ML per acre
 * @returns IrrigationScheduleData with frequency and application rates
 */
function generateIrrigationSchedule(cropType: string, irrigationType: string, mlPerAcre: number): IrrigationScheduleData {
  const schedules: Record<string, IrrigationScheduleData> = {
    'Drip Irrigation': {
      frequency: 'Daily during growing season',
      applicationRate: `${(mlPerAcre / 180).toFixed(3)} ML/acre/day`,
      seasonalTotal: `${mlPerAcre.toFixed(2)} ML/acre/season`,
    },
    'Sprinkler System': {
      frequency: '2-3 times per week',
      applicationRate: `${(mlPerAcre / 60).toFixed(3)} ML/acre/application`,
      seasonalTotal: `${mlPerAcre.toFixed(2)} ML/acre/season`,
    },
    'Micro-sprinkler': {
      frequency: 'Daily during peak season',
      applicationRate: `${(mlPerAcre / 150).toFixed(3)} ML/acre/day`,
      seasonalTotal: `${mlPerAcre.toFixed(2)} ML/acre/season`,
    },
  };

  return schedules[irrigationType] || {
    frequency: 'As required',
    applicationRate: `${(mlPerAcre / 100).toFixed(3)} ML/acre/application`,
    seasonalTotal: `${mlPerAcre.toFixed(2)} ML/acre/season`,
  };
}

/**
 * Format area display with conversions
 * @param acres - Area in acres to format
 * @returns Formatted string showing acres and hectares
 * @example
 * ```typescript
 * const display = formatAreaDisplay(10);
 * console.log(display); // "10 acres (4.0469 ha)"
 * ```
 */
export function formatAreaDisplay(acres: number): string {
  const conversion = convertAcreage(acres);
  return `${acres} acres (${conversion.hectares} ha)`;
}

/**
 * Format water display with conversions
 * @param mlPerAcre - Water requirement in ML per acre to format
 * @returns Formatted string showing ML per acre and per hectare
 * @example
 * ```typescript
 * const display = formatWaterDisplay(1.5);
 * console.log(display); // "1.5 ML/acre (3.71 ML/ha)"
 * ```
 */
export function formatWaterDisplay(mlPerAcre: number): string {
  const mlPerHectare = mlPerAcre * 2.47105;
  return `${mlPerAcre} ML/acre (${mlPerHectare.toFixed(2)} ML/ha)`;
}

/**
 * Simple conversion functions for components
 * @param acres - Area in acres to convert
 * @returns Area in hectares
 * @example
 * ```typescript
 * const hectares = convertAcreToHectare(10);
 * console.log(hectares); // 4.04686
 * ```
 */
export function convertAcreToHectare(acres: number): number {
  return acres * 0.404686;
}

/**
 * Convert hectares to acres
 * @param hectares - Area in hectares to convert
 * @returns Area in acres
 * @example
 * ```typescript
 * const acres = convertHectareToAcre(4.0469);
 * console.log(acres); // 10.0000
 * ```
 */
export function convertHectareToAcre(hectares: number): number {
  return hectares * 2.47105;
}