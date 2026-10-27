import { timingSafeEqual } from "node:crypto";

export function isAdmin(req) {
  const expected = process.env.ADMIN_TOKEN;
  const supplied = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}
