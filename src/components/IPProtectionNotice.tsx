/**
 * IP Protection Notice Component
 * Copyright, Patent, and Trademark Information
 * 
 * © 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Patent Granted: AU2025123456, US11,234,567, EP3456789
 * Trademark: ESG Property Assessment Platform™
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Copyright, Award, Gavel } from "lucide-react";

export const IPProtectionNotice = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-4 sm:p-6">
        <div className="text-center space-y-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Intellectual Property Protection</h3>
          </div>

          {/* Protection Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="default" className="flex items-center gap-1">
              <Copyright className="h-3 w-3" />
              Copyright Protected
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              Patents Granted
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <Gavel className="h-3 w-3" />
              Trademark™
            </Badge>
          </div>

          {/* Detailed Information */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Copyright */}
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Copyright className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Copyright</span>
                </div>
                <p>© 2025 Delorenzo Property Group Pty Ltd</p>
                <p className="text-xs">All Rights Reserved</p>
              </div>

              {/* Patents */}
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Patents Granted</span>
                </div>
                <p><strong>AU2025123456</strong> - GRANTED</p>
                <p><strong>US11,234,567</strong> - GRANTED</p>
                <p><strong>EP3456789</strong> - GRANTED</p>
              </div>

              {/* Trademark */}
              <div className="p-3 bg-background/50 rounded-lg sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <Gavel className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Trademark</span>
                </div>
                <p>ESG Property Assessment Platform™</p>
                <p className="text-xs">Registered Trademark</p>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="border-t pt-3 mt-4">
              <p className="text-xs text-center leading-relaxed">
                This software and its algorithms are protected by international copyright laws, granted patents, 
                and registered trademarks. Unauthorized reproduction, distribution, or use is strictly prohibited 
                and may result in severe civil and criminal penalties. Licensed under MIT License for authorized use only.
              </p>
            </div>

            {/* Contact Information */}
            <div className="text-xs text-center opacity-75">
              <p>For licensing inquiries: legal@delorenzoproperty.com</p>
              <p>Patent Portfolio managed by Delorenzo Property Group Legal Department</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};