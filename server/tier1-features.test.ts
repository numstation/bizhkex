import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import * as db from './db';

describe('Tier 1 Features - Pricing, Photos, and Promotions', () => {
  let testOfficeId: number;
  let testProviderId: number;

  beforeAll(async () => {
    // Setup: Create test provider and office
    const database = await getDb();
    if (!database) {
      throw new Error('Database not available');
    }

    // Get first provider and office for testing
    const offices = await db.getOffices(1);
    if (offices.length > 0) {
      testOfficeId = offices[0].id;
      testProviderId = offices[0].providerId;
    }
  });

  describe('Pricing Packages', () => {
    it('should get pricing packages for an office', async () => {
      const packages = await db.getOfficePricingPackages(testOfficeId);
      expect(Array.isArray(packages)).toBe(true);
    });

    it('should create a pricing package', async () => {
      const newPackage = {
        officeId: testOfficeId,
        deskType: 'private_office' as const,
        name: 'Executive Suite',
        description: 'Premium private office',
        price: 8000,
        billingCycle: 'monthly' as const,
        capacity: 4,
      };

      await db.upsertPricingPackage(newPackage);
      const packages = await db.getOfficePricingPackages(testOfficeId);
      
      expect(packages.length).toBeGreaterThan(0);
      const created = packages.find(p => p.name === 'Executive Suite');
      expect(created).toBeDefined();
      expect(parseFloat(created?.price as any)).toBe(8000);
    });

    it('should handle multiple desk types', async () => {
      const deskTypes = ['private_office', 'dedicated_desk', 'hot_desk', 'virtual_office'] as const;
      
      for (const deskType of deskTypes) {
        const pkg = {
          officeId: testOfficeId,
          deskType,
          name: `${deskType} Package`,
          price: 5000,
        };
        
        await db.upsertPricingPackage(pkg);
      }

      const packages = await db.getOfficePricingPackages(testOfficeId);
      const types = packages.map(p => p.deskType);
      
      expect(types).toContain('private_office');
      expect(types).toContain('dedicated_desk');
      expect(types).toContain('hot_desk');
      expect(types).toContain('virtual_office');
    });
  });

  describe('Office Photos', () => {
    it('should get office photos', async () => {
      const photos = await db.getOfficePhotos(testOfficeId);
      expect(Array.isArray(photos)).toBe(true);
    });

    it('should add office photo', async () => {
      const photoUrl = 'https://example.com/photo1.jpg';
      
      await db.addOfficePhoto(testOfficeId, photoUrl, 0);
      const photos = await db.getOfficePhotos(testOfficeId);
      
      expect(photos.length).toBeGreaterThan(0);
      const added = photos.find(p => p.photoUrl === photoUrl);
      expect(added).toBeDefined();
    });

    it('should maintain photo display order', async () => {
      const photos = [
        { url: 'https://example.com/photo1.jpg', order: 0 },
        { url: 'https://example.com/photo2.jpg', order: 1 },
        { url: 'https://example.com/photo3.jpg', order: 2 },
      ];

      for (const photo of photos) {
        await db.addOfficePhoto(testOfficeId, photo.url, photo.order);
      }

      const retrieved = await db.getOfficePhotos(testOfficeId);
      expect(retrieved.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Office Promotions', () => {
    it('should update office promotion status', async () => {
      await db.updateOfficePromotion(testOfficeId, true, 20);
      const office = await db.getOfficeById(testOfficeId);
      
      expect(office?.isPromoted).toBe(1);
      expect(office?.discountPercentage).toBe('20.00');
    });

    it('should handle discount percentage validation', async () => {
      // Test with valid discount
      await db.updateOfficePromotion(testOfficeId, true, 50);
      const office = await db.getOfficeById(testOfficeId);
      
      expect(office?.discountPercentage).toBe('50.00');
    });

    it('should remove promotion', async () => {
      await db.updateOfficePromotion(testOfficeId, false, 0);
      const office = await db.getOfficeById(testOfficeId);
      
      expect(office?.isPromoted).toBe(0);
      expect(office?.discountPercentage).toBe('0.00');
    });
  });

  describe('Integration Tests', () => {
    it('should support full tier 1 workflow', async () => {
      // 1. Add photos
      await db.addOfficePhoto(testOfficeId, 'https://example.com/main.jpg', 0);
      await db.addOfficePhoto(testOfficeId, 'https://example.com/detail.jpg', 1);

      // 2. Add pricing for multiple desk types
      const packages = [
        { deskType: 'private_office' as const, name: 'Private Office', price: 8000 },
        { deskType: 'dedicated_desk' as const, name: 'Dedicated Desk', price: 5000 },
        { deskType: 'hot_desk' as const, name: 'Hot Desk', price: 2500 },
      ];

      for (const pkg of packages) {
        await db.upsertPricingPackage({
          officeId: testOfficeId,
          ...pkg,
        });
      }

      // 3. Set promotion
      await db.updateOfficePromotion(testOfficeId, true, 15);

      // 4. Verify all data
      const photos = await db.getOfficePhotos(testOfficeId);
      const pricing = await db.getOfficePricingPackages(testOfficeId);
      const office = await db.getOfficeById(testOfficeId);

      expect(photos.length).toBeGreaterThanOrEqual(2);
      expect(pricing.length).toBeGreaterThanOrEqual(3);
      expect(office?.isPromoted).toBe(1);
      expect(office?.discountPercentage).toBe('15.00');
    });
  });
});
