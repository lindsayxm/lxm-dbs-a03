import Link from "next/link";
import { outcomeOf, type EventInstance, type Prediction } from "@/lib/game";
import { CATEGORY_LABELS, timeLeft } from "@/lib/format";
import { TokenBadge } from "./TokenBadge";

/** One prediction: open (amber ◌), won (green ▲) or lost (red ▼), always with words. */
export function PredictionRow({ event, prediction, at }: { event: EventInstance; prediction: Prediction; at: number }) {
  const r = prediction.result;

  return (
    <li className={r ? "animate-collapse" : undefined}>
      <Link
        href={`/events/${event.instanceId}`}
        className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-observed sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {CATEGORY_LABELS[event.category]} · Trial #{event.trial + 1}
          </span>
          <span className="font-semibold leading-snug">{event.title}</span>
          <span className="text-sm text-muted">
            You picked <span className="text-ink">{event.options[prediction.choice]}</span> ·{" "}
            <TokenBadge amount={prediction.wager} />
            {r && !r.won && <> · Outcome: {event.options[outcomeOf(event)]}</>}
          </span>
        </div>
        <Status prediction={prediction} closesIn={timeLeft(event.closesAt - at)} />
      </Link>
    </li>
  );
}

function Status({ prediction, closesIn }: { prediction: Prediction; closesIn: string }) {
  const r = prediction.result;
  if (!r) {
    return (
      <span className="shrink-0 font-mono text-sm text-open">
        <span aria-hidden="true">◌</span> Open · {closesIn} left
      </span>
    );
  }
  return r.won ? (
    <span className="shrink-0 font-mono text-sm font-semibold text-win">
      <span aria-hidden="true">▲</span> Won +{r.payout - prediction.wager}
    </span>
  ) : (
    <span className="shrink-0 font-mono text-sm font-semibold text-loss">
      <span aria-hidden="true">▼</span> Lost −{prediction.wager}
    </span>
  );
}
