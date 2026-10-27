import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
const publicFiles = ["index.html", "storefront.js", "admin.html", "policies.html"];

await mkdir(output, { recursive: true });
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) {
  await cp(resolve(root, file), resolve(output, file));
}

console.log(`Prepared ${publicFiles.length} public files in dist/.`);
