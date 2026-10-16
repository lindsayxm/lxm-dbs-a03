"use client";

import { useCallback } from "react";
import { setFlash, useFlash } from "@/lib/store";
import { Toast } from "./Toast";

/** App-wide toast for confirmations that happen right before a page change. */
export function FlashToast() {
  const message = useFlash();
  const dismiss = useCallback(() => setFlash(null), []);
  return <Toast message={message} onDismiss={dismiss} />;
}
