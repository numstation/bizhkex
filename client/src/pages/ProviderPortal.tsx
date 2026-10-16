import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowRight, Building2 } from "lucide-react";
import { toast } from "sonner";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { usePublicTheme } from "@/hooks/usePublicTheme";
import { getVendorSignupContent } from "@/i18n/pages/vendorSignupContent";
import { trpc } from "@/lib/trpc";

export default function ProviderPortal() {
  const { user, loading } = useAuth();
  const { locale, path } = useLocale();
  const theme = usePublicTheme();
  const c = getVendorSignupContent(locale);
  const [email, setEmail] = useState("");
  const requestLogin = trpc.auth.requestProviderLogin.useMutation();

  if (!loading && user?.role === "provider") {
    return <Redirect to="/provider-dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(locale === "zh" ? "請輸入電郵地址" : "Please enter your email");
      return;
    }

    try {
      const result = await requestLogin.mutateAsync({ email });
      if (result.devLoginUrl) {
        toast.success(
          locale === "zh"
            ? "開發模式：登入連結已輸出到伺服器 console"
            : "Dev mode: login link logged to server console"
        );
        console.info("[BizHKEx] Dev login link:", result.devLoginUrl);
      } else {
        toast.success(
          locale === "zh"
            ? "登入連結已發送到你的電郵，請查收（包括垃圾郵件）。"
            : "Login link sent — check your inbox (and spam folder)."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : locale === "zh"
            ? "出錯了，請稍後再試。"
            : "Something went wrong. Please try again.";
      toast.error(
        message.includes("not registered")
          ? locale === "zh"
            ? "此電郵尚未登記，請先完成業主登記流程。"
            : "This email is not registered yet. Please complete vendor registration first."
          : message
      );
    }
  };

  const loggedInAsOther = !loading && user ? user.name || user.email || (locale === "zh" ? "其他帳戶" : "another account") : null;

  return (
    <div className={`min-h-screen flex flex-col ${theme.page}`}>
      <SiteNav variant="minimal" theme={theme.navTheme} backHref={path("/")} />

      <main className="flex-1 container py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          <div className={`${theme.glass} p-8 md:p-10`}>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
              <Building2 className={`w-6 h-6 ${theme.accent}`} />
            </div>
            <h1 className={`text-3xl font-black mb-3 ${theme.heading}`}>
              {locale === "zh" ? "業主及賣家後台" : "Vendor dashboard"}
            </h1>
            <p className={`${theme.muted} leading-relaxed mb-8`}>
              {locale === "zh"
                ? "登入後可管理盤源、查看客戶詢盤及更新刊登資料。"
                : "Sign in to manage listings, view inquiries, and update your published profile."}
            </p>
            <ul className="space-y-3">
              {c.leftBullets.slice(0, 3).map((point) => (
                <li key={point} className={`flex items-start gap-2 text-sm ${theme.muted}`}>
                  <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${theme.accent}`} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${theme.glass} p-8 md:p-10 border-emerald-200 dark:border-emerald-500/25`}>
            <h2 className={`text-2xl font-black mb-2 ${theme.heading}`}>{c.loginLink}</h2>
            <p className={`${theme.subtle} text-sm mb-6`}>
              {locale === "zh"
                ? "使用登記時填寫的電郵，我哋會發送安全登入連結（1 小時內有效）。"
                : "Use the same email from registration — we'll send a secure sign-in link (valid 1 hour)."}
            </p>

            {loggedInAsOther && (
              <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30">
                <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                  {locale === "zh"
                    ? `你目前已以「${loggedInAsOther}」登入。如需使用業主後台，請先登出再以業主電郵登入。`
                    : `You're signed in as "${loggedInAsOther}". Log out and sign in with your vendor email.`}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="provider-email" className={`text-xs ${theme.label} mb-2 block`}>
                  {locale === "zh" ? "電郵地址" : "Email"}
                </label>
                <Input
                  id="provider-email"
                  name="email"
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={theme.input}
                  required
                />
              </div>

              <div className={`flex items-start gap-3 p-4 rounded-xl ${theme.glassInner}`}>
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${theme.accent}`} />
                <p className={`text-sm ${theme.muted} leading-relaxed`}>
                  {locale === "zh"
                    ? "無須密碼。提交後請查收電郵內嘅登入連結。"
                    : "No password needed. Check your email for the sign-in link after submitting."}
                </p>
              </div>

              <Button
                type="submit"
                disabled={requestLogin.isPending || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-6 text-lg"
              >
                {requestLogin.isPending
                  ? locale === "zh"
                    ? "發送中..."
                    : "Sending..."
                  : locale === "zh"
                    ? "發送登入連結"
                    : "Send login link"}
                {!requestLogin.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>

            <div className={`mt-8 pt-6 border-t ${theme.dividerLight} text-center space-y-4`}>
              <p className={`text-sm ${theme.subtle}`}>
                {locale === "zh" ? "還未有帳戶？" : "Don't have an account yet?"}
              </p>
              <Link href={path("/provider-signup")}>
                <Button variant="outline" className={`w-full font-bold py-5 ${theme.outlineBtn}`}>
                  {locale === "zh" ? "立即登記" : "Register now"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer variant={theme.footerVariant} />
    </div>
  );
}
