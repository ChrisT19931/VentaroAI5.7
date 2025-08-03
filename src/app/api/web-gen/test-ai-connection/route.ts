import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface TestConnectionRequest {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TestConnectionRequest = await request.json();
    const { provider, apiKey, model } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    let testResult = false;
    let errorMessage = '';

    try {
      if (provider === 'openai') {
        const openai = new OpenAI({
          apiKey: apiKey,
        });

        // Test with a simple completion
        const completion = await openai.chat.completions.create({
          model: model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Test connection. Please respond with "OK"'
            }
          ],
          max_tokens: 10,
          temperature: 0
        });

        testResult = completion.choices.length > 0;
      } else if (provider === 'anthropic') {
        const anthropic = new Anthropic({
          apiKey: apiKey,
        });

        // Test with a simple message
        const message = await anthropic.messages.create({
          model: model || 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Test connection. Please respond with "OK"'
            }
          ]
        });

        testResult = message.content.length > 0;
      }
    } catch (apiError: any) {
      console.error('API test error:', apiError);
      
      // Parse common error types
      if (apiError.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (apiError.status === 429) {
        errorMessage = 'Rate limit exceeded';
      } else if (apiError.status === 404) {
        errorMessage = 'Model not found or not accessible';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      } else {
        errorMessage = 'API connection failed';
      }
      
      testResult = false;
    }

    if (testResult) {
      return NextResponse.json({
        success: true,
        message: 'Connection successful'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage || 'Connection test failed' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Test connection error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}