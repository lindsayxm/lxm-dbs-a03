import type { Metadata } from "next";
import { LeaderboardView } from "./leaderboard-view";

export const metadata: Metadata = { title: "Leaderboard · The Observer Effect" };

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
