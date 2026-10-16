import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

// Mock admin user context
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
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

describe("Admin Office Management", () => {
  it("should have admin office procedures defined", () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    // Verify that admin procedures exist
    expect(adminCaller.offices.create).toBeDefined();
    expect(adminCaller.offices.update).toBeDefined();
    expect(adminCaller.offices.delete).toBeDefined();
  });

  it("should prevent non-admin users from creating offices", async () => {
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);

    try {
      await userCaller.offices.create({
        name: "Unauthorized Office",
        address: "123 Test Street",
        districtId: 1,
        basePrice: 10000,
        rating: 4.5,
        reviewCount: 0,
      });
      expect.fail("Should have thrown a FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("permission");
    }
  });

  it("should prevent non-admin users from updating offices", async () => {
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);

    try {
      await userCaller.offices.update({
        id: 1,
        name: "Updated Office",
      });
      expect.fail("Should have thrown a FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should prevent non-admin users from deleting offices", async () => {
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);

    try {
      await userCaller.offices.delete({
        id: 1,
      });
      expect.fail("Should have thrown a FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow admin users to access office procedures", async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    // Verify that admin can call the procedures (they may fail due to DB issues, but not auth)
    try {
      // These will likely fail due to database constraints, but should not fail due to auth
      await adminCaller.offices.create({
        name: "Test Office",
        address: "Test Address",
        districtId: 1,
        basePrice: 10000,
        rating: 4.5,
        reviewCount: 0,
      });
    } catch (error: any) {
      // Should not be a FORBIDDEN error
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should list offices publicly", async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    // Public procedure should work for everyone
    const offices = await adminCaller.offices.list({
      limit: 10,
    });

    expect(Array.isArray(offices)).toBe(true);
  });

  it("should retrieve office by ID publicly", async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    // This will fail if no offices exist, but that's expected
    try {
      const office = await adminCaller.offices.getById({
        id: 1,
      });
      expect(office).toBeDefined();
    } catch (error: any) {
      // Expected if no office with ID 1 exists
      expect(error.code).toBe("NOT_FOUND");
    }
  });
});
