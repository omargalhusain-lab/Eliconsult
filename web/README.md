# Eliconsults cPanel Upload

This folder now keeps only the cPanel-ready website package.

Upload the contents of:

```text
dist/
```

directly into `public_html/`.

The upload folder contains:

- `index.html`
- `filflex/index.html`
- `assets/`
- `favicon.svg`
- `submit-form.php`

No Node.js, npm, Vite, SSR, Express, PM2, or server runtime is required on hosting. Standard cPanel PHP must be enabled for `submit-form.php`.

Contact forms submit with AJAX to `/submit-form.php`, and the PHP handler sends requests to `info@eliconsults.com`.
