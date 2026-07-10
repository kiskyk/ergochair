# ErgoChair

身長と座位写真から、自分に最適な椅子の座面高・机面高を算出するWebアプリ（企画書フェーズ1）。

```
python serve.py   # このフォルダで実行（静的配信＋楽天APIプロキシ）
# → http://127.0.0.1:8080 を開く
```

- 計算ロジック: [calc.js](calc.js)（テスト: `node --test`）
- 設計: [docs/design.md](docs/design.md)
- 椅子の推奨リスト: 楽天市場APIで検索し、座面高が合う商品のみ表示
  （ローカルでは許可サイト制限のため serve.py が中継。GitHub Pages 公開時は直接呼び出し）
