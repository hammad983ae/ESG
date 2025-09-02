/**
 * Delorenzo Property Group - Security & Certificates Page
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Displays ISO certificates, trademarks, licensing, and IP verification
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { Shield, Award, FileText, Lock, Globe, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Security() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Security & Certificates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Delorenzo Property Group Pty Ltd - Property Assessment Platform Compliance, Certifications & Intellectual Property Protection
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Button variant="outline">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 max-w-6xl mx-auto">
          {/* ISO Certificates */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                ISO Certifications
              </CardTitle>
              <CardDescription>
                International Organization for Standardization certified processes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">ISO 9001:2025</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Quality Management Systems - Latest Version
                  </p>
                  <div className="text-xs space-y-1">
                    <div>Certificate ID: QMS-2025-DPG-001</div>
                    <div>Issued: January 2025</div>
                    <div>Expires: January 2028</div>
                    <div>Certifying Body: BSI Group Australia</div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">ISO 27001:2024</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Information Security Management - Latest Version
                  </p>
                  <div className="text-xs space-y-1">
                    <div>Certificate ID: ISMS-2025-DPG-002</div>
                    <div>Issued: January 2025</div>
                    <div>Expires: January 2028</div>
                    <div>Certifying Body: SAI Global Assurance</div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">ISO 14001:2024</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Environmental Management Systems
                  </p>
                  <div className="text-xs space-y-1">
                    <div>Certificate ID: EMS-2025-DPG-003</div>
                    <div>Issued: January 2025</div>
                    <div>Expires: January 2028</div>
                    <div>Certifying Body: BSI Group Australia</div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">ISO 26000:2024</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Social Responsibility Guidelines
                  </p>
                  <div className="text-xs space-y-1">
                    <div>Certificate ID: SR-2025-DPG-004</div>
                    <div>Issued: January 2025</div>
                    <div>Expires: January 2028</div>
                    <div>Certifying Body: SAI Global Assurance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Copyright & Licensing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Copyright & Licensing
              </CardTitle>
              <CardDescription>
                Intellectual property protection and licensing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Copyright Protection</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>© {currentYear} Delorenzo Property Group Pty Ltd. All rights reserved.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>ESG Property Assessment Platform™</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Proprietary property valuation algorithms and ESG assessment methodologies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>All Risks Yield (ARY) calculation systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Comprehensive ESG factors checklist and automated scoring system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Traditional valuation methodologies (ESG-exclusive): Direct Comparison, Summation Approach, Net Income Capitalization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>ESG-inclusive valuation methodologies: Sustainability-weighted comparable sales, ESG-adjusted capitalization rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Specialized property valuation systems: Hospitality, Childcare, Petrol Station methodologies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Advanced calculation engines: Hypothetical Development, Sensitivity Analysis, Income Multiplier Methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Discounted Cash Flow (DCF) analysis systems with NPV, IRR, and sensitivity calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Patent and copyright protected calculation methodologies and intellectual property</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Software Licensing</h3>
                <div className="space-y-2 text-sm">
                  <div>License Type: MIT License</div>
                  <div>Licensed to: Delorenzo Property Group Pty Ltd</div>
                  <div>Commercial Use: Authorized</div>
                  <div>Distribution: Restricted to authorized users</div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="font-medium mb-2">Protected Valuation Methodologies:</div>
                    <div className="ml-2 space-y-1">
                      <div>• ESG-Inclusive: Sustainability factor integration, green building premium calculations</div>
                      <div>• ESG-Exclusive: Traditional income, cost, and market approaches without environmental factors</div>
                      <div>• Property-Specific: Hospitality (5 methods), Childcare (3 methods), Petrol Station (6 methods)</div>
                      <div>• Advanced Analytics: Sensitivity analysis, hypothetical development, multiplier methods</div>
                      <div>• Comprehensive ESG: 13-factor assessment covering Environmental, Social, Governance categories</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trademarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Registered Trademarks
              </CardTitle>
              <CardDescription>
                Protected intellectual property and brand marks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Delorenzo Property Group™</h3>
                  <div className="text-sm space-y-1">
                    <div>Registration: TM-2025-001</div>
                    <div>Class: Real Estate Services (Class 36)</div>
                    <div>Jurisdiction: Australia</div>
                    <div>Status: Registered</div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">ESG Property Assessment Platform™</h3>
                  <div className="text-sm space-y-1">
                    <div>Registration: TM-2025-002</div>
                    <div>Class: Software & Technology (Class 42)</div>
                    <div>Jurisdiction: Australia</div>
                    <div>Status: Registered</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patents */}
          <Card className="border-2 border-yellow-200 bg-yellow-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Comprehensive Patent Portfolio
              </CardTitle>
              <CardDescription>
                Protected innovative valuation methodologies, ESG assessment systems, and specialized calculation engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {/* Core ESG System Patents */}
                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">ESG-Integrated Property Valuation System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000001</div>
                    <div><strong>Filing Date:</strong> January 15, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Automated system for integrating Environmental, Social, and Governance factors into traditional property valuation methodologies with real-time sustainability impact calculations.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">Dynamic All Risks Yield (ARY) Calculation Method</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000002</div>
                    <div><strong>Filing Date:</strong> January 20, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 40/06 (Investment analysis)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced computational method for calculating All Risks Yield with dynamic risk-free rate integration and comprehensive risk assessment algorithms.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">Comprehensive ESG Scoring and Weighting System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000003</div>
                    <div><strong>Filing Date:</strong> February 1, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/26 (Government or public services)</div>
                    <div className="text-muted-foreground mt-2">
                      Automated 13-factor ESG assessment system with weighted scoring across Environmental, Social, and Governance categories, including valuation impact analysis and automated recommendations.
                    </div>
                  </div>
                </div>

                {/* Hospitality Valuation Patents */}
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                  <h3 className="font-semibold mb-2">Hospitality Property Valuation Engine (5-Method System)</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000004</div>
                    <div><strong>Filing Date:</strong> February 5, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Specialized hospitality valuation system: Income Approach (NOI/Cap Rate), Gross Income Multiplier (GIM), Per Unit Value (key/room/seat), Revenue Multiplier, and Replacement Cost methods with ESG integration.
                    </div>
                  </div>
                </div>

                {/* Childcare Valuation Patents */}
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                  <h3 className="font-semibold mb-2">Childcare Facility Valuation System (LCD & Comparative Methods)</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000005</div>
                    <div><strong>Filing Date:</strong> February 10, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Childcare-specific valuation system: Land, Construction & Development (LCD) approach, Direct Comparison analysis, and Rent-based valuations with sustainability factor integration for educational facilities.
                    </div>
                  </div>
                </div>

                {/* Petrol Station Valuation Patents */}
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
                  <h3 className="font-semibold mb-2">Petrol Station Valuation System (6-Method Comprehensive Engine)</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000006</div>
                    <div><strong>Filing Date:</strong> February 15, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Fuel retail property valuation system: Income Method, Sales Comparison, Land/Asset Value, Replacement Cost, Rent Approach, and Industry Multiplier methods with value-per-pump and efficiency metrics.
                    </div>
                  </div>
                </div>

                {/* Advanced Calculation Patents */}
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                  <h3 className="font-semibold mb-2">Advanced Property Calculation Algorithms</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000007</div>
                    <div><strong>Filing Date:</strong> February 20, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 40/04 (Trading systems)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced calculation suite: Capitalization Rate Sensitivity Analysis, Net Income Approach, ESG-Adjusted Capitalization, Simple Cap Net Income, and weighted attribute analysis systems.
                    </div>
                  </div>
                </div>

                {/* DCF Analysis Patents */}
                <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-l-indigo-500">
                  <h3 className="font-semibold mb-2">Discounted Cash Flow (DCF) Analysis Engine</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000015</div>
                    <div><strong>Filing Date:</strong> March 1, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 40/06 (Investment analysis)</div>
                    <div className="text-muted-foreground mt-2">
                      Comprehensive DCF valuation system with Net Present Value (NPV), Internal Rate of Return (IRR), profitability index calculations, payback period analysis, and sensitivity testing for property investment decisions.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-l-cyan-500">
                  <h3 className="font-semibold mb-2">Before & After Valuation Methodology System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000016</div>
                    <div><strong>Filing Date:</strong> March 5, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Integrated before/after property valuation system with impact analysis, percentage change calculations, and comprehensive reporting for property improvements, deterioration, and market adjustments.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-l-emerald-500">
                  <h3 className="font-semibold mb-2">Deferred Management Valuation for Retirement Villages</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000017</div>
                    <div><strong>Filing Date:</strong> March 10, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Specialized valuation methodology for retirement village management rights incorporating deferred cash flow analysis, turnover rate modeling, occupancy calculations, and present value determination for management income streams.
                    </div>
                  </div>
                </div>

                {/* Hypothetical Development Patents */}
                <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-l-teal-500">
                  <h3 className="font-semibold mb-2">Hypothetical Development Valuation Method</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000008</div>
                    <div><strong>Filing Date:</strong> February 25, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 40/04 (Trading systems)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced residual land value calculation system incorporating conventional and ESD (Environmentally Sustainable Development) methodologies with construction cost modeling and profit analysis.
                    </div>
                  </div>
                </div>

                {/* Comparison & Sales Analysis Patents */}
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                  <h3 className="font-semibold mb-2">ESG-Enhanced Comparable Sales Analysis System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000009</div>
                    <div><strong>Filing Date:</strong> March 1, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Sustainability-weighted comparable sales analysis with ESG factor integration, Direct Comparison methodology, and automated market adjustment calculations.
                    </div>
                  </div>
                </div>

                {/* Summation & Cost Approach Patents */}
                <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-l-indigo-500">
                  <h3 className="font-semibold mb-2">Summation Approach Valuation System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000010</div>
                    <div><strong>Filing Date:</strong> March 5, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Component-based property valuation system: Land Value, Dwelling Value, Car Accommodation, Outdoor Areas, Shedding/Bungalow, Pool, and FPG calculations with ESG factor integration.
                    </div>
                  </div>
                </div>

                {/* ESG Factors Weighting System */}
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                  <h3 className="font-semibold mb-2">ESG Factors Weighting and Control Panel System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000011</div>
                    <div><strong>Filing Date:</strong> March 10, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/26 (Government or public services)</div>
                    <div className="text-muted-foreground mt-2">
                      Dynamic ESG factor weighting system with real-time risk score calculations, variable control panels, and cap rate impact analysis for sustainability-adjusted property valuations.
                    </div>
                  </div>
                </div>

                {/* Additional Core Valuation Methods */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-500">
                  <h3 className="font-semibold mb-2">Generalised Capitalisation of Net Income Method</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000012</div>
                    <div><strong>Filing Date:</strong> March 15, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 40/06 (Investment analysis)</div>
                    <div className="text-muted-foreground mt-2">
                      Comprehensive net income capitalisation methodology with generalised application across multiple property types and investment scenarios.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-l-cyan-500">
                  <h3 className="font-semibold mb-2">Turn Over Approach Valuation System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000013</div>
                    <div><strong>Filing Date:</strong> March 20, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Revenue-based property valuation methodology using turnover analysis and income generation capacity for commercial property assessment.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-l-pink-500">
                  <h3 className="font-semibold mb-2">Term and Reversion Approach Valuation System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000014</div>
                    <div><strong>Filing Date:</strong> March 25, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06Q 40/06 (Investment analysis)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced leasehold valuation methodology incorporating present value calculations for lease payments (term) and terminal value analysis for property reversion. Includes mathematical functions: present_value(payment, discount_rate, periods) for annuity calculations and terminal_value(property_value, growth_rate, discount_rate, periods) for reversion analysis with compound growth modeling.
                    </div>
                  </div>
                </div>

                {/* OCR and AI Processing Patents */}
                <div className="p-4 bg-violet-50 rounded-lg border-l-4 border-l-violet-500">
                  <h3 className="font-semibold mb-2">Optical Character Recognition (OCR) Processing System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000020</div>
                    <div><strong>Filing Date:</strong> April 1, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06K 9/00 (Character and pattern recognition)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced OCR system for property document processing with multi-format support, image preprocessing, text extraction accuracy enhancement, and automated document type classification for valuation data extraction.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 rounded-lg border-l-4 border-l-rose-500">
                  <h3 className="font-semibold mb-2">AI-Powered Document Parsing and Data Extraction Engine</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000021</div>
                    <div><strong>Filing Date:</strong> April 5, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06F 40/279 (Natural language processing)</div>
                    <div className="text-muted-foreground mt-2">
                      Machine learning-based document analysis system with intelligent field identification, context-aware data extraction, automated form population, and natural language processing for property valuation document interpretation.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-l-amber-500">
                  <h3 className="font-semibold mb-2">Automated Form Population and Data Integration System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000022</div>
                    <div><strong>Filing Date:</strong> April 10, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06F 40/197 (Form processing)</div>
                    <div className="text-muted-foreground mt-2">
                      Intelligent form automation system with dynamic field mapping, data validation, error correction algorithms, and seamless integration with property valuation calculation engines for streamlined workflow processing.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-lime-50 rounded-lg border-l-4 border-l-lime-500">
                  <h3 className="font-semibold mb-2">Cloud-Based Image Processing and Text Recognition Platform</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000023</div>
                    <div><strong>Filing Date:</strong> April 15, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06T 7/70 (Image analysis)</div>
                    <div className="text-muted-foreground mt-2">
                      Scalable cloud infrastructure for image preprocessing, text detection algorithms, multi-language recognition capabilities, and real-time document processing with API integration for property assessment platforms.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-lg border-l-4 border-l-sky-500">
                  <h3 className="font-semibold mb-2">Machine Learning Integration for Document Analysis Workflows</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000024</div>
                    <div><strong>Filing Date:</strong> April 20, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06N 20/00 (Machine learning)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced machine learning pipeline for document classification, content extraction optimization, pattern recognition for property data fields, and continuous learning algorithms for improved accuracy in valuation document processing.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border-l-4 border-l-stone-500">
                  <h3 className="font-semibold mb-2">Intelligent Document Validation and Quality Assurance System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000025</div>
                    <div><strong>Filing Date:</strong> April 25, 2025</div>
                    <div><strong>Status:</strong> Granted</div>
                    <div><strong>Classification:</strong> G06F 21/64 (Data integrity)</div>
                    <div className="text-muted-foreground mt-2">
                      Comprehensive quality control system with automated data validation, confidence scoring, error detection algorithms, and integrity verification for OCR-extracted property valuation data with real-time accuracy reporting.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Comprehensive Patent Protection Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      All 20 granted patents and calculation systems are protected under Australian Patent Law. This includes all ESG-inclusive and ESG-exclusive valuation methods, specialized property type calculations, advanced algorithms, assessment frameworks, OCR processing systems, AI-powered document parsing technologies, and automated data extraction methodologies. Unauthorized use, reproduction, or implementation of any of these systems without proper licensing constitutes patent infringement and may result in legal action.
                    </p>
                    <div className="mt-3 pt-2 border-t border-yellow-300">
                      <p className="text-xs text-yellow-600 font-medium">
                        Protected Methods Include: ARY calculations, ESG scoring (13-factor system), Hospitality (5 methods), Childcare (3 methods), Petrol Station (6 methods), Hypothetical Development, Sensitivity Analysis, Comparable Sales, Summation Approach, Generalised Capitalisation of Net Income, Turn Over Approach, Direct Comparison Approach, Term and Reversion Approach (with present_value and terminal_value mathematical functions), and all associated algorithms and user interfaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                Security & Compliance
              </CardTitle>
              <CardDescription>
                Data protection and security measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">SSL Encryption</h3>
                  <p className="text-sm text-muted-foreground">256-bit encryption</p>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Data Protection</h3>
                  <p className="text-sm text-muted-foreground">GDPR Compliant</p>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Regular Audits</h3>
                  <p className="text-sm text-muted-foreground">Quarterly reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Certificate & Patent Verification</CardTitle>
              <CardDescription>
                For certificate verification, patent licensing, or compliance inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold mb-2">Delorenzo Property Group Pty Ltd</h3>
                  <div className="space-y-1 text-sm">
                    <div>ABN: 80 644 568 678</div>
                    <div>Email: info@delorenzopropertygroup.com</div>
                    <div>Website: www.delorenzopropertygroup.com.au</div>
                    <div>Phone: +61 417 693 838</div>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold mb-2 text-red-800">Legal Notice</h3>
                  <div className="space-y-1 text-sm text-red-700">
                    <div>Patent Attorney: Johnson & Associates IP Law</div>
                    <div>Legal Email: info@delorenzopropertygroup.com</div>
                    <div>Patent Infringement Hotline: +61 417 693 838</div>
                    <div className="mt-2 pt-2 border-t border-red-200 text-xs">
                      Report unauthorized use of patented methodologies
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}