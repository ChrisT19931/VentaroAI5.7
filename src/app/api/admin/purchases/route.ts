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

    // Get all purchases from database
    const purchases = await db.getAllPurchases?.() || [];

    // Calculate statistics
    const stats = {
      total: purchases.length,
      completed: purchases.filter(p => p.status === 'completed').length,
      pending: purchases.filter(p => p.status === 'pending').length,
      failed: purchases.filter(p => p.status === 'failed').length,
      totalRevenue: purchases
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)
    };

    return NextResponse.json({
      success: true,
      purchases,
      stats
    });

  } catch (error) {
    console.error('❌ Admin purchases API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
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
    const { user_id, product_id, amount, status = 'completed', stripe_payment_intent_id } = body;

    // Validate input
    if (!user_id || !product_id || !amount) {
      return NextResponse.json(
        { error: 'user_id, product_id, and amount are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.findUserById(user_id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create purchase
    const newPurchase = await db.createPurchase({
      user_id,
      product_id,
      amount: parseInt(amount),
      status,
      stripe_payment_intent_id: stripe_payment_intent_id || `admin_${Date.now()}`
    });

    if (!newPurchase) {
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      );
    }

    console.log(`💳 Admin created purchase: ${product_id} for user ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Purchase created successfully',
      purchase: newPurchase
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Admin create purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
} 