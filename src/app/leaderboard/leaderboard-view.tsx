"use client";

import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { ClaimPrompt } from "@/components/ClaimPrompt";
import { PrizeStrip } from "@/components/PrizeStrip";
import { leaderboard, now } from "@/lib/game";
import { useGame } from "@/lib/store";

const MEDALS = ["🥇", "🥈", "🥉"];
const PLACES = ["1st", "2nd", "3rd"];

export function LeaderboardView() {
  const game = useGame();
  if (!game) return <div className="h-96 animate-pulse rounded-lg bg-surface" aria-busy="true" aria-label="Loading leaderboard" />;

  const at = now(game);
  const d = new Date(at);
  const month = d.toLocaleString("en-US", { month: "long" });
  const daysLeft = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
  const rows = leaderboard(game, at);
  const youIndex = rows.findIndex((r) => r.isYou);
  const you = rows[youIndex];
  const toPrize = youIndex < 3 ? 0 : rows[2].correct - you.correct + 1;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-observed">
          {month} · {daysLeft === 0 ? "last day" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Most right this month</h1>
        <p className="text-muted">Ranked by correct predictions. Ties go to whoever won more tokens. Scores reset on the 1st.</p>
      </header>

      <PrizeStrip />

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          You&apos;re <strong className="font-mono">#{youIndex + 1}</strong> of {rows.length}
          {toPrize > 0 ? (
            <>
              . Call <strong className="text-observed">{toPrize} more</strong> right to reach the prize zone.
            </>
          ) : (
            <>
              , in <strong className="text-win">prize position</strong>. Hold it until the end of {month}.
            </>
          )}
        </p>
        <ButtonLink href="/" className="shrink-0">
          Make a prediction
        </ButtonLink>
      </Card>

      {!game.username && <ClaimPrompt />}

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {month} leaderboard: rank, player, correct predictions, and net tokens won
          </caption>
          <thead className="bg-surface-2 font-mono text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-4 py-2">Rank</th>
              <th scope="col" className="px-4 py-2">Player</th>
              <th scope="col" className="px-4 py-2 text-right">Right calls</th>
              <th scope="col" className="hidden px-4 py-2 text-right sm:table-cell">Net tokens</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.isYou ? "you" : r.username}
                className={`border-t border-line ${r.isYou ? "bg-observed/10 font-semibold" : i < 3 ? "bg-surface" : ""}`}
                aria-current={r.isYou ? "true" : undefined}
              >
                <td className="px-4 py-2.5 font-mono">
                  {i < 3 ? (
                    <>
                      <span aria-hidden="true">{MEDALS[i]}</span>
                      <span className="sr-only">{PLACES[i]} place</span>
                    </>
                  ) : (
                    i + 1
                  )}
                </td>
                <td className="px-4 py-2.5 font-mono">
                  {r.isYou ? (
                    <span className="text-observed">
                      {game.username ? `@${r.username}` : "You"} <span className="font-sans text-xs text-muted">(you)</span>
                    </span>
                  ) : (
                    `@${r.username}`
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums">{r.correct}</td>
                <td className="hidden px-4 py-2.5 text-right font-mono tabular-nums sm:table-cell">
                  {r.netTokens >= 0 ? "+" : "−"}
                  {Math.abs(r.netTokens)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Preview: the other players are simulated until accounts launch. Your own score is real and saved on this device.
        Prize claims will require identity verification. Free to play, and no purchase is ever necessary.
      </p>
    </div>
  );
}
