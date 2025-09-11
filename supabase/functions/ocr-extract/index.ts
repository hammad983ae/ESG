import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import * as pdfjsLib from "npm:pdfjs-dist@4.0.379";
import { createCanvas } from "npm:canvas@2.11.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to process PDF and convert each page to base64 images
async function processPdfToImages(pdfBase64: string): Promise<string[]> {
  try {
    // Convert base64 to Uint8Array
    const pdfData = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const images: string[] = [];
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 }); // 1x scale as specified
      
      // Create canvas
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to base64
      const imageBase64 = canvas.toDataURL('image/png').split(',')[1];
      images.push(imageBase64);
    }
    
    return images;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
}

// Function to detect if input is PDF based on base64 header or file type
function isPdfInput(base64Data: string, fileType?: string): boolean {
  if (fileType && fileType.toLowerCase() === 'application/pdf') {
    return true;
  }
  
  // Check for PDF base64 header
  const pdfHeader = base64Data.substring(0, 20);
  return pdfHeader.includes('JVBERi0') || pdfHeader.includes('JVBERi1');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_CLOUD_VISION_API_KEY = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');

    // Use the provided OpenAI API key
    const OPENAI_API_KEY = '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';

    if (!GOOGLE_CLOUD_VISION_API_KEY) {
      throw new Error('GOOGLE_CLOUD_VISION_API_KEY is not set');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { imageBase64, fileBase64, fileType, formType, images } = await req.json();

    // Support multiple input formats:
    // 1. Legacy: imageBase64 + formType (single image)
    // 2. New: fileBase64 + fileType + formType (PDF or single image)
    // 3. New: images array + formType (multi-page from client-side PDF processing)
    
    if (!formType) {
      return new Response(
        JSON.stringify({ error: 'Missing formType parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine input type and validate accordingly
    let inputType: 'single_image' | 'file_upload' | 'multi_page' = 'single_image';
    let base64Data: string | null = null;
    let imagesToProcess: string[] = [];

    if (images && Array.isArray(images) && images.length > 0) {
      // New multi-page format from client-side PDF processing
      inputType = 'multi_page';
      imagesToProcess = images;
      console.log(`Processing ${images.length} images from client-side PDF processing`);
    } else if (fileBase64) {
      // New file upload format (PDF or single image)
      inputType = 'file_upload';
      base64Data = fileBase64;
    } else if (imageBase64) {
      // Legacy single image format
      inputType = 'single_image';
      base64Data = imageBase64;
    } else {
      return new Response(
        JSON.stringify({ error: 'Missing required input: provide either imageBase64, fileBase64, or images array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing OCR for form type: ${formType}, input type: ${inputType}`);

    // Process input based on type
    if (inputType === 'multi_page') {
      // Images already provided as array from client-side PDF processing
      console.log(`Processing ${imagesToProcess.length} images from client-side processing`);
    } else if (inputType === 'file_upload') {
      // Detect if input is PDF or image
      const isPdf = isPdfInput(base64Data!, fileType);
      
      if (isPdf) {
        console.log('Processing PDF file...');
        imagesToProcess = await processPdfToImages(base64Data!);
        console.log(`PDF converted to ${imagesToProcess.length} images`);
      } else {
        console.log('Processing single image from file upload...');
        imagesToProcess = [base64Data!];
      }
    } else {
      // Legacy single image format
      console.log('Processing single image (legacy format)...');
      imagesToProcess = [base64Data!];
    }

    // Process each image through OCR
    const allResults: any[] = [];
    let allExtractedText = '';
    const isMultiPage = imagesToProcess.length > 1;

    for (let i = 0; i < imagesToProcess.length; i++) {
      const imageBase64 = imagesToProcess[i];
      const pageNumber = isMultiPage ? i + 1 : null;

      console.log(`Processing ${isMultiPage ? `page ${pageNumber}` : 'image'}...`);

      // Step 1: Extract text using Google Cloud Vision API
      const visionResponse = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: imageBase64,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 1,
                  },
                ],
              },
            ],
          }),
        }
      );

      const visionData = await visionResponse.json();

      if (!visionData.responses || !visionData.responses[0]) {
        console.warn(`No text detected in ${isMultiPage ? `page ${pageNumber}` : 'image'}`);
        continue;
      }

      const extractedText = visionData.responses[0].textAnnotations?.[0]?.description || '';

      if (!extractedText) {
        console.warn(`No text found in ${isMultiPage ? `page ${pageNumber}` : 'image'}`);
        continue;
      }

      console.log(`Extracted text length from ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, extractedText.length);
      allExtractedText += (isMultiPage ? `\n--- Page ${pageNumber} ---\n` : '') + extractedText;

      // Step 2: Parse the extracted text using OpenAI
      const formTypePrompts = {
        'ary': 'Extract property valuation data including: cash rate, property type, market rent, market value, lettable area, land area, location, building age, energy rating, and any other relevant property details.',
        'esg': 'Extract ESG property data including: cash rate, property type, energy rating (1-10), water efficiency (1-10), waste reduction (1-10), sustainable materials (1-10), carbon footprint (1-10), and location details.',
        'capitalization': 'Extract capitalization analysis data including: market rent, capitalization rate, property value, risk factors, lease terms, and property characteristics.',
        'netincome': 'Extract net income data including: gross income, operating expenses, net operating income (NOI), capitalization rate, and property details.',
        'summation': 'Extract summation approach data including: land value, building improvement costs, depreciation factors, and total property value components.',
        'childcare': 'Extract childcare facility data including: capacity, licensed places, weekly fees, occupancy rates, operational costs, and facility details.',
        'hospitality': 'Extract hospitality property data including: number of rooms, average daily rate (ADR), occupancy rate, food & beverage revenue, and operational metrics.',
        'petrol-station': 'Extract petrol station data including: fuel throughput, convenience store revenue, rent details, lease terms, and operational metrics.',
        'stadium': 'Extract stadium data including: capacity, event revenue, naming rights, concession income, maintenance costs, and facility details.',
        'dcf': 'Extract DCF analysis data including: cash flows, discount rate, terminal value, growth rates, and projection periods.',
        'rent-revision': 'Extract rent revision data including: current rent, market rent, lease terms, rent review clauses, lettable area, land area, and property details.',
        'deferred-management': 'Extract deferred management data for retirement villages including: entry fees, ongoing fees, deferred management fees, resident numbers, and facility details.',
        'crop': 'Extract crop farming data including: crop type, planting area, yield per acre, market price, production costs, irrigation requirements, soil type, and farming equipment details.',
        'pasture': 'Extract pasture and livestock data including: pasture type, grass variety, livestock type, carrying capacity, current stock, irrigation type, soil type, rainfall, and operational costs.',
        'orchard': 'Extract orchard data including: fruit type, tree count, planting density, yield per tree, market price, harvest season, irrigation system, soil conditions, and maintenance costs.',
        'horticulture': 'Extract horticulture data including: plant varieties, greenhouse area, growing conditions, yield per square meter, market prices, seasonal production, and facility costs.',
        'vineyard': 'Extract vineyard data including: grape variety, vine count, planting density, yield per vine, wine quality ratings, harvest timing, soil composition, and winemaking costs.'
      };

      const systemPrompt = `You are an expert property valuation assistant. Extract and structure data from OCR text for real estate valuation forms. 

Return a JSON object with the extracted data using these exact field names based on form type:

For ARY forms: { "cashRate": number, "propertyType": string, "marketRent": number, "marketValue": number, "lettableArea": number, "landArea": number, "location": string, "buildingAge": number, "energyRating": number }

For ESG forms: { "cashRate": number, "propertyType": string, "energyRating": number, "waterEfficiency": number, "wasteReduction": number, "sustainableMaterials": number, "carbonFootprint": number }

For Capitalization forms: { "marketRent": number, "capitalizationRate": number, "propertyValue": number, "location": string }

For Net Income forms: { "grossIncome": number, "operatingExpenses": number, "noi": number, "capitalizationRate": number }

For Rent Revision forms: { "currentRent": number, "marketRent": number, "lettableArea": number, "landArea": number, "leaseStart": string, "leaseEnd": string, "reviewDate": string, "propertyAddress": string, "propertyType": string, "buildingAge": number, "carSpaces": number }

For Crop forms: { "cropType": string, "plantingArea": number, "yieldPerAcre": number, "marketPrice": number, "productionCosts": number, "irrigationType": string, "soilType": string, "equipmentCosts": number }

For Pasture forms: { "pastureType": string, "grassVariety": string, "livestockType": string, "carryingCapacity": number, "currentStock": number, "irrigationType": string, "soilType": string, "rainfallAnnual": number, "operationalCosts": number }

For Orchard forms: { "fruitType": string, "treeCount": number, "plantingDensity": number, "yieldPerTree": number, "marketPrice": number, "harvestSeason": string, "irrigationSystem": string, "soilConditions": string, "maintenanceCosts": number }

For Horticulture forms: { "plantVarieties": string, "greenhouseArea": number, "growingConditions": string, "yieldPerSquareMeter": number, "marketPrices": number, "seasonalProduction": string, "facilityCosts": number }

For Vineyard forms: { "grapeVariety": string, "vineCount": number, "plantingDensity": number, "yieldPerVine": number, "wineQualityRating": number, "harvestTiming": string, "soilComposition": string, "winemakingCosts": number }

Only include fields where you can confidently extract values. Use null for unclear values. Convert text numbers to actual numbers where appropriate.`;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Extract data for ${formType} form from this text:\n\n${extractedText}\n\n${formTypePrompts[formType] || 'Extract relevant property valuation data.'}` 
            }
          ],
          temperature: 0.1,
        }),
      });

      const openaiData = await openaiResponse.json();

      if (!openaiData.choices || !openaiData.choices[0]) {
        console.warn(`Failed to parse text with AI for ${isMultiPage ? `page ${pageNumber}` : 'image'}`);
        continue;
      }

      const parsedDataText = openaiData.choices[0].message.content;
      let parsedData;

      try {
        parsedData = JSON.parse(parsedDataText);
      } catch (e) {
        console.error(`Failed to parse AI response as JSON for ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, parsedDataText);
        continue;
      }

      console.log(`Successfully parsed data from ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, parsedData);

      // Store result for this page/image
      allResults.push({
        pageNumber: pageNumber,
        extractedText: extractedText.substring(0, 500) + '...', // Truncate for response
        parsedData: parsedData
      });
    }

    // Check if we have any results
    if (allResults.length === 0) {
      throw new Error('No text could be extracted from any page/image');
    }

    // Prepare response based on whether it's multi-page or single image
    if (isMultiPage) {
      // For multi-page documents (PDFs or client-side processed images), return array of results
      const successfulPages = allResults.filter(result => result.parsedData && Object.keys(result.parsedData).length > 0).length;
      
      return new Response(
        JSON.stringify({ 
          pages: allResults.map(result => ({
            pageNumber: result.pageNumber,
            extractedText: result.extractedText,
            parsedData: result.parsedData,
            success: result.parsedData && Object.keys(result.parsedData).length > 0
          })),
          totalPages: imagesToProcess.length,
          successfulPages: successfulPages,
          isMultiPage: true,
          allExtractedText: allExtractedText.substring(0, 1000) + '...', // Truncate for response
          success: successfulPages > 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // For single images, maintain backward compatibility with existing format
      const singleResult = allResults[0];
      return new Response(
        JSON.stringify({ 
          extractedText: singleResult.extractedText,
          parsedData: singleResult.parsedData,
          success: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in OCR extraction:', error);
    
    // Enhanced error handling for multi-page and PDF-specific errors
    let errorMessage = error.message || 'An unexpected error occurred';
    let statusCode = 500;
    
    if (error.message.includes('Failed to process PDF')) {
      errorMessage = `PDF processing error: ${error.message}`;
      statusCode = 400;
    } else if (error.message.includes('Invalid PDF format')) {
      errorMessage = 'Invalid PDF format or corrupted file';
      statusCode = 400;
    } else if (error.message.includes('PDF parsing failures')) {
      errorMessage = 'Failed to parse PDF document';
      statusCode = 400;
    } else if (error.message.includes('Canvas rendering errors')) {
      errorMessage = 'Failed to render PDF pages to images';
      statusCode = 500;
    } else if (error.message.includes('Memory limitations')) {
      errorMessage = 'PDF too large to process - please try a smaller file';
      statusCode = 413;
    } else if (error.message.includes('No text could be extracted')) {
      errorMessage = 'No text could be extracted from any page/image';
      statusCode = 400;
    } else if (error.message.includes('Missing required input')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Missing formType parameter')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Invalid images array')) {
      errorMessage = 'Invalid or empty images array provided';
      statusCode = 400;
    } else if (error.message.includes('Multi-page processing failed')) {
      errorMessage = 'Failed to process one or more pages in the document';
      statusCode = 500;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false,
        isMultiPage: false // Error responses are always single format
      }),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});