export interface ESGFactor {
  id: string;
  name: string;
  description: string;
  category: 'environmental' | 'social' | 'governance';
  score: number; // 0-1 scale (0 = poor, 1 = excellent)
  weight: number; // 0-1 scale for importance
  impact_range: number; // maximum impact percentage (e.g., 0.05 for 5%)
}

export interface ComprehensiveESGInputs {
  factors: ESGFactor[];
  use_weighted_scoring: boolean;
  property_type: string;
  location: string;
  building_age: number;
}

export interface ComprehensiveESGResults {
  environmental_score: number;
  social_score: number;
  governance_score: number;
  overall_esg_score: number;
  valuation_adjustment: number;
  category_adjustments: {
    environmental: number;
    social: number;
    governance: number;
  };
  factor_details: ESGFactor[];
  confidence_level: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export const defaultESGFactors: ESGFactor[] = [
  // Environmental Factors (E)
  {
    id: 'energy_efficiency',
    name: 'Energy Efficiency',
    description: 'LED lighting, efficient HVAC, insulation systems',
    category: 'environmental',
    score: 0.5,
    weight: 0.2,
    impact_range: 0.05
  },
  {
    id: 'renewable_energy',
    name: 'Renewable Energy',
    description: 'Solar panels, wind power, renewable energy contracts',
    category: 'environmental',
    score: 0.5,
    weight: 0.15,
    impact_range: 0.04
  },
  {
    id: 'water_conservation',
    name: 'Water Conservation',
    description: 'Low-flow fixtures, rainwater harvesting, efficient systems',
    category: 'environmental',
    score: 0.5,
    weight: 0.1,
    impact_range: 0.02
  },
  {
    id: 'green_certifications',
    name: 'Green Certifications',
    description: 'LEED, BREEAM, WELL, Green Star certifications',
    category: 'environmental',
    score: 0.5,
    weight: 0.2,
    impact_range: 0.06
  },
  {
    id: 'waste_management',
    name: 'Waste Management',
    description: 'Recycling programs, waste reduction initiatives',
    category: 'environmental',
    score: 0.5,
    weight: 0.05,
    impact_range: 0.015
  },
  
  // Social Factors (S)
  {
    id: 'community_impact',
    name: 'Community Engagement',
    description: 'Local community projects, social initiatives',
    category: 'social',
    score: 0.5,
    weight: 0.15,
    impact_range: 0.03
  },
  {
    id: 'wellbeing_amenities',
    name: 'Tenant/Resident Wellbeing',
    description: 'Indoor air quality, natural lighting, wellness amenities',
    category: 'social',
    score: 0.5,
    weight: 0.2,
    impact_range: 0.04
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    description: 'ADA compliance, transport links, universal design',
    category: 'social',
    score: 0.5,
    weight: 0.05,
    impact_range: 0.02
  },
  {
    id: 'workforce_conditions',
    name: 'Workforce Conditions',
    description: 'Fair wages, safe working environment, staff facilities',
    category: 'social',
    score: 0.5,
    weight: 0.05,
    impact_range: 0.015
  },
  
  // Governance Factors (G)
  {
    id: 'transparent_ownership',
    name: 'Transparent Ownership',
    description: 'Clear ownership structure, regulatory compliance',
    category: 'governance',
    score: 0.5,
    weight: 0.1,
    impact_range: 0.025
  },
  {
    id: 'maintenance_management',
    name: 'Maintenance & Management',
    description: 'Active property management, preventative maintenance',
    category: 'governance',
    score: 0.5,
    weight: 0.2,
    impact_range: 0.035
  },
  {
    id: 'regulatory_compliance',
    name: 'Regulatory Compliance',
    description: 'Building codes, safety standards, permit compliance',
    category: 'governance',
    score: 0.5,
    weight: 0.05,
    impact_range: 0.02
  },
  {
    id: 'data_security',
    name: 'Data Security & Privacy',
    description: 'Tenant data protection, cybersecurity measures',
    category: 'governance',
    score: 0.5,
    weight: 0.05,
    impact_range: 0.01
  }
];

export function calculateComprehensiveESG(inputs: ComprehensiveESGInputs): ComprehensiveESGResults {
  const factors = inputs.factors;
  
  // Calculate category scores
  const environmentalFactors = factors.filter(f => f.category === 'environmental');
  const socialFactors = factors.filter(f => f.category === 'social');
  const governanceFactors = factors.filter(f => f.category === 'governance');
  
  const environmental_score = calculateCategoryScore(environmentalFactors, inputs.use_weighted_scoring);
  const social_score = calculateCategoryScore(socialFactors, inputs.use_weighted_scoring);
  const governance_score = calculateCategoryScore(governanceFactors, inputs.use_weighted_scoring);
  
  // Calculate overall ESG score (weighted average of categories)
  const category_weights = { environmental: 0.4, social: 0.35, governance: 0.25 };
  const overall_esg_score = 
    (environmental_score * category_weights.environmental) +
    (social_score * category_weights.social) +
    (governance_score * category_weights.governance);
  
  // Calculate valuation adjustments
  const category_adjustments = {
    environmental: calculateCategoryAdjustment(environmentalFactors, inputs.use_weighted_scoring),
    social: calculateCategoryAdjustment(socialFactors, inputs.use_weighted_scoring),
    governance: calculateCategoryAdjustment(governanceFactors, inputs.use_weighted_scoring)
  };
  
  const valuation_adjustment = 
    category_adjustments.environmental + 
    category_adjustments.social + 
    category_adjustments.governance;
  
  // Determine confidence level
  const active_factors = factors.filter(f => f.score !== 0.5).length;
  const confidence_level = active_factors >= 10 ? 'high' : active_factors >= 6 ? 'medium' : 'low';
  
  // Generate recommendations
  const recommendations = generateRecommendations(factors, inputs.property_type);
  
  return {
    environmental_score,
    social_score,
    governance_score,
    overall_esg_score,
    valuation_adjustment,
    category_adjustments,
    factor_details: factors,
    confidence_level,
    recommendations
  };
}

function calculateCategoryScore(factors: ESGFactor[], use_weighted: boolean): number {
  if (factors.length === 0) return 0;
  
  if (use_weighted) {
    const total_weight = factors.reduce((sum, f) => sum + f.weight, 0);
    if (total_weight === 0) return 0;
    return factors.reduce((sum, f) => sum + (f.score * f.weight), 0) / total_weight;
  } else {
    return factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
  }
}

function calculateCategoryAdjustment(factors: ESGFactor[], use_weighted: boolean): number {
  return factors.reduce((total, factor) => {
    // Convert score (0-1) to impact percentage (-impact_range to +impact_range)
    const impact_percent = (factor.score - 0.5) * 2 * factor.impact_range;
    const weight_multiplier = use_weighted ? factor.weight : 1 / factors.length;
    return total + (impact_percent * weight_multiplier);
  }, 0);
}

function generateRecommendations(factors: ESGFactor[], property_type: string): string[] {
  const recommendations: string[] = [];
  
  // Find low-scoring factors
  const low_performing = factors.filter(f => f.score < 0.4);
  const high_impact_low = low_performing.filter(f => f.impact_range > 0.03);
  
  if (high_impact_low.length > 0) {
    recommendations.push(`Focus on improving ${high_impact_low[0].name} - has high impact on valuation`);
  }
  
  // Environmental recommendations
  const energy_factor = factors.find(f => f.id === 'energy_efficiency');
  if (energy_factor && energy_factor.score < 0.6) {
    recommendations.push('Consider energy efficiency upgrades (LED lighting, HVAC optimization)');
  }
  
  const cert_factor = factors.find(f => f.id === 'green_certifications');
  if (cert_factor && cert_factor.score < 0.3) {
    recommendations.push('Pursue green building certifications (LEED, BREEAM) for market premium');
  }
  
  // Social recommendations
  const wellbeing_factor = factors.find(f => f.id === 'wellbeing_amenities');
  if (wellbeing_factor && wellbeing_factor.score < 0.5) {
    recommendations.push('Enhance tenant amenities and indoor environmental quality');
  }
  
  // Governance recommendations
  const maintenance_factor = factors.find(f => f.id === 'maintenance_management');
  if (maintenance_factor && maintenance_factor.score < 0.6) {
    recommendations.push('Implement proactive maintenance management systems');
  }
  
  // Property-specific recommendations
  if (property_type.toLowerCase().includes('office')) {
    recommendations.push('Consider flexible workspace designs and smart building technologies');
  } else if (property_type.toLowerCase().includes('residential')) {
    recommendations.push('Focus on community amenities and sustainable living features');
  }
  
  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}

export function exportESGChecklist(results: ComprehensiveESGResults): string {
  const checklist = `
ESG FACTORS ASSESSMENT REPORT
=====================================

OVERALL SCORES:
- Environmental: ${(results.environmental_score * 100).toFixed(1)}%
- Social: ${(results.social_score * 100).toFixed(1)}%
- Governance: ${(results.governance_score * 100).toFixed(1)}%
- Overall ESG: ${(results.overall_esg_score * 100).toFixed(1)}%

VALUATION IMPACT:
- Total Adjustment: ${(results.valuation_adjustment * 100).toFixed(2)}%
- Environmental: ${(results.category_adjustments.environmental * 100).toFixed(2)}%
- Social: ${(results.category_adjustments.social * 100).toFixed(2)}%
- Governance: ${(results.category_adjustments.governance * 100).toFixed(2)}%

FACTOR BREAKDOWN:
${results.factor_details.map(f => 
  `- ${f.name}: Score ${(f.score * 100).toFixed(0)}%, Weight ${(f.weight * 100).toFixed(0)}%, Impact ±${(f.impact_range * 100).toFixed(1)}%`
).join('\n')}

RECOMMENDATIONS:
${results.recommendations.map(r => `• ${r}`).join('\n')}

Confidence Level: ${results.confidence_level.toUpperCase()}
Generated: ${new Date().toLocaleString()}
`;
  
  return checklist;
}

export const defaultComprehensiveESGInputs: ComprehensiveESGInputs = {
  factors: defaultESGFactors,
  use_weighted_scoring: true,
  property_type: 'Commercial Office',
  location: 'Brisbane, QLD',
  building_age: 10
};