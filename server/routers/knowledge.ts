import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getArticleCategories,
  getArticles,
  getArticleBySlug,
  createArticle,
  addTagToArticle,
  getLocationComparison,
  createLocationComparison,
  incrementComparisonViewCount,
} from "../db";
import {
  getDemoArticles,
  getDemoCategories,
  getDemoArticleBySlug,
  type KnowledgeLocale,
} from "@shared/knowledgeArticles";

const localeSchema = z.enum(["en", "zh"]).default("zh");

export const knowledgeRouter = router({
  getCategories: publicProcedure
    .input(z.object({ locale: localeSchema.optional() }).optional())
    .query(async ({ input }) => {
      const locale = (input?.locale ?? "zh") as KnowledgeLocale;
      try {
        const rows = await getArticleCategories();
        if (rows.length > 0) return rows;
      } catch (error) {
        console.warn("[Knowledge] Categories fallback:", error);
      }
      return getDemoCategories(locale);
    }),

  getArticles: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        featured: z.boolean().optional(),
        limit: z.number().default(10),
        offset: z.number().default(0),
        locale: localeSchema.optional(),
      })
    )
    .query(async ({ input }) => {
      const locale = (input.locale ?? "zh") as KnowledgeLocale;
      try {
        const rows = await getArticles(
          input.categoryId,
          input.featured,
          input.limit,
          input.offset
        );
        if (rows.length > 0) return rows;
      } catch (error) {
        console.warn("[Knowledge] Articles fallback:", error);
      }
      return getDemoArticles(
        locale,
        input.categoryId,
        input.featured,
        input.limit,
        input.offset
      );
    }),

  getArticleBySlug: publicProcedure
    .input(z.object({ slug: z.string(), locale: localeSchema.optional() }))
    .query(async ({ input }) => {
      const locale = (input.locale ?? "zh") as KnowledgeLocale;
      try {
        const article = await getArticleBySlug(input.slug);
        if (article) return article;
      } catch (error) {
        console.warn("[Knowledge] Article by slug fallback:", error);
      }
      return getDemoArticleBySlug(input.slug, locale);
    }),

  createArticle: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        categoryId: z.number(),
        content: z.string().min(1),
        excerpt: z.string().min(1).max(500),
        author: z.string().optional(),
        featured: z.boolean().optional(),
        publishedAt: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create articles");
      }

      return await createArticle({
        title: input.title,
        slug: input.slug,
        categoryId: input.categoryId,
        content: input.content,
        excerpt: input.excerpt,
        author: input.author,
        featured: input.featured,
        publishedAt: input.publishedAt,
      });
    }),

  addTagToArticle: protectedProcedure
    .input(
      z.object({
        articleId: z.number(),
        tagId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can add tags to articles");
      }

      return await addTagToArticle(input.articleId, input.tagId);
    }),

  getLocationComparison: publicProcedure
    .input(
      z.object({
        officeId1: z.number(),
        officeId2: z.number(),
      })
    )
    .query(async ({ input }) => {
      const comparison = await getLocationComparison(
        input.officeId1,
        input.officeId2
      );

      if (comparison) {
        await incrementComparisonViewCount(comparison.id);
      }

      return comparison;
    }),

  createLocationComparison: protectedProcedure
    .input(
      z.object({
        officeId1: z.number(),
        officeId2: z.number(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create location comparisons");
      }

      return await createLocationComparison(
        input.officeId1,
        input.officeId2,
        input.title,
        input.description
      );
    }),
});
