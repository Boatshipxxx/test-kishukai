import { head, put } from "@vercel/blob"
import defaults from "@/content/default.json"
import type { Content } from "./types"

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

/** 保存済みコンテンツ。無ければ既定値。 */
export async function getContent(): Promise<Content> {
  if (!hasBlob()) return defaultContent()
  try {
    const meta = await head(BLOB_PATH)
    const res = await fetch(meta.url, { cache: "no-store" })
    if (!res.ok) return defaultContent()
    const saved = (await res.json()) as Partial<Content>
    return mergeContent(defaultContent(), saved)
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
