import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Calendar, User } from "lucide-react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";

export default function KnowledgeHub() {
  const { path, locale, t } = useLocale();
  const theme = usePublicTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  const { data: categories = [] } = trpc.knowledge.getCategories.useQuery({ locale });

  const { data: articles = [] } = trpc.knowledge.getArticles.useQuery({
    categoryId: selectedCategory,
    limit: 20,
    offset: 0,
    locale,
  });

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    return articles.filter(
      (article: { title: string; excerpt: string }) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  const featuredArticles = useMemo(() => {
    return articles.filter((article) => article.featured === 1).slice(0, 3);
  }, [articles]);

  return (
    <div className={theme.page}>
      <SiteNav variant="minimal" />

      <section className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-gray-900 text-white py-12 md:py-16">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-black mb-4">{t.knowledge.title}</h1>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl">{t.knowledge.subtitle}</p>

          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder={t.knowledge.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 py-3 text-base bg-white text-gray-900 border-0 rounded-lg shadow-sm"
            />
          </div>
        </div>
      </section>

      {featuredArticles.length > 0 && (
        <section className={`py-12 border-b ${theme.divider} ${theme.isDark ? "bg-white/[0.02]" : "bg-white"}`}>
          <div className="container max-w-6xl">
            <h2 className={`text-2xl font-bold mb-8 ${theme.heading}`}>{t.knowledge.featured}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article.id} href={path(`/article/${article.slug}`)}>
                  <Card className={`h-full transition-all cursor-pointer rounded-xl ${theme.glass} ${theme.cardHover}`}>
                    <div className="p-6 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 text-xs font-semibold rounded-full">
                          {article.categoryName}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${theme.heading}`}>
                        {article.title}
                      </h3>
                      <p className={`${theme.muted} text-sm mb-4 line-clamp-3 flex-grow`}>
                        {article.excerpt}
                      </p>
                      <div className={`flex items-center justify-between text-xs ${theme.subtle}`}>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {article.author}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className={`rounded-xl p-6 sticky top-24 ${theme.glass}`}>
                <h3 className={`font-bold text-lg mb-4 ${theme.heading}`}>{t.knowledge.categories}</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === undefined ? "default" : "outline"}
                    onClick={() => setSelectedCategory(undefined)}
                    className={`w-full justify-start rounded-lg ${
                      selectedCategory === undefined
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : theme.outlineBtn
                    }`}
                  >
                    {t.knowledge.allArticles}
                  </Button>
                  {categories.map((category: { id: number; name: string }) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full justify-start rounded-lg ${
                        selectedCategory === category.id
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : theme.outlineBtn
                      }`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Link key={article.id} href={path(`/article/${article.slug}`)}>
                      <Card className={`transition-all cursor-pointer rounded-xl ${theme.glass} ${theme.cardHover}`}>
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 text-xs font-semibold rounded-full">
                              {article.categoryName}
                            </span>
                            <span className={`text-xs ${theme.subtle}`}>
                              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <h3 className={`text-xl font-bold mb-2 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${theme.heading}`}>
                            {article.title}
                          </h3>
                          <p className={`${theme.muted} mb-4`}>{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${theme.subtle} flex items-center gap-1`}>
                              <User size={14} />
                              {t.knowledge.byAuthor} {article.author}
                            </span>
                            <span className={`${theme.accent} font-semibold text-sm`}>
                              {t.knowledge.readMore} →
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 rounded-xl ${theme.glass}`}>
                  <p className={`${theme.muted} text-lg`}>{t.knowledge.empty}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
