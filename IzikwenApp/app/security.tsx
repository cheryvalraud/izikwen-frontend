import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  useColorScheme,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { tokenStorage } from "../utils/tokenStorage";

export default function SecurityScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [biometric, setBiometric] = useState<boolean>(true);
  const [loginAlerts, setLoginAlerts] = useState<boolean>(true);

  const colors = useMemo(
    () => ({
      bg: isDark ? "#0b0b0f" : "#f9fafb",
      card: isDark ? "#14141a" : "#ffffff",
      text: isDark ? "#f9fafb" : "#111827",
      sub: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "#262633" : "#e5e7eb",
      chevron: "#9ca3af",
      danger: "#dc2626",
      icon: isDark ? "#f9fafb" : "#111827",
    }),
    [isDark]
  );

  useEffect(() => {
    (async () => {
      try {
        const enabled = await tokenStorage.getBiometricsEnabled();
        setBiometric(enabled);
      } catch {}
    })();
  }, []);

  const onToggleBiometric = async (v: boolean) => {
    setBiometric(v);
    await tokenStorage.setBiometricsEnabled(v);
  };

  const logoutAllDevices = async () => {
    Alert.alert(
      "Log out everywhere?",
      "This will sign you out from all devices.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await tokenStorage.clearAll();
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Security Center
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header Card */}
        <View style={styles.topBlock}>
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="shield-checkmark" size={28} color={colors.icon} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            Security Center
          </Text>
          <Text style={[styles.sub, { color: colors.sub }]}>
            Manage authentication, devices, sessions & protection.
          </Text>
        </View>

        {/* Authentication */}
        <Section title="Authentication" colors={colors}>
          <Row
            colors={colors}
            icon="key-outline"
            label="Change Password"
            onPress={() => router.push("/change-password")}
          />
          <Row
            colors={colors}
            icon="lock-closed-outline"
            label="Two-Factor Authentication"
            onPress={() => router.push("/twofa")}
          />
          <ToggleRow
            colors={colors}
            icon="finger-print-outline"
            label="Biometric Unlock"
            value={biometric}
            onChange={onToggleBiometric}
          />
        </Section>

        {/* Devices & Sessions */}
        <Section title="Devices & Sessions" colors={colors}>
          <Row
            colors={colors}
            icon="phone-portrait-outline"
            label="Trusted Devices"
            onPress={() => router.push("/trusted-devices")}
          />
          <Row
            colors={colors}
            icon="desktop-outline"
            label="Active Sessions"
            onPress={() => router.push("/sessions")}
          />
          <Row
            colors={colors}
            icon="log-out-outline"
            label="Log out everywhere"
            danger
            onPress={logoutAllDevices}
          />
        </Section>

        {/* Alerts & Recovery */}
        <Section title="Alerts & Recovery" colors={colors}>
          <ToggleRow
            colors={colors}
            icon="notifications-outline"
            label="Login Alerts"
            value={loginAlerts}
            onChange={setLoginAlerts}
          />
          <Row
            colors={colors}
            icon="refresh-outline"
            label="Account Recovery"
            onPress={() => router.push("/recovery")}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- UI Components ---------------- */

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.sub }]}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  onPress,
  danger,
  colors,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  danger?: boolean;
  colors: any;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? colors.danger : colors.icon}
      />
      <Text
        style={[
          styles.rowLabel,
          { color: danger ? colors.danger : colors.text },
        ]}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.chevron} />
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
  colors,
}: {
  icon: any;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.icon} />
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  topBlock: {
    alignItems: "center",
    paddingVertical: 24,
  },

  badge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
  },

  sub: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },

  section: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 18,
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
    marginLeft: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },

  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
});
