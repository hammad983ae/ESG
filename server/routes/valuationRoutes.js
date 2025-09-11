/**
 * Delorenzo Property Group - Valuation Routes
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Express routes for valuation operations
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const valuationController = require('../controllers/valuationController');
const { validateValuationData, validateValuationId } = require('../middleware/validation');

/**
 * @route   POST /api/valuations
 * @desc    Create a new valuation
 * @access  Private
 */
router.post('/', validateValuationData, valuationController.createValuation);

/**
 * @route   GET /api/valuations/types
 * @desc    Get supported valuation types
 * @access  Public
 */
router.get('/types', valuationController.getSupportedValuationTypes);

/**
 * @route   GET /api/valuations
 * @desc    Get all valuations for a user
 * @access  Private
 */
router.get('/', valuationController.getUserValuations);

/**
 * @route   GET /api/valuations/search
 * @desc    Search valuations
 * @access  Private
 */
router.get('/search', valuationController.searchValuations);

/**
 * @route   GET /api/valuations/stats
 * @desc    Get valuation statistics for a user
 * @access  Private
 */
router.get('/stats', valuationController.getValuationStats);

/**
 * @route   GET /api/valuations/:id
 * @desc    Get valuation by ID
 * @access  Private
 */
router.get('/:id', validateValuationId, valuationController.getValuationById);

/**
 * @route   PUT /api/valuations/:id
 * @desc    Update valuation
 * @access  Private
 */
router.put('/:id', validateValuationId, validateValuationData, valuationController.updateValuation);

/**
 * @route   DELETE /api/valuations/:id
 * @desc    Delete valuation
 * @access  Private
 */
router.delete('/:id', validateValuationId, valuationController.deleteValuation);

/**
 * @route   PATCH /api/valuations/:id/archive
 * @desc    Archive valuation
 * @access  Private
 */
router.patch('/:id/archive', validateValuationId, valuationController.archiveValuation);

/**
 * @route   POST /api/valuations/:id/share
 * @desc    Share valuation with another user
 * @access  Private
 */
router.post('/:id/share', validateValuationId, valuationController.shareValuation);

/**
 * @route   POST /api/valuations/export
 * @desc    Export valuations to different formats
 * @access  Private
 */
router.post('/export', valuationController.exportValuations);

module.exports = router;
