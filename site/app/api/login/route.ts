import { NextResponse } from "next/server"
import { createSession, isConfigured, verifyPassword } from "@/lib/auth"

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "管理画面のパスワードが未設定です。Vercelの環境変数 ADMIN_PASSWORD を設定してください。" },
      { status: 503 },
    )
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string }
  if (!password || !(await verifyPassword(password))) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 })
  }
  await createSession()
  return NextResponse.json({ ok: true })
}
