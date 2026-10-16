"use client";

// The single localStorage-backed store. Components read it with useGame() and
// change it with act(). Every storage access is guarded: private windows and
// blocked storage fall back to an in-memory game for the session.
import { useSyncExternalStore } from "react";
import { newGame, visit, now, type GameState } from "./game";

const KEY = "observer:v1";

let cache: GameState | null = null;
const listeners = new Set<() => void>();

function read(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.v === 1 ? (parsed as GameState) : null;
  } catch {
    return null;
  }
}

function write(state: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable or full: keep playing in memory
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(state: GameState) {
  cache = state;
  write(state);
  emit();
}

/** Load (or start) the game and run the visit: daily bonus + settle closed events. */
export function boot() {
  const saved = read();
  commit(saved ? visit(saved) : newGame(Date.now()));
}

/** Apply a change. The updater gets the current state and the current (dev-adjusted) time. */
export function act(update: (state: GameState, at: number) => GameState) {
  if (!cache) return;
  commit(update(cache, now(cache)));
}

/** Dev clock: jump a day ahead, then run the visit as if coming back tomorrow. */
export function simulateTomorrow() {
  act((s) => {
    const moved = { ...s, devOffsetDays: s.devOffsetDays + 1 };
    return visit(moved, now(moved));
  });
}

export function resetGame() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  commit(newGame(Date.now()));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current game, or null before it has loaded (and always on the server). */
export function useGame() {
  return useSyncExternalStore(subscribe, () => cache, () => null);
}

// ---------- flash message: a toast that survives one client-side navigation ----------

let flash: string | null = null;
const flashListeners = new Set<() => void>();

export function setFlash(message: string | null) {
  flash = message;
  flashListeners.forEach((l) => l());
}

function subscribeFlash(listener: () => void) {
  flashListeners.add(listener);
  return () => {
    flashListeners.delete(listener);
  };
}

export function useFlash() {
  return useSyncExternalStore(subscribeFlash, () => flash, () => null);
}
