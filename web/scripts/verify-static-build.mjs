import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const requiredFiles = [
  "index.html",
  "filflex/index.html",
  "favicon.svg",
  "submit-form.php",
];
const forbiddenPaths = [
  "server",
  "client",
  ".openai",
  "wrangler.json",
  "_headers",
];
const mailtoPattern = new RegExp("mail" + "to:", "i");

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

function isTextFile(file) {
  return /\.(html|css|js|json|php|svg|txt|xml)$/i.test(file);
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

  let hasFormEndpoint = false;
  const submitFormPhp = join(dist, "submit-form.php");
  const submitFormContent = existsSync(submitFormPhp)
    ? readFileSync(submitFormPhp, "utf8")
    : "";

  if (!/const DESTINATION_EMAIL = 'info@eliconsults\.com';/.test(submitFormContent)) {
    fail("dist/submit-form.php must send to info@eliconsults.com.");
  }
  if (/X-Mailer|phpversion\s*\(/i.test(submitFormContent)) {
    fail("dist/submit-form.php exposes server implementation details.");
  }
  if (!/Main Contact Form/.test(submitFormContent) || !/FILFLEX Access Request Form/.test(submitFormContent)) {
    fail("dist/submit-form.php must support both production forms.");
  }
  if (!/Eliconsults - Main Contact Form/.test(submitFormContent) || !/Eliconsults - FILFLEX Access Request Form/.test(submitFormContent)) {
    fail("dist/submit-form.php subjects must include the form type.");
  }
  if (!/\$_SERVER\['REQUEST_METHOD'\]\s*!==\s*'POST'/.test(submitFormContent)) {
    fail("dist/submit-form.php must reject non-POST requests.");
  }
  if (!/Content-Type: application\/json; charset=UTF-8/.test(submitFormContent)) {
    fail("dist/submit-form.php must return UTF-8 JSON responses.");
  }

  for (const file of walk(dist)) {
    if (!isTextFile(file)) {
      continue;
    }

    const content = readFileSync(file, "utf8");
    if (mailtoPattern.test(content)) {
      fail(`${file} contains mailto functionality.`);
    }
    if (/info@eliconsult\.com/i.test(content)) {
      fail(`${file} contains the old singular-domain email address.`);
    }
    if (/\/submit-form\.php/.test(content)) {
      hasFormEndpoint = true;
    }

    if (!/\.(html|css)$/i.test(file)) {
      continue;
    }

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

  if (!hasFormEndpoint) {
    fail("dist output does not reference /submit-form.php for form submissions.");
  }
}

if (!process.exitCode) {
  console.log("Static build verification passed.");
}
