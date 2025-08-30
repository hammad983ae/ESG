/**
 * Delorenzo Property Group Pty Ltd - ESG Property Assessment Platform - Security & Certificates
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Security overview and certification display page showcasing:
 * - ISO certifications and compliance standards
 * - Data security protocols and blockchain integration
 * - Platform security features and audit information
 * - Trust and certification badges
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Award, Lock, Database, CheckCircle, Globe, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent flex items-center gap-3">
                <Shield className="w-10 h-10 text-primary" />
                Security & Certifications
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Trust, compliance, and security standards for Delorenzo Property Group Pty Ltd
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* ISO Certification Section */}
          <Card className="border-success/20 bg-gradient-to-br from-card to-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-success">
                <Award className="w-6 h-6" />
                ISO Certifications
              </CardTitle>
              <CardDescription>
                Our commitment to quality, security, and environmental management standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-background/50 rounded-lg border border-success/20">
                  <Award className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">ISO 27001</h3>
                  <p className="text-sm text-muted-foreground mb-3">Information Security Management</p>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Certified
                  </Badge>
                </div>
                
                <div className="text-center p-6 bg-background/50 rounded-lg border border-info/20">
                  <Globe className="w-12 h-12 text-info mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">ISO 14001</h3>
                  <p className="text-sm text-muted-foreground mb-3">Environmental Management</p>
                  <Badge variant="secondary" className="bg-info/10 text-info border-info/20">
                    Certified
                  </Badge>
                </div>
                
                <div className="text-center p-6 bg-background/50 rounded-lg border border-warning/20">
                  <CheckCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">ISO 9001</h3>
                  <p className="text-sm text-muted-foreground mb-3">Quality Management Systems</p>
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    Certified
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Certificate Authority: <strong>BSI Group</strong> | 
                  Valid Through: <strong>December 2026</strong> | 
                  Certificate ID: <strong>DPG-ISO-2025-001</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Lock className="w-6 h-6" />
                  Data Security
                </CardTitle>
                <CardDescription>
                  Multi-layered security approach protecting your property data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">End-to-End Encryption</h4>
                    <p className="text-sm text-muted-foreground">AES-256 encryption for all data transmission and storage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">Blockchain Security</h4>
                    <p className="text-sm text-muted-foreground">Immutable audit trails and data integrity verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">Multi-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Enhanced access controls and identity verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">Regular Security Audits</h4>
                    <p className="text-sm text-muted-foreground">Third-party penetration testing and vulnerability assessments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-info/20 bg-gradient-to-br from-card to-info/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-info">
                  <Database className="w-6 h-6" />
                  Platform Infrastructure
                </CardTitle>
                <CardDescription>
                  Enterprise-grade infrastructure and compliance standards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">GDPR Compliant</h4>
                    <p className="text-sm text-muted-foreground">Full compliance with European data protection regulations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">APRA Guidelines</h4>
                    <p className="text-sm text-muted-foreground">Adherence to Australian Prudential Regulation Authority standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cloud Infrastructure</h4>
                    <p className="text-sm text-muted-foreground">AWS-hosted with 99.9% uptime guarantee and auto-scaling</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium">Data Backup & Recovery</h4>
                    <p className="text-sm text-muted-foreground">Automated backups with point-in-time recovery capabilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance & Trust Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Server className="w-6 h-6" />
                Compliance & Trust
              </CardTitle>
              <CardDescription>
                Industry certifications and regulatory compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg border">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">SOC 2 Type II</p>
                  <p className="text-xs text-muted-foreground">Security Audit</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg border">
                  <Award className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-xs font-medium">ASIC Compliant</p>
                  <p className="text-xs text-muted-foreground">Australian Securities</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg border">
                  <Lock className="w-8 h-8 text-info mx-auto mb-2" />
                  <p className="text-xs font-medium">Privacy Act</p>
                  <p className="text-xs text-muted-foreground">Australian Privacy</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg border">
                  <CheckCircle className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-xs font-medium">PCI DSS</p>
                  <p className="text-xs text-muted-foreground">Payment Security</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-muted/20">
            <CardHeader>
              <CardTitle>Security Contact Information</CardTitle>
              <CardDescription>
                Report security concerns or request compliance documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Security Team:</strong> security@delorenzopropertygroup.com.au</p>
                <p><strong>Compliance Officer:</strong> compliance@delorenzopropertygroup.com.au</p>
                <p><strong>Data Protection Officer:</strong> privacy@delorenzopropertygroup.com.au</p>
                <p><strong>Business Address:</strong> Delorenzo Property Group Pty Ltd, Australia</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Security;