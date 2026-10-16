import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { Streamdown } from "streamdown";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { path, t, locale } = useLocale();
  const theme = usePublicTheme();
  const hubPath = path("/knowledge-hub");

  const { data: article, isLoading, error } = trpc.knowledge.getArticleBySlug.useQuery(
    { slug: slug || "", locale },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className={`${theme.page} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-emerald-600 border-t-transparent" />
          <p className={`mt-4 ${theme.muted}`}>{t.knowledge.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={`${theme.page} flex flex-col`}>
        <SiteNav variant="minimal" backLabel={t.nav.knowledgeHub} backHref={hubPath} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-4 ${theme.heading}`}>{t.knowledge.notFound}</h1>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate(hubPath)}>
              {t.knowledge.backHub}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={theme.page}>
      <SiteNav variant="minimal" backLabel={t.nav.knowledgeHub} backHref={hubPath} />

      <section className={`border-b py-8 md:py-12 ${theme.divider} ${theme.isDark ? "bg-white/[0.02]" : "bg-white"}`}>
        <div className="container max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => navigate(hubPath)}
            className={`mb-6 flex items-center gap-2 -ml-2 ${theme.muted} hover:text-emerald-700 dark:hover:text-emerald-400`}
          >
            <ArrowLeft size={18} />
            {t.knowledge.backHub}
          </Button>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 text-sm font-semibold rounded-full">
              {article.categoryName}
            </span>
          </div>

          <h1 className={`text-3xl md:text-4xl font-black mb-6 ${theme.heading}`}>{article.title}</h1>

          <div className={`flex flex-wrap items-center gap-6 text-sm ${theme.subtle}`}>
            <span className="flex items-center gap-2">
              <User size={16} />
              {t.knowledge.byAuthor} {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {article.publishedAt &&
                new Date(article.publishedAt).toLocaleDateString(locale === "zh" ? "zh-HK" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container max-w-3xl">
          <Card className={`p-6 md:p-10 rounded-xl ${theme.glass}`}>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <Streamdown>{article.content}</Streamdown>
            </div>
          </Card>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8">
              <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme.heading}`}>
                <Tag size={18} className={theme.accent} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: { id: number; name: string }) => (
                  <span
                    key={tag.id}
                    className={`px-3 py-1 text-sm rounded-full ${theme.glassInner} ${theme.muted}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={`mt-10 p-6 rounded-xl border ${theme.savingsHighlight}`}>
            <h3 className={`font-bold text-lg mb-2 ${theme.heading}`}>{t.knowledge.featured}</h3>
            <p className={`${theme.muted} mb-4`}>{t.knowledge.subtitle}</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate(hubPath)}>
              {t.knowledge.allArticles}
            </Button>
          </div>
        </div>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
