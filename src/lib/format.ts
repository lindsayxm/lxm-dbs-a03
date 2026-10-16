import { CATEGORIES, type Category } from "../data/events";

export const CATEGORY_LABELS: Record<Category, string> = {
  sports: "Sports",
  politics: "Politics",
  world: "World",
  markets: "Markets",
  culture: "Culture",
  science: "Science",
};

export function parseCategory(value: string | string[] | undefined): Category | null {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value) ? (value as Category) : null;
}

/** "under 1h", "5h", "2d 4h" */
export function timeLeft(ms: number) {
  if (ms <= 0) return "closed";
  const hours = Math.floor(ms / 3_600_000);
  if (hours < 1) return "under 1h";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const rest = hours % 24;
  return rest ? `${days}d ${rest}h` : `${days}d`;
}
