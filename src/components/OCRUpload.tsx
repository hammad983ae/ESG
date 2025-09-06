import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft, FileImage, File, Eye, Merge } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OCRUploadProps {
  formType: string;
  onDataExtracted: (data: Record<string, unknown>) => void;
  className?: string;
}

interface PageData {
  pageNumber: number;
  extractedText: string;
  parsedData: unknown;
  error?: string;
}

interface MultiPageResponse {
  pages: PageData[];
  isMultiPage: true;
  success: boolean;
}

interface SinglePageResponse {
  extractedText: string;
  parsedData: unknown;
  success: boolean;
}

export const OCRUpload = ({ formType, onDataExtracted, className = '' }: OCRUploadProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Multi-page state management
  const [multiPageResults, setMultiPageResults] = useState<MultiPageResponse | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please select an image or PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('idle');
    setProcessingProgress(0);
    setMultiPageResults(null);
    setShowPageSelector(false);
    setSelectedPages([]);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/...;base64, prefix
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      console.log(`Processing ${file.name} for form type: ${formType}`);

      // Prepare request body based on file type
      const requestBody = file.type === 'application/pdf' 
        ? {
            fileBase64: base64,
            fileType: 'application/pdf',
            formType: formType
          }
        : {
            imageBase64: base64,
            formType: formType
          };

      console.log('Request body prepared:', { 
        fileType: requestBody.fileType || 'image', 
        formType: requestBody.formType,
        hasBase64: !!(requestBody.fileBase64 || requestBody.imageBase64),
        base64Length: (requestBody.fileBase64 || requestBody.imageBase64 || '').length
      });

      // Validate base64 data
      const base64Data = requestBody.fileBase64 || requestBody.imageBase64;
      if (!base64Data || base64Data.length === 0) {
        throw new Error('Failed to encode file data. Please try again.');
      }

      // Call OCR extraction edge function
      const { data, error } = await supabase.functions.invoke('ocr-extract', {
        body: requestBody
      });

      if (error) {
        console.error('Supabase function error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText
        });
        
        // Provide more specific error messages based on status code
        let errorMessage = 'Failed to process document';
        if (error.status === 400) {
          errorMessage = 'Invalid file format or missing required data. Please check your file and try again.';
        } else if (error.status === 413) {
          errorMessage = 'File too large. Please use a file smaller than 10MB.';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred while processing your document. Please try again.';
        }
        
        throw new Error(errorMessage);
      }

      if (!data.success) {
        throw new Error(data.error || 'OCR processing failed');
      }

      // Detect response format and handle accordingly
      if (data.isMultiPage && data.pages) {
        // Multi-page response
        console.log('Multi-page OCR extraction successful:', data.pages);
        
        // Handle edge case: multi-page response with zero pages
        if (data.pages.length === 0) {
          setUploadStatus('error');
          setShowPageSelector(false);
          toast.error('No pages extracted from PDF.');
          return;
        }
        
        setMultiPageResults(data as MultiPageResponse);
        setSelectedPages(data.pages.map((page: PageData) => page.pageNumber));
        setShowPageSelector(true);
        setProcessingProgress(100);
        toast.success(`PDF processed successfully! ${data.pages.length} pages extracted.`);
      } else {
        // Single page response (backward compatibility)
        console.log('Single page OCR extraction successful:', data.parsedData);
        onDataExtracted((data.parsedData as Record<string, unknown>) || {});
        setUploadStatus('success');
        toast.success('Document processed successfully! Form fields have been pre-populated.');
      }

    } catch (error) {
      console.error('OCR processing error:', error);
      setUploadStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to process document');
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Data merging logic for multi-page documents
  // Handles different data types with predictable reconciliation:
  // - Numeric fields: choose last-wins (most recent value)
  // - String fields: concatenate with " | " separator if different
  // - Arrays: union unique values
  // - Objects: merge recursively
  const mergePageData = (pages: PageData[]): Record<string, unknown> => {
    if (pages.length === 1) {
      return (pages[0].parsedData as Record<string, unknown>) || {};
    }

    const mergedData: Record<string, unknown> = {};
    
    pages.forEach(page => {
      if (page.parsedData && typeof page.parsedData === 'object') {
        Object.entries(page.parsedData as Record<string, unknown>).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            // If key doesn't exist or current value is empty, use new value
            if (!mergedData[key] || mergedData[key] === '' || mergedData[key] === null) {
              mergedData[key] = value;
            }
            // Handle different data types
            else if (typeof mergedData[key] === 'number' && typeof value === 'number') {
              // Numeric fields: last-wins (most recent value)
              mergedData[key] = value;
            }
            else if (typeof mergedData[key] === 'string' && typeof value === 'string' && mergedData[key] !== value) {
              // String fields: concatenate with separator if different
              mergedData[key] = `${mergedData[key]} | ${value}`;
            }
            else if (Array.isArray(mergedData[key]) && Array.isArray(value)) {
              // Arrays: union unique values
              const existingArray = mergedData[key] as unknown[];
              const newArray = value as unknown[];
              const uniqueValues = [...new Set([...existingArray, ...newArray])];
              mergedData[key] = uniqueValues;
            }
            else if (typeof mergedData[key] === 'object' && typeof value === 'object' && 
                     !Array.isArray(mergedData[key]) && !Array.isArray(value)) {
              // Objects: merge recursively (shallow merge for simplicity)
              mergedData[key] = { ...mergedData[key] as Record<string, unknown>, ...value as Record<string, unknown> };
            }
            else {
              // Fallback: last-wins for any other type conflicts
              mergedData[key] = value;
            }
          }
        });
      }
    });

    return mergedData;
  };

  const selectSinglePage = (pageNumber: number): Record<string, unknown> => {
    const page = multiPageResults?.pages.find(p => p.pageNumber === pageNumber);
    return (page?.parsedData as Record<string, unknown>) || {};
  };

  const handlePageSelection = (pageNumber: number, checked: boolean) => {
    if (checked) {
      setSelectedPages(prev => [...prev, pageNumber]);
    } else {
      setSelectedPages(prev => prev.filter(p => p !== pageNumber));
    }
  };

  const handleSelectAllPages = () => {
    if (multiPageResults) {
      // Only select pages without errors
      const successfulPages = multiPageResults.pages
        .filter(p => !p.error)
        .map(p => p.pageNumber);
      setSelectedPages(successfulPages);
    }
  };

  const handleUseSelectedPages = () => {
    if (!multiPageResults || selectedPages.length === 0) return;

    // Filter out any pages with errors (safety measure)
    const selectedPageData = multiPageResults.pages.filter(p => 
      selectedPages.includes(p.pageNumber) && !p.error
    );
    
    if (selectedPageData.length === 0) {
      toast.error('No successful pages selected for processing.');
      return;
    }
    
    const mergedData = mergePageData(selectedPageData);
    
    onDataExtracted(mergedData);
    setUploadStatus('success');
    setShowPageSelector(false);
    toast.success(`Form populated with data from ${selectedPageData.length} selected page(s).`);
  };

  const handleUseSinglePage = (pageNumber: number) => {
    const page = multiPageResults?.pages.find(p => p.pageNumber === pageNumber);
    if (page?.error) {
      toast.error(`Cannot use page ${pageNumber}: ${page.error}`);
      return;
    }
    
    const singlePageData = selectSinglePage(pageNumber);
    onDataExtracted(singlePageData);
    setUploadStatus('success');
    setShowPageSelector(false);
    toast.success(`Form populated with data from page ${pageNumber}.`);
  };

  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (uploadStatus === 'success') return <CheckCircle className="h-5 w-5 text-success" />;
    if (uploadStatus === 'error') return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <FileText className="h-5 w-5" />;
  };

  const getStatusText = () => {
    if (isProcessing) {
      return 'Processing document...';
    }
    if (showPageSelector) return 'Select pages to use for form population';
    if (uploadStatus === 'success') return 'Document processed successfully';
    if (uploadStatus === 'error') return 'Processing failed';
    return 'Upload document to auto-fill form';
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <Card className={`border-dashed border-2 hover:border-primary/50 transition-colors ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            OCR Document Upload
          </CardTitle>
          <CardDescription>
            Upload a property document, lease agreement, or valuation report (images or PDFs) to automatically populate form fields using AI-powered text extraction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getStatusIcon()}
              {getStatusText()}
            </div>
            
            <Button 
              onClick={handleUploadClick}
              disabled={isProcessing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Choose Document
                </>
              )}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-xs text-muted-foreground text-center">
              Supports: JPG, PNG, PDF, HEIC • Max size: 10MB<br />
              Compatible with: Lease agreements, valuation reports, property documents
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-page page selection UI */}
      {showPageSelector && multiPageResults && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Select Pages to Use
            </CardTitle>
            <CardDescription>
              Choose which pages to use for form population. You can select multiple pages to merge data or use a single page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllPages}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPages([])}
                className="flex items-center gap-2"
              >
                Clear Selection
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  handleSelectAllPages();
                  setTimeout(() => handleUseSelectedPages(), 0);
                }}
                className="flex items-center gap-2"
              >
                <Merge className="h-4 w-4" />
                Use All Pages
              </Button>
              {selectedPages.length > 0 && (
                <Button
                  onClick={handleUseSelectedPages}
                  className="flex items-center gap-2"
                >
                  <Merge className="h-4 w-4" />
                  Use Selected ({selectedPages.length})
                </Button>
              )}
            </div>

            {/* Page selection cards */}
            <div className="grid gap-3">
              {multiPageResults.pages.map((page) => {
                const hasError = !!page.error;
                const isSelected = selectedPages.includes(page.pageNumber);
                
                return (
                  <Card key={page.pageNumber} className={`transition-colors ${
                    hasError 
                      ? 'border-destructive bg-destructive/5' 
                      : isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            !hasError && handlePageSelection(page.pageNumber, checked as boolean)
                          }
                          disabled={hasError}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <FileImage className="h-4 w-4" />
                              Page {page.pageNumber}
                              {hasError && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Error
                                </span>
                              )}
                            </h4>
                            {!hasError && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUseSinglePage(page.pageNumber)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                Use Only
                              </Button>
                            )}
                          </div>
                          
                          {/* Error message or data preview */}
                          {hasError ? (
                            <div className="text-sm text-destructive">
                              <div className="font-medium">Processing failed:</div>
                              <div className="text-xs mt-1">{page.error}</div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              {page.parsedData && typeof page.parsedData === 'object' ? (
                                <div className="space-y-1">
                                  {Object.entries(page.parsedData as Record<string, unknown>)
                                    .slice(0, 3)
                                    .map(([key, value]) => (
                                      <div key={key} className="truncate">
                                        <span className="font-medium">{key}:</span> {String(value)}
                                      </div>
                                    ))}
                                  {Object.keys(page.parsedData as Record<string, unknown>).length > 3 && (
                                    <div className="text-xs">
                                      +{Object.keys(page.parsedData as Record<string, unknown>).length - 3} more fields
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xs">No structured data found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
};