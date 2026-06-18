/**
 * Checks the "smart cards messages" Google Sheet for admin messages + block status.
 *
 * Sheet columns (tab: smart cards messages):
 *   A = fingerprint | B = message | C = read status | D = BLOCK
 */
import { useState, useEffect, useRef, useCallback } from "react";

export interface StudentMessageState {
  checked: boolean;
  isBlocked: boolean;
  message: string | null;
  paymentSubmitted: boolean;
}

const EMPTY_STATE: StudentMessageState = {
  checked: false,
  isBlocked: false,
  message: null,
  paymentSubmitted: false,
};

let cachedResult: { fingerprint: string; state: StudentMessageState } | null = null;

function isMessageDismissedLocally(fingerprint: string, message: string): boolean {
  try {
    const stored = localStorage.getItem(`msgRead_${fingerprint}`);
    if (!stored) return false;
    const { msg } = JSON.parse(stored) as { msg: string };
    return msg === message;
  } catch {
    return false;
  }
}

function markDismissedLocally(fingerprint: string, message: string): void {
  try {
    localStorage.setItem(`msgRead_${fingerprint}`, JSON.stringify({ msg: message }));
  } catch {
    // ignore storage errors
  }
}

function parseMessageResponse(
  fingerprint: string,
  data: { isBlocked?: boolean; message?: string | null; paymentSubmitted?: boolean },
): StudentMessageState {
  const rawMessage = data.message ?? null;
  const paymentSubmitted =
    data.paymentSubmitted ?? localStorage.getItem(`paymentPending_${fingerprint}`) === "1";
  if (data.isBlocked) {
    return { checked: true, isBlocked: true, message: rawMessage, paymentSubmitted };
  }
  const alreadyReadLocally =
    rawMessage !== null ? isMessageDismissedLocally(fingerprint, rawMessage) : false;
  return {
    checked: true,
    isBlocked: false,
    message: alreadyReadLocally ? null : rawMessage,
    paymentSubmitted,
  };
}

/** Call from login flow before allowing access. */
export async function fetchStudentMessages(fingerprint: string): Promise<StudentMessageState> {
  if (cachedResult?.fingerprint === fingerprint) {
    return cachedResult.state;
  }
  try {
    const r = await fetch("/api/students/check-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    });
    const data = (await r.json()) as {
      isBlocked?: boolean;
      message?: string | null;
      paymentSubmitted?: boolean;
    };
    const state = parseMessageResponse(fingerprint, data);
    cachedResult = { fingerprint, state };
    return state;
  } catch {
    const state = { checked: true, isBlocked: false, message: null, paymentSubmitted: false };
    cachedResult = { fingerprint, state };
    return state;
  }
}

export function resetMessageCheck(): void {
  cachedResult = null;
}

export function useStudentMessages(fingerprint: string | null): {
  state: StudentMessageState;
  dismissMessage: () => void;
} {
  const [state, setState] = useState<StudentMessageState>(() => {
    if (fingerprint && cachedResult?.fingerprint === fingerprint) {
      return cachedResult.state;
    }
    return EMPTY_STATE;
  });
  const fpRef = useRef(fingerprint);

  useEffect(() => {
    fpRef.current = fingerprint;
  }, [fingerprint]);

  useEffect(() => {
    if (!fingerprint) {
      setState(EMPTY_STATE);
      return;
    }
    if (cachedResult?.fingerprint === fingerprint) {
      setState(cachedResult.state);
      return;
    }

    let cancelled = false;
    fetchStudentMessages(fingerprint).then((result) => {
      if (!cancelled) setState(result);
    });

    return () => {
      cancelled = true;
    };
  }, [fingerprint]);

  const dismissMessage = useCallback(() => {
    const fp = fpRef.current;
    const currentMessage = state.message;
    if (fp && currentMessage) {
      markDismissedLocally(fp, currentMessage);
      fetch("/api/students/mark-message-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fp }),
      }).catch(() => {});
    }
    const next = { ...state, message: null };
    if (fp) cachedResult = { fingerprint: fp, state: next };
    setState(next);
  }, [state]);

  return { state, dismissMessage };
}
