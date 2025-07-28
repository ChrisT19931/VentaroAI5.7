import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { LogsStorage } from '@/utils/supabase-storage-manager';

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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
      
    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const level = searchParams.get('level') || undefined;
    const service = searchParams.get('service') || undefined;
    const timeRange = searchParams.get('timeRange') || '24h';
    
    // Get logs from storage
    const logs = await LogsStorage.listLogs(date, level);
    
    // If service filter is provided, download each log and filter by service
    let filteredLogs = [];
    
    if (logs && logs.length > 0) {
      if (service && service !== 'all') {
        // Download each log file and check if it matches the service filter
        for (const log of logs) {
          try {
            const logPath = `${date}/${level || log.name.split('/')[0]}/${log.name}`;
            const { data } = await supabase.storage
              .from('logs')
              .download(logPath);
              
            if (data) {
              const logContent = await data.text();
              const logData = JSON.parse(logContent);
              
              // Check if log matches service filter and time range
              let matchesTimeRange = true;
              
              if (timeRange) {
                const logTimestamp = new Date(logData.timestamp || logData.content?.timestamp);
                const now = new Date();
                
                if (timeRange === '1h') {
                  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= oneHourAgo;
                } else if (timeRange === '24h') {
                  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= oneDayAgo;
                } else if (timeRange === '7d') {
                  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= sevenDaysAgo;
                } else if (timeRange === '30d') {
                  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= thirtyDaysAgo;
                }
              }
              
              if (logData.metadata && logData.metadata.service === service && matchesTimeRange) {
                filteredLogs.push({
                  name: log.name,
                  content: logData
                });
              }
            }
          } catch (error) {
            console.error(`Error downloading log ${log.name}:`, error);
          }
        }
      } else {
        // No service filter, include all logs
        for (const log of logs) {
          try {
            const logPath = `${date}/${level || log.name.split('/')[0]}/${log.name}`;
            const { data } = await supabase.storage
              .from('logs')
              .download(logPath);
              
            if (data) {
              const logContent = await data.text();
              const logData = JSON.parse(logContent);
              
              // Apply time range filter
              let matchesTimeRange = true;
              
              if (timeRange) {
                const logTimestamp = new Date(logData.timestamp || logData.content?.timestamp);
                const now = new Date();
                
                if (timeRange === '1h') {
                  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= oneHourAgo;
                } else if (timeRange === '24h') {
                  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= oneDayAgo;
                } else if (timeRange === '7d') {
                  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= sevenDaysAgo;
                } else if (timeRange === '30d') {
                  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                  matchesTimeRange = logTimestamp >= thirtyDaysAgo;
                }
              }
              
              if (matchesTimeRange) {
                filteredLogs.push({
                  name: log.name,
                  content: logData
                });
              }
            }
          } catch (error) {
            console.error(`Error downloading log ${log.name}:`, error);
          }
        }
      }
    }

    // Return logs as JSON
    return NextResponse.json({
      success: true,
      date,
      level: level || 'all',
      service: service || 'all',
      timeRange,
      logs: filteredLogs,
      count: filteredLogs.length
    });

  } catch (error: any) {
    console.error('Log export error:', error);
    return NextResponse.json(
      { error: `Failed to export logs: ${error.message}` },
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