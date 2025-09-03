/**
 * Client Presentation - Property & Agricultural Hub Platform
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Sprout, 
  TrendingUp, 
  Shield, 
  Calculator, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Users,
  Globe,
  BarChart3,
  Leaf,
  MapPin,
  Target,
  Zap,
  Lock
} from "lucide-react";

export const ClientPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "welcome",
      title: "Delorenzo Property Group",
      subtitle: "ESG Property Assessment Platform™",
      content: (
        <div className="text-center space-y-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Building2 className="h-16 w-16 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Welcome to the Future of Property Valuation</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive ESG-integrated platform combining traditional valuation methods 
              with cutting-edge environmental, social, and governance assessment tools.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">Patent Protected</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">ISO Compliant</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Industry Leading</Badge>
          </div>
        </div>
      )
    },
    {
      id: "overview",
      title: "Platform Overview",
      subtitle: "Integrated Property & Agricultural Assessment Suite",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <CardTitle>Property Hub</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Commercial Properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Residential Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Industrial Facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Sports Stadiums</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Fast Food Outlets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Healthcare Properties</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sprout className="h-8 w-8 text-green-600" />
                <CardTitle>Agricultural Hub</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Crop Valuation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Orchard Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Vineyard Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Pasture Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Mixed Farm Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Management Diary</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "key-features",
      title: "Key Platform Features",
      subtitle: "Comprehensive Valuation & Assessment Tools",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Calculator className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Advanced Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• DCF Analysis</li>
                <li>• Capitalization Methods</li>
                <li>• Direct Comparison</li>
                <li>• Summation Approach</li>
                <li>• Rent Revision Tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">ESG Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Environmental Impact</li>
                <li>• Social Responsibility</li>
                <li>• Governance Metrics</li>
                <li>• Sustainability Scoring</li>
                <li>• Climate Risk Assessment</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Security & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Patent Protected</li>
                <li>• ISO 27001 Compliant</li>
                <li>• SOC 2 Type II</li>
                <li>• Enterprise Grade Security</li>
                <li>• Data Encryption</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "agricultural-focus",
      title: "Agricultural Specialization",
      subtitle: "Comprehensive Farm & Crop Management",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-green-600" />
                Valuation Methods
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Crop Yield Analysis</div>
                  <div className="text-sm text-muted-foreground">Per acre/hectare productivity assessment</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Commodity Market Integration</div>
                  <div className="text-sm text-muted-foreground">Real-time pricing and forecast analysis</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Infrastructure Assessment</div>
                  <div className="text-sm text-muted-foreground">Irrigation, storage, and processing facilities</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-green-600" />
                Management Tools
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Spray Program Tracking</div>
                  <div className="text-sm text-muted-foreground">Chemical applications and schedules</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Labor Cost Calculator</div>
                  <div className="text-sm text-muted-foreground">Workforce planning and wage analysis</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Expense Management</div>
                  <div className="text-sm text-muted-foreground">Operational cost tracking and optimization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "technology",
      title: "Technology & Innovation",
      subtitle: "Cutting-Edge Platform Capabilities",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Platform Capabilities
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">OCR Document Processing</div>
                  <div className="text-sm text-muted-foreground">Automated data extraction from property documents</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Geographic Integration</div>
                  <div className="text-sm text-muted-foreground">Location-based analysis and comparable sales</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Market Analytics</div>
                  <div className="text-sm text-muted-foreground">Real-time market data and trend analysis</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Security Features
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="font-medium text-blue-900">Enterprise Security</div>
                <div className="text-sm text-blue-700 mt-1">End-to-end encryption, secure authentication, audit trails</div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border">
                <div className="font-medium text-green-900">Data Protection</div>
                <div className="text-sm text-green-700 mt-1">GDPR compliant, secure cloud infrastructure, backup systems</div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
                <div className="font-medium text-orange-900">Compliance Standards</div>
                <div className="text-sm text-orange-700 mt-1">ISO 27001, SOC 2 Type II, industry best practices</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "benefits",
      title: "Client Benefits",
      subtitle: "Why Choose Our Platform",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="text-center">
              <Award className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary">95%</h3>
              <p className="text-muted-foreground">Accuracy in Valuations</p>
            </div>
            
            <div className="text-center">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600">500+</h3>
              <p className="text-muted-foreground">Properties Assessed</p>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-600">60%</h3>
              <p className="text-muted-foreground">Time Savings</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Key Advantages</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="font-medium">Comprehensive ESG Integration</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Automated Document Processing</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="font-medium">Real-time Market Data</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="font-medium">Industry-Leading Security</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                <span className="font-medium">Specialized Agricultural Tools</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "next-steps",
      title: "Next Steps",
      subtitle: "Let's Get Started",
      content: (
        <div className="text-center space-y-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Property Assessments?</h3>
            <p className="text-lg text-muted-foreground">
              Join the leading property professionals who trust our platform for accurate, 
              comprehensive, and ESG-integrated valuations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="text-3xl mb-4">📞</div>
              <h4 className="font-semibold mb-2">Schedule Demo</h4>
              <p className="text-sm text-muted-foreground">Book a personalized platform demonstration</p>
            </Card>
            
            <Card className="p-6 text-center border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
              <div className="text-3xl mb-4">🚀</div>
              <h4 className="font-semibold mb-2">Trial Access</h4>
              <p className="text-sm text-muted-foreground">Start with a 30-day free trial</p>
            </Card>
            
            <Card className="p-6 text-center border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
              <div className="text-3xl mb-4">🤝</div>
              <h4 className="font-semibold mb-2">Partnership</h4>
              <p className="text-sm text-muted-foreground">Explore enterprise partnership opportunities</p>
            </Card>
          </div>
          
          <div className="pt-8">
            <Button size="lg" className="mr-4">
              Schedule Demo
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {currentSlideData.title}
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            {currentSlideData.subtitle}
          </p>
        </div>

        {/* Slide Content */}
        <Card className="mb-8 shadow-2xl min-h-[600px]">
          <CardContent className="p-8">
            {currentSlideData.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <Button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>
    </div>
  );
};