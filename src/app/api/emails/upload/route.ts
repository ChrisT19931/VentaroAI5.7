import { NextRequest, NextResponse } from 'next/server';
import { uploadEmailLog, uploadEmailAttachment, EmailLog } from '@/utils/email-storage';
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
    
    // Extract email data
    const emailData: EmailLog = {
      to: formData.get('to') as string,
      from: formData.get('from') as string,
      subject: formData.get('subject') as string,
      body: formData.get('body') as string,
      timestamp: formData.get('timestamp') as string || new Date().toISOString(),
    };

    // Validate required fields
    if (!emailData.to || !emailData.from || !emailData.subject || !emailData.body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, from, subject, body' },
        { status: 400 }
      );
    }

    // Upload email log
    const filename = await uploadEmailLog(emailData);

    // Handle attachments if any
    const attachmentUrls: string[] = [];
    const attachmentFiles = formData.getAll('attachments') as File[];
    
    if (attachmentFiles.length > 0) {
      for (const file of attachmentFiles) {
        if (file.size > 0) { // Check if file is not empty
          try {
            const url = await uploadEmailAttachment(file, user.id, emailData.timestamp);
            attachmentUrls.push(url);
          } catch (attachmentError: any) {
            console.error('Attachment upload failed:', attachmentError.message);
            // Continue with other attachments even if one fails
          }
        }
      }
    }

    // Update email log with attachment URLs if any were uploaded
    if (attachmentUrls.length > 0) {
      const updatedEmailData = {
        ...emailData,
        attachments: attachmentUrls
      };
      
      // Re-upload the email log with attachment URLs
      await uploadEmailLog(updatedEmailData);
    }

    return NextResponse.json({
      success: true,
      filename,
      attachmentCount: attachmentUrls.length,
      message: `Email log uploaded successfully${attachmentUrls.length > 0 ? ` with ${attachmentUrls.length} attachments` : ''}`
    });

  } catch (error: any) {
    console.error('Email upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}