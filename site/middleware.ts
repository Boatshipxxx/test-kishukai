import { NextResponse, type NextRequest } from "next/server"

/**
 * パスから言語を判定してリクエストヘッダー x-locale に載せる。
 * ルートレイアウト（app/layout.tsx）がこれを読んで <html lang> を切り替える。
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const locale = pathname === "/ko" || pathname.startsWith("/ko/") ? "ko" : "ja"
  const headers = new Headers(req.headers)
  headers.set("x-locale", locale)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  // 静的ファイル・API・Next内部のパスは対象外
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}
