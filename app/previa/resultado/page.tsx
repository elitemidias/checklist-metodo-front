import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ResultPreview from "./ResultPreview";
export const metadata: Metadata = {
  title: "Prévia local do resultado | Elite Mídias",
  robots: { index: false, follow: false },
};
export default function PreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ResultPreview />;
}
