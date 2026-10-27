import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "./_lib/store.js";
import { json, requireMethod } from "./_lib/http.js";

// PayMongo's signature covers the exact raw request bytes. Disable Vercel's
// automatic JSON parser so the webhook verifier can read the original body.
export const config = { api: { bodyParser: false } };

function verified(raw, header, secret, mode) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((part) => part.trim().split("=", 2)));
  const timestamp = parts.t;
  const received = mode === "live" ? parts.li : parts.te;
  if (!timestamp || !received || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(received, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;
  let raw;
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 1_000_000) return json(res, 413, { error: "Payload too large." });
      chunks.push(chunk);
    }
    raw = Buffer.concat(chunks).toString("utf8");
  } catch { return json(res, 400, { error: "Invalid webhook request." }); }

  const mode = process.env.PAYMONGO_MODE === "live" ? "live" : "test";
  if (!verified(raw, req.headers["paymongo-signature"], process.env.PAYMONGO_WEBHOOK_SECRET, mode)) {
    return json(res, 401, { error: "Invalid webhook signature." });
  }

  try {
    const payload = JSON.parse(raw);
    const event = payload?.data?.attributes;
    if (event?.type !== "checkout_session.payment.paid") return json(res, 200, { received: true });
    if (Boolean(event.livemode) !== (mode === "live")) return json(res, 400, { error: "Payment environment mismatch." });
    const checkout = event.data;
    const sessionId = checkout?.id;
    const reference = checkout?.attributes?.reference_number;
    if (!sessionId || !reference) return json(res, 400, { error: "Missing checkout reference." });

    const paidPayment = checkout?.attributes?.payments?.find((payment) => payment?.attributes?.status === "paid");
    if (!paidPayment || paidPayment.attributes.currency !== "PHP") return json(res, 400, { error: "Paid payment details are missing." });
    const orders = await db(`orders?select=id,total_php,payment_status&payment_session_id=eq.${encodeURIComponent(sessionId)}&order_number=eq.${encodeURIComponent(reference)}&limit=1`);
    if (!orders.length || paidPayment.attributes.amount !== orders[0].total_php * 100) {
      console.error("PayMongo payment did not match an order", reference);
      return json(res, 400, { error: "Payment does not match the order." });
    }

    await db(`orders?id=eq.${orders[0].id}&payment_status=eq.pending`, {
      method: "PATCH", body: { payment_status: "paid", paid_at: new Date().toISOString() },
    });
    await db("payment_events?on_conflict=event_id", {
      method: "POST", prefer: "resolution=ignore-duplicates,return=minimal",
      body: [{ event_id: payload?.data?.id || sessionId, event_type: event.type, order_number: reference }],
    });
    return json(res, 200, { received: true });
  } catch (error) {
    console.error("PayMongo webhook processing failed", error.message);
    return json(res, 500, { error: "Webhook processing failed." });
  }
}
