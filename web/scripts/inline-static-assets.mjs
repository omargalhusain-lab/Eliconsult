import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, normalize } from "node:path";

const dist = join(process.cwd(), "dist");
const assetsDir = join(dist, "assets");

const pages = [
  {
    htmlPath: join(dist, "index.html"),
    assetBase: "./assets/",
  },
  {
    htmlPath: join(dist, "filflex", "index.html"),
    assetBase: "../assets/",
  },
];

function fail(message) {
  throw new Error(`Static asset inline failed: ${message}`);
}

function readExisting(path) {
  if (!existsSync(path)) {
    fail(`${path} does not exist.`);
  }
  return readFileSync(path, "utf8");
}

function parseImportSpec(spec) {
  return spec.split(",").map((rawPart) => {
    const part = rawPart.trim();
    const match = part.match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
    if (!match) {
      fail(`Could not parse import/export spec "${part}".`);
    }
    return {
      source: match[1],
      target: match[2] || match[1],
    };
  });
}

function rewriteAssetUrls(js, assetBase) {
  return js.replace(
    /new URL\(`([^`]+)`,import\.meta\.url\)\.href/g,
    (_match, assetName) => JSON.stringify(`${assetBase}${assetName}`),
  );
}

function escapeForInlineScript(js) {
  return js.replace(/<\/script/gi, "<\\/script");
}

function toClassicSharedModule(js, assetBase) {
  const rewritten = rewriteAssetUrls(js, assetBase);
  const exportMatch = rewritten.match(/export\{([^}]+)\};?\s*$/);
  if (!exportMatch) {
    fail("Could not find shared module export statement.");
  }

  const mappings = parseImportSpec(exportMatch[1])
    .map(({ source, target }) => `${JSON.stringify(target)}:${source}`)
    .join(",");

  const classic = rewritten.replace(
    exportMatch[0],
    `window.__eliconsultShared={${mappings}};`,
  );
  return `(function(){${classic}})();`;
}

function toClassicEntryModule(js, assetBase) {
  const rewritten = rewriteAssetUrls(js, assetBase);
  const importMatch = rewritten.match(/^import\{([^}]+)\}from["']\.\/([^"']+)["'];?/);
  if (!importMatch) {
    fail("Could not find entry module import statement.");
  }

  const assignments = parseImportSpec(importMatch[1])
    .map(({ source, target }) => `${target}=window.__eliconsultShared[${JSON.stringify(source)}]`)
    .join(",");

  const classic = rewritten.replace(importMatch[0], `var ${assignments};`);
  return `(function(){${classic}})();`;
}

function extractAssetHrefs(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function resolveDistHref(htmlPath, href) {
  const pageDir = dirname(htmlPath);
  const absolute = normalize(join(pageDir, href));
  if (!absolute.startsWith(dist)) {
    fail(`Asset path escapes dist/: ${href}`);
  }
  return absolute;
}

function stripExternalAssetTags(html) {
  return html
    .replace(/\s*<script\b[^>]*\btype=["']module["'][^>]*><\/script>\s*/gi, "\n")
    .replace(/\s*<link\b[^>]*\brel=["']modulepreload["'][^>]*>\s*/gi, "\n")
    .replace(/\s*<link\b[^>]*\brel=["']stylesheet["'][^>]*>\s*/gi, "\n");
}

const generatedAssetFiles = new Set();

for (const page of pages) {
  const html = readExisting(page.htmlPath);
  const scriptHrefs = extractAssetHrefs(
    html,
    /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi,
  );
  const preloadHrefs = extractAssetHrefs(
    html,
    /<link\b[^>]*\brel=["']modulepreload["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi,
  );
  const cssHrefs = extractAssetHrefs(
    html,
    /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi,
  );

  if (scriptHrefs.length !== 1) {
    fail(`${page.htmlPath} should have exactly one module entry script.`);
  }
  if (preloadHrefs.length !== 1) {
    fail(`${page.htmlPath} should have exactly one shared module preload.`);
  }
  if (cssHrefs.length !== 1) {
    fail(`${page.htmlPath} should have exactly one stylesheet.`);
  }

  const entryPath = resolveDistHref(page.htmlPath, scriptHrefs[0]);
  const sharedPath = resolveDistHref(page.htmlPath, preloadHrefs[0]);
  const cssPath = resolveDistHref(page.htmlPath, cssHrefs[0]);
  generatedAssetFiles.add(entryPath);
  generatedAssetFiles.add(sharedPath);
  generatedAssetFiles.add(cssPath);

  const css = readExisting(cssPath);
  const sharedJs = toClassicSharedModule(readExisting(sharedPath), page.assetBase);
  const entryJs = toClassicEntryModule(readExisting(entryPath), page.assetBase);
  const inlineHtml = stripExternalAssetTags(html)
    .replace("</head>", () => `<style>${css}</style>\n  </head>`)
    .replace(
      "</body>",
      () => `<script>${escapeForInlineScript(`${sharedJs}\n${entryJs}`)}</script>\n  </body>`,
    );

  writeFileSync(page.htmlPath, inlineHtml);
}

for (const file of generatedAssetFiles) {
  if (existsSync(file) && /\.(js|css)$/i.test(basename(file))) {
    rmSync(file);
  }
}

for (const file of readdirSync(assetsDir)) {
  if (/\.(js|css)$/i.test(file)) {
    fail(`Unused generated ${file} still exists in dist/assets/.`);
  }
}

console.log("Static HTML assets inlined for file:// and cPanel hosting.");
