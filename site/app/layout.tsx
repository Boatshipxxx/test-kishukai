import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, LANGUAGE_NAMES, isLocale, siteUrl } from "@/lib/i18n"
import { isIndexable } from "@/lib/indexing"
import "./globals.css"

export function generateMetadata(): Metadata {
  const index = isIndexable()
  return {
    metadataBase: new URL(siteUrl()),
    robots: { index, follow: index },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const v = h.get("x-locale")
  const locale = isLocale(v) ? v : DEFAULT_LOCALE
  return (
    <html lang={LANGUAGE_NAMES[locale].htmlLang}>
      <body>{children}</body>
    </html>
  )
}
