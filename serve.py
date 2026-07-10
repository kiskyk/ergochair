# ローカル開発用サーバー: 静的配信 + 楽天APIプロキシ
# 楽天APIは許可サイト（kiskyk.github.io）以外からの呼び出しを拒否するため、
# ローカル実行時は登録ドメインをReferer/Originに付けて中継する。
# GitHub Pages公開時はブラウザから直接呼ぶのでこのプロキシは不要。
import http.server
import urllib.error
import urllib.request

ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701"
SITE = "https://kiskyk.github.io"


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if not self.path.startswith("/rakuten?"):
            return super().do_GET()
        url = ENDPOINT + "?" + self.path.split("?", 1)[1]
        req = urllib.request.Request(url, headers={"Referer": SITE + "/", "Origin": SITE})
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                code, body = r.status, r.read()
        except urllib.error.HTTPError as e:
            code, body = e.code, e.read()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    import os
    os.chdir(os.path.dirname(os.path.abspath(__file__)))  # どこから起動しても本ディレクトリを配信
    print("http://127.0.0.1:8080")
    http.server.ThreadingHTTPServer(("127.0.0.1", 8080), Handler).serve_forever()
