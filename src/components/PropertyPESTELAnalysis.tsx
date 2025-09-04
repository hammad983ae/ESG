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
    retail: {
      political: [
        { factor: "Planning Policy Changes", impact: "High", trend: "Neutral", description: "Mixed-use zoning reforms affecting retail development opportunities" },
        { factor: "Small Business Support", impact: "Medium", trend: "Positive", description: "Government incentives supporting local retail and hospitality businesses" },
        { factor: "Foreign Investment Rules", impact: "Medium", trend: "Neutral", description: "FIRB thresholds affecting international retail property investment" },
        { factor: "Infrastructure Funding", impact: "High", trend: "Positive", description: "Transport infrastructure improving retail accessibility and catchments" }
      ],
      economic: [
        { factor: "Consumer Spending Patterns", impact: "High", trend: "Negative", description: "Cost of living pressures reducing discretionary retail spending" },
        { factor: "Interest Rate Impact", impact: "High", trend: "Negative", description: "Higher rates affecting both consumer spending and property valuations" },
        { factor: "Supply Chain Costs", impact: "Medium", trend: "Negative", description: "Elevated shipping and logistics costs affecting retailer viability" },
        { factor: "Tourism Recovery", impact: "Medium", trend: "Positive", description: "International visitor return supporting retail precincts and shopping centers" }
      ],
      social: [
        { factor: "E-commerce Adoption", impact: "High", trend: "Negative", description: "Permanent shift to online shopping reducing physical retail space demand" },
        { factor: "Experience Economy", impact: "High", trend: "Positive", description: "Consumer preference for experiences over goods supporting hospitality and services" },
        { factor: "Health and Wellness Focus", impact: "Medium", trend: "Positive", description: "Growing demand for health services, fitness, and wellness retail" },
        { factor: "Community Connection", impact: "Medium", trend: "Positive", description: "Desire for local community spaces supporting neighborhood retail" }
      ],
      technological: [
        { factor: "Omnichannel Retail", impact: "High", trend: "Positive", description: "Integration of online and physical retail creating new space requirements" },
        { factor: "Contactless Technology", impact: "Medium", trend: "Positive", description: "QR codes, mobile payments, and app-based services becoming standard" },
        { factor: "Automation in Retail", impact: "Medium", trend: "Neutral", description: "Self-service and automated systems changing retail space configurations" },
        { factor: "AR/VR Shopping", impact: "Low", trend: "Positive", description: "Virtual try-on and immersive experiences enhancing physical retail appeal" }
      ],
      environmental: [
        { factor: "Sustainable Retail Practices", impact: "Medium", trend: "Positive", description: "Consumer demand for eco-friendly retailers and sustainable shopping centers" },
        { factor: "Waste Reduction Requirements", impact: "Medium", trend: "Neutral", description: "Single-use plastic bans and waste management regulations affecting operations" },
        { factor: "Energy Efficiency Standards", impact: "High", trend: "Positive", description: "Green building certifications becoming essential for major retail properties" },
        { factor: "Climate Resilience", impact: "Medium", trend: "Neutral", description: "Extreme weather events requiring shopping center adaptations" }
      ],
      legal: [
        { factor: "Retail Lease Legislation", impact: "High", trend: "Neutral", description: "Tenant protection laws affecting lease terms and rent review processes" },
        { factor: "Competition Law Changes", impact: "Medium", trend: "Neutral", description: "Market concentration rules affecting major retailer expansion plans" },
        { factor: "Accessibility Compliance", impact: "Medium", trend: "Neutral", description: "DDA requirements for existing retail properties increasing compliance costs" },
        { factor: "Food Safety Regulations", impact: "Medium", trend: "Neutral", description: "Enhanced food court and restaurant regulations in shopping centers" }
      ]
    },
    industrial: {
      political: [
        { factor: "Manufacturing Incentives", impact: "High", trend: "Positive", description: "Government support for domestic manufacturing increasing industrial demand" },
        { factor: "Infrastructure Investment", impact: "High", trend: "Positive", description: "Port, rail, and road upgrades enhancing industrial precinct connectivity" },
        { factor: "Foreign Investment Policy", impact: "Medium", trend: "Neutral", description: "Strategic asset restrictions affecting international industrial investment" },
        { factor: "Trade Policy Changes", impact: "Medium", trend: "Positive", description: "Supply chain diversification driving demand for domestic distribution facilities" }
      ],
      economic: [
        { factor: "E-commerce Growth", impact: "High", trend: "Positive", description: "Online retail boom driving unprecedented demand for logistics facilities" },
        { factor: "Supply Chain Reshoring", impact: "High", trend: "Positive", description: "Companies relocating manufacturing closer to consumers" },
        { factor: "Construction Cost Inflation", impact: "High", trend: "Negative", description: "Material and labor costs significantly increasing development costs" },
        { factor: "Interest Rate Sensitivity", impact: "Medium", trend: "Negative", description: "Industrial developments typically debt-funded, sensitive to rate rises" }
      ],
      social: [
        { factor: "Same-Day Delivery Expectations", impact: "High", trend: "Positive", description: "Consumer demands driving need for urban distribution facilities" },
        { factor: "Employment Growth", impact: "Medium", trend: "Positive", description: "Industrial sector creating significant employment in logistics and manufacturing" },
        { factor: "Skills Shortage", impact: "Medium", trend: "Negative", description: "Lack of skilled workers affecting industrial operations and development" },
        { factor: "Regional Development", impact: "Medium", trend: "Positive", description: "Decentralization creating industrial opportunities outside major cities" }
      ],
      technological: [
        { factor: "Automation and Robotics", impact: "High", trend: "Positive", description: "Automated warehouses requiring specialized building designs and locations" },
        { factor: "Cold Chain Technology", impact: "High", trend: "Positive", description: "Advanced refrigeration and temperature control driving specialized facility demand" },
        { factor: "IoT and Smart Logistics", impact: "Medium", trend: "Positive", description: "Connected systems requiring enhanced building infrastructure" },
        { factor: "Drone and Last-Mile Tech", impact: "Medium", trend: "Positive", description: "New delivery methods creating different facility requirements" }
      ],
      environmental: [
        { factor: "Carbon Neutral Commitments", impact: "High", trend: "Positive", description: "Corporate ESG targets driving demand for green industrial buildings" },
        { factor: "Solar Panel Integration", impact: "High", trend: "Positive", description: "Large roof areas ideal for renewable energy generation creating additional income" },
        { factor: "Waste Management Standards", impact: "Medium", trend: "Neutral", description: "Stricter waste disposal and recycling requirements affecting operations" },
        { factor: "Water Conservation", impact: "Medium", trend: "Positive", description: "Industrial water efficiency measures becoming competitive advantages" }
      ],
      legal: [
        { factor: "Industrial Relations Laws", impact: "Medium", trend: "Neutral", description: "Workplace regulations affecting industrial operations and costs" },
        { factor: "Environmental Compliance", impact: "High", trend: "Neutral", description: "Emissions and contamination regulations requiring ongoing monitoring" },
        { factor: "Planning and Zoning", impact: "High", trend: "Negative", description: "Residential encroachment limiting industrial zone expansion" },
        { factor: "Transport Regulations", impact: "Medium", trend: "Neutral", description: "Heavy vehicle restrictions affecting industrial site accessibility" }
      ]
    },
    residential: {
      political: [
        { factor: "Housing Affordability Policy", impact: "High", trend: "Positive", description: "Government initiatives including shared equity schemes and planning reforms" },
        { factor: "Foreign Buyer Taxes", impact: "Medium", trend: "Negative", description: "State-based foreign purchaser duties reducing international investment" },
        { factor: "First Home Buyer Support", impact: "Medium", trend: "Positive", description: "Stamp duty concessions and grants supporting entry-level demand" },
        { factor: "Social Housing Investment", impact: "Medium", trend: "Positive", description: "Government commitments to public and community housing development" }
      ],
      economic: [
        { factor: "Interest Rate Environment", impact: "High", trend: "Negative", description: "Rising mortgage rates significantly affecting buyer capacity and market activity" },
        { factor: "Construction Cost Inflation", impact: "High", trend: "Negative", description: "Material and labor costs reducing development feasibility" },
        { factor: "Population Growth", impact: "High", trend: "Positive", description: "Strong migration and natural increase supporting underlying housing demand" },
        { factor: "Income Growth Trends", impact: "Medium", trend: "Neutral", description: "Wage growth lagging house price appreciation affecting affordability" }
      ],
      social: [
        { factor: "Lifestyle Preferences", impact: "High", trend: "Positive", description: "Demand for larger homes with outdoor space and home offices post-COVID" },
        { factor: "Regional Migration", impact: "Medium", trend: "Positive", description: "Tree change and sea change creating opportunities in regional markets" },
        { factor: "Multi-generational Living", impact: "Medium", trend: "Positive", description: "Extended families living together driving demand for larger properties" },
        { factor: "Rental Market Pressure", impact: "High", trend: "Positive", description: "Low vacancy rates and rising rents supporting build-to-rent investment" }
      ],
      technological: [
        { factor: "Smart Home Technology", impact: "Medium", trend: "Positive", description: "IoT devices and home automation becoming standard in new developments" },
        { factor: "PropTech Platforms", impact: "High", trend: "Positive", description: "Digital property management and tenant experience platforms" },
        { factor: "Virtual Inspections", impact: "Medium", trend: "Positive", description: "3D tours and virtual reality reducing need for physical inspections" },
        { factor: "Energy Management Systems", impact: "Medium", trend: "Positive", description: "Smart meters and energy monitoring reducing utility costs" }
      ],
      environmental: [
        { factor: "Energy Efficiency Standards", impact: "High", trend: "Positive", description: "NCC energy provisions and state-based efficiency requirements" },
        { factor: "Climate Change Adaptation", impact: "Medium", trend: "Neutral", description: "Flood and bushfire risks affecting development locations and insurance" },
        { factor: "Sustainable Building Materials", impact: "Medium", trend: "Positive", description: "Embodied carbon considerations driving material selection" },
        { factor: "Electric Vehicle Infrastructure", impact: "Medium", trend: "Positive", description: "EV charging requirements in new residential developments" }
      ],
      legal: [
        { factor: "Residential Tenancy Laws", impact: "High", trend: "Negative", description: "Tenant protection reforms affecting investor returns and property management" },
        { factor: "Strata and Body Corporate Laws", impact: "Medium", trend: "Neutral", description: "Apartment governance reforms affecting building management and costs" },
        { factor: "Building Defects Legislation", impact: "High", trend: "Negative", description: "Enhanced warranty periods and liability increasing developer costs" },
        { factor: "Short-Term Rental Regulations", impact: "Medium", trend: "Negative", description: "Airbnb restrictions affecting investment property income potential" }
      ]
    },
    hospitality: {
      political: [
        { factor: "Tourism Policy Support", impact: "High", trend: "Positive", description: "Government marketing and infrastructure investment supporting tourism recovery" },
        { factor: "Immigration Policy", impact: "Medium", trend: "Positive", description: "International student and worker visa programs supporting accommodation demand" },
        { factor: "COVID-19 Response", impact: "High", trend: "Positive", description: "Border reopening and reduced restrictions enabling tourism recovery" },
        { factor: "Regional Development Funding", impact: "Medium", trend: "Positive", description: "Government support for regional tourism infrastructure and accommodation" }
      ],
      economic: [
        { factor: "Consumer Spending Recovery", impact: "High", trend: "Positive", description: "Pent-up demand for travel and experiences driving accommodation bookings" },
        { factor: "Labor Cost Inflation", impact: "High", trend: "Negative", description: "Hospitality wage growth and skills shortages increasing operational costs" },
        { factor: "Energy Cost Volatility", impact: "Medium", trend: "Negative", description: "Rising utility costs significantly affecting hotel operating margins" },
        { factor: "Currency Fluctuations", impact: "Medium", trend: "Neutral", description: "Exchange rates affecting international visitor numbers and spending" }
      ],
      social: [
        { factor: "Experience Travel Demand", impact: "High", trend: "Positive", description: "Shift from material goods to experiences supporting unique accommodation" },
        { factor: "Wellness Tourism Growth", impact: "Medium", trend: "Positive", description: "Health and wellness focused travel creating specialized accommodation demand" },
        { factor: "Bleisure Travel Trends", impact: "Medium", trend: "Positive", description: "Business and leisure travel combinations extending stays" },
        { factor: "Sustainable Travel Preferences", impact: "Medium", trend: "Positive", description: "Eco-conscious travelers seeking sustainable accommodation options" }
      ],
      technological: [
        { factor: "Contactless Service Delivery", impact: "High", trend: "Positive", description: "Mobile check-in, digital keys, and app-based services becoming standard" },
        { factor: "Revenue Management Systems", impact: "Medium", trend: "Positive", description: "AI-powered pricing optimization improving occupancy and rates" },
        { factor: "Guest Experience Technology", impact: "Medium", trend: "Positive", description: "In-room technology and personalization enhancing guest satisfaction" },
        { factor: "Online Travel Platforms", impact: "High", trend: "Neutral", description: "OTA dependency affecting distribution costs and direct booking strategies" }
      ],
      environmental: [
        { factor: "Sustainable Tourism Certification", impact: "Medium", trend: "Positive", description: "Green certifications becoming important for guest preference and booking" },
        { factor: "Water and Energy Conservation", impact: "Medium", trend: "Positive", description: "Resource efficiency programs reducing operational costs" },
        { factor: "Waste Reduction Requirements", impact: "Medium", trend: "Neutral", description: "Single-use plastic restrictions and waste management obligations" },
        { factor: "Carbon Offset Programs", impact: "Medium", trend: "Positive", description: "Guest willingness to pay for carbon-neutral travel experiences" }
      ],
      legal: [
        { factor: "Short-Term Rental Regulations", impact: "High", trend: "Positive", description: "Airbnb restrictions reducing competition for traditional accommodation" },
        { factor: "Liquor Licensing Changes", impact: "Medium", trend: "Neutral", description: "Extended trading hours and outdoor dining approvals" },
        { factor: "Food Safety Standards", impact: "Medium", trend: "Neutral", description: "Enhanced hygiene and safety requirements following COVID-19" },
        { factor: "Employment Law Changes", impact: "Medium", trend: "Negative", description: "Casual employment and penalty rate reforms affecting staffing costs" }
      ]
    },
    mixed: {
      political: [
        { factor: "Urban Planning Reform", impact: "High", trend: "Positive", description: "Government support for transit-oriented and mixed-use development" },
        { factor: "Affordable Housing Mandates", impact: "Medium", trend: "Neutral", description: "Inclusionary zoning requirements affecting development feasibility" },
        { factor: "Infrastructure Investment", impact: "High", trend: "Positive", description: "Public transport and utilities supporting mixed-use precincts" },
        { factor: "Development Contribution Reforms", impact: "Medium", trend: "Neutral", description: "Infrastructure levy changes affecting project economics" }
      ],
      economic: [
        { factor: "Development Finance Costs", impact: "High", trend: "Negative", description: "Higher interest rates significantly affecting complex development funding" },
        { factor: "Construction Cost Inflation", impact: "High", trend: "Negative", description: "Material and labor costs making mixed-use developments challenging" },
        { factor: "Land Value Appreciation", impact: "Medium", trend: "Positive", description: "Well-located sites for mixed-use commanding premium prices" },
        { factor: "Rental Growth Across Sectors", impact: "Medium", trend: "Positive", description: "Diversified income streams from multiple property types" }
      ],
      social: [
        { factor: "Live-Work-Play Preferences", impact: "High", trend: "Positive", description: "Consumer demand for integrated lifestyle communities" },
        { factor: "Community-Centric Development", impact: "Medium", trend: "Positive", description: "Placemaking and social infrastructure becoming key differentiators" },
        { factor: "Aging Population Needs", impact: "Medium", trend: "Positive", description: "Mixed-use developments accommodating aging-in-place preferences" },
        { factor: "Cultural Diversity", impact: "Medium", trend: "Positive", description: "Diverse communities supporting varied retail and service offerings" }
      ],
      technological: [
        { factor: "Smart City Integration", impact: "High", trend: "Positive", description: "IoT and connected systems essential for mixed-use precinct management" },
        { factor: "Integrated Building Systems", impact: "Medium", trend: "Positive", description: "Centralized utilities and services improving operational efficiency" },
        { factor: "Digital Twin Technology", impact: "Medium", trend: "Positive", description: "Building modeling and predictive maintenance for complex developments" },
        { factor: "Mobility-as-a-Service", impact: "Medium", trend: "Positive", description: "Car-sharing and micro-mobility reducing parking requirements" }
      ],
      environmental: [
        { factor: "Precinct-Level Sustainability", impact: "High", trend: "Positive", description: "Integrated renewable energy and waste systems creating competitive advantages" },
        { factor: "Green Building Certification", impact: "High", trend: "Positive", description: "Whole-of-precinct sustainability ratings becoming market differentiators" },
        { factor: "Climate Resilience Planning", impact: "Medium", trend: "Neutral", description: "Extreme weather adaptation requiring integrated infrastructure solutions" },
        { factor: "Biodiversity and Green Space", impact: "Medium", trend: "Positive", description: "Urban ecology and green infrastructure enhancing development appeal" }
      ],
      legal: [
        { factor: "Strata and Community Title", impact: "High", trend: "Neutral", description: "Complex ownership structures requiring specialized legal frameworks" },
        { factor: "Development Approval Processes", impact: "High", trend: "Negative", description: "Multiple approval pathways creating extended timelines and costs" },
        { factor: "Public-Private Partnership Rules", impact: "Medium", trend: "Positive", description: "Government collaboration opportunities for infrastructure provision" },
        { factor: "Environmental Planning Laws", impact: "Medium", trend: "Neutral", description: "Integrated assessment requirements for large mixed-use projects" }
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
                {propertyType === 'office' && (
                  <>
                    <li>• ESG and smart building technology adoption</li>
                    <li>• Government infrastructure investment</li>
                    <li>• Flight to quality from premium tenants</li>
                  </>
                )}
                {propertyType === 'retail' && (
                  <>
                    <li>• Omnichannel retail integration</li>
                    <li>• Experience economy and health services</li>
                    <li>• Tourism recovery supporting retail precincts</li>
                  </>
                )}
                {propertyType === 'industrial' && (
                  <>
                    <li>• E-commerce and manufacturing reshoring</li>
                    <li>• Government infrastructure investment</li>
                    <li>• Automation and specialized facilities</li>
                  </>
                )}
                {propertyType === 'residential' && (
                  <>
                    <li>• Government housing affordability support</li>
                    <li>• Population growth and lifestyle changes</li>
                    <li>• Smart home and PropTech adoption</li>
                  </>
                )}
                {propertyType === 'hospitality' && (
                  <>
                    <li>• Tourism recovery and experience travel</li>
                    <li>• Technology-enhanced guest services</li>
                    <li>• Sustainable tourism preferences</li>
                  </>
                )}
                {propertyType === 'mixed' && (
                  <>
                    <li>• Planning reform supporting mixed-use</li>
                    <li>• Live-work-play lifestyle preferences</li>
                    <li>• Smart city and sustainability integration</li>
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
                {propertyType === 'office' && (
                  <>
                    <li>• Permanent hybrid work model adoption</li>
                    <li>• Interest rate and inflation pressures</li>
                    <li>• Technology disrupting space requirements</li>
                  </>
                )}
                {propertyType === 'retail' && (
                  <>
                    <li>• Continued e-commerce growth impact</li>
                    <li>• Consumer spending pressure</li>
                    <li>• Tenant protection law changes</li>
                  </>
                )}
                {propertyType === 'industrial' && (
                  <>
                    <li>• Construction cost inflation</li>
                    <li>• Limited industrial land supply</li>
                    <li>• Planning restrictions and encroachment</li>
                  </>
                )}
                {propertyType === 'residential' && (
                  <>
                    <li>• Interest rates and affordability crisis</li>
                    <li>• Residential tenancy law changes</li>
                    <li>• Construction cost and skills shortages</li>
                  </>
                )}
                {propertyType === 'hospitality' && (
                  <>
                    <li>• Labor shortages and cost inflation</li>
                    <li>• Short-term rental competition</li>
                    <li>• Economic sensitivity and pandemic risks</li>
                  </>
                )}
                {propertyType === 'mixed' && (
                  <>
                    <li>• Complex approval processes</li>
                    <li>• Construction cost and financing challenges</li>
                    <li>• Multi-sector exposure risks</li>
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
                  {propertyType === 'office' && 'Flight to quality continues with ESG premium buildings outperforming'}
                  {propertyType === 'retail' && 'Experience retail and essential services maintain resilience'}
                  {propertyType === 'industrial' && 'E-commerce logistics demand remains strong despite rate headwinds'}
                  {propertyType === 'residential' && 'Interest rate sensitivity moderating activity with rental growth'}
                  {propertyType === 'hospitality' && 'Tourism recovery supporting occupancy with margin pressure'}
                  {propertyType === 'mixed' && 'Premium transit-oriented developments outperforming market'}
                </p>
                
                <p className="pt-2"><strong>Medium-term (3-5 years):</strong></p>
                <p>
                  {propertyType === 'office' && 'New work models stabilizing with technology-enabled buildings gaining share'}
                  {propertyType === 'retail' && 'Omnichannel integration and health services driving space repurposing'}
                  {propertyType === 'industrial' && 'Automation and specialized facilities commanding premium rents'}
                  {propertyType === 'residential' && 'Build-to-rent and specialized housing addressing supply challenges'}
                  {propertyType === 'hospitality' && 'Wellness and experiential travel creating premium opportunities'}
                  {propertyType === 'mixed' && 'Integrated sustainability and smart city features essential for competitiveness'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};