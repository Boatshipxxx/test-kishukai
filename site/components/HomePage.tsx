import { getContent } from "@/lib/content"
import { dict, type Locale } from "@/lib/i18n"
import { mapSearchUrl } from "@/lib/site-info"
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd"
import Photo from "@/components/Photo"
import ProgramSection from "@/components/ProgramSection"
import FaqSection from "@/components/FaqSection"
import { GhostButton, GoldButton, SectionHead } from "@/components/ui"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { igUsername } from "@/lib/types"

/** トップページ本体。日本語（/）と韓国語（/ko）の両方から使う */
export default async function HomePage({ locale }: { locale: Locale }) {
  const c = await getContent(locale)
  const t = dict(locale)
  const ig = igUsername(c.site.instagram)
  const igUrl = ig ? `https://www.instagram.com/${ig}/` : ""
  const dmUrl = ig ? `https://ig.me/m/${ig}` : ""
  // 募集欄を公開している間は、体験系のボタンをすべて募集欄に集める
  const trialHref = c.recruit.visible ? "#recruit" : "#trial"

  return (
    <div className="min-h-screen bg-white text-black">
      <LocalBusinessJsonLd c={c} locale={locale} igUrl={igUrl} />
      <SiteHeader c={c} trialHref={trialHref} locale={locale} path="/" />

      {/* ヒーロー */}
      {c.hero.visible ? (
        <section id="top" className="relative bg-black text-white overflow-hidden">
          {c.hero.image ? (
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.hero.image} alt="" className="h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-25">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(720px 420px at 78% 10%, rgba(244,222,30,0.35), transparent 62%), radial-gradient(560px 400px at 8% 100%, rgba(216,35,42,0.45), transparent 62%)",
                }}
              />
            </div>
          )}
          <div className="relative mx-auto max-w-[1240px] px-4 pt-16 pb-14">
            <p className="font-display text-gold tracking-[0.3em] text-xs">{c.hero.eyebrow}</p>
            <h1 className="font-display text-[15vw] leading-[0.86] md:text-[8.5rem] font-bold uppercase mt-3">
              {c.hero.titleLine1}
              <br />
              {c.hero.titleLine2} <span className="text-gold">{c.hero.titleAccent}</span>
            </h1>
            <p className="mt-6 font-display text-xl md:text-2xl tracking-wide">{c.hero.catch}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">{c.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton href={trialHref}>{c.hero.ctaPrimary}</GoldButton>
              <GhostButton href="#world" onDark>
                {c.hero.ctaSecondary}
              </GhostButton>
            </div>
            {c.hero.stats.length ? (
              <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/15 border border-white/15">
                {c.hero.stats.map((s) => (
                  <div key={s.label} className="bg-black px-4 py-4">
                    <dt className="font-display text-[10px] tracking-[0.2em] text-gold">{s.label}</dt>
                    <dd className="mt-1.5 text-sm leading-snug">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <div className="stripes h-3" />
        </section>
      ) : null}

      {/* 3つの約束 */}
      {c.promise.visible ? (
        <section className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHead en={c.promise.eyebrow} ja={c.promise.title} lead={c.promise.lead} />
          <div className="grid gap-px bg-black/15 border border-black/15 md:grid-cols-3">
            {c.promise.items.map((item) => (
              <div key={item.kanji} className="bg-white p-7">
                <span className="inline-block bg-gold text-black font-display text-3xl font-bold leading-none px-3 py-2">
                  {item.kanji}
                </span>
                <h3 className="font-display text-xl font-bold mt-5">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/60">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 世界への挑戦 */}
      {c.world.visible ? (
        <section id="world" className="bg-black text-white">
          <div className="mx-auto max-w-[1240px] px-4 py-16">
            <SectionHead en={c.world.eyebrow} ja={c.world.title} lead={c.world.lead} invert />
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <Photo
                  src={c.world.mainImage}
                  caption={c.world.mainImage ? undefined : c.world.mainImageCaption}
                  tone="navy"
                  className="aspect-[16/9]"
                />
                {c.world.gallery.length ? (
                  <div className="grid grid-cols-3 gap-px bg-white/15 border border-white/15 border-t-0">
                    {c.world.gallery.map((g, i) => (
                      <Photo
                        key={i}
                        src={g.image}
                        caption={g.image ? undefined : g.caption}
                        tone={(["blood", "gold", "navy"] as const)[i % 3]}
                        className="aspect-square"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <p className="border-l-4 border-gold pl-5 font-display text-lg leading-relaxed">
                  {c.world.quote}
                </p>
                <dl className="mt-8 border-t border-white/15 text-sm">
                  {c.world.data.map((d) => (
                    <div key={d.label} className="flex border-b border-white/15 py-3">
                      <dt className="w-24 shrink-0 font-display uppercase text-xs tracking-wide text-gold pt-0.5">
                        {d.label}
                      </dt>
                      <dd className="flex-1 text-white/80">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                {c.world.linkLabel ? (
                  <div className="mt-7">
                    <GhostButton href="#" onDark>
                      {c.world.linkLabel}
                    </GhostButton>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* クラス一覧 */}
      {c.program.visible ? <ProgramSection data={c.program} trialHref={trialHref} igUrl={igUrl} locale={locale} /> : null}

      {/* 料金 */}
      {c.price.visible ? (
        <section id="price" className="bg-fog border-y border-black/15">
          <div className="mx-auto max-w-[1240px] px-4 py-16">
            <SectionHead en={c.price.eyebrow} ja={c.price.title} lead={c.price.lead} />
            <div
              className={
                "grid gap-px bg-black/15 border border-black/15 " +
                (c.price.plans.length === 2 ? "md:grid-cols-2" : c.price.plans.length === 1 ? "" : "md:grid-cols-3")
              }
            >
              {c.price.plans.map((p) => (
                <div
                  key={p.name}
                  className={"p-7 md:p-9 flex flex-col " + (p.featured ? "bg-black text-white" : "bg-white")}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={
                        "font-display uppercase tracking-[0.2em] text-xs " +
                        (p.featured ? "text-gold" : "text-black/50")
                      }
                    >
                      {p.en}
                    </p>
                    {p.featured ? (
                      <span className="bg-gold text-black font-display text-[10px] tracking-widest px-2 py-0.5">
                        {t.popular}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-3">{p.name}</h3>
                  <p
                    className={
                      "mt-5 flex items-baseline gap-2 border-t pt-5 " +
                      (p.featured ? "border-white/15" : "border-black/15")
                    }
                  >
                    <span className="font-display text-5xl md:text-6xl font-bold tabular-nums leading-none">
                      {p.price}
                    </span>
                    {p.monthly ? (
                      <span
                        className={
                          "font-display text-base " + (p.featured ? "text-gold" : "text-black/50")
                        }
                      >
                        {p.monthly}
                      </span>
                    ) : null}
                  </p>
                  {p.note ? (
                    <p
                      className={
                        "mt-5 text-sm leading-relaxed " + (p.featured ? "text-white/70" : "text-black/60")
                      }
                    >
                      {p.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            {c.price.discountNote ? (
              <div className="mt-px border border-black/15 border-t-0 bg-gold text-black px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
                <span className="font-display uppercase tracking-[0.2em] text-xs bg-black text-gold px-2 py-1 w-fit shrink-0">
                  {t.discount}
                </span>
                <p className="text-base font-bold leading-relaxed">{c.price.discountNote}</p>
              </div>
            ) : null}
            {c.price.showDetails && c.price.details.length ? (
              <div className="mt-px border border-black/15 border-t-0 bg-white">
                <dl className="text-sm">
                  {c.price.details.map((d) => (
                    <div
                      key={d.label}
                      className="flex border-b border-black/15 last:border-b-0 px-5 py-3"
                    >
                      <dt className="w-32 shrink-0 font-display uppercase text-xs text-black/70 pt-0.5">
                        {d.label}
                      </dt>
                      <dd className="flex-1">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {c.price.note ? <p className="mt-4 text-xs text-black/50">{c.price.note}</p> : null}
          </div>
        </section>
      ) : null}

      {/* 募集欄（Instagram DM） */}
      {c.recruit.visible ? (
        <section id="recruit" className="bg-black text-white">
          <div className="mx-auto max-w-[1240px] px-4 py-16 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-gold tracking-[0.3em] text-xs">{c.recruit.eyebrow}</p>
                {c.recruit.status ? (
                  <span className="bg-gold text-black font-display text-[11px] tracking-widest px-2 py-0.5">
                    {c.recruit.status}
                  </span>
                ) : null}
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-none mt-2">
                {c.recruit.title}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/70">{c.recruit.lead}</p>

              {c.recruit.items.length ? (
                <ul className="mt-7 grid gap-px bg-white/15 border border-white/15 sm:grid-cols-2">
                  {c.recruit.items.map((it, i) => (
                    <li
                      key={it.name + i}
                      className="bg-black flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <span className="text-sm">{it.name}</span>
                      {it.status ? (
                        <span className="font-display text-[11px] tracking-widest border border-gold text-gold px-2 py-0.5 shrink-0">
                          {it.status}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}

              {c.recruit.steps.length ? (
                <ol className="mt-7 grid gap-px bg-white/15 border border-white/15 md:grid-cols-3">
                  {c.recruit.steps.map((st, i) => (
                    <li key={st.title + i} className="bg-black p-5">
                      <p className="font-display text-gold text-2xl font-bold leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="font-display font-bold mt-3">{st.title}</p>
                      <p className="text-xs mt-2 leading-relaxed text-white/60">{st.body}</p>
                    </li>
                  ))}
                </ol>
              ) : null}

              {c.recruit.dmTemplate ? (
                <div className="mt-7 border border-white/15 p-5">
                  <p className="font-display text-xs tracking-[0.2em] text-gold">{t.dmTemplateTitle}</p>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{c.recruit.dmTemplate}</p>
                </div>
              ) : null}

              {dmUrl ? (
                <div className="mt-7">
                  <a
                    href={dmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 bg-gold text-black border border-gold hover:bg-black hover:text-gold transition-colors duration-150"
                  >
                    {c.recruit.dmLabel}
                  </a>
                  <p className="mt-2 text-xs text-white/50">{t.dmOpens(ig)}</p>
                </div>
              ) : null}
              {c.recruit.note ? <p className="mt-4 text-xs text-white/50">{c.recruit.note}</p> : null}
            </div>
            <Photo
              src={c.recruit.image}
              caption={c.recruit.image ? undefined : c.recruit.imageCaption}
              tone="blood"
              className="aspect-[4/3] border border-white/15 self-start"
            />
          </div>
        </section>
      ) : null}

      {/* 五大精神 */}
      {c.about.visible ? (
        <section id="about" className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHead en={c.about.eyebrow} ja={c.about.title} lead={c.about.lead} />
          <div className="grid gap-px bg-black/15 border border-black/15 sm:grid-cols-2 lg:grid-cols-5">
            {c.about.tenets.map((t) => (
              <div key={t.k} className="bg-white p-6 hover:bg-gold transition-colors duration-150">
                <p className="font-display text-3xl font-bold leading-none">{t.k}</p>
                <p className="font-display text-[10px] tracking-[0.2em] text-black/50 mt-2">{t.en}</p>
                <p className="text-sm mt-4 leading-relaxed">{t.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-px border border-black/15 border-t-0 bg-black text-white p-8 flex flex-col md:flex-row gap-6 items-start">
            <span className="font-display text-6xl font-bold text-gold leading-none shrink-0">情</span>
            <p className="text-sm leading-relaxed text-white/75">
              <strong className="text-white">{c.about.jungTitle}</strong>
              {c.about.jungBody}
            </p>
          </div>
        </section>
      ) : null}

      {/* Q&A */}
      {c.faq.visible ? <FaqSection data={c.faq} /> : null}

      {/* お知らせ */}
      {c.news.visible ? (
        <section id="news" className="mx-auto max-w-[1240px] px-4 py-16">
          <div className="flex items-end justify-between border-b-2 border-black pb-3 mb-2">
            <div>
              <p className="font-display text-gold tracking-[0.3em] text-xs">{c.news.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold uppercase leading-none mt-2">
                {c.news.title}
              </h2>
            </div>
            {c.news.viewAllLabel ? (
              <a
                href="#"
                className="font-display uppercase text-sm border-b border-black hover:text-black/50 hover:border-black/30 transition-colors"
              >
                {c.news.viewAllLabel}
              </a>
            ) : null}
          </div>
          <ul>
            {c.news.items.map((n, i) => (
              <li key={n.title + i} className="border-b border-black/15">
                <a
                  href={n.href || "#"}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 py-4 group hover:bg-fog transition-colors duration-150 px-1"
                >
                  <time className="font-display text-sm text-black/50 tabular-nums w-28 shrink-0">
                    {n.date}
                  </time>
                  <span className="font-display text-xs tracking-widest border border-black px-2 py-0.5 w-fit shrink-0 group-hover:bg-gold transition-colors">
                    {n.cat}
                  </span>
                  <span className="text-sm flex-1">{n.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* サポーター */}
      {c.support.visible ? (
        <section id="support" className="bg-gold text-black">
          <div className="mx-auto max-w-[1240px] px-4 py-16 grid gap-10 lg:grid-cols-[1fr_0.8fr] items-center">
            <div>
              <p className="font-display tracking-[0.3em] text-xs">{c.support.eyebrow}</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase leading-none mt-2">
                {c.support.title}
              </h2>
              <p className="mt-5 text-sm leading-relaxed">{c.support.lead}</p>
              {c.support.plans.length ? (
                <div className="mt-7 grid gap-px bg-black/20 border border-black/20 sm:grid-cols-3">
                  {c.support.plans.map((p) => (
                    <div key={p.name} className="bg-gold p-4">
                      <p className="font-display text-sm font-bold">{p.name}</p>
                      <p className="font-display text-lg font-bold mt-1 tabular-nums">{p.price}</p>
                      <p className="text-xs mt-1 text-black/60">{p.note}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="mt-7">
                <a
                  href="#trial"
                  className="inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 bg-black text-gold hover:bg-white hover:text-black transition-colors duration-150"
                >
                  {c.support.ctaLabel}
                </a>
              </div>
            </div>
            <Photo
              src={c.support.image}
              caption={c.support.image ? undefined : c.support.imageCaption}
              tone="navy"
              className="aspect-[4/3] border border-black/20"
            />
          </div>
        </section>
      ) : null}

      {/* アクセス */}
      {c.access.visible ? (
        <section id="access" className="border-t border-black/15">
          <div className="mx-auto max-w-[1240px] px-4 py-16 grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div>
              <SectionHead en={c.access.eyebrow} ja={c.access.title} lead={c.access.lead} />
            </div>
            <div className="border border-black/15">
              <dl className="text-sm">
                <div className="flex flex-col sm:flex-row border-b border-black/15 px-5 py-4 gap-1 sm:gap-0">
                  <dt className="sm:w-28 shrink-0 font-display text-xs text-black/60 pt-0.5">{t.address}</dt>
                  <dd className="flex-1">
                    <address className="not-italic font-bold leading-relaxed" lang="ja">
                      {c.access.address}
                    </address>
                    {c.access.mapLabel ? (
                      <a
                        href={mapSearchUrl(c.access.address.replace(/（[^）]*）$/, ""))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 font-display text-sm border-b border-black hover:text-black/50 hover:border-black/30 transition-colors"
                      >
                        {c.access.mapLabel} →
                      </a>
                    ) : null}
                  </dd>
                </div>
                {c.access.stations.length ? (
                  <div className="flex flex-col sm:flex-row px-5 py-4 gap-1 sm:gap-0">
                    <dt className="sm:w-28 shrink-0 font-display text-xs text-black/60 pt-0.5">{t.nearestStations}</dt>
                    <dd className="flex-1">
                      <ul className="space-y-2">
                        {c.access.stations.map((s, i) => (
                          <li key={s.name + i} className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-bold">{s.name}</span>
                            <span className="text-black/60">{s.line}</span>
                            {s.walk ? <span className="font-display text-black/60">{s.walk}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ) : null}
              </dl>
              {c.access.note ? (
                <p className="border-t border-black/15 px-5 py-3 text-xs text-black/50 leading-relaxed">{c.access.note}</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      {c.cta.visible ? (
        <section id="trial" className="bg-black text-white">
          <div className="stripes h-3" />
          <div className="mx-auto max-w-[1240px] px-4 py-16 text-center">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase leading-none">
              {c.cta.titleEn} <span className="text-gold">{c.cta.titleAccent}</span>
            </h2>
            <p className="font-display text-xl mt-4">{c.cta.titleJa}</p>
            <p className="mt-4 text-sm text-white/70 max-w-xl mx-auto leading-relaxed">{c.cta.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <GoldButton href={c.recruit.visible ? dmUrl || "#recruit" : "#trial"}>
                {c.cta.primaryLabel}
              </GoldButton>
              <GhostButton href="#program" onDark>
                {c.cta.secondaryLabel}
              </GhostButton>
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter c={c} igUrl={igUrl} locale={locale} />
    </div>
  )
}
