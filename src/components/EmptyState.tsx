import type { ReactNode } from "react";

/** Never a dead end: an empty state always offers a next step. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-10 text-center">
      <p className="font-mono text-2xl text-observed" aria-hidden="true">
        |ψ⟩
      </p>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="max-w-sm text-sm text-muted">{children}</div>}
      {action}
    </div>
  );
}
