"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { SCHEMA } from "@/lib/schema"
import { FieldInput } from "./Fields"

type Any = Record<string, any>

export default function Editor({
  initial,
  storage,
}: {
  initial: Any
  storage: boolean
}) {
  const [content, setContent] = useState<Any>(initial)
  const [active, setActive] = useState(SCHEMA[0].key)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null)
  const [openItem, setOpenItem] = useState<string | null>(null)

  const section = useMemo(() => SCHEMA.find((s) => s.key === active)!, [active])

  // 未保存のまま離脱しようとしたら確認する
  useEffect(() => {
    if (!dirty) return
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", onLeave)
    return () => window.removeEventListener("beforeunload", onLeave)
  }, [dirty])

  const setIn = useCallback((path: (string | number)[], value: unknown) => {
    setContent((prev) => {
      const next = structuredClone(prev)
      let cur: Any = next
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
      cur[path[path.length - 1]] = value
      return next
    })
    setDirty(true)
    setMsg(null)
  }, [])

  const mutateList = useCallback(
    (sectionKey: string, listKey: string, fn: (arr: any[]) => any[]) => {
      setContent((prev) => {
        const next = structuredClone(prev)
        next[sectionKey][listKey] = fn(next[sectionKey][listKey] ?? [])
        return next
      })
      setDirty(true)
      setMsg(null)
    },
    [],
  )

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "保存に失敗しました。")
      setDirty(false)
      setMsg({ kind: "ok", text: "保存しました。サイトに反映されています。" })
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "保存に失敗しました。" })
    } finally {
      setSaving(false)
    }
  }

  const err = (text: string) => setMsg({ kind: "err", text })

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* 上部バー */}
      <header className="sticky top-0 z-30 bg-neutral-900 text-white">
        <div className="mx-auto max-w-[1400px] px-5 h-14 flex items-center gap-4">
          <span className="font-bold tracking-wide">輝蹴会 サイト管理</span>
          <span className="text-[11px] text-white/50 hidden sm:inline">
            {dirty ? "未保存の変更があります" : "変更はありません"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold px-3 py-2 border border-white/30 hover:bg-white/10"
            >
              サイトを表示
            </a>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="text-xs font-bold px-4 py-2 bg-[#f4de1e] text-black hover:bg-white disabled:opacity-40 disabled:hover:bg-[#f4de1e]"
            >
              {saving ? "保存中…" : "保存する"}
            </button>
            <form action="/api/logout" method="post" onSubmit={(e) => {
              e.preventDefault()
              fetch("/api/logout", { method: "POST" }).then(() => (window.location.href = "/admin/login"))
            }}>
              <button className="text-xs px-3 py-2 text-white/60 hover:text-white">ログアウト</button>
            </form>
          </div>
        </div>
      </header>

      {!storage ? (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-[13px] px-5 py-3">
          <strong className="font-bold">保存先が未設定です。</strong>{" "}
          Vercel の Storage で Blob ストアを作成してこのプロジェクトに接続すると、編集内容と画像を保存できるようになります。現在は既定の内容を表示しています。
        </div>
      ) : null}

      {msg ? (
        <div
          className={
            "text-[13px] px-5 py-3 border-b " +
            (msg.kind === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800")
          }
        >
          {msg.text}
        </div>
      ) : null}

      <div className="mx-auto max-w-[1400px] px-5 py-6 grid gap-6 lg:grid-cols-[260px_1fr] items-start">
        {/* セクション一覧 */}
        <nav className="bg-white border border-neutral-200 lg:sticky lg:top-20">
          <p className="px-4 py-3 text-[11px] font-bold tracking-widest text-neutral-500 border-b border-neutral-200">
            ページの構成
          </p>
          <ul>
            {SCHEMA.map((s) => {
              const on = s.toggle ? Boolean(content[s.key]?.visible) : true
              return (
                <li key={s.key} className="border-b border-neutral-100 last:border-b-0">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setActive(s.key)
                        setOpenItem(null)
                      }}
                      className={
                        "flex-1 text-left px-4 py-3 text-[13px] font-bold transition-colors " +
                        (active === s.key
                          ? "bg-neutral-900 text-white"
                          : "hover:bg-neutral-50 " + (on ? "text-neutral-800" : "text-neutral-400"))
                      }
                    >
                      {s.label}
                      {s.toggle && !on ? (
                        <span className="ml-2 text-[10px] font-normal opacity-70">非表示</span>
                      ) : null}
                    </button>
                    {s.toggle ? (
                      <label
                        className="px-3 cursor-pointer"
                        title={on ? "サイトに表示中（クリックで非表示）" : "非表示（クリックで表示）"}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(e) => setIn([s.key, "visible"], e.target.checked)}
                          className="h-4 w-4 accent-neutral-900"
                        />
                      </label>
                    ) : (
                      <span className="px-3 w-4" />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="px-4 py-3 text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-200">
            右のチェックを外すと、そのセクションをサイトから隠せます。内容は消えません。
          </p>
        </nav>

        {/* 編集フォーム */}
        <div className="min-w-0 flex flex-col gap-5">
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-lg font-bold mb-5">{section.label}</h2>
            <div className="grid gap-5 max-w-2xl">
              {(section.fields ?? []).map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={content[section.key]?.[f.key]}
                  onChange={(v) => setIn([section.key, f.key], v)}
                  onError={err}
                />
              ))}
            </div>
          </div>

          {(section.lists ?? []).map((list) => {
            const arr: any[] = content[section.key]?.[list.key] ?? []
            return (
              <div key={list.key} className="bg-white border border-neutral-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                  <h3 className="font-bold">
                    {list.label}
                    <span className="ml-2 text-[11px] font-normal text-neutral-500">{arr.length}件</span>
                  </h3>
                  <button
                    onClick={() => {
                      if (list.max && arr.length >= list.max) {
                        err(`${list.label}は${list.max}件までです。`)
                        return
                      }
                      const blank: Any = {}
                      list.fields.forEach((f) => (blank[f.key] = f.type === "boolean" ? false : ""))
                      if (list.fields.some((f) => f.type === "select")) {
                        list.fields.forEach((f) => {
                          if (f.type === "select") blank[f.key] = f.options[0]?.value ?? ""
                        })
                      }
                      mutateList(section.key, list.key, (a) => [...a, blank])
                      setOpenItem(`${list.key}:${arr.length}`)
                    }}
                    className="text-xs font-bold px-3 py-2 border border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    ＋ {list.itemLabel}を追加
                  </button>
                </div>
                <ul>
                  {arr.map((item, i) => {
                    const id = `${list.key}:${i}`
                    const open = openItem === id
                    return (
                      <li key={id} className="border-b border-neutral-100 last:border-b-0">
                        <div className="flex items-center gap-2 px-4 py-3">
                          <button
                            onClick={() => setOpenItem(open ? null : id)}
                            className="flex-1 text-left flex items-center gap-3 min-w-0"
                          >
                            <span className="text-[11px] font-bold text-neutral-400 w-6 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-bold truncate">
                              {item[list.titleKey] || `（${list.itemLabel}${i + 1}）`}
                            </span>
                            <span className="ml-auto text-neutral-400 text-xs shrink-0">
                              {open ? "閉じる ▲" : "編集 ▼"}
                            </span>
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() =>
                                mutateList(section.key, list.key, (a) => {
                                  if (i === 0) return a
                                  const n = [...a]
                                  ;[n[i - 1], n[i]] = [n[i], n[i - 1]]
                                  return n
                                })
                              }
                              disabled={i === 0}
                              title="上へ"
                              className="h-7 w-7 grid place-items-center border border-neutral-200 text-xs hover:bg-neutral-100 disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() =>
                                mutateList(section.key, list.key, (a) => {
                                  if (i === a.length - 1) return a
                                  const n = [...a]
                                  ;[n[i + 1], n[i]] = [n[i], n[i + 1]]
                                  return n
                                })
                              }
                              disabled={i === arr.length - 1}
                              title="下へ"
                              className="h-7 w-7 grid place-items-center border border-neutral-200 text-xs hover:bg-neutral-100 disabled:opacity-30"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => {
                                if (!confirm(`「${item[list.titleKey] || list.itemLabel}」を削除します。よろしいですか？`)) return
                                mutateList(section.key, list.key, (a) => a.filter((_, j) => j !== i))
                                setOpenItem(null)
                              }}
                              title="削除"
                              className="h-7 w-7 grid place-items-center border border-neutral-200 text-xs text-red-600 hover:bg-red-50"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        {open ? (
                          <div className="px-4 pb-5 pl-12 grid gap-4 max-w-2xl">
                            {list.fields.map((f) => (
                              <FieldInput
                                key={f.key}
                                field={f}
                                value={item[f.key]}
                                onChange={(v) => setIn([section.key, list.key, i, f.key], v)}
                                onError={err}
                              />
                            ))}
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                  {arr.length === 0 ? (
                    <li className="px-6 py-8 text-center text-sm text-neutral-400">
                      まだ登録がありません
                    </li>
                  ) : null}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* 下部の保存バー（スクロール中でも押せる） */}
      {dirty ? (
        <div className="sticky bottom-0 z-30 bg-white border-t border-neutral-300 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="mx-auto max-w-[1400px] px-5 py-3 flex items-center gap-3">
            <span className="text-[13px] text-neutral-600">未保存の変更があります</span>
            <button
              onClick={save}
              disabled={saving}
              className="ml-auto text-sm font-bold px-6 py-2.5 bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {saving ? "保存中…" : "保存する"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
