/**
 * 多言語対応（日本語・韓国語）。
 * - URL: 日本語は "/"・"/tournaments"、韓国語は "/ko"・"/ko/tournaments"（サブパス方式）
 * - 管理画面で編集する本文は日本語。韓国語の本文は content/ko.json（lib/content.ts で重ねる）
 * - コンポーネントに直書きしていた固定文言はここの UI 辞書に集約する
 */

export const LOCALES = ["ja", "ko"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "ja"

export function isLocale(v: string | null | undefined): v is Locale {
  return v === "ja" || v === "ko"
}

/** ロケールを付けたパス。path は "/" または "/tournaments" の形で渡す */
export function localePath(locale: Locale, path: string = "/"): string {
  const p = path === "" ? "/" : path
  if (locale === DEFAULT_LOCALE) return p
  return p === "/" ? `/${locale}` : `/${locale}${p}`
}

/** hreflang 用の代替URL一覧（Next.js の metadata.alternates.languages に渡す） */
export function languageAlternates(path: string = "/"): Record<string, string> {
  return {
    ja: localePath("ja", path),
    ko: localePath("ko", path),
    "x-default": localePath(DEFAULT_LOCALE, path),
  }
}

/** 公開URLの基点。NEXT_PUBLIC_SITE_URL → Vercel本番URL → localhost の順に使う */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (prod) return `https://${prod}`
  return "http://localhost:3000"
}

export const LANGUAGE_NAMES: Record<Locale, { short: string; label: string; htmlLang: string; ogLocale: string }> = {
  ja: { short: "JP", label: "日本語", htmlLang: "ja", ogLocale: "ja_JP" },
  ko: { short: "KR", label: "한국어", htmlLang: "ko", ogLocale: "ko_KR" },
}

const UI = {
  ja: {
    languageSwitch: "言語を切り替える",
    siteMap: "Site Map",
    logoAlt: "輝蹴会 ロゴ",
    // 料金・募集
    popular: "いちばん人気",
    discount: "Discount",
    dmTemplateTitle: "DMで送っていただく内容",
    dmOpens: (ig: string) => `Instagram @${ig} が開きます`,
    // クラス一覧
    weekdaySuffix: "曜日",
    weekdayStrip: /曜日$/,
    seeInstagram: "Instagramを見る →",
    filterTitle: "対象で絞り込む / FILTER",
    filterAll: "ALL / 全て",
    countSuffix: (n: number) => `${n} 件`,
    noClasses: "No classes found",
    photoPlaceholder: (name: string) => `写真差し替え：${name}`,
    classFields: { target: "対象", who: "ねらい", schedule: "実施日時", style: "形式", monthly: "月謝" },
    tryThisClass: "このクラスを体験する",
    applyTrial: "無料体験に申し込む",
    // アクセス
    nearestStations: "最寄り駅",
    address: "所在地",
    // 大会情報
    tournamentColumns: { date: "開催日程", name: "大会名", venue: "会場", age: "対象年齢", url: "詳細" },
    seeDetails: "詳細を見る",
    noDetails: "詳細ページなし",
    detailsAria: (name: string) => `${name} の詳細を見る（新しいタブで開きます）`,
  },
  ko: {
    languageSwitch: "언어 변경",
    siteMap: "Site Map",
    logoAlt: "키슈카이(輝蹴会) 로고",
    popular: "가장 인기",
    discount: "Discount",
    dmTemplateTitle: "DM으로 보내 주실 내용",
    dmOpens: (ig: string) => `Instagram @${ig} 이(가) 열립니다`,
    weekdaySuffix: "요일",
    weekdayStrip: /요일$/,
    seeInstagram: "Instagram 보기 →",
    filterTitle: "대상별 보기 / FILTER",
    filterAll: "ALL / 전체",
    countSuffix: (n: number) => `${n}개`,
    noClasses: "No classes found",
    photoPlaceholder: (name: string) => `사진 교체 예정: ${name}`,
    classFields: { target: "대상", who: "목표", schedule: "수업 일시", style: "형식", monthly: "월 회비" },
    tryThisClass: "이 클래스 체험하기",
    applyTrial: "무료 체험 신청하기",
    nearestStations: "가까운 역",
    address: "주소",
    tournamentColumns: { date: "일정", name: "대회명", venue: "장소", age: "대상 연령", url: "상세" },
    seeDetails: "상세 보기",
    noDetails: "상세 페이지 없음",
    detailsAria: (name: string) => `${name} 상세 보기 (새 탭에서 열림)`,
  },
} satisfies Record<Locale, unknown>

export type Dict = (typeof UI)["ja"]

export function dict(locale: Locale): Dict {
  return UI[locale] as Dict
}

/** クラスの「対象」ラベル */
export const TARGET_LABELS: Record<Locale, Record<string, { label: string; en: string }>> = {
  ja: {
    preschool: { label: "幼児", en: "PRESCHOOL" },
    elementary: { label: "小学生", en: "ELEMENTARY" },
    teen: { label: "中学生〜高校生", en: "TEEN" },
    athlete: { label: "アスリート", en: "ATHLETE" },
    adult: { label: "大人", en: "ADULT" },
  },
  ko: {
    preschool: { label: "유아", en: "PRESCHOOL" },
    elementary: { label: "초등학생", en: "ELEMENTARY" },
    teen: { label: "중학생~고등학생", en: "TEEN" },
    athlete: { label: "애슬리트", en: "ATHLETE" },
    adult: { label: "성인", en: "ADULT" },
  },
}
