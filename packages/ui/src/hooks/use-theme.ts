import { useEffect, useLayoutEffect, useState } from "react";

import { useShellStore, type Theme } from "../stores/shell-store";

const DARK_THEME_QUERY = "(prefers-color-scheme: dark)";

/** Follow the OS by default; an explicit theme toggle remains a local preference. */
export function useTheme() {
  const preference = useShellStore((state) => state.theme);
  const [systemTheme, setSystemTheme] = useState<Theme>(() =>
    window.matchMedia(DARK_THEME_QUERY).matches ? "dark" : "light",
  );
  const theme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const query = window.matchMedia(DARK_THEME_QUERY);
    const update = () => setSystemTheme(query.matches ? "dark" : "light");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    return () => document.documentElement.classList.remove("dark");
  }, [theme]);

  return { theme };
}
