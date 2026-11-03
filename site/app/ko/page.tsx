import type { Metadata } from "next"
import HomePage from "@/components/HomePage"
import { getContent } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("ko")
  return pageMetadata({ locale: "ko", path: "/", title: c.site.title, description: c.site.description })
}

export default function Page() {
  return <HomePage locale="ko" />
}
