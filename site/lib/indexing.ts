/**
 * 検索エンジンにインデックスさせるか。
 * 仮の内容（◯や差し替え表記）が残っているあいだは公開しないよう、既定は noindex。
 * 公開準備ができたら Vercel の環境変数 SITE_INDEXABLE=1（Production のみ）を設定して再デプロイする。
 */
export function isIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "1" && process.env.VERCEL_ENV !== "preview"
}
