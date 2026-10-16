import type { ComponentProps } from "react";

type ChipProps = ComponentProps<"button"> & { pressed: boolean };

/** Toggle chip for filters. Uses aria-pressed so the selected state is announced. */
export function Chip({ pressed, className = "", ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
        pressed
          ? "border-observed bg-observed text-on-observed"
          : "border-line-strong text-muted hover:border-observed hover:text-ink"
      } ${className}`}
      {...props}
    />
  );
}
