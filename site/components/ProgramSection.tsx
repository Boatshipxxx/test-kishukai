"use client"

import { useMemo, useState } from "react"
import Photo from "./Photo"
import { SectionHead } from "./ui"
import type { Content } from "@/lib/types"
import { DEFAULT_LOCALE, TARGET_LABELS as ALL_TARGET_LABELS, dict, type Locale } from "@/lib/i18n"

const TONES = ["navy", "blood", "gold"] as const

export default function ProgramSection({
  data,
  trialHref = "#trial",
  igUrl = "",
  locale = DEFAULT_LOCALE,
}: {
  data: Content["program"]
  /** 開催曜日の注記からリンクするInstagramのURL */
  igUrl?: string
  /** 体験ボタンの飛び先（募集欄が公開中なら #recruit） */
  trialHref?: string
  locale?: Locale
}) {
  const t = dict(locale)
  const TARGET_LABELS = ALL_TARGET_LABELS[locale]
  const [target, setTarget] = useState<string>("all")

  const used = useMemo(() => {
    const keys = Array.from(new Set(data.items.map((i) => i.target)))
    return keys.filter((k) => k in TARGET_LABELS)
  }, [data.items])

  const filtered = useMemo(
    () => data.items.filter((c) => target === "all" || c.target === target),
    [data.items, target],
  )

  return (
    <section id="program" className="mx-auto max-w-[1240px] px-4 py-16">
      <SectionHead en={data.eyebrow} ja={data.title} lead={data.lead} />

      {data.scheduleTitle && data.days.length ? (
        <div className="mb-10">
          <div className="flex items-baseline justify-between border-b-2 border-black pb-2 mb-4">
            <h3 className="font-display text-2xl font-bold tracking-wide">{data.scheduleTitle}</h3>
            <span className="font-display uppercase text-sm text-black/60">Weekly</span>
          </div>
          <div className="grid gap-px bg-black/15 border border-black/15 sm:grid-cols-2">
            {data.days.map((d, i) => (
              <div key={d.day + i} className="bg-black text-white flex items-stretch">
                <div className="bg-gold text-black w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center py-5">
                  <span className="font-display text-xs tracking-[0.25em]">{d.en}</span>
                  <span className="font-display text-2xl font-bold leading-none mt-1">
                    {d.day.replace(t.weekdayStrip, "")}
                  </span>
                  <span className="text-[11px] mt-1">{t.weekdaySuffix}</span>
                </div>
                <div className="px-5 py-5 flex flex-col justify-center">
                  <p className="font-display text-2xl md:text-3xl font-bold leading-tight">{d.course}</p>
                  {d.sub ? <p className="text-sm text-white/60 mt-1">{d.sub}</p> : null}
                </div>
              </div>
            ))}
          </div>
          {data.scheduleNote ? (
            <p className="mt-3 text-sm">
              <span className="font-bold">※ {data.scheduleNote}</span>
              {igUrl ? (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 font-display text-sm border-b border-black hover:text-black/50 transition-colors"
                >
                  {t.seeInstagram}
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      ) : null}

      {data.showFilter && used.length > 1 ? (
        <div className="border border-black">
          <div className="bg-black text-white px-4 py-3 font-display uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="bg-gold text-black px-1.5">＋</span> {t.filterTitle}
          </div>
          <div className="p-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTarget("all")}
              className={
                "font-display uppercase text-sm px-4 py-2 border border-black transition-colors duration-150 " +
                (target === "all"
                  ? "bg-gold text-black"
                  : "bg-white text-black hover:bg-black hover:text-white")
              }
            >
              {t.filterAll}
            </button>
            {used.map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={
                  "font-display uppercase text-sm px-4 py-2 border border-black transition-colors duration-150 " +
                  (target === t
                    ? "bg-gold text-black"
                    : "bg-white text-black hover:bg-black hover:text-white")
                }
              >
                {TARGET_LABELS[t].en}
                <span className="ml-2 font-body text-xs normal-case opacity-70">
                  {TARGET_LABELS[t].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-baseline justify-between border-b-2 border-black pb-2 mt-8 mb-6">
        <h3 className="font-display uppercase text-2xl font-bold tracking-wide">Classes</h3>
        <span className="font-display text-sm text-black/60">{t.countSuffix(filtered.length)}</span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-black/50 font-display uppercase tracking-widest">
          No classes found
        </p>
      ) : (
        <div className="grid gap-px bg-black/15 border border-black/15 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <article key={c.name + i} className="bg-white flex flex-col">
              <div className="relative">
                <Photo
                  src={c.image}
                  caption={c.image ? undefined : t.photoPlaceholder(c.name)}
                  tone={TONES[i % TONES.length]}
                  className="aspect-[3/2]"
                  alt={c.name}
                />
                {c.status ? (
                  <span className="absolute top-0 right-0 bg-black text-gold font-display text-xs tracking-wide px-2 py-1">
                    {c.status}
                  </span>
                ) : null}
                {TARGET_LABELS[c.target] ? (
                  <span className="absolute top-0 left-0 bg-gold text-black font-display uppercase text-xs tracking-wide px-2 py-1">
                    {TARGET_LABELS[c.target].en}
                  </span>
                ) : null}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-display text-xl font-bold uppercase leading-none">{c.english}</h4>
                <p className="text-sm font-bold mt-1.5">{c.name}</p>
                <p className="text-sm text-black/60 mt-2 leading-relaxed">{c.blurb}</p>
                <dl className="mt-4 mb-5 text-sm border-t border-black/15">
                  {[
                    [t.classFields.target, TARGET_LABELS[c.target]?.label ?? c.target],
                    [t.classFields.who, c.who],
                    [t.classFields.schedule, c.schedule],
                    [t.classFields.style, c.style],
                    [t.classFields.monthly, c.monthly],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label} className="flex border-b border-black/15 py-2">
                        <dt className="w-20 shrink-0 font-display uppercase text-xs text-black/70 pt-0.5">
                          {label}
                        </dt>
                        <dd className="flex-1">{value}</dd>
                      </div>
                    ))}
                </dl>
                {c.status ? (
                  <p className="mt-auto pt-5">
                    <span className="block text-center font-display tracking-wide text-sm px-4 py-2.5 border border-black/30 text-black/50">
                      {c.status}
                    </span>
                  </p>
                ) : (
                  <a
                    href={trialHref}
                    className="mt-auto text-center font-display uppercase tracking-wide text-sm px-4 py-2.5 bg-black text-white hover:bg-gold hover:text-black transition-colors duration-150"
                  >
                    {t.tryThisClass}
                  </a>
                )}
              </div>
            </article>
          ))}
          <div className="bg-black text-white p-7 flex flex-col justify-center">
            <p className="font-display text-gold tracking-[0.3em] text-xs">TRIAL</p>
            <h4 className="font-display text-2xl font-bold mt-3 leading-tight">
              {data.trialCardTitle}
            </h4>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">{data.trialCardBody}</p>
            <a
              href={trialHref}
              className="mt-6 text-center font-display uppercase tracking-wide text-sm px-4 py-3 bg-gold text-black hover:bg-white transition-colors duration-150"
            >
              {t.applyTrial}
            </a>
          </div>
        </div>
      )}
      {data.note ? <p className="mt-4 text-xs text-black/50">{data.note}</p> : null}
    </section>
  )
}
