#!/usr/bin/env python3
"""案B「ATHLETIC」のFigma用スタイルガイドSVGとロゴSVGを書き出す。

FigmaにSVGをドラッグ＆ドロップすると、名前付きレイヤー（<g id>）として
展開され、色・テキストを個別に編集できる。Oswald / Noto Sans JP は
FigmaのGoogle Fontsにあるため、テキストはそのまま同フォントで扱える。

    python3 scripts/build_figma_kit.py [出力ディレクトリ]
"""
import pathlib
import sys

W = 1080
PAD = 40
DISPLAY = "Oswald, Noto Sans JP, sans-serif"
BODY = "Noto Sans JP, sans-serif"

GOLD = "#f4de1e"
BLOOD = "#d8232a"
INK = "#000000"
FOG = "#f4f4f4"
LINE = "rgba(0,0,0,0.15)"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


class G:
    def __init__(self):
        self.parts = []
        self.y = 0

    def rect(self, x, y, w, h, fill, stroke=None, sw=1, dash=None):
        st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        d = ' stroke-dasharray="6 4"' if dash else ""
        self.parts.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" fill="{fill}"{st}{d}/>')

    def text(self, x, y, s, size, weight=400, fill=INK, family=BODY, ls=None, anchor="start"):
        lsp = f' letter-spacing="{ls}"' if ls else ""
        self.parts.append(
            f'<text x="{x:.0f}" y="{y:.0f}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{lsp}>{esc(s)}</text>'
        )

    def open(self, gid):
        self.parts.append(f'<g id="{esc(gid)}">')

    def close(self):
        self.parts.append("</g>")

    def label(self, x, y, s):
        self.text(x, y, s, 11, 400, "#777777")

    def stripes(self, x, y, w, h):
        self.parts.append(f'<g clip-path="url(#stripeclip-{x:.0f}-{y:.0f})">')
        self.parts.append(f'<clipPath id="stripeclip-{x:.0f}-{y:.0f}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath>')
        self.rect(x, y, w, h, GOLD)
        step = 28
        n = int(w / step) + 3
        for i in range(n):
            x0 = x - 28 + i * step
            self.parts.append(
                f'<polygon points="{x0},{y + h} {x0 + 14},{y + h} {x0 + 14 + h},{y} {x0 + h},{y}" fill="#000000"/>'
            )
        self.parts.append("</g>")

    def logo(self, cx, cy, r):
        self.parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{GOLD}" stroke-width="{r * 0.11:.1f}"/>')
        ir = r * 0.9
        hr = ir / 2
        self.parts.append(
            f'<path d="M {cx} {cy - ir} A {ir} {ir} 0 0 1 {cx} {cy + ir} '
            f'A {hr} {hr} 0 0 1 {cx} {cy} A {hr} {hr} 0 0 0 {cx} {cy - ir} Z" fill="{BLOOD}"/>'
        )
        self.parts.append(
            f'<path d="M {cx} {cy + ir} A {ir} {ir} 0 0 1 {cx} {cy - ir} '
            f'A {hr} {hr} 0 0 1 {cx} {cy} A {hr} {hr} 0 0 0 {cx} {cy + ir} Z" fill="{GOLD}"/>'
        )


def build_guide():
    g = G()
    y = 0

    # ---- ヘッダー ----
    g.open("ヘッダー")
    g.rect(0, y, W, 96, INK)
    g.logo(PAD + 24, y + 48, 22)
    g.text(PAD + 62, y + 42, "輝蹴会 DESIGN B「ATHLETIC」", 20, 700, "#ffffff", DISPLAY)
    g.text(PAD + 62, y + 66, "STYLE GUIDE — FIGMA用デザイントークン", 11, 500, GOLD, DISPLAY, ls="3")
    g.text(W - PAD, y + 58, "kishukai-mock-b.vercel.app 準拠", 11, 400, "#999999", BODY, anchor="end")
    g.close()
    y += 128

    # ---- カラー ----
    g.open("カラーパレット")
    g.text(PAD, y + 6, "COLOR", 12, 700, "#111111", DISPLAY, ls="3")
    y += 20
    sw = (W - PAD * 2 - 5 * 12) / 6
    colors = [
        ("#000000", "ink / 黒", "地色・文字・ヘッダー"),
        ("#ffffff", "paper / 白", "基本背景"),
        ("#f4f4f4", "fog / 霧", "交互セクション背景"),
        ("#f4de1e", "gold / 輝", "CTA・アクティブ・強調"),
        ("#d8232a", "blood / 紅", "副アクセント（太極の紅）"),
        ("#16305c", "photo navy", "写真プレースホルダー系"),
    ]
    for i, (hexc, name, use) in enumerate(colors):
        x = PAD + i * (sw + 12)
        g.rect(x, y, sw, 84, hexc, stroke="#dddddd" if hexc == "#ffffff" else None)
        g.text(x, y + 102, name, 12, 700)
        g.text(x, y + 118, hexc.upper(), 11, 400, "#777777", DISPLAY)
        g.text(x, y + 133, use, 10, 400, "#777777")
    g.close()
    y += 168

    # ---- タイポグラフィ ----
    g.open("タイポグラフィ")
    g.text(PAD, y + 6, "TYPOGRAPHY", 12, 700, "#111111", DISPLAY, ls="3")
    y += 34
    g.text(PAD, y + 44, "KICK TO THE WORLD", 48, 700, INK, DISPLAY)
    g.label(W - PAD - 330, y + 20, "英字見出し: Oswald Bold / 大文字")
    g.label(W - PAD - 330, y + 36, "H1実寸 8.5rem(136px) / 行間0.86 / tracking 0")
    y += 72
    g.text(PAD, y + 30, "保護者への3つの約束", 32, 700, INK, BODY)
    g.label(W - PAD - 330, y + 12, "日本語見出し: Noto Sans JP Bold")
    g.label(W - PAD - 330, y + 28, "H2実寸 2.25〜3rem(36〜48px)")
    y += 52
    g.text(PAD, y + 16, "OUR PROMISE", 12, 500, BLOOD, DISPLAY, ls="4")
    g.label(W - PAD - 330, y + 12, "アイキャッチ: Oswald 12px / tracking .3em / 紅または金")
    y += 30
    g.text(PAD, y + 16, "本文はNoto Sans JP Regular。実寸14px、行間1.75。補足は12pxのblack/50。", 14, 400, "#333333")
    g.label(W - PAD - 330, y + 12, "本文: Noto Sans JP 400 / 14px / lh 1.75")
    g.close()
    y += 52

    # ---- ボタン・タグ ----
    g.open("ボタンとタグ")
    g.text(PAD, y + 6, "BUTTONS / TAGS", 12, 700, "#111111", DISPLAY, ls="3")
    y += 22
    x = PAD
    g.rect(x, y, 190, 44, GOLD)
    g.text(x + 95, y + 27, "無料体験に申し込む", 13, 700, INK, BODY, anchor="middle")
    x += 206
    g.rect(x, y, 170, 44, "#ffffff", stroke=INK, sw=1.5)
    g.text(x + 85, y + 27, "世界への挑戦を見る", 13, 700, INK, BODY, anchor="middle")
    x += 186
    g.rect(x, y, 170, 44, INK)
    g.text(x + 85, y + 27, "このクラスを体験する", 12, 700, "#ffffff", BODY, anchor="middle")
    x += 186
    g.rect(x, y + 8, 66, 24, GOLD)
    g.text(x + 33, y + 24, "KIDS", 11, 700, INK, DISPLAY, ls="1", anchor="middle")
    x += 78
    g.rect(x, y + 8, 96, 24, INK)
    g.text(x + 48, y + 24, "いちばん人気", 10, 700, GOLD, BODY, anchor="middle")
    g.label(PAD, y + 66, "角丸なし（0px）／ホバーは黒⇔金の色反転／英字ラベルはOswald・大文字")
    g.close()
    y += 92

    # ---- パターン ----
    g.open("パターン")
    g.text(PAD, y + 6, "PATTERNS", 12, 700, "#111111", DISPLAY, ls="3")
    y += 24
    # dl行
    dlx, dlw = PAD, 470
    g.text(dlx, y + 12, "データ行（dl）", 11, 400, "#777777")
    for i, (k, v) in enumerate([("対象", "幼児〜小学生"), ("実施日時", "月・水・金 16:30 – 17:30"), ("月謝", "◯,◯◯◯円")]):
        ry = y + 22 + i * 34
        g.parts.append(f'<line x1="{dlx}" y1="{ry}" x2="{dlx + dlw}" y2="{ry}" stroke="{LINE}" stroke-width="1"/>')
        g.text(dlx, ry + 22, k, 11, 700, "#555555", DISPLAY, ls="1")
        g.text(dlx + 90, ry + 22, v, 13, 400, "#111111")
    g.parts.append(f'<line x1="{dlx}" y1="{y + 22 + 102}" x2="{dlx + dlw}" y2="{y + 22 + 102}" stroke="{LINE}" stroke-width="1"/>')
    # ヘアライングリッド
    hx = PAD + 520
    g.text(hx, y + 12, "ヘアライングリッド（gap 1px・黒15%）", 11, 400, "#777777")
    g.rect(hx, y + 22, 480, 104, "rgba(0,0,0,0.15)")
    cw = (480 - 2) / 3
    for i in range(3):
        g.rect(hx + 1 + i * (cw + 1) - (1 if i else 0), y + 23, cw, 102, "#ffffff")
    g.close()
    y += 160

    # ---- ストライプとロゴ ----
    g.open("ストライプとロゴ")
    g.stripes(PAD, y, 640, 20)
    g.label(PAD, y + 44, "警告ストライプ帯: 金#F4DE1E×黒 / -45deg / 14pxピッチ / 高さ12〜20px")
    g.logo(PAD + 740, y + 24, 30)
    g.text(PAD + 790, y + 20, "ロゴマーク", 12, 700)
    g.label(PAD + 790, y + 38, "logo-kishukai.svg 同梱")
    g.close()
    y += 92


    # ---- ロゴロックアップ ----
    g.open("ロゴロックアップ（ヘッダー）")
    g.text(PAD, y + 6, "LOGO LOCKUP", 12, 700, "#111111", DISPLAY, ls="3")
    y += 22
    g.rect(PAD, y, W - PAD * 2, 104, INK)
    # ロゴスロット（実ロゴを差し込む枠）
    slot = 56
    sx, sy = PAD + 24, y + 24
    g.rect(sx, sy, slot, slot, "rgba(255,255,255,0.06)", stroke=GOLD, sw=1.5, dash=True)
    g.text(sx + slot / 2, sy + slot / 2 - 2, "LOGO", 10, 700, GOLD, DISPLAY, ls="1", anchor="middle")
    g.text(sx + slot / 2, sy + slot / 2 + 12, "56×56", 9, 400, "#999999", DISPLAY, anchor="middle")
    # 社名
    tx = sx + slot + 16
    g.text(tx, sy + 26, "輝蹴会", 26, 700, "#ffffff", BODY, ls="2")
    g.text(tx, sy + 46, "KISHUKAI TAEKWONDO", 10, 500, "#8a8a8a", DISPLAY, ls="4")
    # 寸法線
    g.parts.append(f'<line x1="{sx + slot}" y1="{sy + slot + 10}" x2="{tx}" y2="{sy + slot + 10}" stroke="{GOLD}" stroke-width="1"/>')
    g.text((sx + slot + tx) / 2, sy + slot + 24, "16", 9, 700, GOLD, DISPLAY, anchor="middle")
    # ナビ側
    g.text(W - PAD - 24, sy + 34, "ABOUT   WORLD   PROGRAM   PRICE", 12, 500, "#cccccc", DISPLAY, ls="2", anchor="end")
    g.label(PAD, y + 128, "実ロゴ（TAEKWONDO KISHUKAI エンブレム）を56×56のスロットに配置し、右に16pxあけて社名。")
    g.label(PAD, y + 144, "黒背景に載せるため、ロゴは白フチ付きか背景透過PNG/SVGを使用。ヘッダー高さは96px（実装64px相当）。")
    g.close()
    y += 172

    # ---- レイアウトルール ----
    g.open("レイアウトルール")
    g.rect(PAD, y, W - PAD * 2, 118, FOG)
    rules = [
        "コンテナ最大幅 1240px ／ セクション上下余白 64px（py-16）",
        "角丸は全要素 0px ／ 罫線は黒15%の1pxヘアライン ／ カード間は1pxギャップのグリッド",
        "アクセントは金を主・紅を副。同一要素に両方は使わない ／ 写真は黒系グラデのプレースホルダー（差し替え前提）",
        "フォント: Oswald（英字見出し）・Noto Sans JP（日本語）— どちらもFigmaのGoogle Fontsで選択可",
    ]
    for i, r in enumerate(rules):
        g.text(PAD + 20, y + 28 + i * 24, "・" + r, 12.5, 400, "#333333")
    g.close()
    y += 150

    body = "\n".join(g.parts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{y}" viewBox="0 0 {W} {y}">\n'
        f'<rect id="背景" width="{W}" height="{y}" fill="#ffffff"/>\n{body}\n</svg>'
    )


def build_logo():
    g = G()
    g.logo(60, 60, 50)
    body = "\n".join(g.parts)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">\n'
        f"{body}\n</svg>"
    )


def main():
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("docs/figma-kit-b")
    out.mkdir(parents=True, exist_ok=True)
    (out / "style-guide-b.svg").write_text(build_guide(), encoding="utf-8")
    (out / "logo-kishukai.svg").write_text(build_logo(), encoding="utf-8")
    for f in ("style-guide-b.svg", "logo-kishukai.svg"):
        print("wrote", out / f, f"({(out / f).stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
