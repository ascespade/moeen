-- ================================================================
-- 💳 PAYMENTS TRIGGERS & FUNCTIONS
-- ================================================================

-- Update trigger
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_payments_updated_at ON payments;
CREATE TRIGGER trigger_update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();

-- Audit logging
CREATE OR REPLACE FUNCTION log_payment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      action, resource_type, resource_id, metadata, created_at
    ) VALUES (
      CASE TG_OP
        WHEN 'INSERT' THEN 'payment_created'
        WHEN 'UPDATE' THEN 
          CASE WHEN NEW.status = 'completed' THEN 'payment_completed'
               WHEN NEW.status = 'refunded' THEN 'payment_refunded'
               ELSE 'payment_updated'
          END
        ELSE 'payment_deleted'
      END,
      'payment',
      COALESCE(NEW.id::TEXT, OLD.id::TEXT),
      to_jsonb(COALESCE(NEW, OLD)),
      NOW()
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_payment_changes ON payments;
CREATE TRIGGER trigger_log_payment_changes
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION log_payment_changes();

-- Statistics function
CREATE OR REPLACE FUNCTION get_payment_statistics(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
  total_payments INTEGER,
  total_amount NUMERIC,
  completed_count INTEGER,
  completed_amount NUMERIC,
  refunded_count INTEGER,
  refunded_amount NUMERIC,
  failed_count INTEGER,
  average_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER,
    COALESCE(SUM(amount), 0),
    COUNT(*) FILTER (WHERE status = 'completed')::INTEGER,
    COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0),
    COUNT(*) FILTER (WHERE status = 'refunded')::INTEGER,
    COALESCE(SUM(amount) FILTER (WHERE status = 'refunded'), 0),
    COUNT(*) FILTER (WHERE status = 'failed')::INTEGER,
    COALESCE(AVG(amount), 0)
  FROM payments
  WHERE created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;
