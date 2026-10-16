import type { Metadata } from "next";
import { Suspense } from "react";
import { PredictSkeleton, PredictView } from "./predict-view";

export const metadata: Metadata = { title: "Make a prediction · The Observer Effect" };

export default function EventPage() {
  return (
    <Suspense fallback={<PredictSkeleton />}>
      <PredictView />
    </Suspense>
  );
}
