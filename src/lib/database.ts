import { createId } from '@paralleldrive/cuid2';
import { supabase, supabaseAdmin, TABLES } from './supabase';
import './seed-data'; // Auto-seed database

// CUID Generator - محمي من التعديل
export const generateCUID = (): string => {
  return createId();
};

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'staff' | 'viewer';
  password_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  whatsapp_number: string;
  status: 'active' | 'archived' | 'closed';
  created_at: string;
  updated_at: string;
  last_message_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'user' | 'assistant';
  message_type: 'text' | 'image' | 'audio' | 'document';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  trigger_keywords: string[];
  response_template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  conversation_id: string;
  message_id: string;
  rating: number;
  feedback: string;
  is_helpful: boolean;
  created_at: string;
}

// Database Operations - محمية من التعديل
export class DatabaseService {
  private static instance: DatabaseService;
  
  private constructor() {}
  
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User Operations - محمي من التعديل
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      id: generateCUID(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { error } = await supabaseAdmin
      .from(TABLES.USERS)
      .insert(user);
    
    if (error) throw error;
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return null;
    return data as User;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return data as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from(TABLES.USERS)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return null;
    return data as User;
  }

  // Conversation Operations
  async createConversation(conversationData: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation> {
    const conversation: Conversation = {
      id: generateCUID(),
      ...conversationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // TODO: Save to Supabase
    return conversation;
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    // TODO: Query from Supabase
    return null;
  }

  async getConversationsByUserId(userId: string): Promise<Conversation[]> {
    // TODO: Query from Supabase
    return [];
  }

  // Message Operations
  async createMessage(messageData: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const message: Message = {
      id: generateCUID(),
      ...messageData,
      created_at: new Date().toISOString(),
    };
    
    // TODO: Save to Supabase
    return message;
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    // TODO: Query from Supabase
    return [];
  }

  // Flow Operations
  async createFlow(flowData: Omit<Flow, 'id' | 'created_at' | 'updated_at'>): Promise<Flow> {
    const flow: Flow = {
      id: generateCUID(),
      ...flowData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // TODO: Save to Supabase
    return flow;
  }

  async getActiveFlows(): Promise<Flow[]> {
    // TODO: Query from Supabase
    return [];
  }

  // Review Operations
  async createReview(reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const review: Review = {
      id: generateCUID(),
      ...reviewData,
      created_at: new Date().toISOString(),
    };
    
    // TODO: Save to Supabase
    return review;
  }

  async getReviewsByConversationId(conversationId: string): Promise<Review[]> {
    // TODO: Query from Supabase
    return [];
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();
