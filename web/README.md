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

No Node.js runtime, `npm start`, PM2, Express, SSR, server functions, Cloudflare Worker, or API routes are required after upload.

## Contact Forms

The contact and FILFLEX access forms use a static `mailto:` flow. Submitting a form opens an email draft to `info@eliconsult.com` with the submitted fields in the email body.
