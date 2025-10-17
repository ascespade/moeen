-- ================================================================
-- 👥 CRM TRIGGERS & FUNCTIONS
-- ================================================================

CREATE OR REPLACE FUNCTION update_crm_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_customers ON customers;
CREATE TRIGGER trigger_update_customers
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_crm_updated_at();

-- Lead scoring function
CREATE OR REPLACE FUNCTION calculate_lead_score(p_customer_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 50;
  v_customer customers;
BEGIN
  SELECT * INTO v_customer FROM customers WHERE id = p_customer_id;
  
  -- Recent activity bonus
  IF v_customer.last_contact_date > NOW() - INTERVAL '7 days' THEN
    v_score := v_score + 20;
  END IF;
  
  -- Lifecycle stage bonus
  CASE v_customer.lifecycle_stage
    WHEN 'prospect' THEN v_score := v_score + 10;
    WHEN 'customer' THEN v_score := v_score + 30;
    WHEN 'advocate' THEN v_score := v_score + 40;
    ELSE NULL;
  END CASE;
  
  v_score := GREATEST(0, LEAST(100, v_score));
  
  UPDATE customers SET lead_score = v_score WHERE id = p_customer_id;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql;
