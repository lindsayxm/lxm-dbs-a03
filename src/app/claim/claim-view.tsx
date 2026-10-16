"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Field } from "@/components/Field";
import { validateUsername } from "@/lib/game";
import { act, setFlash, useGame } from "@/lib/store";

export function ClaimView() {
  const game = useGame();
  if (!game) return <div className="h-64 animate-pulse rounded-lg bg-surface" aria-busy="true" aria-label="Loading" />;
  return <ClaimForm current={game.username} />;
}

function ClaimForm({ current }: { current?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(current ?? "");
  const [submitted, setSubmitted] = useState(false);
  const error = submitted ? validateUsername(name) : null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (validateUsername(name)) {
      inputRef.current?.focus();
      return;
    }
    const username = name.trim();
    act((s) => ({ ...s, username }));
    setFlash(`Welcome, @${username}. Your right calls now count toward this month's prize.`);
    router.push("/leaderboard");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{current ? "Change your username" : "Claim your spot on the leaderboard"}</h1>
        <p className="text-muted">
          {current
            ? "Your predictions and tokens stay the same."
            : "The three people who call the most outcomes right each month win cash. Pick a name to compete. No email or password needed."}
        </p>
      </header>

      <Card className="p-5">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Field
            ref={inputRef}
            label="Username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error ?? undefined}
            hint="3–20 letters, numbers, or underscores. This is shown publicly on the leaderboard."
          />
          <Button type="submit" className="w-full">
            {current ? "Save username" : "Claim username"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-muted">
        Saved on this device only.{" "}
        <Link href="/predictions" className="text-observed underline-offset-4 hover:underline">
          Back to my predictions
        </Link>
      </p>
    </div>
  );
}
