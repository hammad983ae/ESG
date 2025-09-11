/**
 * Delorenzo Property Group - Valuation API Tests
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Unit and integration tests for valuation API endpoints
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const valuationApp = require('../app');
const { Valuation } = require('../models/ValuationModel');

describe('Valuation API', () => {
  let app;
  let testUserId = 'test_user_001';
  let testSessionId = 'test_session_001';

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/valuation_test_db';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    app = valuationApp.getApp();
  });

  afterAll(async () => {
    // Clean up test database
    await Valuation.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear test data before each test
    await Valuation.deleteMany({});
  });

  describe('POST /api/valuations', () => {
    it('should create a new ARY valuation', async () => {
      const valuationData = {
        propertyName: 'Test Commercial Building',
        propertyLocation: 'Melbourne, VIC 3000',
        propertyType: 'commercial',
        valuationType: 'ary',
        userId: testUserId,
        sessionId: testSessionId,
        results: {
          marketValue: 10000000,
          calculatedARY: 6.5
        },
        inputs: {
          riskFreeRate: 3.2,
          liquidityRisk: 0.8,
          managementRisk: 1.2,
          marketRisk: 1.0,
          specificRisk: 0.6
        },
        calculationMethod: 'All Risks Yield Analysis'
      };

      const response = await request(app)
        .post('/api/valuations')
        .send(valuationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propertyName).toBe(valuationData.propertyName);
      expect(response.body.data.valuationType).toBe('ary');
      expect(response.body.data.userId).toBe(testUserId);
    });

    it('should create a new ESG valuation', async () => {
      const valuationData = {
        propertyName: 'Test ESG Building',
        propertyLocation: 'Sydney, NSW 2000',
        propertyType: 'commercial',
        valuationType: 'esg-ary',
        userId: testUserId,
        sessionId: testSessionId,
        esgIncluded: true,
        esgFactor: 0.05,
        results: {
          marketValue: 12000000,
          calculatedARY: 6.0,
          adjustedARY: 6.3,
          esgScore: 85
        },
        inputs: {
          riskFreeRate: 3.2,
          environmentalScore: 90,
          socialScore: 80,
          governanceScore: 85
        },
        calculationMethod: 'ESG-Adjusted All Risks Yield'
      };

      const response = await request(app)
        .post('/api/valuations')
        .send(valuationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.esgIncluded).toBe(true);
      expect(response.body.data.esgFactor).toBe(0.05);
    });

    it('should reject invalid valuation data', async () => {
      const invalidData = {
        propertyName: '', // Invalid: empty name
        propertyType: 'invalid-type', // Invalid: unsupported type
        valuationType: 'invalid-valuation' // Invalid: unsupported type
      };

      const response = await request(app)
        .post('/api/valuations')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });
  });

  describe('GET /api/valuations', () => {
    beforeEach(async () => {
      // Create test valuations
      const valuations = [
        {
          propertyName: 'Building 1',
          propertyLocation: 'Melbourne, VIC',
          propertyType: 'commercial',
          valuationType: 'ary',
          userId: testUserId,
          sessionId: testSessionId,
          results: { marketValue: 1000000 },
          inputs: { riskFreeRate: 3.2 },
          calculationMethod: 'ARY'
        },
        {
          propertyName: 'Building 2',
          propertyLocation: 'Sydney, NSW',
          propertyType: 'residential',
          valuationType: 'esg-ary',
          userId: testUserId,
          sessionId: testSessionId,
          esgIncluded: true,
          results: { marketValue: 2000000 },
          inputs: { riskFreeRate: 3.2 },
          calculationMethod: 'ESG-ARY'
        }
      ];

      await Valuation.insertMany(valuations);
    });

    it('should get all valuations for a user', async () => {
      const response = await request(app)
        .get('/api/valuations')
        .query({ userId: testUserId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter valuations by type', async () => {
      const response = await request(app)
        .get('/api/valuations')
        .query({ 
          userId: testUserId,
          valuationType: 'ary'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].valuationType).toBe('ary');
    });

    it('should filter valuations by property type', async () => {
      const response = await request(app)
        .get('/api/valuations')
        .query({ 
          userId: testUserId,
          propertyType: 'residential'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].propertyType).toBe('residential');
    });

    it('should filter ESG-enabled valuations', async () => {
      const response = await request(app)
        .get('/api/valuations')
        .query({ 
          userId: testUserId,
          esgIncluded: 'true'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].esgIncluded).toBe(true);
    });
  });

  describe('GET /api/valuations/:id', () => {
    let testValuation;

    beforeEach(async () => {
      testValuation = new Valuation({
        propertyName: 'Test Building',
        propertyLocation: 'Melbourne, VIC',
        propertyType: 'commercial',
        valuationType: 'ary',
        userId: testUserId,
        sessionId: testSessionId,
        results: { marketValue: 1000000 },
        inputs: { riskFreeRate: 3.2 },
        calculationMethod: 'ARY'
      });
      await testValuation.save();
    });

    it('should get valuation by ID', async () => {
      const response = await request(app)
        .get(`/api/valuations/${testValuation._id}`)
        .query({ userId: testUserId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testValuation._id.toString());
      expect(response.body.data.propertyName).toBe('Test Building');
    });

    it('should return 404 for non-existent valuation', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/valuations/${fakeId}`)
        .query({ userId: testUserId })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/valuations/:id', () => {
    let testValuation;

    beforeEach(async () => {
      testValuation = new Valuation({
        propertyName: 'Test Building',
        propertyLocation: 'Melbourne, VIC',
        propertyType: 'commercial',
        valuationType: 'ary',
        userId: testUserId,
        sessionId: testSessionId,
        results: { marketValue: 1000000 },
        inputs: { riskFreeRate: 3.2 },
        calculationMethod: 'ARY'
      });
      await testValuation.save();
    });

    it('should update valuation', async () => {
      const updateData = {
        propertyName: 'Updated Building Name',
        notes: 'Updated notes',
        userId: testUserId
      };

      const response = await request(app)
        .put(`/api/valuations/${testValuation._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propertyName).toBe('Updated Building Name');
      expect(response.body.data.notes).toBe('Updated notes');
    });

    it('should reject update for non-existent valuation', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/valuations/${fakeId}`)
        .send({ propertyName: 'Updated', userId: testUserId })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/valuations/:id', () => {
    let testValuation;

    beforeEach(async () => {
      testValuation = new Valuation({
        propertyName: 'Test Building',
        propertyLocation: 'Melbourne, VIC',
        propertyType: 'commercial',
        valuationType: 'ary',
        userId: testUserId,
        sessionId: testSessionId,
        results: { marketValue: 1000000 },
        inputs: { riskFreeRate: 3.2 },
        calculationMethod: 'ARY'
      });
      await testValuation.save();
    });

    it('should delete valuation', async () => {
      const response = await request(app)
        .delete(`/api/valuations/${testValuation._id}`)
        .query({ userId: testUserId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify deletion
      const deletedValuation = await Valuation.findById(testValuation._id);
      expect(deletedValuation).toBeNull();
    });
  });

  describe('GET /api/valuations/search', () => {
    beforeEach(async () => {
      const valuations = [
        {
          propertyName: 'Melbourne Office Building',
          propertyLocation: 'Melbourne, VIC',
          propertyType: 'commercial',
          valuationType: 'ary',
          userId: testUserId,
          sessionId: testSessionId,
          results: { marketValue: 1000000 },
          inputs: { riskFreeRate: 3.2 },
          calculationMethod: 'ARY'
        },
        {
          propertyName: 'Sydney Residential Complex',
          propertyLocation: 'Sydney, NSW',
          propertyType: 'residential',
          valuationType: 'esg-ary',
          userId: testUserId,
          sessionId: testSessionId,
          results: { marketValue: 2000000 },
          inputs: { riskFreeRate: 3.2 },
          calculationMethod: 'ESG-ARY'
        }
      ];

      await Valuation.insertMany(valuations);
    });

    it('should search valuations by text', async () => {
      const response = await request(app)
        .get('/api/valuations/search')
        .query({ 
          userId: testUserId,
          q: 'Melbourne'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].propertyName).toContain('Melbourne');
    });

    it('should search with filters', async () => {
      const response = await request(app)
        .get('/api/valuations/search')
        .query({ 
          userId: testUserId,
          q: 'Building',
          propertyType: 'commercial'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].propertyType).toBe('commercial');
    });
  });

  describe('GET /api/valuations/stats', () => {
    beforeEach(async () => {
      const valuations = [
        {
          propertyName: 'Building 1',
          propertyLocation: 'Melbourne, VIC',
          propertyType: 'commercial',
          valuationType: 'ary',
          userId: testUserId,
          sessionId: testSessionId,
          status: 'completed',
          esgIncluded: false,
          results: { marketValue: 1000000 },
          inputs: { riskFreeRate: 3.2 },
          calculationMethod: 'ARY'
        },
        {
          propertyName: 'Building 2',
          propertyLocation: 'Sydney, NSW',
          propertyType: 'residential',
          valuationType: 'esg-ary',
          userId: testUserId,
          sessionId: testSessionId,
          status: 'completed',
          esgIncluded: true,
          results: { marketValue: 2000000 },
          inputs: { riskFreeRate: 3.2 },
          calculationMethod: 'ESG-ARY'
        }
      ];

      await Valuation.insertMany(valuations);
    });

    it('should get valuation statistics', async () => {
      const response = await request(app)
        .get('/api/valuations/stats')
        .query({ userId: testUserId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalValuations).toBe(2);
      expect(response.body.data.completedValuations).toBe(2);
      expect(response.body.data.esgValuations).toBe(1);
      expect(response.body.data.valuationTypes).toHaveLength(2);
    });
  });

  describe('GET /api/valuations/types', () => {
    it('should get supported valuation types', async () => {
      const response = await request(app)
        .get('/api/valuations/types')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      const aryType = response.body.data.find(type => type.id === 'ary');
      expect(aryType).toBeDefined();
      expect(aryType.name).toBe('All Risks Yield');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });
});
