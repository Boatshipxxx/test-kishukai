import { cookies } from "next/headers"

const COOKIE = "kishukai_admin"

function secret(): string {
  return process.env.ADMIN_PASSWORD || ""
}

/** パスワードから推測しにくいトークンを作る（平文はCookieに入れない）。 */
async function token(): Promise<string> {
  const data = new TextEncoder().encode("kishukai:" + secret())
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function isConfigured(): boolean {
  return secret().length > 0
}

export async function verifyPassword(input: string): Promise<boolean> {
  const s = secret()
  if (!s) return false
  if (input.length !== s.length) return false
  let diff = 0
  for (let i = 0; i < s.length; i++) diff |= input.charCodeAt(i) ^ s.charCodeAt(i)
  return diff === 0
}

export async function createSession(): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE, await token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function isLoggedIn(): Promise<boolean> {
  if (!isConfigured()) return false
  const jar = await cookies()
  return jar.get(COOKIE)?.value === (await token())
}
