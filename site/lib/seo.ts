import type { Metadata } from "next"
import { LANGUAGE_NAMES, LOCALES, languageAlternates, localePath, type Locale } from "./i18n"

/**
 * ページごとのメタデータ。canonical と hreflang（ja / ko / x-default）、OGP の言語を揃える。
 * URL は layout.tsx の metadataBase（= siteUrl()）を基点に絶対URLへ展開される。
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale
  path: string
  title: string
  description: string
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: localePath(locale, path),
      locale: LANGUAGE_NAMES[locale].ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LANGUAGE_NAMES[l].ogLocale),
    },
  }
}
