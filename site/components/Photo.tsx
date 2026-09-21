const TONES: Record<string, string> = {
  navy: "linear-gradient(135deg, #16305c 0%, #000 78%)",
  blood: "linear-gradient(135deg, #8f1418 0%, #000 78%)",
  gold: "linear-gradient(135deg, #8a7405 0%, #000 78%)",
}

/** 画像が未設定のあいだはキャプション付きのプレースホルダーを出す。 */
export default function Photo({
  src,
  caption,
  tone = "navy",
  className = "",
  alt,
}: {
  src?: string
  caption?: string
  tone?: keyof typeof TONES
  className?: string
  alt?: string
}) {
  if (src) {
    return (
      <div className={"relative overflow-hidden bg-neutral-900 " + className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? caption ?? ""} className="h-full w-full object-cover" />
      </div>
    )
  }
  return (
    <div className={"relative overflow-hidden bg-neutral-900 " + className}>
      <div className="absolute inset-0" style={{ background: TONES[tone] }} />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(420px 240px at 68% 26%, rgba(255,255,255,0.22), transparent 62%)",
        }}
      />
      {caption ? (
        <span className="absolute bottom-0 left-0 right-0 bg-black/75 text-white/80 font-display text-[11px] tracking-[0.14em] px-3 py-1.5">
          {caption}
        </span>
      ) : null}
    </div>
  )
}
