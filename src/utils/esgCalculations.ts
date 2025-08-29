import { PropertyData } from '../components/PropertyAssessmentForm';

export interface ESGScores {
  environmental: {
    energyEfficiency: number;
    waterConservation: number;
    wasteManagement: number;
    materialSustainability: number;
    overall: number;
  };
  social: {
    accessibility: number;
    healthWellbeing: number;
    communityEngagement: number;
    overall: number;
  };
  governance: {
    certifications: number;
    transparency: number;
    riskManagement: number;
    overall: number;
  };
  overallESGScore: number;
  riskRating: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
}

// Default weights for ESG components
export const DEFAULT_WEIGHTS = {
  environmental: {
    energyEfficiency: 0.4,
    waterConservation: 0.3,
    wasteManagement: 0.15,
    materialSustainability: 0.15
  },
  social: {
    accessibility: 0.4,
    healthWellbeing: 0.4,
    communityEngagement: 0.2
  },
  governance: {
    certifications: 0.4,
    transparency: 0.3,
    riskManagement: 0.3
  },
  overall: {
    environmental: 0.4,
    social: 0.3,
    governance: 0.3
  }
};

export function calculateESGScores(
  propertyData: PropertyData,
  weights = DEFAULT_WEIGHTS
): ESGScores {
  // Environmental Scores
  const energyEfficiency = calculateEnergyEfficiencyScore(
    propertyData.actualEnergyUse,
    propertyData.benchmarkEnergyUse
  );

  const waterConservation = calculateWaterConservationScore(
    propertyData.waterEfficientFixtures,
    propertyData.totalFixtures
  );

  const wasteManagement = calculateWasteManagementScore(
    propertyData.hasRecyclingProgram,
    propertyData.hasComposting
  );

  const materialSustainability = calculateMaterialSustainabilityScore(
    propertyData.sustainableMaterialsPercentage
  );

  const environmentalScore = 
    weights.environmental.energyEfficiency * energyEfficiency +
    weights.environmental.waterConservation * waterConservation +
    weights.environmental.wasteManagement * wasteManagement +
    weights.environmental.materialSustainability * materialSustainability;

  // Social Scores
  const accessibility = calculateAccessibilityScore(propertyData.meetsADAStandards);

  const healthWellbeing = calculateHealthWellbeingScore(
    propertyData.hasGoodAirQuality,
    propertyData.hasNaturalLight,
    propertyData.hasErgonomicDesign
  );

  const communityEngagement = calculateCommunityEngagementScore(
    propertyData.hasCommunitySpace,
    propertyData.hasLocalSourcing
  );

  const socialScore = 
    weights.social.accessibility * accessibility +
    weights.social.healthWellbeing * healthWellbeing +
    weights.social.communityEngagement * communityEngagement;

  // Governance Scores
  const certifications = calculateCertificationScore(propertyData.certifications);

  const transparency = calculateTransparencyScore(
    propertyData.esgDataPublic,
    propertyData.esgReportAvailable
  );

  const riskManagement = calculateRiskManagementScore(
    propertyData.riskManagementPractices,
    propertyData.totalPotentialPractices
  );

  const governanceScore = 
    weights.governance.certifications * certifications +
    weights.governance.transparency * transparency +
    weights.governance.riskManagement * riskManagement;

  // Overall ESG Score
  const overallESGScore = 
    weights.overall.environmental * environmentalScore +
    weights.overall.social * socialScore +
    weights.overall.governance * governanceScore;

  // Risk Rating Calculation
  const riskRating = calculateRiskRating(overallESGScore, propertyData);

  return {
    environmental: {
      energyEfficiency,
      waterConservation,
      wasteManagement,
      materialSustainability,
      overall: environmentalScore
    },
    social: {
      accessibility,
      healthWellbeing,
      communityEngagement,
      overall: socialScore
    },
    governance: {
      certifications,
      transparency,
      riskManagement,
      overall: governanceScore
    },
    overallESGScore,
    riskRating,
    riskLevel: getRiskLevel(riskRating)
  };
}

// Individual calculation functions
function calculateEnergyEfficiencyScore(actual: number, benchmark: number): number {
  if (benchmark === 0) return 3; // Default neutral score
  const efficiency = Math.max(0, (1 - (actual / benchmark)) * 5);
  return Math.min(5, Math.max(1, efficiency));
}

function calculateWaterConservationScore(efficient: number, total: number): number {
  if (total === 0) return 1;
  return Math.min(5, (efficient / total) * 5);
}

function calculateWasteManagementScore(hasRecycling: boolean, hasComposting: boolean): number {
  let score = 1;
  if (hasRecycling) score += 2;
  if (hasComposting) score += 2;
  return Math.min(5, score);
}

function calculateMaterialSustainabilityScore(percentage: number): number {
  return Math.min(5, (percentage / 100) * 5);
}

function calculateAccessibilityScore(adaCompliance: string): number {
  switch (adaCompliance) {
    case 'full': return 5;
    case 'partial': return 3;
    case 'none': return 1;
    default: return 1;
  }
}

function calculateHealthWellbeingScore(
  airQuality: boolean,
  naturalLight: boolean,
  ergonomic: boolean
): number {
  let score = 1;
  if (airQuality) score += 1.3;
  if (naturalLight) score += 1.3;
  if (ergonomic) score += 1.4;
  return Math.min(5, score);
}

function calculateCommunityEngagementScore(
  communitySpace: boolean,
  localSourcing: boolean
): number {
  let score = 1;
  if (communitySpace) score += 2;
  if (localSourcing) score += 2;
  return Math.min(5, score);
}

function calculateCertificationScore(certifications: string[]): number {
  if (certifications.includes('LEED')) return 5;
  if (certifications.includes('ENERGY STAR')) return 4;
  if (certifications.includes('Green Star') || certifications.includes('NABERS')) return 4;
  if (certifications.includes('BREEAM') || certifications.includes('Other')) return 3;
  return 1;
}

function calculateTransparencyScore(dataPublic: boolean, reportAvailable: boolean): number {
  if (dataPublic) return 5;
  if (reportAvailable) return 3;
  return 1;
}

function calculateRiskManagementScore(practices: number, totalPractices: number): number {
  if (totalPractices === 0) return 1;
  return Math.min(5, (practices / totalPractices) * 5);
}

function calculateRiskRating(esgScore: number, propertyData: PropertyData): number {
  // Base risk from ESG score (inverted - higher ESG = lower risk)
  const esgRiskFactor = 1 - (esgScore / 5);
  
  // Additional risk factors
  let additionalRiskFactors = 0;
  
  // Age factor (older buildings = higher risk)
  const currentYear = new Date().getFullYear();
  const age = currentYear - propertyData.yearBuilt;
  if (age > 30) additionalRiskFactors += 0.2;
  else if (age > 15) additionalRiskFactors += 0.1;
  
  // Energy inefficiency risk
  if (propertyData.benchmarkEnergyUse > 0 && 
      propertyData.actualEnergyUse > propertyData.benchmarkEnergyUse * 1.2) {
    additionalRiskFactors += 0.2;
  }
  
  // Certification risk (no certifications = higher risk)
  if (propertyData.certifications.length === 0) {
    additionalRiskFactors += 0.15;
  }
  
  // Combine risk factors
  const combinedRisk = esgRiskFactor + additionalRiskFactors;
  
  // Convert to 1-5 scale
  const riskRating = Math.min(5, Math.max(1, Math.round(combinedRisk * 4 + 1)));
  
  return riskRating;
}

function getRiskLevel(riskRating: number): 'Low' | 'Moderate' | 'High' {
  if (riskRating <= 2) return 'Low';
  if (riskRating <= 3) return 'Moderate';
  return 'High';
}

// Export functions for Excel integration
export function exportToExcelFormulas() {
  return {
    energyEfficiency: 'MAX(1, MIN(5, (1 - (Actual_Energy_Use / Benchmark_Energy_Use)) * 5))',
    waterConservation: 'MIN(5, (Water_Efficient_Fixtures / Total_Fixtures) * 5)',
    wasteManagement: 'MIN(5, IF(Has_Recycling, 3, 1) + IF(Has_Composting, 2, 0))',
    materialSustainability: 'MIN(5, (Sustainable_Materials_Percentage / 100) * 5)',
    accessibility: 'IF(ADA_Standards="Full", 5, IF(ADA_Standards="Partial", 3, 1))',
    healthWellbeing: 'MIN(5, 1 + IF(Good_Air_Quality, 1.3, 0) + IF(Natural_Light, 1.3, 0) + IF(Ergonomic_Design, 1.4, 0))',
    communityEngagement: 'MIN(5, 1 + IF(Community_Space, 2, 0) + IF(Local_Sourcing, 2, 0))',
    certifications: 'IF(Has_LEED, 5, IF(Has_Energy_Star, 4, IF(OR(Has_Green_Star, Has_NABERS), 4, IF(OR(Has_BREEAM, Has_Other), 3, 1))))',
    transparency: 'IF(ESG_Data_Public, 5, IF(ESG_Report_Available, 3, 1))',
    riskManagement: 'MIN(5, (Risk_Management_Practices / Total_Potential_Practices) * 5)',
    overallESGScore: '(Environmental_Weight * Environmental_Score + Social_Weight * Social_Score + Governance_Weight * Governance_Score)',
    riskRating: 'MIN(5, MAX(1, ROUND((1 - (Overall_ESG_Score / 5) + Additional_Risk_Factors) * 4 + 1, 0)))'
  };
}