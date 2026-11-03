export type Img = string

/** 大会一覧の1行。詳細は外部URLのみ（http/https 以外はリンクにしない） */
export type Tournament = {
  /** 開催日程 */
  date: string
  /** 大会名 */
  name: string
  /** 会場 */
  venue: string
  /** 対象年齢 */
  age: string
  /** 詳細（外部URL） */
  url: string
}

export type Content = {
  /** 既定コンテンツの版。保存済みデータの移行判定に使う（lib/content.ts） */
  contentVersion: number
  site: {
    name: string
    nameEn: string
    logo: Img
    title: string
    description: string
    ctaLabel: string
    /** Instagramのユーザー名（@なし）。DMボタンとフッターのIGアイコンに使う */
    instagram: string
    nav: { label: string; href: string }[]
  }
  hero: {
    visible: boolean
    eyebrow: string
    titleLine1: string
    titleLine2: string
    titleAccent: string
    catch: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
    image: Img
    stats: { label: string; value: string }[]
  }
  promise: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    items: { kanji: string; title: string; body: string }[]
  }
  world: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    mainImage: Img
    mainImageCaption: string
    gallery: { image: Img; caption: string }[]
    quote: string
    data: { label: string; value: string }[]
    linkLabel: string
  }
  program: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    showFilter: boolean
    /** 開催曜日の見出し・曜日ごとのコース・注記 */
    scheduleTitle: string
    days: { day: string; en: string; course: string; sub: string }[]
    scheduleNote: string
    note: string
    trialCardTitle: string
    trialCardBody: string
    items: {
      name: string
      english: string
      target: string
      who: string
      schedule: string
      style: string
      monthly: string
      blurb: string
      image: Img
      /** 「現在準備中」など。入っていると体験ボタンの代わりに表示する */
      status: string
    }[]
  }
  price: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    /** 料金の直下に目立たせて出すお知らせ（割引など） */
    discountNote: string
    note: string
    showDetails: boolean
    plans: { name: string; en: string; price: string; monthly: string; note: string; featured: boolean }[]
    details: { label: string; value: string }[]
  }
  recruit: {
    visible: boolean
    eyebrow: string
    title: string
    status: string
    lead: string
    image: Img
    imageCaption: string
    items: { name: string; status: string }[]
    steps: { title: string; body: string }[]
    dmTemplate: string
    dmLabel: string
    note: string
  }
  about: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    jungTitle: string
    jungBody: string
    tenets: { k: string; en: string; d: string }[]
  }
  faq: { visible: boolean; eyebrow: string; title: string; items: { q: string; a: string }[] }
  news: {
    visible: boolean
    eyebrow: string
    title: string
    viewAllLabel: string
    items: { date: string; cat: string; title: string; href: string }[]
  }
  support: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    image: Img
    imageCaption: string
    ctaLabel: string
    plans: { name: string; price: string; note: string }[]
  }
  cta: {
    visible: boolean
    titleEn: string
    titleAccent: string
    titleJa: string
    lead: string
    primaryLabel: string
    secondaryLabel: string
  }
  tournaments: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    note: string
    emptyText: string
    items: Tournament[]
  }
  access: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
    /** 表示用の住所（構造化データは lib/site-info.ts） */
    address: string
    stations: { name: string; line: string; walk: string }[]
    mapLabel: string
    note: string
  }
  footer: {
    address: string
    tagline: string
    copyright: string
    columns: { name: string; links: string[] }[]
    social: string[]
  }
}


/** Instagramのユーザー名を正規化する（@やURLで入力されても受け付ける）。 */
export function igUsername(raw: string | undefined): string {
  return (raw ?? "")
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "")
}

/** 外部リンクとして安全に出せるURLだけを返す（http/https 以外は空文字）。 */
export function safeExternalUrl(raw: string | undefined): string {
  const v = (raw ?? "").trim()
  if (!v) return ""
  try {
    const u = new URL(v)
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : ""
  } catch {
    return ""
  }
}
