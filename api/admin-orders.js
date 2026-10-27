import { db } from "./_lib/store.js";
import { json, readJson, requireMethod } from "./_lib/http.js";
import { isAdmin } from "./_lib/admin.js";

export default async function handler(req, res) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized." });
  if (req.method === "GET") {
    try {
      const orders = await db("orders?select=id,order_number,customer_name,customer_email,customer_phone,address_line1,address_line2,city,province,postal_code,delivery_notes,subtotal_php,shipping_php,total_php,payment_status,fulfillment_status,tracking_number,tracking_url,created_at,order_items(product_name,quantity)&order=created_at.desc&limit=100");
      return json(res, 200, { orders });
    } catch (error) {
      console.error("Admin order list failed", error.message);
      return json(res, 503, { error: "Orders are temporarily unavailable." });
    }
  }
  if (req.method !== "PATCH") return requireMethod(req, res, "GET or PATCH");
  let input;
  try { input = await readJson(req, 4_096); } catch { return json(res, 400, { error: "Invalid update." }); }
  const statuses = ["unfulfilled", "processing", "shipped", "delivered", "cancelled"];
  if (!/^[0-9a-f-]{36}$/i.test(input?.id || "") || !statuses.includes(input?.fulfillment_status)) return json(res, 400, { error: "Invalid fulfillment update." });
  const tracking = input.tracking_number == null ? null : String(input.tracking_number).trim();
  const trackingUrl = input.tracking_url == null ? null : String(input.tracking_url).trim();
  if (tracking?.length > 100 || trackingUrl && (!/^https:\/\//i.test(trackingUrl) || trackingUrl.length > 500)) return json(res, 400, { error: "Invalid tracking details." });
  if (["shipped", "delivered"].includes(input.fulfillment_status) && !tracking) return json(res, 400, { error: "Add a carrier tracking number before marking this order shipped or delivered." });
  try {
    // Never allow fulfillment of an order until a signed payment webhook has marked it paid.
    const paidOnly = ["processing", "shipped", "delivered"].includes(input.fulfillment_status) ? "&payment_status=eq.paid" : "";
    const rows = await db(`orders?id=eq.${input.id}${paidOnly}&select=id,order_number,fulfillment_status,tracking_number,tracking_url`, { method: "PATCH", prefer: "return=representation", body: { fulfillment_status: input.fulfillment_status, tracking_number: tracking, tracking_url: trackingUrl } });
    return rows.length ? json(res, 200, { order: rows[0] }) : json(res, 409, { error: "Order not found, or payment has not been confirmed." });
  } catch (error) {
    console.error("Admin order update failed", error.message);
    return json(res, 503, { error: "Order update failed." });
  }
}
