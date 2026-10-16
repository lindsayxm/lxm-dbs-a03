"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ErrorText } from "@/components/ErrorText";
import { Field } from "@/components/Field";
import { RadioGroup } from "@/components/RadioGroup";
import { TokenBadge } from "@/components/TokenBadge";
import { CATEGORY_LABELS, parseCategory, timeLeft } from "@/lib/format";
import {
  getInstance,
  now,
  openEvents,
  outcomeOf,
  payoutFor,
  placePrediction,
  predictionFor,
  validateChoice,
  validateWager,
  type EventInstance,
  type GameState,
  type Prediction,
} from "@/lib/game";
import { act, setFlash, useGame } from "@/lib/store";

const QUICK_WAGERS = [10, 25, 50];

export function PredictView() {
  const game = useGame();
  const { id } = useParams<{ id: string }>();
  const cat = parseCategory(useSearchParams().get("cat") ?? undefined);

  const back = (
    <Link href={cat ? `/?cat=${cat}` : "/"} className="text-sm text-observed underline-offset-4 hover:underline">
      <span aria-hidden="true">←</span> {cat ? `Back to ${CATEGORY_LABELS[cat]} events` : "Back to all events"}
    </Link>
  );

  if (!game) return <PredictSkeleton />;

  const event = getInstance(decodeURIComponent(id), game.firstVisitAt);
  if (!event) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <EmptyState level={1} title="We couldn't find that event" action={<ButtonLink href="/">See open events</ButtonLink>}>
          The link may be mistyped, or the event may no longer exist.
        </EmptyState>
      </div>
    );
  }

  const at = now(game);
  const prediction = predictionFor(game, event.instanceId);

  return (
    <div className="flex flex-col gap-6">
      {back}
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          {CATEGORY_LABELS[event.category]} · Trial #{event.trial + 1} ·{" "}
          {event.closesAt > at ? `Closes in ${timeLeft(event.closesAt - at)}` : "Closed"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{event.title}</h1>
        <p className="text-muted">{event.blurb}</p>
      </header>

      {prediction ? (
        <YourPick event={event} prediction={prediction} />
      ) : event.closesAt <= at ? (
        <ClosedNotice event={event} game={game} />
      ) : (
        <PredictForm key={event.instanceId} event={event} tokens={game.tokens} />
      )}
    </div>
  );
}

function PredictForm({ event, tokens }: { event: EventInstance; tokens: number }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const wagerRef = useRef<HTMLInputElement>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [wager, setWager] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Errors appear after the first submit, then update as the person fixes them.
  const choiceError = submitted ? validateChoice(choice) : null;
  const wagerError = submitted ? validateWager(wager, tokens) : null;
  const validWager = validateWager(wager, tokens) === null ? Number(wager) : null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const cErr = validateChoice(choice);
    const wErr = validateWager(wager, tokens);
    if (cErr) {
      formRef.current?.querySelector<HTMLInputElement>('input[name="outcome"]')?.focus();
      return;
    }
    if (wErr) {
      wagerRef.current?.focus();
      return;
    }
    const amount = Number(wager);
    act((s, at) => placePrediction(s, event.instanceId, choice!, amount, at));
    setFlash(`Prediction placed: ${event.options[choice!]} for ${amount} tokens.`);
    router.push("/predictions");
  }

  return (
    <Card className="p-5">
      <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <RadioGroup
          legend="What happens?"
          name="outcome"
          value={choice === null ? "" : String(choice)}
          onChange={(v) => setChoice(Number(v))}
          error={choiceError ?? undefined}
          options={event.options.map((label, i) => ({ value: String(i), label, detail: `Crowd ${event.crowd[i]}%` }))}
        />

        <div className="flex flex-col gap-2">
          <Field
            ref={wagerRef}
            label="Wager (tokens)"
            name="wager"
            inputMode="numeric"
            autoComplete="off"
            value={wager}
            onChange={(e) => setWager(e.target.value)}
            error={wagerError ?? undefined}
            hint={
              validWager ? (
                <>
                  If you&apos;re right, you get <TokenBadge amount={payoutFor(validWager)} unit /> back (+{validWager * 2}). You
                  have <TokenBadge amount={tokens} unit />.
                </>
              ) : (
                <>
                  You have <TokenBadge amount={tokens} unit />. A right call pays double your wager.
                </>
              )
            }
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick wager amounts">
            {QUICK_WAGERS.filter((n) => n <= tokens).map((n) => (
              <Button key={n} variant="secondary" className="px-3 py-1.5 font-mono text-xs" onClick={() => setWager(String(n))}>
                {n}
              </Button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full sm:w-auto sm:self-start">
          Place prediction
        </Button>
      </form>
    </Card>
  );
}

function YourPick({ event, prediction }: { event: EventInstance; prediction: Prediction }) {
  const r = prediction.result;
  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="font-semibold">Your prediction</h2>
      <p>
        You picked <strong>{event.options[prediction.choice]}</strong> for <TokenBadge amount={prediction.wager} unit />.
      </p>
      {r ? (
        <p className={r.won ? "text-win" : "text-loss"}>
          <span aria-hidden="true">{r.won ? "▲" : "▼"}</span> {r.won ? "Won" : "Lost"}: the outcome was{" "}
          {event.options[outcomeOf(event)]}.
        </p>
      ) : (
        <p className="text-open">
          <span aria-hidden="true">◌</span> Open. The outcome will be observed when this event closes.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/predictions" variant="secondary">
          My predictions
        </ButtonLink>
        <ButtonLink href="/">Predict another event</ButtonLink>
      </div>
    </Card>
  );
}

function ClosedNotice({ event, game }: { event: EventInstance; game: GameState }) {
  const next = openEvents(game).find((e) => e.id === event.id);
  return (
    <Card className="flex flex-col gap-4 p-5">
      <ErrorText id="closed">This event has closed. Pick another one.</ErrorText>
      <div className="flex flex-wrap gap-3">
        {next && <ButtonLink href={`/events/${next.instanceId}`}>Go to Trial #{next.trial + 1}</ButtonLink>}
        <ButtonLink href="/" variant="secondary">
          See open events
        </ButtonLink>
      </div>
    </Card>
  );
}

export function PredictSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading event">
      <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
      <div className="h-9 w-3/4 animate-pulse rounded bg-surface-2" />
      <div className="h-64 animate-pulse rounded-lg bg-surface" />
    </div>
  );
}
