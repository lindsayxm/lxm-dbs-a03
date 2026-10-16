"use client";

import { resetGame, simulateTomorrow, useGame } from "@/lib/store";
import { Button } from "./Button";

/** Demo controls so the "coming back" flow can be tested without waiting a day. */
export function DevClock() {
  const game = useGame();
  if (!game) return null;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-sm text-muted">
        <span className="font-mono">
          Saved on this device{game.devOffsetDays > 0 && ` · Demo clock: +${game.devOffsetDays} day${game.devOffsetDays === 1 ? "" : "s"}`}
        </span>
        <span className="ml-auto flex gap-2">
          <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={simulateTomorrow}>
            Simulate tomorrow
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={() => {
              if (confirm("Erase your tokens and predictions on this device and start over?")) resetGame();
            }}
          >
            Reset
          </Button>
        </span>
      </div>
    </footer>
  );
}
