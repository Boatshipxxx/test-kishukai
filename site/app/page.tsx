import type { Metadata } from "next"
import HomePage from "@/components/HomePage"
import { getContent } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("ja")
  return pageMetadata({ locale: "ja", path: "/", title: c.site.title, description: c.site.description })
}

export default function Page() {
  return <HomePage locale="ja" />
}
