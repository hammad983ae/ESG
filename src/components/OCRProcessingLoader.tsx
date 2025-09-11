/**
 * Sustaino Pro - OCR Processing Loader
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Interactive full-page loader for OCR processing
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Eye, 
  Brain, 
  CheckCircle, 
  Loader2, 
  Sparkles,
  Zap,
  FileImage,
  Database,
  Cpu
} from 'lucide-react';

interface OCRProcessingLoaderProps {
  isVisible: boolean;
  progress: number;
  currentStep: string;
  totalPages?: number;
  processedPages?: number;
  extractedTextLength?: number;
}

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
}

export const OCRProcessingLoader: React.FC<OCRProcessingLoaderProps> = ({
  isVisible,
  progress,
  currentStep,
  totalPages = 0,
  processedPages = 0,
  extractedTextLength = 0
}) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'upload',
      name: 'Document Upload',
      description: 'Processing your document...',
      icon: FileImage,
      completed: false,
      active: false
    },
    {
      id: 'extract',
      name: 'Text Extraction',
      description: 'Extracting text from all pages...',
      icon: Eye,
      completed: false,
      active: false
    },
    {
      id: 'analyze',
      name: 'AI Analysis',
      description: 'AI is analyzing and structuring the data...',
      icon: Brain,
      completed: false,
      active: false
    },
    {
      id: 'format',
      name: 'Data Formatting',
      description: 'Formatting data for form population...',
      icon: Database,
      completed: false,
      active: false
    },
    {
      id: 'complete',
      name: 'Complete',
      description: 'Form populated successfully!',
      icon: CheckCircle,
      completed: false,
      active: false
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStepIndex(0);
      setSteps(prev => prev.map(step => ({ ...step, completed: false, active: false })));
      return;
    }

    // Update steps based on progress and current step
    let stepIndex = 0;
    
    if (progress >= 20) {
      stepIndex = 1; // Text extraction
    }
    if (progress >= 60) {
      stepIndex = 2; // AI analysis
    }
    if (progress >= 85) {
      stepIndex = 3; // Data formatting
    }
    if (progress >= 100) {
      stepIndex = 4; // Complete
    }

    setCurrentStepIndex(stepIndex);
    
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      completed: index < stepIndex,
      active: index === stepIndex
    })));
  }, [progress, isVisible]);

  if (!isVisible) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStepIcon = (step: ProcessingStep, index: number) => {
    const IconComponent = step.icon;
    
    if (step.completed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    if (step.active) {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    
    return <IconComponent className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Processing Your Document
            </h2>
            <p className="text-sm text-gray-600">
              Our AI is analyzing your lease document and extracting all relevant information
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-gray-900 text-sm">Current Step</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">{currentStep}</p>
          </div>

          {/* Processing Steps */}
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step.active 
                    ? 'bg-blue-50 border border-blue-200' 
                    : step.completed 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {getStepIcon(step, index)}
                <div className="flex-1">
                  <h3 className={`font-medium text-sm ${
                    step.active ? 'text-blue-900' : step.completed ? 'text-green-900' : 'text-gray-700'
                  }`}>
                    {step.name}
                  </h3>
                  <p className={`text-xs ${
                    step.active ? 'text-blue-700' : step.completed ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {step.active && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Statistics */}
          {(totalPages > 0 || extractedTextLength > 0) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {totalPages > 0 && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{processedPages}/{totalPages}</div>
                  <div className="text-xs text-gray-600">Pages Processed</div>
                </div>
              )}
              {extractedTextLength > 0 && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{extractedTextLength.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Characters Extracted</div>
                </div>
              )}
            </div>
          )}

          {/* AI Processing Animation */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-600">
              <Cpu className="h-3 w-3 animate-pulse" />
              <span>AI is working its magic...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
