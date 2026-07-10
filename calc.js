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

function recommend(heightCm, lowerLegCm, source) {
  const seat = lowerLegCm; // かかとが床に着く座面高
  const sashaku = (heightCm * 0.55) / 3;
  return {
    source,
    seatHeight: round1(seat),
    seatMin: round1(seat - 2),
    seatMax: round1(seat + 1),
    sashaku: round1(sashaku),
    deskHeight: round1(seat + sashaku),
  };
}
