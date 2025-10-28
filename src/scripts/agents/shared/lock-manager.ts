/**
 * File-based locking system for agent coordination
 * Prevents concurrent agent execution conflicts
 */

import * as fs from "fs";
import * as path from "path";
import { _LockInfo } from "./types";

export class LockManager {
  private lockFilePath: string;
  private agentId: string;
  private pid: number;

  constructor(_agentId: string, quarantineDir: string) {
    this.agentId = agentId;
    this.pid = process.pid;
    this.lockFilePath = path.join(quarantineDir, ".lock");
  }

  /**
   * Acquire a lock for this agent
   * @returns true if lock acquired successfully, false if another agent is running
   */
  async acquireLock(): Promise<boolean> {
    try {
      // Check if lock file exists
      if (fs.existsSync(this.lockFilePath)) {
        const __lockContent = fs.readFileSync(this.lockFilePath, "utf-8").trim();

        if (lockContent) {
          const __lockInfo = this.parseLockContent(lockContent);

          // Check if lock is stale (older than 1 hour)
          const __lockTime = new Date(lockInfo.timestamp);
          const __now = new Date();
          const __isStale = now.getTime() - lockTime.getTime() > 60 * 60 * 1000; // 1 hour

          if (!isStale && lockInfo.agent_id !== this.agentId) {
            // // console.log(
              `❌ Another agent (${lockInfo.agent_id}) is currently running`,
            );
            return false;
          }

          if (isStale) {
            // // console.log(
              `⚠️  Stale lock detected from ${lockInfo.agent_id}, taking over...`,
            );
          }
        }
      }

      // Create or update lock file
      const lockInfo: LockInfo = {
        agent_id: this.agentId,
        timestamp: new Date().toISOString(),
        pid: this.pid,
        status: "active",
      };

      fs.writeFileSync(this.lockFilePath, this.formatLockContent(lockInfo));
      // // console.log(`🔒 Lock acquired by ${this.agentId} (_PID: ${this.pid})`);
      return true;
    } catch (error) {
      // // console.error("❌ Failed to acquire lock:", error);
      return false;
    }
  }

  /**
   * Release the lock for this agent
   */
  async releaseLock(): Promise<void> {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        const __lockContent = fs.readFileSync(this.lockFilePath, "utf-8").trim();
        const __lockInfo = this.parseLockContent(lockContent);

        // Only release if this agent owns the lock
        if (lockInfo.agent_id === this.agentId && lockInfo.pid === this.pid) {
          fs.unlinkSync(this.lockFilePath);
          // // console.log(`🔓 Lock released by ${this.agentId}`);
        }
      }
    } catch (error) {
      // // console.error("❌ Failed to release lock:", error);
    }
  }

  /**
   * Check if any agent is currently running
   */
  async isLocked(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.lockFilePath)) {
        return false;
      }

      const __lockContent = fs.readFileSync(this.lockFilePath, "utf-8").trim();
      if (!lockContent) {
        return false;
      }

      const __lockInfo = this.parseLockContent(lockContent);

      // Check if lock is stale
      const __lockTime = new Date(lockInfo.timestamp);
      const __now = new Date();
      const __isStale = now.getTime() - lockTime.getTime() > 60 * 60 * 1000;

      return !isStale;
    } catch (error) {
      // // console.error("❌ Failed to check lock status:", error);
      return false;
    }
  }

  /**
   * Get current lock information
   */
  async getLockInfo(): Promise<LockInfo | null> {
    try {
      if (!fs.existsSync(this.lockFilePath)) {
        return null;
      }

      const __lockContent = fs.readFileSync(this.lockFilePath, "utf-8").trim();
      if (!lockContent) {
        return null;
      }

      return this.parseLockContent(lockContent);
    } catch (error) {
      // // console.error("❌ Failed to get lock info:", error);
      return null;
    }
  }

  private parseLockContent(_content: string): LockInfo {
    // Handle empty content
    if (!content.trim()) {
      throw new Error("Empty lock file");
    }

    const __parts = content.split(":");
    if (parts.length !== 3) {
      throw new Error(
        `Invalid lock file format: expected 3 parts, got ${parts.length}`,
      );
    }

    return {
      agent_id: parts[0],
      timestamp: parts[1],
      pid: parseInt(parts[2], 10),
      status: "active",
    };
  }

  private formatLockContent(_lockInfo: LockInfo): string {
    return `${lockInfo.agent_id}:${lockInfo.timestamp}:${lockInfo.pid}`;
  }
}
