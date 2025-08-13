import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all users from database
    const users = await db.getAllUsers?.() || [];

    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      user_role: user.user_role,
      email_confirmed: user.email_confirmed,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      total: sanitizedUsers.length
    });

  } catch (error) {
    console.error('❌ Admin users API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, password, user_role = 'user' } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!['admin', 'user'].includes(user_role)) {
      return NextResponse.json(
        { error: 'Invalid user role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const newUser = await db.createUser({
      email,
      name: name || email.split('@')[0],
      password,
      user_role
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Return user without sensitive data
    const sanitizedUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      user_role: newUser.user_role,
      email_confirmed: newUser.email_confirmed,
      created_at: newUser.created_at
    };

    console.log(`👤 Admin created user: ${email} with role: ${user_role}`);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: sanitizedUser
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Admin create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 