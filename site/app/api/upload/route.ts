import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { isLoggedIn } from "@/lib/auth"
import { hasBlob } from "@/lib/content"

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif", "image/gif"]

export async function POST(req: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "ログインしてください。" }, { status: 401 })
  }
  if (!hasBlob()) {
    return NextResponse.json(
      { error: "画像の保存先が未設定です。VercelのStorageでBlobストアを作成し、プロジェクトに接続してください。" },
      { status: 503 },
    )
  }

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ファイルが見つかりません。" }, { status: 400 })
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "対応していない形式です（PNG / JPEG / WebP / SVG / AVIF / GIF）。" },
      { status: 400 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "ファイルが大きすぎます（上限8MB）。" }, { status: 400 })
  }

  const safe = file.name.replace(/[^\w.-]+/g, "-").slice(-80) || "image"
  const blob = await put(`uploads/${Date.now()}-${safe}`, file, {
    access: "public",
    contentType: file.type,
  })
  return NextResponse.json({ url: blob.url })
}
