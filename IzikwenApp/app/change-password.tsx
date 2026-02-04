import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../service/api";
import { tokenStorage } from "../utils/tokenStorage";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = useMemo(
    () => ({
      bg: isDark ? "#0b0b0f" : "#f9fafb",
      card: isDark ? "#14141a" : "#ffffff",
      text: isDark ? "#f9fafb" : "#111827",
      sub: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "#262633" : "#e5e7eb",
      btn: isDark ? "#ffffff" : "#000000",
      btnText: isDark ? "#000000" : "#ffffff",
      danger: "#dc2626",
    }),
    [isDark]
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!currentPassword || !newPassword || !confirm) {
      Alert.alert("Missing fields", "Please fill out all fields.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert("Mismatch", "New passwords do not match.");
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);

      const res = await api.post("/security/change-password", {
        currentPassword,
        newPassword,
      });

      const accessToken = res.data?.accessToken;
      const refreshToken = res.data?.refreshToken;

      if (accessToken) {
        await tokenStorage.setTokens(accessToken, refreshToken);
      }

      Alert.alert("Success", "Your password has been updated.");
      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Unable to update password.";
      Alert.alert("Error", String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.iconBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Change Password
            </Text>

            <View style={{ width: 44 }} />
          </View>

          {/* Center Wrapper */}
          <View style={styles.centerWrapper}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.subtitle, { color: colors.sub }]}>
                For your security, changing password will invalidate old
                tokens on other devices.
              </Text>

              {/* Inputs */}
              <Text style={[styles.label, { color: colors.sub }]}>
                Current Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />

              <Text style={[styles.label, { color: colors.sub }]}>
                New Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Text style={[styles.label, { color: colors.sub }]}>
                Confirm New Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
              />

              {/* Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.btn },
                  loading && { opacity: 0.7 },
                ]}
                onPress={submit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.btnText} />
                ) : (
                  <Text
                    style={[styles.buttonText, { color: colors.btnText }]}
                  >
                    Update Password
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelRow}
                onPress={() => router.back()}
              >
                <Text style={[styles.cancelText, { color: colors.sub }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: { fontSize: 18, fontWeight: "900" },

  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  subtitle: { fontSize: 13, lineHeight: 18 },

  label: { fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 6 },

  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15 },

  button: { marginTop: 18, padding: 14, borderRadius: 12 },

  buttonText: { fontSize: 15, fontWeight: "900", textAlign: "center" },

  cancelRow: { marginTop: 14, alignItems: "center" },

  cancelText: { fontSize: 13, fontWeight: "700" },
});
