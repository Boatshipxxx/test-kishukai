#!/usr/bin/env python3
"""輝蹴会デモサイト：下層ページを生成する。

ヘッダー・フッターを1か所で管理するためのジェネレータ。
出力される .html はビルド不要でそのまま開ける静的ファイル。

    python3 scripts/build_pages.py
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

NAV = [
    ("about.html", "私たちの理念"),
    ("world.html", "世界への挑戦"),
    ("programs.html", "クラス・料金"),
    ("news.html", "お知らせ"),
    ("supporter.html", "サポーター"),
]

BRAND = """    <a class="brand" href="index.html" aria-label="輝蹴会 トップへ">
      <svg class="mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M20 2 A18 18 0 0 1 20 38 A9 9 0 0 1 20 20 A9 9 0 0 0 20 2Z" fill="#C8373B"/>
        <path d="M20 38 A18 18 0 0 1 20 2 A9 9 0 0 1 20 20 A9 9 0 0 0 20 38Z" fill="#2456A6"/>
      </svg>
      <span>
        <span class="name">輝蹴会</span>
        <span class="sub">KISHUKAI TAEKWONDO ACADEMY</span>
      </span>
    </a>"""

FOOTER = """<footer class="site">
  <div class="wrap">
    <div>
      <p class="brandline">輝蹴会</p>
      <p style="margin-top:12px">世界とつながり、豊かな人間性を育む<br>テコンドーアカデミー</p>
    </div>
    <div>
      <h4>サイトマップ</h4>
      <ul>
        <li><a href="about.html">私たちの理念</a></li>
        <li><a href="world.html">世界への挑戦（遠征レポート）</a></li>
        <li><a href="programs.html">クラス・料金案内</a></li>
        <li><a href="supporter.html">輝蹴会サポーター（助成・協賛）</a></li>
        <li><a href="news.html">お知らせ</a></li>
      </ul>
    </div>
    <div>
      <h4>お問い合わせ</h4>
      <ul>
        <li><a href="trial.html">体験入会のお申し込み</a></li>
        <li><a href="supporter.html">協賛のご相談</a></li>
        <li><a href="https://kishusports.work/">現行サイト（kishusports.work）</a></li>
      </ul>
    </div>
  </div>
  <p class="legal">© 2026 輝蹴会 KISHUKAI — Rebranding Demo</p>
</footer>"""


def shell(slug, title, desc, body, script=""):
    items = "\n".join(
        '      <li><a href="{}"{}>{}</a></li>'.format(
            href, ' aria-current="page"' if href == slug else "", label
        )
        for href, label in NAV
    )
    return f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{desc}">
<title>{title}</title>
<link rel="stylesheet" href="assets/site.css">
</head>
<body>

<div class="demo-ribbon">REBRANDING DEMO</div>

<header class="site">
  <div class="wrap nav">
{BRAND}
    <ul>
{items}
    </ul>
    <a class="btn btn-primary" href="trial.html">無料体験</a>
  </div>
</header>

<main>
{body}
</main>

{FOOTER}
{script}
</body>
</html>
"""


def head(crumb, eyebrow, h1, lead):
    return f"""  <section class="page-head">
    <div class="wrap">
      <p class="crumbs"><a href="index.html">HOME</a><i>›</i>{crumb}</p>
      <p class="eyebrow">{eyebrow}</p>
      <h1>{h1}</h1>
      <p>{lead}</p>
    </div>
  </section>"""


def cta(title, text, buttons):
    btns = "\n".join(f"        {b}" for b in buttons)
    return f"""  <section class="cta-band">
    <div class="section wrap">
      <h2>{title}</h2>
      <p>{text}</p>
      <div class="cta-row">
{btns}
      </div>
    </div>
  </section>"""


# =========================================================
# 私たちの理念
# =========================================================
ABOUT = head(
    "私たちの理念",
    "Our Philosophy",
    "私たちの理念 — 五大精神と「情」",
    "テコンドーには、技よりも先に学ぶべき五つの心があります。輝蹴会はそこに、韓国文化の核心である「情（ジョン）」の温かさを重ねて指導します。強さと優しさの調和こそ、私たちが子どもたちに手渡したいものです。",
) + """

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Five Tenets</p>
        <h2>テコンドー五大精神</h2>
        <p>昇級審査で問われるのは技だけではありません。稽古のたびに、この五つの言葉に立ち返ります。</p>
      </div>
      <div class="spirit-detail">
        <div class="card">
          <p class="k">礼儀</p>
          <div>
            <h3>礼に始まり、礼に終わる <span style="font-size:11px;letter-spacing:.18em;color:var(--muted)">YE UI</span></h3>
            <p>道場に入るときの一礼、相手への挨拶。技を交わす相手がいてはじめて稽古が成り立つことを、動作で覚えます。学校や家庭での挨拶が変わったと、保護者の方から最初に言われるのがこの部分です。</p>
          </div>
        </div>
        <div class="card">
          <p class="k">廉恥</p>
          <div>
            <h3>恥を知る心 <span style="font-size:11px;letter-spacing:.18em;color:var(--muted)">YOM CHI</span></h3>
            <p>恥を知る心。手を抜いた自分、弱い者に強く当たった自分を、自分で恥じられるようになること。勝敗よりも、そのふるまいを指導者が見ています。</p>
          </div>
        </div>
        <div class="card">
          <p class="k">忍耐</p>
          <div>
            <h3>積み上げた分だけ、形になる <span style="font-size:11px;letter-spacing:.18em;color:var(--muted)">IN NAE</span></h3>
            <p>蹴りは一日では上がりません。柔軟も、型も、積み上げた分だけ形になります。「できないこと」に向き合う時間そのものを稽古と考えます。</p>
          </div>
        </div>
        <div class="card">
          <p class="k">克己</p>
          <div>
            <h3>勝つべき相手は、いつも自分 <span style="font-size:11px;letter-spacing:.18em;color:var(--muted)">GUK GI</span></h3>
            <p>勝つべき相手は、いつも自分。悔しさや怖さから逃げない選択を、小さな場面で繰り返します。試合はその力を測る場のひとつにすぎません。</p>
          </div>
        </div>
        <div class="card" style="grid-column:1/-1">
          <p class="k">百折不屈</p>
          <div>
            <h3>百回折れても、屈しない <span style="font-size:11px;letter-spacing:.18em;color:var(--muted)">BAEKJUL BOOLGOOL</span></h3>
            <p>百回折れても屈しない。輝蹴会がもっとも大切にしている言葉です。そしてここで身につけた強さは、他者を傷つけるためのものではありません。仲間を思いやり、弱い立場の人を守るための力へと昇華させる——そこまでを含めて、百折不屈と考えています。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Jung</p>
        <h2>輝蹴会の核心 — <span style="white-space:nowrap">韓国の「情（ジョン）」</span></h2>
      </div>
      <div class="jung">
        <div class="glyph">情</div>
        <p><strong>「情（ジョン）」とは、</strong>理屈や損得を越えて人と人を結ぶ、韓国の温かな心のあり方です。世界テコンドー文化エキスポの会場で、世界中の指導者や選手が、言葉の通じない日本の子どもたち全員に気軽に挨拶を交わし、優しく接してくれました。あの体験を道場の日常に持ち帰ることが、私たちの人間教育のゴールです。</p>
      </div>
      <div class="split" style="margin-top:44px">
        <div class="prose">
          <h3>第二の家族としての道場</h3>
          <p>輝蹴会は、指導者・選手・保護者が「情」で結ばれたコミュニティであることを大切にしています。上級生が下級生の帯を結び直す、試合に負けた仲間に誰かが必ず声をかける。そうした場面が自然に起きる場であることが、カリキュラムと同じくらい重要だと考えています。</p>
          <p class="pull">世界の人々と一つの精神体に。国境や言葉の壁を越えて、同じ礼で始まり同じ礼で終わる。</p>
          <h3>「厳しさ」の位置づけ</h3>
          <p>怒鳴って従わせる指導は行いません。ただし、礼を欠いた行い・仲間を傷つける言動には、その場ではっきりと向き合います。<strong>厳しさは規律にではなく、人への態度に向ける</strong>——これが輝蹴会の線引きです。</p>
        </div>
        <div class="aside-box">
          <h3>保護者の方へお伝えしていること</h3>
          <ul>
            <li>できない技を人前で責めることはしません</li>
            <li>体格差のある対人練習は組みません</li>
            <li>見学はいつでも可能です</li>
            <li>ご家庭での様子の変化を共有してください</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">How We Teach</p>
        <h2>指導の3本柱</h2>
        <p>精神論だけに頼らず、誰でも安全に上達できる仕組みとして整えています。</p>
      </div>
      <div class="cards3">
        <div class="card">
          <p class="kanji">言</p>
          <h3>言語化して伝える</h3>
          <p>「見て盗め」ではなく、体の使い方と力学を言葉で説明します。軸足の向き、膝の抜き方、骨盤の回し方。理解して動けば、家でも復習できます。</p>
        </div>
        <div class="card">
          <p class="kanji">段</p>
          <h3>小さな達成を積む</h3>
          <p>帯の色が変わるまでの数か月を待たせません。ストライプ（テープ）制度で、習得した技ごとに前進が目に見えるようにしています。</p>
        </div>
        <div class="card">
          <p class="kanji">守</p>
          <h3>安全を最優先に</h3>
          <p>キッズ・ジュニアは型（プムセ）とミット打ちが中心の非接触カリキュラム。対人練習は選手育成クラスで、防具を完全着用したうえで行います。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section top0">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Instructors</p>
        <h2>指導者紹介</h2>
        <p class="note">※ 氏名・段位・指導歴・写真は差し替え項目です。ご提供いただいた内容に置き換えます。</p>
      </div>
      <div class="people">
        <div class="person">
          <p class="av">主</p>
          <h3>指導者名（差し替え）</h3>
          <p class="role">主任指導者 / 段位</p>
          <p>指導歴・大会実績・指導方針を3〜4行で。WTCE遠征の引率経験に触れると、保護者の安心感に直結します。</p>
        </div>
        <div class="person">
          <p class="av">指</p>
          <h3>指導者名（差し替え）</h3>
          <p class="role">指導員 / 段位</p>
          <p>担当クラスと得意分野（キッズ指導・アクロバット等）を記載。子どもとの関わり方が伝わる一文を添えます。</p>
        </div>
        <div class="person">
          <p class="av">補</p>
          <h3>指導者名（差し替え）</h3>
          <p class="role">アシスタント</p>
          <p>OB・OGや上級生が補助に入る体制であれば、その紹介を。上級生が下を見る文化は「情」の実例になります。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">A Class</p>
        <h2>クラスの流れ（60分）</h2>
        <p>はじめての日も、この順番で進みます。何をするか分かっていれば、緊張はずいぶん軽くなります。</p>
      </div>
      <ol class="timeline">
        <li>
          <p class="d">00 — 05</p>
          <h3>整列・礼</h3>
          <p>道場への一礼、指導者への挨拶。ここから稽古が始まります。</p>
        </li>
        <li>
          <p class="d">05 — 20</p>
          <h3>ウォームアップと柔軟</h3>
          <p>走る・跳ぶ・回る動きで体を温め、蹴りに必要な柔軟性を確保します。コーディネーション要素を多めに。</p>
        </li>
        <li>
          <p class="d">20 — 35</p>
          <h3>基本の蹴りとステップ</h3>
          <p>前蹴り・回し蹴り・横蹴りのフォーム確認。鏡と指導者のチェックで、正しい形を体に入れます。</p>
        </li>
        <li>
          <p class="d">35 — 55</p>
          <h3>ミット打ち／型（プムセ）</h3>
          <p>その日のテーマに応じて、ミットへの打ち込みか型の稽古。ストライプ取得に向けた課題技もここで練習します。</p>
        </li>
        <li>
          <p class="d">55 — 60</p>
          <h3>整理体操・礼</h3>
          <p>クールダウンと、その日にできたことの確認。最後にもう一度、礼で締めます。</p>
        </li>
      </ol>
    </div>
  </section>
""" + cta(
    "まずは、見て・体験してみてください。",
    "理念は言葉より、道場の空気で伝わります。見学だけのご参加も歓迎です。",
    ['<a class="btn" href="trial.html">無料体験に申し込む</a>',
     '<a class="btn btn-ghost" href="programs.html">クラス・料金を見る</a>'],
)


# =========================================================
# 世界への挑戦
# =========================================================
WORLD = head(
    "世界への挑戦",
    "Challenge to the World",
    "世界への挑戦 — WTCE遠征レポート",
    "韓国・茂朱（ムジュ）で開催された「世界テコンドー文化エキスポ（WTCE）」。輝蹴会の子どもたちが現地で受け取ったものは、大会の結果よりも大きなものでした。",
) + """

  <section class="section">
    <div class="wrap">
      <figure class="photo ph-a" style="aspect-ratio:21/9">
        <figcaption class="tag">写真差し替え：WTCE開会式 — 子どもたちの躍動する蹴り</figcaption>
      </figure>
      <div class="gallery">
        <figure class="photo ph-b"><figcaption class="tag">現地の仲間と</figcaption></figure>
        <figure class="photo ph-c"><figcaption class="tag">演武の瞬間</figcaption></figure>
        <figure class="photo ph-a"><figcaption class="tag">茂朱の会場にて</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="section top0">
    <div class="wrap split">
      <div class="prose">
        <h3>言葉が通じないのに、すぐに仲間になった</h3>
        <p>会場に着いて最初に驚いたのは、世界中から集まった指導者や選手が、日本から来た子どもたち全員に、当たり前のように声をかけてくれたことでした。言葉は通じません。それでも、同じ礼で始まり同じ礼で終わる稽古を共有しているだけで、子どもたちは数時間で笑い合うようになっていました。</p>
        <p class="pull">国境や言葉の壁を越えて、いつでも気軽に挨拶を交わし、子どもたち全員に優しく接してくれる。この温かい「情」の体験こそが、輝蹴会が目指す人間教育のゴールです。</p>
        <h3>技術のレベル差を、目で知る</h3>
        <p>世界の同年代がどんな蹴りを跳ぶのか。動画ではなく、同じフロアで見る意味は大きかったようです。帰国後、練習で自分から「もう一本」と言う回数がはっきり増えました。憧れは、言葉で与えるより見せるほうが早い——遠征の一番の収穫はそこでした。</p>
        <h3>保護者と一緒に行く遠征</h3>
        <p>移動、宿泊、食事。慣れない土地での数日間を、保護者の皆さまと一緒に乗り切りました。子ども同士だけでなく、家族同士が「情」で結ばれた第二の家族になっていく実感が、この遠征でいちばん強く残ったものです。</p>
        <p class="note">※ 本文・エピソードは制作概要をもとにしたデモ原稿です。実際の遠征記録・日程・成績に差し替えます。</p>
      </div>
      <div class="aside-box">
        <h3>遠征データ</h3>
        <ul>
          <li>大会名：世界テコンドー文化エキスポ（WTCE）</li>
          <li>開催地：韓国・茂朱（ムジュ）</li>
          <li>日程：◯年◯月◯日〜◯日（差し替え）</li>
          <li>参加：選手◯名／引率◯名（差し替え）</li>
          <li>成績・受賞：（差し替え）</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Itinerary</p>
        <h2>遠征の記録</h2>
        <p>出発から帰国までの5日間。日付・内容は実記録に差し替えます。</p>
      </div>
      <ol class="timeline">
        <li>
          <p class="d">DAY 1</p>
          <h3>日本を出発、茂朱へ</h3>
          <p>長い移動を終えて現地入り。翌日の会場下見を済ませ、子どもたちは緊張と興奮のまま就寝。</p>
        </li>
        <li>
          <p class="d">DAY 2</p>
          <h3>開会式・各国の選手との顔合わせ</h3>
          <p>世界各国の団体が集まる開会式。ここで初めて、自分たちが「世界のテコンドーファミリーの一員」であることを実感します。</p>
        </li>
        <li>
          <p class="d">DAY 3</p>
          <h3>演武・競技</h3>
          <p>これまで積み上げてきた型と蹴りを、世界の舞台で。結果以上に、大きな会場で臆さず動けたことが収穫でした。</p>
        </li>
        <li>
          <p class="d">DAY 4</p>
          <h3>国際交流プログラム</h3>
          <p>合同稽古と文化交流。言葉が通じないまま技を教え合い、写真を撮り合う。子どもたちが最も生き生きしていた一日です。</p>
        </li>
        <li>
          <p class="d">DAY 5</p>
          <h3>帰国、そして次の目標へ</h3>
          <p>空港での別れ際に交わした挨拶。帰りの機内では、もう次に跳びたい技の話をしていました。</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Voices</p>
        <h2>同行した保護者の声</h2>
        <p class="note">※ 掲載文はデモです。実際にいただいたコメントに差し替えます。</p>
      </div>
      <div class="voices">
        <div class="voice">
          <p>「試合の結果より、世界の子と身振り手振りで話している姿に驚きました。人見知りだった息子が、自分から輪に入っていったんです。」</p>
          <p class="who">小学5年生・保護者</p>
        </div>
        <div class="voice">
          <p>「現地の指導者の方が、うちの子だけでなく全員に同じように優しく接してくださって。テコンドーはこういう競技なんだと親のほうが学びました。」</p>
          <p class="who">中学1年生・保護者</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section top0">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">What's Next</p>
        <h2>これからの国際交流</h2>
      </div>
      <div class="cards3">
        <div class="card">
          <p class="kanji">次</p>
          <h3>次回遠征の計画</h3>
          <p>継続的に世界の舞台へ挑戦できるよう、次回の遠征を計画しています。対象クラス・費用の目安は決定次第お知らせします。</p>
        </div>
        <div class="card">
          <p class="kanji">交</p>
          <h3>海外道場との交流</h3>
          <p>遠征で生まれたつながりを一度で終わらせず、合同稽古やオンライン交流として続けていきます。</p>
        </div>
        <div class="card">
          <p class="kanji">迎</p>
          <h3>受け入れる側にも</h3>
          <p>いつか輝蹴会が海外の仲間を迎える側になること。それが「情」を返していく形だと考えています。</p>
        </div>
      </div>
    </div>
  </section>
""" + cta(
    "世界へ挑戦する一歩は、道場の初日から。",
    "遠征は特別な誰かのためのものではありません。まずは無料体験で、最初の一歩を。",
    ['<a class="btn" href="trial.html">無料体験に申し込む</a>',
     '<a class="btn btn-ghost" href="supporter.html">遠征を支える協賛について</a>'],
)


# =========================================================
# クラス・料金
# =========================================================
PROGRAMS = head(
    "クラス・料金案内",
    "Programs &amp; Pricing",
    "クラス・料金案内",
    "目的とレベルに合わせて選べるクラス編成。ストライプ（テープ）制度で、毎月の小さな達成感を大切にしています。",
) + """

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Classes</p>
        <h2>クラス一覧</h2>
        <p>どのクラスから始めればよいか迷う場合は、体験時にお子さまの様子を見てご提案します。</p>
      </div>
      <div class="prog-grid">
        <div class="prog">
          <span class="level">Kids</span>
          <h3>キッズ・デベロップメント</h3>
          <p class="who">運動神経の土台づくりと礼儀作法</p>
          <p>コーディネーショントレーニングとテコンドーを組み合わせ、走る・跳ぶ・バランスをとる力を養います。挨拶と礼から始めるので、はじめての習い事にも向いています。</p>
          <p class="meta"><span>幼児〜小学生</span><span>週1〜</span><span>非接触</span></p>
        </div>
        <div class="prog">
          <span class="level">Junior</span>
          <h3>ベーシック・テクニック</h3>
          <p class="who">基礎習得・姿勢改善・柔軟性向上</p>
          <p>基本の立ち方、ストレッチ、正確な蹴りのフォーム、基本の型（プムセ）。上達の軸になるクラスで、昇級審査の課題もここで仕上げます。</p>
          <p class="meta"><span>小中学生</span><span>週1〜2</span><span>非接触</span></p>
        </div>
        <div class="prog">
          <span class="level">Junior+</span>
          <h3>アクロバット・キック</h3>
          <p class="who">カッコいい蹴りを跳びたい君へ</p>
          <p>540度キックや跳び蹴り、トリッキングなど、テコンドーならではの華麗な足技に特化。基礎クラスと併せて受講するのがおすすめです。</p>
          <p class="meta"><span>小中学生</span><span>週1</span><span>マット使用</span></p>
        </div>
        <div class="prog">
          <span class="level">Athlete</span>
          <h3>選手育成クラス</h3>
          <p class="who">世界を目指す競技志向の選手に</p>
          <p>防具を完全着用したライトコンタクトの対人練習と、競技ルールに基づくトレーニング。国内大会から世界の舞台までを見据えます。指導者の推薦制です。</p>
          <p class="meta"><span>小中学生</span><span>週2〜</span><span>防具着用</span></p>
        </div>
        <div class="prog" style="grid-column:1/-1">
          <span class="level">Adult</span>
          <h3>カーディオ・テコンドー</h3>
          <p class="who">お子さまと一緒に、健康づくりとストレス発散</p>
          <p>音楽に合わせてステップと蹴りを続ける非接触の有酸素クラス。体幹強化・柔軟性向上・ヒップアップに効果的で、対人練習はありません。お子さまのレッスンを待つ時間が、そのままご自身の運動時間になります。</p>
          <p class="meta"><span>高校生以上</span><span>週1〜</span><span>非接触</span></p>
        </div>
      </div>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Schedule</p>
        <h2>週間スケジュール</h2>
        <p class="note">※ 曜日・時間・会場は差し替え項目です。確定スケジュールに置き換えます。</p>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr><th>時間</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="num">16:30 — 17:30</th>
              <td>キッズ</td><td>—</td><td>キッズ</td><td>—</td><td>キッズ</td><td>—</td>
            </tr>
            <tr>
              <th scope="row" class="num">17:40 — 18:50</th>
              <td>ベーシック</td><td>アクロバット</td><td>ベーシック</td><td>—</td><td>ベーシック</td><td>—</td>
            </tr>
            <tr>
              <th scope="row" class="num">19:00 — 20:10</th>
              <td>選手育成</td><td>カーディオ</td><td>選手育成</td><td>—</td><td>選手育成</td><td>—</td>
            </tr>
            <tr>
              <th scope="row" class="num">10:00 — 11:10</th>
              <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>キッズ／ベーシック</td>
            </tr>
            <tr>
              <th scope="row" class="num">11:20 — 12:40</th>
              <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>選手育成（合同）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Pricing</p>
        <h2>料金プラン</h2>
        <p>通う回数で選ぶ3つのプラン。プラン内であればクラスは自由に組み合わせられます。</p>
      </div>
      <div class="plans" style="margin-top:0">
        <div class="plan">
          <h3>ライト</h3>
          <p class="price">月4回<small>／月額</small></p>
          <p>習い事の掛け持ちや、まずは無理なく始めたい方に。週1回ペースでじっくり進めます。</p>
        </div>
        <div class="plan featured">
          <span class="flag">いちばん人気</span>
          <h3>レギュラー</h3>
          <p class="price">通い放題<small>／月額</small></p>
          <p>スケジュールから好きなクラスを選んで通い放題。上達がいちばん早い主力プランです。</p>
        </div>
        <div class="plan">
          <h3>プレミアム</h3>
          <p class="price">通い放題＋<small>パーソナル</small></p>
          <p>通い放題に加え、月数回のパーソナル指導（フォームチェック・ミット）付き。選手志向の方に。</p>
        </div>
      </div>

      <div class="table-wrap" style="margin-top:36px">
        <table class="tbl">
          <thead>
            <tr><th>項目</th><th>ライト</th><th>レギュラー</th><th>プレミアム</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">月謝</th><td class="num">◯,◯◯◯円</td><td class="num em">◯,◯◯◯円</td><td class="num">◯,◯◯◯円</td></tr>
            <tr><th scope="row">通える回数</th><td>月4回</td><td>通い放題</td><td>通い放題</td></tr>
            <tr><th scope="row">パーソナル指導</th><td>—</td><td>—</td><td>月◯回</td></tr>
            <tr><th scope="row">入会金</th><td colspan="3" class="num">◯,◯◯◯円（兄弟姉妹は2人目以降◯％割引）</td></tr>
            <tr><th scope="row">年会費・保険</th><td colspan="3" class="num">◯,◯◯◯円／年（スポーツ保険を含む）</td></tr>
            <tr><th scope="row">道着・防具</th><td colspan="3">入会後しばらくはレンタルで開始可。昇級に応じて必要な用具をご案内します。</td></tr>
          </tbody>
        </table>
      </div>
      <p class="note">※ 金額はすべて差し替え項目です。確定額に置き換えます。</p>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Progress</p>
        <h2>昇級のしくみ — 帯とストライプ</h2>
        <p>帯の色が変わるのは数か月に一度。その間の前進が見えるように、ストライプ（テープ）制度を併用しています。</p>
      </div>
      <div class="belts" role="img" aria-label="帯の進行：白・黄・緑・青・赤・黒">
        <span class="belt" style="background:#F2F2EE;color:#3A3A34">白</span>
        <span class="belt" style="background:#E8C33F;color:#3A2E05">黄</span>
        <span class="belt" style="background:#3E8E63">緑</span>
        <span class="belt" style="background:#2456A6">青</span>
        <span class="belt" style="background:#C8373B">赤</span>
        <span class="belt" style="background:#1A1A1A">黒</span>
      </div>
      <div class="split" style="margin-top:36px">
        <div class="prose">
          <h3>1か月ごとに、できたことが増える</h3>
          <p>課題の技をひとつ習得するたびに、帯にストライプが1本増えます。<strong>次の帯までの距離が数字で見える</strong>ので、「頑張っているのに変わらない」という停滞感が起きにくくなります。</p>
          <p>昇級審査では、技の正確さと同じ重みで、稽古中の礼と態度を見ます。技だけ上手でも上の帯は締められません。</p>
        </div>
        <div class="aside-box">
          <h3>審査でみるところ</h3>
          <ul>
            <li>基本の蹴りの正確さ</li>
            <li>型（プムセ）の完成度</li>
            <li>柔軟性・体力の伸び</li>
            <li>稽古中の礼と、仲間への態度</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">How to Join</p>
        <h2>入会までの流れ</h2>
      </div>
      <ol class="steps">
        <li>
          <h3>体験のお申し込み</h3>
          <p>フォームまたはお電話で、ご希望の日程をお知らせください。持ち物は不要です。</p>
        </li>
        <li>
          <h3>日程のご連絡</h3>
          <p>クラスの空き状況を確認し、当日のご案内（会場・服装・時間）をお送りします。</p>
        </li>
        <li>
          <h3>無料体験（60分）</h3>
          <p>通常クラスに参加いただきます。保護者の方は見学席から最後までご覧ください。</p>
        </li>
        <li>
          <h3>入会手続き</h3>
          <p>クラスとプランを決めて手続き。当日に決めていただく必要はありません。</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section top0">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Q &amp; A</p>
        <h2>費用と持ち物のご質問</h2>
      </div>
      <div class="faq">
        <details>
          <summary>初日に必要な持ち物はありますか？</summary>
          <p class="a">動きやすい服装（Tシャツ・ハーフパンツ）と飲みもの、タオルだけご用意ください。道着は体験時にはご用意いただかなくて結構です。素足で稽古します。</p>
        </details>
        <details>
          <summary>月謝のほかにかかる費用を教えてください。</summary>
          <p class="a">入会金、年会費（スポーツ保険を含む）、道着代、昇級審査料が別途かかります。防具は選手育成クラスに進む段階で必要になり、それまではレンタルで対応できます。</p>
        </details>
        <details>
          <summary>兄弟姉妹で通う場合の割引はありますか？</summary>
          <p class="a">2人目以降の月謝を割引しています。割引率は差し替え項目です。ご家族での参加を歓迎しています。</p>
        </details>
        <details>
          <summary>休んだ分の振替はできますか？</summary>
          <p class="a">レギュラー・プレミアムのプランは通い放題のため、別日のクラスにそのまま参加できます。ライトプランは同月内での振替に対応します。</p>
        </details>
      </div>
    </div>
  </section>
""" + cta(
    "クラス選びは、体験してから決められます。",
    "見学だけのご参加も歓迎です。お子さまの様子を見て、いちばん合うクラスをご提案します。",
    ['<a class="btn" href="trial.html">無料体験に申し込む</a>'],
)


# =========================================================
# お知らせ
# =========================================================
NEWS = head(
    "お知らせ",
    "News",
    "お知らせ",
    "遠征レポート、試合結果、スケジュール変更、地域での活動報告。現会員の皆さまと、入会をご検討中の方の両方に向けて更新しています。",
) + """

  <section class="section">
    <div class="wrap">
      <nav class="chips" aria-label="カテゴリ">
        <a class="chip" href="news.html" aria-current="true">すべて</a>
        <a class="chip" href="news.html">遠征</a>
        <a class="chip" href="news.html">試合結果</a>
        <a class="chip" href="news.html">お知らせ</a>
        <a class="chip" href="news.html">地域活動</a>
      </nav>
      <ul class="news">
        <li>
          <time datetime="2026-08-01">2026.08.01</time>
          <span class="cat red">遠征</span>
          <a href="world.html">世界テコンドー文化エキスポ（韓国・茂朱）遠征レポートを公開しました</a>
        </li>
        <li>
          <time datetime="2026-07-15">2026.07.15</time>
          <span class="cat">お知らせ</span>
          <a href="news.html">夏休み特別スケジュールのご案内（現会員の皆さまへ）</a>
        </li>
        <li>
          <time datetime="2026-07-06">2026.07.06</time>
          <span class="cat gold">試合結果</span>
          <a href="news.html">◯◯県テコンドー選手権大会 出場報告（差し替え）</a>
        </li>
        <li>
          <time datetime="2026-06-28">2026.06.28</time>
          <span class="cat">地域活動</span>
          <a href="supporter.html">地域スポーツ体験会にブース出展しました — 活動実績を更新</a>
        </li>
        <li>
          <time datetime="2026-06-14">2026.06.14</time>
          <span class="cat">お知らせ</span>
          <a href="programs.html">アクロバット・キッククラスを新設しました</a>
        </li>
        <li>
          <time datetime="2026-05-30">2026.05.30</time>
          <span class="cat gold">試合結果</span>
          <a href="news.html">昇級審査を実施しました（対象◯名・差し替え）</a>
        </li>
        <li>
          <time datetime="2026-05-11">2026.05.11</time>
          <span class="cat">お知らせ</span>
          <a href="supporter.html">輝蹴会サポーター（一口協賛）の募集を開始しました</a>
        </li>
        <li>
          <time datetime="2026-04-20">2026.04.20</time>
          <span class="cat">地域活動</span>
          <a href="news.html">小学校の放課後クラブでテコンドー体験会を行いました</a>
        </li>
      </ul>
      <p class="note">※ 記事はデモです。カテゴリ絞り込みとページ送りは本番実装時に有効化します。</p>
    </div>
  </section>

  <section class="section tint slim">
    <div class="wrap split">
      <div class="prose">
        <h3>お知らせの運用方針</h3>
        <p>遠征と試合結果は、入会を検討する保護者にとって<strong>「安心して預けられる団体か」を判断する材料</strong>そのものです。更新が止まっているサイトは、活動が止まって見えます。月1本以上の更新を前提に、書きやすい粒度で運用します。</p>
        <p>緊急の休講連絡など速報性が必要なものは、サイト掲載と併せて既存の連絡手段（メール・グループ連絡）を主にする想定です。</p>
      </div>
      <div class="aside-box">
        <h3>更新の目安</h3>
        <ul>
          <li>遠征・大会：終了後1週間以内に写真付きで</li>
          <li>昇級審査：実施報告を都度</li>
          <li>地域活動：協賛の説明材料として必ず記録</li>
          <li>スケジュール：長期休みの前に告知</li>
        </ul>
      </div>
    </div>
  </section>
""" + cta(
    "活動の様子を、実際に見に来てください。",
    "記事で伝わるのはほんの一部です。稽古は見学いつでも歓迎しています。",
    ['<a class="btn" href="trial.html">無料体験に申し込む</a>'],
)


# =========================================================
# サポーター
# =========================================================
SUPPORTER = head(
    "輝蹴会サポーター",
    "Supporter",
    "輝蹴会サポーター（助成・協賛）",
    "世界大会への遠征、地域でのスポーツ体験会。輝蹴会の活動は、地域の企業・団体の皆さまのご支援に支えられています。一口からのご協賛で、地域の子どもたちの世界への挑戦を応援いただけます。",
) + """

  <section class="section">
    <div class="wrap split">
      <div class="prose">
        <h3>ご支援をお願いしている理由</h3>
        <p>世界テコンドー文化エキスポのような国際大会への参加には、渡航費・滞在費・登録料がかかります。「世界を見る経験」を、家庭の事情に左右されず<strong>意欲のある子ども全員に届けたい</strong>——これが私たちがご支援をお願いしている理由です。</p>
        <p>また、地域の小学校や公共施設でのスポーツ体験会は無償で実施しています。テコンドーに触れる機会を地域に開くこと自体を、輝蹴会の役割だと考えています。用具の整備と運営は、ご協賛によって支えられています。</p>
        <h3>地域にお返しできること</h3>
        <ul>
          <li>子どもの運動機会・情操教育の場の提供</li>
          <li>学校・自治体イベントへの無償での体験会実施</li>
          <li>国際交流を経験した子どもたちが地域に戻ること</li>
        </ul>
        <p class="note">※ 金額・掲出条件・団体情報は差し替え項目です。</p>
      </div>
      <div class="aside-box">
        <h3>ご支援の使い道</h3>
        <ul>
          <li>国際大会・国内大会への遠征費補助</li>
          <li>防具・ミット・マットなど用具の整備</li>
          <li>地域スポーツ体験会の運営費</li>
          <li>指導者の資格取得・研修</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Plans</p>
        <h2>協賛プラン</h2>
        <p>ご予算とご希望に応じて、3つの形をご用意しています。現物・サービスでのご協賛も歓迎です。</p>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr><th>プラン</th><th>金額の目安</th><th>ご掲出・特典</th><th>期間</th></tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">一口協賛</th>
              <td class="num">◯,◯◯◯円／口</td>
              <td>公式サイトのサポーター一覧にお名前を掲載</td>
              <td>都度</td>
            </tr>
            <tr>
              <th scope="row">年間サポーター</th>
              <td class="num em">◯◯,◯◯◯円／年</td>
              <td>サイト掲載（ロゴ）＋遠征レポートでのご紹介＋活動報告書の送付</td>
              <td>1年</td>
            </tr>
            <tr>
              <th scope="row">現物・サービス協賛</th>
              <td>用具・輸送・会場・印刷など</td>
              <td>ご提供内容に応じて個別にご相談</td>
              <td>個別</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="note">※ 掲出方法・金額は差し替え項目です。団体の規約に沿って調整します。</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Exposure</p>
        <h2>ご掲出のイメージ</h2>
      </div>
      <div class="cards3">
        <div class="card">
          <p class="kanji">網</p>
          <h3>公式サイト</h3>
          <p>サポーター一覧ページとフッターにロゴ・企業名を掲載します。掲載サイズはプランに応じて調整します。</p>
        </div>
        <div class="card">
          <p class="kanji">報</p>
          <h3>遠征・活動レポート</h3>
          <p>遠征記や体験会の記事内で、ご支援いただいた旨をご紹介します。写真付きの記事は保護者・地域の方が最もよく読む記事です。</p>
        </div>
        <div class="card">
          <p class="kanji">場</p>
          <h3>会場・道着</h3>
          <p>体験会での掲出や、ユニフォームへのロゴ掲出についても個別にご相談を承ります。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section top0">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Track Record</p>
        <h2>地域活動の実績</h2>
        <p class="note">※ 実施記録はデモです。実際の日付・会場・参加人数に差し替えます。</p>
      </div>
      <ul class="news">
        <li>
          <time datetime="2026-06-28">2026.06.28</time>
          <span class="cat">体験会</span>
          <a href="news.html">地域スポーツ体験会にブース出展（参加◯名・差し替え）</a>
        </li>
        <li>
          <time datetime="2026-04-20">2026.04.20</time>
          <span class="cat">学校連携</span>
          <a href="news.html">小学校の放課後クラブでテコンドー体験会</a>
        </li>
        <li>
          <time datetime="2026-02-11">2026.02.11</time>
          <span class="cat">イベント</span>
          <a href="news.html">地域スポーツフェスティバルで演武を披露</a>
        </li>
      </ul>
    </div>
  </section>

  <section class="section tint slim">
    <div class="wrap prose" style="max-width:46em">
      <h3>財団助成・地域連携について</h3>
      <p>民間のご協賛と併せて、スポーツ振興・青少年育成を目的とした財団助成への申請、自治体・学校との連携も進めています。単年の寄付に依存せず、活動を継続できる財源の組み合わせをつくることが目標です。</p>
      <p>助成金の申請にあたっては、活動実績の記録と報告が要件になります。お知らせページでの活動報告を継続しているのは、この目的も兼ねています。</p>
    </div>
  </section>

  <section class="section supporter">
    <div class="wrap" style="text-align:center">
      <p class="eyebrow">Contact</p>
      <h2 style="font-size:clamp(24px,3.6vw,32px);margin:10px 0 16px">子どもたちの挑戦を、一緒に支えてください。</h2>
      <p style="margin:0 auto 28px;max-width:38em">ご協賛の内容・金額は、ご事情に合わせて柔軟にご相談を承ります。まずはお気軽にお問い合わせください。</p>
      <div class="cta-row">
        <a class="btn btn-gold" href="trial.html">協賛のご相談はこちら</a>
        <a class="btn btn-ghost" href="world.html">遠征レポートを見る</a>
      </div>
    </div>
  </section>
"""


# =========================================================
# 無料体験
# =========================================================
TRIAL_SCRIPT = """<script>
(function () {
  var form = document.getElementById('trial-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = 'デモサイトのため送信は行われません。本番ではこの内容が道場へ届き、折り返しご連絡する流れになります。';
    status.classList.add('on');
    status.focus();
  });
})();
</script>"""

TRIAL = head(
    "無料体験のお申し込み",
    "Free Trial",
    "無料体験のお申し込み",
    "道着がなくても、運動が苦手でも大丈夫。通常クラスに60分参加いただき、保護者の方は最後まで見学いただけます。見学だけのご参加も歓迎です。",
) + """

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Flow</p>
        <h2>お申し込みから体験当日まで</h2>
      </div>
      <ol class="steps">
        <li>
          <h3>フォームを送信</h3>
          <p>ご希望の日程を第2希望まで書いていただけると調整がスムーズです。</p>
        </li>
        <li>
          <h3>日程のご連絡</h3>
          <p>2営業日以内に、担当より会場・時間・服装をご案内します。</p>
        </li>
        <li>
          <h3>体験当日（60分）</h3>
          <p>10分前にお越しください。通常クラスに参加し、見学席から最後までご覧いただけます。</p>
        </li>
        <li>
          <h3>ご検討・入会手続き</h3>
          <p>その日に決める必要はありません。お子さまと相談してからご連絡ください。</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section top0">
    <div class="wrap split">
      <div>
        <p class="demo-note" style="margin-bottom:18px">これはリブランディング検討用のデモサイトです。フォームは接続されておらず、入力内容は送信・保存されません。</p>
        <form class="form" id="trial-form" novalidate>
          <p class="form-status" id="form-status" tabindex="-1" role="status"></p>
          <div class="form-row">
            <div class="field">
              <label for="guardian">保護者のお名前<span class="req">必須</span></label>
              <input id="guardian" name="guardian" type="text" autocomplete="name">
            </div>
            <div class="field">
              <label for="child">お子さまのお名前<span class="req">必須</span></label>
              <input id="child" name="child" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="grade">学年・年齢<span class="req">必須</span></label>
              <input id="grade" name="grade" type="text" placeholder="例：小学3年生">
            </div>
            <div class="field">
              <label for="klass">ご希望のクラス</label>
              <select id="klass" name="klass">
                <option>未定（当日ご提案ください）</option>
                <option>キッズ（幼児〜小学生）</option>
                <option>ベーシック（小中学生）</option>
                <option>アクロバット（小中学生）</option>
                <option>選手育成</option>
                <option>カーディオ（大人）</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="tel">お電話番号<span class="req">必須</span></label>
              <input id="tel" name="tel" type="tel" autocomplete="tel">
            </div>
            <div class="field">
              <label for="email">メールアドレス<span class="req">必須</span></label>
              <input id="email" name="email" type="email" autocomplete="email">
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="date1">体験希望日（第1希望）</label>
              <input id="date1" name="date1" type="date">
            </div>
            <div class="field">
              <label for="date2">体験希望日（第2希望）</label>
              <input id="date2" name="date2" type="date">
            </div>
          </div>
          <div class="field">
            <label for="message">ご質問・気になること</label>
            <textarea id="message" name="message" placeholder="運動経験、ケガや持病、送迎の都合など、気になることを何でもお書きください。"></textarea>
            <p class="hint">アレルギーや既往症がある場合は、当日の安全確認のためお知らせください。</p>
          </div>
          <div>
            <button class="btn btn-primary" type="submit">この内容で申し込む</button>
          </div>
        </form>
      </div>
      <div class="aside-box">
        <h3>当日のご案内</h3>
        <ul>
          <li>持ち物：飲みもの・タオル</li>
          <li>服装：Tシャツ・ハーフパンツ（素足で稽古します）</li>
          <li>所要：60分＋前後10分程度</li>
          <li>見学：保護者の方は見学席から最後まで</li>
          <li>費用：体験は無料。当日の勧誘は行いません</li>
          <li>キャンセル：前日までにご連絡ください</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section tint">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Q &amp; A</p>
        <h2>体験前によくいただくご質問</h2>
      </div>
      <div class="faq">
        <details>
          <summary>まったくの初心者・運動が苦手でも大丈夫ですか？</summary>
          <p class="a">大丈夫です。マイクロステップ制のカリキュラムで、一人ひとりのペースに合わせて小さな目標を積み重ねます。体の使い方は言葉で説明するので、見て真似るのが苦手なお子さまでも進められます。</p>
        </details>
        <details>
          <summary>ケガが心配です。組手（対人練習）はありますか？</summary>
          <p class="a">キッズ・ジュニアクラスは型（プムセ）とミット練習が中心の非接触カリキュラムです。対人練習は選手育成クラスのみで、防具を完全着用したライトコンタクトに限定しています。体験で対人練習を行うことはありません。</p>
        </details>
        <details>
          <summary>兄弟や友だちと一緒に体験できますか？</summary>
          <p class="a">可能です。フォームの「ご質問」欄に人数をお書きください。年齢が離れている場合は、それぞれに合うクラスをご案内します。</p>
        </details>
        <details>
          <summary>保護者も一緒に運動できますか？</summary>
          <p class="a">大人向けのカーディオ・テコンドークラスがあります。お子さまと同じ日程での体験もご相談ください。</p>
        </details>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap split">
      <div class="prose">
        <h3>アクセス</h3>
        <p><strong>会場：</strong>◯◯◯◯体育館 第2競技場（差し替え）<br>
        <strong>住所：</strong>◯◯県◯◯市◯◯ ◯-◯-◯（差し替え）<br>
        <strong>最寄：</strong>◯◯線◯◯駅から徒歩◯分／駐車場◯台（差し替え）</p>
        <p>お問い合わせ：◯◯◯-◯◯◯◯-◯◯◯◯（差し替え）／ メールは上記フォームから</p>
        <p class="note">※ 本番では地図（Googleマップ埋め込み）を設置します。</p>
      </div>
      <div class="aside-box">
        <h3>お急ぎの場合</h3>
        <ul>
          <li>稽古日は道場に直接お越しいただいても見学できます</li>
          <li>お電話でのお申し込みも承ります</li>
          <li>スケジュールは<a href="programs.html" style="color:var(--blue)">クラス・料金ページ</a>をご確認ください</li>
        </ul>
      </div>
    </div>
  </section>
"""


PAGES = [
    ("about.html", "私たちの理念 | 輝蹴会",
     "輝蹴会の理念。テコンドー五大精神（礼儀・廉恥・忍耐・克己・百折不屈）と韓国の「情（ジョン）」を軸にした指導方針、指導者紹介、クラスの流れ。", ABOUT, ""),
    ("world.html", "世界への挑戦 | 輝蹴会",
     "世界テコンドー文化エキスポ（韓国・茂朱）への遠征レポート。国際交流のエピソード、遠征の記録、保護者の声。", WORLD, ""),
    ("programs.html", "クラス・料金案内 | 輝蹴会",
     "輝蹴会のクラス編成と料金。キッズから選手育成、大人向けカーディオまで。週間スケジュール、料金プラン、昇級のしくみ、入会までの流れ。", PROGRAMS, ""),
    ("news.html", "お知らせ | 輝蹴会",
     "輝蹴会からのお知らせ。遠征レポート、試合結果、スケジュール、地域活動の報告。", NEWS, ""),
    ("supporter.html", "輝蹴会サポーター | 輝蹴会",
     "輝蹴会サポーター（助成・協賛）のご案内。一口協賛・年間サポーター・現物協賛のプラン、ご支援の使い道、地域活動の実績。", SUPPORTER, ""),
    ("trial.html", "無料体験のお申し込み | 輝蹴会",
     "輝蹴会の無料体験のお申し込み。持ち物不要・見学のみも歓迎。お申し込みから当日までの流れとよくあるご質問。", TRIAL, TRIAL_SCRIPT),
]


def main():
    for slug, title, desc, body, script in PAGES:
        (ROOT / slug).write_text(shell(slug, title, desc, body, script), encoding="utf-8")
        print("wrote", slug)


if __name__ == "__main__":
    main()
