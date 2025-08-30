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
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Software Licensing</h3>
                <div className="space-y-2 text-sm">
                  <div>License Type: MIT License</div>
                  <div>Licensed to: Delorenzo Property Group Pty Ltd</div>
                  <div>Commercial Use: Authorized</div>
                  <div>Distribution: Restricted to authorized users</div>
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
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>
                For certificate verification or compliance inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold mb-2">Delorenzo Property Group Pty Ltd</h3>
                <div className="space-y-1 text-sm">
                  <div>ABN: 80 644 568 678</div>
                  <div>Email: info@delorenzopropertygroup.com</div>
                  <div>Website: www.delorenzopropertygroup.com.au</div>
                  <div>Phone: +61 417 693 838</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}