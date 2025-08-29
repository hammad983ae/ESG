import { AdvancedPropertyData } from '../components/AdvancedCalculationsForm';

export interface AdvancedCalculationResults {
  overallSustainabilityScore: number;
  energyEfficiencyScore: number;
  waterConservationScore: number;
  wasteReductionScore: number;
  materialsScore: number;
  climateRiskLevel: 'Low' | 'Medium' | 'High';
  climateRiskDetails: {
    flood: 'Low' | 'Medium' | 'High';
    bushfire: 'Low' | 'Medium' | 'High';
    cyclone: 'Low' | 'Medium' | 'High';
    heatwave: 'Low' | 'Medium' | 'High';
    drought: 'Low' | 'Medium' | 'High';
    overallScore: number;
  };
  seifaScore: number;
  financialRiskScore: number;
  overallRiskRating: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  detailedBreakdown: {
    sustainabilityComponents: {
      energy: number;
      nabers: number;
      greenStar: number;
      other: number;
    };
    riskComponents: {
      climate: number;
      financial: number;
      esg: number;
    };
  };
}

export function calculateAdvancedRiskAssessment(data: AdvancedPropertyData): AdvancedCalculationResults {
  // 1. Overall Sustainability Score
  const sustainabilityComponents = {
    energy: data.energyRating,
    nabers: normalizeNABERSToTen(data.nabersRating),
    greenStar: normalizeGreenStarToTen(data.greenStarRating),
    other: data.otherRatings.length > 0 ? data.otherRatings.reduce((sum, rating) => sum + rating, 0) / data.otherRatings.length : 0
  };

  const totalWeights = data.sustainabilityWeights.energy + 
                      data.sustainabilityWeights.nabers + 
                      data.sustainabilityWeights.greenStar + 
                      data.sustainabilityWeights.other;

  const overallSustainabilityScore = (
    data.sustainabilityWeights.energy * sustainabilityComponents.energy +
    data.sustainabilityWeights.nabers * sustainabilityComponents.nabers +
    data.sustainabilityWeights.greenStar * sustainabilityComponents.greenStar +
    data.sustainabilityWeights.other * sustainabilityComponents.other
  ) / Math.max(totalWeights, 0.01); // Prevent division by zero

  // 2. Energy Efficiency Score
  const energyFeatureValues = Object.values(data.energyFeatures);
  const energyEfficiencyScore = energyFeatureValues.reduce((sum, score) => sum + score, 0) / energyFeatureValues.length;

  // 3. Water Conservation Score  
  const waterStrategyValues = Object.values(data.waterStrategies);
  const waterConservationScore = waterStrategyValues.reduce((sum, score) => sum + score, 0) / waterStrategyValues.length;

  // 4. Waste Reduction Score
  const wasteStrategyValues = Object.values(data.wasteStrategies);
  const wasteReductionScore = wasteStrategyValues.reduce((sum, score) => sum + score, 0) / wasteStrategyValues.length;

  // 5. Materials Score
  const materialsScore = Math.min(10, (data.sustainableMaterials.ecoFriendlyMaterialsUsed / data.sustainableMaterials.totalMaterials) * 10);

  // 6. Climate Risk Assessment
  const climateRiskDetails = {
    flood: categorizeRisk(data.climateRisk.floodRisk, data.climateRisk.thresholds.flood),
    bushfire: categorizeRisk(data.climateRisk.bushfireRisk, data.climateRisk.thresholds.bushfire),
    cyclone: categorizeRisk(data.climateRisk.cycloneRisk, data.climateRisk.thresholds.cyclone),
    heatwave: categorizeRisk(data.climateRisk.heatwaveRisk, data.climateRisk.thresholds.heatwave),
    drought: categorizeRisk(data.climateRisk.droughtRisk, data.climateRisk.thresholds.drought),
    overallScore: 0
  };

  // Calculate overall climate risk score (0-100)
  const climateRiskValues = [
    data.climateRisk.floodRisk,
    data.climateRisk.bushfireRisk,
    data.climateRisk.cycloneRisk,
    data.climateRisk.heatwaveRisk,
    data.climateRisk.droughtRisk
  ];
  climateRiskDetails.overallScore = climateRiskValues.reduce((sum, risk) => sum + risk, 0) / climateRiskValues.length;

  const climateRiskLevel = categorizeRisk(climateRiskDetails.overallScore, 30); // Using 30 as average threshold

  // 7. SEIFA Score (already provided)
  const seifaScore = data.seifaScore;

  // 8. Financial Risk Score
  const financialRiskScore = calculateFinancialRiskScore(data.financialRisk);

  // 9. Overall Risk Rating (1-5)
  const riskComponents = {
    climate: normalizeToZeroOne(climateRiskDetails.overallScore, 0, 100),
    financial: normalizeToZeroOne(financialRiskScore, 0, 10),
    esg: normalizeToZeroOne(10 - overallSustainabilityScore, 0, 10) // Invert ESG score for risk
  };

  const totalRiskWeights = data.riskWeights.climate + data.riskWeights.financial + data.riskWeights.esg;
  const combinedRiskScore = (
    data.riskWeights.climate * riskComponents.climate +
    data.riskWeights.financial * riskComponents.financial +
    data.riskWeights.esg * riskComponents.esg
  ) / Math.max(totalRiskWeights, 0.01);

  const overallRiskRating = Math.min(5, Math.max(1, Math.round(combinedRiskScore * 4 + 1)));

  return {
    overallSustainabilityScore,
    energyEfficiencyScore,
    waterConservationScore,
    wasteReductionScore,
    materialsScore,
    climateRiskLevel,
    climateRiskDetails,
    seifaScore,
    financialRiskScore,
    overallRiskRating,
    riskLevel: getRiskLevel(overallRiskRating),
    detailedBreakdown: {
      sustainabilityComponents,
      riskComponents
    }
  };
}

// Helper functions
function normalizeNABERSToTen(nabersRating: number): number {
  // NABERS is 0-6, normalize to 0-10
  return (nabersRating / 6) * 10;
}

function normalizeGreenStarToTen(greenStarRating: number): number {
  // Green Star is 0-6, normalize to 0-10
  return (greenStarRating / 6) * 10;
}

function categorizeRisk(riskValue: number, threshold: number): 'Low' | 'Medium' | 'High' {
  if (riskValue > threshold * 1.5) return 'High';
  if (riskValue > threshold) return 'Medium';
  return 'Low';
}

function normalizeToZeroOne(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function calculateFinancialRiskScore(financial: AdvancedPropertyData['financialRisk']): number {
  let riskScore = 0;

  // Property age risk (0-3 points)
  if (financial.propertyAge > 50) riskScore += 3;
  else if (financial.propertyAge > 30) riskScore += 2;
  else if (financial.propertyAge > 15) riskScore += 1;

  // Vacancy rate risk (0-2 points)
  if (financial.vacancyRate > 15) riskScore += 2;
  else if (financial.vacancyRate > 8) riskScore += 1;

  // Debt to value ratio risk (0-2 points)
  if (financial.debtToValueRatio > 80) riskScore += 2;
  else if (financial.debtToValueRatio > 60) riskScore += 1;

  // Maintenance backlog risk (0-2 points)
  if (financial.maintenanceBacklog > 500) riskScore += 2;
  else if (financial.maintenanceBacklog > 200) riskScore += 1;

  // Market volatility (direct score 1-10)
  riskScore += financial.marketVolatility * 0.1;

  return Math.min(10, riskScore);
}

function getRiskLevel(riskRating: number): 'Low' | 'Moderate' | 'High' {
  if (riskRating <= 2) return 'Low';
  if (riskRating <= 3) return 'Moderate';
  return 'High';
}

// ============= CAPITALIZATION OF NET INCOME APPROACH =============

export interface CapitalizationNetIncomeInputs {
  netRent: number;
  nrogs?: number; // Non-Recoverable Outgoings
  capitalizationRateOptimistic: number;
  capitalizationRateRealistic?: number;
  capitalizationRatePessimistic: number;
  lettingUpAllowance?: number;
  otherCapitalAdjustments?: number;
  relettingCosts?: number;
}

export interface ESGAdjustedCapitalizationInputs {
  netRent: number;
  nrogs?: number; // Non-Recoverable Outgoings
  capitalizationRateOptimistic: number;
  capitalizationRateRealistic?: number;
  capitalizationRatePessimistic: number;
  lettingUpAllowance?: number;
  otherCapitalAdjustments?: number;
  relettingCosts?: number;
  useEsgAdjustment: boolean;
  esgAdjustmentFactor?: number;
}

export interface CapitalizationNetIncomeResults {
  noi: number; // Net Operating Income
  capitalAdjustments: number;
  optimisticMarketValue: number | null;
  realisticMarketValue: number | null;
  pessimisticMarketValue: number | null;
  optimisticMarketValueRounded: number | null;
  realisticMarketValueRounded: number | null;
  pessimisticMarketValueRounded: number | null;
  calculations: {
    optimistic: {
      beforeAdjustments: number | null;
      adjustments: number;
      afterAdjustments: number | null;
    };
    realistic: {
      beforeAdjustments: number | null;
      adjustments: number;
      afterAdjustments: number | null;
    };
    pessimistic: {
      beforeAdjustments: number | null;
      adjustments: number;
      afterAdjustments: number | null;
    };
  };
}

export function calculateCapitalisationRateSensitivity(inputs: CapitalizationNetIncomeInputs | ESGAdjustedCapitalizationInputs): CapitalizationNetIncomeResults {
  // Validate inputs
  if (inputs.netRent <= 0) {
    throw new Error("Net rent must be positive");
  }
  
  if (inputs.capitalizationRateOptimistic <= 0 || inputs.capitalizationRatePessimistic <= 0) {
    throw new Error("Capitalization rates must be positive");
  }
  
  if (inputs.capitalizationRateRealistic !== undefined && inputs.capitalizationRateRealistic <= 0) {
    throw new Error("Realistic capitalization rate must be positive if provided");
  }

  // Apply ESG adjustment if enabled
  let adjustedOptimistic = inputs.capitalizationRateOptimistic;
  let adjustedRealistic = inputs.capitalizationRateRealistic;
  let adjustedPessimistic = inputs.capitalizationRatePessimistic;

  if ('useEsgAdjustment' in inputs && inputs.useEsgAdjustment) {
    const adjustment = inputs.esgAdjustmentFactor || 0;
    adjustedOptimistic += adjustment;
    if (adjustedRealistic) adjustedRealistic += adjustment;
    adjustedPessimistic += adjustment;
    
    // Validate adjusted rates are still positive
    if (adjustedOptimistic <= 0 || adjustedPessimistic <= 0) {
      throw new Error("ESG-adjusted capitalization rates must remain positive");
    }
    if (adjustedRealistic !== undefined && adjustedRealistic <= 0) {
      throw new Error("ESG-adjusted realistic capitalization rate must remain positive");
    }
  }

  // Calculate Net Operating Income (NOI)
  const nrogs = inputs.nrogs || 0;
  const noi = inputs.netRent - nrogs;
  
  if (noi <= 0) {
    throw new Error("Net Operating Income must be positive (Net Rent must exceed NROGS)");
  }

  // Calculate capital adjustments
  const lettingUpAllowance = inputs.lettingUpAllowance || 0;
  const otherCapitalAdjustments = inputs.otherCapitalAdjustments || 0;
  const relettingCosts = inputs.relettingCosts || 0;
  const capitalAdjustments = lettingUpAllowance + otherCapitalAdjustments + relettingCosts;

  // Calculate market values for each scenario using adjusted rates
  const optimisticMarketValue = noi / adjustedOptimistic;
  const realisticMarketValue = adjustedRealistic 
    ? noi / adjustedRealistic 
    : null;
  const pessimisticMarketValue = noi / adjustedPessimistic;

  // Apply capital adjustments
  const optimisticAdjusted = optimisticMarketValue - capitalAdjustments;
  const realisticAdjusted = realisticMarketValue ? realisticMarketValue - capitalAdjustments : null;
  const pessimisticAdjusted = pessimisticMarketValue - capitalAdjustments;

  // Round to nearest $1,000
  const roundToThousand = (value: number | null): number | null => {
    return value ? Math.round(value / 1000) * 1000 : null;
  };

  return {
    noi,
    capitalAdjustments,
    optimisticMarketValue,
    realisticMarketValue,
    pessimisticMarketValue,
    optimisticMarketValueRounded: roundToThousand(optimisticAdjusted),
    realisticMarketValueRounded: roundToThousand(realisticAdjusted),
    pessimisticMarketValueRounded: roundToThousand(pessimisticAdjusted),
    calculations: {
      optimistic: {
        beforeAdjustments: optimisticMarketValue,
        adjustments: capitalAdjustments,
        afterAdjustments: optimisticAdjusted
      },
      realistic: {
        beforeAdjustments: realisticMarketValue,
        adjustments: capitalAdjustments,  
        afterAdjustments: realisticAdjusted
      },
      pessimistic: {
        beforeAdjustments: pessimisticMarketValue,
        adjustments: capitalAdjustments,
        afterAdjustments: pessimisticAdjusted
      }
    }
  };
}

// Export Excel formulas for advanced calculations
export function exportAdvancedExcelFormulas() {
  return {
    overallSustainabilityScore: '(Energy_Weight * Energy_Rating + NABERS_Weight * (NABERS_Rating/6*10) + GreenStar_Weight * (GreenStar_Rating/6*10) + Other_Weight * Other_Rating) / (Energy_Weight + NABERS_Weight + GreenStar_Weight + Other_Weight)',
    energyEfficiencyScore: 'AVERAGE(Solar_Panels, Insulation, LED_Lighting, HVAC_Efficiency, Smart_Systems, Energy_Management)',
    waterConservationScore: 'AVERAGE(Rainwater_Harvesting, GreyWater_Recycling, LowFlow_Fixtures, Drought_Resistant_Landscaping, Water_Monitoring, Irrigation_Efficiency)',
    wasteReductionScore: 'AVERAGE(Recycling_Programs, Composting, Waste_Reduction, Construction_Waste_Management, Hazardous_Waste_Handling)',
    materialsScore: 'MIN(10, (Eco_Friendly_Materials_Used / Total_Materials) * 10)',
    climateRiskLevel: 'IF(Climate_Risk > Threshold*1.5, "High", IF(Climate_Risk > Threshold, "Medium", "Low"))',
    financialRiskScore: 'Property_Age_Risk + Vacancy_Rate_Risk + Debt_Ratio_Risk + Maintenance_Risk + Market_Volatility*0.1',
    overallRiskRating: 'MIN(5, MAX(1, ROUND((Climate_Weight * Climate_Risk_Normalized + Financial_Weight * Financial_Risk_Normalized + ESG_Weight * ESG_Risk_Normalized) * 4 + 1, 0)))',
    normalization: 'Normalized_Factor = (Actual_Score - Min_Score) / (Max_Score - Min_Score)',
    // Capitalization formulas
    noi: 'Net_Rent - NROGS',
    capitalAdjustments: 'Letting_Up_Allowance + Other_Capital_Adjustments + Reletting_Costs',
    marketValue: 'NOI / Capitalization_Rate',
    adjustedMarketValue: 'Market_Value - Capital_Adjustments',
    roundedValue: 'ROUND(Adjusted_Market_Value / 1000, 0) * 1000'
  };
}