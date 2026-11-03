import { Logo } from "@/components/ui"
import type { Content } from "@/lib/types"

/** トップ以外のページでは "#about" のようなページ内リンクを "/#about" に直す。 */
export function resolveHref(href: string, home: boolean): string {
  return !home && href.startsWith("#") ? "/" + href : href
}

/** フッターのサイトマップで、実在するページへのリンク */
const FOOTER_LINKS: Record<string, string> = {
  大会情報: "/tournaments",
}

export function SiteHeader({
  c,
  trialHref,
  home = true,
}: {
  c: Content
  trialHref: string
  /** トップページかどうか（下層ページではリンクを "/#..." に直す） */
  home?: boolean
}) {
  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="mx-auto max-w-[1240px] flex items-center justify-between px-4 h-16">
        <a href={home ? "#top" : "/"} className="flex items-center gap-3">
          <Logo src={c.site.logo} size={32} />
          <span className="leading-none">
            <span className="font-display text-2xl font-bold tracking-tight">{c.site.name}</span>
            <span className="block font-display text-[9px] tracking-[0.22em] text-white/50 mt-1">
              {c.site.nameEn}
            </span>
          </span>
        </a>
        <nav className="hidden lg:flex items-center">
          {c.site.nav.map((item) => (
            <a
              key={item.label}
              href={resolveHref(item.href, home)}
              className="font-display text-sm uppercase tracking-wide px-4 py-2 border-l border-white/15 hover:bg-gold hover:text-black transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
          <a
            href={resolveHref(trialHref, home)}
            className="font-display text-sm uppercase tracking-wide px-5 py-2 ml-3 bg-gold text-black hover:bg-white transition-colors duration-150"
          >
            {c.site.ctaLabel}
          </a>
        </nav>
        <a
          href={resolveHref(trialHref, home)}
          className="lg:hidden font-display uppercase bg-gold text-black px-3 py-1.5 text-sm"
        >
          {c.site.ctaLabel}
        </a>
      </div>
    </header>
  )
}

export function SiteFooter({ c, igUrl }: { c: Content; igUrl: string }) {
  return (
    <footer className="bg-black text-white border-t border-white/15">
      <div className="mx-auto max-w-[1240px] px-4 py-14">
        <div className="flex items-center gap-3 mb-8">
          <Logo src={c.site.logo} size={40} />
          <span className="font-display text-3xl font-bold tracking-tight">{c.site.name}</span>
        </div>
        <p className="font-display uppercase tracking-[0.3em] text-gold text-sm border-b border-white/15 pb-2 mb-6">
          Site Map
        </p>
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {c.footer.columns.map((col) => (
            <div key={col.name}>
              <h4 className="font-display uppercase text-sm font-bold border-l-2 border-gold pl-2 mb-3">
                {col.name}
              </h4>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href={FOOTER_LINKS[l] ?? "#"}
                      className="text-sm text-white/60 hover:text-gold transition-colors duration-150"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-white/40 leading-relaxed">
            {c.footer.address}
            <br />
            {c.footer.tagline}
          </p>
          <div className="flex gap-2">
            {c.footer.social.map((s) => (
              <a
                key={s}
                href={s === "IG" && igUrl ? igUrl : "#"}
                {...(s === "IG" && igUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="h-9 w-9 grid place-items-center bg-white/10 font-display text-xs hover:bg-gold hover:text-black transition-colors duration-150"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-8 text-xs text-white/30 font-display tracking-wide">{c.footer.copyright}</p>
      </div>
    </footer>
  )
}
