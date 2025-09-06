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
import { Switch } from "@/components/ui/switch";
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
  Activity,
  Shield,
  Globe,
  Award,
  BookOpen,
  PieChart,
  Briefcase,
  Scale,
  Heart,
  Leaf,
  UserCheck,
  Lock,
  Gavel
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompanyData {
  companyName: string;
  abn: string;
  acn: string;
  industry: string;
  reportingPeriod: string;
  auditFirm: string;
  
  // Financial Data
  revenue: number;
  netProfit: number;
  totalAssets: number;
  totalEquity: number;
  totalLiabilities: number;
  operatingCashFlow: number;
  
  // Business Overview
  chairMessage: string;
  ceoMessage: string;
  businessOverview: string;
  strategyStatement: string;
  operatingEnvironment: string;
  
  // Sustainability
  sustainabilityApproach: string;
  customersSection: string;
  colleaguesSection: string;
  climateEnvironment: string;
  technologySecurity: string;
  humanRights: string;
  communityImpact: string;
  
  // Corporate Governance
  governanceFramework: string;
  boardComposition: string;
  executiveTeam: string;
  keyActivities: string;
  boardDiversity: string;
  committees: string;
  conductCulture: string;
  
  // Risk Management
  riskOverview: string;
  riskFactors: string;
  
  // Directors Report
  operatingReview: string;
  directorsInfo: string;
  remunerationReport: string;
}

const INDUSTRY_TEMPLATES = {
  agriculture: {
    companyName: "Sustainable Agriculture Corp",
    industry: "A01 - Agriculture, Forestry and Fishing",
    businessOverview: "We are a leading sustainable agriculture company focusing on innovative farming practices and environmental stewardship.",
    strategyStatement: "Our strategy centers on sustainable crop production, precision agriculture technology, and supply chain optimization.",
    sustainabilityApproach: "Committed to regenerative farming practices that restore soil health and biodiversity while maintaining profitability.",
    customersSection: "Serving major food processors, retailers, and export markets with premium quality agricultural products.",
    climateEnvironment: "Climate resilience through drought-resistant crops, water conservation, and carbon sequestration initiatives.",
  },
  manufacturing: {
    companyName: "Advanced Manufacturing Ltd",
    industry: "C - Manufacturing",
    businessOverview: "A technology-driven manufacturing company specializing in precision components and advanced materials.",
    strategyStatement: "Focus on Industry 4.0 automation, lean manufacturing, and sustainable production processes.",
    sustainabilityApproach: "Implementing circular economy principles, waste reduction, and energy efficiency across all operations.",
    customersSection: "Supplying automotive, aerospace, and industrial equipment manufacturers globally.",
    climateEnvironment: "Carbon neutral manufacturing through renewable energy adoption and process optimization.",
  },
  services: {
    companyName: "Professional Services Group",
    industry: "M69 - Professional, Scientific and Technical Services", 
    businessOverview: "Providing comprehensive professional services including consulting, advisory, and technical expertise.",
    strategyStatement: "Digital transformation of service delivery with focus on client outcomes and operational excellence.",
    sustainabilityApproach: "Supporting client sustainability goals through expert advisory services and innovative solutions.",
    customersSection: "Serving Fortune 500 companies, government agencies, and emerging growth businesses.",
    climateEnvironment: "Remote-first operations reducing carbon footprint while maintaining service quality.",
  },
  technology: {
    companyName: "Innovation Tech Solutions",
    industry: "J - Information Media and Telecommunications",
    businessOverview: "Cutting-edge technology solutions provider specializing in AI, cloud services, and digital transformation.",
    strategyStatement: "Leading digital innovation through R&D investment, strategic partnerships, and agile development.",
    sustainabilityApproach: "Green technology solutions that help clients reduce environmental impact while improving efficiency.",
    customersSection: "Enterprise clients across finance, healthcare, retail, and government sectors.",
    climateEnvironment: "Carbon-negative cloud infrastructure and sustainable technology development practices.",
  },
  mining: {
    companyName: "Responsible Mining Co",
    industry: "B - Mining",
    businessOverview: "Sustainable mining operations with focus on responsible resource extraction and community partnership.",
    strategyStatement: "ESG-first mining approach prioritizing safety, environmental protection, and stakeholder value.",
    sustainabilityApproach: "Leading industry practices in land rehabilitation, water management, and biodiversity conservation.",
    customersSection: "Supplying steel manufacturers, battery producers, and industrial users with critical minerals.",
    climateEnvironment: "Net-zero mining operations through renewable energy and innovative extraction technologies.",
  },
  finance: {
    companyName: "Future Financial Services",
    industry: "K - Financial and Insurance Services",
    businessOverview: "Digital-first financial institution providing innovative banking, lending, and investment solutions.",
    strategyStatement: "Democratizing finance through technology, data analytics, and customer-centric product development.",
    sustainabilityApproach: "Sustainable finance leadership through green lending, ESG investment products, and financial inclusion.",
    customersSection: "Serving retail customers, SMEs, and institutional clients with tailored financial solutions.",
    climateEnvironment: "Climate risk assessment, green bonds, and transition finance supporting Australia's net-zero goals.",
  }
};

const REPORT_SECTIONS = [
  { id: "business-overview", label: "Business Overview", icon: Building2 },
  { id: "sustainability", label: "Sustainability", icon: Leaf },
  { id: "governance", label: "Corporate Governance", icon: Shield },
  { id: "risk-management", label: "Risk Management", icon: AlertCircle },
  { id: "directors-report", label: "Directors' Report", icon: Users },
  { id: "financial-statements", label: "Financial Statements", icon: BarChart3 },
  { id: "additional-info", label: "Additional Information", icon: BookOpen },
  { id: "ai-enhancement", label: "AI Enhancement", icon: Sparkles }
];

export const AASBFinancialReport = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("business-overview");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Section inclusion state - all sections enabled by default except AI enhancement
  const [sectionInclusion, setSectionInclusion] = useState<Record<string, boolean>>({
    "business-overview": true,
    "sustainability": true,
    "governance": true,
    "risk-management": true,
    "directors-report": true,
    "financial-statements": true,
    "additional-info": true,
    "ai-enhancement": false, // Keep AI enhancement disabled by default
  });
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: "",
    abn: "",
    acn: "",
    industry: "",
    reportingPeriod: "2024",
    auditFirm: "",
    
    revenue: 0,
    netProfit: 0,
    totalAssets: 0,
    totalEquity: 0,
    totalLiabilities: 0,
    operatingCashFlow: 0,
    
    chairMessage: "",
    ceoMessage: "",
    businessOverview: "",
    strategyStatement: "",
    operatingEnvironment: "",
    
    sustainabilityApproach: "",
    customersSection: "",
    colleaguesSection: "",
    climateEnvironment: "",
    technologySecurity: "",
    humanRights: "",
    communityImpact: "",
    
    governanceFramework: "",
    boardComposition: "",
    executiveTeam: "",
    keyActivities: "",
    boardDiversity: "",
    committees: "",
    conductCulture: "",
    
    riskOverview: "",
    riskFactors: "",
    
    operatingReview: "",
    directorsInfo: "",
    remunerationReport: ""
  });

  const updateData = (field: keyof CompanyData, value: string | number) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSectionInclusion = (sectionId: string) => {
    setSectionInclusion(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleAllSections = (include: boolean) => {
    const newInclusion: Record<string, boolean> = {};
    REPORT_SECTIONS.forEach(section => {
      newInclusion[section.id] = include;
    });
    setSectionInclusion(newInclusion);
  };

  const applyIndustryTemplate = (industry: string) => {
    const template = INDUSTRY_TEMPLATES[industry as keyof typeof INDUSTRY_TEMPLATES];
    if (template) {
      setCompanyData(prev => ({
        ...prev,
        ...template
      }));
      setSelectedIndustry(industry);
      toast({
        title: "Template Applied",
        description: `${industry.charAt(0).toUpperCase() + industry.slice(1)} industry template loaded successfully.`,
      });
    }
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a specific prompt for AI generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('financial-ai-analyst', {
        body: {
          companyData,
          prompt: aiPrompt,
          reportingPeriod: companyData.reportingPeriod,
          industry: companyData.industry
        }
      });

      if (error) throw error;
      
      setAiResponse(data.analysis);
      toast({
        title: "AI Content Generated",
        description: "Professional AASB-compliant content has been generated successfully",
      });
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderBusinessOverview = () => (
    <div className="space-y-6">
      {/* Our Business Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Our Business in {companyData.reportingPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Business Overview</Label>
            <Textarea 
              placeholder="Describe your business activities, market position, and key achievements..."
              value={companyData.businessOverview}
              onChange={(e) => updateData('businessOverview', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chair's Message */}
      <Card>
        <CardHeader>
          <CardTitle>Chair's Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Chair's strategic overview and message to stakeholders..."
            value={companyData.chairMessage}
            onChange={(e) => updateData('chairMessage', e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      {/* CEO's Message */}
      <Card>
        <CardHeader>
          <CardTitle>CEO's Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="CEO's operational review and strategic outlook..."
            value={companyData.ceoMessage}
            onChange={(e) => updateData('ceoMessage', e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategy & Creating Value
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Strategy Statement</Label>
            <Textarea 
              placeholder="Outline your strategic priorities and value creation approach..."
              value={companyData.strategyStatement}
              onChange={(e) => updateData('strategyStatement', e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label>Operating Environment</Label>
            <Textarea 
              placeholder="Describe the operating environment and market conditions..."
              value={companyData.operatingEnvironment}
              onChange={(e) => updateData('operatingEnvironment', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSustainability = () => (
    <div className="space-y-6">
      {/* Sustainability Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Sustainability Approach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Describe your sustainability strategy, commitments, and framework..."
            value={companyData.sustainabilityApproach}
            onChange={(e) => updateData('sustainabilityApproach', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Customer focus, satisfaction initiatives, and value delivery..."
            value={companyData.customersSection}
            onChange={(e) => updateData('customersSection', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Colleagues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Colleagues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Employee engagement, development, diversity, and workplace culture..."
            value={companyData.colleaguesSection}
            onChange={(e) => updateData('colleaguesSection', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Climate Change & Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Climate Change and Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Climate strategy, environmental initiatives, and sustainability targets..."
            value={companyData.climateEnvironment}
            onChange={(e) => updateData('climateEnvironment', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Technology, Data & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Technology, Data and Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Technology strategy, data governance, cybersecurity, and digital transformation..."
            value={companyData.technologySecurity}
            onChange={(e) => updateData('technologySecurity', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Human Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Respecting Human Rights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Human rights approach, supply chain ethics, and social responsibility..."
            value={companyData.humanRights}
            onChange={(e) => updateData('humanRights', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Community Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Helping Our Communities Prosper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Community investment, partnerships, and social impact initiatives..."
            value={companyData.communityImpact}
            onChange={(e) => updateData('communityImpact', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      {/* Corporate Governance Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Corporate Governance Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Governance structure, principles, and framework overview..."
            value={companyData.governanceFramework}
            onChange={(e) => updateData('governanceFramework', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Board of Directors */}
      <Card>
        <CardHeader>
          <CardTitle>Board of Directors</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Board composition, director profiles, skills, and experience..."
            value={companyData.boardComposition}
            onChange={(e) => updateData('boardComposition', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Executive Leadership Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Executive Leadership Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Executive team profiles, responsibilities, and leadership structure..."
            value={companyData.executiveTeam}
            onChange={(e) => updateData('executiveTeam', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Key Board Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Key Board Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Board activities, meetings, key decisions, and strategic oversight..."
            value={companyData.keyActivities}
            onChange={(e) => updateData('keyActivities', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Board Diversity */}
      <Card>
        <CardHeader>
          <CardTitle>Board Composition, Diversity and Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Diversity metrics, performance evaluation, and composition strategy..."
            value={companyData.boardDiversity}
            onChange={(e) => updateData('boardDiversity', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Board Committees */}
      <Card>
        <CardHeader>
          <CardTitle>Board Committees</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Committee structure, responsibilities, and activities (Audit, Risk, Remuneration)..."
            value={companyData.committees}
            onChange={(e) => updateData('committees', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Governance & Culture */}
      <Card>
        <CardHeader>
          <CardTitle>Governance, Conduct and Culture</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Code of conduct, ethical framework, and corporate culture initiatives..."
            value={companyData.conductCulture}
            onChange={(e) => updateData('conductCulture', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderRiskManagement = () => (
    <div className="space-y-6">
      {/* Risk Management Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk Management Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Risk management framework, approach, and governance structure..."
            value={companyData.riskOverview}
            onChange={(e) => updateData('riskOverview', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Key risk factors, mitigation strategies, and risk appetite..."
            value={companyData.riskFactors}
            onChange={(e) => updateData('riskFactors', e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderDirectorsReport = () => (
    <div className="space-y-6">
      {/* Operating and Financial Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Operating and Financial Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Comprehensive review of operations, financial performance, and business activities..."
            value={companyData.operatingReview}
            onChange={(e) => updateData('operatingReview', e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Directors' Information */}
      <Card>
        <CardHeader>
          <CardTitle>Directors' Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Director qualifications, experience, appointments, and interests..."
            value={companyData.directorsInfo}
            onChange={(e) => updateData('directorsInfo', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Remuneration Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Remuneration Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Executive remuneration philosophy, structure, and performance outcomes..."
            value={companyData.remunerationReport}
            onChange={(e) => updateData('remunerationReport', e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialStatements = () => (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={companyData.companyName}
              onChange={(e) => updateData('companyName', e.target.value)}
              placeholder="Company legal name"
            />
          </div>
          <div>
            <Label>ABN</Label>
            <Input
              value={companyData.abn}
              onChange={(e) => updateData('abn', e.target.value)}
              placeholder="XX XXX XXX XXX"
            />
          </div>
          <div>
            <Label>ACN</Label>
            <Input
              value={companyData.acn}
              onChange={(e) => updateData('acn', e.target.value)}
              placeholder="XXX XXX XXX"
            />
          </div>
          <div>
            <Label>Industry</Label>
            <Input
              value={companyData.industry}
              onChange={(e) => updateData('industry', e.target.value)}
              placeholder="ANZSIC Industry Classification"
            />
          </div>
          <div>
            <Label>Reporting Period</Label>
            <Select value={companyData.reportingPeriod} onValueChange={(value) => updateData('reportingPeriod', value)}>
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
          <div>
            <Label>External Auditor</Label>
            <Input
              value={companyData.auditFirm}
              onChange={(e) => updateData('auditFirm', e.target.value)}
              placeholder="Audit firm name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Figures */}
      <Card>
        <CardHeader>
          <CardTitle>Key Financial Figures</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Revenue ($)</Label>
            <Input
              type="number"
              value={companyData.revenue}
              onChange={(e) => updateData('revenue', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Net Profit ($)</Label>
            <Input
              type="number"
              value={companyData.netProfit}
              onChange={(e) => updateData('netProfit', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Total Assets ($)</Label>
            <Input
              type="number"
              value={companyData.totalAssets}
              onChange={(e) => updateData('totalAssets', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Total Equity ($)</Label>
            <Input
              type="number"
              value={companyData.totalEquity}
              onChange={(e) => updateData('totalEquity', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Total Liabilities ($)</Label>
            <Input
              type="number"
              value={companyData.totalLiabilities}
              onChange={(e) => updateData('totalLiabilities', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Operating Cash Flow ($)</Label>
            <Input
              type="number"
              value={companyData.operatingCashFlow}
              onChange={(e) => updateData('operatingCashFlow', parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIEnhancement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Content Enhancement
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate professional AASB-compliant content for any section of your annual report
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>AI Generation Prompt</Label>
            <Textarea
              placeholder="E.g., 'Generate a comprehensive risk management overview for a manufacturing company focusing on supply chain risks and regulatory compliance'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={generateAIContent} 
            disabled={isGenerating || !aiPrompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate AI Content
              </>
            )}
          </Button>
          
          {aiResponse && (
            <div className="mt-4">
              <Label>Generated Content</Label>
              <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigator.clipboard.writeText(aiResponse)}
              >
                Copy Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested AI Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {[
              "Generate a Chair's message highlighting strategic achievements and future outlook",
              "Write a sustainability section focusing on ESG initiatives and targets",
              "Create a comprehensive risk management framework overview",
              "Draft a CEO message covering operational performance and market conditions",
              "Generate corporate governance principles and board composition details",
              "Write an operating and financial review section with performance analysis"
            ].map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-3 text-left"
                onClick={() => setAiPrompt(prompt)}
              >
                <FileText className="mr-2 h-4 w-4 shrink-0" />
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    // Check if current section is included
    if (!sectionInclusion[activeSection]) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              Section Excluded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                This section is currently excluded from the report.
              </p>
              <Button
                onClick={() => toggleSectionInclusion(activeSection)}
                variant="outline"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Include This Section
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (activeSection) {
      case "business-overview": return renderBusinessOverview();
      case "sustainability": return renderSustainability();
      case "governance": return renderGovernance();
      case "risk-management": return renderRiskManagement();
      case "directors-report": return renderDirectorsReport();
      case "financial-statements": return renderFinancialStatements();
      case "ai-enhancement": return renderAIEnhancement();
      default: return renderBusinessOverview();
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
            Comprehensive professional annual report builder with AI enhancement and industry templates
          </p>
        </CardHeader>
      </Card>

      {/* Industry Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Industry Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.keys(INDUSTRY_TEMPLATES).map((industry) => (
              <Button
                key={industry}
                onClick={() => applyIndustryTemplate(industry)}
                variant={selectedIndustry === industry ? "default" : "outline"}
                size="sm"
                className="capitalize"
              >
                {industry}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Report Section Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select which sections to include in your final report
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={() => toggleAllSections(true)} 
              variant="outline" 
              size="sm"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Include All
            </Button>
            <Button 
              onClick={() => toggleAllSections(false)} 
              variant="outline" 
              size="sm"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Exclude All
            </Button>
          </div>

          {/* Section Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPORT_SECTIONS.map((section) => {
              const IconComponent = section.icon;
              const isIncluded = sectionInclusion[section.id];
              
              return (
                <div 
                  key={section.id} 
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg",
                    isIncluded ? "bg-background" : "bg-muted/50"
                  )}
                >
                  <IconComponent className={cn(
                    "h-4 w-4",
                    isIncluded ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <Label 
                      htmlFor={section.id}
                      className={cn(
                        "text-sm cursor-pointer",
                        isIncluded ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {section.label}
                    </Label>
                  </div>
                  <Switch
                    id={section.id}
                    checked={isIncluded}
                    onCheckedChange={() => toggleSectionInclusion(section.id)}
                  />
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            {Object.values(sectionInclusion).filter(Boolean).length} of {REPORT_SECTIONS.length} sections included
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {REPORT_SECTIONS.map((section) => {
              const IconComponent = section.icon;
              const isIncluded = sectionInclusion[section.id];
              const isActive = activeSection === section.id;
              
              return (
                <Button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  disabled={!isIncluded}
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-3",
                    !isIncluded && "opacity-50"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs text-center">{section.label}</span>
                  {isIncluded && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                      Included
                    </Badge>
                  )}
                  {!isIncluded && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                      Excluded
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Word
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};