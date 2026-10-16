"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { ErrorText } from "./ErrorText";

type FieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
};

/** A labeled text input with an optional hint and an error that sits right under it. */
export function Field({ label, hint, error, className = "", ...inputProps }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`rounded-md border bg-surface px-3 py-2.5 font-mono text-ink placeholder:text-muted ${
          error ? "border-loss" : "border-line-strong"
        } ${className}`}
        {...inputProps}
      />
      {error && <ErrorText id={errorId!}>{error}</ErrorText>}
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
