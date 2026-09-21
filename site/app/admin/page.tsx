import { redirect } from "next/navigation"
import Editor from "@/components/admin/Editor"
import { isConfigured, isLoggedIn } from "@/lib/auth"
import { getContent, hasBlob } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!isConfigured()) {
    return (
      <main className="min-h-screen grid place-items-center bg-neutral-100 p-6">
        <div className="max-w-lg bg-white border border-neutral-200 p-8">
          <h1 className="text-lg font-bold">管理画面の初期設定が必要です</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Vercel のプロジェクト設定 → Settings → Environment Variables で
            <code className="mx-1 px-1.5 py-0.5 bg-neutral-100 text-[13px]">ADMIN_PASSWORD</code>
            に管理画面のパスワードを設定し、再デプロイしてください。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            あわせて Storage → Blob でストアを作成し、このプロジェクトに接続すると、編集内容と画像が保存できるようになります。
          </p>
        </div>
      </main>
    )
  }
  if (!(await isLoggedIn())) redirect("/admin/login")

  const content = await getContent()
  return <Editor initial={content} storage={hasBlob()} />
}
