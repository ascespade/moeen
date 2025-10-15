-- Dev constraints and indexes
DO $$ BEGIN
  -- notifications: add unique on (title) if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = current_schema() AND indexname = uniq_notifications_title
  ) THEN
    CREATE UNIQUE INDEX uniq_notifications_title ON notifications (title);
  END IF;
END $$;

-- roles: ensure name unique and add display_name default if missing
ALTER TABLE roles ALTER COLUMN display_name SET DEFAULT name; 
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = roles_name_key
  ) THEN
    ALTER TABLE roles ADD CONSTRAINT roles_name_key UNIQUE (name);
  END IF;
END $$;

-- lenient nullability for dev where necessary
-- patients/doctors minimal unique email if column exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=patients AND column_name=email) THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname=patients_email_key) THEN
      ALTER TABLE patients ADD CONSTRAINT patients_email_key UNIQUE (email);
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=doctors AND column_name=email) THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname=doctors_email_key) THEN
      ALTER TABLE doctors ADD CONSTRAINT doctors_email_key UNIQUE (email);
    END IF;
  END IF;
END $$;
