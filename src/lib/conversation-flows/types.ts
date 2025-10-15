export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    appointmentId?: string;
    doctorName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    actionType?: string;
    actionData?: any;
  };
}

export interface Intent {
  type: string;
  confidence: number;
  entities: Record<string, any>;
  actionType?: string;
}

export interface FlowStep {
  id: string;
  name: string;
  type: 'question' | 'action' | 'response' | 'condition';
  content: string;
  actions?: FlowAction[];
  conditions?: FlowCondition[];
  nextStep?: string;
  fallbackStep?: string;
}

export interface FlowAction {
  type: 'create_appointment' | 'send_notification' | 'send_reminder' | 'update_patient' | 'send_email' | 'send_sms';
  data: any;
  conditions?: FlowCondition[];
}

export interface FlowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

export interface ConversationFlow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  startStep: string;
  isActive: boolean;
}

export interface ConversationContext {
  userId: string;
  conversationId: string;
  currentFlow?: string;
  currentStep?: string;
  data: Record<string, any>;
  history: ChatMessage[];
}