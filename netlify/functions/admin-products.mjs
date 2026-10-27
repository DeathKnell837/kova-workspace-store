import { adaptVercelHandler } from "../_lib/adapter.mjs";
import handler from "../../api/admin-products.js";

export default adaptVercelHandler(handler);
export const config = { path: "/api/admin-products" };
