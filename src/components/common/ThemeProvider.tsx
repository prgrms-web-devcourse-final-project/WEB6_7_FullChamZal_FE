/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? null;
    const systemDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: Theme = saved ?? (systemDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {children}

      <button
        type="button"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        className="cursor-pointer fixed bottom-6 right-6 z-9999 rounded-full border border-outline bg-glass px-4 py-2 text-sm shadow-xl backdrop-blur"
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </>
  );
}
