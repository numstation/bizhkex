import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  resolveTheme,
  type ThemePreference,
} from "@shared/themeSchedule";

export type Theme = "light" | "dark";
export type { ThemePreference };

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme?: () => void;
  switchable: boolean;
}

const STORAGE_KEY = "bizhkex-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
  switchable?: boolean;
}

function readStoredPreference(fallback: ThemePreference): ThemePreference {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  return fallback;
}

export function ThemeProvider({
  children,
  defaultTheme = "auto",
  switchable = true,
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    switchable ? readStoredPreference(defaultTheme) : defaultTheme
  );
  const [theme, setTheme] = useState<Theme>(() => resolveTheme(preference));

  const applyTheme = useCallback((resolved: Theme) => {
    setTheme(resolved);
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      if (switchable) localStorage.setItem(STORAGE_KEY, next);
      applyTheme(resolveTheme(next));
    },
    [applyTheme, switchable]
  );

  useEffect(() => {
    applyTheme(resolveTheme(preference));
  }, [preference, applyTheme]);

  useEffect(() => {
    if (preference !== "auto") return;
    const tick = () => applyTheme(resolveTheme("auto"));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [preference, applyTheme]);

  const toggleTheme = switchable
    ? () => {
        const order: ThemePreference[] = ["light", "auto", "dark"];
        const idx = order.indexOf(preference);
        setPreference(order[(idx + 1) % order.length]);
      }
    : undefined;

  const value = useMemo(
    () => ({ theme, preference, setPreference, toggleTheme, switchable }),
    [theme, preference, setPreference, toggleTheme, switchable]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
