import { getContent } from "@/lib/content"
import Photo from "@/components/Photo"
import ProgramSection from "@/components/ProgramSection"
import FaqSection from "@/components/FaqSection"
import { GhostButton, GoldButton, Logo, SectionHead } from "@/components/ui"

export const revalidate = 0

export default async function Home() {
  const c = await getContent()

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="mx-auto max-w-[1240px] flex items-center justify-between px-4 h-16">
          <a href="#top" className="flex items-center gap-3">
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
                href={item.href}
                className="font-display text-sm uppercase tracking-wide px-4 py-2 border-l border-white/15 hover:bg-gold hover:text-black transition-colors duration-150"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#trial"
              className="font-display text-sm uppercase tracking-wide px-5 py-2 ml-3 bg-gold text-black hover:bg-white transition-colors duration-150"
            >
              {c.site.ctaLabel}
            </a>
          </nav>
          <a
            href="#trial"
            className="lg:hidden font-display uppercase bg-gold text-black px-3 py-1.5 text-sm"
          >
            {c.site.ctaLabel}
          </a>
        </div>
      </header>

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
              <GoldButton href="#trial">{c.hero.ctaPrimary}</GoldButton>
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
      {c.program.visible ? <ProgramSection data={c.program} /> : null}

      {/* 料金 */}
      {c.price.visible ? (
        <section id="price" className="bg-fog border-y border-black/15">
          <div className="mx-auto max-w-[1240px] px-4 py-16">
            <SectionHead en={c.price.eyebrow} ja={c.price.title} lead={c.price.lead} />
            <div className="grid gap-px bg-black/15 border border-black/15 md:grid-cols-3">
              {c.price.plans.map((p) => (
                <div
                  key={p.name}
                  className={"p-7 flex flex-col " + (p.featured ? "bg-black text-white" : "bg-white")}
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
                        いちばん人気
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-3">{p.name}</h3>
                  <p className="font-display text-4xl font-bold mt-4 tabular-nums">{p.price}</p>
                  <p
                    className={
                      "mt-1 font-display text-sm " + (p.featured ? "text-gold" : "text-black/50")
                    }
                  >
                    {p.monthly}
                  </p>
                  <p
                    className={
                      "mt-4 text-sm leading-relaxed " + (p.featured ? "text-white/70" : "text-black/60")
                    }
                  >
                    {p.note}
                  </p>
                </div>
              ))}
            </div>
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
              <GoldButton>{c.cta.primaryLabel}</GoldButton>
              <GhostButton onDark>{c.cta.secondaryLabel}</GhostButton>
            </div>
          </div>
        </section>
      ) : null}

      {/* フッター */}
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
                        href="#"
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
                  href="#"
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
    </div>
  )
}
