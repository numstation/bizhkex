/** Hong Kong daytime window for auto light theme (7:00–19:00 HKT). */
export function isDaytimeHK(date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Hong_Kong",
      hour: "numeric",
      hour12: false,
    }).format(date)
  );
  return hour >= 7 && hour < 19;
}

export type ThemePreference = "light" | "dark" | "auto";

export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference === "auto") return isDaytimeHK() ? "light" : "dark";
  return preference;
}
