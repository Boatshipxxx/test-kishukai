"use client"

import { useState } from "react"
import { SectionHead } from "./ui"
import type { Content } from "@/lib/types"

export default function FaqSection({ data }: { data: Content["faq"] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="bg-fog border-y border-black/15">
      <div className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHead en={data.eyebrow} ja={data.title} />
        <div className="border border-black/15 bg-white">
          {data.items.map((f, i) => (
            <div key={f.q + i} className="border-b border-black/15 last:border-b-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gold transition-colors duration-150"
              >
                <span className="font-display text-sm font-bold w-6 shrink-0 text-black/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-bold text-sm">{f.q}</span>
                <span className="font-display text-lg leading-none shrink-0">
                  {open === i ? "−" : "＋"}
                </span>
              </button>
              {open === i ? (
                <p className="px-5 pb-5 pl-15 text-sm text-black/60 leading-relaxed">{f.a}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
