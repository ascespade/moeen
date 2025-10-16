const fs = require("fs").promises;
const path = require("path");

class FileLock {
  constructor(lockPath = "src/.shared_quarantine/.lock") {
    this.lockPath = lockPath;
    this.maxRetries = 10;
    this.baseDelay = 500; // 500ms base delay
  }

  /**
   * Acquire a file lock with exponential backoff
   * @param {number} timeoutMs - Maximum time to wait for lock (default: 30 seconds)
   * @returns {Promise<boolean>} - True if lock acquired, false if timeout
   */
  async acquire(timeoutMs = 30000) {
    const startTime = Date.now();
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        // Try to create lock file atomically
        await fs.writeFile(
          this.lockPath,
          JSON.stringify({
            pid: process.pid,
            timestamp: new Date().toISOString(),
            agent: "FrontendCleaner",
          }),
          { flag: "wx" },
        ); // 'wx' flag ensures file doesn't exist

        console.log(
          `🔒 Lock acquired by FrontendCleaner (PID: ${process.pid})`,
        );
        return true;
      } catch (error) {
        if (error.code === "EEXIST") {
          // Lock file exists, check if it's stale
          const isStale = await this.isLockStale();
          if (isStale) {
            console.log("🧹 Removing stale lock file");
            await this.forceRelease();
            continue; // Retry immediately after removing stale lock
          }
        }

        attempt++;
        const elapsed = Date.now() - startTime;

        if (elapsed >= timeoutMs) {
          console.error(`⏰ Lock acquisition timeout after ${timeoutMs}ms`);
          return false;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(this.baseDelay * Math.pow(2, attempt - 1), 5000);
        console.log(
          `⏳ Lock busy, retrying in ${delay}ms (attempt ${attempt}/${this.maxRetries})`,
        );

        await this.sleep(delay);
      }
    }

    console.error("❌ Failed to acquire lock after maximum retries");
    return false;
  }

  /**
   * Release the file lock
   */
  async release() {
    try {
      await fs.unlink(this.lockPath);
      console.log("🔓 Lock released");
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("⚠️ Error releasing lock:", error.message);
      }
    }
  }

  /**
   * Force release lock (removes even if not owned by this process)
   */
  async forceRelease() {
    try {
      await fs.unlink(this.lockPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  /**
   * Check if the lock file is stale (older than 5 minutes)
   */
  async isLockStale() {
    try {
      const stats = await fs.stat(this.lockPath);
      const age = Date.now() - stats.mtime.getTime();
      const staleThreshold = 5 * 60 * 1000; // 5 minutes

      return age > staleThreshold;
    } catch (error) {
      return true; // If we can't read the file, consider it stale
    }
  }

  /**
   * Check if lock is currently held
   */
  async isLocked() {
    try {
      await fs.access(this.lockPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute a function with automatic lock management
   */
  async withLock(fn, timeoutMs = 30000) {
    const acquired = await this.acquire(timeoutMs);
    if (!acquired) {
      throw new Error("Failed to acquire lock");
    }

    try {
      return await fn();
    } finally {
      await this.release();
    }
  }
}

module.exports = FileLock;
