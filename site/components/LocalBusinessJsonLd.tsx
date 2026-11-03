import type { Content } from "@/lib/types"
import { LANGUAGE_NAMES, localePath, siteUrl, type Locale } from "@/lib/i18n"
import { FACILITY } from "@/lib/site-info"

/**
 * 地域検索向けの構造化データ（schema.org SportsActivityLocation）。
 * 住所・対象エリアは lib/site-info.ts、方針は docs/SEO_STRATEGY.md。
 * 電話番号・座標・営業時間は未確定のため出していない（確定したら追加する）。
 */
export default function LocalBusinessJsonLd({
  c,
  locale,
  igUrl,
}: {
  c: Content
  locale: Locale
  igUrl: string
}) {
  const base = siteUrl()
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${base}/#organization`,
    name: c.site.name,
    alternateName: [c.site.nameEn, "キシュウカイ", "키슈카이"],
    description: c.site.description,
    url: `${base}${localePath(locale, "/")}`,
    inLanguage: LANGUAGE_NAMES[locale].htmlLang,
    sport: "Taekwondo",
    ...(c.site.logo ? { logo: c.site.logo, image: c.site.logo } : {}),
    address: {
      "@type": "PostalAddress",
      postalCode: FACILITY.postalCode,
      addressRegion: FACILITY.addressRegion,
      addressLocality: FACILITY.addressLocality,
      streetAddress: FACILITY.streetAddress,
      addressCountry: FACILITY.addressCountry,
    },
    areaServed: FACILITY.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    ...(igUrl ? { sameAs: [igUrl] } : {}),
  }
  return (
    <script
      type="application/ld+json"
      // JSON-LD は文字列で埋め込む。"<" をエスケープして </script> による注入を防ぐ
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
