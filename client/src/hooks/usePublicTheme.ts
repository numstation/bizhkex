import { useTheme } from "@/contexts/ThemeContext";

/** Shared light/dark surface tokens for public fintech pages. */
export function usePublicTheme() {
  const { theme, preference } = useTheme();
  const isDark = theme === "dark";

  return {
    isDark,
    preference,
    page: "min-h-screen bg-gray-50 text-gray-900 dark:bg-[#070A13] dark:text-white",
    glass:
      "bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-white/[0.03] dark:backdrop-blur-md dark:border-white/[0.08] dark:shadow-none",
    glassInner:
      "bg-gray-50 border border-gray-100 rounded-xl dark:bg-white/[0.02] dark:border-white/[0.05]",
    statCard:
      "bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-white/[0.03] dark:border-white/[0.08]",
    metricBox:
      "bg-gray-50 border border-gray-200 rounded-xl dark:bg-white/[0.04] dark:border-white/[0.06]",
    metricBoxAccent:
      "bg-emerald-50 border border-emerald-200 rounded-xl dark:bg-emerald-500/10 dark:border-emerald-500/20",
    savingsHighlight:
      "bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200 rounded-xl dark:from-emerald-600/20 dark:to-emerald-900/10 dark:border-emerald-500/25",
    heading: "text-gray-900 dark:text-white",
    body: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-600 dark:text-gray-400",
    subtle: "text-gray-500 dark:text-gray-500",
    label: "text-gray-600 dark:text-gray-500",
    kicker: "text-emerald-700 dark:text-emerald-400",
    accent: "text-emerald-700 dark:text-emerald-400",
    accentSolid: "text-emerald-700 dark:text-emerald-400",
    value: "text-gray-900 font-medium dark:text-white",
    input:
      "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-gray-500",
    cardHover:
      "hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-500/30 dark:hover:shadow-none",
    divider: "border-gray-200 dark:border-white/[0.06]",
    dividerLight: "border-gray-100 dark:border-white/[0.05]",
    filterInactive:
      "border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-white/[0.08] dark:text-gray-400 dark:hover:text-white",
    filterActive: "border-emerald-500 bg-emerald-600 text-white",
    filterPillInactive:
      "bg-gray-100 border border-gray-200 text-gray-700 hover:border-emerald-300 dark:bg-white/[0.02] dark:border-white/[0.05] dark:text-gray-400 dark:hover:text-white dark:hover:border-white/[0.12]",
    tabsList:
      "bg-gray-100 border border-gray-200 dark:bg-white/[0.02] dark:border-white/[0.05]",
    tabsTrigger:
      "text-gray-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:text-gray-400",
    tableHead: "text-gray-500 dark:text-gray-500",
    tableRow: "border-gray-100 hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.02]",
    tableBorder: "border-gray-200 dark:border-white/[0.05]",
    outlineBtn:
      "border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-white/[0.12] dark:text-white dark:hover:bg-white/[0.05]",
    accordionAnswer: "text-gray-600 dark:text-gray-400",
    redValue: "text-red-600 dark:text-red-400/90",
    navTheme: isDark ? ("dark" as const) : ("light" as const),
    footerVariant: isDark ? ("dark" as const) : ("light" as const),
  };
}
