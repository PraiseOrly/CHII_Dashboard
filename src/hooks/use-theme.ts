"use client";
import { useEffect, useState } from "react";

/**
 * Light/dark preference, persisted to localStorage and reflected on the
 * document root as `data-theme`. Was duplicated inside all three portal navs.
 */
export function useTheme(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return [isDark, toggle];
}
