/** Token amount in monospace with a glyph. Always read by screen readers as "N tokens". */
export function TokenBadge({ amount, unit = false, className = "" }: { amount: number; unit?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-mono font-semibold tabular-nums ${className}`}>
      <span aria-hidden="true" className="text-observed">
        ◈
      </span>
      {amount.toLocaleString()}
      <span className={unit ? undefined : "sr-only"}> tokens</span>
    </span>
  );
}
