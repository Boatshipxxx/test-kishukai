import type { ReactNode } from "react"

export function SectionHead({
  en,
  ja,
  lead,
  invert = false,
}: {
  en: string
  ja: string
  lead?: string
  invert?: boolean
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="font-display text-gold tracking-[0.3em] text-xs">{en}</p>
      <h2
        className={
          "font-display text-4xl md:text-5xl font-bold uppercase leading-none mt-2 " +
          (invert ? "text-white" : "text-black")
        }
      >
        {ja}
      </h2>
      {lead ? (
        <p className={"mt-4 text-sm leading-relaxed " + (invert ? "text-white/70" : "text-black/60")}>
          {lead}
        </p>
      ) : null}
    </div>
  )
}

export function GoldButton({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 bg-gold text-black border border-gold hover:bg-black hover:text-gold transition-colors duration-150"
    >
      {children}
    </a>
  )
}

export function GhostButton({
  children,
  href = "#",
  onDark = false,
}: {
  children: ReactNode
  href?: string
  onDark?: boolean
}) {
  return (
    <a
      href={href}
      className={
        "inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 border transition-colors duration-150 " +
        (onDark
          ? "border-white/40 text-white hover:bg-gold hover:text-black hover:border-gold"
          : "border-black text-black hover:bg-black hover:text-white")
      }
    >
      {children}
    </a>
  )
}

export function Logo({ src, size = 32 }: { src?: string; size?: number }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="輝蹴会 ロゴ" width={size} height={size} className="shrink-0 object-contain" style={{ height: size, width: size }} />
  }
  return (
    <svg viewBox="0 0 40 40" className="shrink-0" style={{ height: size, width: size }} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#f4de1e" strokeWidth="2" />
      <path d="M20 2 A18 18 0 0 1 20 38 A9 9 0 0 1 20 20 A9 9 0 0 0 20 2Z" fill="#d8232a" />
      <path d="M20 38 A18 18 0 0 1 20 2 A9 9 0 0 1 20 20 A9 9 0 0 0 20 38Z" fill="#f4de1e" />
    </svg>
  )
}
