import { NextRequest, NextResponse } from 'next/server';
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

    // Get request body
    const body = await request.json();
    const { date, level, service, timeRange } = body;
    
    // Validate parameters
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }
    
    // Determine the path to clear logs from
    let path = date;
    if (level && level !== 'all') {
      path = `${date}/${level}`;
    }
    
    // List files to delete
    const { data: files, error: listError } = await supabase.storage
      .from('logs')
      .list(path);
      
    if (listError) {
      return NextResponse.json(
        { error: `Failed to list logs: ${listError.message}` },
        { status: 500 }
      );
    }
    
    // If service filter is provided, we need to check each log file
    if (service && service !== 'all') {
      // For each file, download it, check if it matches the service and time range, and delete if it does
      const deletedFiles = [];
      
      for (const file of files) {
        try {
          const filePath = `${path}/${file.name}`;
          const { data } = await supabase.storage
            .from('logs')
            .download(filePath);
            
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
              const { error: deleteError } = await supabase.storage
                .from('logs')
                .remove([filePath]);
                
              if (!deleteError) {
                deletedFiles.push(filePath);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing log ${file.name}:`, error);
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${deletedFiles.length} logs for service ${service}`,
        deletedCount: deletedFiles.length
      });
    } else {
      // No service filter, delete all logs in the path
      const filesToDelete = files.map(file => `${path}/${file.name}`);
      
      if (filesToDelete.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No logs found to clear',
          deletedCount: 0
        });
      }
      
      const { error: deleteError } = await supabase.storage
        .from('logs')
        .remove(filesToDelete);
        
      if (deleteError) {
        return NextResponse.json(
          { error: `Failed to clear logs: ${deleteError.message}` },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${filesToDelete.length} logs`,
        deletedCount: filesToDelete.length
      });
    }
  } catch (error: any) {
    console.error('Log clear error:', error);
    return NextResponse.json(
      { error: `Failed to clear logs: ${error.message}` },
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