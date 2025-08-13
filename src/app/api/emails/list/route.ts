import { NextRequest, NextResponse } from 'next/server';
import { getLatestEmailFiles } from '@/utils/email-storage';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get the current user from NextAuth token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate limit
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Get latest email files
    const emailFiles = await getLatestEmailFiles();
    
    // Limit the results
    const limitedFiles = emailFiles.slice(0, limit);

    return NextResponse.json({
      success: true,
      emails: limitedFiles,
      total: limitedFiles.length,
      message: `Retrieved ${limitedFiles.length} email files`
    });

  } catch (error: any) {
    console.error('Email list error:', error);
    return NextResponse.json(
      { error: `Failed to list emails: ${error.message}` },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}