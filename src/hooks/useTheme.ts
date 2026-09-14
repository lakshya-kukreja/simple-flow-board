import { useCallback, useEffect, useState } from "react";

export const THEMES = ["light", "dark", "disco"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "flowboard-theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "disco");
  if (theme !== "light") root.classList.add(theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = (THEMES as readonly string[]).includes(stored ?? "")
      ? (stored as Theme)
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    setThemeState(initial);
    apply(initial);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    apply(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { theme, setTheme };
}
