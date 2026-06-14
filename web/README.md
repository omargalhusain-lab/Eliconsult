# Eliconsult Static Website

This folder contains the static cPanel-ready website source.

## Build Commands

```bash
npm install
npm run build
```

## Deployment Folder

Upload the contents of:

```text
dist/
```

directly into `public_html/` on standard cPanel hosting.

The build output contains:

- `index.html`
- `filflex/index.html`
- `assets/`
- `favicon.svg`
- `submit-form.php`

No Node.js runtime, `npm start`, PM2, Express, SSR, Cloudflare Worker, or JavaScript server is required after upload. Standard cPanel PHP must be enabled for `submit-form.php`.

## Contact Forms

The main contact form and FILFLEX access request form submit with AJAX to:

```text
/submit-form.php
```

The PHP handler validates and sanitizes submissions, applies honeypot and IP rate-limit checks, and sends emails to `info@eliconsults.com`.
