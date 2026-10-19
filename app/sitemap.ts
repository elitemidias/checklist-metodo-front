import { OFFICIAL_URL } from "@/lib/funnel";
export default function sitemap() {
  return [
    {
      url: OFFICIAL_URL + "/",
      lastModified: new Date("2026-10-19"),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];
}
