import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
const publicFiles = ["index.html", "policies.html", "robots.txt", "sitemap.xml", "google13d0c0668cae1334.html"];

await mkdir(output, { recursive: true });
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) {
  await cp(resolve(root, file), resolve(output, file));
}
await cp(resolve(root, "guides"), resolve(output, "guides"), { recursive: true });

console.log(`Prepared ${publicFiles.length} public files and the guides directory in dist/.`);
