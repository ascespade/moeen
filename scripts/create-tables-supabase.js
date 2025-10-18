#!/usr/bin/env node
const { () => ({} as any) } = require('@supabase/supabase-js');

async function createTables() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseKey) {
    // console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }

  // console.log('🚀 Creating database tables...');

  let supabase = () => ({} as any)(supabaseUrl, supabaseKey);

  try {
    // Create core healthcare tables
    // console.log('\n🏥 Creating healthcare tables...');

    // Create patients table
    const error: patientsError = await supabase.rpc(
      'create_table_if_not_exists',
      {
        tableName: 'patients',
        tableSql: `
        CREATE TABLE IF NOT EXISTS patients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          public_id VARCHAR(255) UNIQUE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          date_of_birth DATE,
          gender VARCHAR(20),
          address TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
      }
    );

    if (patientsError) {
      // console.log('⚠️  Patients table:', patientsError.message);
    } else {
      // console.log('✅ Patients table created');
    }

    // Create doctors table
    const error: doctorsError = await supabase.rpc(
      'create_table_if_not_exists',
      {
        tableName: 'doctors',
        tableSql: `
        CREATE TABLE IF NOT EXISTS doctors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          public_id VARCHAR(255) UNIQUE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          specialty VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
      }
    );

    if (doctorsError) {
      // console.log('⚠️  Doctors table:', doctorsError.message);
    } else {
      // console.log('✅ Doctors table created');
    }

    // Create appointments table
    const error: appointmentsError = await supabase.rpc(
      'create_table_if_not_exists',
      {
        tableName: 'appointments',
        tableSql: `
        CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          public_id VARCHAR(255) UNIQUE,
          patient_id UUID REFERENCES patients(id),
          doctorId UUID REFERENCES doctors(id),
          appointment_date DATE NOT NULL,
          appointmentTime TIME NOT NULL,
          duration_minutes INTEGER DEFAULT 30,
          status VARCHAR(50) DEFAULT 'scheduled',
          type VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
      }
    );

    if (appointmentsError) {
      // console.log('⚠️  Appointments table:', appointmentsError.message);
    } else {
      // console.log('✅ Appointments table created');
    }

    // Create chatbot flows table
    // console.log('\n🤖 Creating chatbot tables...');

    const error: flowsError = await supabase.rpc(
      'create_table_if_not_exists',
      {
        tableName: 'chatbot_flows',
        tableSql: `
        CREATE TABLE IF NOT EXISTS chatbot_flows (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          public_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'draft',
          version INTEGER DEFAULT 1,
          created_by UUID REFERENCES users(id),
          published_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
      }
    );

    if (flowsError) {
      // console.log('⚠️  Chatbot flows table:', flowsError.message);
    } else {
      // console.log('✅ Chatbot flows table created');
    }

    // Create CRM leads table
    // console.log('\n💼 Creating CRM tables...');

    const error: leadsError = await supabase.rpc(
      'create_table_if_not_exists',
      {
        tableName: 'crm_leads',
        tableSql: `
        CREATE TABLE IF NOT EXISTS crm_leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          public_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          company VARCHAR(255),
          source VARCHAR(100),
          status VARCHAR(50) DEFAULT 'new',
          score INTEGER DEFAULT 0,
          notes TEXT,
          owner_id UUID REFERENCES users(id),
          assigned_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
      }
    );

    if (leadsError) {
      // console.log('⚠️  CRM leads table:', leadsError.message);
    } else {
      // console.log('✅ CRM leads table created');
    }

    // console.log('\n🎉 Database setup completed!');

    // Test the tables
    await testTables(supabase);
  } catch (error) {
    // console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

async function testTables(supabase) {
  // console.log('\n🔍 Testing created tables...');

  let tables = [
    'patients',
    'doctors',
    'appointments',
    'chatbot_flows',
    'crm_leads'
  ];

  for (const table of tables) {
    try {
      const data, error = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        // console.log(`⚠️  Table ${table}: ${error.message}`
      } else {
        // console.log(`✅ Table ${table}: OK`
      }
    } catch (err) {
      // console.log(`❌ Table ${table}: ${err.message}`
    }
  }
}

createTables().catch(console.error);
