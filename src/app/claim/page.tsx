import type { Metadata } from "next";
import { ClaimView } from "./claim-view";

export const metadata: Metadata = { title: "Claim a username · The Observer Effect" };

export default function ClaimPage() {
  return <ClaimView />;
}
