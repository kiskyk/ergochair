// Cloudflare Pages Function: 楽天APIへの中継。キーは環境変数（Secret）から付与し、
// ブラウザには一切渡さない。ローカル開発では serve.py が同じ /api/rakuten を担う。
const ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";
const SITE = "https://kiskyk.github.io"; // 楽天に登録済みの許可サイト

export async function onRequestGet(context) {
  const params = new URL(context.request.url).searchParams;
  params.set("applicationId", context.env.RAKUTEN_APP_ID);
  params.set("accessKey", context.env.RAKUTEN_ACCESS_KEY);
  const res = await fetch(`${ENDPOINT}?${params}`, {
    headers: { Referer: `${SITE}/`, Origin: SITE },
  });
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
