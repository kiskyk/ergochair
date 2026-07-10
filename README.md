# ErgoChair

身長と座位写真から、自分に最適な椅子の座面高・机面高を算出するWebアプリ（企画書フェーズ1）。

```
python -m http.server 8080   # このフォルダで実行
# → http://localhost:8080 を開く
```

- 計算ロジック: [calc.js](calc.js)（テスト: `node --test`）
- 設計: [docs/design.md](docs/design.md)
- フェーズ2予定: 楽天市場APIによる椅子の推奨リスト
