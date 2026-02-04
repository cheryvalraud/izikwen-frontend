import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TrustedDevicesScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trusted Devices</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Devices you trust</Text>
        <Text style={[styles.sub, { color: colors.sub }]}>
          When a device is trusted, Izikwen won’t ask for 2FA every time.
        </Text>

        <View style={styles.empty}>
          <Ionicons name="phone-portrait-outline" size={38} color={colors.sub} />
          <Text style={[styles.emptyText, { color: colors.sub }]}>
            No trusted device list yet.
          </Text>
          <Text style={[styles.emptyText2, { color: colors.sub }]}>
            Next step: add an endpoint to list/revoke trusted devices.
          </Text>
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
  sub: { marginTop: 8, lineHeight: 18 },
  empty: { marginTop: 18, alignItems: "center", paddingVertical: 18 },
  emptyText: { marginTop: 10, fontWeight: "800" },
  emptyText2: { marginTop: 6, textAlign: "center", fontSize: 12 },
});
