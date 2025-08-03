import { NextRequest, NextResponse } from 'next/server';
import { WebGenService } from '@/lib/web-gen-service';
import { getSupabaseClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

/**
 * API route for web generator operations
 * Handles project operations like creating, retrieving, saving, publishing, unpublishing, and deleting
 */
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
    const projectId = request.nextUrl.searchParams.get('projectId');

    // If projectId is provided, get a specific project
    if (projectId) {
      const project = await WebGenService.getProjectById(projectId);
      
      // Check if project exists and user has access
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      // For published projects, allow public access
      // For unpublished projects, only allow access to the owner
      if (!project.is_published && project.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      return NextResponse.json({ success: true, project });
    }
    
    // Otherwise, get all projects for the user
    const projects = await WebGenService.getUserProjects(userId);
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Error in web-gen API route (GET):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the auth cookie to verify user is authenticated
    const authCookie = cookies().get('ventaro-auth');
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { action, projectId, data } = body;

    // Get the user ID from the auth cookie
    const supabase = await getSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Verify the user owns the project
    if (projectId) {
      const project = await WebGenService.getProjectById(projectId);
      if (!project || project.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Handle different actions
    switch (action) {
      case 'create':
        const { project } = body;
        if (!project || !project.name) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        // Ensure the user ID is set correctly
        project.user_id = userId;
        
        const newProject = await WebGenService.createProject(userData.user, project);
        return NextResponse.json({ success: true, project: newProject });
        
      case 'delete':
        if (!projectId) {
          return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }
        
        const deleteResult = await WebGenService.deleteProject(projectId);
        return NextResponse.json({ success: deleteResult });
        
      case 'save':
        if (!projectId || !data) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const updatedProject = await WebGenService.updateProject(projectId, data);
        return NextResponse.json({ success: true, project: updatedProject });

      case 'publish':
        if (!projectId) {
          return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }
        
        const publishedProject = await WebGenService.publishProject(projectId);
        return NextResponse.json({ success: true, project: publishedProject });

      case 'unpublish':
        if (!projectId) {
          return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
        }
        
        const unpublishedProject = await WebGenService.unpublishProject(projectId);
        return NextResponse.json({ success: true, project: unpublishedProject });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in web-gen API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}