import type { Metadata } from "next";
import { Suspense } from "react";
import { PredictionsSkeleton, PredictionsView } from "./predictions-view";

export const metadata: Metadata = { title: "My predictions · The Observer Effect" };

export default function PredictionsPage() {
  return (
    <Suspense fallback={<PredictionsSkeleton />}>
      <PredictionsView />
    </Suspense>
  );
}
