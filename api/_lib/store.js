const required = ["SUPABASE_URL", "SUPABASE_SECRET_KEY"];

export function assertStoreConfig() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing server configuration: ${missing.join(", ")}`);
}

export async function db(path, { method = "GET", body, prefer } = {}) {
  assertStoreConfig();
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: process.env.SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
  if (!response.ok) {
    console.error("Store database request failed", response.status, payload?.code || "");
    throw new Error("Store database request failed.");
  }
  return payload;
}

export function createOrderNumber() {
  const d = new Date();
  const date = [d.getUTCFullYear(), String(d.getUTCMonth() + 1).padStart(2, "0"), String(d.getUTCDate()).padStart(2, "0")].join("");
  return `KV-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export function safeEmail(value) {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function safeText(value, max = 150) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}
