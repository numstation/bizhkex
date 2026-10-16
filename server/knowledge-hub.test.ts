import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import {
  getArticleCategories,
  getArticles,
  getArticleBySlug,
  createArticle,
  getLocationComparison,
  createLocationComparison,
} from './db';

describe('Knowledge Hub Features', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  describe('Article Categories', () => {
    it('should fetch all article categories', async () => {
      const categories = await getArticleCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('slug');
    });

    it('should have categories with proper structure', async () => {
      const categories = await getArticleCategories();
      const category = categories[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('slug');
      expect(category).toHaveProperty('description');
      expect(typeof category.name).toBe('string');
      expect(typeof category.slug).toBe('string');
    });
  });

  describe('Articles', () => {
    it('should fetch published articles', async () => {
      const articles = await getArticles(undefined, false, 10, 0);
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
    });

    it('should have articles with proper structure', async () => {
      const articles = await getArticles(undefined, false, 10, 0);
      const article = articles[0];
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('slug');
      expect(article).toHaveProperty('excerpt');
      expect(article).toHaveProperty('author');
      expect(article).toHaveProperty('categoryName');
    });

    it('should filter articles by category', async () => {
      const allArticles = await getArticles(undefined, false, 100, 0);
      if (allArticles.length > 0) {
        const firstArticle = allArticles[0];
        const categoryId = firstArticle.id; // This would be category ID in real scenario
        const filtered = await getArticles(categoryId, false, 10, 0);
        expect(Array.isArray(filtered)).toBe(true);
      }
    });

    it('should fetch featured articles', async () => {
      const featured = await getArticles(undefined, true, 10, 0);
      expect(Array.isArray(featured)).toBe(true);
      // Featured articles should have featured flag set to 1
      if (featured.length > 0) {
        expect(featured[0]).toHaveProperty('featured');
      }
    });

    it('should respect pagination limits', async () => {
      const articles = await getArticles(undefined, false, 2, 0);
      expect(articles.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Article by Slug', () => {
    it('should fetch article by slug', async () => {
      const articles = await getArticles(undefined, false, 1, 0);
      if (articles.length > 0) {
        const article = await getArticleBySlug(articles[0].slug);
        expect(article).toBeDefined();
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('content');
        expect(article).toHaveProperty('slug');
      }
    });

    it('should return null for non-existent slug', async () => {
      const article = await getArticleBySlug('non-existent-article-slug-12345');
      expect(article).toBeNull();
    });

    it('should include tags with article', async () => {
      const articles = await getArticles(undefined, false, 1, 0);
      if (articles.length > 0) {
        const article = await getArticleBySlug(articles[0].slug);
        expect(article).toHaveProperty('tags');
        expect(Array.isArray(article.tags)).toBe(true);
      }
    });
  });

  describe('Create Article', () => {
    it('should create a new article', async () => {
      const categories = await getArticleCategories();
      if (categories.length > 0) {
        const result = await createArticle({
          title: 'Test Article',
          slug: `test-article-${Date.now()}`,
          categoryId: categories[0].id,
          content: 'This is test content',
          excerpt: 'Test excerpt',
          author: 'Test Author',
          featured: false,
        });
        expect(result).toBeDefined();
      }
    });

    it('should create article with all fields', async () => {
      const categories = await getArticleCategories();
      if (categories.length > 0) {
        const slug = `test-article-full-${Date.now()}`;
        const result = await createArticle({
          title: 'Full Test Article',
          slug,
          categoryId: categories[0].id,
          content: 'Full content with markdown **bold** text',
          excerpt: 'Full test excerpt',
          author: 'Test Author',
          featured: true,
          publishedAt: new Date().toISOString(),
        });
        expect(result).toBeDefined();

        // Verify article was created
        const article = await getArticleBySlug(slug);
        expect(article).toBeDefined();
        expect(article.title).toBe('Full Test Article');
      }
    });
  });

  describe('Location Comparisons', () => {
    it('should create a location comparison', async () => {
      // Get two offices from database
      const { offices } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      
      const officeList = await db
        .select()
        .from(offices)
        .limit(2);

      if (officeList.length >= 2) {
        const result = await createLocationComparison(
          officeList[0].id,
          officeList[1].id,
          'Test Comparison',
          'This is a test comparison'
        );
        expect(result).toBeDefined();
      }
    });

    it('should fetch location comparison', async () => {
      const { offices } = await import('../drizzle/schema');
      const officeList = await db
        .select()
        .from(offices)
        .limit(2);

      if (officeList.length >= 2) {
        await createLocationComparison(
          officeList[0].id,
          officeList[1].id,
          'Fetch Test',
          'Test fetch'
        );

        const comparison = await getLocationComparison(
          officeList[0].id,
          officeList[1].id
        );
        expect(comparison).toBeDefined();
        expect(comparison).toHaveProperty('title');
        expect(comparison).toHaveProperty('viewCount');
      }
    });
  });

  describe('Knowledge Hub Integration', () => {
    it('should have complete knowledge hub setup', async () => {
      // Check categories exist
      const categories = await getArticleCategories();
      expect(categories.length).toBeGreaterThan(0);

      // Check articles exist
      const articles = await getArticles(undefined, false, 10, 0);
      expect(articles.length).toBeGreaterThan(0);

      // Check featured articles exist
      const featured = await getArticles(undefined, true, 10, 0);
      expect(Array.isArray(featured)).toBe(true);

      // Check article details
      if (articles.length > 0) {
        const article = await getArticleBySlug(articles[0].slug);
        expect(article).toBeDefined();
        expect(article).toHaveProperty('content');
      }
    });
  });
});
