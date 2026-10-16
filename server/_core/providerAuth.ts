import { SignJWT, jwtVerify } from "jose";
import { providerOpenIdForEmail } from "@shared/providerAuth";
import type { Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sendProviderLoginLink } from "./emailService";
import { isDevRegisteredVendorEmail } from "../routers/vendor";
import { sdk } from "./sdk";

const LOGIN_PURPOSE = "provider-login";
const LOGIN_EXPIRY = "1h";

function authSecret() {
  const secret = ENV.cookieSecret || "bizhkex-dev-provider-auth";
  return new TextEncoder().encode(secret);
}

export async function signProviderLoginToken(email: string): Promise<string> {
  return new SignJWT({
    email: email.toLowerCase().trim(),
    purpose: LOGIN_PURPOSE,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(LOGIN_EXPIRY)
    .sign(authSecret());
}

export async function verifyProviderLoginToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, authSecret(), {
      algorithms: ["HS256"],
    });
    if (payload.purpose !== LOGIN_PURPOSE || typeof payload.email !== "string") {
      return null;
    }
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function requestProviderLoginLink(
  email: string,
  origin: string
): Promise<{ sent: boolean; devLoginUrl?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const provider = await db.getProviderByEmail(normalizedEmail);
  const registration = await db.getVendorRegistrationByEmail(normalizedEmail);
  const devRegistered = isDevRegisteredVendorEmail(normalizedEmail);

  if (!provider && !registration && !devRegistered) {
    throw new Error("EMAIL_NOT_REGISTERED");
  }

  if (!provider && (registration?.status !== "approved" || (!registration && devRegistered))) {
    throw new Error("REGISTRATION_PENDING");
  }

  const token = await signProviderLoginToken(normalizedEmail);
  const loginUrl = `${origin.replace(/\/$/, "")}/api/provider/verify-login?token=${encodeURIComponent(token)}`;
  const sent = await sendProviderLoginLink({
    email: normalizedEmail,
    name: provider?.name ?? registration?.contactName ?? normalizedEmail,
    loginUrl,
  });

  if (!sent && !ENV.isProduction) {
    console.log("[ProviderAuth] Dev login link:", loginUrl);
    return { sent: false, devLoginUrl: loginUrl };
  }

  return { sent };
}

export async function completeProviderLogin(email: string, displayName?: string | null) {
  const normalizedEmail = email.toLowerCase().trim();
  const provider = await db.getProviderByEmail(normalizedEmail);
  const registration = await db.getVendorRegistrationByEmail(normalizedEmail);

  if (!provider && registration?.status !== "approved") {
    throw new Error("REGISTRATION_PENDING");
  }

  await db.ensureProviderForVendor({
    email: normalizedEmail,
    name: provider?.name ?? registration?.name ?? displayName ?? normalizedEmail,
    phone: provider?.phone ?? registration?.phone ?? "",
    contactName: registration?.contactName ?? displayName ?? normalizedEmail,
  });

  const openId = providerOpenIdForEmail(normalizedEmail);
  await db.upsertUser({
    openId,
    email: normalizedEmail,
    name: displayName ?? normalizedEmail,
    role: "provider",
    loginMethod: "email",
    lastSignedIn: new Date(),
  });

  const user = await db.getUserByOpenId(openId);
  if (!user) {
    throw new Error("Failed to create provider user");
  }

  await db.linkProviderToUser(normalizedEmail, user.id);
  return { openId, name: user.name ?? displayName ?? normalizedEmail };
}

export function registerProviderAuthRoutes(app: import("express").Express) {
  app.get("/api/provider/verify-login", async (req: Request, res: Response) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send("Missing login token.");
      return;
    }

    const payload = await verifyProviderLoginToken(token);
    if (!payload) {
      res.status(400).send("This login link has expired or is invalid. Please request a new one.");
      return;
    }

    try {
      const { openId, name } = await completeProviderLogin(payload.email);
      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/provider-dashboard");
    } catch (error) {
      if (error instanceof Error && error.message === "REGISTRATION_PENDING") {
        res
          .status(403)
          .send(
            "This registration is still in the review queue and has not been published. Dashboard access opens after BizHKEx approves the centre."
          );
        return;
      }
      console.error("[ProviderAuth] Verify login failed:", error);
      res.status(500).send("Unable to complete login. Please try again.");
    }
  });
}
