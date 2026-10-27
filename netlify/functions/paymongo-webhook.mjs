import { adaptVercelHandler } from "../_lib/adapter.mjs";
import handler from "../../api/paymongo-webhook.js";

export default adaptVercelHandler(handler);
export const config = { path: "/api/paymongo-webhook" };
