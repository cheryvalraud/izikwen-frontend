import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TwoFAScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const colors = useMemo(
    () => ({
      bg: isDark ? "#0b0b0f" : "#f9fafb",
      card: isDark ? "#14141a" : "#ffffff",
      text: isDark ? "#f9fafb" : "#111827",
      sub: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "#262633" : "#e5e7eb",
      btn: "#000",
      btnText: "#fff",
    }),
    [isDark]
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={styles.page}>
        {/* Top Bar */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Two-Factor Auth
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
              Protect your Izikwen account
            </Text>

            <Text style={[styles.sub, { color: colors.sub }]}>
              2FA helps stop unauthorized access even if someone knows your
              password.
            </Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.btn }]}
              onPress={() =>
                Alert.alert(
                  "Next step",
                  "We can wire /auth/2fa/setup here and show QR."
                )
              }
            >
              <Text
                style={[styles.buttonText, { color: colors.btnText }]}
              >
                Enable / Setup 2FA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryBtn,
                { borderColor: colors.border },
              ]}
              onPress={() =>
                Alert.alert(
                  "Next step",
                  "We can wire /auth/2fa/disable here."
                )
              }
            >
              <Text
                style={[styles.secondaryText, { color: colors.text }]}
              >
                Disable 2FA
              </Text>
            </TouchableOpacity>
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
    lineHeight: 20,
  },

  button: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  secondaryBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  secondaryText: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
});
