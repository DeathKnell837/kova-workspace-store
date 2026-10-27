export function json(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(data));
}

export async function readJson(req, maxBytes = 16_384) {
  // Vercel's Node runtime may pre-parse JSON requests into req.body. Honor the
  // same size limit in either mode; webhook routes disable parsing separately.
  if (req.body !== undefined) {
    const body = req.body;
    const serialized = Buffer.isBuffer(body) ? body.toString("utf8") : typeof body === "string" ? body : JSON.stringify(body);
    if (Buffer.byteLength(serialized || "", "utf8") > maxBytes) throw new Error("Request is too large.");
    return typeof body === "string" || Buffer.isBuffer(body) ? JSON.parse(serialized) : body;
  }
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > maxBytes) throw new Error("Request is too large.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function requireMethod(req, res, method) {
  if (req.method === method) return true;
  res.setHeader("Allow", method);
  json(res, 405, { error: "Method not allowed." });
  return false;
}
