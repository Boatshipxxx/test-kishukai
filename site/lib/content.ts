import { head, put } from "@vercel/blob"
import defaults from "@/content/default.json"
import koOverlay from "@/content/ko.json"
import type { Content } from "./types"
import { DEFAULT_LOCALE, type Locale } from "./i18n"

const BLOB_PATH = "content/site.json"

/**
 * Vercel Blob が未設定でも既定コンテンツで動くようにする。
 * 接続方式は2通りある。従来のトークン方式（BLOB_READ_WRITE_TOKEN）と、
 * 新しいOIDC方式（BLOB_STORE_ID + 実行時に自動付与される VERCEL_OIDC_TOKEN）。
 */
export function hasBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

export function defaultContent(): Content {
  return JSON.parse(JSON.stringify(defaults)) as Content
}

/**
 * 表示用コンテンツ。韓国語は日本語（管理画面で保存した内容）の上に content/ko.json の訳文を重ねる。
 * 画像・URL・表示/非表示・大会の行など訳に含めない項目は日本語版の値がそのまま使われる。
 */
export async function getContent(locale: Locale = DEFAULT_LOCALE): Promise<Content> {
  const base = await getBaseContent()
  if (locale === DEFAULT_LOCALE) return base
  return overlayLocale(base, koOverlay) as Content
}

/**
 * 訳文を重ねる。配列は要素数が同じなら1件ずつ重ね（写真などを日本語版から引き継ぐ）、
 * 管理画面で件数が変わっていたら日本語版をそのまま使う（ずれた訳を出さないため）。
 */
function overlayLocale(base: any, over: any): any {
  if (Array.isArray(base)) {
    if (!Array.isArray(over) || over.length !== base.length) return base
    return base.map((b, i) => overlayLocale(b, over[i]))
  }
  if (base && typeof base === "object") {
    if (!over || typeof over !== "object") return base
    const out: any = { ...base }
    for (const k of Object.keys(over)) {
      if (k in base) out[k] = overlayLocale(base[k], over[k])
    }
    return out
  }
  return typeof over === typeof base ? over : base
}

/** 保存済みコンテンツ（日本語）。無ければ既定値。 */
async function getBaseContent(): Promise<Content> {
  if (!hasBlob()) return defaultContent()
  try {
    const meta = await head(BLOB_PATH)
    const res = await fetch(meta.url, { cache: "no-store" })
    if (!res.ok) return defaultContent()
    const saved = (await res.json()) as Partial<Content>
    return mergeContent(defaultContent(), migrate(saved))
  } catch {
    // 未保存（BlobNotFound）や一時的な失敗は既定値で表示する
    return defaultContent()
  }
}

export async function saveContent(next: Content): Promise<void> {
  if (!hasBlob()) {
    throw new Error(
      "Vercel Blob が未設定です。Vercel の Storage で Blob ストアを作成し、プロジェクトに接続してください。",
    )
  }
  try {
    await put(BLOB_PATH, JSON.stringify(next, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    })
  } catch (e) {
    throw new Error(describeBlobError(e))
  }
}

/** Blobの失敗理由を、管理画面でそのまま読める日本語にする。 */
export function describeBlobError(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e)
  if (/access|private|forbidden|not allowed/i.test(raw)) {
    return (
      "保存に失敗しました。接続中のBlobストアが Private の可能性があります。" +
      "サイトの画像は公開URLが必要なため、Public のストアを作成して接続し直してください。" +
      `（詳細: ${raw}）`
    )
  }
  return `保存に失敗しました。（詳細: ${raw}）`
}

/**
 * 既定コンテンツの版を上げたときに、古い保存データのうち作り直した箇所だけを捨てて既定値に戻す。
 * 一覧（配列）は保存値がそのまま優先されるため、こうしないと削除したクラスやプランが残り続ける。
 * 管理画面で一度保存すると新しい版番号も保存され、以降は移行されない。
 */
const MIGRATIONS: { version: number; reset: string[][] }[] = [
  {
    // v2: クラスを幼児/小学生/中高生/アスリート/大人の5つに再編、料金を2プランに、サイトマップ更新
    version: 2,
    reset: [
      ["site", "description"],
      ["hero", "stats"],
      ["promise", "items"],
      ["program", "lead"],
      ["program", "note"],
      ["program", "showFilter"],
      ["program", "items"],
      ["price", "lead"],
      ["price", "note"],
      ["price", "plans"],
      ["price", "details"],
      ["recruit", "items"],
      ["faq", "items"],
      ["footer", "columns"],
    ],
  },
  {
    // v4: 地域SEO対応。タブのタイトル・説明文を新しい既定値に（仮置きのフッター住所は migrate() で個別に判定）
    version: 4,
    reset: [
      ["site", "title"],
      ["site", "description"],
    ],
  },
]

function migrate(saved: any): any {
  const from = Number(saved?.contentVersion ?? 1)
  const out = JSON.parse(JSON.stringify(saved ?? {}))
  // v3: 大会情報ページを追加。保存済みのメニューに無ければ NEWS の前に差し込む（他の編集は保持）
  if (from < 3 && Array.isArray(out.site?.nav) && !out.site.nav.some((n: any) => n?.href === "/tournaments")) {
    const i = out.site.nav.findIndex((n: any) => n?.label === "NEWS")
    out.site.nav.splice(i < 0 ? out.site.nav.length : i, 0, { label: "TOURNAMENT", href: "/tournaments" })
  }
  for (const m of MIGRATIONS) {
    if (from >= m.version) continue
    for (const path of m.reset) {
      let node = out
      for (const key of path.slice(0, -1)) node = node?.[key]
      if (node && typeof node === "object") delete node[path[path.length - 1]]
    }
  }
  if (from < 4 && typeof out.footer?.address === "string" && out.footer.address.includes("差し替え")) {
    delete out.footer.address
  }
  delete out.contentVersion // 版番号は常に既定値（最新）を使う
  return out
}

/** 既定値に保存値を重ねる。項目を増やしても保存済みデータが壊れない。 */
function mergeContent(base: any, over: any): any {
  if (Array.isArray(over)) return over
  if (over && typeof over === "object" && !Array.isArray(base)) {
    const out: any = { ...base }
    for (const k of Object.keys(over)) {
      out[k] = k in base ? mergeContent(base[k], over[k]) : over[k]
    }
    return out
  }
  return over === undefined ? base : over
}
