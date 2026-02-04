import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOrders } from "../../service/OrderService";

/* ---------- Types ---------- */

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

type Order = {
  id: number;
  assetSymbol: string;
  amountFiat: number;
  fiatCurrency: string;
  walletAddress: string;
  network: string;
  status: OrderStatus;
  createdAt: string;
};

const TABS: Array<{ key: "ALL" | OrderStatus; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "PROCESSING", label: "Processing" },
  { key: "COMPLETED", label: "Completed" },
  { key: "FAILED", label: "Failed" },
];

/* ---------- Screen ---------- */

export default function OrdersScreen() {
  const theme = useTheme();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("GET ORDERS ERROR:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return orders
      .filter((o) => (tab === "ALL" ? true : o.status === tab))
      .filter((o) => {
        if (!q) return true;
        return (
          o.assetSymbol?.toLowerCase().includes(q) ||
          o.walletAddress?.toLowerCase().includes(q) ||
          String(o.id).includes(q) ||
          o.network?.toLowerCase().includes(q)
        );
      });
  }, [orders, tab, query]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.muted, { color: theme.subtext }]}>
          Loading orders…
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.page}>
        {/* Header */}
        <Text style={[styles.title, { color: theme.text }]}>
          Orders
        </Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Track your USDT purchases
        </Text>

        {/* Search */}
        <View
          style={[
            styles.searchRow,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.subtext} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by wallet, ID, network…"
            placeholderTextColor={theme.subtext}
            style={[styles.searchInput, { color: theme.text }]}
            autoCapitalize="none"
          />
          {!!query && (
            <Pressable onPress={() => setQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={theme.subtext} />
            </Pressable>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? theme.tabActive : theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: active ? "#fff" : theme.text },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Orders */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={theme.accent}
            />
          }
          contentContainerStyle={{ paddingBottom: 160, flexGrow: 1 }}
          ListEmptyComponent={<EmptyOrders theme={theme} />}
          renderItem={({ item }) => (
            <OrderRow order={item} theme={theme} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function OrderRow({ order, theme }: { order: Order; theme: any }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.asset, { color: theme.text }]}>
            {order.assetSymbol} • ${order.amountFiat.toFixed(2)}{" "}
            {order.fiatCurrency}
          </Text>
          <Text style={[styles.meta, { color: theme.subtext }]}>
            #{order.id} • {order.network}
          </Text>
        </View>

        <StatusPill status={order.status} />
      </View>

      <Text
        style={[styles.wallet, { color: theme.text }]}
        numberOfLines={1}
      >
        Wallet: {order.walletAddress}
      </Text>

      <Text style={[styles.time, { color: theme.subtext }]}>
        {new Date(order.createdAt).toLocaleString()}
      </Text>
    </View>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const pill =
    status === "COMPLETED"
      ? styles.pillCompleted
      : status === "FAILED"
      ? styles.pillFailed
      : status === "PROCESSING"
      ? styles.pillProcessing
      : styles.pillPending;

  return (
    <View style={[styles.pill, pill]}>
      <Text style={styles.pillText}>{status}</Text>
    </View>
  );
}

function EmptyOrders({ theme }: { theme: any }) {
  return (
    <View style={styles.emptyWrap}>
      <View
        style={[
          styles.emptyCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Ionicons name="receipt-outline" size={38} color={theme.subtext} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No orders yet
        </Text>
        <Text style={[styles.emptySub, { color: theme.subtext }]}>
          Once you buy USDT, your orders will appear here.
        </Text>
      </View>
    </View>
  );
}

/* ---------- Theme ---------- */

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
    accent: "#22d3ee",
    tabActive: "#111827",
  };
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },
  page: { flex: 1, paddingHorizontal: 16 },

  title: { fontSize: 30, fontWeight: "900", marginTop: 6 },
  subtitle: { marginTop: 4, marginBottom: 16 },

  searchRow: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },

  tabs: { flexDirection: "row", gap: 8, marginBottom: 14 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabText: { fontWeight: "800", fontSize: 13 },

  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  asset: { fontSize: 15, fontWeight: "800" },
  meta: { marginTop: 4, fontSize: 12 },
  wallet: { marginTop: 10, fontSize: 13 },
  time: { marginTop: 6, fontSize: 12 },

  pill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pillText: { color: "#fff", fontWeight: "900", fontSize: 11 },
  pillPending: { backgroundColor: "#f59e0b" },
  pillProcessing: { backgroundColor: "#3b82f6" },
  pillCompleted: { backgroundColor: "#16a34a" },
  pillFailed: { backgroundColor: "#dc2626" },

  emptyWrap: { flex: 1, justifyContent: "center" },
  emptyCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  emptyTitle: { fontSize: 20, fontWeight: "900" },
  emptySub: { textAlign: "center", fontSize: 13 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { marginTop: 10 },
});
