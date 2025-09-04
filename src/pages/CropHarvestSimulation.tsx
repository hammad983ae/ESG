import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart
} from 'recharts';
import { 
  Wheat, 
  Grape, 
  Sprout, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';

interface SimulationResults {
  strategies: Record<string, number[][]>;
  rewards: Record<string, number[]>;
  totalRewardsByFarmer: number[];
  nashEquilibrium: Record<string, [number, number]>;
}

interface SimulationResponse {
  success: boolean;
  parameters: {
    numFarmers: number;
    numSeasons: number;
    commodities: string[];
  };
  results: SimulationResults;
  metadata?: any;
}

interface MarketData {
  commodity: string;
  currentPrice: number;
  priceChange: number;
  volatility: number;
  demandIndex: number;
}

const CropHarvestSimulation: React.FC = () => {
  const { toast } = useToast();
  
  // Simulation parameters
  const [numFarmers, setNumFarmers] = useState([3]);
  const [numSeasons, setNumSeasons] = useState([10]);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(['Wheat', 'Corn']);
  const [includeRealTimeData, setIncludeRealTimeData] = useState(false);
  const [marketComplexity, setMarketComplexity] = useState<'simple' | 'advanced'>('simple');
  
  // Simulation state
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRun, setIsAutoRun] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  
  // Available commodities with icons
  const commodityOptions = [
    { name: 'Wheat', icon: Wheat, color: '#F59E0B' },
    { name: 'Corn', icon: Grape, color: '#10B981' },
    { name: 'Soybeans', icon: Sprout, color: '#8B5CF6' }
  ];

  // Simulate real-world market data
  const generateMarketData = (): MarketData[] => {
    return selectedCommodities.map(commodity => ({
      commodity,
      currentPrice: Math.random() * 500 + 200, // $200-$700 per ton
      priceChange: (Math.random() - 0.5) * 20, // -10% to +10%
      volatility: Math.random() * 0.3 + 0.1, // 10-40% volatility
      demandIndex: Math.random() * 100 + 50 // 50-150 demand index
    }));
  };

  // Run simulation
  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crop-harvest-simulation', {
        body: {
          numFarmers: numFarmers[0],
          numSeasons: numSeasons[0],
          commodities: selectedCommodities,
          ...(includeRealTimeData && { marketData: generateMarketData() })
        }
      });

      if (error) throw error;

      setSimulationData(data);
      setMarketData(generateMarketData());
      
      toast({
        title: "Simulation Complete",
        description: `Analyzed ${numFarmers[0]} farmers over ${numSeasons[0]} seasons`,
      });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run simulation when parameters change
  useEffect(() => {
    if (isAutoRun && selectedCommodities.length > 0) {
      runSimulation();
    }
  }, [numFarmers[0], numSeasons[0], selectedCommodities, includeRealTimeData, isAutoRun]);

  // Prepare chart data for strategies over time
  const prepareStrategyChartData = () => {
    if (!simulationData) return [];
    
    const { strategies } = simulationData.results;
    const data = [];
    
    for (let season = 0; season < numSeasons[0]; season++) {
      const seasonData: any = { season: season + 1 };
      
      selectedCommodities.forEach(commodity => {
        let harvestCount = 0;
        for (let farmer = 0; farmer < numFarmers[0]; farmer++) {
          if (strategies[commodity][farmer][season] === 0) harvestCount++;
        }
        seasonData[`${commodity}_harvest_rate`] = (harvestCount / numFarmers[0]) * 100;
      });
      
      data.push(seasonData);
    }
    
    return data;
  };

  // Prepare chart data for rewards
  const prepareRewardsChartData = () => {
    if (!simulationData) return [];
    
    const { rewards } = simulationData.results;
    const data = [];
    
    for (let farmer = 0; farmer < numFarmers[0]; farmer++) {
      const farmerData: any = { farmer: `Farmer ${farmer + 1}` };
      
      selectedCommodities.forEach(commodity => {
        farmerData[commodity] = Math.round(rewards[commodity][farmer]);
      });
      
      data.push(farmerData);
    }
    
    return data;
  };

  // Prepare Nash equilibrium data
  const prepareNashData = () => {
    if (!simulationData) return [];
    
    const { nashEquilibrium } = simulationData.results;
    
    return selectedCommodities.map(commodity => ({
      commodity,
      harvestProbability: Math.round(nashEquilibrium[commodity][0] * 100),
      skipProbability: Math.round(nashEquilibrium[commodity][1] * 100)
    }));
  };

  const strategyChartData = prepareStrategyChartData();
  const rewardsChartData = prepareRewardsChartData();
  const nashData = prepareNashData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Crop Harvest Game Theory Simulation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analyze strategic decision-making among farmers using game theory with real-world market dynamics
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Simulation Parameters
            </CardTitle>
            <CardDescription>
              Configure the simulation parameters and market conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Number of Farmers */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Farmers: {numFarmers[0]}
                </Label>
                <Slider
                  value={numFarmers}
                  onValueChange={setNumFarmers}
                  min={2}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Number of Seasons */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Seasons: {numSeasons[0]}
                </Label>
                <Slider
                  value={numSeasons}
                  onValueChange={setNumSeasons}
                  min={5}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Market Complexity */}
              <div className="space-y-2">
                <Label>Market Complexity</Label>
                <Select value={marketComplexity} onValueChange={(value: 'simple' | 'advanced') => setMarketComplexity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Real-time Data Toggle */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Real-time Market Data
                </Label>
                <Switch
                  checked={includeRealTimeData}
                  onCheckedChange={setIncludeRealTimeData}
                />
              </div>
            </div>

            {/* Commodity Selection */}
            <div className="space-y-2">
              <Label>Select Commodities</Label>
              <div className="flex flex-wrap gap-2">
                {commodityOptions.map(({ name, icon: Icon, color }) => (
                  <Badge
                    key={name}
                    variant={selectedCommodities.includes(name) ? "default" : "outline"}
                    className="cursor-pointer p-2"
                    style={{ backgroundColor: selectedCommodities.includes(name) ? color : undefined }}
                    onClick={() => {
                      if (selectedCommodities.includes(name)) {
                        setSelectedCommodities(prev => prev.filter(c => c !== name));
                      } else {
                        setSelectedCommodities(prev => [...prev, name]);
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={runSimulation} disabled={isLoading || selectedCommodities.length === 0}>
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                Run Simulation
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAutoRun(!isAutoRun)}
              >
                {isAutoRun ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Auto-run: {isAutoRun ? 'On' : 'Off'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Data Overview */}
        {includeRealTimeData && marketData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketData.map((market) => (
                  <div key={market.commodity} className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{market.commodity}</h3>
                      <Badge variant={market.priceChange > 0 ? "default" : "destructive"}>
                        {market.priceChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {market.priceChange.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Price: ${market.currentPrice.toFixed(2)}/ton</div>
                      <div>Volatility: {(market.volatility * 100).toFixed(1)}%</div>
                      <div>Demand Index: {market.demandIndex.toFixed(0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {simulationData && (
          <Tabs defaultValue="strategies" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="strategies">Strategy Analysis</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="equilibrium">Nash Equilibrium</TabsTrigger>
              <TabsTrigger value="insights">Market Insights</TabsTrigger>
            </TabsList>

            {/* Strategy Analysis Tab */}
            <TabsContent value="strategies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Strategies Over Time</CardTitle>
                  <CardDescription>
                    Percentage of farmers choosing to harvest now vs skip for future harvest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={strategyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="season" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
                      <Legend />
                      {selectedCommodities.map((commodity, index) => (
                        <Line
                          key={commodity}
                          type="monotone"
                          dataKey={`${commodity}_harvest_rate`}
                          stroke={commodityOptions.find(c => c.name === commodity)?.color}
                          strokeWidth={2}
                          name={`${commodity} Harvest Rate`}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Rewards by Farmer</CardTitle>
                    <CardDescription>
                      Comparative performance across all commodities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={rewardsChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="farmer" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedCommodities.map((commodity) => (
                          <Bar
                            key={commodity}
                            dataKey={commodity}
                            fill={commodityOptions.find(c => c.name === commodity)?.color}
                            name={commodity}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>
                      Key statistics from the simulation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {simulationData.results.totalRewardsByFarmer.map((reward, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-secondary/30 rounded">
                        <span>Farmer {index + 1}</span>
                        <Badge variant="outline">${Math.round(reward)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nash Equilibrium Tab */}
            <TabsContent value="equilibrium" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Nash Equilibrium Analysis</CardTitle>
                  <CardDescription>
                    Optimal mixed strategies for each commodity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nashData.map((data) => (
                      <div key={data.commodity} className="bg-secondary/30 rounded-lg p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          {React.createElement(
                            commodityOptions.find(c => c.name === data.commodity)?.icon || Wheat,
                            { className: "h-5 w-5" }
                          )}
                          {data.commodity}
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Harvest Now', value: data.harvestProbability, fill: '#10B981' },
                                { name: 'Skip', value: data.skipProbability, fill: '#F59E0B' }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Tooltip formatter={(value) => `${value}%`} />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Harvest Now:</span>
                            <span className="font-semibold">{data.harvestProbability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Skip:</span>
                            <span className="font-semibold">{data.skipProbability}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Market Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Strategy Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Findings:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Inversely correlated commodities show different harvest patterns</li>
                        <li>• Farmers adapt strategies based on market conditions</li>
                        <li>• Nash equilibrium predicts optimal mixed strategies</li>
                        <li>• Real-time data influences decision making</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Dynamics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Market Effects:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Higher volatility increases strategic uncertainty</li>
                        <li>• Demand fluctuations affect harvest timing</li>
                        <li>• Price trends influence farmer behavior</li>
                        <li>• Competition creates strategic interactions</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* No Data State */}
        {!simulationData && (
          <Card className="text-center p-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ready to Simulate</h3>
                <p className="text-muted-foreground">
                  Configure your parameters above and run the simulation to see strategic farming decisions unfold.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CropHarvestSimulation;