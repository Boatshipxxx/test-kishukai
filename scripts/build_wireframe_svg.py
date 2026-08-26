#!/usr/bin/env python3
"""輝蹴会TOP整理ワイヤーフレームを Figma 取り込み用の編集可能SVGとして書き出す。

FigmaのキャンバスにSVGをドラッグ＆ドロップすると、<g id="…"> がレイヤー名として
展開され、矩形・テキストを個別に編集できる。

    python3 scripts/build_wireframe_svg.py [出力ディレクトリ]
"""
import pathlib
import sys

W = 460          # アートボード幅
PAD = 20         # 外周余白
GAP = 10         # ブロック間
FONT = "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"

INK = "#1a1a1a"
LINE = "#222222"
BAR = "#d9d9d9"
BARD = "#9a9a9a"
MUTED = "#666666"
KEEP_BG, KEEP_FG = "#111111", "#ffffff"
SHRK_BG, SHRK_FG = "#e8c227", "#111111"
CUT_BD, CUT_BG = "#c0392b", "#fdf0ee"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


class Board:
    """y方向に流し込みでブロックを積むSVGビルダー。"""

    def __init__(self, title, subtitle):
        self.parts = []
        self.y = PAD
        self._head(title, subtitle)

    # ---- 低レベル部品 -------------------------------------------------
    def rect(self, x, y, w, h, fill, stroke=None, rx=0, dash=None, sw=1.5):
        d = f' stroke-dasharray="6 4"' if dash else ""
        st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        self.parts.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" fill="{fill}"{st}{d}/>')

    def text(self, x, y, s, size=11, weight=400, fill=INK, anchor="start"):
        self.parts.append(
            f'<text x="{x:.0f}" y="{y:.0f}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>'
        )

    def bar(self, x, y, w, h=8, fill=BAR, rx=4):
        self.rect(x, y, w, h, fill, rx=rx)

    def imgbox(self, x, y, w, h):
        self.rect(x, y, w, h, "#ffffff", stroke="#aaaaaa")
        self.parts.append(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x + w:.0f}" y2="{y + h:.0f}" stroke="#c4c4c4" stroke-width="1.5"/>')
        self.parts.append(f'<line x1="{x + w:.0f}" y1="{y:.0f}" x2="{x:.0f}" y2="{y + h:.0f}" stroke="#c4c4c4" stroke-width="1.5"/>')

    def btn(self, x, y, w, label, dark=True, h=22, rx=0):
        self.rect(x, y, w, h, "#111111" if dark else "#ffffff", stroke=None if dark else "#111111", rx=rx)
        self.text(x + w / 2, y + h / 2 + 3.5, label, size=10, weight=700,
                  fill="#ffffff" if dark else "#111111", anchor="middle")

    def chip(self, x, y, status):
        label = {"keep": "維持", "shrink": "縮小", "cut": "削除候補"}[status]
        w = 40 if status != "cut" else 62
        if status == "keep":
            self.rect(x, y, w, 18, KEEP_BG)
            self.text(x + w / 2, y + 13, label, 10, 700, KEEP_FG, "middle")
        elif status == "shrink":
            self.rect(x, y, w, 18, SHRK_BG)
            self.text(x + w / 2, y + 13, label, 10, 700, SHRK_FG, "middle")
        else:
            self.rect(x, y, w, 18, "#ffffff", stroke=CUT_BD)
            self.text(x + w / 2, y + 13, label, 10, 700, CUT_BD, "middle")
        return w

    # ---- ブロック -----------------------------------------------------
    def _head(self, title, subtitle):
        self.parts.append(f'<g id="タイトル">')
        self.text(PAD, self.y + 15, title, 17, 700)
        self.y += 24
        for line in subtitle:
            self.text(PAD, self.y + 12, line, 10.5, 400, MUTED)
            self.y += 15
        self.parts.append("</g>")
        self.y += 8

    def block(self, name, status, sketch, note=None, dark=None):
        """sketch(b, x, y, w) -> content height"""
        x, w = PAD, W - PAD * 2
        cx, cw = x + 14, w - 28
        gid = esc(name)
        self.parts.append(f'<g id="{gid}">')
        top = self.y
        cy = top + 12
        if status:
            chw = self.chip(cx, cy, status)
            self.text(cx + chw + 8, cy + 13.5, name, 13, 700)
            cy += 26
        else:
            if dark == "#f3e08a":
                label_fill = "#5c4800"
            elif dark:
                label_fill = "#e8c988"
            else:
                label_fill = "#444444"
            self.text(cx, cy + 12, name, 11, 700, label_fill)
            cy += 22
        ch = sketch(self, cx, cy, cw)
        cy += ch
        if note:
            cy += 6
            for line in note:
                self.text(cx, cy + 10, line, 10.5, 400, MUTED)
                cy += 15
        h = cy - top + 12
        # 枠を最背面に挿入するため、ブロック開始位置に差し込む
        if status == "cut":
            frame = (f'<rect x="{x}" y="{top}" width="{w}" height="{h:.0f}" fill="{CUT_BG}" '
                     f'stroke="{CUT_BD}" stroke-width="1.5" stroke-dasharray="6 4"/>')
        else:
            stroke = {"keep": LINE, "shrink": "#b48f00", None: LINE}[status]
            fill = dark if dark else "#ffffff"
            frame = f'<rect x="{x}" y="{top}" width="{w}" height="{h:.0f}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>'
        idx = self.parts.index(f'<g id="{gid}">') + 1
        self.parts.insert(idx, frame)
        self.parts.append("</g>")
        self.y = top + h + GAP

    def svg(self):
        h = self.y + PAD - GAP
        body = "\n".join(self.parts)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{h:.0f}" '
            f'viewBox="0 0 {W} {h:.0f}">\n'
            f'<rect id="背景" width="{W}" height="{h:.0f}" fill="#f4f4f2"/>\n{body}\n</svg>'
        )


# ---- スケッチ部品（sketch関数群） ------------------------------------
def sk_nav(b, x, y, w):
    b.bar(x, y + 4, 70, 8, BARD)
    b.bar(x + 80, y + 4, w - 80 - 78, 8)
    b.btn(x + w - 70, y - 3, 70, "無料体験")
    return 24


def sk_hero(dark_bar, tate=False):
    def f(b, x, y, w):
        hi = "#e8e8e8" if dark_bar else BARD
        lo = "#5a5a5a" if dark_bar else BAR
        tw = w - 26 if tate else w
        b.bar(x, y, tw * 0.86, 22, hi)
        b.bar(x, y + 28, tw * 0.6, 22, hi)
        b.bar(x, y + 58, tw * 0.9, 8, lo)
        b.btn(x, y + 74, 132, "無料体験に申し込む")
        b.btn(x + 140, y + 74, 110, "世界への挑戦", dark=False)
        if tate:
            b.bar(x + w - 12, y, 12, 96, lo, rx=6)
        return 104
    return f


def sk_grid(cols, cell_h, rows=1, rx=0, second_dashed=False):
    def f(b, x, y, w):
        gap = 6
        cw = (w - gap * (cols - 1)) / cols
        for r in range(rows):
            for c in range(cols):
                cx, cy = x + c * (cw + gap), y + r * (cell_h + gap)
                if second_dashed and r == rows - 1 and c == cols - 1:
                    b.rect(cx, cy, cw, cell_h, "#ffffff", stroke="#999999", dash=True, rx=rx)
                    b.btn(cx + cw / 2 - 30, cy + cell_h / 2 - 9, 60, "体験へ", h=18)
                else:
                    b.bar(cx, cy, cw, cell_h, BAR, rx=rx)
        return rows * cell_h + (rows - 1) * gap
    return f


def sk_imggrid(cols, cell_h, rows=1, second_dashed=False):
    def f(b, x, y, w):
        gap = 6
        cw = (w - gap * (cols - 1)) / cols
        for r in range(rows):
            for c in range(cols):
                cx, cy = x + c * (cw + gap), y + r * (cell_h + gap)
                if second_dashed and r == rows - 1 and c == cols - 1:
                    b.rect(cx, cy, cw, cell_h, "#ffffff", stroke="#999999", dash=True)
                    b.btn(cx + cw / 2 - 30, cy + cell_h / 2 - 9, 60, "体験へ", h=18)
                else:
                    b.imgbox(cx, cy, cw, cell_h)
        return rows * cell_h + (rows - 1) * gap
    return f


def sk_imgtext(b, x, y, w):
    iw = w * 0.46
    b.imgbox(x, y, iw, 56)
    tx = x + iw + 8
    tw = w - iw - 8
    b.bar(tx, y + 6, tw, 8)
    b.bar(tx, y + 20, tw * 0.8, 8)
    b.bar(tx, y + 34, tw * 0.6, 8)
    return 56


def sk_rows(n):
    def f(b, x, y, w):
        for i in range(n):
            b.bar(x, y + i * 14, w, 8)
        return n * 14 - 6
    return f


def sk_banner(b, x, y, w):
    b.bar(x, y + 4, w - 120, 8)
    b.btn(x + w - 110, y - 2, 110, "協賛のご相談", dark=False, h=20)
    return 22


def sk_cta(b, x, y, w):
    b.btn(x + w / 2 - 70, y, 140, "無料体験に申し込む")
    return 24


def sk_plans(b, x, y, w):
    gap = 6
    cw = (w - gap * 2) / 3
    b.bar(x, y, cw, 46, BAR, rx=8)
    b.bar(x + cw + gap, y, cw, 46, BARD, rx=8)
    b.bar(x + (cw + gap) * 2, y, cw, 46, BAR, rx=8)
    return 46


def sk_filter(b, x, y, w):
    labels = ["ALL", "KIDS", "JUNIOR", "ATHLETE", "ADULT"]
    cx = x
    for s in labels:
        bw = 8.4 * len(s) + 22
        b.btn(cx, y, bw, s, dark=False, h=20)
        cx += bw + 6
    return 22


# ---- 各アートボード ---------------------------------------------------
def board_b_inventory():
    b = Board("現状の棚卸し — 案B TOP（全15ブロック）",
              ["黒=維持 ／ 金=縮小 ／ 赤破線=削除候補。判断基準：保護者の体験申込に近づく要素か"])
    b.block("1. ヘッダー", "keep", sk_nav, ["主接点への常設導線。このまま。"])
    b.block("2. ヒーロー", "keep", sk_hero(False), ["KICK TO THE WORLD＋キャッチ＋CTA×2。ページの顔。"])
    b.block("3. ヒーロー下 データ4項目", "cut", sk_grid(4, 30), ["出場／対象／クラス／体験。他セクションと重複。"])
    b.block("4. 保護者への3つの約束", "keep", sk_grid(3, 44), ["安・世・情。主接点（保護者）の不安に直結する核。"])
    b.block("5. 世界への挑戦", "shrink", sk_imgtext,
            ["写真4枚＋遠征データ表5行は重い。写真1＋引用＋リンクの帯へ。", "差別化の核なので削除はしない。"])
    b.block("6. クラスの絞り込みフィルタ", "cut", sk_filter, ["全5クラスに絞り込みは過剰。一覧で見渡せる。"])
    b.block("7. クラスカード×5＋体験誘導", "shrink", sk_imggrid(3, 46),
            ["カード内の明細5行（対象/ねらい/日時/形式/月謝）→ 3行に。"])
    b.block("8. 料金プラン×3", "keep", sk_plans, ["ライト／レギュラー／プレミアム。入会判断の必須情報。"])
    b.block("9. 料金明細（入会金・年会費・道着）", "cut", sk_rows(3), ["TOPでは3プランまで。明細は体験時案内／下層へ。"])
    b.block("10. 五大精神と「情」", "cut", sk_grid(5, 30), ["理念は「3つの約束」の情カードで代替し、詳細は下層へ。"])
    b.block("11. よくあるご質問×4", "cut", sk_rows(4), ["体験申込ページ側に移動。TOPの縦長化の主因。"])
    b.block("12. お知らせ×4", "cut", sk_rows(3), ["更新運用が決まるまで非表示。※要確認"])
    b.block("13. サポーター（協賛）", "shrink", sk_banner, ["副接点。3プラン表＋写真 → CTA上の1行バナーに。※要確認"])
    b.block("14. CTA（START YOUR FIRST KICK）", "keep", sk_cta, ["主接点の締め。このまま。"])
    b.block("15. フッター（6カラム）", "shrink", sk_grid(6, 26), ["リンクが多すぎる。3カラムへ。"])
    return b.svg()


def board_b_slim1():
    b = Board("整理案① 集中型（5ブロック）",
              ["体験申込への最短導線。世界への挑戦はヒーローと約束「世」に吸収。",
               "強み: 最短・迷わない ／ 弱み: WTCE遠征の押し出しが弱まる"])
    b.block("ヘッダー", None, sk_nav)
    b.block("1. ヒーロー", None, sk_hero(True), dark="#2b2b2b")
    b.block("2. 保護者への3つの約束（安・世・情）", None, sk_grid(3, 44))
    b.block("3. クラス一覧（簡略カード×5）", None, sk_imggrid(3, 44, rows=2, second_dashed=True),
            ["カード明細は 対象／日時／形式 の3行まで"])
    b.block("4. 料金プラン×3（明細なし）", None, sk_plans)
    b.block("5. CTA（無料体験）＋協賛1行", None, sk_cta, dark="#2b2b2b")
    b.block("フッター（3カラム）", None, sk_grid(3, 24))
    return b.svg()


def board_b_slim2():
    b = Board("整理案② 差別化キープ（6ブロック）",
              ["WTCE遠征を「帯」1枚に圧縮して残す推奨案。",
               "強み: 差別化と簡潔さの両立 ／ 弱み: 案①より1画面ぶん長い"])
    b.block("ヘッダー", None, sk_nav)
    b.block("1. ヒーロー", None, sk_hero(True), dark="#2b2b2b")
    b.block("2. 保護者への3つの約束（安・世・情）", None, sk_grid(3, 44))
    b.block("3. 世界への挑戦（帯に圧縮）", None, sk_imgtext,
            ["写真1枚＋引用1文＋リンクのみ。データ表・ギャラリーは下層へ"], dark="#2b2b2b")
    b.block("4. クラス一覧（簡略カード×5）", None, sk_imggrid(3, 44, rows=2, second_dashed=True),
            ["フィルタなし・カード明細は3行まで"])
    b.block("5. 料金プラン×3（明細なし）", None, sk_plans)
    b.block("協賛バナー（1行）", None, sk_banner, dark="#f3e08a")
    b.block("6. CTA（START YOUR FIRST KICK）", None, sk_cta, dark="#2b2b2b")
    b.block("フッター（3カラム）", None, sk_grid(3, 24))
    return b.svg()


def board_a_inventory():
    b = Board("案A「情」現状の棚卸し（全12ブロック）",
              ["判断基準・チップの見方は案Bと共通"])
    b.block("1. ヘッダー", "keep", sk_nav, ["主接点への常設導線。このまま。"])
    b.block("2. ヒーロー（縦書きキャッチ含む）", "keep", sk_hero(False, tate=True),
            ["「蹴り出す一歩が、世界へつながる。」＋縦書きキャッチ。Aの顔。"])
    b.block("3. 保護者への3つの約束", "keep", sk_grid(3, 44, rx=8), ["主接点（保護者）の不安に直結する核。"])
    b.block("4. 世界への挑戦（写真4＋引用＋本文）", "shrink", sk_imgtext,
            ["写真1枚＋引用＋リンクの帯へ圧縮。ギャラリーと本文3段落は下層へ。"])
    b.block("5. 私たちの理念（五大精神＋情）", "cut", sk_grid(5, 30),
            ["下層「私たちの理念」ページが既にある。TOPは約束の情カードで代替。"])
    b.block("6. クラスカード×5", "shrink", sk_grid(3, 46, rx=8), ["カード内の説明文を1行に。詳細は下層へ。"])
    b.block("7. 料金プラン×3", "keep", sk_plans, ["入会判断の必須情報。注記1行のみ添える。"])
    b.block("8. よくあるご質問×4", "cut", sk_rows(4), ["体験申込ページ（trial）に同内容があるため重複。"])
    b.block("9. お知らせ×3", "cut", sk_rows(3), ["更新運用が決まるまで非表示。※要確認"])
    b.block("10. サポーター（協賛）", "shrink", sk_banner, ["濃紺の大セクション → CTA上の1行バナーへ。"])
    b.block("11. CTA（まずは、無料体験から。）", "keep", sk_cta, ["主接点の締め。このまま。"])
    b.block("12. フッター（3カラム）", "keep", sk_grid(3, 26), ["元から3カラムで適量。このまま。"])
    return b.svg()


def board_a_slim():
    b = Board("案A 整理案（6ブロック）",
              ["案B整理案②と同じ情報設計に揃えた削減版。", "A/Bはトーン違いの同構成として比較できます。"])
    b.block("ヘッダー", None, sk_nav)
    b.block("1. ヒーロー（縦書きキャッチ維持）", None, sk_hero(True, tate=True), dark="#2e3a57")
    b.block("2. 保護者への3つの約束（安・世・情）", None, sk_grid(3, 44, rx=8))
    b.block("3. 世界への挑戦（帯に圧縮）", None, sk_imgtext, dark="#2e3a57")
    b.block("4. クラス一覧（簡略カード×5）", None, sk_grid(3, 44, rows=2, rx=8, second_dashed=True))
    b.block("5. 料金プラン×3（明細なし）", None, sk_plans)
    b.block("協賛バナー（1行）", None, sk_banner, dark="#f3e08a")
    b.block("6. CTA（まずは、無料体験から。）", None, sk_cta, dark="#b8474a")
    b.block("フッター（3カラム）", None, sk_grid(3, 24))
    return b.svg()


def main():
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("dist/wireframes")
    out.mkdir(parents=True, exist_ok=True)
    boards = {
        "b1-genjo-tanaoroshi": board_b_inventory(),
        "b2-seirian1-shuchu": board_b_slim1(),
        "b3-seirian2-sabetsuka": board_b_slim2(),
        "a1-genjo-tanaoroshi": board_a_inventory(),
        "a2-seirian": board_a_slim(),
    }
    for name, svg in boards.items():
        p = out / f"wf-{name}.svg"
        p.write_text(svg, encoding="utf-8")
        print("wrote", p, f"({len(svg.encode('utf-8')) / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
