import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/web-gen/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } | null }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params?.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const projectId = params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const project = await db.collection('web_projects').findOne({
      _id: new ObjectId(projectId),
      userEmail: session.user.email
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Transform the project data
    const transformedProject = {
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      html: project.html,
      css: project.css,
      lastEdited: project.lastEdited,
      thumbnail: project.thumbnail,
      pages: project.pages || [],
      components: project.components || [],
      metadata: project.metadata || {}
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/web-gen/projects/[id] - Update a specific project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } | null }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params?.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const projectId = params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const body = await request.json();
    const { html, css, pages, components, metadata, name, description } = body;

    // Prepare update data
    const updateData: any = {
      lastEdited: new Date().toISOString()
    };

    if (html !== undefined) updateData.html = html;
    if (css !== undefined) updateData.css = css;
    if (pages !== undefined) updateData.pages = pages;
    if (components !== undefined) updateData.components = components;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // Generate thumbnail if HTML/CSS changed
    if (html || css) {
      // Simple thumbnail generation (you can enhance this)
      updateData.thumbnail = `data:image/svg+xml;base64,${Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
          <rect width="300" height="200" fill="#f3f4f6"/>
          <text x="150" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#374151">
            ${updateData.name || 'Website Preview'}
          </text>
        </svg>`
      ).toString('base64')}`;
    }

    const result = await db.collection('web_projects').updateOne(
      {
        _id: new ObjectId(projectId),
        userEmail: session.user.email
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/web-gen/projects/[id] - Delete a specific project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } | null }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params?.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const projectId = params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const result = await db.collection('web_projects').deleteOne({
      _id: new ObjectId(projectId),
      userEmail: session.user.email
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}