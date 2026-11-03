import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/i18n"
import { isIndexable } from "@/lib/indexing"

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
