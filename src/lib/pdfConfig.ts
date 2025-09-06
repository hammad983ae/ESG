import * as pdfjsLib from 'pdfjs-dist';
import { version } from 'pdfjs-dist/package.json';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

// PDF processing configuration
export const pdfConfig = {
  workerSrc: pdfjsLib.GlobalWorkerOptions.workerSrc,
  standardFontsPath: '/pdfjs-dist/standard_fonts/',
  version: version,
  defaultRenderOptions: {
    scale: 1.5,
    canvasContext: null as CanvasRenderingContext2D | null,
    viewport: null as pdfjsLib.PageViewport | null,
    intent: 'display' as pdfjsLib.RenderIntent,
    enableWebGL: false,
    renderInteractiveForms: false,
  },
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
  }
};

// TypeScript interfaces for PDF processing
export interface PDFProcessingOptions {
  scale?: number;
  maxPages?: number;
  quality?: number;
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
}

export interface PDFPageRenderOptions {
  scale?: number;
  viewport?: pdfjsLib.PageViewport;
  intent?: pdfjsLib.RenderIntent;
  enableWebGL?: boolean;
  renderInteractiveForms?: boolean;
}

export interface PDFDocumentInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
}

export interface PDFPageImage {
  pageNumber: number;
  imageData: string; // base64 data URL
  width: number;
  height: number;
}

// Utility functions for PDF processing
export class PDFProcessor {
  /**
   * Load a PDF document from various sources
   */
  static async loadDocument(source: File | ArrayBuffer | string): Promise<pdfjsLib.PDFDocumentProxy> {
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask;
    
    if (source instanceof File) {
      const arrayBuffer = await source.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    } else if (source instanceof ArrayBuffer) {
      loadingTask = pdfjsLib.getDocument({ data: source });
    } else {
      loadingTask = pdfjsLib.getDocument({ url: source });
    }

    return await loadingTask.promise;
  }

  /**
   * Convert a PDF page to canvas/image data
   */
  static async renderPageToCanvas(
    page: pdfjsLib.PDFPageProxy,
    options: PDFPageRenderOptions = {}
  ): Promise<HTMLCanvasElement> {
    const {
      scale = pdfConfig.defaultRenderOptions.scale,
      viewport = page.getViewport({ scale }),
      intent = pdfConfig.defaultRenderOptions.intent,
      enableWebGL = pdfConfig.defaultRenderOptions.enableWebGL,
      renderInteractiveForms = pdfConfig.defaultRenderOptions.renderInteractiveForms,
    } = options;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas 2D context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext: pdfjsLib.RenderParameters = {
      canvasContext: context,
      viewport: viewport,
      intent,
      enableWebGL,
      renderInteractiveForms,
    };

    await page.render(renderContext).promise;
    return canvas;
  }

  /**
   * Convert a PDF page to base64 image data
   */
  static async renderPageToImage(
    page: pdfjsLib.PDFPageProxy,
    options: PDFProcessingOptions = {}
  ): Promise<PDFPageImage> {
    const {
      scale = pdfConfig.defaultRenderOptions.scale,
      format = 'image/png',
      quality = 0.92,
    } = options;

    const canvas = await this.renderPageToCanvas(page, { scale });
    const imageData = canvas.toDataURL(format, quality);
    
    return {
      pageNumber: page.pageNumber,
      imageData,
      width: canvas.width,
      height: canvas.height,
    };
  }

  /**
   * Extract metadata from a PDF document
   */
  static async extractDocumentInfo(doc: pdfjsLib.PDFDocumentProxy): Promise<PDFDocumentInfo> {
    const info = await doc.getMetadata();
    const pageCount = doc.numPages;

    return {
      title: info.info?.Title,
      author: info.info?.Author,
      subject: info.info?.Subject,
      keywords: info.info?.Keywords,
      creator: info.info?.Creator,
      producer: info.info?.Producer,
      creationDate: info.info?.CreationDate ? new Date(info.info.CreationDate) : undefined,
      modificationDate: info.info?.ModDate ? new Date(info.info.ModDate) : undefined,
      pageCount,
    };
  }

  /**
   * Convert all pages of a PDF to images
   */
  static async convertPDFToImages(
    doc: pdfjsLib.PDFDocumentProxy,
    options: PDFProcessingOptions = {}
  ): Promise<PDFPageImage[]> {
    const { maxPages = doc.numPages } = options;
    const pagesToProcess = Math.min(maxPages, doc.numPages);
    const images: PDFPageImage[] = [];

    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      try {
        const page = await doc.getPage(pageNum);
        const image = await this.renderPageToImage(page, options);
        images.push(image);
      } catch (error) {
        console.error(`Failed to process page ${pageNum}:`, error);
        // Continue with other pages even if one fails
      }
    }

    return images;
  }

  /**
   * Validate if a file is a valid PDF
   */
  static async validatePDF(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      await loadingTask.promise;
      return true;
    } catch (error) {
      console.error('PDF validation failed:', error);
      return false;
    }
  }

  /**
   * Get PDF page count without loading the full document
   */
  static async getPageCount(source: File | ArrayBuffer | string): Promise<number> {
    const doc = await this.loadDocument(source);
    return doc.numPages;
  }
}

// Error handling utilities
export class PDFError extends Error {
  constructor(message: string, public code?: string, public originalError?: Error) {
    super(message);
    this.name = 'PDFError';
  }
}

export const handlePDFError = (error: unknown): PDFError => {
  if (error instanceof PDFError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new PDFError(error.message, 'UNKNOWN_ERROR', error);
  }
  
  return new PDFError('An unknown error occurred while processing PDF', 'UNKNOWN_ERROR');
};

// Export the main PDF.js library for direct access if needed
export { pdfjsLib };
export default PDFProcessor;
