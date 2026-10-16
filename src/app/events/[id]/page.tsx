import { Suspense } from "react";
import { PredictSkeleton, PredictView } from "./predict-view";

export default function EventPage() {
  return (
    <Suspense fallback={<PredictSkeleton />}>
      <PredictView />
    </Suspense>
  );
}
