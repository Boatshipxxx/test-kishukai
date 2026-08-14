# デザイン案B「ATHLETIC」— React / Vite / Tailwind v4

輝蹴会リブランディングの**別デザイン案**。内容（情報設計・コピー・差し替え項目）は
案A（リポジトリ直下の静的HTML）と同一で、見た目の路線だけを変えたものです。

## Figma Make に取り込む場合

必要なのは次の2ファイルだけです。そのまま貼り替えてください。

| コピー元 | Figma Make の貼り付け先 |
|---|---|
| `src/App.tsx` | `src/App.tsx` |
| `src/index.css` | `src/index.css` |

`src/main.tsx` / `index.html` / `package.json` は Figma Make 側のものをそのまま使えます。
このディレクトリの `vite.config.ts` はローカル検証用（Figma Make プラグインを含まない構成）です。

## ローカルで動かす場合

```bash
cd design-b
pnpm install
pnpm dev      # 開発サーバー
pnpm build    # dist/ に本番ビルド
pnpm format   # oxfmt（Figma Make と同じフォーマッタ）
```

検証済みの組み合わせ：Vite 8 / @vitejs/plugin-react 6 / Tailwind CSS 4 / React 19 / TypeScript 5.9
（Figma Make の `pnpm-lock.yaml` と同じメジャーバージョン）。

### ⚠ oxfmt の注意点

`oxfmt@0.2.0` は**インラインの型リテラルを壊します**。

```ts
// これを pnpm format にかけると…
const TARGETS: { id: Target; label: string }[] = []
// セミコロンが消えて構文エラーになる
const TARGETS: { id: Target label: string }[] = []
```

そのため本コードでは型を必ず名前付き（`type TargetDef = { ... }`）に切り出しています。
App.tsx を書き換える際もインライン型リテラルは使わないでください。
現状のコードは `pnpm format` を繰り返しても変化しないことを確認済みです。

## デザインの要点

| 項目 | 内容 |
|---|---|
| 路線 | アスレチック／インダストリアル。高コントラスト・角丸なし・ヘアライン罫 |
| 配色 | 黒 `#000000` / 白 `#FFFFFF` / 霧 `#F4F4F4` / 輝ゴールド `#F4DE1E` / 太極の紅 `#D8232A` |
| 書体 | 見出し：Oswald（縦長コンデンス・英字大文字）／本文：Noto Sans JP |
| 装飾 | 斜めストライプ帯（`.stripes`）、色反転ホバー、`<dl>` によるデータ列 |
| インタラクション | クラス一覧の対象別フィルタ（`useState`）、FAQアコーディオン |

配色トークンは `src/index.css` の `@theme` に定義しているので、
`bg-gold` `text-gold` `border-gold` `bg-fog` などのユーティリティで使えます。

## 案Aとの違い

案Aと同じ内容・同じ差し替え項目のまま、伝わる印象だけが変わります。
比較は `../docs/DESIGN-DIRECTIONS.md` を参照してください。

## 差し替えが必要な項目

案Aと共通です。写真はすべてプレースホルダー（想定内容をキャプションに記載）、
料金・日程・会場・遠征データは「差し替え」と明示しています。
