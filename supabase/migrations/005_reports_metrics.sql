-- reports and system metrics
CREATE TABLE IF NOT EXISTS reports_admin (id serial primary key, type text, payload jsonb, generated_at timestamptz default now());
CREATE TABLE IF NOT EXISTS system_metrics (id serial primary key, metric_key text, metric_value numeric, meta jsonb, recorded_at timestamptz default now());
