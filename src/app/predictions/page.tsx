import { Suspense } from "react";
import { PredictionsSkeleton, PredictionsView } from "./predictions-view";

export default function PredictionsPage() {
  return (
    <Suspense fallback={<PredictionsSkeleton />}>
      <PredictionsView />
    </Suspense>
  );
}
