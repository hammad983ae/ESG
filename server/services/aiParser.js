/**
 * AI Parser Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Handles AI-powered text parsing using OpenAI API
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const axios = require('axios');

class AIParserService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  /**
   * Parse extracted text using AI for specific form types
   * @param {string} extractedText - Text extracted from OCR
   * @param {string} formType - Type of form to parse for
   * @returns {Promise<Object>} Parsed form data
   */
  async parseFormData(extractedText, formType) {
    try {
      console.log(`Parsing text for form type: ${formType}`);
      
      const systemPrompt = this.getSystemPrompt(formType);
      const userPrompt = this.getUserPrompt(extractedText, formType);
      
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1, // Low temperature for consistent parsing
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error('No response from OpenAI API');
      }

      const parsedDataText = response.data.choices[0].message.content;
      console.log('Raw AI response:', parsedDataText);

      // Clean and parse JSON response
      let parsedData;
      try {
        // Clean the response text to fix common JSON issues
        let cleanedText = parsedDataText.trim();
        
        // Fix common JSON issues
        cleanedText = cleanedText
          .replace(/(\d+)_(\d+)/g, '$1$2') // Remove underscores from numbers (e.g., 6_140.00 -> 6140.00)
          .replace(/(\d+),(\d+)/g, '$1$2') // Remove commas from numbers (e.g., 1,000 -> 1000)
          .replace(/"null"/g, 'null') // Fix string "null" to actual null
          .replace(/"undefined"/g, 'null') // Fix string "undefined" to null
          .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        parsedData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parsedDataText);
        console.error('Cleaned text:', cleanedText);
        console.error('Parse error:', parseError.message);
        throw new Error('AI returned invalid JSON format');
      }

      // Validate and clean the parsed data
      const cleanedData = this.cleanParsedData(parsedData, formType);
      console.log(`Successfully parsed data for ${formType}:`, cleanedData);
      
      return cleanedData;
      
    } catch (error) {
      console.error('Error in AI parsing:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error?.message || error.message;
        
        if (status === 401) {
          throw new Error(`OpenAI API key invalid: ${message}`);
        } else if (status === 429) {
          throw new Error(`OpenAI rate limit exceeded: ${message}`);
        } else if (status === 400) {
          throw new Error(`OpenAI API error: ${message}`);
        } else {
          throw new Error(`OpenAI API error (${status}): ${message}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('AI parsing timeout - please try again');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Network error - unable to reach AI service');
      } else {
        throw new Error(`AI parsing failed: ${error.message}`);
      }
    }
  }

  /**
   * Get system prompt for specific form type
   * @param {string} formType - Form type
   * @returns {string} System prompt
   */
  getSystemPrompt(formType) {
    const basePrompt = `You are an expert property valuation assistant specializing in lease document analysis. Extract and structure data from OCR text for real estate valuation forms.

Pay special attention to table structures, lease details, and financial information. Look for:
- Table headers and corresponding values
- Lease terms and conditions
- Financial figures and calculations
- Dates in various formats
- Property details and specifications
- Legal entities and parties involved

Return a JSON object with the extracted data using these exact field names based on form type. Only include fields where you can confidently extract values. Use null for unclear values. Convert text numbers to actual numbers where appropriate.

IMPORTANT: Return ONLY valid JSON. Do not include any explanatory text or markdown formatting.`;

    const formSpecificPrompts = {
      'rent-revision': `For Rent Revision forms, extract comprehensive lease details using these EXACT field names: { "property_type": string, "lessor": string, "lessee": string, "commencement_date": string, "expiring_date": string, "options_further_terms": string, "review_date": string, "face_rent": number, "effective_rent": number, "gross_rent": number, "net_rent": number, "incentives": number, "outgoings": number, "land_tax": number, "lettable_area": number, "outgoings_per_sqm": number, "land_area": number, "improved_rent_rate_per_sqm": number, "market_rent": number, "market_rent_per_sqm": number, "market_land_rate": number, "proposed_rent": number, "proposed_improved_land_rate": number, "cpi_fixed_adjustments": number, "revision_effective_date": string, "comparable_evidence": string, "market_conditions": string, "esg_notes": string }`,
      
      'ary': `For ARY forms, extract: { "cashRate": number, "propertyType": string, "marketRent": number, "marketValue": number, "lettableArea": number, "landArea": number, "location": string, "buildingAge": number, "energyRating": number }`,
      
      'esg': `For ESG forms, extract: { "cashRate": number, "propertyType": string, "energyRating": number, "waterEfficiency": number, "wasteReduction": number, "sustainableMaterials": number, "carbonFootprint": number }`,
      
      'capitalization': `For Capitalization forms, extract: { "marketRent": number, "capitalizationRate": number, "propertyValue": number, "location": string }`,
      
      'netincome': `For Net Income forms, extract: { "grossIncome": number, "operatingExpenses": number, "noi": number, "capitalizationRate": number }`,
      
      'childcare': `For Childcare forms, extract: { "capacity": number, "licensedPlaces": number, "weeklyFees": number, "occupancyRate": number, "operationalCosts": number, "facilityDetails": string }`,
      
      'hospitality': `For Hospitality forms, extract: { "numberOfRooms": number, "averageDailyRate": number, "occupancyRate": number, "foodBeverageRevenue": number, "operationalMetrics": string }`,
      
      'petrol-station': `For Petrol Station forms, extract: { "fuelThroughput": number, "convenienceStoreRevenue": number, "rentDetails": number, "leaseTerms": string, "operationalMetrics": string }`,
      
      'stadium': `For Stadium forms, extract: { "capacity": number, "eventRevenue": number, "namingRights": number, "concessionIncome": number, "maintenanceCosts": number, "facilityDetails": string }`,
      
      'dcf': `For DCF forms, extract: { "cashFlows": number, "discountRate": number, "terminalValue": number, "growthRates": number, "projectionPeriods": number }`,
      
      'deferred-management': `For Deferred Management forms, extract: { "entryFees": number, "ongoingFees": number, "deferredManagementFees": number, "residentNumbers": number, "facilityDetails": string }`,
      
      'crop': `For Crop forms, extract: { "cropType": string, "plantingArea": number, "yieldPerAcre": number, "marketPrice": number, "productionCosts": number, "irrigationType": string, "soilType": string, "equipmentCosts": number }`,
      
      'pasture': `For Pasture forms, extract: { "pastureType": string, "grassVariety": string, "livestockType": string, "carryingCapacity": number, "currentStock": number, "irrigationType": string, "soilType": string, "rainfallAnnual": number, "operationalCosts": number }`,
      
      'orchard': `For Orchard forms, extract: { "fruitType": string, "treeCount": number, "plantingDensity": number, "yieldPerTree": number, "marketPrice": number, "harvestSeason": string, "irrigationSystem": string, "soilConditions": string, "maintenanceCosts": number }`,
      
      'horticulture': `For Horticulture forms, extract: { "plantVarieties": string, "greenhouseArea": number, "growingConditions": string, "yieldPerSquareMeter": number, "marketPrices": number, "seasonalProduction": string, "facilityCosts": number }`,
      
      'vineyard': `For Vineyard forms, extract: { "grapeVariety": string, "vineCount": number, "plantingDensity": number, "yieldPerVine": number, "wineQualityRating": number, "harvestTiming": string, "soilComposition": string, "winemakingCosts": number }`
    };

    const specificPrompt = formSpecificPrompts[formType] || 'Extract relevant property valuation data.';
    
    return `${basePrompt}\n\n${specificPrompt}`;
  }

  /**
   * Get user prompt with extracted text
   * @param {string} extractedText - Extracted text
   * @param {string} formType - Form type
   * @returns {string} User prompt
   */
  getUserPrompt(extractedText, formType) {
    const formTypeDescriptions = {
      'rent-revision': 'Extract comprehensive rent revision and lease data from tables and text. Map the data to these exact field names: property_type (property type), lessor (landlord name), lessee (tenant name), commencement_date (lease start date), expiring_date (lease end date), options_further_terms (lease options), review_date (rent review date), face_rent (current rent amount), effective_rent (rent after incentives), gross_rent (rent including outgoings), net_rent (net rent amount), incentives (incentive amounts), outgoings (outgoings amount), lettable_area (net lettable area), outgoings_per_sqm (outgoings per square meter), land_area (land area), market_rent (market rent amount), market_rent_per_sqm (market rent per sqm), comparable_evidence (comparable property evidence), market_conditions (market conditions description). Pay special attention to table structures and extract all relevant lease information.',
      'ary': 'Extract property valuation data including: cash rate, property type, market rent, market value, lettable area, land area, location, building age, energy rating, and any other relevant property details.',
      'esg': 'Extract ESG property data including: cash rate, property type, energy rating (1-10), water efficiency (1-10), waste reduction (1-10), sustainable materials (1-10), carbon footprint (1-10), and location details.',
      'capitalization': 'Extract capitalization analysis data including: market rent, capitalization rate, property value, risk factors, lease terms, and property characteristics.',
      'netincome': 'Extract net income data including: gross income, operating expenses, net operating income (NOI), capitalization rate, and property details.',
      'childcare': 'Extract childcare facility data including: capacity, licensed places, weekly fees, occupancy rates, operational costs, and facility details.',
      'hospitality': 'Extract hospitality property data including: number of rooms, average daily rate (ADR), occupancy rate, food & beverage revenue, and operational metrics.',
      'petrol-station': 'Extract petrol station data including: fuel throughput, convenience store revenue, rent details, lease terms, and operational metrics.',
      'stadium': 'Extract stadium data including: capacity, event revenue, naming rights, concession income, maintenance costs, and facility details.',
      'dcf': 'Extract DCF analysis data including: cash flows, discount rate, terminal value, growth rates, and projection periods.',
      'deferred-management': 'Extract deferred management data for retirement villages including: entry fees, ongoing fees, deferred management fees, resident numbers, and facility details.',
      'crop': 'Extract crop farming data including: crop type, planting area, yield per acre, market price, production costs, irrigation requirements, soil type, and farming equipment details.',
      'pasture': 'Extract pasture and livestock data including: pasture type, grass variety, livestock type, carrying capacity, current stock, irrigation type, soil type, rainfall, and operational costs.',
      'orchard': 'Extract orchard data including: fruit type, tree count, planting density, yield per tree, market price, harvest season, irrigation system, soil conditions, and maintenance costs.',
      'horticulture': 'Extract horticulture data including: plant varieties, greenhouse area, growing conditions, yield per square meter, market prices, seasonal production, and facility costs.',
      'vineyard': 'Extract vineyard data including: grape variety, vine count, planting density, yield per vine, wine quality ratings, harvest timing, soil composition, and winemaking costs.'
    };

    const description = formTypeDescriptions[formType] || 'Extract relevant property valuation data.';
    
    return `Extract data for ${formType} form from this text:\n\n${extractedText}\n\n${description}`;
  }

  /**
   * Parse multiple pages of extracted text using AI for comprehensive data extraction
   * @param {Array} pagesData - Array of page data with extracted text
   * @param {string} formType - Type of form to parse for
   * @returns {Promise<Object>} Parsed form data
   */
  async parseBulkFormData(pagesData, formType) {
    try {
      console.log(`Parsing bulk data for form type: ${formType} with ${pagesData.length} pages`);
      
      // Combine all extracted text from all pages
      const allText = pagesData
        .map((page, index) => `--- PAGE ${index + 1} ---\n${page.extractedText}`)
        .join('\n\n');
      
      console.log(`Combined text length: ${allText.length} characters`);
      
      const systemPrompt = this.getBulkSystemPrompt(formType);
      const userPrompt = this.getBulkUserPrompt(allText, formType, pagesData.length);
      
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'gpt-4o', // Use GPT-4o for better analysis of complex multi-page documents
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1, // Low temperature for consistent parsing
          max_tokens: 4000, // Increased for comprehensive data extraction
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // Increased timeout for bulk processing
        }
      );

      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error('No response from OpenAI API');
      }

      const parsedDataText = response.data.choices[0].message.content;
      console.log('Raw AI response for bulk processing:', parsedDataText);

      // Clean and parse JSON response
      let parsedData;
      try {
        // Clean the response text to fix common JSON issues
        let cleanedText = parsedDataText.trim();
        
        // Fix common JSON issues
        cleanedText = cleanedText
          .replace(/(\d+)_(\d+)/g, '$1$2') // Remove underscores from numbers (e.g., 6_140.00 -> 6140.00)
          .replace(/(\d+),(\d+)/g, '$1$2') // Remove commas from numbers (e.g., 1,000 -> 1000)
          .replace(/"null"/g, 'null') // Fix string "null" to actual null
          .replace(/"undefined"/g, 'null') // Fix string "undefined" to null
          .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        parsedData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parsedDataText);
        console.error('Cleaned text:', cleanedText);
        console.error('Parse error:', parseError.message);
        throw new Error('AI returned invalid JSON format');
      }

      // Validate and clean the parsed data
      const cleanedData = this.cleanParsedData(parsedData, formType);
      console.log(`Successfully parsed bulk data for ${formType}:`, cleanedData);
      
      return cleanedData;
      
    } catch (error) {
      console.error('Error in bulk AI parsing:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error?.message || error.message;
        
        if (status === 401) {
          throw new Error(`OpenAI API key invalid: ${message}`);
        } else if (status === 429) {
          throw new Error(`OpenAI rate limit exceeded: ${message}`);
        } else if (status === 400) {
          throw new Error(`OpenAI API error: ${message}`);
        } else {
          throw new Error(`OpenAI API error (${status}): ${message}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('AI parsing timeout - please try again');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Network error - unable to reach AI service');
      } else {
        throw new Error(`AI parsing failed: ${error.message}`);
      }
    }
  }

  /**
   * Get system prompt for bulk processing
   * @param {string} formType - Form type
   * @returns {string} System prompt
   */
  getBulkSystemPrompt(formType) {
    const basePrompt = `You are an expert property valuation assistant specializing in comprehensive lease document analysis. You will receive text extracted from multiple pages of a lease document.

Your task is to analyze ALL the text from ALL pages and extract the most complete and accurate information possible. Pay special attention to:

- Cross-referencing information across pages
- Resolving conflicts between pages (choose the most recent or authoritative data)
- Identifying the most complete and accurate values
- Understanding the document structure and context
- Extracting comprehensive lease details from tables and text
- Looking for lease terms, rent amounts, dates, property details, and financial information

CRITICAL: You must extract as much data as possible. Do not return null for fields unless you are absolutely certain the information is not present in the document. Look carefully through all pages for:
- Property type and description
- Lessor and lessee names
- Lease commencement and expiry dates
- Rent amounts (face rent, effective rent, gross rent, net rent)
- Outgoings and expenses
- Property areas (lettable area, land area)
- Market rent and comparable evidence
- Lease options and renewal terms
- Review dates and revision terms

Return a JSON object with the extracted data using these exact field names based on form type. Convert text numbers to actual numbers where appropriate. Use proper number format (no underscores, commas, or quotes around numbers).

IMPORTANT: Return ONLY valid JSON. Do not include any explanatory text or markdown formatting.`;

    const formSpecificPrompts = {
      'rent-revision': `For Rent Revision forms, extract comprehensive lease details using these EXACT field names: { "property_type": string, "lessor": string, "lessee": string, "commencement_date": string, "expiring_date": string, "options_further_terms": string, "review_date": string, "face_rent": number, "effective_rent": number, "gross_rent": number, "net_rent": number, "incentives": number, "outgoings": number, "land_tax": number, "lettable_area": number, "outgoings_per_sqm": number, "land_area": number, "improved_rent_rate_per_sqm": number, "market_rent": number, "market_rent_per_sqm": number, "market_land_rate": number, "proposed_rent": number, "proposed_improved_land_rate": number, "cpi_fixed_adjustments": number, "revision_effective_date": string, "comparable_evidence": string, "market_conditions": string, "esg_notes": string }`,
      
      'ary': `For ARY forms, extract: { "cashRate": number, "propertyType": string, "marketRent": number, "marketValue": number, "lettableArea": number, "landArea": number, "location": string, "buildingAge": number, "energyRating": number }`,
      
      'esg': `For ESG forms, extract: { "cashRate": number, "propertyType": string, "energyRating": number, "waterEfficiency": number, "wasteReduction": number, "sustainableMaterials": number, "carbonFootprint": number }`,
      
      'capitalization': `For Capitalization forms, extract: { "marketRent": number, "capitalizationRate": number, "propertyValue": number, "location": string }`,
      
      'netincome': `For Net Income forms, extract: { "grossIncome": number, "operatingExpenses": number, "noi": number, "capitalizationRate": number }`,
      
      'childcare': `For Childcare forms, extract: { "capacity": number, "licensedPlaces": number, "weeklyFees": number, "occupancyRate": number, "operationalCosts": number, "facilityDetails": string }`,
      
      'hospitality': `For Hospitality forms, extract: { "numberOfRooms": number, "averageDailyRate": number, "occupancyRate": number, "foodBeverageRevenue": number, "operationalMetrics": string }`,
      
      'petrol-station': `For Petrol Station forms, extract: { "fuelThroughput": number, "convenienceStoreRevenue": number, "rentDetails": number, "leaseTerms": string, "operationalMetrics": string }`,
      
      'stadium': `For Stadium forms, extract: { "capacity": number, "eventRevenue": number, "namingRights": number, "concessionIncome": number, "maintenanceCosts": number, "facilityDetails": string }`,
      
      'dcf': `For DCF forms, extract: { "cashFlows": number, "discountRate": number, "terminalValue": number, "growthRates": number, "projectionPeriods": number }`,
      
      'deferred-management': `For Deferred Management forms, extract: { "entryFees": number, "ongoingFees": number, "deferredManagementFees": number, "residentNumbers": number, "facilityDetails": string }`,
      
      'crop': `For Crop forms, extract: { "cropType": string, "plantingArea": number, "yieldPerAcre": number, "marketPrice": number, "productionCosts": number, "irrigationType": string, "soilType": string, "equipmentCosts": number }`,
      
      'pasture': `For Pasture forms, extract: { "pastureType": string, "grassVariety": string, "livestockType": string, "carryingCapacity": number, "currentStock": number, "irrigationType": string, "soilType": string, "rainfallAnnual": number, "operationalCosts": number }`,
      
      'orchard': `For Orchard forms, extract: { "fruitType": string, "treeCount": number, "plantingDensity": number, "yieldPerTree": number, "marketPrice": number, "harvestSeason": string, "irrigationSystem": string, "soilConditions": string, "maintenanceCosts": number }`,
      
      'horticulture': `For Horticulture forms, extract: { "plantVarieties": string, "greenhouseArea": number, "growingConditions": string, "yieldPerSquareMeter": number, "marketPrices": number, "seasonalProduction": string, "facilityCosts": number }`,
      
      'vineyard': `For Vineyard forms, extract: { "grapeVariety": string, "vineCount": number, "plantingDensity": number, "yieldPerVine": number, "wineQualityRating": number, "harvestTiming": string, "soilComposition": string, "winemakingCosts": number }`
    };

    const specificPrompt = formSpecificPrompts[formType] || 'Extract relevant property valuation data.';
    
    return `${basePrompt}\n\n${specificPrompt}`;
  }

  /**
   * Get user prompt for bulk processing
   * @param {string} allText - Combined text from all pages
   * @param {string} formType - Form type
   * @param {number} pageCount - Number of pages
   * @returns {string} User prompt
   */
  getBulkUserPrompt(allText, formType, pageCount) {
    const formTypeDescriptions = {
      'rent-revision': 'Extract comprehensive rent revision and lease data from this multi-page document. This is a lease document that contains detailed information about a property lease. Analyze ALL pages carefully to find the most complete and accurate information. Look for tables, schedules, and detailed lease terms. Map the data to these exact field names: property_type (property type/description), lessor (landlord/lessor name), lessee (tenant/lessee name), commencement_date (lease start date), expiring_date (lease end date), options_further_terms (lease options and renewal terms), review_date (rent review date), face_rent (current rent amount), effective_rent (rent after incentives), gross_rent (rent including outgoings), net_rent (net rent amount), incentives (incentive amounts), outgoings (outgoings amount), lettable_area (net lettable area), outgoings_per_sqm (outgoings per square meter), land_area (land area), market_rent (market rent amount), market_rent_per_sqm (market rent per sqm), comparable_evidence (comparable property evidence), market_conditions (market conditions description). Cross-reference information across all pages to ensure accuracy. Extract as much data as possible - do not leave fields as null unless absolutely certain the information is not present.',
      'ary': 'Extract property valuation data including: cash rate, property type, market rent, market value, lettable area, land area, location, building age, energy rating, and any other relevant property details.',
      'esg': 'Extract ESG property data including: cash rate, property type, energy rating (1-10), water efficiency (1-10), waste reduction (1-10), sustainable materials (1-10), carbon footprint (1-10), and location details.',
      'capitalization': 'Extract capitalization analysis data including: market rent, capitalization rate, property value, risk factors, lease terms, and property characteristics.',
      'netincome': 'Extract net income data including: gross income, operating expenses, net operating income (NOI), capitalization rate, and property details.',
      'childcare': 'Extract childcare facility data including: capacity, licensed places, weekly fees, occupancy rates, operational costs, and facility details.',
      'hospitality': 'Extract hospitality property data including: number of rooms, average daily rate (ADR), occupancy rate, food & beverage revenue, and operational metrics.',
      'petrol-station': 'Extract petrol station data including: fuel throughput, convenience store revenue, rent details, lease terms, and operational metrics.',
      'stadium': 'Extract stadium data including: capacity, event revenue, naming rights, concession income, maintenance costs, and facility details.',
      'dcf': 'Extract DCF analysis data including: cash flows, discount rate, terminal value, growth rates, and projection periods.',
      'deferred-management': 'Extract deferred management data for retirement villages including: entry fees, ongoing fees, deferred management fees, resident numbers, and facility details.',
      'crop': 'Extract crop farming data including: crop type, planting area, yield per acre, market price, production costs, irrigation requirements, soil type, and farming equipment details.',
      'pasture': 'Extract pasture and livestock data including: pasture type, grass variety, livestock type, carrying capacity, current stock, irrigation type, soil type, rainfall, and operational costs.',
      'orchard': 'Extract orchard data including: fruit type, tree count, planting density, yield per tree, market price, harvest season, irrigation system, soil conditions, and maintenance costs.',
      'horticulture': 'Extract horticulture data including: plant varieties, greenhouse area, growing conditions, yield per square meter, market prices, seasonal production, and facility costs.',
      'vineyard': 'Extract vineyard data including: grape variety, vine count, planting density, yield per vine, wine quality ratings, harvest timing, soil composition, and winemaking costs.'
    };

    const description = formTypeDescriptions[formType] || 'Extract relevant property valuation data.';
    
    return `Analyze this ${pageCount}-page document and extract data for ${formType} form:\n\n${allText}\n\n${description}`;
  }

  /**
   * Clean and validate parsed data
   * @param {Object} parsedData - Raw parsed data
   * @param {string} formType - Form type
   * @returns {Object} Cleaned data
   */
  cleanParsedData(parsedData, formType) {
    if (!parsedData || typeof parsedData !== 'object') {
      return {};
    }

    const cleanedData = {};
    
    // Clean each field
    Object.entries(parsedData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return; // Skip null/undefined/empty values
      }

      // Convert string numbers to actual numbers
      if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
        cleanedData[key] = parseFloat(value);
      } else if (typeof value === 'string' && value.toLowerCase() === 'null') {
        // Skip null strings
        return;
      } else {
        cleanedData[key] = value;
      }
    });

    return cleanedData;
  }

  /**
   * Validate if the API key is working
   * @returns {Promise<boolean>} True if API key is valid
   */
  async validateApiKey() {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: 'Test message' }
          ],
          max_tokens: 10,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data.choices && response.data.choices.length > 0;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
}

module.exports = new AIParserService();
