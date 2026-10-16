import { ButtonLink } from "./Button";
import { Card } from "./Card";

/** Shown once someone has made a prediction but hasn't picked a name. */
export function ClaimPrompt() {
  return (
    <Card className="flex flex-col gap-3 border-observed sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold">Claim your spot on the leaderboard</h2>
        <p className="text-sm text-muted">Pick a username so your right calls count toward this month&apos;s prize.</p>
      </div>
      <ButtonLink href="/claim" className="shrink-0">
        Claim a username
      </ButtonLink>
    </Card>
  );
}
