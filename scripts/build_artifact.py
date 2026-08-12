#!/usr/bin/env python3
"""全ページを1ファイルのレビュー用バンドルにまとめる。

静的ページ（index.html ほか）の <main> を取り出し、ハッシュルーティングで
切り替える単一HTMLを生成する。CSSはインライン化するため、
1ファイルをブラウザで開くだけで全ページを回覧できる。

    python3 scripts/build_artifact.py [出力先パス]
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "dist" / "demo-single.html"

# (ルート名, ファイル名)
ROUTES = [
    ("home", "index.html"),
    ("about", "about.html"),
    ("world", "world.html"),
    ("programs", "programs.html"),
    ("news", "news.html"),
    ("supporter", "supporter.html"),
    ("trial", "trial.html"),
]
FILE_TO_ROUTE = {f: r for r, f in ROUTES}

ROUTER_CSS = """
/* --- single-file bundle: hash router --- */
.page{display:none}
.page.is-active{display:block}
"""

ROUTER_JS = """<script>
(function () {
  var routes = %s;
  function current() {
    var r = (location.hash || '').replace(/^#\\/?/, '');
    return routes.indexOf(r) >= 0 ? r : 'home';
  }
  function show(r) {
    routes.forEach(function (x) {
      var el = document.getElementById('page-' + x);
      if (el) el.classList.toggle('is-active', x === r);
    });
    var links = document.querySelectorAll('header.site .nav ul a[href^="#/"]');
    Array.prototype.forEach.call(links, function (a) {
      if (a.getAttribute('href').slice(2) === r) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { show(current()); });
  show(current());
})();
</script>"""


def rewrite_links(html):
    """*.html へのリンクをハッシュルートに置き換える。"""
    for f, r in FILE_TO_ROUTE.items():
        html = html.replace('href="%s"' % f, 'href="#/%s"' % r)
    return html


def grab(pattern, html, label):
    m = re.search(pattern, html, re.S)
    if not m:
        raise SystemExit("見つかりません: %s" % label)
    return m.group(1)


def main():
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT
    css = (ROOT / "assets" / "site.css").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    header = rewrite_links(grab(r'(<header class="site">.*?</header>)', index, "header"))
    footer = rewrite_links(grab(r'(<footer class="site">.*?</footer>)', index, "footer"))

    pages, scripts = [], []
    for route, fname in ROUTES:
        html = (ROOT / fname).read_text(encoding="utf-8")
        body = rewrite_links(grab(r"<main[^>]*>(.*?)</main>", html, fname))
        pages.append('<div class="page" id="page-%s">\n%s\n</div>' % (route, body))
        for s in re.findall(r"<script>.*?</script>", html, re.S):
            scripts.append(s)

    doc = "\n".join([
        "<title>輝蹴会</title>",
        "<style>%s%s</style>" % (css, ROUTER_CSS),
        '<div class="demo-ribbon">REBRANDING DEMO</div>',
        header,
        "<main>",
        "\n".join(pages),
        "</main>",
        footer,
        "\n".join(scripts),
        ROUTER_JS % str([r for r, _ in ROUTES]).replace("'", "'"),
    ])
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding="utf-8")
    print("wrote %s (%.1f KB)" % (out, len(doc.encode("utf-8")) / 1024))


if __name__ == "__main__":
    main()
