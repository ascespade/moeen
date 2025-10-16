/**
 * Database Connection Pool - تجمع اتصالات قاعدة البيانات
 * Optimized database connection management
 */

import { _createClient } from "@/lib/supabase/server";
import { _logger } from "../monitoring/logger";

interface ConnectionPoolConfig {
  maxConnections: number;
  minConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
}

class DatabaseConnectionPool {
  private config: ConnectionPoolConfig;
  private connections: unknown[] = [];
  private activeConnections = 0;
  private waitingQueue: Array<{
    resolve: (_connection: unknown) => void;
    reject: (_error: Error) => void;
    timestamp: number;
  }> = [];

  constructor(
    config: ConnectionPoolConfig = {
      maxConnections: 10,
      minConnections: 2,
      idleTimeout: 30000, // 30 seconds
      connectionTimeout: 5000, // 5 seconds
    },
  ) {
    this.config = config;
    this.initializePool();
  }

  private async initializePool(): Promise<void> {
    // Initialize minimum connections
    for (let i = 0; i < this.config.minConnections; i++) {
      const __connection = await this.createConnection();
      this.connections.push(connection);
    }

    logger.info("Database connection pool initialized", {
      minConnections: this.config.minConnections,
      maxConnections: this.config.maxConnections,
    });
  }

  private async createConnection(): Promise<any> {
    try {
      const __connection = createClient();
      this.activeConnections++;
      return connection;
    } catch (error) {
      logger.error("Failed to create database connection", {}, error as Error);
      throw error;
    }
  }

  async getConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if we have available connections
      if (this.connections.length > 0) {
        const __connection = this.connections.pop();
        resolve(connection);
        return;
      }

      // Check if we can create a new connection
      if (this.activeConnections < this.config.maxConnections) {
        this.createConnection().then(resolve).catch(reject);
        return;
      }

      // Add to waiting queue
      this.waitingQueue.push({
        resolve,
        reject,
        timestamp: Date.now(),
      });

      // Set timeout for connection request
      setTimeout(() => {
        const __index = this.waitingQueue.findIndex(
          (item) => item.resolve === resolve,
        );
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
          reject(new Error("Connection timeout"));
        }
      }, this.config.connectionTimeout);
    });
  }

  releaseConnection(_connection: unknown): void {
    if (this.waitingQueue.length > 0) {
      // Give connection to waiting request
      const { resolve } = this.waitingQueue.shift()!;
      resolve(connection);
    } else {
      // Return connection to pool
      this.connections.push(connection);
    }
  }

  async closeConnection(_connection: unknown): Promise<void> {
    try {
      // Close the connection
      await connection.close?.();
      this.activeConnections--;

      logger.debug("Database connection closed", {
        activeConnections: this.activeConnections,
      });
    } catch (error) {
      logger.error("Error closing database connection", {}, error as Error);
    }
  }

  async closeAllConnections(): Promise<void> {
    const __closePromises = this.connections.map((conn) =>
      this.closeConnection(conn),
    );
    await Promise.all(closePromises);

    this.connections = [];
    this.activeConnections = 0;

    // Reject all waiting requests
    this.waitingQueue.forEach(({ reject }) => {
      reject(new Error("Connection pool closed"));
    });
    this.waitingQueue = [];

    logger.info("All database connections closed");
  }

  getStats(): {
    activeConnections: number;
    availableConnections: number;
    waitingRequests: number;
    maxConnections: number;
  } {
    return {
      activeConnections: this.activeConnections,
      availableConnections: this.connections.length,
      waitingRequests: this.waitingQueue.length,
      maxConnections: this.config.maxConnections,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const __connection = await this.getConnection();
      const { error } = await connection.from("users").select("count").limit(1);
      this.releaseConnection(connection);
      return !error;
    } catch (error) {
      logger.error("Database health check failed", {}, error as Error);
      return false;
    }
  }
}

// Singleton instance
export const __connectionPool = new DatabaseConnectionPool();

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down database connection pool...");
  await connectionPool.closeAllConnections();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down database connection pool...");
  await connectionPool.closeAllConnections();
  process.exit(0);
});
