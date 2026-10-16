import type { ReactNode } from "react";

type EmptyStateProps = { title: string; children?: ReactNode; action: ReactNode; level?: 1 | 2 };

/** Never a dead end: an empty state always offers a next step. */
export function EmptyState({ title, children, action, level = 2 }: EmptyStateProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-10 text-center">
      <p className="font-mono text-2xl text-observed" aria-hidden="true">
        |ψ⟩
      </p>
      <Heading className="text-lg font-semibold">{title}</Heading>
      {children && <div className="max-w-sm text-sm text-muted">{children}</div>}
      {action}
    </div>
  );
}
