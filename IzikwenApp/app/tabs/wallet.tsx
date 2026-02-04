import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------------- Demo Data ---------------- */

const balances = [
  { symbol: "USDT", amount: 420.5, usd: 420.5 },
  { symbol: "USD", amount: 135.2, usd: 135.2 },
  { symbol: "HTG", amount: 18000, usd: 135.3 },
];

const transactions = [
  { id: 1, type: "BUY", asset: "USDT", amount: 50, status: "Completed" },
  { id: 2, type: "BUY", asset: "USDT", amount: 120, status: "Completed" },
  { id: 3, type: "WITHDRAW", asset: "USDT", amount: 70, status: "Pending" },
];

/* ---------------- Screen ---------------- */

export default function WalletScreen() {
  const theme = useTheme();
  const total = balances.reduce((sum, b) => sum + b.usd, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={{ backgroundColor: theme.bg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={["#16a34a", "#22d3ee"]}
          style={styles.header}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${total.toFixed(2)}</Text>

          <View style={styles.actionRow}>
            <Action icon="arrow-down" label="Deposit" />
            <Action icon="arrow-up" label="Withdraw" />
            <Action icon="swap-horizontal" label="Convert" />
          </View>
        </LinearGradient>

        {/* Assets */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Assets
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {balances.map((b) => (
            <View key={b.symbol} style={styles.assetRow}>
              <View style={styles.assetLeft}>
                <FontAwesome5
                  name="coins"
                  size={16}
                  color={theme.text}
                />
                <Text style={[styles.assetSymbol, { color: theme.text }]}>
                  {b.symbol}
                </Text>
              </View>

              <View style={styles.assetRight}>
                <Text style={[styles.assetAmount, { color: theme.text }]}>
                  {b.amount}
                </Text>
                <Text style={[styles.assetUsd, { color: theme.subtext }]}>
                  ${b.usd.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Transactions */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          Recent Activity
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {transactions.map((t) => (
            <View key={t.id} style={styles.txRow}>
              <View>
                <Text style={[styles.txType, { color: theme.text }]}>
                  {t.type} {t.asset}
                </Text>
                <Text style={[styles.txAmount, { color: theme.subtext }]}>
                  ${t.amount}
                </Text>
              </View>

              <Text
                style={[
                  styles.txStatus,
                  t.status === "Completed"
                    ? styles.ok
                    : styles.pending,
                ]}
              >
                {t.status}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Components ---------------- */

function Action({ icon, label }: any) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- Theme Hook ---------------- */

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

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  balanceLabel: { color: "#ecfeff", fontSize: 14 },
  balanceValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginTop: 6,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  actionBtn: { alignItems: "center", gap: 6 },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    borderWidth: 1,
  },

  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b22",
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  assetSymbol: { fontSize: 15, fontWeight: "800" },

  assetRight: { alignItems: "flex-end" },
  assetAmount: { fontSize: 15, fontWeight: "800" },
  assetUsd: { fontSize: 12 },

  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b22",
  },
  txType: { fontWeight: "800" },
  txAmount: { marginTop: 2 },

  txStatus: {
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  ok: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  pending: {
    backgroundColor: "#fef3c7",
    color: "#f59e0b",
  },
});
