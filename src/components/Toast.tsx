"use client";

import { useEffect } from "react";

/**
 * Bottom-of-screen confirmation. The live region stays mounted so screen readers
 * announce each new message.
 */
export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {message && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-md border border-observed bg-surface-2 px-4 py-3 text-sm shadow-lg">
          <span aria-hidden="true" className="text-observed">
            ✓
          </span>
          <span>{message}</span>
          <button type="button" onClick={onDismiss} className="ml-2 text-muted hover:text-ink" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
