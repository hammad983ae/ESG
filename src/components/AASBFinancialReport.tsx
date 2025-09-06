import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  CalendarIcon,
  Download,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  Building2,
  Users,
  Target,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FinancialData {
  // Balance Sheet Data
  cash: number;
  accountsReceivable: number;
  inventory: number;
  currentAssets: number;
  propertyPlantEquipment: number;
  totalAssets: number;
  accountsPayable: number;
  currentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  shareCapital: number;
  retainedEarnings: number;
  totalEquity: number;

  // Income Statement Data
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  ebitda: number;
  depreciationAmortisation: number;
  ebit: number;
  interestExpense: number;
  profitBeforeTax: number;
  incomeTax: number;
  netProfit: number;

  // Cash Flow Data
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;

  // Company Information
  companyName: string;
  abn: string;
  reportingPeriod: string;
  industryCode: string;
  auditFirm: string;
}

export const AASBFinancialReport = () => {
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState<FinancialData>({
    // Initialize with sample data for demonstration
    cash: 250000,
    accountsReceivable: 180000,
    inventory: 320000,
    currentAssets: 750000,
    propertyPlantEquipment: 2400000,
    totalAssets: 3150000,
    accountsPayable: 150000,
    currentLiabilities: 280000,
    longTermDebt: 800000,
    totalLiabilities: 1080000,
    shareCapital: 1000000,
    retainedEarnings: 1070000,
    totalEquity: 2070000,
    revenue: 3200000,
    costOfSales: 1920000,
    grossProfit: 1280000,
    operatingExpenses: 840000,
    ebitda: 440000,
    depreciationAmortisation: 120000,
    ebit: 320000,
    interestExpense: 48000,
    profitBeforeTax: 272000,
    incomeTax: 81600,
    netProfit: 190400,
    operatingCashFlow: 310400,
    investingCashFlow: -200000,
    financingCashFlow: -50000,
    netCashFlow: 60400,
    companyName: "",
    abn: "",
    reportingPeriod: "2024",
    industryCode: "",
    auditFirm: ""
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculated ratios and metrics
  const currentRatio = financialData.currentAssets / financialData.currentLiabilities;
  const debtToEquityRatio = financialData.totalLiabilities / financialData.totalEquity;
  const returnOnAssets = (financialData.netProfit / financialData.totalAssets) * 100;
  const returnOnEquity = (financialData.netProfit / financialData.totalEquity) * 100;
  const grossProfitMargin = (financialData.grossProfit / financialData.revenue) * 100;
  const netProfitMargin = (financialData.netProfit / financialData.revenue) * 100;
  const assetTurnover = financialData.revenue / financialData.totalAssets;

  const updateFinancialData = (field: keyof FinancialData, value: string | number) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const generateAIInsight = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for AI analysis",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('financial-ai-analyst', {
        body: {
          financialData,
          prompt: aiPrompt,
          ratios: {
            currentRatio,
            debtToEquityRatio,
            returnOnAssets,
            returnOnEquity,
            grossProfitMargin,
            netProfitMargin,
            assetTurnover
          }
        }
      });

      if (error) throw error;
      
      setAiResponse(data.analysis);
      toast({
        title: "AI Analysis Generated",
        description: "Financial insights have been generated successfully",
      });
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const prepopulateData = (templateType: string) => {
    const templates = {
      'agriculture': {
        companyName: "Sustainable Farms Ltd",
        abn: "12 345 678 901",
        industryCode: "A011 - Crop and Plant Growing",
        revenue: 2800000,
        costOfSales: 1680000,
        grossProfit: 1120000,
        operatingExpenses: 720000,
        inventory: 450000,
        propertyPlantEquipment: 3200000,
        // ... more agriculture-specific values
      },
      'manufacturing': {
        companyName: "Tech Manufacturing Pty Ltd",
        abn: "98 765 432 109",
        industryCode: "C25 - Fabricated Metal Product Manufacturing",
        revenue: 5600000,
        costOfSales: 3360000,
        grossProfit: 2240000,
        operatingExpenses: 1400000,
        inventory: 680000,
        propertyPlantEquipment: 4200000,
        // ... more manufacturing-specific values
      },
      'services': {
        companyName: "Professional Services Group",
        abn: "11 222 333 444",
        industryCode: "M69 - Professional, Scientific and Technical Services",
        revenue: 1800000,
        costOfSales: 720000,
        grossProfit: 1080000,
        operatingExpenses: 800000,
        inventory: 50000,
        propertyPlantEquipment: 800000,
        // ... more services-specific values
      }
    };

    const template = templates[templateType as keyof typeof templates];
    if (template) {
      setFinancialData(prev => ({ ...prev, ...template }));
      toast({
        title: "Template Applied",
        description: `${templateType} industry template has been loaded`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            AASB Annual Financial Report Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Create professional AASB-compliant annual financial reports with AI-enhanced insights and analysis.
          </p>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Start Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => prepopulateData('agriculture')} variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Agriculture Template
            </Button>
            <Button onClick={() => prepopulateData('manufacturing')} variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Manufacturing Template
            </Button>
            <Button onClick={() => prepopulateData('services')} variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Services Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="company-info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Company Information */}
        <TabsContent value="company-info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={financialData.companyName}
                    onChange={(e) => updateFinancialData('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ABN</Label>
                  <Input
                    value={financialData.abn}
                    onChange={(e) => updateFinancialData('abn', e.target.value)}
                    placeholder="XX XXX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reporting Period</Label>
                  <Select value={financialData.reportingPeriod} onValueChange={(value) => updateFinancialData('reportingPeriod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Industry Code</Label>
                  <Input
                    value={financialData.industryCode}
                    onChange={(e) => updateFinancialData('industryCode', e.target.value)}
                    placeholder="ANZSIC Industry Code"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audit Firm</Label>
                  <Input
                    value={financialData.auditFirm}
                    onChange={(e) => updateFinancialData('auditFirm', e.target.value)}
                    placeholder="External auditor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Report Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statement of Financial Position (Balance Sheet)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Assets */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Assets</h3>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Current Assets</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Cash and Cash Equivalents</Label>
                        <Input
                          type="number"
                          value={financialData.cash}
                          onChange={(e) => updateFinancialData('cash', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Accounts Receivable</Label>
                        <Input
                          type="number"
                          value={financialData.accountsReceivable}
                          onChange={(e) => updateFinancialData('accountsReceivable', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Inventory</Label>
                        <Input
                          type="number"
                          value={financialData.inventory}
                          onChange={(e) => updateFinancialData('inventory', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-semibold">
                        <Label className="text-sm">Total Current Assets</Label>
                        <div className="px-3 py-2 bg-muted rounded">
                          ${(financialData.cash + financialData.accountsReceivable + financialData.inventory).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Non-Current Assets</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Property, Plant & Equipment</Label>
                        <Input
                          type="number"
                          value={financialData.propertyPlantEquipment}
                          onChange={(e) => updateFinancialData('propertyPlantEquipment', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-bold text-lg border-t pt-2">
                      <Label>TOTAL ASSETS</Label>
                      <div className="px-3 py-2 bg-primary/10 rounded">
                        ${(financialData.cash + financialData.accountsReceivable + financialData.inventory + financialData.propertyPlantEquipment).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Liabilities and Equity */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Liabilities and Equity</h3>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Current Liabilities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Accounts Payable</Label>
                        <Input
                          type="number"
                          value={financialData.accountsPayable}
                          onChange={(e) => updateFinancialData('accountsPayable', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-semibold">
                        <Label className="text-sm">Total Current Liabilities</Label>
                        <div className="px-3 py-2 bg-muted rounded">
                          ${financialData.accountsPayable.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Non-Current Liabilities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Long-term Debt</Label>
                        <Input
                          type="number"
                          value={financialData.longTermDebt}
                          onChange={(e) => updateFinancialData('longTermDebt', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-semibold">
                        <Label className="text-sm">Total Liabilities</Label>
                        <div className="px-3 py-2 bg-muted rounded">
                          ${(financialData.accountsPayable + financialData.longTermDebt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Equity</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Share Capital</Label>
                        <Input
                          type="number"
                          value={financialData.shareCapital}
                          onChange={(e) => updateFinancialData('shareCapital', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Label className="text-sm">Retained Earnings</Label>
                        <Input
                          type="number"
                          value={financialData.retainedEarnings}
                          onChange={(e) => updateFinancialData('retainedEarnings', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-semibold">
                        <Label className="text-sm">Total Equity</Label>
                        <div className="px-3 py-2 bg-muted rounded">
                          ${(financialData.shareCapital + financialData.retainedEarnings).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-bold text-lg border-t pt-2">
                      <Label>TOTAL LIABILITIES & EQUITY</Label>
                      <div className="px-3 py-2 bg-primary/10 rounded">
                        ${(financialData.accountsPayable + financialData.longTermDebt + financialData.shareCapital + financialData.retainedEarnings).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Income Statement */}
        <TabsContent value="income-statement">
          <Card>
            <CardHeader>
              <CardTitle>Statement of Profit or Loss and Other Comprehensive Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <div className="grid grid-cols-2 gap-2">
                  <Label>Revenue</Label>
                  <Input
                    type="number"
                    value={financialData.revenue}
                    onChange={(e) => updateFinancialData('revenue', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Cost of Sales</Label>
                  <Input
                    type="number"
                    value={financialData.costOfSales}
                    onChange={(e) => updateFinancialData('costOfSales', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 font-semibold">
                  <Label>Gross Profit</Label>
                  <div className="px-3 py-2 bg-muted rounded">
                    ${(financialData.revenue - financialData.costOfSales).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Operating Expenses</Label>
                  <Input
                    type="number"
                    value={financialData.operatingExpenses}
                    onChange={(e) => updateFinancialData('operatingExpenses', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 font-semibold">
                  <Label>EBITDA</Label>
                  <div className="px-3 py-2 bg-muted rounded">
                    ${(financialData.revenue - financialData.costOfSales - financialData.operatingExpenses).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Depreciation & Amortisation</Label>
                  <Input
                    type="number"
                    value={financialData.depreciationAmortisation}
                    onChange={(e) => updateFinancialData('depreciationAmortisation', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 font-semibold">
                  <Label>EBIT</Label>
                  <div className="px-3 py-2 bg-muted rounded">
                    ${(financialData.revenue - financialData.costOfSales - financialData.operatingExpenses - financialData.depreciationAmortisation).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Interest Expense</Label>
                  <Input
                    type="number"
                    value={financialData.interestExpense}
                    onChange={(e) => updateFinancialData('interestExpense', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 font-semibold">
                  <Label>Profit Before Tax</Label>
                  <div className="px-3 py-2 bg-muted rounded">
                    ${(financialData.revenue - financialData.costOfSales - financialData.operatingExpenses - financialData.depreciationAmortisation - financialData.interestExpense).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label>Income Tax</Label>
                  <Input
                    type="number"
                    value={financialData.incomeTax}
                    onChange={(e) => updateFinancialData('incomeTax', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 font-bold text-lg border-t pt-2">
                  <Label>NET PROFIT</Label>
                  <div className="px-3 py-2 bg-primary/10 rounded">
                    ${(financialData.revenue - financialData.costOfSales - financialData.operatingExpenses - financialData.depreciationAmortisation - financialData.interestExpense - financialData.incomeTax).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Statement */}
        <TabsContent value="cash-flow">
          <Card>
            <CardHeader>
              <CardTitle>Statement of Cash Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <div className="space-y-3">
                  <h4 className="font-medium">Operating Activities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="text-sm">Operating Cash Flow</Label>
                    <Input
                      type="number"
                      value={financialData.operatingCashFlow}
                      onChange={(e) => updateFinancialData('operatingCashFlow', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Investing Activities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="text-sm">Investing Cash Flow</Label>
                    <Input
                      type="number"
                      value={financialData.investingCashFlow}
                      onChange={(e) => updateFinancialData('investingCashFlow', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Financing Activities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="text-sm">Financing Cash Flow</Label>
                    <Input
                      type="number"
                      value={financialData.financingCashFlow}
                      onChange={(e) => updateFinancialData('financingCashFlow', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 font-bold text-lg border-t pt-2">
                  <Label>NET CASH FLOW</Label>
                  <div className="px-3 py-2 bg-primary/10 rounded">
                    ${(financialData.operatingCashFlow + financialData.investingCashFlow + financialData.financingCashFlow).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Ratios */}
        <TabsContent value="ratios">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Liquidity Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current Ratio:</span>
                  <Badge variant={currentRatio > 1.5 ? "default" : "destructive"}>
                    {currentRatio.toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Leverage Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Debt-to-Equity:</span>
                  <Badge variant={debtToEquityRatio < 1 ? "default" : "destructive"}>
                    {debtToEquityRatio.toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Profitability Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">ROA:</span>
                  <Badge variant="secondary">{returnOnAssets.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ROE:</span>
                  <Badge variant="secondary">{returnOnEquity.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Net Margin:</span>
                  <Badge variant="secondary">{netProfitMargin.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Efficiency Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Asset Turnover:</span>
                  <Badge variant="secondary">{assetTurnover.toFixed(2)}x</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="ai-insights">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Financial Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate AI-powered insights, recommendations, and report sections based on your financial data.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Analysis Prompt</Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="E.g., 'Analyze our financial performance and provide recommendations for improving profitability' or 'Generate director's commentary on the annual results'"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={generateAIInsight} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Generating Analysis...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate AI Analysis
                    </>
                  )}
                </Button>
                
                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAiPrompt("Analyze our financial performance compared to industry benchmarks and provide strategic recommendations.")}
                  >
                    Financial Performance Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAiPrompt("Generate a professional director's commentary section for our annual report highlighting key achievements and challenges.")}
                  >
                    Director's Commentary
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAiPrompt("Identify potential financial risks and provide risk mitigation strategies based on our current financial position.")}
                  >
                    Risk Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAiPrompt("Create an executive summary highlighting our key financial metrics and business performance for stakeholders.")}
                  >
                    Executive Summary
                  </Button>
                </div>
              </CardContent>
            </Card>

            {aiResponse && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                      {aiResponse}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export to Word
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Financial Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button>
              <Calculator className="mr-2 h-4 w-4" />
              Generate XBRL
            </Button>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};