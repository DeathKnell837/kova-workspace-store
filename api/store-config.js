import { json, requireMethod } from "./_lib/http.js";

export default function handler(req, res) {
  if (!requireMethod(req, res, "GET")) return;
  const shipping = Number(process.env.STORE_SHIPPING_FEE_PHP);
  const mode = process.env.PAYMONGO_MODE === "live" ? "live" : "test";
  const secretKeyMatchesMode = mode === "live"
    ? process.env.PAYMONGO_SECRET_KEY?.startsWith("sk_live_")
    : process.env.PAYMONGO_SECRET_KEY?.startsWith("sk_test_");
  const ready = process.env.STORE_CHECKOUT_ENABLED === "true"
    && process.env.STORE_SHIPPING_CONFIRMED === "true"
    && process.env.STORE_POLICIES_CONFIRMED === "true"
    && process.env.SUPPLIER_FULFILLMENT_CONFIRMED === "true"
    && Number.isSafeInteger(shipping) && shipping >= 0
    && Boolean(process.env.PAYMONGO_SECRET_KEY && process.env.PAYMONGO_WEBHOOK_SECRET && secretKeyMatchesMode);
  return json(res, 200, { checkoutEnabled: ready, currency: "PHP" });
}
