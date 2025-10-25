"use client";

import { generateTopicsForUser } from "@/app/apiClient/learning/vocabulary/vocabulary";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useRealtimePersonalVocab() {
  useEffect(() => {
    async function setupSubscription() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Lắng nghe khi có từ mới được thêm vào personalVocab của user này
      const channel = supabase
        .channel("personalVocab")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "personalVocab",
            filter: `userId=eq.${userId}`,
          },
          async (payload) => {
            console.log("📢 [useRealtimePersonalVocab] New personal vocab added:", payload.new);
            // Khi có từ mới, tự động gọi AI backend để tạo topic
            await generateTopicsForUser({ userId });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    setupSubscription();
  }, []);
}
