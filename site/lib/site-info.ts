/**
 * 構造化データ（JSON-LD）とローカルSEOで使う施設情報。
 * 戦略の前提は docs/SEO_STRATEGY.md を参照。会場が変わったらここと
 * 管理画面の「アクセス」「フッター」の住所をあわせて更新する。
 */
export const FACILITY = {
  /** 仮会場 */
  postalCode: "162-0054",
  addressRegion: "東京都",
  addressLocality: "新宿区",
  streetAddress: "河田町3-16 施設C棟",
  addressCountry: "JP",
  /** 通塾圏として打ち出す区 */
  areaServed: ["新宿区", "千代田区", "中央区"],
} as const

/** 「〒162-0054 東京都新宿区河田町3-16 施設C棟」の形 */
export function facilityAddressText(): string {
  const f = FACILITY
  return `〒${f.postalCode} ${f.addressRegion}${f.addressLocality}${f.streetAddress}`
}

/** Googleマップの検索URL（座標は未確定のため住所で検索させる） */
export function mapSearchUrl(address: string = facilityAddressText()): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
