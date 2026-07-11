# ErgoChair

身長と座位写真から、自分に最適な椅子の座面高・机面高を算出するWebアプリ。

**公開URL: https://ergochair.pages.dev**

```
cp .env.example .env   # 初回のみ。楽天APIキーを記入
python serve.py        # このフォルダで実行（静的配信＋楽天APIプロキシ）
# → http://127.0.0.1:8080 を開く
```

本番は Cloudflare Pages（無料）。push で自動デプロイされ、`functions/api/rakuten.js` が
楽天APIを中継する（キーはダッシュボードの環境変数 `RAKUTEN_APP_ID` / `RAKUTEN_ACCESS_KEY`）。

- 計算ロジック: [calc.js](calc.js)（テスト: `node --test`）
- 設計: [docs/design.md](docs/design.md)
- 椅子の推奨リスト: 楽天市場APIで検索し、座面高が合う商品のみ表示
  （ブラウザは常に相対パス `/api/rakuten` を呼び、本番は Pages Functions・ローカルは serve.py が中継）
