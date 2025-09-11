/**
 * Delorenzo Property Group - Valuation Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Business logic service for property valuation operations
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const { Valuation } = require('../models/ValuationModel');

class ValuationService {
  constructor() {
    this.supportedValuationTypes = [
      'ary', 'esg-ary', 'capitalization-sensitivity', 'net-income',
      'esg-capitalization', 'esg-comparable-sales', 'cap-net-income',
      'summation', 'direct-comparison', 'hypothetical-development',
      'hospitality', 'childcare', 'comprehensive-esg', 'petrol-station',
      'deferred-management', 'dcf', 'stadium'
    ];
  }

  /**
   * Create a new valuation
   * @param {object} valuationData - Valuation data
   * @returns {Promise<object>} Created valuation
   */
  async createValuation(valuationData) {
    try {
      // Validate valuation type
      if (!this.supportedValuationTypes.includes(valuationData.valuationType)) {
        throw new Error(`Unsupported valuation type: ${valuationData.valuationType}`);
      }

      // Validate required fields
      this.validateValuationData(valuationData);

      // Create new valuation
      const valuation = new Valuation(valuationData);
      const savedValuation = await valuation.save();

      console.log(`✅ Valuation created: ${savedValuation._id}`);
      return savedValuation;
    } catch (error) {
      console.error('❌ Error creating valuation:', error);
      throw error;
    }
  }

  /**
   * Get valuation by ID
   * @param {string} valuationId - Valuation ID
   * @param {string} userId - User ID for authorization
   * @returns {Promise<object>} Valuation data
   */
  async getValuationById(valuationId, userId) {
    try {
      const valuation = await Valuation.findOne({
        _id: valuationId,
        $or: [
          { userId: userId },
          { isPublic: true },
          { 'sharedWith.userId': userId }
        ]
      });

      if (!valuation) {
        throw new Error('Valuation not found or access denied');
      }

      return valuation;
    } catch (error) {
      console.error('❌ Error getting valuation:', error);
      throw error;
    }
  }

  /**
   * Get all valuations for a user
   * @param {string} userId - User ID
   * @param {object} filters - Filter options
   * @returns {Promise<Array>} List of valuations
   */
  async getUserValuations(userId, filters = {}) {
    try {
      const query = {
        $or: [
          { userId: userId },
          { isPublic: true },
          { 'sharedWith.userId': userId }
        ]
      };

      // Apply filters
      if (filters.valuationType) {
        query.valuationType = filters.valuationType;
      }
      if (filters.propertyType) {
        query.propertyType = filters.propertyType;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.esgIncluded !== undefined) {
        query.esgIncluded = filters.esgIncluded;
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.createdAt.$lte = new Date(filters.dateTo);
        }
      }

      const valuations = await Valuation.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50)
        .skip(filters.skip || 0);

      return valuations;
    } catch (error) {
      console.error('❌ Error getting user valuations:', error);
      throw error;
    }
  }

  /**
   * Update valuation
   * @param {string} valuationId - Valuation ID
   * @param {string} userId - User ID for authorization
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated valuation
   */
  async updateValuation(valuationId, userId, updateData) {
    try {
      const valuation = await Valuation.findOneAndUpdate(
        {
          _id: valuationId,
          userId: userId
        },
        {
          ...updateData,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!valuation) {
        throw new Error('Valuation not found or access denied');
      }

      console.log(`✅ Valuation updated: ${valuationId}`);
      return valuation;
    } catch (error) {
      console.error('❌ Error updating valuation:', error);
      throw error;
    }
  }

  /**
   * Delete valuation
   * @param {string} valuationId - Valuation ID
   * @param {string} userId - User ID for authorization
   * @returns {Promise<boolean>} Success status
   */
  async deleteValuation(valuationId, userId) {
    try {
      const result = await Valuation.findOneAndDelete({
        _id: valuationId,
        userId: userId
      });

      if (!result) {
        throw new Error('Valuation not found or access denied');
      }

      console.log(`✅ Valuation deleted: ${valuationId}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting valuation:', error);
      throw error;
    }
  }

  /**
   * Archive valuation
   * @param {string} valuationId - Valuation ID
   * @param {string} userId - User ID for authorization
   * @returns {Promise<object>} Archived valuation
   */
  async archiveValuation(valuationId, userId) {
    try {
      const valuation = await Valuation.findOneAndUpdate(
        {
          _id: valuationId,
          userId: userId
        },
        {
          status: 'archived',
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!valuation) {
        throw new Error('Valuation not found or access denied');
      }

      console.log(`✅ Valuation archived: ${valuationId}`);
      return valuation;
    } catch (error) {
      console.error('❌ Error archiving valuation:', error);
      throw error;
    }
  }

  /**
   * Share valuation with another user
   * @param {string} valuationId - Valuation ID
   * @param {string} ownerId - Owner user ID
   * @param {string} shareWithUserId - User ID to share with
   * @param {string} permission - Permission level
   * @returns {Promise<object>} Updated valuation
   */
  async shareValuation(valuationId, ownerId, shareWithUserId, permission = 'read') {
    try {
      const valuation = await Valuation.findOneAndUpdate(
        {
          _id: valuationId,
          userId: ownerId
        },
        {
          $addToSet: {
            sharedWith: {
              userId: shareWithUserId,
              permission: permission
            }
          },
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!valuation) {
        throw new Error('Valuation not found or access denied');
      }

      console.log(`✅ Valuation shared: ${valuationId} with user ${shareWithUserId}`);
      return valuation;
    } catch (error) {
      console.error('❌ Error sharing valuation:', error);
      throw error;
    }
  }

  /**
   * Get valuation statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<object>} Statistics
   */
  async getValuationStats(userId) {
    try {
      const stats = await Valuation.aggregate([
        {
          $match: {
            $or: [
              { userId: userId },
              { isPublic: true },
              { 'sharedWith.userId': userId }
            ]
          }
        },
        {
          $group: {
            _id: null,
            totalValuations: { $sum: 1 },
            completedValuations: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            draftValuations: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            },
            archivedValuations: {
              $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
            },
            esgValuations: {
              $sum: { $cond: ['$esgIncluded', 1, 0] }
            },
            averageMarketValue: { $avg: '$results.marketValue' },
            totalMarketValue: { $sum: '$results.marketValue' }
          }
        }
      ]);

      const typeStats = await Valuation.aggregate([
        {
          $match: {
            $or: [
              { userId: userId },
              { isPublic: true },
              { 'sharedWith.userId': userId }
            ]
          }
        },
        {
          $group: {
            _id: '$valuationType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        ...stats[0],
        valuationTypes: typeStats
      };
    } catch (error) {
      console.error('❌ Error getting valuation stats:', error);
      throw error;
    }
  }

  /**
   * Search valuations
   * @param {string} userId - User ID
   * @param {string} searchQuery - Search query
   * @param {object} filters - Additional filters
   * @returns {Promise<Array>} Search results
   */
  async searchValuations(userId, searchQuery, filters = {}) {
    try {
      const query = {
        $or: [
          { userId: userId },
          { isPublic: true },
          { 'sharedWith.userId': userId }
        ]
      };

      // Add text search
      if (searchQuery) {
        query.$text = { $search: searchQuery };
      }

      // Apply additional filters
      Object.assign(query, filters);

      const valuations = await Valuation.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 20);

      return valuations;
    } catch (error) {
      console.error('❌ Error searching valuations:', error);
      throw error;
    }
  }

  /**
   * Export valuations to different formats
   * @param {string} userId - User ID
   * @param {Array} valuationIds - Valuation IDs to export
   * @param {string} format - Export format (json, csv, pdf)
   * @returns {Promise<object>} Export data
   */
  async exportValuations(userId, valuationIds, format = 'json') {
    try {
      const valuations = await Valuation.find({
        _id: { $in: valuationIds },
        $or: [
          { userId: userId },
          { isPublic: true },
          { 'sharedWith.userId': userId }
        ]
      });

      if (valuations.length === 0) {
        throw new Error('No valuations found for export');
      }

      switch (format.toLowerCase()) {
        case 'json':
          return this.exportToJSON(valuations);
        case 'csv':
          return this.exportToCSV(valuations);
        case 'pdf':
          return this.exportToPDF(valuations);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('❌ Error exporting valuations:', error);
      throw error;
    }
  }

  /**
   * Validate valuation data
   * @param {object} data - Valuation data
   * @throws {Error} If validation fails
   */
  validateValuationData(data) {
    const requiredFields = ['propertyName', 'propertyLocation', 'propertyType', 'valuationType', 'userId', 'sessionId', 'results', 'inputs', 'calculationMethod'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (data.esgIncluded && typeof data.esgFactor !== 'number') {
      throw new Error('ESG factor must be a number when ESG is included');
    }

    if (data.results && typeof data.results !== 'object') {
      throw new Error('Results must be an object');
    }

    if (data.inputs && typeof data.inputs !== 'object') {
      throw new Error('Inputs must be an object');
    }
  }

  /**
   * Export to JSON format
   * @param {Array} valuations - Valuations to export
   * @returns {object} JSON export data
   */
  exportToJSON(valuations) {
    return {
      format: 'json',
      exportedAt: new Date().toISOString(),
      count: valuations.length,
      data: valuations
    };
  }

  /**
   * Export to CSV format
   * @param {Array} valuations - Valuations to export
   * @returns {object} CSV export data
   */
  exportToCSV(valuations) {
    const csvHeaders = [
      'ID', 'Property Name', 'Property Location', 'Property Type', 'Valuation Type',
      'Status', 'Market Value', 'ESG Included', 'ESG Factor', 'Created At'
    ];

    const csvRows = valuations.map(valuation => [
      valuation._id,
      valuation.propertyName,
      valuation.propertyLocation,
      valuation.propertyType,
      valuation.valuationType,
      valuation.status,
      valuation.results?.marketValue || 'N/A',
      valuation.esgIncluded ? 'Yes' : 'No',
      valuation.esgFactor || 0,
      valuation.createdAt.toISOString()
    ]);

    return {
      format: 'csv',
      exportedAt: new Date().toISOString(),
      count: valuations.length,
      headers: csvHeaders,
      rows: csvRows
    };
  }

  /**
   * Export to PDF format
   * @param {Array} valuations - Valuations to export
   * @returns {object} PDF export data
   */
  exportToPDF(valuations) {
    // This would typically generate a PDF using a library like puppeteer or pdfkit
    // For now, return a placeholder
    return {
      format: 'pdf',
      exportedAt: new Date().toISOString(),
      count: valuations.length,
      message: 'PDF export functionality would be implemented here',
      data: valuations
    };
  }
}

module.exports = new ValuationService();
