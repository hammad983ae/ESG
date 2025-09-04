/**
 * Property PESTEL Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, DollarSign, Gavel, Leaf, Laptop, TrendingUp, AlertTriangle } from "lucide-react";

interface PropertyPESTELAnalysisProps {
  propertyType: string;
}

const getPESTELData = (propertyType: string) => {
  const pestelData = {
    office: {
      political: [
        { factor: "Government Decentralization", impact: "Medium", trend: "Positive", description: "Public sector relocating to suburban locations creating new demand nodes" },
        { factor: "Foreign Investment Policy", impact: "High", trend: "Neutral", description: "FIRB regulations affecting international capital flows into commercial property" },
        { factor: "Infrastructure Investment", impact: "High", trend: "Positive", description: "Metro and transport projects enhancing accessibility and values" },
        { factor: "Planning Reform", impact: "Medium", trend: "Positive", description: "Streamlined approvals supporting mixed-use and transit-oriented development" }
      ],
      economic: [
        { factor: "Interest Rate Environment", impact: "High", trend: "Negative", description: "Rising interest rates increasing cost of capital and affecting valuations" },
        { factor: "Inflation Impact", impact: "High", trend: "Negative", description: "Construction cost inflation affecting development feasibility" },
        { factor: "GDP Growth", impact: "Medium", trend: "Positive", description: "Economic growth supporting business expansion and office demand" },
        { factor: "Employment Levels", impact: "High", trend: "Positive", description: "Low unemployment supporting office space absorption" }
      ],
      social: [
        { factor: "Hybrid Work Models", impact: "High", trend: "Negative", description: "Permanent shift to flexible work reducing traditional office space requirements" },
        { factor: "Employee Wellbeing Focus", impact: "Medium", trend: "Positive", description: "Companies prioritizing healthy workspaces driving demand for premium buildings" },
        { factor: "Urbanization Trends", impact: "Medium", trend: "Positive", description: "Continued urban population growth supporting CBD office markets" },
        { factor: "Work-Life Balance", impact: "Medium", trend: "Neutral", description: "Changing employee expectations affecting office location preferences" }
      ],
      technological: [
        { factor: "Smart Building Technology", impact: "High", trend: "Positive", description: "IoT and automation systems becoming essential for competitive positioning" },
        { factor: "Virtual Collaboration Tools", impact: "High", trend: "Negative", description: "Advanced video conferencing reducing need for physical meeting spaces" },
        { factor: "PropTech Innovation", impact: "Medium", trend: "Positive", description: "Digital platforms improving property management and tenant experience" },
        { factor: "5G Infrastructure", impact: "Medium", trend: "Positive", description: "Enhanced connectivity requirements driving building upgrades" }
      ],
      environmental: [
        { factor: "Net Zero Commitments", impact: "High", trend: "Positive", description: "Corporate ESG targets driving demand for green-certified buildings" },
        { factor: "NABERS/Green Star Requirements", impact: "High", trend: "Positive", description: "Energy efficiency ratings becoming mandatory for leasing decisions" },
        { factor: "Climate Change Adaptation", impact: "Medium", trend: "Neutral", description: "Extreme weather events requiring building resilience upgrades" },
        { factor: "Circular Economy Principles", impact: "Medium", trend: "Positive", description: "Sustainable construction and fit-out materials gaining importance" }
      ],
      legal: [
        { factor: "Work Health & Safety Laws", impact: "Medium", trend: "Neutral", description: "Enhanced workplace safety requirements affecting building design and operations" },
        { factor: "Building Code Updates", impact: "High", trend: "Neutral", description: "Stricter accessibility and safety standards increasing compliance costs" },
        { factor: "Lease Law Changes", impact: "Medium", trend: "Neutral", description: "Commercial tenancy reforms affecting lease structures and terms" },
        { factor: "Environmental Regulations", impact: "High", trend: "Positive", description: "Mandatory energy disclosure and efficiency standards" }
      ]
    },
    agricultural: {
      political: [
        { factor: "Agricultural Policy Support", impact: "High", trend: "Positive", description: "Government support for agricultural productivity and sustainability initiatives" },
        { factor: "Foreign Investment Regulations", impact: "High", trend: "Negative", description: "FIRB restrictions on foreign ownership of agricultural land affecting investment" },
        { factor: "Water Policy Reform", impact: "Medium", trend: "Neutral", description: "Murray-Darling Basin plan and water allocation reforms affecting irrigation properties" },
        { factor: "Rural Development Funding", impact: "Medium", trend: "Positive", description: "Infrastructure and connectivity investment in regional areas" }
      ],
      economic: [
        { factor: "Commodity Price Volatility", impact: "High", trend: "Neutral", description: "Global commodity markets affecting agricultural land values and returns" },
        { factor: "Input Cost Inflation", impact: "High", trend: "Negative", description: "Rising costs of fertilizer, fuel, and machinery affecting farm profitability" },
        { factor: "Interest Rate Environment", impact: "Medium", trend: "Negative", description: "Higher borrowing costs affecting farm expansion and land purchases" },
        { factor: "Export Market Demand", impact: "High", trend: "Positive", description: "Strong Asian demand for Australian agricultural products" }
      ],
      social: [
        { factor: "Generational Change", impact: "Medium", trend: "Neutral", description: "Aging farming population and succession planning affecting land ownership" },
        { factor: "Rural Population Decline", impact: "Medium", trend: "Negative", description: "Young people leaving rural areas affecting agricultural communities" },
        { factor: "Consumer Sustainability Demand", impact: "Medium", trend: "Positive", description: "Growing demand for sustainably produced food supporting premium pricing" },
        { factor: "Food Security Awareness", impact: "High", trend: "Positive", description: "Increased focus on domestic food production supporting agricultural investment" }
      ],
      technological: [
        { factor: "Precision Agriculture", impact: "High", trend: "Positive", description: "GPS, sensors, and data analytics improving productivity and efficiency" },
        { factor: "Automation and Robotics", impact: "Medium", trend: "Positive", description: "Automated machinery reducing labor requirements and costs" },
        { factor: "Biotechnology Advances", impact: "Medium", trend: "Positive", description: "Improved crop varieties and livestock breeding enhancing yields" },
        { factor: "Digital Platforms", impact: "Low", trend: "Positive", description: "Online marketplaces and farm management systems improving efficiency" }
      ],
      environmental: [
        { factor: "Climate Change Adaptation", impact: "High", trend: "Neutral", description: "Changing rainfall patterns requiring adaptation in farming practices" },
        { factor: "Carbon Farming Schemes", impact: "High", trend: "Positive", description: "Carbon credit opportunities providing additional income streams" },
        { factor: "Biodiversity Requirements", impact: "Medium", trend: "Neutral", description: "Environmental regulations affecting land use and management practices" },
        { factor: "Water Scarcity Issues", impact: "High", trend: "Negative", description: "Water allocation pressures affecting irrigation-dependent properties" }
      ],
      legal: [
        { factor: "Native Title Considerations", impact: "Medium", trend: "Neutral", description: "Native title claims and co-management arrangements affecting some properties" },
        { factor: "Environmental Compliance", impact: "Medium", trend: "Neutral", description: "Vegetation clearing and water use regulations affecting farm operations" },
        { factor: "Right to Farm Laws", impact: "Low", trend: "Positive", description: "Protection of agricultural operations from urban encroachment complaints" },
        { factor: "Contract Law Changes", impact: "Low", trend: "Neutral", description: "Agricultural contract and lease law reforms affecting farm businesses" }
      ]
    },
    development: {
      political: [
        { factor: "Housing Policy Initiatives", impact: "High", trend: "Positive", description: "Government programs to address housing affordability and supply constraints" },
        { factor: "Planning System Reform", impact: "High", trend: "Positive", description: "Streamlined approval processes and digital planning systems" },
        { factor: "Infrastructure Investment", impact: "High", trend: "Positive", description: "Major transport and utility projects enhancing development land values" },
        { factor: "Developer Contribution Levies", impact: "Medium", trend: "Negative", description: "Increasing infrastructure charges affecting development feasibility" }
      ],
      economic: [
        { factor: "Construction Cost Inflation", impact: "High", trend: "Negative", description: "Material and labor cost increases significantly affecting development margins" },
        { factor: "Interest Rate Environment", impact: "High", trend: "Negative", description: "Higher borrowing costs affecting both development funding and buyer capacity" },
        { factor: "Land Value Appreciation", impact: "Medium", trend: "Positive", description: "Scarcity of zoned development land supporting price growth" },
        { factor: "Population Growth", impact: "High", trend: "Positive", description: "Strong migration maintaining underlying demand for new housing" }
      ],
      social: [
        { factor: "Housing Affordability Crisis", impact: "High", trend: "Negative", description: "High land and construction costs affecting housing accessibility" },
        { factor: "Community Opposition", impact: "Medium", trend: "Negative", description: "NIMBY attitudes affecting approvals for higher density development" },
        { factor: "Lifestyle Preferences", impact: "Medium", trend: "Positive", description: "Demand for sustainable and well-designed communities" },
        { factor: "Demographic Changes", impact: "Medium", trend: "Positive", description: "Changing household composition driving demand for diverse housing types" }
      ],
      technological: [
        { factor: "Construction Technology", impact: "Medium", trend: "Positive", description: "Prefabrication and modular construction improving efficiency and quality" },
        { factor: "Digital Planning Tools", impact: "Medium", trend: "Positive", description: "3D modeling and virtual reality enhancing design and approval processes" },
        { factor: "Smart City Infrastructure", impact: "Low", trend: "Positive", description: "IoT and connected systems becoming standard in new developments" },
        { factor: "Building Information Modeling", impact: "Low", trend: "Positive", description: "BIM technology improving project coordination and outcomes" }
      ],
      environmental: [
        { factor: "Climate Change Adaptation", impact: "High", trend: "Neutral", description: "Flood, bushfire, and sea level rise affecting developable land availability" },
        { factor: "Green Building Standards", impact: "Medium", trend: "Positive", description: "Energy efficiency and sustainability requirements becoming market differentiators" },
        { factor: "Biodiversity Offset Requirements", impact: "Medium", trend: "Negative", description: "Environmental offset obligations increasing development costs and complexity" },
        { factor: "Stormwater Management", impact: "Medium", trend: "Neutral", description: "Water-sensitive urban design requirements affecting development layout" }
      ],
      legal: [
        { factor: "Development Liability Laws", impact: "High", trend: "Negative", description: "Extended warranty periods and defect liability increasing developer risks" },
        { factor: "Strata Law Reforms", impact: "Medium", trend: "Neutral", description: "Building management and governance changes affecting apartment developments" },
        { factor: "Heritage Protection", impact: "Medium", trend: "Neutral", description: "Heritage listing and archaeological requirements affecting some sites" },
        { factor: "Contract and Property Law", impact: "Low", trend: "Neutral", description: "Off-the-plan sales and sunset clause regulations" }
      ]
    }
  };

  return pestelData[propertyType as keyof typeof pestelData] || pestelData.office;
};

export const PropertyPESTELAnalysis = ({ propertyType }: PropertyPESTELAnalysisProps) => {
  const data = getPESTELData(propertyType);

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'Positive':
        return <Badge variant="default" className="bg-success text-success-foreground">Positive</Badge>;
      case 'Negative':
        return <Badge variant="destructive">Negative</Badge>;
      default:
        return <Badge variant="secondary">Neutral</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return <Badge variant="destructive">{impact}</Badge>;
      case 'Medium':
        return <Badge variant="secondary">{impact}</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };

  const PESTELCard = ({ 
    title, 
    items, 
    icon: Icon, 
    colorClass 
  }: { 
    title: string; 
    items: Array<{ factor: string; impact: string; trend: string; description: string }>; 
    icon: any; 
    colorClass: string;
  }) => (
    <Card className={`${colorClass} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm">{item.factor}</p>
                <div className="flex gap-1">
                  {getImpactBadge(item.impact)}
                  {getTrendBadge(item.trend)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* PESTEL Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-info/5">
        <CardHeader>
          <CardTitle className="text-center">
            PESTEL Analysis: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Property Sector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Comprehensive analysis of Political, Economic, Social, Technological, Environmental, and Legal factors 
            affecting the {propertyType} property market
          </p>
        </CardContent>
      </Card>

      {/* PESTEL Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <PESTELCard
          title="Political"
          items={data.political}
          icon={Gavel}
          colorClass="bg-gradient-to-br from-blue-50 to-blue-25 border-blue-200"
        />

        <PESTELCard
          title="Economic"
          items={data.economic}
          icon={DollarSign}
          colorClass="bg-gradient-to-br from-green-50 to-green-25 border-green-200"
        />

        <PESTELCard
          title="Social"
          items={data.social}
          icon={Users}
          colorClass="bg-gradient-to-br from-purple-50 to-purple-25 border-purple-200"
        />

        <PESTELCard
          title="Technological"
          items={data.technological}
          icon={Laptop}
          colorClass="bg-gradient-to-br from-cyan-50 to-cyan-25 border-cyan-200"
        />

        <PESTELCard
          title="Environmental"
          items={data.environmental}
          icon={Leaf}
          colorClass="bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200"
        />

        <PESTELCard
          title="Legal"
          items={data.legal}
          icon={Building}
          colorClass="bg-gradient-to-br from-orange-50 to-orange-25 border-orange-200"
        />
      </div>

      {/* Strategic Implications */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Implications & Outlook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-success flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Key Opportunities
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {propertyType === 'agricultural' && (
                  <>
                    <li>• Carbon farming and regenerative agriculture</li>
                    <li>• Technology adoption and precision farming</li>
                    <li>• Food security and export market growth</li>
                  </>
                )}
                {propertyType === 'development' && (
                  <>
                    <li>• Government housing affordability support</li>
                    <li>• Infrastructure investment and planning reform</li>
                    <li>• Build-to-rent and transit-oriented development</li>
                  </>
                )}
                {propertyType === 'office' && (
                  <>
                    <li>• ESG and smart building technology adoption</li>
                    <li>• Government infrastructure investment</li>
                    <li>• Flight to quality from premium tenants</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Major Challenges
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {propertyType === 'agricultural' && (
                  <>
                    <li>• Climate variability and water security</li>
                    <li>• Foreign investment restrictions</li>
                    <li>• Input cost inflation and labor shortages</li>
                  </>
                )}
                {propertyType === 'development' && (
                  <>
                    <li>• Construction cost inflation</li>
                    <li>• Interest rate and housing affordability pressures</li>
                    <li>• Complex approval processes</li>
                  </>
                )}
                {propertyType === 'office' && (
                  <>
                    <li>• Permanent hybrid work model adoption</li>
                    <li>• Interest rate and inflation pressures</li>
                    <li>• Technology disrupting space requirements</li>
                  </>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-info flex items-center gap-2">
                <Building className="h-4 w-4" />
                Market Outlook
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Short-term (1-2 years):</strong></p>
                <p>
                  {propertyType === 'agricultural' && 'Carbon farming and technology adoption driving premium asset performance'}
                  {propertyType === 'development' && 'Interest rate sensitivity moderating activity with infrastructure supporting values'}
                  {propertyType === 'office' && 'Flight to quality continues with ESG premium buildings outperforming'}
                </p>
                
                <p className="pt-2"><strong>Medium-term (3-5 years):</strong></p>
                <p>
                  {propertyType === 'agricultural' && 'Sustainable farming practices and food security creating premium opportunities'}
                  {propertyType === 'development' && 'Planning reform and housing policy creating new development corridors'}
                  {propertyType === 'office' && 'New work models stabilizing with technology-enabled buildings gaining share'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};