import { adaptVercelHandler } from "../_lib/adapter.mjs";
import handler from "../../api/order-status.js";

export default adaptVercelHandler(handler);
export const config = { path: "/api/order-status" };
