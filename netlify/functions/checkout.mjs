import { adaptVercelHandler } from "../_lib/adapter.mjs";
import handler from "../../api/checkout.js";

export default adaptVercelHandler(handler);
export const config = { path: "/api/checkout" };
