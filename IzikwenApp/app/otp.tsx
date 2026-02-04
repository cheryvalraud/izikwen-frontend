import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function OtpScreen() {
  const { twoFaToken } = useLocalSearchParams<{ twoFaToken: string }>();
  const router = useRouter();
  const { onVerify2FA } = useAuth();

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = useMemo(
    () => ({
      bg: isDark ? "#0b0b0f" : "#ffffff",
      text: isDark ? "#f9fafb" : "#111827",
      sub: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "#262633" : "#e5e7eb",
      btn: isDark ? "#ffffff" : "#000000",
      btnText: isDark ? "#000000" : "#ffffff",
      card: isDark ? "#14141a" : "#ffffff",
    }),
    [isDark]
  );

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!twoFaToken) {
      Alert.alert("Session expired", "Please login again.");
      router.replace("/login");
      return;
    }

    if (!code || code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      await onVerify2FA(code, twoFaToken);
      router.replace("./tabs");
    } catch (err: any) {
      Alert.alert("Invalid Code", "The code you entered is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={[styles.container, { backgroundColor: colors.bg }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.iconBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.text }]}>2FA Verify</Text>

            <View style={{ width: 44 }} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Two-Factor Authentication</Text>
            <Text style={[styles.subtitle, { color: colors.sub }]}>
              Enter the 6-digit code from your authenticator app.
            </Text>

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={colors.sub}
              textAlign="center"
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.btn }, loading && { opacity: 0.7 }]}
              onPress={verifyOtp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={colors.btnText} /> : <Text style={[styles.buttonText, { color: colors.btnText }]}>Verify</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/login")} style={{ marginTop: 14 }}>
              <Text style={{ color: colors.sub, textAlign: "center", fontWeight: "700" }}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "900" },
  card: {
    margin: 18,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  title: { fontSize: 20, fontWeight: "900", textAlign: "center" },
  subtitle: { marginTop: 6, fontSize: 13, lineHeight: 18, textAlign: "center" },
  input: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    letterSpacing: 6,
  },
  button: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { fontWeight: "900", fontSize: 16 },
});
