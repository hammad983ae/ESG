import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_CLOUD_VISION_API_KEY = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!GOOGLE_CLOUD_VISION_API_KEY) {
      throw new Error('GOOGLE_CLOUD_VISION_API_KEY is not set');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { imageBase64, formType } = await req.json();

    if (!imageBase64 || !formType) {
      return new Response(
        JSON.stringify({ error: 'Missing imageBase64 or formType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing OCR for form type: ${formType}`);

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
      throw new Error('No text detected in image');
    }

    const extractedText = visionData.responses[0].textAnnotations?.[0]?.description || '';

    if (!extractedText) {
      throw new Error('No text found in the image');
    }

    console.log('Extracted text length:', extractedText.length);

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
      'deferred-management': 'Extract deferred management data for retirement villages including: entry fees, ongoing fees, deferred management fees, resident numbers, and facility details.'
    };

    const systemPrompt = `You are an expert property valuation assistant. Extract and structure data from OCR text for real estate valuation forms. 

Return a JSON object with the extracted data using these exact field names based on form type:

For ARY forms: { "cashRate": number, "propertyType": string, "marketRent": number, "marketValue": number, "lettableArea": number, "landArea": number, "location": string, "buildingAge": number, "energyRating": number }

For ESG forms: { "cashRate": number, "propertyType": string, "energyRating": number, "waterEfficiency": number, "wasteReduction": number, "sustainableMaterials": number, "carbonFootprint": number }

For Capitalization forms: { "marketRent": number, "capitalizationRate": number, "propertyValue": number, "location": string }

For Net Income forms: { "grossIncome": number, "operatingExpenses": number, "noi": number, "capitalizationRate": number }

For Rent Revision forms: { "currentRent": number, "marketRent": number, "lettableArea": number, "landArea": number, "leaseStart": string, "leaseEnd": string, "reviewDate": string, "propertyAddress": string, "propertyType": string, "buildingAge": number, "carSpaces": number }

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
      throw new Error('Failed to parse text with AI');
    }

    const parsedDataText = openaiData.choices[0].message.content;
    let parsedData;

    try {
      parsedData = JSON.parse(parsedDataText);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', parsedDataText);
      throw new Error('AI response was not valid JSON');
    }

    console.log('Successfully parsed data:', parsedData);

    return new Response(
      JSON.stringify({ 
        extractedText: extractedText.substring(0, 500) + '...', // Truncate for response
        parsedData,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in OCR extraction:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});