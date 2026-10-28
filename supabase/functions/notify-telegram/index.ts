// Telegram bot alert: runs when a new issue is inserted.
// 1) Create a bot with @BotFather -> token. Send it a message, then open https://api.telegram.org/bot<TOKEN>/getUpdates to find your chat id.
// 2) supabase secrets set TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=xxx
// 3) supabase functions deploy notify-telegram --no-verify-jwt
// 4) Dashboard > Database > Webhooks > Create: table "issues", event INSERT, type "Supabase Edge Functions", function notify-telegram
const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const CHAT = Deno.env.get("TELEGRAM_CHAT_ID")!;
const URL_ = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

Deno.serve(async (req) => {
  const { record: r } = await req.json();
  const get = async (path: string) => (await (await fetch(`${URL_}/rest/v1/${path}`, { headers: H })).json())[0];
  const cat = (await get(`categories?id=eq.${r.category_id}&select=name`))?.name ?? "Other";
  const who = await get(`profiles?id=eq.${r.user_id}&select=name,email`);
  const map = r.lat ? `\nhttps://maps.google.com/?q=${r.lat},${r.lng}` : "";
  const text = `🆕 New complaint\n${r.title}\nType: ${cat}\nPlace: ${r.address || "-"}${map}\nBy: ${who?.name || "-"} (${who?.email || "-"})\n\n${r.description || ""}`.slice(0, 1000);
  const api = `https://api.telegram.org/bot${TOKEN}`;
  const send = (m: string, body: object) => fetch(`${api}/${m}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT, ...body }) });
  const res = r.photo_url ? await send("sendPhoto", { photo: r.photo_url, caption: text }) : await send("sendMessage", { text });
  return new Response(await res.text(), { status: res.ok ? 200 : 500 });
});
