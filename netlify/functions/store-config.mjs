import { adaptVercelHandler } from "../_lib/adapter.mjs";
import handler from "../../api/store-config.js";

export default adaptVercelHandler(handler);
export const config = { path: "/api/store-config" };
