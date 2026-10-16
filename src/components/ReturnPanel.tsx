import Link from "next/link";
import { summarizeReport, type GameState } from "@/lib/game";

/** "Since you last observed…" card at the top of the home page while there's an unseen report. */
export function ReturnPanel({ game }: { game: GameState }) {
  const summary = summarizeReport(game);
  if (!summary || summary.report.seen) return null;
  const { report, rows, won, lost } = summary;

  const parts = [
    report.bonus ? `+${report.bonus} streak bonus (day ${report.streak})` : null,
    rows.length ? `${rows.length} prediction${rows.length === 1 ? "" : "s"} collapsed: ${won} won, ${lost} lost` : null,
  ].filter(Boolean);

  return (
    <section aria-labelledby="return-heading" className="animate-collapse rounded-lg border border-observed bg-observed/10 p-4">
      <h2 id="return-heading" className="font-semibold">
        Welcome back{game.username ? `, @${game.username}` : ""}. Since you last observed:
      </h2>
      <p className="mt-1 text-sm text-muted">{parts.join(" · ")}</p>
      <Link href="/report" className="mt-2 inline-block text-sm font-semibold text-observed underline-offset-4 hover:underline">
        See your report <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
