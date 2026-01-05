/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const THEME_KEY = "dashboard-theme";

const ThemeContext = createContext<ThemeCtx | null>(null);

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, _setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    _setTheme(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (t: Theme) => {
    _setTheme(t);
    applyTheme(t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useDashboardTheme must be used within ThemeProvider");
  return ctx;
}
