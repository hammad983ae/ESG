/**
 * Property SWOT Analysis Component
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Shield, Zap } from "lucide-react";

interface PropertySWOTAnalysisProps {
  propertyType: string;
}

const getSWOTData = (propertyType: string) => {
  const swotData = {
    office: {
      strengths: [
        { factor: "Prime CBD Locations", impact: "High", description: "Central business district positioning drives premium rents and tenant demand" },
        { factor: "Flight to Quality", impact: "High", description: "Tenants preferring A-grade buildings with modern amenities and ESG credentials" },
        { factor: "Long-term Leases", impact: "Medium", description: "Corporate tenants typically sign 5-10 year leases providing income stability" },
        { factor: "Technology Integration", impact: "Medium", description: "Smart building features and contactless systems attract modern tenants" }
      ],
      weaknesses: [
        { factor: "Hybrid Work Adoption", impact: "High", description: "Reduced office utilization affecting demand for traditional office space" },
        { factor: "High Development Costs", impact: "High", description: "Construction costs and compliance requirements impacting new supply" },
        { factor: "Vacancy in Secondary Markets", impact: "Medium", description: "B and C grade buildings struggling with higher vacancy rates" },
        { factor: "Obsolescence Risk", impact: "Medium", description: "Older buildings requiring significant capex to remain competitive" }
      ],
      opportunities: [
        { factor: "ESG Premium", impact: "High", description: "Green buildings commanding 10-15% rental premiums and lower vacancy" },
        { factor: "Flexible Space Demand", impact: "High", description: "Growing demand for co-working and flexible office solutions" },
        { factor: "Government Decentralization", impact: "Medium", description: "Public sector moving to suburban locations creating new demand nodes" },
        { factor: "Mixed-Use Development", impact: "Medium", description: "Combining office with retail and residential for better returns" }
      ],
      threats: [
        { factor: "Interest Rate Sensitivity", impact: "High", description: "Rising interest rates affecting capitalization rates and valuations" },
        { factor: "Permanent WFH Adoption", impact: "High", description: "Some companies adopting permanent remote work reducing space requirements" },
        { factor: "Economic Downturn", impact: "Medium", description: "Recession risk leading to corporate downsizing and lease defaults" },
        { factor: "Oversupply Risk", impact: "Medium", description: "New developments potentially exceeding demand in some markets" }
      ]
    },
    retail: {
      strengths: [
        { factor: "Essential Services Demand", impact: "High", description: "Supermarkets, pharmacies, and services maintain strong occupancy" },
        { factor: "Convenience Shopping", impact: "High", description: "Neighborhood centers benefiting from last-mile shopping trends" },
        { factor: "Experience Retail Growth", impact: "Medium", description: "Dining, entertainment, and experiential retail showing resilience" },
        { factor: "Click-and-Collect Hubs", impact: "Medium", description: "Retail spaces adapting as fulfillment centers for online orders" }
      ],
      weaknesses: [
        { factor: "E-commerce Competition", impact: "High", description: "Online retail continues to erode traditional brick-and-mortar demand" },
        { factor: "Department Store Decline", impact: "High", description: "Anchor tenants downsizing or closing affecting shopping center viability" },
        { factor: "High Operating Costs", impact: "Medium", description: "Marketing, maintenance, and management costs impacting net returns" },
        { factor: "Changing Consumer Habits", impact: "Medium", description: "Shift towards experiences over goods affecting retail mix requirements" }
      ],
      opportunities: [
        { factor: "Healthcare Integration", impact: "High", description: "Medical centers and allied health services driving foot traffic" },
        { factor: "Service-Based Retail", impact: "High", description: "Personal services, beauty, and wellness sectors showing growth" },
        { factor: "Pop-up and Flexibility", impact: "Medium", description: "Short-term leases and flexible spaces attracting new retailers" },
        { factor: "Community Hubs", impact: "Medium", description: "Centers evolving as social and community gathering spaces" }
      ],
      threats: [
        { factor: "Retail Apocalypse", impact: "High", description: "Continued store closures and downsizing affecting rental income" },
        { factor: "Rising Interest Rates", impact: "High", description: "Funding costs impacting consumer spending and investment returns" },
        { factor: "Supply Chain Issues", impact: "Medium", description: "Inventory challenges affecting retailer viability and expansion" },
        { factor: "Climate Change Costs", impact: "Medium", description: "Extreme weather events requiring costly adaptations" }
      ]
    },
    industrial: {
      strengths: [
        { factor: "E-commerce Logistics Boom", impact: "High", description: "Online shopping driving massive demand for distribution facilities" },
        { factor: "Supply Chain Reshoring", impact: "High", description: "Manufacturing returning closer to consumers increasing industrial demand" },
        { factor: "Low Vacancy Rates", impact: "High", description: "Tight supply conditions supporting rental growth and occupancy" },
        { factor: "Long Lease Terms", impact: "Medium", description: "Typical 10-15 year leases providing stable income streams" }
      ],
      weaknesses: [
        { factor: "Limited Land Supply", impact: "High", description: "Zoned industrial land becoming increasingly scarce in major markets" },
        { factor: "High Construction Costs", impact: "High", description: "Material and labor costs significantly increasing development costs" },
        { factor: "Automation Impact", impact: "Medium", description: "Automated warehouses requiring different specifications and locations" },
        { factor: "Transport Constraints", impact: "Medium", description: "Infrastructure limitations affecting accessibility in some markets" }
      ],
      opportunities: [
        { factor: "Cold Storage Demand", impact: "High", description: "Food delivery and pharmaceuticals driving specialized storage needs" },
        { factor: "Urban Consolidation", impact: "High", description: "Last-mile delivery facilities in urban fringe locations" },
        { factor: "ESG Retrofits", impact: "Medium", description: "Solar panels and energy efficiency creating additional revenue streams" },
        { factor: "Data Center Integration", impact: "Medium", description: "Co-locating data centers with distribution facilities" }
      ],
      threats: [
        { factor: "Interest Rate Impact", impact: "Medium", description: "Higher rates affecting debt-heavy industrial developments" },
        { factor: "Planning Restrictions", impact: "Medium", description: "Increasing residential encroachment limiting industrial zones" },
        { factor: "Environmental Compliance", impact: "Medium", description: "Stricter environmental regulations increasing operational costs" },
        { factor: "Tenant Concentration", impact: "Low", description: "Reliance on major logistics companies creating counterparty risk" }
      ]
    },
    residential: {
      strengths: [
        { factor: "Population Growth", impact: "High", description: "Strong migration and natural increase supporting housing demand" },
        { factor: "Investment Demand", impact: "High", description: "Superannuation and foreign investment maintaining market liquidity" },
        { factor: "Low Interest Rate Legacy", impact: "Medium", description: "Fixed-rate mortgages providing payment stability for existing owners" },
        { factor: "Urban Densification", impact: "Medium", description: "Planning policies supporting apartment development in key locations" }
      ],
      weaknesses: [
        { factor: "Affordability Crisis", impact: "High", description: "Housing costs exceeding income growth limiting buyer pool" },
        { factor: "Construction Cost Inflation", impact: "High", description: "Material and labor costs reducing development feasibility" },
        { factor: "Rental Regulations", impact: "Medium", description: "Tenant protection laws affecting investor returns and flexibility" },
        { factor: "Market Concentration", impact: "Medium", description: "Price volatility in major capital cities affecting stability" }
      ],
      opportunities: [
        { factor: "Build-to-Rent Growth", impact: "High", description: "Institutional investment in purpose-built rental housing" },
        { factor: "Regional Migration", impact: "High", description: "COVID-driven tree change creating opportunities in regional markets" },
        { factor: "Student Accommodation", impact: "Medium", description: "International education recovery driving purpose-built student housing" },
        { factor: "Aging Population", impact: "Medium", description: "Retirement living and aged care accommodation demand growing" }
      ],
      threats: [
        { factor: "Interest Rate Rises", impact: "High", description: "Mortgage rate increases reducing buyer capacity and market activity" },
        { factor: "Oversupply Risk", impact: "High", description: "Apartment oversupply in some markets affecting prices and rents" },
        { factor: "Economic Downturn", impact: "Medium", description: "Recession risk increasing unemployment and mortgage stress" },
        { factor: "Climate Change Impact", impact: "Medium", description: "Flood and fire risks affecting insurance costs and property values" }
      ]
    },
    hospitality: {
      strengths: [
        { factor: "Tourism Recovery", impact: "High", description: "International and domestic travel rebounding post-COVID" },
        { factor: "Pent-up Demand", impact: "High", description: "Strong consumer appetite for travel and experiences" },
        { factor: "Business Travel Return", impact: "Medium", description: "Corporate events and conferences resuming supporting mid-week demand" },
        { factor: "Unique Assets Premium", impact: "Medium", description: "Boutique and luxury properties commanding rate premiums" }
      ],
      weaknesses: [
        { factor: "Labor Shortages", impact: "High", description: "Hospitality workforce challenges affecting service levels and costs" },
        { factor: "Operating Cost Inflation", impact: "High", description: "Energy, food, and wage costs significantly increasing" },
        { factor: "Seasonal Volatility", impact: "Medium", description: "Revenue concentration in peak periods affecting cash flow stability" },
        { factor: "Capital Intensive", impact: "Medium", description: "Regular refurbishment and FF&E replacement requirements" }
      ],
      opportunities: [
        { factor: "Experiential Travel", impact: "High", description: "Demand for unique and authentic experiences over standard accommodation" },
        { factor: "Bleisure Travel", impact: "High", description: "Business and leisure travel combinations extending stays" },
        { factor: "Wellness Tourism", impact: "Medium", description: "Health and wellness focused travel creating niche opportunities" },
        { factor: "Extended Stay Market", impact: "Medium", description: "Remote work enabling longer-term hotel stays" }
      ],
      threats: [
        { factor: "Airbnb Competition", impact: "High", description: "Short-term rental platforms competing for leisure travelers" },
        { factor: "Economic Sensitivity", impact: "High", description: "Discretionary spending cuts during economic downturns" },
        { factor: "Pandemic Risk", impact: "Medium", description: "Future health crises potentially disrupting travel patterns" },
        { factor: "Climate Events", impact: "Medium", description: "Weather-related disruptions affecting tourist destinations" }
      ]
    },
    mixed: {
      strengths: [
        { factor: "Diversified Income", impact: "High", description: "Multiple use types reducing overall investment risk" },
        { factor: "Transit-Oriented Demand", impact: "High", description: "Mixed-use developments near transport hubs highly sought after" },
        { factor: "Live-Work-Play Appeal", impact: "Medium", description: "Integrated developments matching modern lifestyle preferences" },
        { factor: "Higher Density Returns", impact: "Medium", description: "Efficient land use maximizing development potential" }
      ],
      weaknesses: [
        { factor: "Complex Management", impact: "High", description: "Multiple tenancies and uses requiring specialized expertise" },
        { factor: "Higher Development Risk", impact: "High", description: "Complex approvals and coordination increasing project risk" },
        { factor: "Market Timing Risk", impact: "Medium", description: "Different use types peaking at different market cycles" },
        { factor: "Financing Complexity", impact: "Medium", description: "Mixed-use projects requiring sophisticated funding structures" }
      ],
      opportunities: [
        { factor: "Urban Regeneration", impact: "High", description: "Government support for mixed-use redevelopment projects" },
        { factor: "Placemaking Premium", impact: "High", description: "Well-designed mixed-use creating significant value uplift" },
        { factor: "ESG Leadership", impact: "Medium", description: "Sustainable mixed-use developments attracting ESG investment" },
        { factor: "Co-living Integration", impact: "Medium", description: "Innovative residential models within mixed-use frameworks" }
      ],
      threats: [
        { factor: "Planning Uncertainty", impact: "High", description: "Complex approvals and changing regulations affecting feasibility" },
        { factor: "Market Segmentation", impact: "Medium", description: "Different property sectors performing poorly simultaneously" },
        { factor: "Infrastructure Capacity", impact: "Medium", description: "Utility and transport constraints limiting development potential" },
        { factor: "Community Opposition", impact: "Medium", description: "NIMBY attitudes affecting approvals for higher density projects" }
      ]
    }
  };

  return swotData[propertyType as keyof typeof swotData] || swotData.office;
};

export const PropertySWOTAnalysis = ({ propertyType }: PropertySWOTAnalysisProps) => {
  const data = getSWOTData(propertyType);

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

  const SWOTCard = ({ title, items, icon: Icon, colorClass }: { 
    title: string; 
    items: Array<{ factor: string; impact: string; description: string }>; 
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
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.factor}</p>
                {getImpactBadge(item.impact)}
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* SWOT Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-success/5">
        <CardHeader>
          <CardTitle className="text-center">
            SWOT Analysis: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Property Sector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Strategic assessment of internal capabilities and external market conditions affecting the {propertyType} property sector
          </p>
        </CardContent>
      </Card>

      {/* SWOT Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SWOTCard
          title="Strengths"
          items={data.strengths}
          icon={TrendingUp}
          colorClass="bg-gradient-to-br from-success/10 to-success/5 border-success/30"
        />

        <SWOTCard
          title="Weaknesses"
          items={data.weaknesses}
          icon={AlertTriangle}
          colorClass="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
        />

        <SWOTCard
          title="Opportunities"
          items={data.opportunities}
          icon={Zap}
          colorClass="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30"
        />

        <SWOTCard
          title="Threats"
          items={data.threats}
          icon={Shield}
          colorClass="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30"
        />
      </div>

      {/* Strategic Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Implications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-success">Key Success Factors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {propertyType === 'office' && (
                  <>
                    <li>• Focus on premium locations with ESG credentials</li>
                    <li>• Adapt spaces for hybrid work models</li>
                    <li>• Invest in technology and flexible configurations</li>
                  </>
                )}
                {propertyType === 'retail' && (
                  <>
                    <li>• Emphasize essential services and convenience</li>
                    <li>• Create experiential and community-focused spaces</li>
                    <li>• Integrate healthcare and personal services</li>
                  </>
                )}
                {propertyType === 'industrial' && (
                  <>
                    <li>• Capitalize on e-commerce logistics demand</li>
                    <li>• Secure well-located, modern facilities</li>
                    <li>• Focus on cold storage and specialized uses</li>
                  </>
                )}
                {propertyType === 'residential' && (
                  <>
                    <li>• Target build-to-rent and specialized housing</li>
                    <li>• Focus on well-located, transit-accessible sites</li>
                    <li>• Consider regional and student markets</li>
                  </>
                )}
                {propertyType === 'hospitality' && (
                  <>
                    <li>• Capitalize on experiential travel trends</li>
                    <li>• Focus on unique and boutique properties</li>
                    <li>• Develop wellness and extended stay offerings</li>
                  </>
                )}
                {propertyType === 'mixed' && (
                  <>
                    <li>• Leverage transit-oriented development opportunities</li>
                    <li>• Focus on integrated live-work-play concepts</li>
                    <li>• Pursue urban regeneration projects</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-destructive">Risk Mitigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {propertyType === 'office' && (
                  <>
                    <li>• Diversify tenant mix and lease terms</li>
                    <li>• Monitor hybrid work impact on demand</li>
                    <li>• Implement flexible space solutions</li>
                  </>
                )}
                {propertyType === 'retail' && (
                  <>
                    <li>• Reduce dependence on traditional retail</li>
                    <li>• Secure essential service anchors</li>
                    <li>• Adapt to changing consumer behaviors</li>
                  </>
                )}
                {propertyType === 'industrial' && (
                  <>
                    <li>• Secure long-term land supply</li>
                    <li>• Manage construction cost escalation</li>
                    <li>• Plan for automation requirements</li>
                  </>
                )}
                {propertyType === 'residential' && (
                  <>
                    <li>• Monitor affordability and policy changes</li>
                    <li>• Diversify across price points and locations</li>
                    <li>• Manage construction and interest rate risks</li>
                  </>
                )}
                {propertyType === 'hospitality' && (
                  <>
                    <li>• Address labor shortage challenges</li>
                    <li>• Implement cost management strategies</li>
                    <li>• Diversify revenue sources and markets</li>
                  </>
                )}
                {propertyType === 'mixed' && (
                  <>
                    <li>• Secure experienced development partners</li>
                    <li>• Manage complex approval processes</li>
                    <li>• Diversify across multiple use types</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};