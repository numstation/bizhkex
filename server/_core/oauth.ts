import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      // Determine user role based on email
      let userRole = 'user';
      
      // Check if user is admin (citylap@gmail.com)
      if (userInfo.email === 'citylap@gmail.com') {
        userRole = 'admin';
        console.log('[OAuth] Assigning admin role to citylap@gmail.com');
      } else if (userInfo.email) {
        // Check if user is a provider
        try {
          const provider = await db.getProviderByEmail(userInfo.email);
          if (provider) {
            userRole = 'provider';
            console.log('[OAuth] Assigning provider role to', userInfo.email);
          }
        } catch (error) {
          console.warn('[OAuth] Failed to check provider status:', error);
          // Continue with user role if provider check fails
        }
      }

      console.log('[OAuth] Upserting user with role:', userRole, 'email:', userInfo.email);
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
        role: userRole,
      });
      console.log('[OAuth] User upserted successfully with role:', userRole);

      if (userInfo.email && userRole === "provider") {
        const user = await db.getUserByOpenId(userInfo.openId);
        if (user) {
          await db.linkProviderToUser(userInfo.email, user.id);
        }
      }

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, userRole === "provider" ? "/provider-dashboard" : "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
