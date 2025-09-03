/**
 * Client Presentation - Property & Agricultural Hub Platform
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 */

import { useState, useRef } from "react";
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
  Lock,
  Download,
  FileText,
  Printer
} from "lucide-react";

export const ClientPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const downloadSlideAsImage = async (slideIndex: number) => {
    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;
    
    // Create a professional presentation slide element
    const slideElement = document.createElement('div');
    slideElement.style.cssText = `
      width: 1920px;
      height: 1080px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      font-family: 'Arial', 'Helvetica', sans-serif;
      position: fixed;
      top: -10000px;
      left: 0;
      z-index: -1;
      padding: 80px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    `;

    const slide = slides[slideIndex];
    
    // Create professional slide content
    slideElement.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 60px; border-bottom: 3px solid #1e40af; padding-bottom: 40px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; font-weight: bold;">
              DPG
            </div>
          </div>
          <h1 style="font-size: 48px; font-weight: bold; color: #1e40af; margin: 0 0 15px 0; line-height: 1.2;">
            ${slide.title}
          </h1>
          <h2 style="font-size: 32px; color: #64748b; margin: 0; font-weight: 300;">
            ${slide.subtitle}
          </h2>
        </div>

        <!-- Content -->
        <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
          <div style="width: 100%; max-width: 1600px;">
            ${getProfessionalSlideContent(slide, slideIndex)}
          </div>
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: between; align-items: center; padding-top: 40px; border-top: 2px solid #e2e8f0; margin-top: 40px; font-size: 24px; color: #64748b;">
          <div style="flex: 1;">
            <strong>Delorenzo Property Group Pty Ltd</strong><br>
            ESG Property Assessment Platform™
          </div>
          <div style="text-align: right;">
            <strong>Slide ${slideIndex + 1} of ${slides.length}</strong><br>
            Patent Protected • ISO Compliant
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(slideElement);

    const canvas = await html2canvas(slideElement, {
      backgroundColor: '#ffffff',
      scale: 1,
      width: 1920,
      height: 1080,
      useCORS: true
    });

    document.body.removeChild(slideElement);

    const link = document.createElement('a');
    link.download = `DPG-Presentation-Slide-${slideIndex + 1}-${slide.id}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const getProfessionalSlideContent = (slide: any, slideIndex: number) => {
    switch (slideIndex) {
      case 0: // Welcome
        return `
          <div style="text-align: center;">
            <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 60px; box-shadow: 0 20px 40px rgba(30, 64, 175, 0.3);">
              <svg style="width: 100px; height: 100px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                <path d="M2 17L12 22L22 17"></path>
                <path d="M2 12L12 17L22 12"></path>
              </svg>
            </div>
            <h3 style="font-size: 56px; font-weight: bold; margin-bottom: 40px; color: #1e293b;">Welcome to the Future of Property Valuation</h3>
            <p style="font-size: 32px; color: #64748b; max-width: 1200px; margin: 0 auto 60px; line-height: 1.6;">
              Comprehensive ESG-integrated platform combining traditional valuation methods with cutting-edge environmental, social, and governance assessment tools.
            </p>
            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
              <span style="background: #dbeafe; color: #1e40af; padding: 15px 30px; border-radius: 25px; font-size: 24px; font-weight: 600;">Patent Protected</span>
              <span style="background: #f0fdf4; color: #166534; padding: 15px 30px; border-radius: 25px; font-size: 24px; font-weight: 600;">ISO Compliant</span>
              <span style="background: #fef3c7; color: #d97706; padding: 15px 30px; border-radius: 25px; font-size: 24px; font-weight: 600;">Industry Leading</span>
            </div>
          </div>
        `;
      
      case 1: // Platform Overview
        return `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px;">
            <div style="background: white; border: 3px solid #dbeafe; border-radius: 20px; padding: 60px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 40px;">
                <div style="width: 60px; height: 60px; background: #1e40af; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 30px; height: 30px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                  </svg>
                </div>
                <h3 style="font-size: 40px; font-weight: bold; color: #1e40af; margin: 0;">Property Hub</h3>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 22px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #1e40af; border-radius: 50%;"></div>
                  <span>Commercial Properties</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #1e40af; border-radius: 50%;"></div>
                  <span>Residential Assets</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #1e40af; border-radius: 50%;"></div>
                  <span>Industrial Facilities</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #1e40af; border-radius: 50%;"></div>
                  <span>Sports Stadiums</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #1e40af; border-radius: 50%;"></div>
                  <span>Fast Food Outlets</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #1e40af; border-radius: 50%;"></div>
                  <span>Healthcare Properties</span>
                </div>
              </div>
            </div>
            
            <div style="background: white; border: 3px solid #dcfce7; border-radius: 20px; padding: 60px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 40px;">
                <div style="width: 60px; height: 60px; background: #16a34a; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 30px; height: 30px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"></path>
                  </svg>
                </div>
                <h3 style="font-size: 40px; font-weight: bold; color: #16a34a; margin: 0;">Agricultural Hub</h3>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 22px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span>Crop Valuation</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span>Orchard Management</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span>Vineyard Assessment</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span>Pasture Evaluation</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span>Mixed Farm Analysis</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span>Management Diary</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 2: // Key Features
        return `
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px;">
            <div style="background: white; border-radius: 20px; padding: 50px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 3px solid #dbeafe;">
              <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                <svg style="width: 50px; height: 50px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 style="font-size: 32px; font-weight: bold; color: #1e40af; margin-bottom: 30px;">Advanced Calculations</h3>
              <ul style="text-align: left; font-size: 20px; color: #64748b; list-style: none; padding: 0;">
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 15px;">•</span> DCF Analysis
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 15px;">•</span> Capitalization Methods
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 15px;">•</span> Direct Comparison
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 15px;">•</span> Summation Approach
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 15px;">•</span> Rent Revision Tools
                </li>
              </ul>
            </div>

            <div style="background: white; border-radius: 20px; padding: 50px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 3px solid #dcfce7;">
              <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #16a34a, #22c55e); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                <svg style="width: 50px; height: 50px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"></path>
                </svg>
              </div>
              <h3 style="font-size: 32px; font-weight: bold; color: #16a34a; margin-bottom: 30px;">ESG Integration</h3>
              <ul style="text-align: left; font-size: 20px; color: #64748b; list-style: none; padding: 0;">
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 15px;">•</span> Environmental Impact
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 15px;">•</span> Social Responsibility
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 15px;">•</span> Governance Metrics
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 15px;">•</span> Sustainability Scoring
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 15px;">•</span> Climate Risk Assessment
                </li>
              </ul>
            </div>

            <div style="background: white; border-radius: 20px; padding: 50px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 3px solid #dbeafe;">
              <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                <svg style="width: 50px; height: 50px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style="font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 30px;">Security & Compliance</h3>
              <ul style="text-align: left; font-size: 20px; color: #64748b; list-style: none; padding: 0;">
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 15px;">•</span> Patent Protected
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 15px;">•</span> ISO 27001 Compliant
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 15px;">•</span> SOC 2 Type II
                </li>
                <li style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 15px;">•</span> Enterprise Grade Security
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 15px;">•</span> Data Encryption
                </li>
              </ul>
            </div>
          </div>
        `;

      case 5: // Benefits
        return `
          <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px;">
            <div style="display: grid; grid-template-rows: repeat(3, 1fr); gap: 40px;">
              <div style="text-align: center; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                  <svg style="width: 40px; height: 40px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"></path>
                  </svg>
                </div>
                <h3 style="font-size: 48px; font-weight: bold; color: #1e40af; margin: 0 0 10px 0;">95%</h3>
                <p style="color: #64748b; font-size: 20px; margin: 0;">Accuracy in Valuations</p>
              </div>
              
              <div style="text-align: center; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #16a34a, #22c55e); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                  <svg style="width: 40px; height: 40px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21M12.5 7C12.5 9.48528 10.4853 11.5 8 11.5C5.51472 11.5 3.5 9.48528 3.5 7C3.5 4.51472 5.51472 2.5 8 2.5C10.4853 2.5 12.5 4.51472 12.5 7ZM20.5 8L22 9.5L17 14.5L15 12.5"></path>
                  </svg>
                </div>
                <h3 style="font-size: 48px; font-weight: bold; color: #16a34a; margin: 0 0 10px 0;">500+</h3>
                <p style="color: #64748b; font-size: 20px; margin: 0;">Properties Assessed</p>
              </div>
              
              <div style="text-align: center; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                  <svg style="width: 40px; height: 40px; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12L18 8V11H3V13H18V16L22 12Z"></path>
                  </svg>
                </div>
                <h3 style="font-size: 48px; font-weight: bold; color: #2563eb; margin: 0 0 10px 0;">60%</h3>
                <p style="color: #64748b; font-size: 20px; margin: 0;">Time Savings</p>
              </div>
            </div>
            
            <div>
              <h3 style="font-size: 40px; font-weight: bold; margin-bottom: 40px; color: #1e293b;">Key Advantages</h3>
              <div style="display: flex; flex-direction: column; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 20px; padding: 25px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 15px; border: 2px solid #22c55e;">
                  <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></div>
                  <span style="font-size: 24px; font-weight: 600; color: #1e293b;">Comprehensive ESG Integration</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px; padding: 25px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 15px; border: 2px solid #3b82f6;">
                  <div style="width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></div>
                  <span style="font-size: 24px; font-weight: 600; color: #1e293b;">Automated Document Processing</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px; padding: 25px; background: linear-gradient(135deg, #faf5ff, #f3e8ff); border-radius: 15px; border: 2px solid #a855f7;">
                  <div style="width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></div>
                  <span style="font-size: 24px; font-weight: 600; color: #1e293b;">Real-time Market Data</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px; padding: 25px; background: linear-gradient(135deg, #fff7ed, #fed7aa); border-radius: 15px; border: 2px solid #f97316;">
                  <div style="width: 12px; height: 12px; background: #ea580c; border-radius: 50%;"></div>
                  <span style="font-size: 24px; font-weight: 600; color: #1e293b;">Industry-Leading Security</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px; padding: 25px; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border-radius: 15px; border: 2px solid #14b8a6;">
                  <div style="width: 12px; height: 12px; background: #0d9488; border-radius: 50%;"></div>
                  <span style="font-size: 24px; font-weight: 600; color: #1e293b;">Specialized Agricultural Tools</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 6: // Next Steps
        return `
          <div style="text-align: center;">
            <div style="max-width: 1000px; margin: 0 auto 80px;">
              <h3 style="font-size: 48px; font-weight: bold; margin-bottom: 40px; color: #1e293b;">Ready to Transform Your Property Assessments?</h3>
              <p style="font-size: 28px; color: #64748b; line-height: 1.6;">
                Join the leading property professionals who trust our platform for accurate, comprehensive, and ESG-integrated valuations.
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; max-width: 1400px; margin: 0 auto 80px;">
              <div style="background: white; padding: 60px 40px; text-align: center; border: 3px solid #dbeafe; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="font-size: 80px; margin-bottom: 30px;">📞</div>
                <h4 style="font-size: 32px; font-weight: bold; margin-bottom: 20px; color: #1e293b;">Schedule Demo</h4>
                <p style="font-size: 20px; color: #64748b;">Book a personalized platform demonstration</p>
              </div>
              
              <div style="background: white; padding: 60px 40px; text-align: center; border: 3px solid #dcfce7; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="font-size: 80px; margin-bottom: 30px;">🚀</div>
                <h4 style="font-size: 32px; font-weight: bold; margin-bottom: 20px; color: #1e293b;">Trial Access</h4>
                <p style="font-size: 20px; color: #64748b;">Start with a 30-day free trial</p>
              </div>
              
              <div style="background: white; padding: 60px 40px; text-align: center; border: 3px solid #dbeafe; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="font-size: 80px; margin-bottom: 30px;">🤝</div>
                <h4 style="font-size: 32px; font-weight: bold; margin-bottom: 20px; color: #1e293b;">Partnership</h4>
                <p style="font-size: 20px; color: #64748b;">Explore enterprise partnership opportunities</p>
              </div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 40px;">
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px 60px; border-radius: 15px; font-size: 28px; font-weight: 600; box-shadow: 0 10px 30px rgba(30, 64, 175, 0.3);">
                Schedule Demo
              </div>
              <div style="background: white; color: #1e40af; border: 3px solid #1e40af; padding: 20px 60px; border-radius: 15px; font-size: 28px; font-weight: 600;">
                Contact Sales
              </div>
            </div>
          </div>
        `;

      default:
        return `
          <div style="text-align: center; padding: 100px; font-size: 24px; color: #64748b;">
            Professional slide content for ${slide.title}
          </div>
        `;
    }
  };

  const downloadAllSlides = async () => {
    const originalSlide = currentSlide;
    
    for (let i = 0; i < slides.length; i++) {
      setCurrentSlide(i);
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500));
      await downloadSlideAsImage(i);
    }
    
    setCurrentSlide(originalSlide);
  };

  const downloadPresentationPDF = () => {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = slides.map((slide, index) => `
      <div style="page-break-after: ${index === slides.length - 1 ? 'auto' : 'always'}; width: 210mm; height: 297mm; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); font-family: 'Arial', 'Helvetica', sans-serif; padding: 20mm; box-sizing: border-box; display: flex; flex-direction: column; position: relative;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 15mm; border-bottom: 2px solid #1e40af; padding-bottom: 10mm;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 5mm; margin-bottom: 5mm;">
            <div style="width: 20mm; height: 20mm; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12pt; font-weight: bold;">
              DPG
            </div>
          </div>
          <h1 style="font-size: 24pt; font-weight: bold; color: #1e40af; margin: 0 0 3mm 0; line-height: 1.2;">
            ${slide.title}
          </h1>
          <h2 style="font-size: 16pt; color: #64748b; margin: 0; font-weight: 300;">
            ${slide.subtitle}
          </h2>
        </div>

        <!-- Content -->
        <div style="flex: 1; display: flex; align-items: flex-start; justify-content: center; max-height: 180mm; overflow: hidden;">
          <div style="width: 100%; max-width: 170mm;">
            ${getProfessionalPrintContent(slide, index)}
          </div>
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 5mm; border-top: 1px solid #e2e8f0; margin-top: 5mm; font-size: 9pt; color: #64748b; position: absolute; bottom: 20mm; left: 20mm; right: 20mm;">
          <div>
            <strong>Delorenzo Property Group Pty Ltd</strong><br>
            ESG Property Assessment Platform™
          </div>
          <div style="text-align: right;">
            <strong>Slide ${index + 1} of ${slides.length}</strong><br>
            Patent Protected • ISO Compliant
          </div>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delorenzo Property Group - Client Presentation</title>
          <meta charset="UTF-8">
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body { 
              margin: 0; 
              font-family: 'Arial', 'Helvetica', sans-serif;
              background: white;
              font-size: 12pt;
              line-height: 1.4;
            }
            @media screen {
              body {
                background: #f5f5f5;
                padding: 20px;
              }
            }
            @media print {
              @page { 
                margin: 0; 
                size: A4 portrait;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              body {
                margin: 0;
                padding: 0;
                background: white !important;
              }
              .no-print { 
                display: none !important; 
              }
              * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
                color-adjust: exact !important;
              }
            }
            @media screen and (max-width: 768px) {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 1000; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
            <button onclick="window.print()" style="background: #1e40af; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px;">Print PDF</button>
            <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Close</button>
          </div>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      // Auto-print after a short delay to ensure content is loaded
      if (confirm('Ready to print/save as PDF? Click OK to open print dialog or Cancel to review first.')) {
        printWindow.print();
      }
    }, 1000);
  };

  const getProfessionalPrintContent = (slide: any, slideIndex: number) => {
    switch (slideIndex) {
      case 0: // Welcome
        return `
          <div style="text-align: center;">
            <div style="width: 40mm; height: 40mm; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15mm; box-shadow: 0 5mm 10mm rgba(30, 64, 175, 0.3);">
              <svg style="width: 20mm; height: 20mm; color: white;" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                <path d="M2 17L12 22L22 17"></path>
                <path d="M2 12L12 17L22 12"></path>
              </svg>
            </div>
            <h3 style="font-size: 18pt; font-weight: bold; margin-bottom: 8mm; color: #1e293b;">Welcome to the Future of Property Valuation</h3>
            <p style="font-size: 12pt; color: #64748b; max-width: 120mm; margin: 0 auto 15mm; line-height: 1.5;">
              Comprehensive ESG-integrated platform combining traditional valuation methods with cutting-edge environmental, social, and governance assessment tools.
            </p>
            <div style="display: flex; justify-content: center; gap: 8mm; flex-wrap: wrap;">
              <span style="background: #dbeafe; color: #1e40af; padding: 3mm 6mm; border-radius: 6mm; font-size: 10pt; font-weight: 600;">Patent Protected</span>
              <span style="background: #f0fdf4; color: #166534; padding: 3mm 6mm; border-radius: 6mm; font-size: 10pt; font-weight: 600;">ISO Compliant</span>
              <span style="background: #fef3c7; color: #d97706; padding: 3mm 6mm; border-radius: 6mm; font-size: 10pt; font-weight: 600;">Industry Leading</span>
            </div>
          </div>
        `;
      
      case 1: // Platform Overview
        return `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15mm;">
            <div style="background: white; border: 2px solid #dbeafe; border-radius: 5mm; padding: 12mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; gap: 5mm; margin-bottom: 8mm;">
                <div style="width: 12mm; height: 12mm; background: #1e40af; border-radius: 3mm; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 6mm; height: 6mm; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                  </svg>
                </div>
                <h3 style="font-size: 14pt; font-weight: bold; color: #1e40af; margin: 0;">Property Hub</h3>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; font-size: 9pt;">
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #1e40af; border-radius: 50%;"></div>
                  <span>Commercial Properties</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #1e40af; border-radius: 50%;"></div>
                  <span>Residential Assets</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #1e40af; border-radius: 50%;"></div>
                  <span>Industrial Facilities</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #1e40af; border-radius: 50%;"></div>
                  <span>Sports Stadiums</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #1e40af; border-radius: 50%;"></div>
                  <span>Fast Food Outlets</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #1e40af; border-radius: 50%;"></div>
                  <span>Healthcare Properties</span>
                </div>
              </div>
            </div>
            
            <div style="background: white; border: 2px solid #dcfce7; border-radius: 5mm; padding: 12mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; gap: 5mm; margin-bottom: 8mm;">
                <div style="width: 12mm; height: 12mm; background: #16a34a; border-radius: 3mm; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 6mm; height: 6mm; color: white;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"></path>
                  </svg>
                </div>
                <h3 style="font-size: 14pt; font-weight: bold; color: #16a34a; margin: 0;">Agricultural Hub</h3>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; font-size: 9pt;">
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span>Crop Valuation</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span>Orchard Management</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span>Vineyard Assessment</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span>Pasture Evaluation</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span>Mixed Farm Analysis</span>
                </div>
                <div style="display: flex; align-items: center; gap: 3mm;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span>Management Diary</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 2: // Key Features
        return `
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12mm;">
            <div style="background: white; border-radius: 5mm; padding: 10mm; text-align: center; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1); border: 2px solid #dbeafe;">
              <div style="width: 20mm; height: 20mm; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 6mm;">
                <svg style="width: 10mm; height: 10mm; color: white;" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 style="font-size: 12pt; font-weight: bold; color: #1e40af; margin-bottom: 6mm;">Advanced Calculations</h3>
              <ul style="text-align: left; font-size: 9pt; color: #64748b; list-style: none; padding: 0;">
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 3mm;">•</span> DCF Analysis
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 3mm;">•</span> Capitalization Methods
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 3mm;">•</span> Direct Comparison
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 3mm;">•</span> Summation Approach
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: #1e40af; margin-right: 3mm;">•</span> Rent Revision Tools
                </li>
              </ul>
            </div>

            <div style="background: white; border-radius: 5mm; padding: 10mm; text-align: center; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1); border: 2px solid #dcfce7;">
              <div style="width: 20mm; height: 20mm; background: linear-gradient(135deg, #16a34a, #22c55e); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 6mm;">
                <svg style="width: 10mm; height: 10mm; color: white;" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"></path>
                </svg>
              </div>
              <h3 style="font-size: 12pt; font-weight: bold; color: #16a34a; margin-bottom: 6mm;">ESG Integration</h3>
              <ul style="text-align: left; font-size: 9pt; color: #64748b; list-style: none; padding: 0;">
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 3mm;">•</span> Environmental Impact
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 3mm;">•</span> Social Responsibility
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 3mm;">•</span> Governance Metrics
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 3mm;">•</span> Sustainability Scoring
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: #16a34a; margin-right: 3mm;">•</span> Climate Risk Assessment
                </li>
              </ul>
            </div>

            <div style="background: white; border-radius: 5mm; padding: 10mm; text-align: center; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1); border: 2px solid #dbeafe;">
              <div style="width: 20mm; height: 20mm; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 6mm;">
                <svg style="width: 10mm; height: 10mm; color: white;" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style="font-size: 12pt; font-weight: bold; color: #2563eb; margin-bottom: 6mm;">Security & Compliance</h3>
              <ul style="text-align: left; font-size: 9pt; color: #64748b; list-style: none; padding: 0;">
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 3mm;">•</span> Patent Protected
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 3mm;">•</span> ISO 27001 Compliant
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 3mm;">•</span> SOC 2 Type II
                </li>
                <li style="margin-bottom: 2mm; display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 3mm;">•</span> Enterprise Grade Security
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: #2563eb; margin-right: 3mm;">•</span> Data Encryption
                </li>
              </ul>
            </div>
          </div>
        `;

      case 3: // Agricultural Focus
        return `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12mm;">
            <div>
              <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 6mm; color: #16a34a; display: flex; align-items: center; gap: 3mm;">
                📊 Valuation Methods
              </h3>
              <div style="display: flex; flex-direction: column; gap: 4mm;">
                <div style="padding: 4mm; background: #f8fafc; border-radius: 3mm; border-left: 3px solid #16a34a;">
                  <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Crop Yield Analysis</div>
                  <div style="font-size: 8pt; color: #64748b;">Per acre/hectare productivity assessment</div>
                </div>
                <div style="padding: 4mm; background: #f8fafc; border-radius: 3mm; border-left: 3px solid #16a34a;">
                  <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Commodity Market Integration</div>
                  <div style="font-size: 8pt; color: #64748b;">Real-time pricing and forecast analysis</div>
                </div>
                <div style="padding: 4mm; background: #f8fafc; border-radius: 3mm; border-left: 3px solid #16a34a;">
                  <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Infrastructure Assessment</div>
                  <div style="font-size: 8pt; color: #64748b;">Irrigation, storage, and processing facilities</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 6mm; color: #16a34a; display: flex; align-items: center; gap: 3mm;">
                🎯 Management Tools
              </h3>
              <div style="display: flex; flex-direction: column; gap: 4mm;">
                <div style="padding: 4mm; background: #f8fafc; border-radius: 3mm; border-left: 3px solid #16a34a;">
                  <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Spray Program Tracking</div>
                  <div style="font-size: 8pt; color: #64748b;">Chemical applications and schedules</div>
                </div>
                <div style="padding: 4mm; background: #f8fafc; border-radius: 3mm; border-left: 3px solid #16a34a;">
                  <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Labor Cost Calculator</div>
                  <div style="font-size: 8pt; color: #64748b;">Workforce planning and wage analysis</div>
                </div>
                <div style="padding: 4mm; background: #f8fafc; border-radius: 3mm; border-left: 3px solid #16a34a;">
                  <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Expense Management</div>
                  <div style="font-size: 8pt; color: #64748b;">Operational cost tracking and optimization</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 4: // Technology & Innovation
        return `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12mm;">
            <div>
              <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 6mm; color: #1e40af;">⚡ Platform Capabilities</h3>
              <div style="display: flex; flex-direction: column; gap: 5mm;">
                <div style="display: flex; align-items: start; gap: 4mm;">
                  <div style="width: 8mm; height: 8mm; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 8pt;">🌐</div>
                  <div>
                    <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">OCR Document Processing</div>
                    <div style="font-size: 8pt; color: #64748b;">Automated data extraction from property documents</div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: start; gap: 4mm;">
                  <div style="width: 8mm; height: 8mm; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 8pt;">📍</div>
                  <div>
                    <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Geographic Integration</div>
                    <div style="font-size: 8pt; color: #64748b;">Location-based analysis and comparable sales</div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: start; gap: 4mm;">
                  <div style="width: 8mm; height: 8mm; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 8pt;">📈</div>
                  <div>
                    <div style="font-weight: 600; font-size: 10pt; margin-bottom: 1mm;">Market Analytics</div>
                    <div style="font-size: 8pt; color: #64748b;">Real-time market data and trend analysis</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 6mm; color: #2563eb;">🔒 Security Features</h3>
              <div style="display: flex; flex-direction: column; gap: 4mm;">
                <div style="padding: 5mm; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 3mm; border: 1px solid #3b82f6;">
                  <div style="font-weight: 600; color: #1e40af; font-size: 10pt; margin-bottom: 1mm;">Enterprise Security</div>
                  <div style="font-size: 8pt; color: #1e40af;">End-to-end encryption, secure authentication, audit trails</div>
                </div>
                
                <div style="padding: 5mm; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 3mm; border: 1px solid #22c55e;">
                  <div style="font-weight: 600; color: #15803d; font-size: 10pt; margin-bottom: 1mm;">Data Protection</div>
                  <div style="font-size: 8pt; color: #15803d;">GDPR compliant, secure cloud infrastructure, backup systems</div>
                </div>
                
                <div style="padding: 5mm; background: linear-gradient(135deg, #fff7ed, #fed7aa); border-radius: 3mm; border: 1px solid #f97316;">
                  <div style="font-weight: 600; color: #ea580c; font-size: 10pt; margin-bottom: 1mm;">Compliance Standards</div>
                  <div style="font-size: 8pt; color: #ea580c;">ISO 27001, SOC 2 Type II, industry best practices</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 5: // Benefits
        return `
          <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 12mm;">
            <div style="display: grid; grid-template-rows: repeat(3, 1fr); gap: 6mm;">
              <div style="text-align: center; background: white; border-radius: 4mm; padding: 6mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
                <div style="font-size: 20pt; margin-bottom: 3mm;">🏆</div>
                <h3 style="font-size: 16pt; font-weight: bold; color: #1e40af; margin: 0 0 2mm 0;">95%</h3>
                <p style="color: #64748b; font-size: 8pt; margin: 0;">Accuracy in Valuations</p>
              </div>
              
              <div style="text-align: center; background: white; border-radius: 4mm; padding: 6mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
                <div style="font-size: 20pt; margin-bottom: 3mm;">👥</div>
                <h3 style="font-size: 16pt; font-weight: bold; color: #16a34a; margin: 0 0 2mm 0;">500+</h3>
                <p style="color: #64748b; font-size: 8pt; margin: 0;">Properties Assessed</p>
              </div>
              
              <div style="text-align: center; background: white; border-radius: 4mm; padding: 6mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
                <div style="font-size: 20pt; margin-bottom: 3mm;">📈</div>
                <h3 style="font-size: 16pt; font-weight: bold; color: #2563eb; margin: 0 0 2mm 0;">60%</h3>
                <p style="color: #64748b; font-size: 8pt; margin: 0;">Time Savings</p>
              </div>
            </div>
            
            <div>
              <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 6mm; color: #1e293b;">Key Advantages</h3>
              <div style="display: flex; flex-direction: column; gap: 3mm;">
                <div style="display: flex; align-items: center; gap: 3mm; padding: 4mm; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 3mm; border: 1px solid #22c55e;">
                  <div style="width: 2mm; height: 2mm; background: #16a34a; border-radius: 50%;"></div>
                  <span style="font-size: 9pt; font-weight: 600; color: #1e293b;">Comprehensive ESG Integration</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 3mm; padding: 4mm; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 3mm; border: 1px solid #3b82f6;">
                  <div style="width: 2mm; height: 2mm; background: #2563eb; border-radius: 50%;"></div>
                  <span style="font-size: 9pt; font-weight: 600; color: #1e293b;">Automated Document Processing</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 3mm; padding: 4mm; background: linear-gradient(135deg, #faf5ff, #f3e8ff); border-radius: 3mm; border: 1px solid #a855f7;">
                  <div style="width: 2mm; height: 2mm; background: #9333ea; border-radius: 50%;"></div>
                  <span style="font-size: 9pt; font-weight: 600; color: #1e293b;">Real-time Market Data</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 3mm; padding: 4mm; background: linear-gradient(135deg, #fff7ed, #fed7aa); border-radius: 3mm; border: 1px solid #f97316;">
                  <div style="width: 2mm; height: 2mm; background: #ea580c; border-radius: 50%;"></div>
                  <span style="font-size: 9pt; font-weight: 600; color: #1e293b;">Industry-Leading Security</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 3mm; padding: 4mm; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border-radius: 3mm; border: 1px solid #14b8a6;">
                  <div style="width: 2mm; height: 2mm; background: #0d9488; border-radius: 50%;"></div>
                  <span style="font-size: 9pt; font-weight: 600; color: #1e293b;">Specialized Agricultural Tools</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 6: // Next Steps
        return `
          <div style="text-align: center;">
            <div style="margin-bottom: 12mm;">
              <h3 style="font-size: 16pt; font-weight: bold; margin-bottom: 6mm; color: #1e293b;">Ready to Transform Your Property Assessments?</h3>
              <p style="font-size: 10pt; color: #64748b; line-height: 1.5; max-width: 120mm; margin: 0 auto;">
                Join the leading property professionals who trust our platform for accurate, comprehensive, and ESG-integrated valuations.
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8mm; margin-bottom: 12mm;">
              <div style="background: white; padding: 8mm 6mm; text-align: center; border: 1px solid #dbeafe; border-radius: 4mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
                <div style="font-size: 24pt; margin-bottom: 4mm;">📞</div>
                <h4 style="font-size: 11pt; font-weight: bold; margin-bottom: 3mm; color: #1e293b;">Schedule Demo</h4>
                <p style="font-size: 8pt; color: #64748b;">Book a personalized platform demonstration</p>
              </div>
              
              <div style="background: white; padding: 8mm 6mm; text-align: center; border: 1px solid #dcfce7; border-radius: 4mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
                <div style="font-size: 24pt; margin-bottom: 4mm;">🚀</div>
                <h4 style="font-size: 11pt; font-weight: bold; margin-bottom: 3mm; color: #1e293b;">Trial Access</h4>
                <p style="font-size: 8pt; color: #64748b;">Start with a 30-day free trial</p>
              </div>
              
              <div style="background: white; padding: 8mm 6mm; text-align: center; border: 1px solid #dbeafe; border-radius: 4mm; box-shadow: 0 2mm 6mm rgba(0,0,0,0.1);">
                <div style="font-size: 24pt; margin-bottom: 4mm;">🤝</div>
                <h4 style="font-size: 11pt; font-weight: bold; margin-bottom: 3mm; color: #1e293b;">Partnership</h4>
                <p style="font-size: 8pt; color: #64748b;">Explore enterprise partnership opportunities</p>
              </div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 6mm;">
              <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 3mm 8mm; border-radius: 3mm; font-size: 10pt; font-weight: 600; box-shadow: 0 2mm 6mm rgba(30, 64, 175, 0.3);">
                Schedule Demo
              </div>
              <div style="background: white; color: #1e40af; border: 1px solid #1e40af; padding: 3mm 8mm; border-radius: 3mm; font-size: 10pt; font-weight: 600;">
                Contact Sales
              </div>
            </div>
          </div>
        `;

      default:
        return `
          <div style="text-align: center; padding: 20mm; font-size: 10pt; color: #64748b;">
            Professional content for ${slide.title}
          </div>
        `;
    }
  };

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
        <Card ref={slideRef} className="mb-8 shadow-2xl min-h-[600px]">
          <CardContent className="p-8">
            {currentSlideData.content}
          </CardContent>
        </Card>

        {/* Export Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button 
            onClick={() => downloadSlideAsImage(currentSlide)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Current Slide
          </Button>
          <Button 
            onClick={downloadAllSlides}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Download All Slides
          </Button>
          <Button 
            onClick={downloadPresentationPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print/Save as PDF
          </Button>
        </div>

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