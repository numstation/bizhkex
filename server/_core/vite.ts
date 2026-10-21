import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { RESERVED_PUBLIC_FILES } from "./publicFiles";

export { RESERVED_PUBLIC_FILES };

export function mountReservedPublic(app: Express, publicDir: string) {
  app.use((req, res, next) => {
    const pathname = (req.originalUrl || req.url || "/").split("?")[0];
    const mime = RESERVED_PUBLIC_FILES[pathname];
    if (!mime) return next();

    const filePath = path.join(publicDir, pathname);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.status(404);
      res.setHeader("Content-Type", mime);
      res.end("Not found");
      return;
    }

    const body = fs.readFileSync(filePath);
    res.status(200);
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Length", String(body.length));
    res.end(body);
  });
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  const clientPublic = path.resolve(import.meta.dirname, "../..", "client", "public");
  mountReservedPublic(app, clientPublic);
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const pathname = (req.originalUrl || "/").split("?")[0];
    if (RESERVED_PUBLIC_FILES[pathname]) {
      res.status(404).type(RESERVED_PUBLIC_FILES[pathname]).send("Not found");
      return;
    }
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  mountReservedPublic(app, distPath);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    const pathname = (req.originalUrl || "/").split("?")[0];
    if (RESERVED_PUBLIC_FILES[pathname]) {
      res.status(404).type(RESERVED_PUBLIC_FILES[pathname]).send("Not found");
      return;
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
