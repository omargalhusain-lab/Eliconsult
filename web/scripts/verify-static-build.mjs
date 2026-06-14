import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const requiredFiles = [
  "index.html",
  "filflex/index.html",
  "favicon.svg",
];
const forbiddenPaths = [
  "server",
  "client",
  ".openai",
  "wrangler.json",
  "_headers",
];

function fail(message) {
  console.error(`Static build verification failed: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(dist)) {
  fail("dist/ does not exist. Run npm run build first.");
} else {
  for (const file of requiredFiles) {
    if (!existsSync(join(dist, file))) {
      fail(`dist/${file} is missing.`);
    }
  }

  const assetsDir = join(dist, "assets");
  if (!existsSync(assetsDir) || !statSync(assetsDir).isDirectory()) {
    fail("dist/assets/ is missing.");
  } else if (readdirSync(assetsDir).length === 0) {
    fail("dist/assets/ is empty.");
  }

  for (const forbiddenPath of forbiddenPaths) {
    if (existsSync(join(dist, forbiddenPath))) {
      fail(`dist/${forbiddenPath} should not be present in a cPanel static build.`);
    }
  }

  for (const file of walk(dist)) {
    if (!/\.(html|css)$/i.test(file)) {
      continue;
    }

    const content = readFileSync(file, "utf8");
    const contentForMarkupChecks = file.endsWith(".html")
      ? content.replace(/<script\b(?![^>]*\bsrc=)[\s\S]*?<\/script>/gi, "")
      : content;

    if (/<script\b[^>]*\btype=["']module["']|<link\b[^>]*\brel=["']modulepreload["']/i.test(contentForMarkupChecks)) {
      fail(`${file} contains module script/preload tags that do not open reliably from file://.`);
    }
    if (/(?:href|src)=["']\/(?!\/)/i.test(contentForMarkupChecks)) {
      fail(`${file} contains a root-absolute href/src path.`);
    }
    if (/url\(\s*["']?\//i.test(contentForMarkupChecks)) {
      fail(`${file} contains a root-absolute CSS url().`);
    }
    if (/_next|_vinext|react-server|server\/index/i.test(contentForMarkupChecks)) {
      fail(`${file} contains server-framework output references.`);
    }
  }
}

if (!process.exitCode) {
  console.log("Static build verification passed.");
}
