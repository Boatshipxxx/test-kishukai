export type Field =
  | { key: string; label: string; type: "text" | "textarea" | "image" | "boolean"; hint?: string }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[] }

export type Section = {
  key: string
  label: string
  icon: string
  /** セクション自体の表示/非表示を持つか */
  toggle?: boolean
  fields?: Field[]
  /** 繰り返し項目 */
  lists?: {
    key: string
    label: string
    itemLabel: string
    /** 一覧で見出しに使うフィールド */
    titleKey: string
    max?: number
    fields: Field[]
  }[]
}

const TARGET_OPTIONS = [
  { value: "kids", label: "キッズ（幼児〜小学生）" },
  { value: "junior", label: "ジュニア（小中学生）" },
  { value: "athlete", label: "選手育成" },
  { value: "adult", label: "大人・保護者" },
]

export const SCHEMA: Section[] = [
  {
    key: "site",
    label: "サイト全体",
    icon: "settings",
    fields: [
      { key: "name", label: "道場名", type: "text" },
      { key: "nameEn", label: "英字表記（ロゴ下）", type: "text" },
      { key: "logo", label: "ロゴ画像", type: "image", hint: "黒背景に載るため、背景透過PNGまたはSVGを推奨" },
      { key: "ctaLabel", label: "ヘッダーのボタン文言", type: "text" },
      { key: "title", label: "ブラウザのタブに出るタイトル", type: "text" },
      { key: "description", label: "検索結果に出る説明文", type: "textarea" },
    ],
    lists: [
      {
        key: "nav",
        label: "ヘッダーのメニュー",
        itemLabel: "メニュー項目",
        titleKey: "label",
        max: 8,
        fields: [
          { key: "label", label: "表示名", type: "text" },
          { key: "href", label: "リンク先", type: "text", hint: "同じページ内なら #about のように書きます" },
        ],
      },
    ],
  },
  {
    key: "hero",
    label: "ヒーロー（最上部）",
    icon: "hero",
    toggle: true,
    fields: [
      { key: "image", label: "背景画像（バナー）", type: "image", hint: "未設定なら黒地のグラデーションになります。横長・2000px程度を推奨" },
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "titleLine1", label: "大見出し 1行目", type: "text" },
      { key: "titleLine2", label: "大見出し 2行目", type: "text" },
      { key: "titleAccent", label: "大見出し 2行目の黄色部分", type: "text" },
      { key: "catch", label: "日本語キャッチコピー", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
      { key: "ctaPrimary", label: "ボタン（黄色）", type: "text" },
      { key: "ctaSecondary", label: "ボタン（枠線）", type: "text" },
    ],
    lists: [
      {
        key: "stats",
        label: "実績の帯",
        itemLabel: "項目",
        titleKey: "label",
        max: 6,
        fields: [
          { key: "label", label: "見出し", type: "text" },
          { key: "value", label: "内容", type: "text" },
        ],
      },
    ],
  },
  {
    key: "promise",
    label: "3つの約束",
    icon: "promise",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
    ],
    lists: [
      {
        key: "items",
        label: "約束の項目",
        itemLabel: "約束",
        titleKey: "title",
        max: 6,
        fields: [
          { key: "kanji", label: "漢字1文字", type: "text" },
          { key: "title", label: "見出し", type: "text" },
          { key: "body", label: "本文", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "world",
    label: "世界への挑戦",
    icon: "world",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
      { key: "mainImage", label: "メイン写真", type: "image" },
      { key: "mainImageCaption", label: "メイン写真の説明（未設定時に表示）", type: "text" },
      { key: "quote", label: "引用文", type: "textarea" },
      { key: "linkLabel", label: "ボタン文言", type: "text", hint: "空欄にするとボタンが消えます" },
    ],
    lists: [
      {
        key: "gallery",
        label: "サムネイル写真",
        itemLabel: "写真",
        titleKey: "caption",
        max: 6,
        fields: [
          { key: "image", label: "写真", type: "image" },
          { key: "caption", label: "説明", type: "text" },
        ],
      },
      {
        key: "data",
        label: "遠征データ",
        itemLabel: "項目",
        titleKey: "label",
        max: 10,
        fields: [
          { key: "label", label: "見出し", type: "text" },
          { key: "value", label: "内容", type: "text" },
        ],
      },
    ],
  },
  {
    key: "program",
    label: "クラス一覧",
    icon: "program",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
      { key: "showFilter", label: "対象で絞り込むボタンを表示", type: "boolean" },
      { key: "trialCardTitle", label: "体験カードの見出し", type: "text" },
      { key: "trialCardBody", label: "体験カードの本文", type: "textarea" },
      { key: "note", label: "注記", type: "textarea" },
    ],
    lists: [
      {
        key: "items",
        label: "クラス",
        itemLabel: "クラス",
        titleKey: "name",
        max: 12,
        fields: [
          { key: "image", label: "写真", type: "image" },
          { key: "name", label: "クラス名（日本語）", type: "text" },
          { key: "english", label: "クラス名（英字）", type: "text" },
          { key: "target", label: "対象", type: "select", options: TARGET_OPTIONS },
          { key: "who", label: "ねらい", type: "text" },
          { key: "schedule", label: "実施日時", type: "text" },
          { key: "style", label: "形式", type: "text" },
          { key: "monthly", label: "月謝", type: "text" },
          { key: "blurb", label: "説明文", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "price",
    label: "料金プラン",
    icon: "price",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
      { key: "showDetails", label: "入会金などの明細表を表示", type: "boolean" },
      { key: "note", label: "注記", type: "textarea" },
    ],
    lists: [
      {
        key: "plans",
        label: "プラン",
        itemLabel: "プラン",
        titleKey: "name",
        max: 6,
        fields: [
          { key: "name", label: "プラン名", type: "text" },
          { key: "en", label: "英字表記", type: "text" },
          { key: "price", label: "回数の表記", type: "text" },
          { key: "monthly", label: "月額", type: "text" },
          { key: "note", label: "説明文", type: "textarea" },
          { key: "featured", label: "「いちばん人気」として強調", type: "boolean" },
        ],
      },
      {
        key: "details",
        label: "料金明細",
        itemLabel: "項目",
        titleKey: "label",
        max: 10,
        fields: [
          { key: "label", label: "項目名", type: "text" },
          { key: "value", label: "内容", type: "text" },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "五大精神と「情」",
    icon: "about",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
      { key: "jungTitle", label: "「情」解説の書き出し（太字）", type: "text" },
      { key: "jungBody", label: "「情」解説の本文", type: "textarea" },
    ],
    lists: [
      {
        key: "tenets",
        label: "五大精神",
        itemLabel: "精神",
        titleKey: "k",
        max: 8,
        fields: [
          { key: "k", label: "漢字", type: "text" },
          { key: "en", label: "読み（英字）", type: "text" },
          { key: "d", label: "意味", type: "text" },
        ],
      },
    ],
  },
  {
    key: "faq",
    label: "よくあるご質問",
    icon: "faq",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
    ],
    lists: [
      {
        key: "items",
        label: "質問と回答",
        itemLabel: "質問",
        titleKey: "q",
        max: 20,
        fields: [
          { key: "q", label: "質問", type: "text" },
          { key: "a", label: "回答", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "news",
    label: "お知らせ",
    icon: "news",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "viewAllLabel", label: "一覧リンクの文言", type: "text", hint: "空欄にするとリンクが消えます" },
    ],
    lists: [
      {
        key: "items",
        label: "記事",
        itemLabel: "お知らせ",
        titleKey: "title",
        max: 30,
        fields: [
          { key: "date", label: "日付", type: "text", hint: "2026.08.01 の形式" },
          { key: "cat", label: "カテゴリ", type: "text" },
          { key: "title", label: "見出し", type: "text" },
          { key: "href", label: "リンク先", type: "text", hint: "空欄可" },
        ],
      },
    ],
  },
  {
    key: "support",
    label: "サポーター（協賛）",
    icon: "support",
    toggle: true,
    fields: [
      { key: "eyebrow", label: "小見出し（英字）", type: "text" },
      { key: "title", label: "見出し", type: "text" },
      { key: "lead", label: "リード文", type: "textarea" },
      { key: "image", label: "写真", type: "image" },
      { key: "imageCaption", label: "写真の説明（未設定時に表示）", type: "text" },
      { key: "ctaLabel", label: "ボタン文言", type: "text" },
    ],
    lists: [
      {
        key: "plans",
        label: "協賛プラン",
        itemLabel: "プラン",
        titleKey: "name",
        max: 6,
        fields: [
          { key: "name", label: "プラン名", type: "text" },
          { key: "price", label: "金額", type: "text" },
          { key: "note", label: "内容", type: "text" },
        ],
      },
    ],
  },
  {
    key: "cta",
    label: "最後の申し込み枠",
    icon: "cta",
    toggle: true,
    fields: [
      { key: "titleEn", label: "英字見出し", type: "text" },
      { key: "titleAccent", label: "英字見出しの黄色部分", type: "text" },
      { key: "titleJa", label: "日本語見出し", type: "text" },
      { key: "lead", label: "本文", type: "textarea" },
      { key: "primaryLabel", label: "ボタン（黄色）", type: "text" },
      { key: "secondaryLabel", label: "ボタン（枠線）", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "フッター",
    icon: "footer",
    fields: [
      { key: "address", label: "住所・連絡先", type: "textarea" },
      { key: "tagline", label: "キャッチフレーズ", type: "text" },
      { key: "copyright", label: "コピーライト", type: "text" },
    ],
  },
]
