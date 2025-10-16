/**
 * Supabase Real-time Client
 * Handles real-time subscriptions and updates
 */

import { _createClient } from "@supabase/supabase-js";
import { _RealtimeChannel } from "@supabase/supabase-js";

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

class SupabaseRealtimeService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  subscribeToTable(
    table: string,
    callback: (_payload: unknown) => void,
    filter?: string,
  ): RealtimeSubscription {
    const __channel = this.supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter,
        },
        callback,
      )
      .subscribe();

    return {
      channel,
      unsubscribe: () => {
        this.supabase.removeChannel(channel);
      },
    };
  }

  subscribeToInsert(
    table: string,
    callback: (_payload: unknown) => void,
    filter?: string,
  ): RealtimeSubscription {
    return this.subscribeToTable(table, callback, filter);
  }

  subscribeToUpdate(
    table: string,
    callback: (_payload: unknown) => void,
    filter?: string,
  ): RealtimeSubscription {
    return this.subscribeToTable(table, callback, filter);
  }

  subscribeToDelete(
    table: string,
    callback: (_payload: unknown) => void,
    filter?: string,
  ): RealtimeSubscription {
    return this.subscribeToTable(table, callback, filter);
  }

  async broadcastMessage(
    channel: string,
    event: string,
    payload: unknown,
  ): Promise<void> {
    const { error } = await this.supabase.channel(channel).send({
      type: "broadcast",
      event,
      payload,
    });

    if (error) {
      // // console.error("Broadcast error:", error);
    }
  }

  async joinChannel(_channel: string): Promise<RealtimeChannel> {
    return this.supabase.channel(channel);
  }

  async leaveChannel(_channel: RealtimeChannel): Promise<void> {
    this.supabase.removeChannel(channel);
  }
}

// Create global realtime service
export const __supabaseRealtime = new SupabaseRealtimeService();
