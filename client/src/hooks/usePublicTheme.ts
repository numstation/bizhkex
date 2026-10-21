import { useTheme } from "@/contexts/ThemeContext";

/** Shared light/dark surface tokens for public marketing and listing pages. */
export function usePublicTheme() {
  const { theme, preference } = useTheme();
  const isDark = theme === "dark";

  return {
    isDark,
    preference,
    page: "min-h-screen bg-background text-foreground",
    glass:
      "bg-card text-card-foreground border border-border rounded-lg shadow-none",
    glassInner: "bg-muted border border-border rounded-lg",
    statCard: "bg-card border border-border rounded-lg shadow-none",
    metricBox: "bg-muted/60 border border-border rounded-lg",
    metricBoxAccent: "bg-primary/10 border border-primary/20 rounded-lg",
    savingsHighlight: "bg-primary/10 border border-primary/15 rounded-lg",
    heading: "text-foreground",
    body: "text-foreground/80",
    muted: "text-muted-foreground",
    subtle: "text-muted-foreground",
    label: "text-muted-foreground",
    kicker: "text-primary",
    accent: "text-primary",
    accentSolid: "text-primary",
    value: "text-foreground font-medium",
    input:
      "bg-background border-input text-foreground placeholder:text-muted-foreground shadow-none",
    cardHover: "hover:border-foreground/20",
    divider: "border-border",
    dividerLight: "border-border",
    filterInactive:
      "border-border text-muted-foreground hover:border-primary/40 hover:text-primary",
    filterActive: "border-primary bg-primary text-primary-foreground",
    filterPillInactive:
      "bg-muted border border-border text-foreground/80 hover:border-primary/40 hover:text-foreground",
    tabsList: "bg-muted border border-border",
    tabsTrigger:
      "text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
    tableHead: "text-muted-foreground",
    tableRow: "border-border hover:bg-muted/60",
    tableBorder: "border-border",
    outlineBtn: "border-border bg-transparent text-foreground shadow-none hover:bg-muted",
    primaryBtn: "bg-primary text-primary-foreground shadow-none hover:bg-primary/90 font-semibold",
    accordionAnswer: "text-muted-foreground",
    redValue: "text-destructive",
    navTheme: isDark ? ("dark" as const) : ("light" as const),
    footerVariant: isDark ? ("dark" as const) : ("light" as const),
  };
}
