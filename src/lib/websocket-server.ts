import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { realDB } from "./supabase-real";
import { performanceMonitor } from "./performance-monitor";
// Real-time WebSocket Server for Hemam Center

// Socket event types
export interface SocketEvents {
  // Patient events
  "patient:joined": (data: { patientId: string; name: string }) => void;
  "patient:left": (data: { patientId: string }) => void;
  "patient:status_changed": (data: {
    patientId: string;
    status: string;
  }) => void;

  // Appointment events
  "appointment:created": (data: {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    date: string;
    time: string;
  }) => void;
  "appointment:updated": (data: {
    appointmentId: string;
    changes: any;
  }) => void;
  "appointment:cancelled": (data: {
    appointmentId: string;
    reason: string;
  }) => void;
  "appointment:reminder": (data: {
    appointmentId: string;
    patientId: string;
    message: string;
  }) => void;

  // Session events
  "session:started": (data: {
    sessionId: string;
    patientId: string;
    doctorId: string;
  }) => void;
  "session:ended": (data: {
    sessionId: string;
    duration: number;
    notes: string;
  }) => void;
  "session:exercise_completed": (data: {
    sessionId: string;
    exerciseId: string;
    patientId: string;
  }) => void;

  // Conversation events
  "conversation:new_message": (data: {
    conversationId: string;
    patientId: string;
    message: string;
    type: string;
  }) => void;
  "conversation:crisis_detected": (data: {
    patientId: string;
    message: string;
    severity: string;
  }) => void;
  "conversation:ai_response": (data: {
    patientId: string;
    response: string;
    sentiment: string;
  }) => void;

  // Notification events
  "notification:new": (data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    priority: string;
  }) => void;
  "notification:read": (data: {
    notificationId: string;
    userId: string;
  }) => void;

  // Emergency events
  "emergency:alert": (data: {
    patientId: string;
    message: string;
    location: string;
    severity: string;
  }) => void;
  "emergency:resolved": (data: {
    patientId: string;
    resolvedBy: string;
    notes: string;
  }) => void;

  // System events
  "system:maintenance": (data: { message: string; duration: number }) => void;
  "system:performance_alert": (data: {
    metric: string;
    value: number;
    threshold: number;
  }) => void;
}

// Socket user interface
interface SocketUser {
  id: string;
  role: string;
  name: string;
  email: string;
  socketId: string;
  joinedAt: Date;
  lastActivity: Date;
}

// WebSocket server class
export class WebSocketServer {
  private io: SocketIOServer;
  private users: Map<string, SocketUser> = new Map();
  private patientRooms: Map<string, Set<string>> = new Map(); // patientId -> Set of socketIds
  private doctorRooms: Map<string, Set<string>> = new Map(); // doctorId -> Set of socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventHandlers();
    this.setupPerformanceMonitoring();
  }

  private setupEventHandlers(): void {
    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle user authentication
      socket.on(
        "authenticate",
        async (data: { token: string; userId: string }) => {
          try {
            // Verify JWT token and get user info
            const user = await this.authenticateUser(data.token, data.userId);
            if (user) {
              this.users.set(socket.id, {
                ...user,
                socketId: socket.id,
                joinedAt: new Date(),
                lastActivity: new Date(),
              });

              // Join user to appropriate rooms
              await this.joinUserRooms(socket, user);

              socket.emit("authenticated", { success: true, user });
              console.log(`User authenticated: ${user.name} (${user.role})`);
            } else {
              socket.emit("authentication_failed", { error: "Invalid token" });
            }
          } catch (error) {
            console.error("Authentication error:", error);
            socket.emit("authentication_failed", {
              error: "Authentication failed",
            });
          }
        },
      );

      // Handle patient events
      socket.on("patient:join", async (data: { patientId: string }) => {
        const user = this.users.get(socket.id);
        if (user && this.canAccessPatient(user, data.patientId)) {
          socket.join(`patient:${data.patientId}`);
          this.patientRooms.set(data.patientId, new Set([socket.id]));

          // Notify others that patient joined
          socket.to(`patient:${data.patientId}`).emit("patient:joined", {
            patientId: data.patientId,
            name: user.name,
          });
        }
      });

      // Handle appointment events
      socket.on("appointment:create", async (data: any) => {
        const user = this.users.get(socket.id);
        if (user && user.role === "doctor") {
          // Create appointment in database
          const appointment = await realDB.createAppointment(data);

          // Notify relevant users
          this.io.to(`patient:${data.patient_id}`).emit("appointment:created", {
            appointmentId: appointment.id,
            patientId: data.patient_id,
            doctorId: data.doctor_id,
            date: data.appointment_date,
            time: data.appointment_time,
          });
        }
      });

      // Handle session events
      socket.on(
        "session:start",
        async (data: { patientId: string; doctorId: string }) => {
          const user = this.users.get(socket.id);
          if (user && user.role === "doctor") {
            const session = await realDB.createSession({
              patient_id: data.patientId,
              doctor_id: data.doctorId,
              session_date: new Date().toISOString().split("T")[0],
              session_time: new Date().toTimeString().split(" ")[0],
              type: "treatment",
            });

            this.io.to(`patient:${data.patientId}`).emit("session:started", {
              sessionId: session.id,
              patientId: data.patientId,
              doctorId: data.doctorId,
            });
          }
        },
      );

      // Handle conversation events
      socket.on(
        "conversation:message",
        async (data: { patientId: string; message: string; type: string }) => {
          const user = this.users.get(socket.id);
          if (user) {
            // Log conversation
            await realDB.logConversation({
              patient_id: data.patientId,
              message_type: data.type as any,
              content: data.message,
              sentiment: "neutral",
              crisis_level: "normal",
            });

            // Notify doctor if patient sent message
            if (user.role === "patient") {
              this.io.to(`doctor:${user.id}`).emit("conversation:new_message", {
                conversationId: `conv_${data.patientId}`,
                patientId: data.patientId,
                message: data.message,
                type: data.type,
              });
            }
          }
        },
      );

      // Handle crisis detection
      socket.on(
        "crisis:detected",
        async (data: {
          patientId: string;
          message: string;
          severity: string;
        }) => {
          // Log crisis
          await realDB.logConversation({
            patient_id: data.patientId,
            message_type: "text",
            content: data.message,
            crisis_level: "crisis",
          });

          // Notify all doctors and admins
          this.io.to("doctors").emit("conversation:crisis_detected", {
            patientId: data.patientId,
            message: data.message,
            severity: data.severity,
          });

          // Send emergency alert
          this.io.emit("emergency:alert", {
            patientId: data.patientId,
            message: data.message,
            location: "Unknown",
            severity: data.severity,
          });
        },
      );

      // Handle notifications
      socket.on(
        "notification:read",
        async (data: { notificationId: string }) => {
          const user = this.users.get(socket.id);
          if (user) {
            await realDB.markNotificationAsRead(data.notificationId);
            socket.emit("notification:read", {
              notificationId: data.notificationId,
              userId: user.id,
            });
          }
        },
      );

      // Handle disconnection
      socket.on("disconnect", () => {
        const user = this.users.get(socket.id);
        if (user) {
          console.log(`User disconnected: ${user.name}`);

          // Notify patient left if applicable
          if (user.role === "patient") {
            socket
              .to(`patient:${user.id}`)
              .emit("patient:left", { patientId: user.id });
          }

          this.users.delete(socket.id);
        }
      });

      // Handle ping/pong for connection health
      socket.on("ping", () => {
        const user = this.users.get(socket.id);
        if (user) {
          user.lastActivity = new Date();
          socket.emit("pong");
        }
      });
    });
  }

  private async authenticateUser(
    token: string,
    userId: string,
  ): Promise<SocketUser | null> {
    try {
      // In a real implementation, verify JWT token
      const user = await realDB.getUser(userId);
      if (user && user.is_active) {
        return {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          socketId: "",
          joinedAt: new Date(),
          lastActivity: new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error("User authentication error:", error);
      return null;
    }
  }

  private async joinUserRooms(socket: any, user: SocketUser): Promise<void> {
    // Join role-based rooms
    socket.join(user.role);

    if (user.role === "patient") {
      socket.join(`patient:${user.id}`);
    } else if (user.role === "doctor") {
      socket.join(`doctor:${user.id}`);
      // Get doctor's patients and join their rooms
      const patients = await realDB.getPatientsByDoctor(user.id);
      patients.forEach((patient) => {
        socket.join(`patient:${patient.id}`);
      });
    } else if (user.role === "admin") {
      socket.join("admins");
    }
  }

  private canAccessPatient(user: SocketUser, patientId: string): boolean {
    if (user.role === "admin") return true;
    if (user.role === "patient" && user.id === patientId) return true;
    if (user.role === "doctor") {
      // Check if doctor is assigned to this patient
      return true; // Simplified for now
    }
    return false;
  }

  private setupPerformanceMonitoring(): void {
    // Monitor WebSocket performance
    setInterval(() => {
      const stats = {
        connectedUsers: this.users.size,
        patientRooms: this.patientRooms.size,
        doctorRooms: this.doctorRooms.size,
        timestamp: new Date().toISOString(),
      };

      // Log performance metrics
      performanceMonitor.recordMetrics({
        timestamp: Date.now(),
        requestId: "websocket_stats",
        method: "WEBSOCKET",
        url: "/websocket",
        statusCode: 200,
        responseTime: 0,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      });

      // Clean up inactive users
      this.cleanupInactiveUsers();
    }, 60000); // Every minute
  }

  private cleanupInactiveUsers(): void {
    const now = new Date();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [socketId, user] of this.users.entries()) {
      if (now.getTime() - user.lastActivity.getTime() > inactiveThreshold) {
        console.log(`Cleaning up inactive user: ${user.name}`);
        this.users.delete(socketId);
      }
    }
  }

  // Public methods for external use
  public async sendNotification(
    userId: string,
    notification: {
      type: string;
      title: string;
      message: string;
      priority: string;
    },
  ): Promise<void> {
    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (user) {
      this.io.to(user.socketId).emit("notification:new", {
        userId,
        ...notification,
      });
    }
  }

  public async broadcastToRole(
    role: string,
    event: string,
    data: any,
  ): Promise<void> {
    this.io.to(role).emit(event, data);
  }

  public async broadcastToPatient(
    patientId: string,
    event: string,
    data: any,
  ): Promise<void> {
    this.io.to(`patient:${patientId}`).emit(event, data);
  }

  public async broadcastToDoctor(
    doctorId: string,
    event: string,
    data: any,
  ): Promise<void> {
    this.io.to(`doctor:${doctorId}`).emit(event, data);
  }

  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.users.values());
  }

  public getStats(): {
    connectedUsers: number;
    patientRooms: number;
    doctorRooms: number;
    timestamp: string;
  } {
    return {
      connectedUsers: this.users.size,
      patientRooms: this.patientRooms.size,
      doctorRooms: this.doctorRooms.size,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export WebSocket server instance
export let wsServer: WebSocketServer | null = null;

export function initializeWebSocketServer(
  httpServer: HTTPServer,
): WebSocketServer {
  wsServer = new WebSocketServer(httpServer);
  return wsServer;
}

export function getWebSocketServer(): WebSocketServer | null {
  return wsServer;
}
