export type Img = string

export type Content = {
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
    }[]
  }
  price: {
    visible: boolean
    eyebrow: string
    title: string
    lead: string
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
  footer: {
    address: string
    tagline: string
    copyright: string
    columns: { name: string; links: string[] }[]
    social: string[]
  }
}

export const TARGET_LABELS: Record<string, { label: string; en: string }> = {
  kids: { label: "幼児〜小学生", en: "KIDS" },
  junior: { label: "小中学生", en: "JUNIOR" },
  athlete: { label: "選手育成", en: "ATHLETE" },
  adult: { label: "大人・保護者", en: "ADULT" },
}

/** Instagramのユーザー名を正規化する（@やURLで入力されても受け付ける）。 */
export function igUsername(raw: string | undefined): string {
  return (raw ?? "")
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "")
}
