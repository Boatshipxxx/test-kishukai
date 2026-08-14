#!/usr/bin/env python3
"""デザイン案B（React版）を1ファイルのレビュー用HTMLに書き出す。

design-b をビルドしたうえで、CSS・JS をインライン化し、
Oswald（ラテン部分のみ）を data URI として埋め込む。
外部ホストへ一切アクセスしない1枚のHTMLになるため、
そのままブラウザで開ける／Artifactとして公開できる。

    cd design-b && npm run build
    python3 scripts/build_artifact_b.py [出力先パス]
"""
import base64
import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "design-b" / "dist"
DEFAULT_OUT = ROOT / "dist" / "design-b-single.html"

GOOGLE_CSS = (
    "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap"
)
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def inline_oswald():
    """Oswald のラテン部分だけを data URI 化した @font-face を返す。"""
    try:
        css = fetch(GOOGLE_CSS)
    except Exception as e:  # ネットワークが無い環境ではフォント無しで続行
        print("フォント取得をスキップしました:", e)
        return ""

    out = []
    # 「/* latin */」直後の @font-face だけを採用（日本語は端末フォントに任せる）
    for subset, block in re.findall(
        r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S
    ):
        if subset != "latin":
            continue
        m = re.search(r"url\((https://[^)]+\.woff2)\)", block)
        if not m:
            continue
        try:
            b64 = base64.b64encode(fetch(m.group(1), binary=True)).decode("ascii")
        except Exception as e:
            print("フォント本体の取得に失敗:", e)
            continue
        out.append(
            block.replace(
                m.group(1), "data:font/woff2;base64," + b64
            )
        )
    print("inlined %d @font-face" % len(out))
    return "\n".join(out)


def main():
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT
    index = (DIST / "index.html").read_text(encoding="utf-8")

    css_name = re.search(r'href="[^"]*?/(assets/[^"]+\.css)"', index)
    js_name = re.search(r'src="[^"]*?/(assets/[^"]+\.js)"', index)
    if not css_name or not js_name:
        raise SystemExit("design-b/dist が見つかりません。先に npm run build を実行してください。")

    css = (DIST / css_name.group(1)).read_text(encoding="utf-8")
    js = (DIST / js_name.group(1)).read_text(encoding="utf-8")

    # ビルド済みCSSの先頭にある Google Fonts の @import は使えないため取り除く
    css = re.sub(r'@import\s+url\((["\']?)https://fonts\.googleapis[^)]*\1\);?', "", css)

    doc = "\n".join(
        [
            '<meta charset="utf-8">',
            "<title>輝蹴会 ATHLETIC</title>",
            "<style>",
            inline_oswald(),
            css,
            "</style>",
            '<div id="root"></div>',
            '<script type="module">',
            js,
            "</script>",
        ]
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding="utf-8")
    print("wrote %s (%.1f KB)" % (out, len(doc.encode("utf-8")) / 1024))


if __name__ == "__main__":
    main()
