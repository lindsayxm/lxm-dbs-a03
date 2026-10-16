"use client";

// Temporary component preview. Replaced by the real Observe page in the next build step.
import { useState } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { EmptyState } from "@/components/EmptyState";
import { Field } from "@/components/Field";
import { PrizeStrip } from "@/components/PrizeStrip";
import { RadioGroup } from "@/components/RadioGroup";
import { Toast } from "@/components/Toast";
import { TokenBadge } from "@/components/TokenBadge";

export default function ComponentPreview() {
  const [chip, setChip] = useState("All");
  const [choice, setChoice] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">
        You have <TokenBadge amount={100} className="text-observed" />. What happens next?
      </h1>
      <PrizeStrip />

      <div className="flex flex-wrap gap-2">
        {["All", "Sports", "Politics", "World", "Markets", "Culture", "Science"].map((c) => (
          <Chip key={c} pressed={chip === c} onClick={() => setChip(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <Card className="flex flex-col gap-5">
        <RadioGroup
          legend="Who wins?"
          name="demo"
          value={choice}
          onChange={setChoice}
          error={choice ? undefined : "Choose an outcome to predict."}
          options={[
            { value: "a", label: "Chicago Comets", detail: "Crowd 64%" },
            { value: "b", label: "Denver Peaks", detail: "Crowd 36%" },
          ]}
        />
        <Field label="Wager" inputMode="numeric" defaultValue="abc" error="Enter a whole number of tokens, like 10." hint="You have 100 tokens." />
        <Field label="Username" placeholder="quark_42" hint="3–20 letters, numbers, or underscores." />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setToast("Prediction placed")}>Place prediction</Button>
          <Button variant="secondary">Secondary</Button>
          <ButtonLink href="/" variant="ghost">
            Ghost link
          </ButtonLink>
        </div>
      </Card>

      <div className="flex flex-wrap gap-6 font-mono text-sm">
        <span className="text-open">◌ Open</span>
        <span className="text-win">▲ Won +20</span>
        <span className="text-loss">▼ Lost −10</span>
      </div>

      <EmptyState title="No predictions yet" action={<ButtonLink href="/">Make your first prediction</ButtonLink>}>
        Pick an event, choose an outcome, and wager a few tokens.
      </EmptyState>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
