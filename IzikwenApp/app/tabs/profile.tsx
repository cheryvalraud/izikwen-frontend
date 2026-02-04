import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const { authState, onLogout } = useAuth();
  const theme = useTheme();

  const isAdmin = authState.user?.role === "ADMIN";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.page}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Profile
        </Text>

        <Section title="Security" theme={theme}>
          <Item
            theme={theme}
            icon="shield-checkmark-outline"
            label="Security Center"
            onPress={() => router.push("/security")}
          />
          <Item
            theme={theme}
            icon="key-outline"
            label="Two-Factor Authentication (2FA)"
            onPress={() => router.push("/otp")}
          />
          <Item
            theme={theme}
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => router.push("/security")}
          />
        </Section>

        <Section title="Identity" theme={theme}>
          <Item
            theme={theme}
            icon="finger-print-outline"
            label="KYC Verification"
            onPress={() => router.push("/kyc")}
          />
        </Section>

        <Section title="Finance" theme={theme}>
          <Item
            theme={theme}
            icon="wallet-outline"
            label="Wallet"
            onPress={() => router.push("./wallet")}
          />
          <Item
            theme={theme}
            icon="document-text-outline"
            label="Invoices & Receipts"
            onPress={() => router.push("/invoices")}
          />
        </Section>

        {isAdmin && (
          <Section title="Administration" theme={theme}>
            <Item
              theme={theme}
              icon="speedometer-outline"
              label="Admin Dashboard"
              onPress={() => router.push("/admin")}
            />
          </Section>
        )}

        <Section title="System" theme={theme}>
          <Item
            theme={theme}
            icon="settings-outline"
            label="Settings"
            onPress={() => router.push("./settings")}
          />
          <Item
            theme={theme}
            icon="log-out-outline"
            label="Logout"
            danger
            onPress={onLogout}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Types ---------- */

interface SectionProps {
  title: string;
  children: ReactNode;
  theme: any;
}

interface ItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  theme: any;
}

/* ---------- Components ---------- */

function Section({ title, children, theme }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text
        style={[styles.sectionTitle, { color: theme.subtext }]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Item({ icon, label, onPress, danger, theme }: ItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? "#dc2626" : theme.text}
        style={{ width: 28 }}
      />
      <Text
        style={[
          styles.itemText,
          { color: danger ? "#dc2626" : theme.text },
        ]}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.subtext}
      />
    </TouchableOpacity>
  );
}

/* ---------- THEME ---------- */

function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return {
    isDark,
    bg: isDark ? "#020817" : "#f9fafb",
    card: isDark ? "#020817" : "#ffffff",
    border: isDark ? "#1e293b" : "#e5e7eb",
    text: isDark ? "#f8fafc" : "#020817",
    subtext: isDark ? "#94a3b8" : "#6b7280",
  };
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
});
