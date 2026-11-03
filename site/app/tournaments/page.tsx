import type { Metadata } from "next"
import TournamentsView from "@/components/TournamentsView"
import { getContent } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("ja")
  return pageMetadata({
    locale: "ja",
    path: "/tournaments",
    title: `${c.tournaments.title} | ${c.site.name}`,
    description: c.tournaments.lead,
  })
}

export default function Page() {
  return <TournamentsView locale="ja" />
}
