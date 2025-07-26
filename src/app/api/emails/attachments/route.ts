import { NextRequest, NextResponse } from 'next/server';
import { uploadEmailAttachment, getUserEmailAttachments } from '@/utils/email-storage';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const emailTimestamp = formData.get('emailTimestamp') as string;

    // Validate file
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'No file provided or file is empty' },
        { status: 400 }
      );
    }

    // Upload attachment
    const attachmentUrl = await uploadEmailAttachment(file, user.id, emailTimestamp);

    return NextResponse.json({
      success: true,
      url: attachmentUrl,
      filename: file.name,
      size: file.size,
      message: 'Attachment uploaded successfully'
    });

  } catch (error: any) {
    console.error('Attachment upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    // Get user's attachments
    const attachments = await getUserEmailAttachments(user.id);

    return NextResponse.json({
      success: true,
      attachments,
      total: attachments.length,
      message: `Retrieved ${attachments.length} attachments`
    });

  } catch (error: any) {
    console.error('Attachments list error:', error);
    return NextResponse.json(
      { error: `Failed to list attachments: ${error.message}` },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}