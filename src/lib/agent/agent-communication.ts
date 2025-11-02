/**
 * Agent Communication System - نظام التواصل بين الوكلاء
 * Enables communication between multiple Cursor Cloud Background Agents
 */

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: string;
  data: Record<string, any>;
  timestamp: number;
  status: 'pending' | 'delivered' | 'read';
}

export interface AgentStatus {
  agentId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  currentTask?: string;
  progress?: number;
  lastUpdate: number;
  metadata?: Record<string, any>;
}

/**
 * Event Bus for Agent Communication
 */
export class AgentEventBus {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  /**
   * Emit an event to all listening agents
   */
  emit(event: string, data: any): void {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Listen to an event
   */
  on(event: string, handler: (data: any) => void): () => void {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.listeners.get(event) || [];
      const index = currentHandlers.indexOf(handler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
        this.listeners.set(event, currentHandlers);
      }
    };
  }

  /**
   * Remove all listeners for an event
   */
  off(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Remove a specific listener
   */
  removeListener(event: string, handler: (data: any) => void): void {
    const handlers = this.listeners.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.listeners.set(event, handlers);
    }
  }
}

/**
 * Agent Communication Manager
 * Manages communication between multiple agents
 */
export class AgentCommunication {
  private eventBus: AgentEventBus;
  private messages: AgentMessage[] = [];
  private agentStatuses: Map<string, AgentStatus> = new Map();
  private maxMessages = 1000; // Limit message history

  constructor() {
    this.eventBus = new AgentEventBus();
  }

  /**
   * Send a message from one agent to another
   */
  sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp' | 'status'>): string {
    const fullMessage: AgentMessage = {
      id: `${message.from}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...message,
      timestamp: Date.now(),
      status: 'pending',
    };

    this.messages.push(fullMessage);

    // Emit event for real-time communication
    this.eventBus.emit(`agent:${message.to}:message`, fullMessage);
    this.eventBus.emit(`agent:${message.from}:sent`, fullMessage);

    // Update message status
    setTimeout(() => {
      const msg = this.messages.find((m) => m.id === fullMessage.id);
      if (msg) {
        msg.status = 'delivered';
      }
    }, 100);

    // Limit message history
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    return fullMessage.id;
  }

  /**
   * Receive messages for a specific agent
   */
  receiveMessages(agentId: string): AgentMessage[] {
    return this.messages.filter((msg) => msg.to === agentId && msg.status !== 'read');
  }

  /**
   * Mark message as read
   */
  markAsRead(messageId: string): void {
    const message = this.messages.find((m) => m.id === messageId);
    if (message) {
      message.status = 'read';
    }
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: Partial<AgentStatus>): void {
    const currentStatus = this.agentStatuses.get(agentId) || {
      agentId,
      status: 'idle',
      lastUpdate: Date.now(),
    };

    const newStatus: AgentStatus = {
      ...currentStatus,
      ...status,
      lastUpdate: Date.now(),
    };

    this.agentStatuses.set(agentId, newStatus);

    // Emit status update event
    this.eventBus.emit(`agent:${agentId}:status`, newStatus);
    this.eventBus.emit('agent:status:updated', { agentId, status: newStatus });
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentId: string): AgentStatus | undefined {
    return this.agentStatuses.get(agentId);
  }

  /**
   * Get all agent statuses
   */
  getAllAgentStatuses(): AgentStatus[] {
    return Array.from(this.agentStatuses.values());
  }

  /**
   * Wait for a specific agent to complete
   */
  async waitForAgent(agentId: string, timeout: number = 60000): Promise<AgentStatus> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkStatus = () => {
        const status = this.getAgentStatus(agentId);
        
        if (!status) {
          if (Date.now() - startTime > timeout) {
            reject(new Error(`Timeout waiting for agent ${agentId}`));
            return;
          }
          setTimeout(checkStatus, 1000);
          return;
        }

        if (status.status === 'completed' || status.status === 'error') {
          resolve(status);
          return;
        }

        if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout waiting for agent ${agentId}`));
          return;
        }

        setTimeout(checkStatus, 1000);
      };

      // Also listen to status updates
      const unsubscribe = this.eventBus.on(`agent:${agentId}:status`, (status: AgentStatus) => {
        if (status.status === 'completed' || status.status === 'error') {
          unsubscribe();
          resolve(status);
        }
      });

      checkStatus();
    });
  }

  /**
   * Broadcast message to all agents
   */
  broadcast(from: string, type: string, data: Record<string, any>): string[] {
    const allAgents = Array.from(this.agentStatuses.keys());
    const messageIds: string[] = [];

    allAgents.forEach((agentId) => {
      if (agentId !== from) {
        const messageId = this.sendMessage({
          from,
          to: agentId,
          type,
          data,
        });
        messageIds.push(messageId);
      }
    });

    return messageIds;
  }

  /**
   * Get event bus instance
   */
  getEventBus(): AgentEventBus {
    return this.eventBus;
  }

  /**
   * Get message history
   */
  getMessageHistory(limit?: number): AgentMessage[] {
    const messages = [...this.messages].reverse();
    return limit ? messages.slice(0, limit) : messages;
  }

  /**
   * Clear old messages
   */
  clearOldMessages(olderThan: number): void {
    const cutoff = Date.now() - olderThan;
    this.messages = this.messages.filter((msg) => msg.timestamp > cutoff);
  }
}

// Global instance (singleton pattern)
let globalAgentCommunication: AgentCommunication | null = null;

/**
 * Get or create the global agent communication instance
 */
export function getAgentCommunication(): AgentCommunication {
  if (!globalAgentCommunication) {
    globalAgentCommunication = new AgentCommunication();
  }
  return globalAgentCommunication;
}

/**
 * Agent Helper Functions
 */

/**
 * Register an agent with the communication system
 */
export function registerAgent(
  agentId: string,
  agentName: string,
  initialStatus: Partial<AgentStatus> = {}
): void {
  const comm = getAgentCommunication();
  comm.updateAgentStatus(agentId, {
    agentId,
    status: 'idle',
    ...initialStatus,
  });
}

/**
 * Send a simple message between agents
 */
export function sendAgentMessage(
  from: string,
  to: string,
  type: string,
  data: Record<string, any>
): string {
  return getAgentCommunication().sendMessage({ from, to, type, data });
}

/**
 * Wait for a message from a specific agent
 */
export async function waitForMessage(
  agentId: string,
  messageType?: string,
  timeout: number = 60000
): Promise<AgentMessage | null> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkMessages = () => {
      const comm = getAgentCommunication();
      const messages = comm.receiveMessages(agentId);

      const filteredMessages = messageType
        ? messages.filter((msg) => msg.type === messageType)
        : messages;

      if (filteredMessages.length > 0) {
        const message = filteredMessages[0];
        comm.markAsRead(message.id);
        resolve(message);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for message${messageType ? ` of type ${messageType}` : ''}`));
        return;
      }

      setTimeout(checkMessages, 500);
    };

    // Also listen to new messages
    const comm = getAgentCommunication();
    const unsubscribe = comm.getEventBus().on(`agent:${agentId}:message`, (message: AgentMessage) => {
      if (!messageType || message.type === messageType) {
        unsubscribe();
        comm.markAsRead(message.id);
        resolve(message);
      }
    });

    checkMessages();
  });
}

/**
 * Create an agent coordinator
 * Coordinates multiple agents in sequence or parallel
 */
export class AgentCoordinator {
  private comm: AgentCommunication;
  private agentOrder: string[] = [];

  constructor(agentIds: string[] = []) {
    this.comm = getAgentCommunication();
    this.agentOrder = agentIds;
  }

  /**
   * Run agents in sequence
   */
  async runSequence(startData: Record<string, any> = {}): Promise<Record<string, any>> {
    let currentData = startData;

    for (const agentId of this.agentOrder) {
      // Update agent status to running
      this.comm.updateAgentStatus(agentId, {
        status: 'running',
        currentTask: 'Executing...',
      });

      // Send start signal
      this.comm.sendMessage({
        from: 'coordinator',
        to: agentId,
        type: 'start',
        data: currentData,
      });

      // Wait for completion
      const status = await this.comm.waitForAgent(agentId);

      if (status.status === 'error') {
        throw new Error(`Agent ${agentId} failed`);
      }

      // Get result data
      const messages = this.comm.receiveMessages('coordinator');
      const resultMessage = messages.find((msg) => msg.from === agentId && msg.type === 'completed');

      if (resultMessage) {
        currentData = { ...currentData, ...resultMessage.data };
        this.comm.markAsRead(resultMessage.id);
      }
    }

    return currentData;
  }

  /**
   * Run agents in parallel
   */
  async runParallel(startData: Record<string, any> = {}): Promise<Record<string, any>> {
    const promises = this.agentOrder.map(async (agentId) => {
      this.comm.updateAgentStatus(agentId, {
        status: 'running',
        currentTask: 'Executing...',
      });

      this.comm.sendMessage({
        from: 'coordinator',
        to: agentId,
        type: 'start',
        data: startData,
      });

      const status = await this.comm.waitForAgent(agentId);

      if (status.status === 'error') {
        throw new Error(`Agent ${agentId} failed`);
      }

      const messages = this.comm.receiveMessages('coordinator');
      const resultMessage = messages.find((msg) => msg.from === agentId && msg.type === 'completed');

      return {
        agentId,
        data: resultMessage?.data || {},
      };
    });

    const results = await Promise.all(promises);

    return results.reduce((acc, result) => {
      acc[result.agentId] = result.data;
      return acc;
    }, {} as Record<string, any>);
  }
}
