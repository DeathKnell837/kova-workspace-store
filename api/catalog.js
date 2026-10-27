import { db } from "./_lib/store.js";
import { json, requireMethod } from "./_lib/http.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "GET")) return;
  try {
    const rows = await db("products?select=id,slug,name,description,price_php,image_url,category,stock_status&active=eq.true&stock_status=eq.available&order=sort_order.asc");
    return json(res, 200, { products: rows });
  } catch (error) {
    console.error("Catalog unavailable", error.message);
    return json(res, 503, { error: "The catalog is temporarily unavailable." });
  }
}
