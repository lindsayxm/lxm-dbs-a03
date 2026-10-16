"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, type Category } from "@/data/events";
import { Chip } from "@/components/Chip";
import { EventCard } from "@/components/EventCard";
import { PrizeStrip } from "@/components/PrizeStrip";
import { TokenBadge } from "@/components/TokenBadge";
import { CATEGORY_LABELS, parseCategory } from "@/lib/format";
import { now, openEvents, predictionFor } from "@/lib/game";
import { useGame } from "@/lib/store";

export function ObserveView() {
  const game = useGame();
  const router = useRouter();
  const category = parseCategory(useSearchParams().get("cat") ?? undefined);

  if (!game) return <ObserveSkeleton />;

  const at = now(game);
  const events = openEvents(game, at).filter((e) => !category || e.category === category);
  const isNew = game.predictions.length === 0;
  const backQuery = category ? `?cat=${category}` : "";

  const setCategory = (c: Category | null) => router.replace(c ? `/?cat=${c}` : "/", { scroll: false });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          You have <TokenBadge amount={game.tokens} unit className="text-observed" />. What happens next?
        </h1>
        <p className="max-w-xl text-muted">
          {isNew
            ? "Pick an event, call the outcome, and wager some tokens. Call it right and you win double your wager. Nothing is decided until it's observed."
            : "Your open predictions are marked below. New trials open as soon as the last ones close."}
        </p>
      </header>

      <PrizeStrip />

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        <Chip pressed={!category} onClick={() => setCategory(null)}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} pressed={category === c} onClick={() => setCategory(c)}>
            {CATEGORY_LABELS[c]}
          </Chip>
        ))}
      </div>

      <section aria-labelledby="events-heading">
        <h2 id="events-heading" className="sr-only">
          {category ? `${CATEGORY_LABELS[category]} events` : "All events"}, closing soonest first
        </h2>
        <ul className="flex flex-col gap-3">
          {events.map((e) => (
            <EventCard key={e.instanceId} event={e} at={at} prediction={predictionFor(game, e.instanceId)} backQuery={backQuery} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export function ObserveSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading events">
      <div className="h-10 w-3/4 animate-pulse rounded bg-surface-2" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-lg bg-surface" />
      ))}
    </div>
  );
}
