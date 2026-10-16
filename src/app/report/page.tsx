import type { Metadata } from "next";
import { ReportView } from "./report-view";

export const metadata: Metadata = { title: "While you were away · The Observer Effect" };

export default function ReportPage() {
  return <ReportView />;
}
