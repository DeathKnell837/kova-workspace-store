import { db, safeEmail, safeText } from "./_lib/store.js";
import { json, readJson, requireMethod } from "./_lib/http.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;
  let input;
  try { input = await readJson(req, 2_048); } catch { return json(res, 400, { error: "Enter your order number and checkout email." }); }
  if (!safeText(input?.orderNumber, 32) || !safeEmail(input?.email)) return json(res, 400, { error: "Enter your order number and checkout email." });
  try {
    const rows = await db(`orders?select=order_number,payment_status,fulfillment_status,tracking_number,tracking_url,created_at&order_number=eq.${encodeURIComponent(input.orderNumber.trim())}&customer_email=eq.${encodeURIComponent(input.email.trim().toLowerCase())}&limit=1`);
    if (!rows.length) return json(res, 404, { error: "We couldn’t find an order with those details." });
    return json(res, 200, { order: rows[0] });
  } catch (error) {
    console.error("Order lookup failed", error.message);
    return json(res, 503, { error: "Order lookup is temporarily unavailable." });
  }
}
