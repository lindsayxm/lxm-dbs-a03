import { Suspense } from "react";
import { ObserveSkeleton, ObserveView } from "./observe-view";

export default function ObservePage() {
  return (
    <Suspense fallback={<ObserveSkeleton />}>
      <ObserveView />
    </Suspense>
  );
}
