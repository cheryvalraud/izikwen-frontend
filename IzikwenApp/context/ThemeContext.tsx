import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;

  // Colors
  bg: string;
  card: string;
  border: string;
  text: string;
  subtext: string;
  accent: string;
  mutedIcon: string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => useContext(ThemeContext)!;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("APP_THEME");

      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else {
        const system = Appearance.getColorScheme();
        setTheme(system === "dark" ? "dark" : "light");
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    await AsyncStorage.setItem("APP_THEME", next);
  };

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#020817" : "#f9fafb",
    card: isDark ? "#020817" : "#ffffff",
    border: isDark ? "#1e293b" : "#e5e7eb",
    text: isDark ? "#f8fafc" : "#020817",
    subtext: isDark ? "#94a3b8" : "#6b7280",
    accent: "#22d3ee",
    mutedIcon: isDark ? "#94a3b8" : "#64748b",
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        ...colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
