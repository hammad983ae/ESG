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
    agricultural: {
      strengths: [
        { factor: "Food Security Demand", impact: "High", description: "Global food security concerns driving investment in productive agricultural land" },
        { factor: "Population Growth", impact: "High", description: "Increasing population requiring more food production supporting land values" },
        { factor: "Climate Advantages", impact: "Medium", description: "Australia's stable climate and water resources attractive to global investors" },
        { factor: "Export Markets", impact: "Medium", description: "Strong Asian demand for Australian agricultural products" }
      ],
      weaknesses: [
        { factor: "Climate Variability", impact: "High", description: "Drought and flood cycles significantly affecting productivity and values" },
        { factor: "Water Security", impact: "High", description: "Water allocation uncertainties impacting irrigation-dependent properties" },
        { factor: "Labor Shortages", impact: "Medium", description: "Skilled agricultural labor becoming increasingly difficult to source" },
        { factor: "Input Cost Inflation", impact: "Medium", description: "Rising fertilizer, fuel, and machinery costs affecting farm profitability" }
      ],
      opportunities: [
        { factor: "Carbon Farming", impact: "High", description: "Carbon credit schemes providing additional income streams for landholders" },
        { factor: "Regenerative Agriculture", impact: "High", description: "Sustainable farming practices attracting premium pricing and ESG investment" },
        { factor: "Technology Integration", impact: "Medium", description: "Precision agriculture and automation improving productivity and efficiency" },
        { factor: "Alternative Proteins", impact: "Medium", description: "Plant-based protein production creating new agricultural opportunities" }
      ],
      threats: [
        { factor: "Climate Change Impact", impact: "High", description: "Changing rainfall patterns and extreme weather affecting agricultural productivity" },
        { factor: "Foreign Investment Restrictions", impact: "High", description: "FIRB regulations limiting international investment in agricultural land" },
        { factor: "Urban Encroachment", impact: "Medium", description: "Residential development reducing available agricultural land near cities" },
        { factor: "Trade Disruptions", impact: "Medium", description: "Geopolitical tensions affecting export market access" }
      ]
    },
    development: {
      strengths: [
        { factor: "Population Growth", impact: "High", description: "Strong migration and natural increase creating ongoing demand for new housing" },
        { factor: "Infrastructure Investment", impact: "High", description: "Government transport and utility projects enhancing development land values" },
        { factor: "Planning Reform", impact: "Medium", description: "Streamlined approval processes supporting development feasibility" },
        { factor: "Urban Consolidation", impact: "Medium", description: "Density policies creating opportunities for higher-value developments" }
      ],
      weaknesses: [
        { factor: "Construction Cost Inflation", impact: "High", description: "Material and labor costs significantly impacting development margins" },
        { factor: "Interest Rate Sensitivity", impact: "High", description: "Higher borrowing costs affecting both development funding and buyer capacity" },
        { factor: "Skills Shortages", impact: "Medium", description: "Lack of skilled trades affecting construction timelines and costs" },
        { factor: "Regulatory Complexity", impact: "Medium", description: "Multiple approval layers increasing development timeframes and costs" }
      ],
      opportunities: [
        { factor: "Housing Affordability Initiatives", impact: "High", description: "Government schemes supporting first home buyers and affordable housing" },
        { factor: "Build-to-Rent Growth", impact: "High", description: "Institutional investment in purpose-built rental housing creating new demand" },
        { factor: "Regional Development", impact: "Medium", description: "Tree change trends creating opportunities in regional centers" },
        { factor: "Transit-Oriented Development", impact: "Medium", description: "Infrastructure projects creating high-value development opportunities" }
      ],
      threats: [
        { factor: "Market Oversupply", impact: "High", description: "Apartment oversupply in some markets affecting development land values" },
        { factor: "Economic Downturn Risk", impact: "High", description: "Recession concerns affecting buyer confidence and sales activity" },
        { factor: "Environmental Constraints", impact: "Medium", description: "Flood, bushfire, and biodiversity restrictions limiting developable land" },
        { factor: "Infrastructure Capacity", impact: "Medium", description: "Utility and transport constraints limiting development potential" }
      ]
    }
  };

  return swotData[propertyType as keyof typeof swotData] || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
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
    </div>
  );
};