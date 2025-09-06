import { useState, useMemo } from "react";
import { Search, Calculator, Building, TrendingUp, Target, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SearchItem {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  route: string;
  tab?: string;
  icon: React.ElementType;
}

const searchItems: SearchItem[] = [
  // Basic Dashboard Items
  {
    id: "basic-esg",
    name: "Basic ESG Assessment",
    description: "Environmental, Social, and Governance scoring with risk analysis",
    category: "Basic Assessment",
    keywords: ["esg", "environmental", "social", "governance", "sustainability", "risk", "assessment"],
    route: "/",
    tab: "basic",
    icon: Calculator
  },
  {
    id: "before-after",
    name: "Before & After Valuation",
    description: "Compare property values before and after changes or improvements",
    category: "Basic Assessment", 
    keywords: ["before", "after", "comparison", "change", "impact", "valuation"],
    route: "/",
    tab: "before-after",
    icon: ArrowUpDown
  },
  {
    id: "advanced-calculations",
    name: "Advanced Calculations",
    description: "Automated formulas with climate risk assessment and financial integration",
    category: "Basic Assessment",
    keywords: ["advanced", "automated", "climate", "risk", "financial", "seifa", "calculations"],
    route: "/",
    tab: "advanced", 
    icon: Target
  },

  // Valuation Analysis Items
  {
    id: "ary",
    name: "All Risks Yield (ARY)",
    description: "Standard ARY calculations for commercial property valuation",
    category: "Valuation Analysis",
    keywords: ["ary", "all risks yield", "commercial", "yield", "cap rate"],
    route: "/valuation",
    tab: "ary",
    icon: TrendingUp
  },
  {
    id: "esg-ary",
    name: "ESG-Adjusted ARY",
    description: "ARY calculations with ESG sustainability factors integrated",
    category: "Valuation Analysis",
    keywords: ["esg", "ary", "sustainability", "adjusted", "green", "environmental"],
    route: "/valuation",
    tab: "esg",
    icon: TrendingUp
  },
  {
    id: "capitalization-sensitivity",
    name: "Capitalization Rate Sensitivity",
    description: "Analyze sensitivity of valuations to cap rate changes",
    category: "Valuation Analysis", 
    keywords: ["capitalization", "cap rate", "sensitivity", "analysis"],
    route: "/valuation",
    tab: "capitalization",
    icon: Calculator
  },
  {
    id: "net-income",
    name: "Net Income Capitalization",
    description: "Property valuation using net operating income approach",
    category: "Valuation Analysis",
    keywords: ["net income", "noi", "capitalization", "income approach"],
    route: "/valuation",
    tab: "netincome",
    icon: Calculator
  },
  {
    id: "esg-capitalization",
    name: "ESG-Adjusted Capitalization",
    description: "Income capitalization with ESG risk adjustments",
    category: "Valuation Analysis",
    keywords: ["esg", "capitalization", "income", "adjusted", "sustainability"],
    route: "/valuation",
    tab: "esgcapitalization",
    icon: Calculator
  },
  {
    id: "esg-comparable-sales",
    name: "ESG Comparable Sales",
    description: "Comparable sales analysis with ESG weighting factors",
    category: "Valuation Analysis",
    keywords: ["comparable", "sales", "esg", "market", "analysis"],
    route: "/valuation",
    tab: "esgcomparablesales",
    icon: TrendingUp
  },
  {
    id: "simple-cap-income",
    name: "Simple Capitalization of Income",
    description: "Basic income capitalization method for property valuation",
    category: "Valuation Analysis",
    keywords: ["simple", "capitalization", "income", "basic"],
    route: "/valuation",
    tab: "capnetincome",
    icon: Calculator
  },
  {
    id: "summation-approach",
    name: "Summation Approach",
    description: "Land plus building value summation methodology",
    category: "Valuation Analysis",
    keywords: ["summation", "land", "building", "approach"],
    route: "/valuation",
    tab: "summation",
    icon: Building
  },
  {
    id: "direct-comparison",
    name: "Direct Comparison",
    description: "Direct market comparison valuation method",
    category: "Valuation Analysis",
    keywords: ["direct", "comparison", "market", "comparable"],
    route: "/valuation",
    tab: "directcomparison",
    icon: TrendingUp
  },
  {
    id: "hypothetical-development",
    name: "Hypothetical Development",
    description: "Development feasibility and valuation analysis",
    category: "Valuation Analysis",
    keywords: ["hypothetical", "development", "feasibility", "residual"],
    route: "/valuation",
    tab: "hypotheticaldevelopment",
    icon: Building
  },
  {
    id: "hospitality-valuation",
    name: "Hospitality Valuation",
    description: "Specialized valuation for hotels and hospitality properties",
    category: "Specialized Valuations",
    keywords: ["hospitality", "hotel", "motel", "tourism", "accommodation"],
    route: "/valuation",
    tab: "hospitality",
    icon: Building
  },
  {
    id: "childcare-valuation",
    name: "Childcare Valuation", 
    description: "Specialized valuation for childcare and daycare facilities",
    category: "Specialized Valuations",
    keywords: ["childcare", "daycare", "children", "education", "care"],
    route: "/valuation",
    tab: "childcare",
    icon: Building
  },
  {
    id: "comprehensive-esg",
    name: "Comprehensive ESG Assessment",
    description: "Advanced comprehensive ESG analysis with detailed metrics",
    category: "ESG Analysis",
    keywords: ["comprehensive", "esg", "environmental", "social", "governance", "detailed"],
    route: "/valuation",
    tab: "comprehensive-esg",
    icon: Target
  },
  {
    id: "petrol-station",
    name: "Petrol Station Valuation",
    description: "Specialized valuation for petrol stations and fuel facilities",
    category: "Specialized Valuations",
    keywords: ["petrol", "gas", "fuel", "station", "service station"],
    route: "/valuation",
    tab: "petrol-station",
    icon: Building
  },
  {
    id: "deferred-management",
    name: "Deferred Management Fee",
    description: "Valuation for retirement villages with deferred management fees",
    category: "Specialized Valuations",
    keywords: ["deferred", "management", "retirement", "village", "aged care"],
    route: "/valuation",
    tab: "deferred-management",
    icon: Building
  },

  // Specialized AVM Items
  {
    id: "commercial-avm",
    name: "Commercial AVM",
    description: "AI-powered automated valuation for commercial properties",
    category: "Specialized AVM",
    keywords: ["commercial", "avm", "automated", "ai", "office", "warehouse"],
    route: "/",
    tab: "commercial-avm",
    icon: Building
  },
  {
    id: "industrial-avm", 
    name: "Industrial AVM",
    description: "Automated valuation for industrial assets and factories",
    category: "Specialized AVM",
    keywords: ["industrial", "avm", "factory", "warehouse", "manufacturing"],
    route: "/",
    tab: "industrial-avm",
    icon: Building
  },
  {
    id: "retail-avm",
    name: "Retail AVM", 
    description: "Automated valuation for retail properties and shopping centers",
    category: "Specialized AVM",
    keywords: ["retail", "avm", "shopping", "store", "mall"],
    route: "/",
    tab: "retail-avm",
    icon: Building
  },
  {
    id: "hospitality-avm",
    name: "Hospitality AVM",
    description: "Automated valuation for hotels and hospitality properties",
    category: "Specialized AVM", 
    keywords: ["hospitality", "avm", "hotel", "motel", "accommodation"],
    route: "/",
    tab: "hospitality-avm",
    icon: Building
  },
  {
    id: "healthcare-avm",
    name: "Healthcare AVM",
    description: "Automated valuation for healthcare facilities and medical centers",
    category: "Specialized AVM",
    keywords: ["healthcare", "avm", "medical", "hospital", "clinic"],
    route: "/",
    tab: "healthcare-avm", 
    icon: Building
  },
  {
    id: "education-avm",
    name: "Education AVM",
    description: "Automated valuation for educational properties and schools",
    category: "Specialized AVM",
    keywords: ["education", "avm", "school", "university", "college"],
    route: "/",
    tab: "education-avm",
    icon: Building
  }
];

interface SearchFunctionProps {
  onSelectMethod?: (item: SearchItem) => void;
}

export const SearchFunction = ({ onSelectMethod }: SearchFunctionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return searchItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const categorizedResults = useMemo(() => {
    const grouped: Record<string, SearchItem[]> = {};
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleSelectItem = (item: SearchItem) => {
    setSearchQuery("");
    setIsOpen(false);
    onSelectMethod?.(item);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search valuation methods, ESG assessments, or AVM tools..."
          value={searchQuery} 
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 py-3 text-base"
        />
      </div>

      {isOpen && searchQuery && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              {Object.keys(categorizedResults).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(categorizedResults).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-2 bg-muted/50 border-b">
                        <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                      </div>
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.id}>
                            {item.route === "/" ? (
                              <Button
                                variant="ghost"
                                className="w-full justify-start p-4 h-auto text-left"
                                onClick={() => handleSelectItem(item)}
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {item.description}
                                    </p>
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                      {item.category}
                                    </Badge>
                                  </div>
                                </div>
                              </Button>
                            ) : (
                              <Link 
                                to={item.route}
                                onClick={() => handleSelectItem(item)}
                                className="block"
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start p-4 h-auto text-left"
                                >
                                  <div className="flex items-start gap-3">
                                    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">{item.name}</p>
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {item.description}
                                      </p>
                                      <Badge variant="secondary" className="mt-1 text-xs">
                                        {item.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </Button>
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No valuation methods found</p>
                  <p className="text-xs">Try searching for "ESG", "ARY", "AVM", or "valuation"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};