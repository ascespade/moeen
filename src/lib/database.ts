import { Pool } from "pg";

// Database Integration System

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;

export class DatabaseManager {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.initializeTables();

  private async initializeTables() {
    try {
      // Create patients table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          age INTEGER NOT NULL,
          phone VARCHAR(20) UNIQUE NOT NULL,
          email VARCHAR(255),
          emergency_contact VARCHAR(20),
          medical_history TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create doctors table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS doctors (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          specialty VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          email VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create appointments table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id),
          doctor_id INTEGER REFERENCES doctors(id),
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          type VARCHAR(50) DEFAULT 'treatment',
          status VARCHAR(50) DEFAULT 'scheduled',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create sessions table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id),
          doctor_id INTEGER REFERENCES doctors(id),
          session_date DATE NOT NULL,
          session_time TIME NOT NULL,
          type VARCHAR(50) NOT NULL,
          notes TEXT,
          exercises JSONB,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create family_members table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS family_members (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id),
          name VARCHAR(255) NOT NULL,
          relationship VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(255),
          notifications_enabled BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create conversations table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS conversations (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id),
          session_id VARCHAR(255),
          message_type VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          response TEXT,
          sentiment VARCHAR(50),
          crisis_level VARCHAR(50) DEFAULT 'normal',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create message_templates table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS message_templates (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          variables TEXT[],
          approved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
    }

  // Patient Management
  async createPatient(patientData: {
    name: string;
    age: number;
    phone: string;
    email?: string;
    emergencyContact?: string;
    medicalHistory?: string[];
  }) {
    const query = `
      INSERT INTO patients (name, age, phone, email, emergency_contact, medical_history)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, age, phone, email, emergency_contact, medical_history, created_at
    `;

    const values = [
      patientData.name,
      patientData.age,
      patientData.phone,
      patientData.email,
      patientData.emergencyContact,
      patientData.medicalHistory || [],
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];

  async getPatient(patientId: number) {
}

    const query = "SELECT * FROM patients WHERE id = $1";
    const result = await this.pool.query(query, [patientId]);
    return result.rows[0];

  async getPatientByPhone(phone: string) {
    const query = "SELECT * FROM patients WHERE phone = $1";
    const result = await this.pool.query(query, [phone]);
    return result.rows[0];

  async updatePatient(patientId: number, updates: any) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE patients 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await this.pool.query(query, [patientId, ...values]);
    return result.rows[0];

  // Appointment Management
  async createAppointment(appointmentData: {
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    appointmentTime: string;
    type?: string;
    notes?: string;
  }) {
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      appointmentData.patientId,
      appointmentData.doctorId,
      appointmentData.appointmentDate,
      appointmentData.appointmentTime,
      appointmentData.type || "treatment",
      appointmentData.notes,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];

  async getAppointments(patientId?: number, doctorId?: number, date?: string) {
    let query =
      "SELECT a.*, p.name as patient_name, d.name as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id";
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (patientId) {
      conditions.push(`a.patient_id = $${paramCount}`);
      values.push(patientId);
      paramCount++;

    if (doctorId) {
      conditions.push(`a.doctor_id = $${paramCount}`);
      values.push(doctorId);
      paramCount++;

    if (date) {
      conditions.push(`a.appointment_date = $${paramCount}`);
      values.push(date);
      paramCount++;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");

    query += " ORDER BY a.appointment_date, a.appointment_time";

    const result = await this.pool.query(query, values);
    return result.rows;

  // Session Management
  async createSession(sessionData: {
    patientId: number;
    doctorId: number;
    sessionDate: string;
    sessionTime: string;
    type: string;
    notes?: string;
    exercises?: any;
  }) {
    const query = `
      INSERT INTO sessions (patient_id, doctor_id, session_date, session_time, type, notes, exercises)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      sessionData.patientId,
      sessionData.doctorId,
      sessionData.sessionDate,
      sessionData.sessionTime,
      sessionData.type,
      sessionData.notes,
      JSON.stringify(sessionData.exercises || []),
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];

  // Conversation Logging
  async logConversation(conversationData: {
    patientId: number;
    sessionId: string;
    messageType: string;
    content: string;
    response?: string;
    sentiment?: string;
    crisisLevel?: string;
  }) {
    const query = `
      INSERT INTO conversations (patient_id, session_id, message_type, content, response, sentiment, crisis_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      conversationData.patientId,
      conversationData.sessionId,
      conversationData.messageType,
      conversationData.content,
      conversationData.response,
      conversationData.sentiment || "neutral",
      conversationData.crisisLevel || "normal",
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];

  // Analytics
  async getPatientStats() {
    const query = `
      SELECT 
        COUNT(*) as total_patients,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_patients_30_days,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_patients_7_days
      FROM patients
    `;

    const result = await this.pool.query(query);
    return result.rows[0];

  async getConversationStats() {
    const query = `
      SELECT 
        COUNT(*) as total_conversations,
        COUNT(CASE WHEN crisis_level = 'crisis' THEN 1 END) as crisis_conversations,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as conversations_7_days
      FROM conversations
    `;

    const result = await this.pool.query(query);
    return result.rows[0];

  // Health Check
  async healthCheck() {
    try {
      await this.pool.query("SELECT 1");
      return { status: "healthy", connected: this.isConnected };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { status: "unhealthy", error: message };
    }

  // Close connection
  async close() {
    await this.pool.end();
  }
}}}}}}}}}}}}}}}}}}}
