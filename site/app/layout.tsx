import type { Metadata } from "next"
import { getContent } from "@/lib/content"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent()
  return {
    title: c.site.title,
    description: c.site.description,
    robots: { index: false, follow: false },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
