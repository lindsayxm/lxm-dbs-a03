import Link from "next/link";
import { crowdLabel, type EventInstance, type Prediction } from "@/lib/game";
import { CATEGORY_LABELS, timeLeft } from "@/lib/format";
import { TokenBadge } from "./TokenBadge";

type EventCardProps = {
  event: EventInstance;
  at: number;
  prediction?: Prediction;
  /** Query string to carry to the event page so its back link returns to this filter. */
  backQuery?: string;
};

export function EventCard({ event, at, prediction, backQuery = "" }: EventCardProps) {
  const lead = event.crowd.indexOf(Math.max(...event.crowd));
  const closesIn = timeLeft(event.closesAt - at);

  return (
    <li>
      <Link
        href={`/events/${event.instanceId}${backQuery}`}
        className="group flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-observed"
      >
        <div className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider text-muted">
          <span>
            {CATEGORY_LABELS[event.category]} · Trial #{event.trial + 1}
          </span>
          <span>Closes in {closesIn}</span>
        </div>
        <h2 className="text-lg font-semibold leading-snug group-hover:text-observed">{event.title}</h2>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-muted">
            Crowd: {event.options[lead]} {event.crowd[lead]}% · {crowdLabel(event.crowd[lead])}
          </span>
          {prediction ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-open px-2.5 py-0.5 text-open">
              <span aria-hidden="true">◌</span> You picked {event.options[prediction.choice]} ·{" "}
              <TokenBadge amount={prediction.wager} />
            </span>
          ) : (
            <span className="font-semibold text-observed">
              Predict <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}
