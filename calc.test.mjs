import test from "node:test";
import assert from "node:assert/strict";
import { fromHeight, fromPose, parseSeatRange, seatMatches } from "./calc.js";

test("数式モデル: 身長170cm", () => {
  const r = fromHeight(170);
  assert.equal(r.source, "formula");
  assert.equal(r.seatHeight, 42.5); // 170 * 0.25
  assert.equal(r.sashaku, 31.2); // 170*0.55/3 = 31.16…
  assert.equal(r.deskHeight, 73.7);
  assert.equal(r.seatMin, 40.5);
  assert.equal(r.seatMax, 43.5);
});

test("写真解析: 妥当な下腿長はそのまま使う", () => {
  const r = fromPose(170, 41);
  assert.equal(r.source, "pose");
  assert.equal(r.seatHeight, 41);
});

test("写真解析: 範囲外(小)は数式へフォールバック", () => {
  const r = fromPose(170, 20); // 比率 0.118
  assert.equal(r.source, "formula");
  assert.equal(r.fallback, true);
  assert.equal(r.seatHeight, 42.5);
});

test("写真解析: 範囲外(大)・NaN も数式へ", () => {
  assert.equal(fromPose(170, 80).source, "formula");
  assert.equal(fromPose(170, NaN).source, "formula");
});

test("座面高パース: 範囲・単一値・mm表記", () => {
  assert.deepEqual(parseSeatRange("座面高:42～52cm"), { min: 42, max: 52 });
  assert.deepEqual(parseSeatRange("【座面高】約44.5cm"), { min: 44.5, max: 44.5 });
  assert.deepEqual(parseSeatRange("SH420〜520mm ガス圧昇降"), { min: 42, max: 52 });
  assert.deepEqual(parseSeatRange("座面までの高さ 41-51cm"), { min: 41, max: 51 });
  assert.equal(parseSeatRange("高さ調整可能なチェア"), null);
  assert.equal(parseSeatRange("座面高999cm"), null); // 誤検出除外
});

test("座面高マッチ: 範囲の重なり判定", () => {
  assert.equal(seatMatches({ min: 42, max: 52 }, 40.5, 43.5), true);
  assert.equal(seatMatches({ min: 44, max: 54 }, 40.5, 43.5), false);
  assert.equal(seatMatches({ min: 43, max: 43 }, 40.5, 43.5), true);
});
