-- ============================================================
-- DATABASE MAINTENANCE & MONITORING SETUP
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This sets up database maintenance, monitoring, and backup procedures

-- ============================================================
-- CREATE SYSTEM MONITORING TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.system_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_type VARCHAR(50) NOT NULL,
    check_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('healthy', 'warning', 'critical', 'unknown')),
    message TEXT,
    details JSONB,
    response_time_ms INTEGER,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_health_checks_type ON public.system_health_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON public.system_health_checks(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_checked_at ON public.system_health_checks(checked_at);

-- Enable RLS
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Service role can manage health checks" ON public.system_health_checks
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE ERROR LOGGING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type VARCHAR(50) NOT NULL,
    error_code VARCHAR(20),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    request_path VARCHAR(500),
    request_method VARCHAR(10),
    request_headers JSONB,
    request_body JSONB,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    environment VARCHAR(20) DEFAULT 'production',
    severity VARCHAR(20) DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON public.error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Service role can manage error logs" ON public.error_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE PERFORMANCE METRICS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'counter', 'gauge', 'histogram', 'timer'
    metric_value DECIMAL(15,6) NOT NULL,
    metric_unit VARCHAR(20), -- 'ms', 'bytes', 'count', 'percent'
    tags JSONB, -- Additional metadata
    endpoint VARCHAR(500),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON public.performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON public.performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON public.performance_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_endpoint ON public.performance_metrics(endpoint);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Service role can manage performance metrics" ON public.performance_metrics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE AUDIT LOG TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Service role can manage audit logs" ON public.audit_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE BACKUP METADATA TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.backup_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'schema_only'
    backup_name VARCHAR(255) NOT NULL,
    backup_size_bytes BIGINT,
    backup_location TEXT,
    backup_format VARCHAR(20), -- 'sql', 'custom', 'tar'
    compression_type VARCHAR(20), -- 'none', 'gzip', 'bzip2'
    tables_included TEXT[],
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    retention_until TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_backup_metadata_type ON public.backup_metadata(backup_type);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_status ON public.backup_metadata(status);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_started_at ON public.backup_metadata(started_at);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_retention ON public.backup_metadata(retention_until);

-- Enable RLS
ALTER TABLE public.backup_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Service role can manage backup metadata" ON public.backup_metadata
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE MONITORING FUNCTIONS
-- ============================================================

-- Function to check database health
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    message TEXT,
    details JSONB
) AS $$
DECLARE
    db_size BIGINT;
    connection_count INTEGER;
    slow_queries INTEGER;
    table_count INTEGER;
    index_count INTEGER;
BEGIN
    -- Check database size
    SELECT pg_database_size(current_database()) INTO db_size;
    
    -- Check active connections
    SELECT count(*) INTO connection_count
    FROM pg_stat_activity
    WHERE state = 'active';
    
    -- Check for slow queries (hypothetical - adjust based on your needs)
    SELECT count(*) INTO slow_queries
    FROM pg_stat_activity
    WHERE state = 'active'
    AND query_start < NOW() - INTERVAL '30 seconds';
    
    -- Check table count
    SELECT count(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public';
    
    -- Check index count
    SELECT count(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public';
    
    -- Return health check results
    RETURN QUERY VALUES
        ('database_size', 
         CASE WHEN db_size < 1073741824 THEN 'healthy' -- < 1GB
              WHEN db_size < 5368709120 THEN 'warning'  -- < 5GB
              ELSE 'critical' END,
         'Database size: ' || pg_size_pretty(db_size),
         jsonb_build_object('size_bytes', db_size, 'size_pretty', pg_size_pretty(db_size))
        ),
        ('active_connections',
         CASE WHEN connection_count < 50 THEN 'healthy'
              WHEN connection_count < 100 THEN 'warning'
              ELSE 'critical' END,
         'Active connections: ' || connection_count,
         jsonb_build_object('count', connection_count)
        ),
        ('slow_queries',
         CASE WHEN slow_queries = 0 THEN 'healthy'
              WHEN slow_queries < 5 THEN 'warning'
              ELSE 'critical' END,
         'Slow queries: ' || slow_queries,
         jsonb_build_object('count', slow_queries)
        ),
        ('table_count',
         'healthy',
         'Tables: ' || table_count || ', Indexes: ' || index_count,
         jsonb_build_object('tables', table_count, 'indexes', index_count)
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log errors
CREATE OR REPLACE FUNCTION log_error(
    p_error_type VARCHAR(50),
    p_error_message TEXT,
    p_error_code VARCHAR(20) DEFAULT NULL,
    p_stack_trace TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_user_email VARCHAR(255) DEFAULT NULL,
    p_request_path VARCHAR(500) DEFAULT NULL,
    p_request_method VARCHAR(10) DEFAULT NULL,
    p_severity VARCHAR(20) DEFAULT 'error'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.error_logs (
        error_type,
        error_code,
        error_message,
        stack_trace,
        user_id,
        user_email,
        request_path,
        request_method,
        severity
    ) VALUES (
        p_error_type,
        p_error_code,
        p_error_message,
        p_stack_trace,
        p_user_id,
        p_user_email,
        p_request_path,
        p_request_method,
        p_severity
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record performance metrics
CREATE OR REPLACE FUNCTION record_metric(
    p_metric_name VARCHAR(100),
    p_metric_type VARCHAR(50),
    p_metric_value DECIMAL(15,6),
    p_metric_unit VARCHAR(20) DEFAULT NULL,
    p_tags JSONB DEFAULT NULL,
    p_endpoint VARCHAR(500) DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    metric_id UUID;
BEGIN
    INSERT INTO public.performance_metrics (
        metric_name,
        metric_type,
        metric_value,
        metric_unit,
        tags,
        endpoint,
        user_id
    ) VALUES (
        p_metric_name,
        p_metric_type,
        p_metric_value,
        p_metric_unit,
        p_tags,
        p_endpoint,
        p_user_id
    ) RETURNING id INTO metric_id;
    
    RETURN metric_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    total_users INTEGER;
    total_purchases INTEGER;
    total_revenue DECIMAL(12,2);
    active_subscriptions INTEGER;
    recent_errors INTEGER;
    avg_response_time DECIMAL(10,2);
BEGIN
    -- Get user count
    SELECT COUNT(*) INTO total_users
    FROM auth.users;
    
    -- Get purchase metrics
    SELECT 
        COUNT(*),
        COALESCE(SUM(price), 0)
    INTO total_purchases, total_revenue
    FROM public.purchases;
    
    -- Get active subscriptions
    SELECT COUNT(*) INTO active_subscriptions
    FROM public.subscriptions
    WHERE status = 'active';
    
    -- Get recent errors (last 24 hours)
    SELECT COUNT(*) INTO recent_errors
    FROM public.error_logs
    WHERE created_at > NOW() - INTERVAL '24 hours'
    AND severity IN ('error', 'critical');
    
    -- Get average response time (last hour)
    SELECT COALESCE(AVG(metric_value), 0) INTO avg_response_time
    FROM public.performance_metrics
    WHERE metric_name = 'response_time'
    AND metric_unit = 'ms'
    AND recorded_at > NOW() - INTERVAL '1 hour';
    
    -- Build result JSON
    result := jsonb_build_object(
        'users', jsonb_build_object(
            'total', total_users,
            'growth_24h', 0 -- Could calculate actual growth
        ),
        'sales', jsonb_build_object(
            'total_purchases', total_purchases,
            'total_revenue', total_revenue,
            'avg_order_value', CASE WHEN total_purchases > 0 THEN total_revenue / total_purchases ELSE 0 END
        ),
        'subscriptions', jsonb_build_object(
            'active', active_subscriptions
        ),
        'system', jsonb_build_object(
            'recent_errors', recent_errors,
            'avg_response_time_ms', avg_response_time,
            'uptime_status', 'healthy'
        ),
        'generated_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old data
CREATE OR REPLACE FUNCTION cleanup_old_data(
    p_days_to_keep INTEGER DEFAULT 90
)
RETURNS JSONB AS $$
DECLARE
    deleted_counts JSONB;
    analytics_deleted INTEGER;
    logs_deleted INTEGER;
    metrics_deleted INTEGER;
    health_checks_deleted INTEGER;
BEGIN
    -- Delete old analytics events
    DELETE FROM public.analytics_events
    WHERE created_at < NOW() - (p_days_to_keep || ' days')::INTERVAL;
    GET DIAGNOSTICS analytics_deleted = ROW_COUNT;
    
    -- Delete old error logs (keep critical errors longer)
    DELETE FROM public.error_logs
    WHERE created_at < NOW() - (p_days_to_keep || ' days')::INTERVAL
    AND severity NOT IN ('critical');
    GET DIAGNOSTICS logs_deleted = ROW_COUNT;
    
    -- Delete old performance metrics
    DELETE FROM public.performance_metrics
    WHERE recorded_at < NOW() - (p_days_to_keep || ' days')::INTERVAL;
    GET DIAGNOSTICS metrics_deleted = ROW_COUNT;
    
    -- Delete old health checks
    DELETE FROM public.system_health_checks
    WHERE checked_at < NOW() - (p_days_to_keep || ' days')::INTERVAL;
    GET DIAGNOSTICS health_checks_deleted = ROW_COUNT;
    
    deleted_counts := jsonb_build_object(
        'analytics_events', analytics_deleted,
        'error_logs', logs_deleted,
        'performance_metrics', metrics_deleted,
        'health_checks', health_checks_deleted,
        'cleanup_date', NOW(),
        'days_kept', p_days_to_keep
    );
    
    RETURN deleted_counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to analyze table sizes
CREATE OR REPLACE FUNCTION analyze_table_sizes()
RETURNS TABLE (
    table_name TEXT,
    row_count BIGINT,
    total_size TEXT,
    data_size TEXT,
    index_size TEXT,
    toast_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as data_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
        pg_size_pretty(COALESCE(pg_total_relation_size(reltoastrelid), 0)) as toast_size
    FROM pg_stat_user_tables
    LEFT JOIN pg_class ON pg_class.oid = pg_stat_user_tables.relid
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get slow queries
CREATE OR REPLACE FUNCTION get_slow_queries(p_min_duration_ms INTEGER DEFAULT 1000)
RETURNS TABLE (
    query_text TEXT,
    calls BIGINT,
    total_time_ms DOUBLE PRECISION,
    mean_time_ms DOUBLE PRECISION,
    max_time_ms DOUBLE PRECISION,
    rows_affected BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        query,
        calls,
        total_exec_time as total_time_ms,
        mean_exec_time as mean_time_ms,
        max_exec_time as max_time_ms,
        rows
    FROM pg_stat_statements
    WHERE mean_exec_time > p_min_duration_ms
    ORDER BY mean_exec_time DESC
    LIMIT 20;
EXCEPTION
    WHEN undefined_table THEN
        -- pg_stat_statements extension not available
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE MAINTENANCE PROCEDURES
-- ============================================================

-- Function to run daily maintenance
CREATE OR REPLACE FUNCTION run_daily_maintenance()
RETURNS JSONB AS $$
DECLARE
    maintenance_results JSONB;
    cleanup_results JSONB;
    health_results RECORD;
BEGIN
    -- Run cleanup
    SELECT cleanup_old_data(30) INTO cleanup_results;
    
    -- Update table statistics
    ANALYZE;
    
    -- Run health checks and log results
    FOR health_results IN SELECT * FROM check_database_health() LOOP
        INSERT INTO public.system_health_checks (
            check_type,
            check_name,
            status,
            message,
            details
        ) VALUES (
            'daily_maintenance',
            health_results.check_name,
            health_results.status,
            health_results.message,
            health_results.details
        );
    END LOOP;
    
    maintenance_results := jsonb_build_object(
        'cleanup_results', cleanup_results,
        'analyze_completed', true,
        'health_checks_logged', true,
        'maintenance_date', NOW()
    );
    
    RETURN maintenance_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE AUDIT TRIGGERS
-- ============================================================

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    changed_fields TEXT[];
BEGIN
    -- Handle different operations
    IF TG_OP = 'DELETE' THEN
        old_data := to_jsonb(OLD);
        new_data := NULL;
    ELSIF TG_OP = 'INSERT' THEN
        old_data := NULL;
        new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
        
        -- Find changed fields
        SELECT array_agg(key) INTO changed_fields
        FROM jsonb_each(old_data)
        WHERE value IS DISTINCT FROM (new_data -> key);
    END IF;
    
    -- Insert audit record
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        user_email
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE((new_data ->> 'id')::UUID, (old_data ->> 'id')::UUID),
        TG_OP,
        old_data,
        new_data,
        changed_fields,
        auth.uid(),
        auth.jwt() ->> 'email'
    );
    
    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for important tables
CREATE TRIGGER audit_purchases_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_coupons_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.coupons
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_affiliates_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.affiliates
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================================
-- CREATE SCHEDULED JOBS (using pg_cron if available)
-- ============================================================

-- Note: These require pg_cron extension which may not be available in all environments
-- Uncomment and modify as needed

/*
-- Daily maintenance at 2 AM
SELECT cron.schedule('daily-maintenance', '0 2 * * *', 'SELECT run_daily_maintenance();');

-- Weekly full backup metadata update
SELECT cron.schedule('weekly-backup-check', '0 3 * * 0', '
    INSERT INTO public.backup_metadata (backup_type, backup_name, status)
    VALUES (''weekly'', ''auto-weekly-'' || to_char(NOW(), ''YYYY-MM-DD''), ''scheduled'');
');

-- Hourly health checks
SELECT cron.schedule('hourly-health-check', '0 * * * *', '
    INSERT INTO public.system_health_checks (check_type, check_name, status, message)
    SELECT ''automated'', check_name, status, message
    FROM check_database_health();
');
*/

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

-- Grant permissions to service role
GRANT ALL ON public.system_health_checks TO service_role;
GRANT ALL ON public.error_logs TO service_role;
GRANT ALL ON public.performance_metrics TO service_role;
GRANT ALL ON public.audit_logs TO service_role;
GRANT ALL ON public.backup_metadata TO service_role;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION check_database_health TO service_role;
GRANT EXECUTE ON FUNCTION log_error TO service_role;
GRANT EXECUTE ON FUNCTION record_metric TO service_role;
GRANT EXECUTE ON FUNCTION get_dashboard_metrics TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_data TO service_role;
GRANT EXECUTE ON FUNCTION analyze_table_sizes TO service_role;
GRANT EXECUTE ON FUNCTION get_slow_queries TO service_role;
GRANT EXECUTE ON FUNCTION run_daily_maintenance TO service_role;

-- ============================================================
-- CREATE SAMPLE MONITORING DATA
-- ============================================================

-- Insert initial health check
INSERT INTO public.system_health_checks (check_type, check_name, status, message)
SELECT 'initial', check_name, status, message
FROM check_database_health();

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if monitoring tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'system_health_checks', 'error_logs', 'performance_metrics',
    'audit_logs', 'backup_metadata'
)
ORDER BY table_name;

-- Check if monitoring functions were created
SELECT 
    routine_name as function_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'check_database_health', 'log_error', 'record_metric',
    'get_dashboard_metrics', 'cleanup_old_data', 'analyze_table_sizes',
    'get_slow_queries', 'run_daily_maintenance'
)
ORDER BY routine_name;

-- Check initial health status
SELECT check_name, status, message
FROM public.system_health_checks
WHERE check_type = 'initial'
ORDER BY created_at DESC;

-- ============================================================
-- USAGE EXAMPLES
-- ============================================================

-- Example: Log an error
/*
SELECT log_error(
    'payment_processing',
    'Stripe webhook failed to process',
    'STRIPE_001',
    'Stack trace here...',
    auth.uid(),
    'user@example.com',
    '/api/webhooks/stripe',
    'POST',
    'error'
);
*/

-- Example: Record a performance metric
/*
SELECT record_metric(
    'response_time',
    'timer',
    150.5,
    'ms',
    '{"endpoint": "/api/checkout", "method": "POST"}',
    '/api/checkout',
    auth.uid()
);
*/

-- Example: Get dashboard metrics
/*
SELECT get_dashboard_metrics();
*/

-- Example: Run maintenance
/*
SELECT run_daily_maintenance();
*/

-- Example: Analyze table sizes
/*
SELECT * FROM analyze_table_sizes();
*/

-- Example: Check for slow queries
/*
SELECT * FROM get_slow_queries(500); -- Queries slower than 500ms
*/

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see the tables and functions listed above, monitoring is ready!
--
-- Your digital store now has:
-- ✅ Comprehensive health monitoring
-- ✅ Error logging and tracking
-- ✅ Performance metrics collection
-- ✅ Audit trail for all changes
-- ✅ Backup metadata tracking
-- ✅ Automated maintenance procedures
-- ✅ Database analysis tools
-- ✅ Dashboard metrics API
--
-- Next steps:
-- 1. Integrate error logging in your application
-- 2. Set up performance metric collection
-- 3. Create monitoring dashboard
-- 4. Configure backup procedures
-- 5. Set up alerting for critical issues
-- 6. Schedule regular maintenance
-- ============================================================