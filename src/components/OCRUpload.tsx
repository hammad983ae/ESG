import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OCRUploadProps {
  formType: string;
  onDataExtracted: (data: any) => void;
  className?: string;
}

export const OCRUpload = ({ formType, onDataExtracted, className = '' }: OCRUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('idle');

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

      // Call OCR extraction edge function
      const { data, error } = await supabase.functions.invoke('ocr-extract', {
        body: {
          imageBase64: base64,
          formType: formType
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to process image');
      }

      if (!data.success) {
        throw new Error(data.error || 'OCR processing failed');
      }

      console.log('OCR extraction successful:', data.parsedData);

      // Call the callback with extracted data
      onDataExtracted(data.parsedData);
      setUploadStatus('success');
      
      toast.success('Document processed successfully! Form fields have been pre-populated.');

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

  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (uploadStatus === 'success') return <CheckCircle className="h-5 w-5 text-success" />;
    if (uploadStatus === 'error') return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <FileImage className="h-5 w-5" />;
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing document...';
    if (uploadStatus === 'success') return 'Document processed successfully';
    if (uploadStatus === 'error') return 'Processing failed';
    return 'Upload document to auto-fill form';
  };

  return (
    <Card className={`border-dashed border-2 hover:border-primary/50 transition-colors ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          OCR Document Upload
        </CardTitle>
        <CardDescription>
          Upload a property document, lease agreement, or valuation report to automatically populate form fields using AI-powered text extraction.
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
            accept="image/*"
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
  );
};