import { NextRequest, NextResponse } from 'next/server';
import { getEmailLog, deleteEmailLog } from '@/utils/email-storage';
import { createClient } from '@/lib/supabase/client';

interface RouteParams {
  params: {
    filename: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get the current user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { filename } = params;

    // Validate filename format
    if (!filename || !filename.startsWith('email-') || !filename.endsWith('.json')) {
      return NextResponse.json(
        { error: 'Invalid filename format. Expected: email-[timestamp].json' },
        { status: 400 }
      );
    }

    // Get the email log
    const emailLog = await getEmailLog(filename);

    return NextResponse.json({
      success: true,
      email: emailLog,
      filename,
      message: 'Email log retrieved successfully'
    });

  } catch (error: any) {
    console.error('Email retrieval error:', error);
    
    // Handle specific error cases
    if (error.message.includes('not found') || error.message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Email log not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to retrieve email: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Get the current user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { filename } = params;

    // Validate filename format
    if (!filename || !filename.startsWith('email-') || !filename.endsWith('.json')) {
      return NextResponse.json(
        { error: 'Invalid filename format. Expected: email-[timestamp].json' },
        { status: 400 }
      );
    }

    // Delete the email log
    const success = await deleteEmailLog(filename);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete email log' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      filename,
      message: 'Email log deleted successfully'
    });

  } catch (error: any) {
    console.error('Email deletion error:', error);
    
    // Handle specific error cases
    if (error.message.includes('not found') || error.message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Email log not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to delete email: ${error.message}` },
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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}