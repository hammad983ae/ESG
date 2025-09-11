#!/usr/bin/env node

/**
 * Delorenzo Property Group - Database Seeding Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Script to seed the database with sample valuation data
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Valuation } = require('../models/ValuationModel');

// Sample valuation data
const sampleValuations = [
  {
    propertyName: "Commercial Office Building - 123 Collins Street",
    propertyLocation: "Melbourne, VIC 3000",
    propertyType: "commercial",
    valuationType: "ary",
    userId: "user_001",
    sessionId: "session_001",
    status: "completed",
    esgIncluded: true,
    esgFactor: 0.05,
    calculationMethod: "All Risks Yield Analysis",
    results: {
      marketValue: 15000000,
      calculatedARY: 6.5,
      adjustedARY: 6.8,
      riskFreeRate: 3.2,
      totalRiskPremium: 3.6,
      esgAdjustment: 0.3
    },
    inputs: {
      riskFreeRate: 3.2,
      liquidityRisk: 0.8,
      managementRisk: 1.2,
      marketRisk: 1.0,
      specificRisk: 0.6,
      esgAdjustment: 0.3
    },
    tags: ["commercial", "office", "melbourne", "high-value"],
    notes: "Prime CBD location with excellent ESG credentials"
  },
  {
    propertyName: "Residential Apartment Complex - 456 Bourke Street",
    propertyLocation: "Melbourne, VIC 3000",
    propertyType: "residential",
    valuationType: "esg-ary",
    userId: "user_001",
    sessionId: "session_002",
    status: "completed",
    esgIncluded: true,
    esgFactor: -0.02,
    calculationMethod: "ESG-Adjusted All Risks Yield",
    results: {
      marketValue: 8500000,
      calculatedARY: 5.8,
      adjustedARY: 5.7,
      esgScore: 85,
      esgRiskPremium: -0.1,
      environmentalScore: 90,
      socialScore: 80,
      governanceScore: 85
    },
    inputs: {
      riskFreeRate: 3.2,
      liquidityRisk: 0.5,
      managementRisk: 0.8,
      marketRisk: 1.2,
      specificRisk: 0.3,
      environmentalScore: 90,
      socialScore: 80,
      governanceScore: 85,
      environmentalWeight: 0.4,
      socialWeight: 0.3,
      governanceWeight: 0.3
    },
    tags: ["residential", "apartment", "melbourne", "esg-positive"],
    notes: "Green building with excellent sustainability features"
  },
  {
    propertyName: "Industrial Warehouse - 789 Industrial Drive",
    propertyLocation: "Dandenong, VIC 3175",
    propertyType: "industrial",
    valuationType: "capitalization-sensitivity",
    userId: "user_002",
    sessionId: "session_003",
    status: "completed",
    esgIncluded: false,
    esgFactor: 0,
    calculationMethod: "Capitalization Rate Sensitivity Analysis",
    results: {
      optimisticValue: 12000000,
      realisticValue: 10000000,
      pessimisticValue: 8000000,
      valueRange: {
        low: 8000000,
        high: 12000000,
        range: 4000000
      }
    },
    inputs: {
      netOperatingIncome: 800000,
      baseCapRate: 8.0,
      capRateRange: {
        optimistic: 6.5,
        realistic: 8.0,
        pessimistic: 10.0
      }
    },
    tags: ["industrial", "warehouse", "dandenong", "sensitivity-analysis"],
    notes: "Large industrial facility with good access to transport"
  },
  {
    propertyName: "Retail Shopping Center - 321 Chapel Street",
    propertyLocation: "South Yarra, VIC 3141",
    propertyType: "retail",
    valuationType: "dcf",
    userId: "user_003",
    sessionId: "session_004",
    status: "completed",
    esgIncluded: true,
    esgFactor: 0.03,
    calculationMethod: "Discounted Cash Flow Analysis",
    results: {
      netPresentValue: 2500000,
      internalRateOfReturn: 12.5,
      profitabilityIndex: 1.25,
      paybackPeriod: 6.8
    },
    inputs: {
      initialInvestment: 20000000,
      discountRate: 10.0,
      cashFlows: [1500000, 1800000, 2100000, 2400000, 2700000, 3000000, 3200000, 3400000, 3600000, 3800000]
    },
    tags: ["retail", "shopping-center", "south-yarra", "dcf-analysis"],
    notes: "Prime retail location with strong foot traffic"
  },
  {
    propertyName: "Hospitality Hotel - 654 Collins Street",
    propertyLocation: "Melbourne, VIC 3000",
    propertyType: "hospitality",
    valuationType: "hospitality",
    userId: "user_004",
    sessionId: "session_005",
    status: "completed",
    esgIncluded: true,
    esgFactor: 0.08,
    calculationMethod: "Hospitality Valuation - Multiple Approaches",
    results: {
      incomeApproach: 45000000,
      grossIncomeMultiplier: 42000000,
      perUnitValuation: 44000000,
      revenueMultiplier: 43000000,
      replacementCost: 46000000,
      finalValue: 44000000
    },
    inputs: {
      netOperatingIncome: 3600000,
      grossIncome: 7200000,
      roomCount: 200,
      averageRoomRate: 250,
      occupancyRate: 0.75,
      replacementCost: 46000000
    },
    tags: ["hospitality", "hotel", "melbourne", "multi-approach"],
    notes: "Luxury hotel with excellent ESG credentials and premium location"
  },
  {
    propertyName: "Childcare Facility - 987 High Street",
    propertyLocation: "Armadale, VIC 3143",
    propertyType: "childcare",
    valuationType: "childcare",
    userId: "user_005",
    sessionId: "session_006",
    status: "completed",
    esgIncluded: true,
    esgFactor: 0.12,
    calculationMethod: "Childcare Valuation - Specialized Approaches",
    results: {
      lcdApproach: 3200000,
      comparisonApproach: 3100000,
      rentBasedApproach: 3300000,
      finalValue: 3200000
    },
    inputs: {
      landValue: 800000,
      constructionCost: 2000000,
      developmentCost: 400000,
      comparableSales: [
        { price: 3000000, pricePerSqm: 15000 },
        { price: 3200000, pricePerSqm: 16000 },
        { price: 3100000, pricePerSqm: 15500 }
      ],
      annualRent: 240000,
      capRate: 7.5
    },
    tags: ["childcare", "armadale", "specialized", "esg-positive"],
    notes: "Modern childcare facility with excellent sustainability features"
  },
  {
    propertyName: "Petrol Station - 147 Princes Highway",
    propertyLocation: "Dandenong, VIC 3175",
    propertyType: "petrol-station",
    valuationType: "petrol-station",
    userId: "user_006",
    sessionId: "session_007",
    status: "completed",
    esgIncluded: false,
    esgFactor: 0,
    calculationMethod: "Petrol Station Valuation - Six Methods",
    results: {
      incomeMethod: 1800000,
      salesComparison: 1750000,
      landAssetValue: 1700000,
      replacementCost: 1850000,
      rentApproach: 1820000,
      industryMultiplier: 1780000,
      finalValue: 1800000
    },
    inputs: {
      netOperatingIncome: 180000,
      capRate: 10.0,
      pumpCount: 8,
      siteArea: 2000,
      buildingArea: 200,
      comparableSales: [
        { price: 1700000, pricePerPump: 212500 },
        { price: 1800000, pricePerPump: 225000 },
        { price: 1750000, pricePerPump: 218750 }
      ]
    },
    tags: ["petrol-station", "dandenong", "six-methods", "fuel-retail"],
    notes: "Well-located service station with good access and visibility"
  },
  {
    propertyName: "Sports Stadium - Olympic Park",
    propertyLocation: "Melbourne, VIC 3000",
    propertyType: "stadium",
    valuationType: "stadium",
    userId: "user_007",
    sessionId: "session_008",
    status: "completed",
    esgIncluded: true,
    esgFactor: 0.05,
    calculationMethod: "Stadium Valuation - Revenue Projections",
    results: {
      totalStadiumValue: 450000000,
      presentValueCashFlows: 300000000,
      terminalValue: 150000000,
      valuePerSeat: 9000
    },
    inputs: {
      stadiumName: "Olympic Park Stadium",
      capacity: 50000,
      siteAreaSqm: 200000,
      landValue: 100000000,
      forecastYears: 20,
      revenueProjections: {
        ticketSales: [25000000, 26250000, 27562500, 28940625, 30387656],
        sponsorships: [15000000, 15750000, 16537500, 17364375, 18232594],
        broadcasting: [20000000, 21000000, 22050000, 23152500, 24310125],
        concessions: [5000000, 5250000, 5512500, 5788125, 6077531],
        luxurySuites: [8000000, 8400000, 8820000, 9261000, 9724050]
      }
    },
    tags: ["stadium", "sports", "melbourne", "revenue-projections"],
    notes: "Major sports venue with multiple revenue streams and ESG initiatives"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/valuation_db';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Valuation.deleteMany({});
    console.log('🗑️ Cleared existing valuation data');

    // Insert sample data
    const createdValuations = await Valuation.insertMany(sampleValuations);
    console.log(`✅ Created ${createdValuations.length} sample valuations`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`- Total valuations: ${createdValuations.length}`);
    
    const typeCounts = createdValuations.reduce((acc, val) => {
      acc[val.valuationType] = (acc[val.valuationType] || 0) + 1;
      return acc;
    }, {});
    
    console.log('- By valuation type:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    const propertyTypeCounts = createdValuations.reduce((acc, val) => {
      acc[val.propertyType] = (acc[val.propertyType] || 0) + 1;
      return acc;
    }, {});
    
    console.log('- By property type:');
    Object.entries(propertyTypeCounts).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    const esgCount = createdValuations.filter(v => v.esgIncluded).length;
    console.log(`- ESG-enabled valuations: ${esgCount}`);

    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase, sampleValuations };
