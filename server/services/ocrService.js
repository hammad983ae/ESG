/**
 * OCR Service
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Handles text extraction using OpenAI Vision API
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const axios = require('axios');

class OCRService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  /**
   * Extract text from base64 encoded image using OpenAI Vision API
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Promise<string>} Extracted text
   */
  async extractText(imageBase64) {
    try {
      console.log('Sending request to OpenAI Vision API...');
      
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all text from this image. Return only the raw text content without any formatting or additional commentary."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (!response.data.choices || !response.data.choices[0]) {
        console.warn('No response from OpenAI Vision API');
        return '';
      }

      const extractedText = response.data.choices[0].message.content || '';
      
      if (!extractedText || extractedText.trim() === '') {
        console.warn('No text detected in image');
        return '';
      }

      console.log(`Text extraction successful. Length: ${extractedText.length} characters`);
      
      return extractedText;
      
    } catch (error) {
      console.error('Error in OCR text extraction:', error);
      
      if (error.response) {
        // API error response
        const status = error.response.status;
        const message = error.response.data?.error?.message || error.message;
        
        if (status === 400) {
          throw new Error(`Invalid image format: ${message}`);
        } else if (status === 401) {
          throw new Error(`API key invalid: ${message}`);
        } else if (status === 429) {
          throw new Error(`Rate limit exceeded: ${message}`);
        } else if (status === 413) {
          throw new Error(`Image too large: ${message}`);
        } else {
          throw new Error(`OpenAI Vision API error (${status}): ${message}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('OCR request timeout - please try again');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Network error - unable to reach OCR service');
      } else {
        throw new Error(`OCR extraction failed: ${error.message}`);
      }
    }
  }

  /**
   * Extract text with confidence scores using OpenAI Vision API
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Promise<Object>} Text with confidence scores
   */
  async extractTextWithConfidence(imageBase64) {
    try {
      console.log('Sending request to OpenAI Vision API with confidence analysis...');
      
      const response = await axios.post(
        this.baseUrl,
        {
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all text from this image and provide a confidence score (0-1) for the overall text extraction quality. Return the response in JSON format with 'text', 'confidence', and 'annotations' fields. The annotations should contain individual text segments with their confidence scores."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000,
        }
      );

      if (!response.data.choices || !response.data.choices[0]) {
        return { text: '', confidence: 0, annotations: [] };
      }

      const content = response.data.choices[0].message.content || '';
      
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(content);
        return {
          text: parsed.text || content,
          confidence: parsed.confidence || 0.8, // Default confidence for OpenAI
          annotations: parsed.annotations || []
        };
      } catch (parseError) {
        // If not JSON, return the text with default confidence
        return {
          text: content,
          confidence: 0.8, // OpenAI generally has high confidence
          annotations: []
        };
      }
      
    } catch (error) {
      console.error('Error in OCR text extraction with confidence:', error);
      throw new Error(`OCR extraction with confidence failed: ${error.message}`);
    }
  }

  /**
   * Validate if the API key is working
   * @returns {Promise<boolean>} True if API key is valid
   */
  async validateApiKey() {
    try {
      // Test with a simple 1x1 pixel image
      const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      await this.extractText(testImage);
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
}

module.exports = new OCRService();
