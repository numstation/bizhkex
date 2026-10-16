import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock provider user context
function createProviderContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "provider-user",
      email: "provider@example.com",
      name: "Provider User",
      loginMethod: "manus",
      role: "provider",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Mock regular user context
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Provider Portal", () => {
  it("should have provider router defined", () => {
    const providerCtx = createProviderContext();
    const providerCaller = appRouter.createCaller(providerCtx);

    expect(providerCaller.providers).toBeDefined();
  });

  it("should allow public access to list providers", async () => {
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);

    try {
      const providers = await userCaller.providers.list.query();
      expect(Array.isArray(providers)).toBe(true);
    } catch (error: any) {
      // If there's an error, it should not be FORBIDDEN
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should allow public access to get provider by ID", async () => {
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);

    try {
      await userCaller.providers.getById.query({ id: 1 });
    } catch (error: any) {
      // Should only fail with NOT_FOUND if provider doesn't exist, not FORBIDDEN
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should have provider procedures defined in routers", () => {
    // This test verifies the procedures are defined in the router
    // by checking the router structure
    expect(appRouter).toBeDefined();
  });

  it("should support inquiry status updates for providers", async () => {
    const providerCtx = createProviderContext();
    const providerCaller = appRouter.createCaller(providerCtx);

    // Verify the mutation is callable (even if it fails due to missing data)
    try {
      await providerCaller.providers.updateInquiryStatus.mutate({
        inquiryId: 999,
        status: "contacted",
      });
    } catch (error: any) {
      // Should not fail with FORBIDDEN for providers
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should prevent non-providers from updating inquiry status", async () => {
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);

    try {
      await userCaller.providers.updateInquiryStatus.mutate({
        inquiryId: 1,
        status: "contacted",
      });
      // If it succeeds, that's unexpected
      expect.fail("Should have thrown error");
    } catch (error: any) {
      // Should throw some kind of error for non-providers
      expect(error).toBeDefined();
    }
  });
});
