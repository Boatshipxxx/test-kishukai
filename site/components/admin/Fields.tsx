"use client"

import { useRef, useState } from "react"
import type { Field } from "@/lib/schema"

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-[13px] font-bold text-neutral-800">{children}</span>
      {hint ? <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{hint}</p> : null}
    </div>
  )
}

const inputBase =
  "w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"

export function ImageField({
  value,
  onChange,
  onError,
}: {
  value: string
  onChange: (v: string) => void
  onError: (msg: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function upload(file: File) {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "アップロードに失敗しました。")
      onChange(json.url)
    } catch (e) {
      onError(e instanceof Error ? e.message : "アップロードに失敗しました。")
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ""
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="h-20 w-28 shrink-0 border border-neutral-300 bg-neutral-100 grid place-items-center overflow-hidden">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[10px] text-neutral-400">未設定</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="text-xs font-bold px-3 py-2 bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {busy ? "アップロード中…" : value ? "画像を差し替える" : "画像をアップロード"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs font-bold px-3 py-2 border border-neutral-300 hover:bg-neutral-100"
            >
              削除
            </button>
          ) : null}
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) upload(f)
          }}
        />
        {value ? (
          <p className="mt-1.5 text-[11px] text-neutral-500 truncate" title={value}>
            {value}
          </p>
        ) : (
          <p className="mt-1.5 text-[11px] text-neutral-500">
            PNG / JPEG / WebP / SVG（8MBまで）
          </p>
        )}
      </div>
    </div>
  )
}

export function FieldInput({
  field,
  value,
  onChange,
  onError,
}: {
  field: Field
  value: unknown
  onChange: (v: unknown) => void
  onError: (msg: string) => void
}) {
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2.5 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-neutral-900"
        />
        <span className="text-[13px] font-bold text-neutral-800">{field.label}</span>
      </label>
    )
  }

  return (
    <div>
      <Label hint={"hint" in field ? field.hint : undefined}>{field.label}</Label>
      {field.type === "textarea" ? (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={inputBase + " leading-relaxed resize-y"}
        />
      ) : field.type === "image" ? (
        <ImageField value={String(value ?? "")} onChange={onChange} onError={onError} />
      ) : field.type === "select" ? (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      )}
    </div>
  )
}
