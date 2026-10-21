/** These URLs must be real files. Never answer them with the SPA shell. */
export const RESERVED_PUBLIC_FILES: Record<string, string> = {
  "/robots.txt": "text/plain; charset=utf-8",
  "/sitemap.xml": "application/xml; charset=utf-8",
  "/manifest.json": "application/manifest+json; charset=utf-8",
  "/favicon.ico": "image/x-icon",
  "/favicon.svg": "image/svg+xml",
  "/favicon-32.png": "image/png",
  "/favicon-192.png": "image/png",
  "/apple-touch-icon.png": "image/png",
  "/og-image.png": "image/png",
};
