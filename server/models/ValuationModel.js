/**
 * Delorenzo Property Group - Valuation MongoDB Models
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Comprehensive MongoDB models for property valuation analysis
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// Base valuation schema with common fields
const BaseValuationSchema = new mongoose.Schema({
  // Property Information
  propertyName: {
    type: String,
    required: true,
    trim: true
  },
  propertyLocation: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: [
      'residential', 'commercial', 'industrial', 'retail', 'office', 
      'hospitality', 'childcare', 'petrol-station', 'stadium', 
      'agricultural', 'mixed-use', 'other'
    ]
  },
  
  // Valuation Metadata
  valuationType: {
    type: String,
    required: true,
    enum: [
      'ary', 'esg-ary', 'capitalization-sensitivity', 'net-income',
      'esg-capitalization', 'esg-comparable-sales', 'cap-net-income',
      'summation', 'direct-comparison', 'hypothetical-development',
      'hospitality', 'childcare', 'comprehensive-esg', 'petrol-station',
      'deferred-management', 'dcf', 'stadium'
    ]
  },
  
  // User and Session Information
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
    default: 'draft'
  },
  
  // Results
  results: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Inputs
  inputs: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // ESG Information
  esgIncluded: {
    type: Boolean,
    default: false
  },
  esgFactor: {
    type: Number,
    default: 0
  },
  
  // Calculation Metadata
  calculationVersion: {
    type: String,
    default: '1.0.0'
  },
  calculationMethod: {
    type: String,
    required: true
  },
  
  // Export and Sharing
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: String,
    permission: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    }
  }],
  
  // Tags and Categories
  tags: [String],
  category: String,
  
  // Notes and Comments
  notes: String,
  comments: [{
    userId: String,
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  collection: 'valuations'
});

// Indexes for better performance
BaseValuationSchema.index({ userId: 1, createdAt: -1 });
BaseValuationSchema.index({ valuationType: 1, status: 1 });
BaseValuationSchema.index({ propertyType: 1, createdAt: -1 });
BaseValuationSchema.index({ 'results.marketValue': 1 });
BaseValuationSchema.index({ esgIncluded: 1, esgFactor: 1 });
BaseValuationSchema.index({ tags: 1 });
BaseValuationSchema.index({ createdAt: -1 });

// Pre-save middleware
BaseValuationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ARY (All Risks Yield) specific schema
const ARYSchema = new mongoose.Schema({
  // Risk-free rate
  riskFreeRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Risk premiums
  liquidityRisk: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  managementRisk: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  marketRisk: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  specificRisk: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // ESG adjustments
  esgAdjustment: {
    type: Number,
    default: 0,
    min: -100,
    max: 100
  },
  
  // Calculated results
  calculatedARY: {
    type: Number,
    required: true
  },
  adjustedARY: {
    type: Number,
    required: true
  },
  
  // Market context
  marketConditions: {
    type: String,
    enum: ['bull', 'bear', 'stable', 'volatile'],
    default: 'stable'
  }
});

// ESG Valuation specific schema
const ESGSchema = new mongoose.Schema({
  // Environmental factors
  environmentalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  environmentalWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  
  // Social factors
  socialScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  socialWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  
  // Governance factors
  governanceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  governanceWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  
  // Overall ESG metrics
  overallESGScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  esgRiskPremium: {
    type: Number,
    required: true
  },
  esgAdjustedCapRate: {
    type: Number,
    required: true
  }
});

// Capitalization Sensitivity schema
const CapitalizationSensitivitySchema = new mongoose.Schema({
  // Base inputs
  netOperatingIncome: {
    type: Number,
    required: true,
    min: 0
  },
  baseCapRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Sensitivity ranges
  capRateRange: {
    optimistic: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    realistic: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    pessimistic: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  
  // Calculated values
  calculatedValues: {
    optimistic: {
      type: Number,
      required: true
    },
    realistic: {
      type: Number,
      required: true
    },
    pessimistic: {
      type: Number,
      required: true
    }
  },
  
  // Sensitivity metrics
  valueRange: {
    low: {
      type: Number,
      required: true
    },
    high: {
      type: Number,
      required: true
    },
    range: {
      type: Number,
      required: true
    }
  }
});

// DCF Analysis schema
const DCFSchema = new mongoose.Schema({
  // Investment parameters
  initialInvestment: {
    type: Number,
    required: true,
    min: 0
  },
  discountRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Cash flows
  cashFlows: [{
    year: {
      type: Number,
      required: true
    },
    cashFlow: {
      type: Number,
      required: true
    },
    presentValue: {
      type: Number,
      required: true
    }
  }],
  
  // Terminal value
  terminalValue: {
    type: Number,
    required: true
  },
  
  // Calculated metrics
  netPresentValue: {
    type: Number,
    required: true
  },
  internalRateOfReturn: {
    type: Number,
    required: true
  },
  profitabilityIndex: {
    type: Number,
    required: true
  },
  paybackPeriod: {
    type: Number,
    required: true
  }
});

// Comparable Sales schema
const ComparableSalesSchema = new mongoose.Schema({
  // Subject property
  subjectProperty: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    area: {
      type: Number,
      required: true,
      min: 0
    }
  },
  
  // Comparable properties
  comparables: [{
    property: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    saleDate: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    pricePerSqm: {
      type: Number,
      required: true,
      min: 0
    },
    adjustedPrice: {
      type: Number,
      required: true,
      min: 0
    },
    adjustments: {
      location: {
        type: Number,
        default: 0
      },
      condition: {
        type: Number,
        default: 0
      },
      size: {
        type: Number,
        default: 0
      },
      timing: {
        type: Number,
        default: 0
      },
      esg: {
        type: Number,
        default: 0
      }
    }
  }],
  
  // Valuation results
  valuation: {
    comparablesCount: {
      type: Number,
      required: true,
      min: 1
    },
    averagePricePerSqm: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedValue: {
      type: Number,
      required: true,
      min: 0
    },
    valueRange: {
      low: {
        type: Number,
        required: true,
        min: 0
      },
      high: {
        type: Number,
        required: true,
        min: 0
      }
    }
  }
});

// Stadium Valuation schema
const StadiumValuationSchema = new mongoose.Schema({
  // Stadium details
  stadiumName: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  siteAreaSqm: {
    type: Number,
    required: true,
    min: 0
  },
  landValue: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Revenue projections
  revenueProjections: {
    ticketSales: [Number],
    sponsorships: [Number],
    broadcasting: [Number],
    concessions: [Number],
    luxurySuites: [Number],
    customRevenue: [Number]
  },
  
  // Expense projections
  expenseProjections: {
    maintenance: [Number],
    staffing: [Number],
    security: [Number],
    utilities: [Number],
    upkeep: [Number],
    customExpenses: [Number]
  },
  
  // Capital expenditures
  capitalExpenditures: {
    majorRepairs: [Number],
    structuralMaintenance: [Number],
    lettingUpAllowances: [Number],
    capitalImprovements: [Number],
    customCapital: [Number]
  },
  
  // Calculated results
  totalStadiumValue: {
    type: Number,
    required: true,
    min: 0
  },
  presentValueCashFlows: {
    type: Number,
    required: true
  },
  terminalValue: {
    type: Number,
    required: true
  },
  
  // Forecast parameters
  forecastYears: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  }
});

// Create the main Valuation model
const Valuation = mongoose.model('Valuation', BaseValuationSchema);

// Create specialized models for different valuation types
const ARYValuation = mongoose.model('ARYValuation', ARYSchema);
const ESGValuation = mongoose.model('ESGValuation', ESGSchema);
const CapitalizationSensitivityValuation = mongoose.model('CapitalizationSensitivityValuation', CapitalizationSensitivitySchema);
const DCFValuation = mongoose.model('DCFValuation', DCFSchema);
const ComparableSalesValuation = mongoose.model('ComparableSalesValuation', ComparableSalesSchema);
const StadiumValuation = mongoose.model('StadiumValuation', StadiumValuationSchema);

module.exports = {
  Valuation,
  ARYValuation,
  ESGValuation,
  CapitalizationSensitivityValuation,
  DCFValuation,
  ComparableSalesValuation,
  StadiumValuation
};
