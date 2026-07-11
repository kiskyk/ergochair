// 人間工学の一般式: 下腿高≒身長×0.25、座高≒身長×0.55、差尺=座高/3

const round1 = (x) => Math.round(x * 10) / 10;

// 身長のみから算出（数式モデル）
export function fromHeight(heightCm) {
  return recommend(heightCm, heightCm * 0.25, "formula");
}

// 写真解析で得た下腿長から算出。妥当範囲外なら数式モデルへフォールバック
export function fromPose(heightCm, lowerLegCm) {
  const ratio = lowerLegCm / heightCm;
  if (!(ratio >= 0.2 && ratio <= 0.32)) {
    return { ...fromHeight(heightCm), fallback: true };
  }
  return recommend(heightCm, lowerLegCm, "pose");
}

// 商品名・説明文から座面高(cm)の範囲を抽出。例: 「座面高:42～52cm」「SH420〜520mm」「座面高 約44cm」
export function parseSeatRange(text) {
  const m = text.match(
    /(?:座面高|座面までの高さ|SH)[^0-9]{0,10}(\d{2,3}(?:\.\d)?)\s*(?:cm|㎝|mm)?\s*[~～〜\-ー–]\s*(?:約)?(\d{2,3}(?:\.\d)?)\s*(cm|㎝|mm)?/i
  ) || text.match(/(?:座面高|座面までの高さ|SH)[^0-9]{0,10}(\d{2,3}(?:\.\d)?)\s*(cm|㎝|mm)/i);
  if (!m) return null;
  const nums = m.length === 4 ? [m[1], m[2]] : [m[1], m[1]];
  let [min, max] = nums.map(Number);
  if (min > 100 || max > 100) { min /= 10; max /= 10; } // mm表記
  if (min > max) [min, max] = [max, min];
  if (min < 20 || max > 80) return null; // 椅子としてありえない値は誤検出
  return { min, max };
}

// 椅子の調整範囲が推奨範囲[seatMin, seatMax]と重なるか
export function seatMatches(range, seatMin, seatMax) {
  return range.min <= seatMax && range.max >= seatMin;
}

function recommend(heightCm, lowerLegCm, source) {
  const seat = lowerLegCm; // かかとが床に着く座面高
  const sashaku = (heightCm * 0.55) / 3;
  return {
    source,
    seatHeight: round1(seat),
    seatMin: round1(seat - 2),
    seatMax: round1(seat + 1),
    sashaku: round1(sashaku), // 「差尺」＝座面から机上までの高さ差 (cm)
    deskHeight: round1(seat + sashaku),
  };
}
