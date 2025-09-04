import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayoffMatrix {
  harvestNow: [number, number]; // [vs other harvest, vs other skip]
  skip: [number, number]; // [vs other harvest, vs other skip]
}

interface SimulationParams {
  numFarmers: number;
  numSeasons: number;
  commodities?: string[];
  customPayoffs?: Record<string, PayoffMatrix>;
}

interface SimulationResults {
  strategies: Record<string, number[][]>;
  rewards: Record<string, number[]>;
  totalRewardsByFarmer: number[];
  nashEquilibrium: Record<string, [number, number]>;
}

// Default payoff matrices for inversely correlated commodities
const defaultPayoffMatrices: Record<string, PayoffMatrix> = {
  'Wheat': {
    harvestNow: [12, 10], // High current demand
    skip: [8, 15]         // Future potential
  },
  'Corn': {
    harvestNow: [8, 6],   // Low current demand (inversely correlated)
    skip: [10, 18]        // High future potential
  },
  'Soybeans': {
    harvestNow: [10, 8],  // Moderate current demand
    skip: [9, 16]         // Good future potential
  }
};

// Simplified mixed strategy Nash equilibrium calculation
function findMixedStrategy(payoff: PayoffMatrix): [number, number] {
  // Calculate expected payoffs for each strategy
  const harvestExpected = (payoff.harvestNow[0] + payoff.harvestNow[1]) / 2;
  const skipExpected = (payoff.skip[0] + payoff.skip[1]) / 2;
  
  // Normalize to probabilities
  const total = harvestExpected + skipExpected;
  const harvestProb = harvestExpected / total;
  const skipProb = skipExpected / total;
  
  return [harvestProb, skipProb];
}

// Random number generator with seed for reproducibility
class SeededRandom {
  private seed: number;
  
  constructor(seed: number = 42) {
    this.seed = seed;
  }
  
  random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

function runSimulation(params: SimulationParams): SimulationResults {
  const { numFarmers, numSeasons } = params;
  const commodities = params.commodities || ['Wheat', 'Corn'];
  const payoffMatrices = params.customPayoffs || defaultPayoffMatrices;
  
  // Initialize random generator for reproducibility
  const rng = new SeededRandom(42);
  
  // Initialize result structures
  const strategies: Record<string, number[][]> = {};
  const rewards: Record<string, number[]> = {};
  const totalRewardsByFarmer: number[] = new Array(numFarmers).fill(0);
  const nashEquilibrium: Record<string, [number, number]> = {};
  
  // Setup data structures for each commodity
  commodities.forEach(commodity => {
    strategies[commodity] = Array(numFarmers).fill(null).map(() => Array(numSeasons).fill(0));
    rewards[commodity] = Array(numFarmers).fill(0);
    
    if (!payoffMatrices[commodity]) {
      throw new Error(`No payoff matrix defined for commodity: ${commodity}`);
    }
    
    // Calculate Nash equilibrium for this commodity
    nashEquilibrium[commodity] = findMixedStrategy(payoffMatrices[commodity]);
  });
  
  // Run simulation for each commodity
  commodities.forEach(commodity => {
    const payoff = payoffMatrices[commodity];
    const [harvestProb] = nashEquilibrium[commodity];
    
    for (let season = 0; season < numSeasons; season++) {
      for (let farmer = 0; farmer < numFarmers; farmer++) {
        // Choose strategy based on mixed strategy equilibrium
        const chosenStrategy = rng.random() < harvestProb ? 0 : 1; // 0 = Harvest, 1 = Skip
        strategies[commodity][farmer][season] = chosenStrategy;
        
        // Calculate reward based on strategy
        let reward: number;
        if (chosenStrategy === 0) {
          // Harvest now - use average of payoffs
          reward = (payoff.harvestNow[0] + payoff.harvestNow[1]) / 2;
        } else {
          // Skip - use average of payoffs
          reward = (payoff.skip[0] + payoff.skip[1]) / 2;
        }
        
        rewards[commodity][farmer] += reward;
        totalRewardsByFarmer[farmer] += reward;
      }
    }
  });
  
  return {
    strategies,
    rewards,
    totalRewardsByFarmer,
    nashEquilibrium
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      // Handle GET request with query parameters
      const url = new URL(req.url);
      const numFarmers = parseInt(url.searchParams.get('numFarmers') || '3');
      const numSeasons = parseInt(url.searchParams.get('numSeasons') || '10');
      const commoditiesParam = url.searchParams.get('commodities');
      const commodities = commoditiesParam ? commoditiesParam.split(',') : undefined;
      
      // Validate parameters
      if (numFarmers < 2 || numFarmers > 20) {
        throw new Error('Number of farmers must be between 2 and 20');
      }
      if (numSeasons < 5 || numSeasons > 50) {
        throw new Error('Number of seasons must be between 5 and 50');
      }
      
      const results = runSimulation({ numFarmers, numSeasons, commodities });
      
      return new Response(JSON.stringify({
        success: true,
        parameters: { numFarmers, numSeasons, commodities: commodities || ['Wheat', 'Corn'] },
        results,
        metadata: {
          description: 'Crop harvest game theory simulation with inversely correlated commodities',
          strategies: {
            '0': 'Harvest Now',
            '1': 'Skip (Future Harvest)'
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } else if (req.method === 'POST') {
      // Handle POST request with full parameters
      const body = await req.json();
      const { numFarmers = 3, numSeasons = 10, commodities, customPayoffs } = body;
      
      // Validate parameters
      if (numFarmers < 2 || numFarmers > 20) {
        throw new Error('Number of farmers must be between 2 and 20');
      }
      if (numSeasons < 5 || numSeasons > 50) {
        throw new Error('Number of seasons must be between 5 and 50');
      }
      
      const results = runSimulation({ numFarmers, numSeasons, commodities, customPayoffs });
      
      return new Response(JSON.stringify({
        success: true,
        parameters: { numFarmers, numSeasons, commodities: commodities || ['Wheat', 'Corn'] },
        results,
        payoffMatrices: customPayoffs || defaultPayoffMatrices,
        metadata: {
          description: 'Crop harvest game theory simulation with custom parameters',
          strategies: {
            '0': 'Harvest Now',
            '1': 'Skip (Future Harvest)'
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } else {
      throw new Error('Method not allowed');
    }
    
  } catch (error) {
    console.error('Error in crop-harvest-simulation function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});