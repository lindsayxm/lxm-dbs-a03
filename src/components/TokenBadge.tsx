/** Token amount in monospace with a glyph. Read by screen readers as "100 tokens". */
export function TokenBadge({ amount, className = "" }: { amount: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-mono font-semibold tabular-nums ${className}`}>
      <span aria-hidden="true" className="text-observed">
        ◈
      </span>
      {amount.toLocaleString()}
      <span className="sr-only"> tokens</span>
    </span>
  );
}
