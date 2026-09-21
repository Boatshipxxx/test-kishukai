import { NextResponse } from "next/server"
import { isLoggedIn } from "@/lib/auth"
import { getContent, hasBlob, saveContent } from "@/lib/content"

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "ログインしてください。" }, { status: 401 })
  }
  return NextResponse.json({ content: await getContent(), storage: hasBlob() })
}

export async function PUT(req: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "ログインしてください。" }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object" || !body.content) {
    return NextResponse.json({ error: "保存データの形式が不正です。" }, { status: 400 })
  }
  try {
    await saveContent(body.content)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "保存に失敗しました。"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
