// ESG-Weighted Comparable Sales Assessment Calculations

export interface SubjectPropertyData {
  id: string;
  address: string;
  propertyType: string;
  floorArea: number;
  landArea?: number;
  yearBuilt?: number;
  esgFeatures: {
    energyRating?: number;
    waterEfficiency?: number;
    wasteManagement?: number;
    sustainableMaterials?: number;
    greenCertifications?: string[];
  };
}

export interface PropertyAdjustment {
  factorName: string;
  adjustmentValue: number;
}

export interface ComparableSaleData {
  id: string;
  address: string;
  salePrice: number;
  saleDate: string;
  propertyType: string;
  floorArea: number;
  landArea?: number;
  yearBuilt?: number;
  adjustments: PropertyAdjustment[];
}

export interface ESGWeightedSalesInputs {
  subjectProperty: SubjectPropertyData;
  comparableSales: ComparableSaleData[];
}

export interface ComparableSaleResult {
  id: string;
  address: string;
  originalSalePrice: number;
  esgScore: number;
  weightFactor: number;
  adjustedFactorValues: { [key: string]: number };
  esgValue: number;
  weightedValue: number;
  normalizedValue: number;
  finalAdjustedPrice: number;
}

export interface ESGWeightedSalesResults {
  subjectProperty: SubjectPropertyData;
  comparableResults: ComparableSaleResult[];
  averageAdjustedPrice: number;
  priceRange: {
    minimum: number;
    maximum: number;
    median: number;
  };
  esgImpactAnalysis: {
    averageESGPremium: number;
    esgScoreRange: { min: number; max: number };
    weightFactorRange: { min: number; max: number };
  };
  recommendedValue: number;
}

/**
 * ESG weighting factors for different property adjustment categories
 * Each weight represents the ESG significance of that factor (0-1 scale)
 */
const ESG_WEIGHTS: { [key: string]: number } = {
  // Market factors - moderate ESG influence
  'Market (National and Regional)': 0.3,
  'Location': 0.4, // Location can significantly impact ESG (transport, amenities)
  
  // Property characteristics - high ESG influence  
  'Property': 0.5,
  'Architecture/Type of Construction': 0.7, // Design impacts energy efficiency
  'Fitout': 0.6, // Modern fitouts often include sustainable features
  'Structural Condition': 0.5, // Well-maintained properties often have better ESG
  
  // Site and sustainability - very high ESG influence
  'Plot Situation': 0.4,
  'Ecological Sustainability': 0.9, // Direct ESG factor
  
  // Financial and operational - moderate ESG influence
  'Profitability of building concept': 0.4,
  'Quality of property cashflow': 0.3,
  'Tenant and Occupier Situation': 0.5, // ESG-conscious tenants pay premiums
  
  // Growth and letting - moderate ESG influence
  'Rental Growth Potential/Value Growth Potential': 0.4,
  'Letting Prospects': 0.5, // ESG properties often have better letting prospects
  'Vacancy/Letting Situation': 0.4,
  
  // Operating expenses - high ESG influence
  'Recoverable and Non-Recoverable Operating Expenses': 0.7, // ESG properties often have lower operating costs
  
  // Alternative use - moderate ESG influence
  'Usability by their 3rd parties and/or Alternative Use': 0.4,
  'Exceptional Circumstances': 0.2, // Context-dependent
};

/**
 * Calculate ESG-weighted comparable sales assessment
 * 
 * This function implements a comprehensive ESG-enhanced sales comparison approach
 * that weights comparable sales based on their ESG alignment and applies 
 * sustainability-adjusted factors to determine property values.
 * 
 * @param inputs - Subject property and comparable sales data
 * @returns Comprehensive ESG-weighted valuation results
 */
export function calculateESGWeightedComparableSales(inputs: ESGWeightedSalesInputs): ESGWeightedSalesResults {
  // Input validation
  if (!inputs.subjectProperty) {
    throw new Error("Subject property data is required");
  }
  
  if (!inputs.comparableSales || inputs.comparableSales.length === 0) {
    throw new Error("At least one comparable sale is required");
  }

  const comparableResults: ComparableSaleResult[] = [];
  
  // Process each comparable sale
  for (const comparable of inputs.comparableSales) {
    if (comparable.salePrice <= 0) {
      throw new Error(`Sale price must be positive for comparable ${comparable.id}`);
    }

    // Step 1: Calculate ESG score for this comparable
    let esgValue = 0;
    const adjustedFactorValues: { [key: string]: number } = {};

    // Apply ESG weights to each adjustment factor
    for (const adjustment of comparable.adjustments) {
      const weight = ESG_WEIGHTS[adjustment.factorName] || 0.3; // Default weight if factor not found
      const adjustedFactorValue = adjustment.adjustmentValue * weight;
      adjustedFactorValues[adjustment.factorName] = adjustedFactorValue;
      esgValue += adjustedFactorValue;
    }

    // Step 2: Calculate ESG score (normalized to 0-100 scale)
    const esgScore = Math.max(0, Math.min(100, 50 + esgValue)); // Center around 50, clamp to 0-100

    // Step 3: Calculate weight factor based on ESG compliance (0.2 - 0.8 range)
    // Higher ESG scores get higher weights
    const normalizedESGScore = esgScore / 100; // Convert to 0-1 scale
    const weightFactor = 0.2 + (normalizedESGScore * 0.6); // Maps 0-1 to 0.2-0.8

    // Step 4: Calculate weighted value
    const weightedValue = (comparable.salePrice + esgValue) * weightFactor;

    comparableResults.push({
      id: comparable.id,
      address: comparable.address,
      originalSalePrice: comparable.salePrice,
      esgScore,
      weightFactor,
      adjustedFactorValues,
      esgValue,
      weightedValue,
      normalizedValue: 0, // Will be calculated in normalization step
      finalAdjustedPrice: 0, // Will be calculated after normalization
    });
  }

  // Step 5: Normalization
  // Calculate mean and standard deviation for normalization
  const weightedValues = comparableResults.map(r => r.weightedValue);
  const mean = weightedValues.reduce((sum, val) => sum + val, 0) / weightedValues.length;
  const variance = weightedValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / weightedValues.length;
  const standardDeviation = Math.sqrt(variance);

  // Apply normalization and calculate final adjusted prices
  for (const result of comparableResults) {
    // Z-score normalization, then scale to reasonable range around original price
    const zScore = standardDeviation > 0 ? (result.weightedValue - mean) / standardDeviation : 0;
    result.normalizedValue = zScore;
    
    // Step 6: Calculate final adjusted sale price
    // Base price + sum of factor adjustments + normalized ESG impact
    const factorSum = Object.values(result.adjustedFactorValues).reduce((sum, val) => sum + val, 0);
    const esgImpact = zScore * (result.originalSalePrice * 0.1); // ESG can impact up to 10% of property value
    result.finalAdjustedPrice = result.originalSalePrice + factorSum + esgImpact;
  }

  // Calculate summary statistics
  const finalPrices = comparableResults.map(r => r.finalAdjustedPrice);
  const averageAdjustedPrice = finalPrices.reduce((sum, price) => sum + price, 0) / finalPrices.length;
  
  const sortedPrices = [...finalPrices].sort((a, b) => a - b);
  const priceRange = {
    minimum: sortedPrices[0],
    maximum: sortedPrices[sortedPrices.length - 1],
    median: sortedPrices[Math.floor(sortedPrices.length / 2)],
  };

  // ESG impact analysis
  const esgScores = comparableResults.map(r => r.esgScore);
  const weightFactors = comparableResults.map(r => r.weightFactor);
  const originalPrices = comparableResults.map(r => r.originalSalePrice);
  const avgOriginalPrice = originalPrices.reduce((sum, price) => sum + price, 0) / originalPrices.length;
  
  const esgImpactAnalysis = {
    averageESGPremium: ((averageAdjustedPrice - avgOriginalPrice) / avgOriginalPrice) * 100,
    esgScoreRange: {
      min: Math.min(...esgScores),
      max: Math.max(...esgScores),
    },
    weightFactorRange: {
      min: Math.min(...weightFactors),
      max: Math.max(...weightFactors),
    },
  };

  // Recommended value (weighted average with higher confidence for better ESG scores)
  const weightedSum = comparableResults.reduce((sum, result) => {
    return sum + (result.finalAdjustedPrice * result.weightFactor);
  }, 0);
  const totalWeights = comparableResults.reduce((sum, result) => sum + result.weightFactor, 0);
  const recommendedValue = totalWeights > 0 ? weightedSum / totalWeights : averageAdjustedPrice;

  return {
    subjectProperty: inputs.subjectProperty,
    comparableResults,
    averageAdjustedPrice,
    priceRange,
    esgImpactAnalysis,
    recommendedValue,
  };
}

/**
 * Export calculation formulas for spreadsheet integration
 */
export function exportESGComparableSalesFormulas() {
  return {
    esgScore: 'MAX(0, MIN(100, 50 + ESG_Value))',
    weightFactor: '0.2 + (ESG_Score / 100) * 0.6',
    weightedValue: '(Sale_Price + ESG_Value) * Weight_Factor',
    normalization: '(Weighted_Value - AVERAGE(Weighted_Values)) / STDEV(Weighted_Values)',
    finalAdjustedPrice: 'Original_Price + SUM(Adjusted_Factor_Values) + (Z_Score * Original_Price * 0.1)',
    recommendedValue: 'SUMPRODUCT(Final_Adjusted_Prices, Weight_Factors) / SUM(Weight_Factors)',
    esgPremium: '((Average_Adjusted_Price - Average_Original_Price) / Average_Original_Price) * 100',
  };
}

/**
 * Get ESG weight for a specific factor
 */
export function getESGWeight(factorName: string): number {
  return ESG_WEIGHTS[factorName] || 0.3; // Default weight
}

/**
 * Get all available ESG factors and their weights
 */
export function getAllESGFactors(): { [key: string]: number } {
  return { ...ESG_WEIGHTS };
}