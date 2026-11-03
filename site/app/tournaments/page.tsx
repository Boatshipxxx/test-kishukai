import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getContent } from "@/lib/content"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { SectionHead } from "@/components/ui"
import { igUsername, safeExternalUrl, type Tournament } from "@/lib/types"

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent()
  return {
    title: `${c.tournaments.title} | ${c.site.name}`,
    description: c.tournaments.lead,
  }
}

/** 列の定義。表（PC）とカード（スマホ）で同じ見出しを使う */
const COLUMNS: { key: keyof Tournament; label: string }[] = [
  { key: "date", label: "開催日程" },
  { key: "name", label: "大会名" },
  { key: "venue", label: "会場" },
  { key: "age", label: "対象年齢" },
  { key: "url", label: "詳細" },
]

function DetailLink({ url, name }: { url: string; name: string }) {
  const href = safeExternalUrl(url)
  if (!href) {
    return (
      <span className="text-black/30" aria-label="詳細ページなし">
        -
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} の詳細を見る（新しいタブで開きます）`}
      className="inline-flex items-center gap-1.5 font-display text-sm whitespace-nowrap border-b border-black hover:text-black/50 hover:border-black/30 transition-colors duration-150"
    >
      詳細を見る
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" />
      </svg>
    </a>
  )
}

export default async function TournamentsPage() {
  const c = await getContent()
  const t = c.tournaments
  if (!t.visible) notFound()

  const ig = igUsername(c.site.instagram)
  const igUrl = ig ? `https://www.instagram.com/${ig}/` : ""
  const trialHref = c.recruit.visible ? "#recruit" : "#trial"

  return (
    <div className="min-h-screen bg-white text-black">
      <SiteHeader c={c} trialHref={trialHref} home={false} />

      <main className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHead en={t.eyebrow} ja={t.title} lead={t.lead} />

        {t.items.length === 0 ? (
          <p className="border border-black/15 py-16 text-center text-black/50">{t.emptyText}</p>
        ) : (
          <>
            {/* PC・タブレット: 表 */}
            <div className="hidden md:block border border-black/15 overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="font-display text-xs tracking-[0.15em] text-left px-4 py-3 font-normal border-l border-white/15 first:border-l-0"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.items.map((row, i) => (
                    <tr key={row.name + i} className="border-t border-black/15 hover:bg-fog transition-colors duration-150 align-top">
                      <td className="px-4 py-4 font-display tabular-nums whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-4 font-bold leading-relaxed">{row.name}</td>
                      <td className="px-4 py-4 leading-relaxed text-black/70">{row.venue}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{row.age}</td>
                      <td className="px-4 py-4">
                        <DetailLink url={row.url} name={row.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* スマホ: カード */}
            <ul className="md:hidden grid gap-px bg-black/15 border border-black/15">
              {t.items.map((row, i) => (
                <li key={row.name + i} className="bg-white p-5">
                  <p className="font-display text-sm tabular-nums text-black/60">{row.date}</p>
                  <h3 className="font-bold mt-1 leading-snug">{row.name}</h3>
                  <dl className="mt-3 text-sm border-t border-black/15">
                    {[
                      ["会場", row.venue],
                      ["対象年齢", row.age],
                    ].map(([label, value]) => (
                      <div key={label} className="flex border-b border-black/15 py-2">
                        <dt className="w-20 shrink-0 font-display text-xs text-black/70 pt-0.5">{label}</dt>
                        <dd className="flex-1">{value || "-"}</dd>
                      </div>
                    ))}
                    <div className="flex py-2">
                      <dt className="w-20 shrink-0 font-display text-xs text-black/70 pt-0.5">詳細</dt>
                      <dd className="flex-1">
                        <DetailLink url={row.url} name={row.name} />
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}

        {t.note ? <p className="mt-4 text-xs text-black/50 leading-relaxed">{t.note}</p> : null}
      </main>

      <SiteFooter c={c} igUrl={igUrl} />
    </div>
  )
}
