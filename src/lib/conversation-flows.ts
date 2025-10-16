/**
 * Conversation Flows
 * Manages chatbot conversation flows and responses
 */

export interface ConversationState {
  userId: string;
  sessionId: string;
  currentFlow: string | null;
  step: number;
  data: Record<string, any>;
  context: Record<string, any>;
}

export interface FlowStep {
  id: string;
  type: "question" | "action" | "response";
  message: string;
  options?: string[];
  nextStep?: string;
  validation?: (_input: string) => boolean;
  action?: (
    state: ConversationState,
    input: string,
  ) => Promise<ConversationState>;
}

export interface ConversationFlow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  startStep: string;
}

export class ConversationManager {
  private flows: Map<string, ConversationFlow> = new Map();
  private sessions: Map<string, ConversationState> = new Map();

  registerFlow(_flow: ConversationFlow): void {
    this.flows.set(flow.id, flow);
  }

  startFlow(
    userId: string,
    sessionId: string,
    flowId: string,
  ): ConversationState {
    const __flow = this.flows.get(flowId);
    if (!flow) {
      throw new Error(`Flow ${flowId} not found`);
    }

    const state: ConversationState = {
      userId,
      sessionId,
      currentFlow: flowId,
      step: 0,
      data: {},
      context: {},
    };

    this.sessions.set(sessionId, state);
    return state;
  }

  getCurrentStep(_sessionId: string): FlowStep | null {
    const __state = this.sessions.get(sessionId);
    if (!state || !state.currentFlow) return null;

    const __flow = this.flows.get(state.currentFlow);
    if (!flow) return null;

    const __stepId = flow.startStep;
    return flow.steps.find((step) => step.id === stepId) || null;
  }

  async processInput(
    sessionId: string,
    input: string,
  ): Promise<{
    response: string;
    options?: string[];
    nextStep?: string;
  }> {
    const __state = this.sessions.get(sessionId);
    if (!state || !state.currentFlow) {
      return { response: "No active conversation. Please start a new one." };
    }

    const __flow = this.flows.get(state.currentFlow);
    if (!flow) {
      return { response: "Conversation flow not found." };
    }

    const __currentStep = this.getCurrentStep(sessionId);
    if (!currentStep) {
      return { response: "No current step found." };
    }

    // Validate input if validation function exists
    if (currentStep.validation && !currentStep.validation(input)) {
      return {
        response: "Invalid input. Please try again.",
        options: currentStep.options,
      };
    }

    // Execute action if exists
    if (currentStep.action) {
      const __newState = await currentStep.action(state, input);
      this.sessions.set(sessionId, newState);
    }

    // Move to next step
    if (currentStep.nextStep) {
      const __nextStep = flow.steps.find(
        (step) => step.id === currentStep.nextStep,
      );
      if (nextStep) {
        state.step++;
        this.sessions.set(sessionId, state);
        return {
          response: nextStep.message,
          options: nextStep.options,
          nextStep: nextStep.id,
        };
      }
    }

    return {
      response: currentStep.message,
      options: currentStep.options,
    };
  }

  endFlow(_sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getState(_sessionId: string): ConversationState | null {
    return this.sessions.get(sessionId) || null;
  }
}

// Create global conversation manager
export const __conversationManager = new ConversationManager();

// Register default flows
conversationManager.registerFlow({
  id: "appointment_booking",
  name: "Appointment Booking",
  description: "Helps users book appointments",
  startStep: "welcome",
  steps: [
    {
      id: "welcome",
      type: "question",
      message:
        "Welcome! I can help you book an appointment. What type of appointment do you need?",
      options: [
        "General Checkup",
        "Specialist Consultation",
        "Emergency",
        "Follow-up",
      ],
      nextStep: "select_doctor",
    },
    {
      id: "select_doctor",
      type: "question",
      message: "Please select a doctor or department:",
      nextStep: "select_date",
    },
    {
      id: "select_date",
      type: "question",
      message: "What date would you prefer for your appointment?",
      nextStep: "select_time",
    },
    {
      id: "select_time",
      type: "question",
      message: "What time would work best for you?",
      nextStep: "confirm_booking",
    },
    {
      id: "confirm_booking",
      type: "action",
      message: "Please confirm your appointment details:",
      action: async (state, input) => {
        // Process booking confirmation
        return state;
      },
    },
  ],
});

conversationManager.registerFlow({
  id: "general_inquiry",
  name: "General Inquiry",
  description: "Handles general questions and inquiries",
  startStep: "greeting",
  steps: [
    {
      id: "greeting",
      type: "question",
      message: "Hello! How can I help you today?",
      options: [
        "Appointment",
        "Prescription",
        "Test Results",
        "General Question",
      ],
      nextStep: "handle_inquiry",
    },
    {
      id: "handle_inquiry",
      type: "response",
      message:
        "I understand you need help with that. Let me connect you with the right information.",
    },
  ],
});
