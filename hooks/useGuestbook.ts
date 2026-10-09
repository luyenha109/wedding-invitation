"use client";

import { useState, useCallback, useRef } from "react";
import { fetchGuestbook, submitGuestbook } from "@/lib/api";
import type { GuestbookPayload, GuestbookEntry } from "@/types/invitation";
import type { FetchState } from "@/types/api";
import { APPS_SCRIPT_ENABLED, GUESTBOOK_COOLDOWN_MS } from "@/lib/constants";

interface UseGuestbookReturn {
  entries: GuestbookEntry[];
  fetchState: FetchState<GuestbookEntry[]>;
  submitState: FetchState<Record<string, never>>;
  load: () => Promise<void>;
  submit: (payload: GuestbookPayload) => Promise<boolean>;
  resetSubmit: () => void;
}

export function useGuestbook(): UseGuestbookReturn {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [fetchState, setFetchState] = useState<FetchState<GuestbookEntry[]>>({
    status: "idle",
  });
  const [submitState, setSubmitState] = useState<
    FetchState<Record<string, never>>
  >({ status: "idle" });
  const lastSubmit = useRef<number>(0);

  const load = useCallback(async () => {
    if (!APPS_SCRIPT_ENABLED) {
      setEntries([]);
      setFetchState({ status: "idle" });
      return;
    }

    setFetchState({ status: "loading" });
    try {
      const res = await fetchGuestbook();
      if (res.success) {
        const parsed: GuestbookEntry[] = res.data.entries.map((e) => ({
          timestamp: e.timestamp,
          name: e.name,
          message: e.message,
        }));
        setEntries(parsed);
        setFetchState({ status: "success", data: parsed });
      } else {
        setFetchState({ status: "error", message: res.message });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải lời chúc";
      setFetchState({ status: "error", message });
    }
  }, []);

  const submit = useCallback(
    async (payload: GuestbookPayload): Promise<boolean> => {
      if (!APPS_SCRIPT_ENABLED) {
        setSubmitState({
          status: "error",
          message: "Tính năng sổ lưu bút chưa khả dụng.",
        });
        return false;
      }

      const now = Date.now();
      if (now - lastSubmit.current < GUESTBOOK_COOLDOWN_MS) {
        setSubmitState({
          status: "error",
          message: "Vui lòng đợi một lát trước khi gửi lại.",
        });
        return false;
      }

      setSubmitState({ status: "loading" });
      lastSubmit.current = now;

      try {
        const res = await submitGuestbook(payload);
        if (res.success) {
          setSubmitState({ status: "success", data: {} });
          await load();
          return true;
        } else {
          setSubmitState({ status: "error", message: res.message });
          return false;
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể gửi lời chúc";
        setSubmitState({ status: "error", message });
        return false;
      }
    },
    [load]
  );

  const resetSubmit = useCallback(() => {
    setSubmitState({ status: "idle" });
  }, []);

  return { entries, fetchState, submitState, load, submit, resetSubmit };
}
