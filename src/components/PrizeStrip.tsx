/** Prize facts, stated plainly (borrowed from ESPN's facts strip). */
export function PrizeStrip() {
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 border-y border-line py-2 font-mono text-xs uppercase tracking-wider text-muted">
      <span>Free to play</span>
      <span aria-hidden="true">·</span>
      <span>Top 3 each month win cash</span>
      <span aria-hidden="true">·</span>
      <span>You never risk money</span>
    </p>
  );
}
