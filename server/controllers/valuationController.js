/**
 * Delorenzo Property Group - Valuation Controller
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * HTTP request handlers for valuation operations
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const valuationService = require('../services/valuationService');

class ValuationController {
  /**
   * Create a new valuation
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async createValuation(req, res) {
    try {
      const valuationData = {
        ...req.body,
        userId: req.user?.id || req.body.userId,
        sessionId: req.sessionID || req.body.sessionId
      };

      const valuation = await valuationService.createValuation(valuationData);

      res.status(201).json({
        success: true,
        message: 'Valuation created successfully',
        data: valuation
      });
    } catch (error) {
      console.error('Error creating valuation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create valuation',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get valuation by ID
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getValuationById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const valuation = await valuationService.getValuationById(id, userId);

      res.json({
        success: true,
        data: valuation
      });
    } catch (error) {
      console.error('Error getting valuation:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Valuation not found'
      });
    }
  }

  /**
   * Get all valuations for a user
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getUserValuations(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const filters = {
        valuationType: req.query.valuationType,
        propertyType: req.query.propertyType,
        status: req.query.status,
        esgIncluded: req.query.esgIncluded === 'true',
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        limit: parseInt(req.query.limit) || 50,
        skip: parseInt(req.query.skip) || 0
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const valuations = await valuationService.getUserValuations(userId, filters);

      res.json({
        success: true,
        count: valuations.length,
        data: valuations
      });
    } catch (error) {
      console.error('Error getting user valuations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get valuations'
      });
    }
  }

  /**
   * Update valuation
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async updateValuation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const updateData = req.body;
      const valuation = await valuationService.updateValuation(id, userId, updateData);

      res.json({
        success: true,
        message: 'Valuation updated successfully',
        data: valuation
      });
    } catch (error) {
      console.error('Error updating valuation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update valuation'
      });
    }
  }

  /**
   * Delete valuation
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async deleteValuation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      await valuationService.deleteValuation(id, userId);

      res.json({
        success: true,
        message: 'Valuation deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting valuation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete valuation'
      });
    }
  }

  /**
   * Archive valuation
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async archiveValuation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const valuation = await valuationService.archiveValuation(id, userId);

      res.json({
        success: true,
        message: 'Valuation archived successfully',
        data: valuation
      });
    } catch (error) {
      console.error('Error archiving valuation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to archive valuation'
      });
    }
  }

  /**
   * Share valuation
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async shareValuation(req, res) {
    try {
      const { id } = req.params;
      const { shareWithUserId, permission = 'read' } = req.body;
      const ownerId = req.user?.id || req.body.ownerId;

      if (!ownerId) {
        return res.status(401).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      if (!shareWithUserId) {
        return res.status(400).json({
          success: false,
          message: 'Share with user ID is required'
        });
      }

      const valuation = await valuationService.shareValuation(id, ownerId, shareWithUserId, permission);

      res.json({
        success: true,
        message: 'Valuation shared successfully',
        data: valuation
      });
    } catch (error) {
      console.error('Error sharing valuation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to share valuation'
      });
    }
  }

  /**
   * Get valuation statistics
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getValuationStats(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const stats = await valuationService.getValuationStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting valuation stats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get valuation statistics'
      });
    }
  }

  /**
   * Search valuations
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async searchValuations(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;
      const searchQuery = req.query.q;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const filters = {
        valuationType: req.query.valuationType,
        propertyType: req.query.propertyType,
        status: req.query.status,
        esgIncluded: req.query.esgIncluded === 'true',
        limit: parseInt(req.query.limit) || 20
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const valuations = await valuationService.searchValuations(userId, searchQuery, filters);

      res.json({
        success: true,
        count: valuations.length,
        data: valuations
      });
    } catch (error) {
      console.error('Error searching valuations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search valuations'
      });
    }
  }

  /**
   * Export valuations
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async exportValuations(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { valuationIds, format = 'json' } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      if (!valuationIds || !Array.isArray(valuationIds)) {
        return res.status(400).json({
          success: false,
          message: 'Valuation IDs array is required'
        });
      }

      const exportData = await valuationService.exportValuations(userId, valuationIds, format);

      // Set appropriate headers based on format
      switch (format.toLowerCase()) {
        case 'csv':
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename="valuations.csv"');
          break;
        case 'pdf':
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename="valuations.pdf"');
          break;
        default:
          res.setHeader('Content-Type', 'application/json');
      }

      res.json({
        success: true,
        message: 'Valuations exported successfully',
        data: exportData
      });
    } catch (error) {
      console.error('Error exporting valuations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export valuations'
      });
    }
  }

  /**
   * Get supported valuation types
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getSupportedValuationTypes(req, res) {
    try {
      const types = [
        { id: 'ary', name: 'All Risks Yield', description: 'Calculate ARY using dynamic risk-free rate and comprehensive risk assessment' },
        { id: 'esg-ary', name: 'ESG-Adjusted ARY', description: 'Calculate ARY with environmental, social, and governance risk adjustments' },
        { id: 'capitalization-sensitivity', name: 'Cap Rate Sensitivity', description: 'Analyze property valuation sensitivity with optional ESG-adjusted capitalization rates' },
        { id: 'net-income', name: 'Net Income Approach', description: 'Comprehensive property valuation using income capitalization with scenario analysis' },
        { id: 'esg-capitalization', name: 'ESG Cap Analysis', description: 'Enhanced capitalization sensitivity analysis with optional ESG risk factor adjustments' },
        { id: 'esg-comparable-sales', name: 'ESG Comparable Sales', description: 'Enhanced sales comparison approach incorporating ESG factors and sustainability-weighted adjustments' },
        { id: 'cap-net-income', name: 'Cap Net Income', description: 'Calculate market value by dividing net income (NOI) by the Capitalisation Rate with risk premium adjustments' },
        { id: 'summation', name: 'Summation Approach', description: 'Automated summation valuation with sustainability factor adjustments for individual asset types' },
        { id: 'direct-comparison', name: 'Direct Comparison', description: 'Automated comparable sales analysis with flexible asset type selection and adjustment factors' },
        { id: 'hypothetical-development', name: 'Hypothetical Development', description: 'Calculate residual land value based on development feasibility with comprehensive cost analysis' },
        { id: 'hospitality', name: 'Hospitality & Commercial', description: 'Comprehensive valuation using five specialized approaches for hospitality and commercial properties' },
        { id: 'childcare', name: 'Childcare Facilities', description: 'Specialized valuation approaches for childcare properties including LCD, comparison, and rent-based methods' },
        { id: 'comprehensive-esg', name: 'Comprehensive ESG', description: 'Complete Environmental, Social, and Governance evaluation with automated scoring and valuation impact analysis' },
        { id: 'petrol-station', name: 'Petrol Stations', description: 'Comprehensive valuation using six specialized methods for petrol stations and fuel retail properties' },
        { id: 'deferred-management', name: 'Deferred Management', description: 'Specialized valuation for retirement village management rights with deferred cash flow analysis and present value calculations' },
        { id: 'dcf', name: 'DCF Analysis', description: 'Comprehensive DCF valuation with NPV, IRR, profitability index, and payback period analysis' },
        { id: 'stadium', name: 'Sports Stadium', description: 'Comprehensive stadium valuation using sublease income, retail income, and turnover methods' }
      ];

      res.json({
        success: true,
        data: types
      });
    } catch (error) {
      console.error('Error getting supported valuation types:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get supported valuation types'
      });
    }
  }
}

module.exports = new ValuationController();
