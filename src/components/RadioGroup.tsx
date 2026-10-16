"use client";

import { useId, type ReactNode } from "react";
import { ErrorText } from "./ErrorText";

export type RadioOption = { value: string; label: string; detail?: ReactNode };

type RadioGroupProps = {
  legend: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

/** Native radios in a fieldset, so arrow keys and screen readers work for free. */
export function RadioGroup({ legend, name, options, value, onChange, error, disabled }: RadioGroupProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <fieldset aria-describedby={errorId} aria-invalid={error ? true : undefined} disabled={disabled}>
      <legend className="mb-1.5 text-sm font-semibold text-ink">{legend}</legend>
      {error && (
        <div className="mb-2">
          <ErrorText id={errorId!}>{error}</ErrorText>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-observed ${
                checked ? "border-observed bg-observed/10" : error ? "border-loss" : "border-line-strong hover:bg-surface-2"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="size-4 shrink-0 appearance-none rounded-full border-2 border-line-strong bg-surface checked:border-observed checked:bg-observed checked:shadow-[inset_0_0_0_3px_var(--color-surface)] focus-visible:outline-none"
              />
              <span className="flex-1 font-medium">{opt.label}</span>
              {opt.detail && <span className="text-sm text-muted">{opt.detail}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
