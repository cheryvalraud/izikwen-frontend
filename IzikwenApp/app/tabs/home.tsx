import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function Home() {
  const { authState } = useAuth();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.page}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome {authState.user?.firstName} 👋
          </Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Buy USDT securely in seconds
          </Text>
        </View>

        {/* Main Card */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={["#22d3ee", "#38bdf8", "#0ea5e9"]}
            style={styles.mainCard}
          >
            <Text style={styles.mainTitle}>Buy USDT Instantly</Text>
            <Text style={styles.mainSub}>
              Secure payments • Instant delivery
            </Text>

            <View style={styles.ctaRow}>
              <Text style={styles.ctaText}>Buy USDT</Text>
              <Ionicons name="flash-outline" size={20} color="#020817" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <ActionCard
            theme={theme}
            icon={<FontAwesome5 name="exchange-alt" size={20} color="#38bdf8" />}
            label="Orders"
          />
          <ActionCard
            theme={theme}
            icon={<Ionicons name="wallet-outline" size={22} color="#22c55e" />}
            label="Wallet"
          />
          <ActionCard
            theme={theme}
            icon={
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#f59e0b"
              />
            }
            label="Security"
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard theme={theme} label="Total Orders" value="12" />
          <StatCard theme={theme} label="Pending" value="2" />
          <StatCard theme={theme} label="Completed" value="10" />
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Activity
          </Text>

          <ActivityItem
            theme={theme}
            title="USDT Purchase"
            amount="$120"
            status="Completed"
          />
          <ActivityItem
            theme={theme}
            title="USDT Purchase"
            amount="$50"
            status="Pending"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- UI Components ---------------- */

function ActionCard({ icon, label, theme }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {icon}
      <Text style={[styles.actionText, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatCard({ label, value, theme }: any) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.subtext }]}>{label}</Text>
    </View>
  );
}

function ActivityItem({ title, amount, status, theme }: any) {
  return (
    <View
      style={[
        styles.activityCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View>
        <Text style={[styles.activityTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.activitySub,
            status === "Completed"
              ? { color: "#22c55e" }
              : { color: "#f59e0b" },
          ]}
        >
          {status}
        </Text>
      </View>
      <Text style={[styles.activityAmount, { color: theme.text }]}>
        {amount}
      </Text>
    </View>
  );
}

/* ---------------- THEME ---------------- */

function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return {
    bg: isDark ? "#020817" : "#f9fafb",
    card: isDark ? "#020817" : "#ffffff",
    border: isDark ? "#1e293b" : "#e5e7eb",
    text: isDark ? "#f8fafc" : "#020817",
    subtext: isDark ? "#94a3b8" : "#6b7280",
  };
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 18,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 6,
  },

  mainCard: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 26,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#020817",
  },
  mainSub: {
    marginTop: 6,
    color: "#020817",
    opacity: 0.9,
  },
  ctaRow: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaText: {
    fontWeight: "700",
    color: "#020817",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  actionCard: {
    width: "31%",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  actionText: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "31%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#38bdf8",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
  },

  activitySection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  activityCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityTitle: {
    fontWeight: "600",
  },
  activitySub: {
    marginTop: 4,
    fontSize: 12,
  },
  activityAmount: {
    fontWeight: "700",
    fontSize: 16,
  },
});
