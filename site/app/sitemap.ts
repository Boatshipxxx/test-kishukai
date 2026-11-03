import type { MetadataRoute } from "next"
import { LOCALES, languageAlternates, localePath, siteUrl } from "@/lib/i18n"

/** 公開ページ（日本語・韓国語）。管理画面と API は含めない */
const PATHS = ["/", "/tournaments"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const abs = (p: string) => `${base}${p === "/" ? "" : p}` || base
  return PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, path)) || base + "/",
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? (locale === "ja" ? 1 : 0.8) : 0.6,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([k, p]) => [k, abs(p)]),
        ),
      },
    })),
  )
}
