import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RecoveryScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const colors = useMemo(
    () => ({
      bg: isDark ? "#0b0b0f" : "#f9fafb",
      card: isDark ? "#14141a" : "#ffffff",
      text: isDark ? "#f9fafb" : "#111827",
      sub: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "#262633" : "#e5e7eb",
    }),
    [isDark]
  );

  return (
    <View style={[styles.page, { backgroundColor: colors.bg }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Recovery</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Recovery options</Text>
        <Text style={[styles.sub, { color: colors.sub }]}>
          Add email verification, recovery codes, and support flow.
        </Text>

        <View style={styles.item}>
          <Ionicons name="mail-outline" size={20} color={colors.sub} />
          <Text style={[styles.itemText, { color: colors.text }]}>Email Recovery</Text>
        </View>

        <View style={styles.item}>
          <Ionicons name="document-text-outline" size={20} color={colors.sub} />
          <Text style={[styles.itemText, { color: colors.text }]}>Backup Codes</Text>
        </View>

        <View style={styles.item}>
          <Ionicons name="help-circle-outline" size={20} color={colors.sub} />
          <Text style={[styles.itemText, { color: colors.text }]}>Support</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 18 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  card: { borderWidth: 1, borderRadius: 18, padding: 16 },
  title: { fontSize: 16, fontWeight: "900" },
  sub: { marginTop: 8, lineHeight: 18, marginBottom: 14 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  itemText: { fontWeight: "800" },
});
