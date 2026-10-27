import { db, createOrderNumber, safeEmail, safeText } from "./_lib/store.js";
import { json, readJson, requireMethod } from "./_lib/http.js";

const BASE64 = (value) => Buffer.from(`${value}:`).toString("base64");

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;
  if (process.env.STORE_CHECKOUT_ENABLED !== "true"
    || process.env.STORE_SHIPPING_CONFIRMED !== "true"
    || process.env.STORE_POLICIES_CONFIRMED !== "true"
    || process.env.SUPPLIER_FULFILLMENT_CONFIRMED !== "true"
    || !process.env.PAYMONGO_WEBHOOK_SECRET) {
    return json(res, 503, { error: "Online ordering is not open yet." });
  }
  const mode = process.env.PAYMONGO_MODE === "live" ? "live" : "test";
  const keyMatchesMode = mode === "live"
    ? process.env.PAYMONGO_SECRET_KEY?.startsWith("sk_live_")
    : process.env.PAYMONGO_SECRET_KEY?.startsWith("sk_test_");
  if (!keyMatchesMode) return json(res, 503, { error: "Payments are not configured yet." });

  let input;
  try { input = await readJson(req); } catch { return json(res, 400, { error: "Please check your checkout details." }); }
  const customer = input?.customer || {};
  const address = customer.address || {};
  const valid = safeText(customer.name, 100) && safeEmail(customer.email) && safeText(customer.phone, 32)
    && safeText(address.line1, 160) && safeText(address.city, 80) && safeText(address.province, 80)
    && safeText(address.postal_code, 16)
    && (address.line2 == null || address.line2 === "" || safeText(address.line2, 160))
    && (customer.notes == null || customer.notes === "" || safeText(customer.notes, 500))
    && Array.isArray(input.items) && input.items.length > 0 && input.items.length <= 20;
  if (!valid) return json(res, 400, { error: "Enter a valid name, email, phone number, and delivery address." });

  try {
    const counts = new Map();
    for (const item of input.items) {
      if (!item || typeof item !== "object") return json(res, 400, { error: "One or more cart items are invalid." });
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10 || !/^[0-9a-f-]{36}$/i.test(item.productId || "")) {
        return json(res, 400, { error: "One or more cart items are invalid." });
      }
      counts.set(item.productId, (counts.get(item.productId) || 0) + item.quantity);
    }
    if ([...counts.values()].some((quantity) => quantity > 10)) return json(res, 400, { error: "A cart item exceeds the quantity limit." });
    const ids = [...counts.keys()];
    const products = await db(`products?select=id,name,price_php,stock_status,active&id=in.(${ids.join(",")})&active=eq.true`);
    if (products.length !== ids.length || products.some((p) => p.stock_status !== "available")) {
      return json(res, 409, { error: "An item in your bag is unavailable. Refresh the catalog and try again." });
    }
    const items = products.map((p) => ({ product_id: p.id, product_name: p.name, unit_price_php: p.price_php, quantity: counts.get(p.id) }));
    const subtotal = items.reduce((sum, item) => sum + item.unit_price_php * item.quantity, 0);
    const shipping = Number(process.env.STORE_SHIPPING_FEE_PHP);
    if (!Number.isSafeInteger(shipping) || shipping < 0) return json(res, 503, { error: "Shipping is not configured yet." });
    const total = subtotal + shipping;
    const orderNumber = createOrderNumber();

    const [order] = await db("orders?select=id,order_number", {
      method: "POST", prefer: "return=representation",
      body: [{ order_number: orderNumber, customer_name: customer.name.trim(), customer_email: customer.email.trim().toLowerCase(), customer_phone: customer.phone.trim(), address_line1: address.line1.trim(), address_line2: (address.line2 || "").trim(), city: address.city.trim(), province: address.province.trim(), postal_code: address.postal_code.trim(), delivery_notes: (customer.notes || "").trim(), currency: "PHP", subtotal_php: subtotal, shipping_php: shipping, total_php: total, payment_status: "pending", fulfillment_status: "unfulfilled" }],
    });
    await db("order_items", { method: "POST", body: items.map((item) => ({ order_id: order.id, ...item })) });

    const previewOrigin = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null;
    const origin = previewOrigin || process.env.STORE_BASE_URL || "https://kova-workspace-store.vercel.app";
    if (!/^https:\/\//i.test(origin)) return json(res, 503, { error: "Store URL is not configured securely." });
    const checkoutResponse = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
      method: "POST",
      headers: { Authorization: `Basic ${BASE64(process.env.PAYMONGO_SECRET_KEY)}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: { attributes: {
        billing: { name: customer.name.trim(), email: customer.email.trim().toLowerCase(), phone: customer.phone.trim(), address: { line1: address.line1.trim(), line2: (address.line2 || "").trim(), city: address.city.trim(), state: address.province.trim(), postal_code: address.postal_code.trim(), country: "PH" } },
        line_items: [...items.map((item) => ({ name: item.product_name, amount: item.unit_price_php * 100, currency: "PHP", quantity: item.quantity })), ...(shipping ? [{ name: "Shipping", amount: shipping * 100, currency: "PHP", quantity: 1 }] : [])],
        payment_method_types: ["gcash", "qrph", "card", "paymaya", "dob"],
        success_url: `${origin}/?order=${encodeURIComponent(orderNumber)}#order-status`,
        cancel_url: `${origin}/?checkout=cancelled#collection`,
        reference_number: orderNumber,
        send_email_receipt: true,
        metadata: { order_number: orderNumber },
      } } }),
    });
    const session = await checkoutResponse.json();
    if (!checkoutResponse.ok || !session?.data?.attributes?.checkout_url) {
      console.error("PayMongo checkout creation failed", checkoutResponse.status);
      await db(`orders?id=eq.${order.id}`, { method: "PATCH", body: { payment_status: "checkout_error" } });
      return json(res, 502, { error: "We couldn’t start secure checkout. Your order was not charged; please try again." });
    }
    await db(`orders?id=eq.${order.id}`, { method: "PATCH", body: { payment_session_id: session.data.id } });
    return json(res, 200, { checkoutUrl: session.data.attributes.checkout_url, orderNumber });
  } catch (error) {
    console.error("Checkout request failed", error.message);
    return json(res, 503, { error: "Checkout is temporarily unavailable. Please try again shortly." });
  }
}
