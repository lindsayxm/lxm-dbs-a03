import type { ReactNode } from "react";

/** Field-level error: icon + text, so it never relies on color alone. */
export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-loss">
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-loss text-[11px] font-bold text-bg"
      >
        !
      </span>
      {children}
    </p>
  );
}
