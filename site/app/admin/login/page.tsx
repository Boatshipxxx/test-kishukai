"use client"

import { useState } from "react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "ログインできませんでした。")
      window.location.href = "/admin"
    } catch (e) {
      setError(e instanceof Error ? e.message : "ログインできませんでした。")
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-neutral-900 p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-8">
        <h1 className="text-lg font-bold">輝蹴会 サイト管理</h1>
        <p className="mt-2 text-[13px] text-neutral-500">パスワードを入力してください。</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mt-5 w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
          placeholder="パスワード"
        />
        {error ? <p className="mt-3 text-[13px] text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full py-3 bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-700 disabled:opacity-40"
        >
          {busy ? "確認中…" : "ログイン"}
        </button>
      </form>
    </main>
  )
}
