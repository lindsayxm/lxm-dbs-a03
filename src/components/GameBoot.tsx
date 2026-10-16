"use client";

import { useEffect } from "react";
import { boot } from "@/lib/store";

/** Loads the saved game once per page load. */
export function GameBoot() {
  useEffect(boot, []);
  return null;
}
