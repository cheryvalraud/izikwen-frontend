import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb", 
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },

  card: {
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 120,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  cardTitle: {
    ...typography.body,
    color: "rgba(255,255,255,0.85)",
    marginBottom: spacing.xs,
  },

  cardValue: {
    ...typography.title,
    color: "#fff",
  },
});
