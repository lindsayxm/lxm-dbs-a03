"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { ClaimPrompt } from "@/components/ClaimPrompt";
import { EmptyState } from "@/components/EmptyState";
import { PredictionRow } from "@/components/PredictionRow";
import { bonusFor, leaderboard, markReportSeen, now, summarizeReport } from "@/lib/game";
import { act, useGame } from "@/lib/store";

export function ReportView() {
  const game = useGame();
  const unseen = game?.report && !game.report.seen;

  // Opening the report counts as seeing it; the home panel then goes away.
  useEffect(() => {
    if (unseen) act(markReportSeen);
  }, [unseen]);

  if (!game) return <div className="h-64 animate-pulse rounded-lg bg-surface" aria-busy="true" aria-label="Loading report" />;

  const summary = summarizeReport(game);
  if (!summary) {
    return (
      <EmptyState title="Nothing new since you last observed" action={<ButtonLink href="/">Make a prediction</ButtonLink>}>
        Your streak bonus and results show up here when you come back on a new day.
      </EmptyState>
    );
  }

  const { report, rows, won, net } = summary;
  const at = now(game);
  const rank = leaderboard(game, at).findIndex((r) => r.isYou) + 1;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-observed">Collapse report</p>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back{game.username ? `, @${game.username}` : ""}.</h1>
        <p className="text-muted">
          {rows.length
            ? "Here's what was observed while you were away."
            : "Nothing you predicted has closed yet, but your streak is paying off."}
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Streak bonus" value={report.bonus ? `+${report.bonus}` : "—"} note={`Day ${report.streak} in a row`} />
        <Stat label="Called right" value={rows.length ? `${won} of ${rows.length}` : "—"} note={rows.length ? "this visit" : "nothing closed yet"} />
        <Stat
          label="Net tokens"
          value={`${net >= 0 ? "+" : "−"}${Math.abs(net)}`}
          note={`Balance: ${game.tokens}`}
          tone={net > 0 ? "win" : net < 0 ? "loss" : undefined}
        />
      </dl>

      {rows.length > 0 && (
        <section aria-labelledby="resolved-heading" className="flex flex-col gap-3">
          <h2 id="resolved-heading" className="font-semibold">
            Resolved predictions
          </h2>
          <ul className="flex flex-col gap-3">
            {rows.map(({ p, e }) => (
              <PredictionRow key={p.eventId} event={e} prediction={p} at={at} />
            ))}
          </ul>
        </section>
      )}

      {!game.username && <ClaimPrompt />}

      <Card className="flex flex-col gap-3">
        <p>
          Come back tomorrow for <strong className="text-observed">+{bonusFor(report.streak + 1)}</strong> tokens. You&apos;re{" "}
          <strong>#{rank}</strong> on this month&apos;s leaderboard{rank <= 3 ? ", in prize position" : ""}.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/">Make new predictions</ButtonLink>
          <ButtonLink href="/leaderboard" variant="secondary">
            See the leaderboard
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "win" | "loss" }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={`font-mono text-2xl font-semibold ${tone === "win" ? "text-win" : tone === "loss" ? "text-loss" : "text-ink"}`}>
        {value}
      </dd>
      <dd className="text-xs text-muted">{note}</dd>
    </div>
  );
}
