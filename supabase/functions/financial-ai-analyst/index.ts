import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { financialData, prompt, ratios } = await req.json();

    // Validate input
    if (!financialData || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Financial data and prompt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create comprehensive financial analysis prompt
    const analysisPrompt = `
You are a professional financial analyst and chartered accountant specializing in AASB (Australian Accounting Standards Board) compliance. 

COMPANY FINANCIAL DATA:
- Company: ${financialData.companyName || 'Not specified'}
- ABN: ${financialData.abn || 'Not specified'}
- Reporting Period: ${financialData.reportingPeriod || 'Not specified'}
- Industry: ${financialData.industryCode || 'Not specified'}

BALANCE SHEET:
- Total Assets: $${financialData.totalAssets?.toLocaleString() || 'N/A'}
- Total Liabilities: $${financialData.totalLiabilities?.toLocaleString() || 'N/A'}
- Total Equity: $${financialData.totalEquity?.toLocaleString() || 'N/A'}
- Cash: $${financialData.cash?.toLocaleString() || 'N/A'}
- Inventory: $${financialData.inventory?.toLocaleString() || 'N/A'}
- Property, Plant & Equipment: $${financialData.propertyPlantEquipment?.toLocaleString() || 'N/A'}

INCOME STATEMENT:
- Revenue: $${financialData.revenue?.toLocaleString() || 'N/A'}
- Cost of Sales: $${financialData.costOfSales?.toLocaleString() || 'N/A'}
- Gross Profit: $${(financialData.revenue - financialData.costOfSales)?.toLocaleString() || 'N/A'}
- Operating Expenses: $${financialData.operatingExpenses?.toLocaleString() || 'N/A'}
- EBITDA: $${(financialData.revenue - financialData.costOfSales - financialData.operatingExpenses)?.toLocaleString() || 'N/A'}
- Net Profit: $${financialData.netProfit?.toLocaleString() || 'N/A'}

CASH FLOW:
- Operating Cash Flow: $${financialData.operatingCashFlow?.toLocaleString() || 'N/A'}
- Investing Cash Flow: $${financialData.investingCashFlow?.toLocaleString() || 'N/A'}
- Financing Cash Flow: $${financialData.financingCashFlow?.toLocaleString() || 'N/A'}

KEY FINANCIAL RATIOS:
- Current Ratio: ${ratios?.currentRatio?.toFixed(2) || 'N/A'}
- Debt-to-Equity Ratio: ${ratios?.debtToEquityRatio?.toFixed(2) || 'N/A'}
- Return on Assets (ROA): ${ratios?.returnOnAssets?.toFixed(1) || 'N/A'}%
- Return on Equity (ROE): ${ratios?.returnOnEquity?.toFixed(1) || 'N/A'}%
- Gross Profit Margin: ${ratios?.grossProfitMargin?.toFixed(1) || 'N/A'}%
- Net Profit Margin: ${ratios?.netProfitMargin?.toFixed(1) || 'N/A'}%
- Asset Turnover: ${ratios?.assetTurnover?.toFixed(2) || 'N/A'}x

USER REQUEST:
${prompt}

Please provide a comprehensive, professional analysis that:
1. Is AASB-compliant and suitable for inclusion in annual financial reports
2. Uses appropriate accounting terminology and industry standards
3. Provides actionable insights and recommendations
4. Considers Australian business environment and regulatory requirements
5. Maintains a professional tone suitable for stakeholders, directors, and auditors

Format your response in clear sections with headers where appropriate, and ensure all financial figures are properly contextualized within Australian accounting frameworks.
`;

    console.log('Sending request to OpenAI with prompt length:', analysisPrompt.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial analyst and chartered accountant with deep expertise in Australian accounting standards (AASB), financial reporting, and business analysis. You provide professional, actionable insights for annual financial reports and strategic business decisions.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const analysis = data.choices[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis generated from OpenAI');
    }

    return new Response(
      JSON.stringify({ 
        analysis,
        metadata: {
          model: 'gpt-4o-mini',
          tokensUsed: data.usage?.total_tokens || 0,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in financial-ai-analyst function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate financial analysis',
        details: 'Please check your financial data and try again'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});