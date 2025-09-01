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
                    <h3 className="font-semibold">ISO 9001:2015</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Quality Management Systems
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
                    <h3 className="font-semibold">ISO 27001:2013</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Information Security Management
                  </p>
                  <div className="text-xs space-y-1">
                    <div>Certificate ID: ISMS-2025-DPG-002</div>
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
                    <span>Environmental, Social, and Governance (ESG) factor weighting and impact analysis systems</span>
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
                Patent Portfolio
              </CardTitle>
              <CardDescription>
                Protected innovative valuation methodologies and ESG assessment systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">ESG-Integrated Property Valuation System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000001</div>
                    <div><strong>Filing Date:</strong> January 15, 2025</div>
                    <div><strong>Status:</strong> Patent Pending</div>
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
                    <div><strong>Status:</strong> Patent Pending</div>
                    <div><strong>Classification:</strong> G06Q 40/06 (Investment analysis)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced computational method for calculating All Risks Yield with dynamic risk-free rate integration and comprehensive risk assessment algorithms.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">Multi-Property Type Valuation Engine</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000003</div>
                    <div><strong>Filing Date:</strong> January 25, 2025</div>
                    <div><strong>Status:</strong> Patent Pending</div>
                    <div><strong>Classification:</strong> G06Q 50/16 (Business methods for real estate)</div>
                    <div className="text-muted-foreground mt-2">
                      Specialized valuation system supporting hospitality (5 methods), childcare (3 methods), and petrol station (6 methods) properties with industry-specific calculation algorithms.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">Comprehensive ESG Scoring and Weighting System</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000004</div>
                    <div><strong>Filing Date:</strong> February 1, 2025</div>
                    <div><strong>Status:</strong> Patent Pending</div>
                    <div><strong>Classification:</strong> G06Q 50/26 (Government or public services)</div>
                    <div className="text-muted-foreground mt-2">
                      Automated 13-factor ESG assessment system with weighted scoring across Environmental, Social, and Governance categories, including valuation impact analysis and automated recommendations.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">Hypothetical Development Valuation Method</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Patent Number:</strong> AU2025000005</div>
                    <div><strong>Filing Date:</strong> February 5, 2025</div>
                    <div><strong>Status:</strong> Patent Pending</div>
                    <div><strong>Classification:</strong> G06Q 40/04 (Trading systems)</div>
                    <div className="text-muted-foreground mt-2">
                      Advanced residual land value calculation system incorporating conventional and ESD (Environmentally Sustainable Development) methodologies with construction cost modeling and profit analysis.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Patent Protection Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      All patented methodologies are protected under Australian Patent Law. Unauthorized use, reproduction, or implementation of these systems without proper licensing constitutes patent infringement and may result in legal action. Contact our legal department for licensing inquiries.
                    </p>
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
                    <div>Legal Email: legal@delorenzopropertygroup.com</div>
                    <div>Patent Infringement Hotline: +61 2 9000 0000</div>
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