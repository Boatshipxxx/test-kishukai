# CLAUDE.md — 輝蹴会（KISHUKAI TAEKWONDO）サイト

新宿区河田町のテコンドー教室「輝蹴会」の公式サイト。機能追加・文言作成のときは、
必ず下の **エリアマーケティング戦略** に沿わせること（詳細は [docs/SEO_STRATEGY.md](docs/SEO_STRATEGY.md)）。

## Area Marketing Strategy & Primary Target
- **Primary Objective**: Establish #1 brand awareness among local kids' sports / gymnastics / martial arts studios within a 1.2 km radius.
- **Facility Address (Temporary Venue)**:
  - 〒162-0054 東京都新宿区河田町３−１６ 施設Ｃ棟
- **Target Geographic Wards**: 新宿区 (Shinjuku), 千代田区 (Chiyoda), 中央区 (Chuo)
- **Target Train Lines**: 都営新宿線 (Toei Shinjuku Line), 京王線 (Keio Line)
- **High-Priority Local Keywords & Neighborhoods**:
  - `新宿テコンドー` (Shinjuku Taekwondo)
  - `千代田区テコンドー` (Chiyoda-ku Taekwondo)
  - `薬王寺町 キッズ体操教室` (Yakuoji-machi kids gymnastics)
  - `曙町体操教室` (Akebonocho / Akebonobashi gymnastics)
  - `四ツ谷三丁目` (Yotsuya-sanchome)
  - `韓国学校` (Tokyo Korean School / local Korean community)
  - `大東文化大学` (Daito Bunka University)

### 文言・機能を作るときのルール
- 地域名（新宿・曙橋・四谷三丁目・薬王寺町、千代田区・中央区、都営新宿線／京王線）は、**読んで自然な文の中に**入れる。キーワードの羅列や隠しテキストはしない
- 「キッズ体操教室」を探している保護者にも届くよう、幼児・小学生クラスでは「運動神経の土台づくり」「体操・バランス」の要素を言葉にする
- 韓国コミュニティ（東京韓国学校の保護者など）向けに韓国語ページ（`/ko`）を用意している。日本語で新しいセクションや文言を足したら、`site/content/ko.json` にも訳を足す
- 確認できていない事実（徒歩分数、電話番号、大東文化大学との関係、韓国語での対応可否など）は書かない。分からないものは「◯」「（要確認）」で置く
- 会場は **仮会場**。移転したら `site/lib/site-info.ts`（構造化データ）と、管理画面の「アクセス」「フッター」の住所を同時に更新する

## リポジトリ構成
| パス | 内容 |
|---|---|
| `site/` | **本番サイト**（Next.js App Router + Vercel Blob の簡易CMS）。Vercel プロジェクト `kishukai`、root directory は `site` |
| `index.html` ほか直下の `*.html`、`assets/` | 初期の静的デモ（`scripts/build_pages.py` で生成。`index.html` のみ手書き） |
| `design-b/` | デザイン案Bのモック（Vite + React） |
| `docs/` | ブランディング・ワイヤーフレーム・SEO戦略などの資料 |

## 本番サイト（`site/`）の仕組み
- 本文は `site/content/default.json`（既定値）＋管理画面（`/admin`）で保存した内容。**保存済みの内容が既定値より優先**され、配列は保存値が丸ごと使われる
- 既定値の構造や一覧を作り直したときは `contentVersion` を上げ、`site/lib/content.ts` の `MIGRATIONS` に「旧データのどこを既定値に戻すか」を書く。管理画面での他の編集は消さないこと
- 項目を増やすときは `content/default.json`・`lib/types.ts`・`lib/schema.ts`（管理画面のフォーム）の3か所に足す

### 多言語（日本語・韓国語）
- URL はサブパス方式: 日本語 `/`・`/tournaments`、韓国語 `/ko`・`/ko/tournaments`
- 韓国語の本文は `site/content/ko.json`。日本語コンテンツと同じ構造で、**訳すテキストだけ**を持つ（画像・URL・表示/非表示・大会の行は日本語版を共用）。配列は日本語版と件数・順番を揃える（件数がずれた配列は日本語のまま表示される）
- コンポーネントに直書きする固定文言は `site/lib/i18n.ts` の UI 辞書に置く（日本語・韓国語の両方）
- 管理画面で編集できるのは日本語のみ。韓国語は `ko.json` を直接編集する
- 新しいページを足すときは `app/<path>/page.tsx` と `app/ko/<path>/page.tsx` を作り、`lib/seo.ts` の `pageMetadata()` で hreflang を出し、`app/sitemap.ts` の `PATHS` に追加する

### SEO
- `hreflang`（ja / ko / x-default）と canonical は `lib/seo.ts`、サイトマップは `app/sitemap.ts`、robots は `app/robots.ts`
- 構造化データ（schema.org `SportsActivityLocation`）は `components/LocalBusinessJsonLd.tsx`。住所・対象エリアは `lib/site-info.ts`
- **インデックスは既定で無効（noindex）**。公開準備ができたら Vercel の環境変数 `SITE_INDEXABLE=1`（Production のみ）と `NEXT_PUBLIC_SITE_URL`（独自ドメイン）を設定して再デプロイする

## 確認コマンド
```bash
cd site
pnpm install
npx tsc --noEmit   # 型チェック
pnpm build         # ビルド
ADMIN_PASSWORD=任意 pnpm dev
```
ESLint は未設定（`pnpm lint` は対話式の初期設定で止まる）。
