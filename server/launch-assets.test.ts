import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RESERVED_PUBLIC_FILES } from "./_core/publicFiles";

const publicDir = path.resolve(import.meta.dirname, "../client/public");

describe("reserved public files", () => {
  it("ships real crawler and icon files instead of an HTML shell", () => {
    for (const pathname of Object.keys(RESERVED_PUBLIC_FILES)) {
      const filePath = path.join(publicDir, pathname);
      const buf = fs.readFileSync(filePath);
      expect(buf.length).toBeGreaterThan(20);
      expect(buf.subarray(0, 20).toString("utf8").toLowerCase()).not.toContain("<!doctype");
      expect(buf.subarray(0, 20).toString("utf8").toLowerCase()).not.toContain("<html");
    }
  });

  it("points robots at the production sitemap and describes the manifest in Chinese", () => {
    const robots = fs.readFileSync(path.join(publicDir, "robots.txt"), "utf8");
    expect(robots).toContain("Sitemap: https://www.bizhkex.com/sitemap.xml");
    expect(robots).not.toContain("bizhkex.hk");
    const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
    expect(sitemap).toContain("https://www.bizhkex.com/zh/office/101");
    expect(sitemap).not.toContain(".html");
    const manifest = JSON.parse(fs.readFileSync(path.join(publicDir, "manifest.json"), "utf8"));
    expect(manifest.name).toBe("BizHKEx");
    expect(manifest.description).toContain("香港");
    expect(manifest.icons.some((icon: { src: string }) => icon.src === "/favicon-192.png")).toBe(true);
  });
});
