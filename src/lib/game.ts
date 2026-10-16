// Pure game rules. No storage or React here, so it's easy to reason about and test.
import { EVENTS, getTemplate, type EventTemplate } from "../data/events";
import { RIVALS } from "../data/rivals";

export const STARTING_TOKENS = 100;
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export type Prediction = {
  /** Instance id, e.g. "comets-peaks~0" (template id + trial index). */
  eventId: string;
  choice: number;
  wager: number;
  placedAt: number;
  result?: { won: boolean; payout: number; resolvedAt: number };
};

export type Report = {
  at: number;
  bonus: number;
  streak: number;
  resolved: string[];
  seen: boolean;
};

export type GameState = {
  v: 1;
  username?: string;
  tokens: number;
  firstVisitAt: number;
  lastVisitAt: number;
  streak: number;
  /** Local calendar day (YYYY-MM-DD) the last daily bonus covered. */
  lastBonusDay: string;
  predictions: Prediction[];
  /** Dev clock: days added to the real time ("Simulate tomorrow"). */
  devOffsetDays: number;
  report?: Report;
};

// ---------- time ----------

export function now(state: Pick<GameState, "devOffsetDays">) {
  return Date.now() + state.devOffsetDays * DAY_MS;
}

export function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(fromKey: string, toKey: string) {
  const [a, b] = [fromKey, toKey].map((k) => {
    const [y, m, d] = k.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  });
  return Math.round((b - a) / DAY_MS);
}

// ---------- events ----------

export type EventInstance = EventTemplate & {
  instanceId: string;
  trial: number;
  closesAt: number;
};

function instance(t: EventTemplate, trial: number, firstVisitAt: number): EventInstance {
  return {
    ...t,
    instanceId: `${t.id}~${trial}`,
    trial,
    closesAt: firstVisitAt + t.closesAfterHours * HOUR_MS + trial * WEEK_MS,
  };
}

/** The one open trial of each event right now (a new trial opens as the last one closes). */
export function openEvents(state: GameState, at = now(state)): EventInstance[] {
  return EVENTS.map((t) => {
    const first = state.firstVisitAt + t.closesAfterHours * HOUR_MS;
    const trial = at < first ? 0 : Math.floor((at - first) / WEEK_MS) + 1;
    return instance(t, trial, state.firstVisitAt);
  }).sort((a, b) => a.closesAt - b.closesAt);
}

export function getInstance(instanceId: string, firstVisitAt: number): EventInstance | undefined {
  const [id, trialStr] = instanceId.split("~");
  const t = getTemplate(id);
  const trial = Number(trialStr);
  if (!t || !Number.isInteger(trial) || trial < 0) return undefined;
  return instance(t, trial, firstVisitAt);
}

/** FNV-1a hash with a murmur3 finalizer (so similar ids spread evenly), mapped to [0, 1). */
function hash01(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 2 ** 32;
}

/** The hidden outcome: fixed per instance, weighted by the crowd split. */
export function outcomeOf(e: EventInstance) {
  let r = hash01(e.instanceId) * 100;
  for (let i = 0; i < e.crowd.length; i++) {
    r -= e.crowd[i];
    if (r < 0) return i;
  }
  return e.crowd.length - 1;
}

export function crowdLabel(pct: number) {
  if (pct >= 80) return "Very likely";
  if (pct >= 60) return "Likely";
  if (pct > 40) return "Toss-up";
  if (pct > 20) return "Unlikely";
  return "Long shot";
}

// ---------- tokens ----------

/** Daily streak bonus: +10, +15, +20, then +25 max. */
export function bonusFor(streak: number) {
  return Math.min(10 + 5 * (streak - 1), 25);
}

/** A win returns the wager plus 2× the wager. */
export function payoutFor(wager: number) {
  return wager * 3;
}

// ---------- state transitions ----------

export function newGame(at: number): GameState {
  return {
    v: 1,
    tokens: STARTING_TOKENS,
    firstVisitAt: at,
    lastVisitAt: at,
    streak: 1,
    lastBonusDay: dayKey(at),
    predictions: [],
    devOffsetDays: 0,
  };
}

/** Run on every load and clock change: pay the daily bonus and settle closed events. */
export function visit(state: GameState, at = now(state)): GameState {
  let { tokens, streak, lastBonusDay } = state;

  let bonus = 0;
  const today = dayKey(at);
  const gap = daysBetween(lastBonusDay, today);
  if (gap > 0) {
    streak = gap === 1 ? streak + 1 : 1;
    bonus = bonusFor(streak);
    tokens += bonus;
    lastBonusDay = today;
  }

  const resolved: string[] = [];
  const predictions = state.predictions.map((p) => {
    if (p.result) return p;
    const e = getInstance(p.eventId, state.firstVisitAt);
    if (!e || e.closesAt > at) return p;
    const won = outcomeOf(e) === p.choice;
    const payout = won ? payoutFor(p.wager) : 0;
    tokens += payout;
    resolved.push(p.eventId);
    return { ...p, result: { won, payout, resolvedAt: e.closesAt } };
  });

  const changed = bonus > 0 || resolved.length > 0;
  return {
    ...state,
    tokens,
    streak,
    lastBonusDay,
    predictions,
    lastVisitAt: at,
    report: changed ? mergeReport(state.report, { at, bonus, streak, resolved, seen: false }) : state.report,
  };
}

/** If the last report hasn't been seen yet, add to it instead of replacing it. */
function mergeReport(prev: Report | undefined, next: Report): Report {
  if (!prev || prev.seen) return next;
  return { ...next, bonus: prev.bonus + next.bonus, resolved: [...prev.resolved, ...next.resolved] };
}

/** Numbers behind the collapse report, shared by /report and the home panel. */
export function summarizeReport(state: GameState) {
  const report = state.report;
  if (!report) return null;
  const rows = report.resolved.flatMap((id) => {
    const p = state.predictions.find((x) => x.eventId === id);
    const e = getInstance(id, state.firstVisitAt);
    return p?.result && e ? [{ p, e }] : [];
  });
  const won = rows.filter((r) => r.p.result!.won).length;
  const net = report.bonus + rows.reduce((sum, r) => sum + r.p.result!.payout - r.p.wager, 0);
  return { report, rows, won, lost: rows.length - won, net };
}

export function markReportSeen(state: GameState): GameState {
  return state.report && !state.report.seen ? { ...state, report: { ...state.report, seen: true } } : state;
}

export function predictionFor(state: GameState, instanceId: string) {
  return state.predictions.find((p) => p.eventId === instanceId);
}

export function placePrediction(state: GameState, instanceId: string, choice: number, wager: number, at = now(state)): GameState {
  return {
    ...state,
    tokens: state.tokens - wager,
    predictions: [...state.predictions, { eventId: instanceId, choice, wager, placedAt: at }],
  };
}

// ---------- validation (messages say what to do next) ----------

export function validateChoice(choice: number | null) {
  return choice === null ? "Choose an outcome to predict." : null;
}

export function validateWager(raw: string, tokens: number) {
  const s = raw.trim();
  if (s === "") return "Enter how many tokens to wager, like 10.";
  if (!/^\d+$/.test(s)) return "Enter a whole number of tokens, like 10.";
  const n = Number(s);
  if (n < 1) return "Wager at least 1 token.";
  if (tokens < 1) return "You're out of tokens. Come back tomorrow for your daily bonus.";
  if (n > tokens) return `You have ${tokens} tokens. Wager ${tokens} or less.`;
  return null;
}

export function validateUsername(raw: string) {
  const s = raw.trim();
  if (s === "") return "Enter a username.";
  if (!/^[A-Za-z0-9_]{3,20}$/.test(s)) return "Use 3–20 letters, numbers, or underscores.";
  if (RIVALS.some((r) => r.username.toLowerCase() === s.toLowerCase())) {
    return `${s} is taken by a rival. Try another, like ${s.slice(0, 14)}_${Math.floor(hash01(s) * 90 + 10)}.`;
  }
  return null;
}

// ---------- monthly leaderboard ----------

export type Standing = { username: string; correct: number; netTokens: number; isYou: boolean };

export function monthlyStats(state: GameState, at = now(state)) {
  const d = new Date(at);
  const inMonth = state.predictions.filter((p) => {
    if (!p.result) return false;
    const r = new Date(p.result.resolvedAt);
    return r.getFullYear() === d.getFullYear() && r.getMonth() === d.getMonth();
  });
  const correct = inMonth.filter((p) => p.result!.won).length;
  const netTokens = inMonth.reduce((sum, p) => sum + p.result!.payout - p.wager, 0);
  return { resolved: inMonth.length, correct, netTokens };
}

export function leaderboard(state: GameState, at = now(state)): Standing[] {
  const day = new Date(at).getDate();
  const you = monthlyStats(state, at);
  const rows: Standing[] = [
    ...RIVALS.map((r) => ({
      username: r.username,
      correct: Math.round(r.pace * day),
      netTokens: Math.round(r.tokensPace * day),
      isYou: false,
    })),
    { username: state.username ?? "you", correct: you.correct, netTokens: you.netTokens, isYou: true },
  ];
  return rows.sort((a, b) => b.correct - a.correct || b.netTokens - a.netTokens || Number(b.isYou) - Number(a.isYou));
}

export const _test = { daysBetween, hash01 };
