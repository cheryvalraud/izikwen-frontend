import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SessionsScreen() {
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={styles.page}>
        {/* Header */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Active Sessions
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Center Wrapper */}
        <View style={styles.centerWrapper}>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              Where you’re signed in
            </Text>

            <Text style={[styles.sub, { color: colors.sub }]}>
              Next step: backend list sessions + revoke session tokens.
            </Text>

            <View style={styles.empty}>
              <Ionicons
                name="desktop-outline"
                size={38}
                color={colors.sub}
              />
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                Session list not connected yet.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  page: {
    flex: 1,
    paddingHorizontal: 18,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "95%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
  },

  sub: {
    marginTop: 8,
    lineHeight: 18,
  },

  empty: {
    marginTop: 18,
    alignItems: "center",
    paddingVertical: 18,
  },

  emptyText: {
    marginTop: 10,
    fontWeight: "800",
  },
});
