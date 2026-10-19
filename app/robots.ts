import { OFFICIAL_URL } from "@/lib/funnel";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: OFFICIAL_URL + "/sitemap.xml",
    host: OFFICIAL_URL,
  };
}
