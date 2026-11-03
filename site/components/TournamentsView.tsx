import { notFound } from "next/navigation"
import { getContent } from "@/lib/content"
import { dict, type Dict, type Locale } from "@/lib/i18n"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { SectionHead } from "@/components/ui"
import { igUsername, safeExternalUrl, type Tournament } from "@/lib/types"

/** 列の並び。見出しは言語ごとの辞書（lib/i18n.ts）から引く */
const COLUMNS: (keyof Tournament)[] = ["date", "name", "venue", "age", "url"]

function DetailLink({ url, name, t }: { url: string; name: string; t: Dict }) {
  const href = safeExternalUrl(url)
  if (!href) {
    return (
      <span className="text-black/30" aria-label={t.noDetails}>
        -
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.detailsAria(name)}
      className="inline-flex items-center gap-1.5 font-display text-sm whitespace-nowrap border-b border-black hover:text-black/50 hover:border-black/30 transition-colors duration-150"
    >
      {t.seeDetails}
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" />
      </svg>
    </a>
  )
}

/** 大会情報一覧の本体。日本語（/tournaments）と韓国語（/ko/tournaments）の両方から使う */
export default async function TournamentsView({ locale }: { locale: Locale }) {
  const c = await getContent(locale)
  const t = dict(locale)
  const tr = c.tournaments
  if (!tr.visible) notFound()

  const ig = igUsername(c.site.instagram)
  const igUrl = ig ? `https://www.instagram.com/${ig}/` : ""
  const trialHref = c.recruit.visible ? "#recruit" : "#trial"

  return (
    <div className="min-h-screen bg-white text-black">
      <SiteHeader c={c} trialHref={trialHref} home={false} locale={locale} path="/tournaments" />

      <main className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHead en={tr.eyebrow} ja={tr.title} lead={tr.lead} />

        {tr.items.length === 0 ? (
          <p className="border border-black/15 py-16 text-center text-black/50">{tr.emptyText}</p>
        ) : (
          <>
            {/* PC・タブレット: 表 */}
            <div className="hidden md:block border border-black/15 overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    {COLUMNS.map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="font-display text-xs tracking-[0.15em] text-left px-4 py-3 font-normal border-l border-white/15 first:border-l-0"
                      >
                        {t.tournamentColumns[key]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody lang="ja">
                  {tr.items.map((row, i) => (
                    <tr key={row.name + i} className="border-t border-black/15 hover:bg-fog transition-colors duration-150 align-top">
                      <td className="px-4 py-4 font-display tabular-nums whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-4 font-bold leading-relaxed">{row.name}</td>
                      <td className="px-4 py-4 leading-relaxed text-black/70">{row.venue}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{row.age}</td>
                      <td className="px-4 py-4">
                        <DetailLink url={row.url} name={row.name} t={t} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* スマホ: カード */}
            <ul className="md:hidden grid gap-px bg-black/15 border border-black/15">
              {tr.items.map((row, i) => (
                <li key={row.name + i} className="bg-white p-5">
                  <p lang="ja" className="font-display text-sm tabular-nums text-black/60">{row.date}</p>
                  <h3 lang="ja" className="font-bold mt-1 leading-snug">{row.name}</h3>
                  <dl className="mt-3 text-sm border-t border-black/15">
                    {[
                      [t.tournamentColumns.venue, row.venue],
                      [t.tournamentColumns.age, row.age],
                    ].map(([label, value]) => (
                      <div key={label} className="flex border-b border-black/15 py-2">
                        <dt className="w-20 shrink-0 font-display text-xs text-black/70 pt-0.5">{label}</dt>
                        <dd lang="ja" className="flex-1">{value || "-"}</dd>
                      </div>
                    ))}
                    <div className="flex py-2">
                      <dt className="w-20 shrink-0 font-display text-xs text-black/70 pt-0.5">{t.tournamentColumns.url}</dt>
                      <dd className="flex-1">
                        <DetailLink url={row.url} name={row.name} t={t} />
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}

        {tr.note ? <p className="mt-4 text-xs text-black/50 leading-relaxed">{tr.note}</p> : null}
      </main>

      <SiteFooter c={c} igUrl={igUrl} home={false} locale={locale} />
    </div>
  )
}
