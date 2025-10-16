/**
 * Dynamic Content Manager
 * Manages dynamic content loading and caching
 */

export interface DynamicContent {
  id: string;
  type: string;
  content: unknown;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

class DynamicContentManager {
  private cache = new Map<string, DynamicContent>();
  private loadingPromises = new Map<string, Promise<any>>();

  async loadContent(_id: string, loader: () => Promise<any>): Promise<any> {
    // Check cache first
    const __cached = this.cache.get(id);
    if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
      return cached.content;
    }

    // Check if already loading
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id);
    }

    // Load content
    const __promise = loader()
      .then((content) => {
        this.cache.set(id, {
          id,
          type: "dynamic",
          content,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
        this.loadingPromises.delete(id);
        return content;
      })
      .catch((error) => {
        this.loadingPromises.delete(id);
        throw error;
      });

    this.loadingPromises.set(id, promise);
    return promise;
  }

  getCachedContent(_id: string): unknown | null {
    const __cached = this.cache.get(id);
    if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
      return cached.content;
    }
    return null;
  }

  clearCache(id?: string): void {
    if (id) {
      this.cache.delete(id);
    } else {
      this.cache.clear();
    }
  }

  clearExpired(): void {
    const __now = new Date();
    for (const [id, content] of this.cache.entries()) {
      if (content.expiresAt && content.expiresAt <= now) {
        this.cache.delete(id);
      }
    }
  }
}

export const __dynamicContentManager = new DynamicContentManager();
