"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { ClaimPrompt } from "@/components/ClaimPrompt";
import { EmptyState } from "@/components/EmptyState";
import { PredictionRow } from "@/components/PredictionRow";
import { TokenBadge } from "@/components/TokenBadge";
import { getInstance, now, type EventInstance, type Prediction } from "@/lib/game";
import { useGame } from "@/lib/store";

export function PredictionsView() {
  const game = useGame();
  const tab = useSearchParams().get("tab") === "resolved" ? "resolved" : "open";

  if (!game) return <PredictionsSkeleton />;

  const at = now(game);
  const rows = game.predictions
    .map((p) => ({ p, e: getInstance(p.eventId, game.firstVisitAt) }))
    .filter((r): r is { p: Prediction; e: EventInstance } => r.e !== undefined);
  const open = rows.filter((r) => !r.p.result).sort((a, b) => a.e.closesAt - b.e.closesAt);
  const resolved = rows.filter((r) => r.p.result).sort((a, b) => b.p.result!.resolvedAt - a.p.result!.resolvedAt);
  const shown = tab === "open" ? open : resolved;
  const atStake = open.reduce((sum, r) => sum + r.p.wager, 0);
  const won = resolved.filter((r) => r.p.result!.won).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My predictions</h1>
        <p className="text-muted">
          {open.length} open · <TokenBadge amount={atStake} unit /> at stake
          {resolved.length > 0 && ` · ${won} of ${resolved.length} called right`}
        </p>
      </header>

      {game.predictions.length > 0 && !game.username && <ClaimPrompt />}

      <nav aria-label="Prediction status" className="flex gap-1 border-b border-line">
        <TabLink href="/predictions" active={tab === "open"} label="Open" count={open.length} />
        <TabLink href="/predictions?tab=resolved" active={tab === "resolved"} label="Resolved" count={resolved.length} />
      </nav>

      {shown.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {shown.map(({ p, e }) => (
            <PredictionRow key={p.eventId} event={e} prediction={p} at={at} />
          ))}
        </ul>
      ) : tab === "open" ? (
        <EmptyState
          title={game.predictions.length ? "No open predictions" : "No predictions yet"}
          action={<ButtonLink href="/">{game.predictions.length ? "Make a new prediction" : "Make your first prediction"}</ButtonLink>}
        >
          Pick an event, call the outcome, and wager a few tokens. It will show up here until it&apos;s observed.
        </EmptyState>
      ) : (
        <EmptyState title="Nothing has collapsed yet" action={<ButtonLink href="/predictions">See open predictions</ButtonLink>}>
          Results appear here once your events close. Some close within a day, so check back tomorrow.
        </EmptyState>
      )}
    </div>
  );
}

function TabLink({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      replace
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
        active ? "border-observed text-ink" : "border-transparent text-muted hover:text-ink"
      }`}
    >
      {label} <span className="font-mono text-muted">({count})</span>
    </Link>
  );
}

export function PredictionsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading predictions">
      <div className="h-9 w-1/2 animate-pulse rounded bg-surface-2" />
      {[0, 1].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-surface" />
      ))}
    </div>
  );
}
