import { NextRequest, NextResponse } from 'next/server';
import { WebGenService } from '@/lib/web-gen-service';
import { getSupabaseClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

/**
 * API route for web generator asset operations
 * Handles asset uploads and retrievals for web generator projects
 */
export async function POST(request: NextRequest) {
  try {
    // Get the auth cookie to verify user is authenticated
    const authCookie = cookies().get('ventaro-auth');
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user ID from the auth cookie
    const supabase = await getSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Handle multipart form data for file upload
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or project ID' }, { status: 400 });
    }

    // Verify the user owns the project
    const project = await WebGenService.getProjectById(projectId);
    if (!project || project.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Upload the asset
    const asset = await WebGenService.uploadAsset(projectId, file);
    
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error('Error in web-gen assets API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the auth cookie to verify user is authenticated
    const authCookie = cookies().get('ventaro-auth');
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user ID from the auth cookie
    const supabase = await getSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Get project ID from URL
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

    // Verify the user owns the project
    const project = await WebGenService.getProjectById(projectId);
    if (!project || project.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all assets for the project
    const assets = await WebGenService.getProjectAssets(projectId);
    
    return NextResponse.json({ success: true, assets });
  } catch (error) {
    console.error('Error in web-gen assets API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the auth cookie to verify user is authenticated
    const authCookie = cookies().get('ventaro-auth');
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user ID from the auth cookie
    const supabase = await getSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Parse the request body
    const body = await request.json();
    const { assetId, projectId } = body;

    if (!assetId || !projectId) {
      return NextResponse.json({ error: 'Missing asset ID or project ID' }, { status: 400 });
    }

    // Verify the user owns the project
    const project = await WebGenService.getProjectById(projectId);
    if (!project || project.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the asset
    await WebGenService.deleteAsset(assetId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in web-gen assets API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}