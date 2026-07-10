# ローカル開発用サーバー: 静的配信 + 楽天APIプロキシ
# 本番（Cloudflare Pages）の /api/rakuten（functions/api/rakuten.js）と同じ役割。
# 楽天APIは許可サイト以外からの呼び出しを拒否するため、登録ドメインを
# Referer/Origin に付け、.env のキーをクエリに足して中継する。
import http.server
import os
import urllib.error
import urllib.request

ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701"
SITE = "https://kiskyk.github.io"


def load_env(path=".env"):
    env = {}
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if not self.path.startswith("/api/rakuten?"):
            return super().do_GET()
        query = self.path.split("?", 1)[1]
        url = f"{ENDPOINT}?{query}&applicationId={ENV['RAKUTEN_APP_ID']}&accessKey={ENV['RAKUTEN_ACCESS_KEY']}"
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
    os.chdir(os.path.dirname(os.path.abspath(__file__)))  # どこから起動しても本ディレクトリを配信
    ENV = load_env()
    if "RAKUTEN_APP_ID" not in ENV or "RAKUTEN_ACCESS_KEY" not in ENV:
        raise SystemExit(".env がありません。.env.example をコピーして楽天APIキーを設定してください")
    print("http://127.0.0.1:8080")
    http.server.ThreadingHTTPServer(("127.0.0.1", 8080), Handler).serve_forever()
