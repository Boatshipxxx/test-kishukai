import { useMemo, useState } from "react"

/* =========================================================
   輝蹴会 リブランディング — デザイン案B「ATHLETIC」
   高コントラスト（黒 × 輝ゴールド）／角丸なし／ヘアライン罫
   内容はデザイン案A（静的HTML版）と同一の情報設計に準拠
   ========================================================= */

type Target = "kids" | "junior" | "athlete" | "adult"

type DojoClass = {
  name: string
  english: string
  target: Target
  who: string
  schedule: string
  style: string
  monthly: string
  blurb: string
  tone: "navy" | "blood" | "gold"
}

type TargetDef = {
  id: Target
  label: string
  en: string
}

const TARGETS: TargetDef[] = [
  { id: "kids", label: "幼児〜小学生", en: "KIDS" },
  { id: "junior", label: "小中学生", en: "JUNIOR" },
  { id: "athlete", label: "選手育成", en: "ATHLETE" },
  { id: "adult", label: "大人・保護者", en: "ADULT" },
]

const CLASSES: DojoClass[] = [
  {
    name: "キッズ・デベロップメント",
    english: "KIDS DEVELOPMENT",
    target: "kids",
    who: "運動神経の土台づくりと礼儀作法",
    schedule: "月・水・金 16:30 – 17:30",
    style: "非接触",
    monthly: "◯,◯◯◯円",
    blurb:
      "コーディネーショントレーニングとテコンドーを組み合わせ、走る・跳ぶ・バランスをとる力を養います。挨拶と礼から始めるので、はじめての習い事にも。",
    tone: "navy",
  },
  {
    name: "ベーシック・テクニック",
    english: "BASIC TECHNIQUE",
    target: "junior",
    who: "基礎習得・姿勢改善・柔軟性向上",
    schedule: "月・水・金 17:40 – 18:50",
    style: "非接触",
    monthly: "◯,◯◯◯円",
    blurb:
      "基本の立ち方、ストレッチ、正確な蹴りのフォーム、基本の型（プムセ）。上達の軸になるクラスで、昇級審査の課題もここで仕上げます。",
    tone: "blood",
  },
  {
    name: "アクロバット・キック",
    english: "ACROBATIC KICK",
    target: "junior",
    who: "カッコいい蹴りを跳びたい君へ",
    schedule: "火 17:40 – 18:50",
    style: "マット使用",
    monthly: "◯,◯◯◯円",
    blurb:
      "540度キックや跳び蹴り、トリッキングなど、テコンドーならではの華麗な足技に特化。基礎クラスと併せて受講するのがおすすめです。",
    tone: "gold",
  },
  {
    name: "選手育成クラス",
    english: "ATHLETE",
    target: "athlete",
    who: "世界を目指す競技志向の選手に",
    schedule: "月・水・金 19:00 – 20:10",
    style: "防具着用",
    monthly: "◯,◯◯◯円",
    blurb:
      "防具を完全着用したライトコンタクトの対人練習と、競技ルールに基づくトレーニング。国内大会から世界の舞台までを見据えます。指導者の推薦制。",
    tone: "navy",
  },
  {
    name: "カーディオ・テコンドー",
    english: "CARDIO TAEKWONDO",
    target: "adult",
    who: "お子さまと一緒に、健康づくりとストレス発散",
    schedule: "火 19:00 – 20:10",
    style: "非接触",
    monthly: "◯,◯◯◯円",
    blurb:
      "音楽に合わせてステップと蹴りを続ける非接触の有酸素クラス。体幹強化・柔軟性向上に効果的で、対人練習はありません。",
    tone: "blood",
  },
]

const TENETS = [
  { k: "礼儀", en: "YE UI", d: "礼に始まり、礼に終わる" },
  { k: "廉恥", en: "YOM CHI", d: "恥を知る心" },
  { k: "忍耐", en: "IN NAE", d: "積み上げた分だけ、形になる" },
  { k: "克己", en: "GUK GI", d: "勝つべき相手は、いつも自分" },
  { k: "百折不屈", en: "BAEKJUL BOOLGOOL", d: "百回折れても、屈しない" },
]

const PLANS = [
  {
    name: "ライト",
    en: "LIGHT",
    price: "月4回",
    note: "習い事の掛け持ちや、まずは無理なく始めたい方に。週1回ペースでじっくり。",
    featured: false,
  },
  {
    name: "レギュラー",
    en: "REGULAR",
    price: "通い放題",
    note: "スケジュールから好きなクラスを選んで通い放題。上達がいちばん早い主力プラン。",
    featured: true,
  },
  {
    name: "プレミアム",
    en: "PREMIUM",
    price: "通い放題＋PT",
    note: "通い放題に加え、月数回のパーソナル指導つき。選手志向の方に。",
    featured: false,
  },
]

const NEWS = [
  {
    date: "2026.08.01",
    cat: "遠征",
    title: "世界テコンドー文化エキスポ（韓国・茂朱）遠征レポートを公開しました",
  },
  {
    date: "2026.07.15",
    cat: "お知らせ",
    title: "夏休み特別スケジュールのご案内（現会員の皆さまへ）",
  },
  {
    date: "2026.07.06",
    cat: "試合結果",
    title: "◯◯県テコンドー選手権大会 出場報告（差し替え）",
  },
  {
    date: "2026.06.28",
    cat: "地域活動",
    title: "地域スポーツ体験会にブース出展しました — 活動実績を更新",
  },
]

const FAQ = [
  {
    q: "まったくの初心者・運動が苦手でも大丈夫ですか？",
    a: "ストライプ（テープ）制度で、一人ひとりのペースに合わせて小さな目標を積み重ねます。体の使い方は言葉で説明するので、見て真似るのが苦手なお子さまでも進められます。",
  },
  {
    q: "ケガが心配です。組手（対人練習）はありますか？",
    a: "キッズ・ジュニアクラスは型（プムセ）とミット練習が中心の非接触カリキュラムです。対人練習は選手育成クラスのみで、防具を完全着用したライトコンタクトに限定しています。",
  },
  {
    q: "月謝のほかにかかる費用を教えてください。",
    a: "入会金、年会費（スポーツ保険を含む）、道着代、昇級審査料が別途かかります。防具は選手育成クラスに進む段階で必要になり、それまではレンタルで対応できます。",
  },
  {
    q: "見学や体験はできますか？",
    a: "随時受け付けています。体験は無料で、持ち物は飲みものとタオルのみ。保護者の方は見学席から最後までご覧いただけます。",
  },
]

type FooterColumn = {
  name: string
  links: string[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    name: "ABOUT",
    links: ["私たちの理念", "五大精神と「情」", "指導の3本柱", "指導者紹介"],
  },
  {
    name: "PROGRAM",
    links: ["キッズ", "ベーシック", "アクロバット", "選手育成", "カーディオ"],
  },
  {
    name: "WORLD",
    links: ["WTCE遠征レポート", "遠征の記録", "保護者の声", "国際交流"],
  },
  {
    name: "JOIN",
    links: ["無料体験", "入会までの流れ", "料金プラン", "よくある質問"],
  },
  {
    name: "SUPPORT",
    links: ["一口協賛", "年間サポーター", "現物協賛", "地域活動実績"],
  },
  {
    name: "CONTACT",
    links: ["お問い合わせ", "アクセス", "お知らせ", "現行サイト"],
  },
]

const NAV = [
  { en: "ABOUT", ja: "理念" },
  { en: "WORLD", ja: "世界への挑戦" },
  { en: "PROGRAM", ja: "クラス" },
  { en: "PRICE", ja: "料金" },
  { en: "NEWS", ja: "お知らせ" },
  { en: "SUPPORT", ja: "協賛" },
]

const TONES: Record<DojoClass["tone"], string> = {
  navy: "linear-gradient(135deg, #16305c 0%, #000 78%)",
  blood: "linear-gradient(135deg, #8f1418 0%, #000 78%)",
  gold: "linear-gradient(135deg, #8a7405 0%, #000 78%)",
}

/* ---------- 小さな部品 ---------- */

function Photo({
  label,
  tone,
  className = "",
}: {
  label: string
  tone: DojoClass["tone"]
  className?: string
}) {
  return (
    <div className={"relative overflow-hidden bg-neutral-900 " + className}>
      <div className="absolute inset-0" style={{ background: TONES[tone] }} />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(420px 240px at 68% 26%, rgba(255,255,255,0.22), transparent 62%)",
        }}
      />
      <span className="absolute bottom-0 left-0 right-0 bg-black/75 text-white/80 font-display text-[11px] tracking-[0.14em] px-3 py-1.5">
        {label}
      </span>
    </div>
  )
}

function SectionHead({
  en,
  ja,
  lead,
  invert = false,
}: {
  en: string
  ja: string
  lead?: string
  invert?: boolean
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="font-display text-gold tracking-[0.3em] text-xs">{en}</p>
      <h2
        className={
          "font-display text-4xl md:text-5xl font-bold uppercase leading-none mt-2 " +
          (invert ? "text-white" : "text-black")
        }
      >
        {ja}
      </h2>
      {lead ? (
        <p
          className={
            "mt-4 text-sm leading-relaxed " +
            (invert ? "text-white/70" : "text-black/60")
          }
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}

function GoldButton({
  children,
  href = "#",
}: {
  children: React.ReactNode
  href?: string
}) {
  return (
    <a
      href={href}
      className="inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 bg-gold text-black border border-gold hover:bg-black hover:text-gold transition-colors duration-150"
    >
      {children}
    </a>
  )
}

function GhostButton({
  children,
  href = "#",
  onDark = false,
}: {
  children: React.ReactNode
  href?: string
  onDark?: boolean
}) {
  return (
    <a
      href={href}
      className={
        "inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 border transition-colors duration-150 " +
        (onDark
          ? "border-white/40 text-white hover:bg-gold hover:text-black hover:border-gold"
          : "border-black text-black hover:bg-black hover:text-white")
      }
    >
      {children}
    </a>
  )
}

/* ---------- ページ ---------- */

export default function App() {
  const [target, setTarget] = useState<Target | "all">("all")
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const filtered = useMemo(
    () => CLASSES.filter((c) => target === "all" || c.target === target),
    [target],
  )

  return (
    <div className="min-h-screen bg-white text-black">
      {/* デモ表示 */}
      <div className="fixed bottom-4 right-4 z-60 bg-black text-gold font-display text-[11px] tracking-[0.2em] px-3 py-1.5 border border-gold/40 pointer-events-none">
        DESIGN B / ATHLETIC
      </div>

      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="mx-auto max-w-[1240px] flex items-center justify-between px-4 h-16">
          <a href="#top" className="flex items-center gap-3">
            <svg
              viewBox="0 0 40 40"
              className="h-8 w-8 shrink-0"
              aria-hidden="true"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#f4de1e"
                strokeWidth="2"
              />
              <path
                d="M20 2 A18 18 0 0 1 20 38 A9 9 0 0 1 20 20 A9 9 0 0 0 20 2Z"
                fill="#d8232a"
              />
              <path
                d="M20 38 A18 18 0 0 1 20 2 A9 9 0 0 1 20 20 A9 9 0 0 0 20 38Z"
                fill="#f4de1e"
              />
            </svg>
            <span className="leading-none">
              <span className="font-display text-2xl font-bold tracking-tight">
                輝蹴会
              </span>
              <span className="block font-display text-[9px] tracking-[0.22em] text-white/50 mt-1">
                KISHUKAI TAEKWONDO
              </span>
            </span>
          </a>
          <nav className="hidden lg:flex items-center">
            {NAV.map((item) => (
              <a
                key={item.en}
                href="#"
                className="font-display text-sm uppercase tracking-wide px-4 py-2 border-l border-white/15 hover:bg-gold hover:text-black transition-colors duration-150"
              >
                {item.en}
              </a>
            ))}
            <a
              href="#trial"
              className="font-display text-sm uppercase tracking-wide px-5 py-2 ml-3 bg-gold text-black hover:bg-white transition-colors duration-150"
            >
              無料体験
            </a>
          </nav>
          <a
            href="#trial"
            className="lg:hidden font-display uppercase bg-gold text-black px-3 py-1.5 text-sm"
          >
            無料体験
          </a>
        </div>
      </header>

      {/* ヒーロー */}
      <section
        id="top"
        className="relative bg-black text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-25">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(720px 420px at 78% 10%, rgba(244,222,30,0.35), transparent 62%), radial-gradient(560px 400px at 8% 100%, rgba(216,35,42,0.45), transparent 62%)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-[1240px] px-4 pt-16 pb-14">
          <p className="font-display text-gold tracking-[0.3em] text-xs">
            KISHUKAI TAEKWONDO ACADEMY
          </p>
          <h1 className="font-display text-[15vw] leading-[0.86] md:text-[8.5rem] font-bold uppercase mt-3">
            KICK TO
            <br />
            THE <span className="text-gold">WORLD</span>
          </h1>
          <p className="mt-6 font-display text-xl md:text-2xl tracking-wide">
            蹴り出す一歩が、世界へつながる。
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            輝蹴会は、単なる格闘技道場ではありません。世界テコンドー文化エキスポの舞台で子どもたちが体験した、国境も言葉も越える温かな「情（ジョン）」。その心を育む、武道アカデミーです。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <GoldButton href="#trial">無料体験に申し込む</GoldButton>
            <GhostButton href="#world" onDark>
              世界への挑戦を見る
            </GhostButton>
          </div>
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/15 border border-white/15">
            {[
              ["出場", "世界テコンドー文化エキスポ"],
              ["対象", "幼児〜小中学生・大人"],
              ["クラス", "5クラス / 週6日"],
              ["体験", "無料・見学のみも可"],
            ].map(([label, value]) => (
              <div key={label} className="bg-black px-4 py-4">
                <dt className="font-display text-[10px] tracking-[0.2em] text-gold">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="stripes h-3" />
      </section>

      {/* 3つの約束 */}
      <section className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHead
          en="OUR PROMISE"
          ja="保護者への3つの約束"
          lead="はじめての武道でも大丈夫。輝蹴会が大切にしている、安心して通っていただくための約束です。"
        />
        <div className="grid gap-px bg-black/15 border border-black/15 md:grid-cols-3">
          {[
            {
              k: "安",
              t: "安全に、段階的に",
              d: "スポーツ科学に基づいた段階的カリキュラム。基礎の型とミット練習が中心で、防具着用の対人練習は選手クラスのみです。",
            },
            {
              k: "世",
              t: "世界とつながる",
              d: "韓国・茂朱のWTCE遠征をはじめ、世界中のテコンドーファミリーとの交流機会。国際感覚は道場の外では得がたい財産です。",
            },
            {
              k: "情",
              t: "心を育てる",
              d: "強さは、仲間を思いやり、弱者を守るための力。指導者・選手・保護者が「情」で結ばれた第二の家族として育みます。",
            },
          ].map((item) => (
            <div key={item.k} className="bg-white p-7">
              <span className="inline-block bg-gold text-black font-display text-3xl font-bold leading-none px-3 py-2">
                {item.k}
              </span>
              <h3 className="font-display text-xl font-bold mt-5">{item.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/60">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 世界への挑戦 */}
      <section id="world" className="bg-black text-white">
        <div className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHead
            en="CHALLENGE TO THE WORLD"
            ja="世界への挑戦"
            lead="韓国・茂朱（ムジュ）で開催された世界テコンドー文化エキスポ。子どもたちが現地で受け取ったものは、大会の結果よりも大きなものでした。"
            invert
          />
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Photo
                label="写真差し替え：WTCE開会式 — 子どもたちの躍動する蹴り"
                tone="navy"
                className="aspect-[16/9]"
              />
              <div className="grid grid-cols-3 gap-px bg-white/15 border border-white/15 border-t-0">
                <Photo
                  label="現地の仲間と"
                  tone="blood"
                  className="aspect-square"
                />
                <Photo
                  label="演武の瞬間"
                  tone="gold"
                  className="aspect-square"
                />
                <Photo
                  label="茂朱の会場にて"
                  tone="navy"
                  className="aspect-square"
                />
              </div>
            </div>
            <div>
              <p className="border-l-4 border-gold pl-5 font-display text-lg leading-relaxed">
                国境や言葉の壁を越えて、いつでも気軽に挨拶を交わし、子どもたち全員に優しく接してくれる。この温かい「情」の体験こそが、私たちが目指す人間教育のゴールです。
              </p>
              <dl className="mt-8 border-t border-white/15 text-sm">
                {[
                  ["大会", "世界テコンドー文化エキスポ"],
                  ["開催地", "韓国・茂朱（ムジュ）"],
                  ["日程", "◯年◯月◯日〜◯日（差し替え）"],
                  ["参加", "選手◯名 / 引率◯名（差し替え）"],
                  ["成績", "（差し替え）"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex border-b border-white/15 py-3"
                  >
                    <dt className="w-24 shrink-0 font-display uppercase text-xs tracking-wide text-gold pt-0.5">
                      {label}
                    </dt>
                    <dd className="flex-1 text-white/80">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7">
                <GhostButton href="#" onDark>
                  遠征レポートを読む
                </GhostButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* クラス一覧（フィルタ） */}
      <section id="program" className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHead
          en="PROGRAM"
          ja="クラス一覧"
          lead="目的とレベルに合わせて選べるクラス編成。ストライプ（テープ）制度で、毎月の小さな達成感を大切にします。"
        />

        <div className="border border-black">
          <div className="bg-black text-white px-4 py-3 font-display uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="bg-gold text-black px-1.5">＋</span> 対象で絞り込む
            / FILTER
          </div>
          <div className="p-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTarget("all")}
              className={
                "font-display uppercase text-sm px-4 py-2 border border-black transition-colors duration-150 " +
                (target === "all"
                  ? "bg-gold text-black"
                  : "bg-white text-black hover:bg-black hover:text-white")
              }
            >
              ALL / 全て
            </button>
            {TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTarget(t.id)}
                className={
                  "font-display uppercase text-sm px-4 py-2 border border-black transition-colors duration-150 " +
                  (target === t.id
                    ? "bg-gold text-black"
                    : "bg-white text-black hover:bg-black hover:text-white")
                }
              >
                {t.en}
                <span className="ml-2 font-body text-xs normal-case opacity-70">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline justify-between border-b-2 border-black pb-2 mt-8 mb-6">
          <h3 className="font-display uppercase text-2xl font-bold tracking-wide">
            Classes
          </h3>
          <span className="font-display text-sm text-black/60">
            {filtered.length} 件
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-black/50 font-display uppercase tracking-widest">
            No classes found
          </p>
        ) : (
          <div className="grid gap-px bg-black/15 border border-black/15 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <article key={c.name} className="group bg-white flex flex-col">
                <div className="relative">
                  <Photo
                    label={"写真差し替え：" + c.name}
                    tone={c.tone}
                    className="aspect-[3/2]"
                  />
                  <span className="absolute top-0 left-0 bg-gold text-black font-display uppercase text-xs tracking-wide px-2 py-1">
                    {TARGETS.find((t) => t.id === c.target)?.en}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-display text-xl font-bold uppercase leading-none">
                    {c.english}
                  </h4>
                  <p className="text-sm font-bold mt-1.5">{c.name}</p>
                  <p className="text-sm text-black/60 mt-2 leading-relaxed">
                    {c.blurb}
                  </p>
                  <dl className="mt-4 text-sm border-t border-black/15">
                    {[
                      [
                        "対象",
                        TARGETS.find((t) => t.id === c.target)?.label ?? "",
                      ],
                      ["ねらい", c.who],
                      ["実施日時", c.schedule],
                      ["形式", c.style],
                      ["月謝", c.monthly],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex border-b border-black/15 py-2"
                      >
                        <dt className="w-20 shrink-0 font-display uppercase text-xs text-black/70 pt-0.5">
                          {label}
                        </dt>
                        <dd className="flex-1">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <a
                    href="#trial"
                    className="mt-5 text-center font-display uppercase tracking-wide text-sm px-4 py-2.5 bg-black text-white hover:bg-gold hover:text-black transition-colors duration-150"
                  >
                    このクラスを体験する
                  </a>
                </div>
              </article>
            ))}
            <div className="bg-black text-white p-7 flex flex-col justify-center">
              <p className="font-display text-gold tracking-[0.3em] text-xs">
                TRIAL
              </p>
              <h4 className="font-display text-2xl font-bold mt-3 leading-tight">
                どのクラスが合うかは、
                <br />
                体験してから決められます。
              </h4>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">
                持ち物は飲みものとタオルだけ。お子さまの様子を見て、いちばん合うクラスをご提案します。見学のみのご参加も歓迎です。
              </p>
              <a
                href="#trial"
                className="mt-6 text-center font-display uppercase tracking-wide text-sm px-4 py-3 bg-gold text-black hover:bg-white transition-colors duration-150"
              >
                無料体験に申し込む
              </a>
            </div>
          </div>
        )}
        <p className="mt-4 text-xs text-black/50">
          ※ 曜日・時間・月謝はすべて差し替え項目です。確定内容に置き換えます。
        </p>
      </section>

      {/* 料金 */}
      <section id="price" className="bg-fog border-y border-black/15">
        <div className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHead
            en="PRICE"
            ja="料金プラン"
            lead="通う回数で選ぶ3つのプラン。プラン内であればクラスは自由に組み合わせられます。"
          />
          <div className="grid gap-px bg-black/15 border border-black/15 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={
                  "p-7 flex flex-col " +
                  (p.featured ? "bg-black text-white" : "bg-white")
                }
              >
                <div className="flex items-center justify-between">
                  <p
                    className={
                      "font-display uppercase tracking-[0.2em] text-xs " +
                      (p.featured ? "text-gold" : "text-black/50")
                    }
                  >
                    {p.en}
                  </p>
                  {p.featured ? (
                    <span className="bg-gold text-black font-display text-[10px] tracking-widest px-2 py-0.5">
                      いちばん人気
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-2xl font-bold mt-3">
                  {p.name}
                </h3>
                <p className="font-display text-4xl font-bold mt-4 tabular-nums">
                  {p.price}
                </p>
                <p
                  className={
                    "mt-1 font-display text-sm " +
                    (p.featured ? "text-gold" : "text-black/50")
                  }
                >
                  ◯,◯◯◯円 / 月
                </p>
                <p
                  className={
                    "mt-4 text-sm leading-relaxed " +
                    (p.featured ? "text-white/70" : "text-black/60")
                  }
                >
                  {p.note}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-px border border-black/15 border-t-0 bg-white">
            <dl className="text-sm">
              {[
                ["入会金", "◯,◯◯◯円（兄弟姉妹は2人目以降◯％割引）"],
                ["年会費・保険", "◯,◯◯◯円 / 年（スポーツ保険を含む）"],
                [
                  "道着・防具",
                  "入会後しばらくはレンタルで開始可。昇級に応じてご案内します。",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex border-b border-black/15 last:border-b-0 px-5 py-3"
                >
                  <dt className="w-32 shrink-0 font-display uppercase text-xs text-black/70 pt-0.5">
                    {label}
                  </dt>
                  <dd className="flex-1">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 text-xs text-black/50">
            ※ 金額はすべて差し替え項目です。
          </p>
        </div>
      </section>

      {/* 五大精神 */}
      <section id="about" className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHead
          en="OUR PHILOSOPHY"
          ja="五大精神と「情」"
          lead="テコンドーには、技よりも先に学ぶべき五つの心があります。輝蹴会はそこに、韓国文化の核心である「情（ジョン）」の温かさを重ねて指導します。"
        />
        <div className="grid gap-px bg-black/15 border border-black/15 sm:grid-cols-2 lg:grid-cols-5">
          {TENETS.map((t) => (
            <div
              key={t.k}
              className="bg-white p-6 hover:bg-gold transition-colors duration-150"
            >
              <p className="font-display text-3xl font-bold leading-none">
                {t.k}
              </p>
              <p className="font-display text-[10px] tracking-[0.2em] text-black/50 mt-2">
                {t.en}
              </p>
              <p className="text-sm mt-4 leading-relaxed">{t.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-px border border-black/15 border-t-0 bg-black text-white p-8 flex flex-col md:flex-row gap-6 items-start">
          <span className="font-display text-6xl font-bold text-gold leading-none shrink-0">
            情
          </span>
          <p className="text-sm leading-relaxed text-white/75">
            <strong className="text-white">「情（ジョン）」とは、</strong>
            理屈や損得を越えて人と人を結ぶ、韓国の温かな心のあり方です。百折不屈の精神で身につけた強さを、他者を傷つけるためではなく、仲間を思いやり、弱い立場の人を守るための力へと昇華させる——そこまでを含めて、輝蹴会のテコンドーと考えています。
          </p>
        </div>
      </section>

      {/* Q&A */}
      <section className="bg-fog border-y border-black/15">
        <div className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHead en="Q &amp; A" ja="よくあるご質問" />
          <div className="border border-black/15 bg-white">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className="border-b border-black/15 last:border-b-0"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gold transition-colors duration-150"
                >
                  <span className="font-display text-sm font-bold w-6 shrink-0 text-black/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-bold text-sm">{f.q}</span>
                  <span className="font-display text-lg leading-none shrink-0">
                    {openFaq === i ? "−" : "＋"}
                  </span>
                </button>
                {openFaq === i ? (
                  <p className="px-5 pb-5 pl-15 text-sm text-black/60 leading-relaxed">
                    {f.a}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="mx-auto max-w-[1240px] px-4 py-16">
        <div className="flex items-end justify-between border-b-2 border-black pb-3 mb-2">
          <div>
            <p className="font-display text-gold tracking-[0.3em] text-xs">
              NEWS
            </p>
            <h2 className="font-display text-4xl font-bold uppercase leading-none mt-2">
              お知らせ
            </h2>
          </div>
          <a
            href="#"
            className="font-display uppercase text-sm border-b border-black hover:text-black/50 hover:border-black/30 transition-colors"
          >
            View all
          </a>
        </div>
        <ul>
          {NEWS.map((n) => (
            <li key={n.title} className="border-b border-black/15">
              <a
                href="#"
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 py-4 group hover:bg-fog transition-colors duration-150 px-1"
              >
                <time className="font-display text-sm text-black/50 tabular-nums w-28 shrink-0">
                  {n.date}
                </time>
                <span className="font-display text-xs tracking-widest border border-black px-2 py-0.5 w-fit shrink-0 group-hover:bg-gold transition-colors">
                  {n.cat}
                </span>
                <span className="text-sm flex-1">{n.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* サポーター */}
      <section id="support" className="bg-gold text-black">
        <div className="mx-auto max-w-[1240px] px-4 py-16 grid gap-10 lg:grid-cols-[1fr_0.8fr] items-center">
          <div>
            <p className="font-display tracking-[0.3em] text-xs">SUPPORTER</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase leading-none mt-2">
              輝蹴会サポーター
            </h2>
            <p className="mt-5 text-sm leading-relaxed">
              世界大会への遠征、地域でのスポーツ体験会。輝蹴会の活動は、地域の企業・団体の皆さまのご支援に支えられています。一口からのご協賛で、地域の子どもたちの世界への挑戦を応援いただけます。
            </p>
            <div className="mt-7 grid gap-px bg-black/20 border border-black/20 sm:grid-cols-3">
              {[
                ["一口協賛", "◯,◯◯◯円 / 口", "サイトにお名前を掲載"],
                ["年間サポーター", "◯◯,◯◯◯円 / 年", "ロゴ掲出＋活動報告書"],
                ["現物・サービス", "個別相談", "用具・輸送・会場など"],
              ].map(([name, price, note]) => (
                <div key={name} className="bg-gold p-4">
                  <p className="font-display text-sm font-bold">{name}</p>
                  <p className="font-display text-lg font-bold mt-1 tabular-nums">
                    {price}
                  </p>
                  <p className="text-xs mt-1 text-black/60">{note}</p>
                </div>
              ))}
            </div>
            <div className="mt-7">
              <a
                href="#"
                className="inline-block font-display uppercase tracking-wide text-sm px-7 py-3.5 bg-black text-gold hover:bg-white hover:text-black transition-colors duration-150"
              >
                協賛のご相談はこちら
              </a>
            </div>
          </div>
          <Photo
            label="写真差し替え：地域スポーツ体験会の様子"
            tone="navy"
            className="aspect-[4/3] border border-black/20"
          />
        </div>
      </section>

      {/* CTA */}
      <section id="trial" className="bg-black text-white">
        <div className="stripes h-3" />
        <div className="mx-auto max-w-[1240px] px-4 py-16 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase leading-none">
            Start Your <span className="text-gold">First Kick</span>
          </h2>
          <p className="font-display text-xl mt-4">まずは、無料体験から。</p>
          <p className="mt-4 text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            道着がなくても、運動が苦手でも大丈夫。持ち物は飲みものとタオルだけ。保護者の方は見学席から最後までご覧いただけます。見学のみのご参加も歓迎です。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <GoldButton>無料体験に申し込む</GoldButton>
            <GhostButton onDark>クラス・料金を見る</GhostButton>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-black text-white border-t border-white/15">
        <div className="mx-auto max-w-[1240px] px-4 py-14">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-display text-3xl font-bold tracking-tight">
              輝蹴会
              <span className="ml-2 bg-gold text-black px-1.5 text-xl align-middle">
                KISHUKAI
              </span>
            </span>
          </div>
          <p className="font-display uppercase tracking-[0.3em] text-gold text-sm border-b border-white/15 pb-2 mb-6">
            Site Map
          </p>
          <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.name}>
                <h4 className="font-display uppercase text-sm font-bold border-l-2 border-gold pl-2 mb-3">
                  {col.name}
                </h4>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-white/60 hover:text-gold transition-colors duration-150"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-white/40 leading-relaxed">
              会場・住所・電話番号（差し替え項目）
              <br />
              世界とつながり、豊かな人間性を育むテコンドーアカデミー
            </p>
            <div className="flex gap-2">
              {["IG", "X", "YT", "LINE"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="h-9 w-9 grid place-items-center bg-white/10 font-display text-xs hover:bg-gold hover:text-black transition-colors duration-150"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-8 text-xs text-white/30 font-display tracking-wide">
            © 2026 輝蹴会 KISHUKAI — REBRANDING DEMO / DESIGN B.
          </p>
        </div>
      </footer>
    </div>
  )
}
