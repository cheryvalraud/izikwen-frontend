import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
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

export default function WalletScreen() {
  const theme = useTheme();
  const total = balances.reduce((sum, b) => sum + b.usd, 0);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          <Animated.View
            style={{
              opacity: fade,
              transform: [{ translateY: slide }],
              width: "100%",
              maxWidth: 480,
            }}
          >
            {/* HEADER */}
            <LinearGradient
              colors={["#16a34a", "#22d3ee"]}
              style={styles.header}
            >
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceValue}>
                ${total.toFixed(2)}
              </Text>

              <View style={styles.actionRow}>
                <Action icon="arrow-down" label="Deposit" />
                <Action icon="arrow-up" label="Withdraw" />
                <Action icon="swap-horizontal" label="Convert" />
              </View>
            </LinearGradient>

            {/* ASSETS */}
            <SectionTitle theme={theme} title="Assets" />
            <Card theme={theme}>
              {balances.map((b) => (
                <Row key={b.symbol} theme={theme} left={b.symbol} right={`$${b.usd}`} />
              ))}
            </Card>

            {/* TX */}
            <SectionTitle theme={theme} title="Recent Activity" />
            <Card theme={theme}>
              {transactions.map((t) => (
                <Row
                  key={t.id}
                  theme={theme}
                  left={`${t.type} ${t.asset}`}
                  right={`$${t.amount}`}
                />
              ))}
            </Card>

            <View style={{ height: 140 }} />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function SectionTitle({ theme, title }: any) {
  return (
    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
      {title}
    </Text>
  );
}

function Card({ children, theme }: any) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {children}
    </View>
  );
}

function Row({ left, right, theme }: any) {
  return (
    <View style={styles.row}>
      <Text style={{ color: theme.text, fontWeight: "800" }}>{left}</Text>
      <Text style={{ color: theme.subtext }}>{right}</Text>
    </View>
  );
}

function Action({ icon, label }: any) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- THEME ---------- */

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

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  centerWrapper: {
    alignItems: "center",
    paddingHorizontal: 16,
  },

  header: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 28,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
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
    justifyContent: "space-around",
    marginTop: 22,
  },

  actionBtn: { alignItems: "center" },
  actionText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "800",
  },

  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
});
