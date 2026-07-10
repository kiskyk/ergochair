import test from "node:test";
import assert from "node:assert/strict";
import { fromHeight, fromPose } from "./calc.js";

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
