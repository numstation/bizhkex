import { createHash } from "crypto";

export function providerOpenIdForEmail(email: string): string {
  const hash = createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
  return `pv:${hash.slice(0, 61)}`;
}
