import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import ProviderPortal from "@/pages/ProviderPortal";
import ProviderSignup from "@/pages/ProviderSignup";
import ProviderDashboard from "@/pages/ProviderDashboard";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import About from "@/pages/About";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { WhatsAppProvider } from "./contexts/WhatsAppContext";
import Home from "./pages/Home";
import Offices from "./pages/Offices";
import OfficeDetail from "./pages/OfficeDetail";
import BusinessMarketplace from "./pages/BusinessMarketplace";
import BusinessDetail from "./pages/BusinessDetail";
import BusinessBuyerGuide from "./pages/BusinessBuyerGuide";
import Admin from "./pages/Admin";
import { WhatsAppWidget } from "./components/WhatsAppWidget";
import KnowledgeHub from "./pages/KnowledgeHub";
import ArticleDetail from "./pages/ArticleDetail";
import { LocaleRedirect } from "./components/LocaleRedirect";
import { DEFAULT_LOCALE } from "./i18n";
import type { ComponentType } from "react";

function LocalizedPublicRoutes() {
  const locales = ["en", "zh"] as const;
  const routes: Array<{ path: string; component: ComponentType }> = [
    { path: "", component: Home },
    { path: "/offices", component: Offices },
    { path: "/office/:id", component: OfficeDetail },
    { path: "/business-marketplace", component: BusinessMarketplace },
    { path: "/business-buyer-guide", component: BusinessBuyerGuide },
    { path: "/business/:id", component: BusinessDetail },
    { path: "/about", component: About },
    { path: "/terms", component: Terms },
    { path: "/privacy", component: Privacy },
    { path: "/knowledge-hub", component: KnowledgeHub },
    { path: "/article/:slug", component: ArticleDetail },
    { path: "/provider-signup", component: ProviderSignup },
    { path: "/provider", component: ProviderPortal },
  ];

  return (
    <>
      {locales.flatMap((locale) =>
        routes.map(({ path, component: Component }) => (
          <Route key={`${locale}${path || "/"}`} path={path ? `/${locale}${path}` : `/${locale}`}>
            <Component />
          </Route>
        ))
      )}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to={`/${DEFAULT_LOCALE}`} />
      </Route>
      <Route path="/offices">
        <LocaleRedirect to="/offices" />
      </Route>
      <Route path="/office/:id">
        {(params) => <LocaleRedirect to={`/office/${params.id}`} />}
      </Route>
      <Route path="/business-marketplace">
        <LocaleRedirect to="/business-marketplace" />
      </Route>
      <Route path="/business-buyer-guide">
        <LocaleRedirect to="/business-buyer-guide" />
      </Route>
      <Route path="/business/:id">
        {(params) => <LocaleRedirect to={`/business/${params.id}`} />}
      </Route>
      <Route path="/about">
        <LocaleRedirect to="/about" />
      </Route>
      <Route path="/terms">
        <LocaleRedirect to="/terms" />
      </Route>
      <Route path="/privacy">
        <LocaleRedirect to="/privacy" />
      </Route>
      <Route path="/knowledge-hub">
        <LocaleRedirect to="/knowledge-hub" />
      </Route>
      <Route path="/provider-signup">
        <LocaleRedirect to="/provider-signup" />
      </Route>
      <Route path="/provider">
        <LocaleRedirect to="/provider" />
      </Route>
      <Route path="/article/:slug">
        {(params) => <LocaleRedirect to={`/article/${params.slug}`} />}
      </Route>

      <LocalizedPublicRoutes />

      <Route path="/admin" component={Admin} />
      <Route path="/provider" component={ProviderPortal} />
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="auto" switchable>
        <LocaleProvider>
          <WhatsAppProvider phoneNumber="85235653138">
            <TooltipProvider>
              <Toaster />
              <Router />
              <WhatsAppWidget />
            </TooltipProvider>
          </WhatsAppProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
