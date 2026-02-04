import { useColorScheme } from "react-native";

export function useTheme() {
  const mode = useColorScheme();

  const isDark = mode === "dark";

  return {
    isDark,

    bg: isDark ? "#020817" : "#f9fafb",
    card: isDark ? "#020817" : "#ffffff",
    border: isDark ? "#1e293b" : "#e5e7eb",
    text: isDark ? "#f8fafc" : "#020817",
    subtext: isDark ? "#94a3b8" : "#6b7280",
  };
}
