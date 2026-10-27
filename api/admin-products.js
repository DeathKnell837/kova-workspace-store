import { db } from "./_lib/store.js";
import { json, readJson, requireMethod } from "./_lib/http.js";
import { isAdmin } from "./_lib/admin.js";

const allowedStock = new Set(["unverified", "available", "out_of_stock"]);
const slugOk = (value) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 90;
const short = (value, max) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
export default async function handler(req, res) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized." });
  try {
    if (req.method === "GET") {
      const products = await db("products?select=id,slug,name,description,category,price_php,supplier_name,supplier_sku,image_url,stock_status,active,sort_order&order=sort_order.asc,name.asc");
      return json(res, 200, { products });
    }
    const input = await readJson(req, 8_192);
    if (req.method === "POST") {
      if (!slugOk(input?.slug) || !short(input?.name, 120) || !short(input?.description, 2_000) || !short(input?.category, 80)
        || !Number.isSafeInteger(input?.price_php) || input.price_php < 1 || input.image_url && !/^https:\/\//i.test(input.image_url)) {
        return json(res, 400, { error: "Enter a slug, product name, description, category, price in pesos, and HTTPS image URL." });
      }
      const rows = await db("products?select=id,slug,name,description,category,price_php,stock_status,active", {
        method: "POST", prefer: "return=representation", body: [{ slug: input.slug, name: input.name.trim(), description: input.description.trim(), category: input.category.trim(), price_php: input.price_php, image_url: input.image_url || "", supplier_name: input.supplier_name || null, supplier_sku: input.supplier_sku || null, stock_status: "unverified", active: false }],
      });
      return json(res, 201, { product: rows[0] });
    }
    if (req.method !== "PATCH") return requireMethod(req, res, "GET, POST, PATCH");
    if (!/^[0-9a-f-]{36}$/i.test(input?.id || "")) return json(res, 400, { error: "Invalid product." });
    const changes = {};
    if (input.slug !== undefined && slugOk(input.slug)) changes.slug = input.slug;
    if (input.name !== undefined && short(input.name, 120)) changes.name = input.name.trim();
    if (input.description !== undefined && typeof input.description === "string" && input.description.length <= 2_000) changes.description = input.description.trim();
    if (input.category !== undefined && short(input.category, 80)) changes.category = input.category.trim();
    if (input.price_php !== undefined && Number.isSafeInteger(input.price_php) && input.price_php > 0) changes.price_php = input.price_php;
    if (input.image_url !== undefined && (input.image_url === "" || /^https:\/\//i.test(input.image_url))) changes.image_url = input.image_url;
    if (input.supplier_name !== undefined && (input.supplier_name === null || typeof input.supplier_name === "string") && (input.supplier_name || "").length <= 120) changes.supplier_name = input.supplier_name;
    if (input.supplier_sku !== undefined && (input.supplier_sku === null || typeof input.supplier_sku === "string") && (input.supplier_sku || "").length <= 120) changes.supplier_sku = input.supplier_sku;
    if (input.stock_status !== undefined && allowedStock.has(input.stock_status)) changes.stock_status = input.stock_status;
    if (input.active !== undefined && typeof input.active === "boolean") changes.active = input.active;
    if (input.sort_order !== undefined && Number.isSafeInteger(input.sort_order)) changes.sort_order = input.sort_order;
    if (!Object.keys(changes).length) return json(res, 400, { error: "No valid product changes were provided." });
    changes.updated_at = new Date().toISOString();
    const rows = await db(`products?id=eq.${input.id}&select=id,slug,name,description,category,price_php,supplier_name,supplier_sku,image_url,stock_status,active,sort_order`, { method: "PATCH", prefer: "return=representation", body: changes });
    return rows.length ? json(res, 200, { product: rows[0] }) : json(res, 404, { error: "Product not found." });
  } catch (error) {
    console.error("Admin product operation failed", error.message);
    return json(res, 503, { error: "Product management is temporarily unavailable." });
  }
}
