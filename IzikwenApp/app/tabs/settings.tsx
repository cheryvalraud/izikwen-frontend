import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="settings-outline" size={36} color={theme.text} />
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Customize your app preferences
          </Text>
        </View>

        <Section title="Appearance" theme={theme}>
          <ToggleItem
            icon="moon-outline"
            label="Dark Mode"
            value={isDark}
            onChange={toggleTheme}
            theme={theme}
          />
        </Section>

        <Section title="Security" theme={theme}>
          <Item icon="shield-checkmark-outline" label="Security Center" theme={theme} />
          <Item icon="key-outline" label="Two-Factor Authentication" theme={theme} />
          <Item icon="finger-print-outline" label="Biometric Authentication" theme={theme} />
        </Section>

        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Components */

function Section({ title, children, theme }: any) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
        {title.toUpperCase()}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Item({ icon, label, theme }: any) {
  return (
    <TouchableOpacity style={styles.item}>
      <Ionicons name={icon} size={22} color={theme.text} />
      <Text style={[styles.itemText, { color: theme.text }]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
    </TouchableOpacity>
  );
}

function ToggleItem({ icon, label, value, onChange, theme }: any) {
  return (
    <View style={styles.item}>
      <Ionicons name={icon} size={22} color={theme.text} />
      <Text style={[styles.itemText, { color: theme.text }]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#94a3b8", true: "#22d3ee" }}
        thumbColor="#fff"
      />
    </View>
  );
}

/* Theme */

function getTheme(isDark: boolean) {
  return {
    bg: isDark ? "#020817" : "#f9fafb",
    card: isDark ? "#020817" : "#ffffff",
    border: isDark ? "#1e293b" : "#e5e7eb",
    text: isDark ? "#f8fafc" : "#020817",
    subtext: isDark ? "#94a3b8" : "#6b7280",
  };
}

/* Styles */

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14 },
  title: { fontSize: 30, fontWeight: "900", marginTop: 8 },
  subtitle: { marginTop: 4, fontSize: 14 },

  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    marginLeft: 20,
  },

  card: {
    borderRadius: 18,
    marginHorizontal: 16,
    paddingVertical: 6,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
  },
});
