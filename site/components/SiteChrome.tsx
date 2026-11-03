import { Logo } from "@/components/ui"
import type { Content } from "@/lib/types"
import { DEFAULT_LOCALE, LANGUAGE_NAMES, LOCALES, dict, localePath, type Locale } from "@/lib/i18n"

/**
 * サイト内リンクを現在の言語・ページに合わせて直す。
 * - "#about" … トップならそのまま、下層ページなら "/#about"（韓国語は "/ko#about"）
 * - "/tournaments" … 韓国語なら "/ko/tournaments"
 * - 外部URLはそのまま
 */
export function resolveHref(href: string, home: boolean, locale: Locale = DEFAULT_LOCALE): string {
  if (href.startsWith("#")) return home ? href : localePath(locale, "/") + href
  if (href.startsWith("/")) return localePath(locale, href)
  return href
}

/** フッターのサイトマップで、実在するページ・セクションへのリンク（日本語・韓国語の表示名どちらでも引ける） */
const FOOTER_LINKS: Record<string, string> = {
  大会情報: "/tournaments",
  "대회 정보": "/tournaments",
  アクセス: "#access",
  "오시는 길": "#access",
  料金プラン: "#price",
  "요금 플랜": "#price",
  "WTCE遠征レポート": "#world",
  "WTCE 원정 리포트": "#world",
  "五大精神と「情」": "#about",
  "5대 정신과 '정(情)'": "#about",
}

/** JP | KR の言語切り替え */
export function LanguageSwitcher({ locale, path }: { locale: Locale; path: string }) {
  const t = dict(locale)
  return (
    <div
      role="group"
      aria-label={t.languageSwitch}
      className="flex items-center border border-white/25 font-display text-xs tracking-wider"
    >
      {LOCALES.map((l, i) => {
        const active = l === locale
        return (
          <a
            key={l}
            href={localePath(l, path)}
            hrefLang={LANGUAGE_NAMES[l].htmlLang}
            lang={LANGUAGE_NAMES[l].htmlLang}
            aria-current={active ? "true" : undefined}
            title={LANGUAGE_NAMES[l].label}
            className={
              "px-2.5 py-1.5 transition-colors duration-150 " +
              (i > 0 ? "border-l border-white/25 " : "") +
              (active ? "bg-white text-black" : "text-white/70 hover:bg-gold hover:text-black")
            }
          >
            {LANGUAGE_NAMES[l].short}
          </a>
        )
      })}
    </div>
  )
}

export function SiteHeader({
  c,
  trialHref,
  home = true,
  locale = DEFAULT_LOCALE,
  path = "/",
}: {
  c: Content
  trialHref: string
  /** トップページかどうか（下層ページではリンクを "/#..." に直す） */
  home?: boolean
  locale?: Locale
  /** 言語切り替えで同じページの別言語版へ飛ばすためのパス（"/" または "/tournaments"） */
  path?: string
}) {
  const t = dict(locale)
  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="mx-auto max-w-[1240px] flex items-center justify-between gap-3 px-4 h-16">
        <a href={home ? "#top" : localePath(locale, "/")} className="flex items-center gap-3 shrink-0">
          <Logo src={c.site.logo} size={32} alt={t.logoAlt} />
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
              href={resolveHref(item.href, home, locale)}
              className="font-display text-sm uppercase tracking-wide px-3 xl:px-4 py-2 border-l border-white/15 hover:bg-gold hover:text-black transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
          <a
            href={resolveHref(trialHref, home, locale)}
            className="font-display text-sm uppercase tracking-wide px-5 py-2 ml-3 bg-gold text-black hover:bg-white transition-colors duration-150"
          >
            {c.site.ctaLabel}
          </a>
          <div className="ml-3">
            <LanguageSwitcher locale={locale} path={path} />
          </div>
        </nav>
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher locale={locale} path={path} />
          <a
            href={resolveHref(trialHref, home, locale)}
            className="font-display uppercase bg-gold text-black px-3 py-1.5 text-sm whitespace-nowrap"
          >
            {c.site.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter({
  c,
  igUrl,
  home = true,
  locale = DEFAULT_LOCALE,
}: {
  c: Content
  igUrl: string
  home?: boolean
  locale?: Locale
}) {
  const t = dict(locale)
  return (
    <footer className="bg-black text-white border-t border-white/15">
      <div className="mx-auto max-w-[1240px] px-4 py-14">
        <div className="flex items-center gap-3 mb-8">
          <Logo src={c.site.logo} size={40} alt={t.logoAlt} />
          <span className="font-display text-3xl font-bold tracking-tight">{c.site.name}</span>
        </div>
        <p className="font-display uppercase tracking-[0.3em] text-gold text-sm border-b border-white/15 pb-2 mb-6">
          {t.siteMap}
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
                      href={FOOTER_LINKS[l] ? resolveHref(FOOTER_LINKS[l], home, locale) : "#"}
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
