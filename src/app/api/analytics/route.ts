import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent } from '@/lib/analytics';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();
    
    // Validate the event data
    if (!event.event || !event.sessionId || !event.timestamp) {
      return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
    }

    // Store in local file for development (in production, you'd use a database)
    const analyticsDir = path.join(process.cwd(), 'analytics');
    if (!fs.existsSync(analyticsDir)) {
      fs.mkdirSync(analyticsDir, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(analyticsDir, `analytics-${today}.json`);
    
    // Read existing data or create new array
    let existingData: AnalyticsEvent[] = [];
    if (fs.existsSync(logFile)) {
      try {
        const fileContent = fs.readFileSync(logFile, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Error reading analytics file:', error);
      }
    }

    // Add new event
    existingData.push(event);

    // Write back to file
    fs.writeFileSync(logFile, JSON.stringify(existingData, null, 2));

    // Also log important events to console for immediate visibility
    if (['purchase_complete', 'upsell_purchase', 'checkout_start'].includes(event.event)) {
      console.log(`🎯 CONVERSION EVENT: ${event.event}`, {
        userId: event.userId,
        properties: event.properties,
        timestamp: event.timestamp
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const analyticsDir = path.join(process.cwd(), 'analytics');
    const logFile = path.join(analyticsDir, `analytics-${date}.json`);
    
    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ events: [], summary: null });
    }

    const fileContent = fs.readFileSync(logFile, 'utf8');
    const events: AnalyticsEvent[] = JSON.parse(fileContent);
    
    // Generate summary statistics
    const summary = generateAnalyticsSummary(events);
    
    return NextResponse.json({ events, summary });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateAnalyticsSummary(events: AnalyticsEvent[]) {
  const summary = {
    totalEvents: events.length,
    uniqueUsers: new Set(events.filter(e => e.userId).map(e => e.userId)).size,
    uniqueSessions: new Set(events.map(e => e.sessionId)).size,
    pageViews: events.filter(e => e.event === 'page_view').length,
    buttonClicks: events.filter(e => e.event === 'button_click').length,
    purchaseIntents: events.filter(e => e.event === 'purchase_intent').length,
    checkoutStarts: events.filter(e => e.event === 'checkout_start').length,
    purchases: events.filter(e => e.event === 'purchase_complete').length,
    upsellViews: events.filter(e => e.event === 'upsell_view').length,
    upsellPurchases: events.filter(e => e.event === 'upsell_purchase').length,
    conversionRate: 0,
    upsellConversionRate: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topPages: {} as Record<string, number>,
    topProducts: {} as Record<string, number>
  };

  // Calculate conversion rates
  if (summary.purchaseIntents > 0) {
    summary.conversionRate = (summary.purchases / summary.purchaseIntents) * 100;
  }
  
  if (summary.upsellViews > 0) {
    summary.upsellConversionRate = (summary.upsellPurchases / summary.upsellViews) * 100;
  }

  // Calculate revenue metrics
  const purchaseEvents = events.filter(e => e.event === 'purchase_complete' || e.event === 'upsell_purchase');
  summary.totalRevenue = purchaseEvents.reduce((total, event) => {
    return total + (event.properties.price || event.properties.total_value || 0);
  }, 0);
  
  if (purchaseEvents.length > 0) {
    summary.averageOrderValue = summary.totalRevenue / purchaseEvents.length;
  }

  // Top pages
  events.filter(e => e.event === 'page_view').forEach(event => {
    const page = event.page;
    summary.topPages[page] = (summary.topPages[page] || 0) + 1;
  });

  // Top products
  events.filter(e => e.event === 'purchase_complete').forEach(event => {
    const productId = event.properties.product_id;
    if (productId) {
      summary.topProducts[productId] = (summary.topProducts[productId] || 0) + 1;
    }
  });

  return summary;
} 