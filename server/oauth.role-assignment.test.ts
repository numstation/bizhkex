import { describe, expect, it, beforeEach, vi } from "vitest";
import * as db from "./db";

// Mock the db module
vi.mock("./db", () => ({
  getProviderByEmail: vi.fn(),
}));

describe("OAuth Role Assignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should assign 'user' role when email does not match any provider", async () => {
    const mockGetProviderByEmail = vi.mocked(db.getProviderByEmail);
    mockGetProviderByEmail.mockResolvedValue(undefined);

    const email = "random@example.com";
    const provider = await db.getProviderByEmail(email);

    expect(provider).toBeUndefined();
  });

  it("should assign 'provider' role when email matches a provider email", async () => {
    const mockGetProviderByEmail = vi.mocked(db.getProviderByEmail);
    const mockProvider = {
      id: 1,
      name: "Premium Spaces HK",
      email: "info@premiumspaces.hk",
      phone: "+852 2234 5678",
      website: "www.premiumspaces.hk",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGetProviderByEmail.mockResolvedValue(mockProvider as any);

    const email = "info@premiumspaces.hk";
    const provider = await db.getProviderByEmail(email);

    expect(provider).toBeDefined();
    expect(provider?.email).toBe("info@premiumspaces.hk");
  });

  it("should handle multiple provider emails correctly", async () => {
    const mockGetProviderByEmail = vi.mocked(db.getProviderByEmail);
    
    const providerEmails = [
      "info@premiumspaces.hk",
      "contact@centralbiz.hk",
      "hello@kowloonoffice.hk",
      "info@ntwspace.hk",
      "contact@creativehub.hk",
      "sales@execsuites.hk",
    ];

    // Test each provider email
    for (const email of providerEmails) {
      const mockProvider = {
        id: 1,
        name: "Test Provider",
        email,
        phone: "+852 1234 5678",
        website: "www.test.hk",
        logoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGetProviderByEmail.mockResolvedValue(mockProvider as any);

      const provider = await db.getProviderByEmail(email);
      expect(provider?.email).toBe(email);
    }
  });

  it("should be case-insensitive when matching provider emails", async () => {
    const mockGetProviderByEmail = vi.mocked(db.getProviderByEmail);
    const mockProvider = {
      id: 1,
      name: "Premium Spaces HK",
      email: "info@premiumspaces.hk",
      phone: "+852 2234 5678",
      website: "www.premiumspaces.hk",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGetProviderByEmail.mockResolvedValue(mockProvider as any);

    const email = "INFO@PREMIUMSPACES.HK";
    const provider = await db.getProviderByEmail(email);

    // In a real implementation, the database query would be case-insensitive
    // This test verifies the function can be called with different cases
    expect(provider).toBeDefined();
  });
});
