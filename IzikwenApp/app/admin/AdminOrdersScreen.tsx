import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminGetPendingOrders, adminUpdateOrderStatus } from "../../service/AdminOrderService"
import { useAdminOrdersSocket } from "../../hooks/useAdminOrdersSocket";

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
  userEmail?: string;
};

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- Initial Load ---------------- */

  const load = async () => {
    try {
      const data = await adminGetPendingOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("ADMIN GET PENDING ERROR:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- Live WebSocket Events ---------------- */

  const onWsEvent = useCallback((msg: any) => {
    if (msg.type === "NEW_ORDER") {
      setOrders((prev) => [msg.data, ...prev]);
    }

    if (msg.type === "ORDER_UPDATED") {
      setOrders((prev) => prev.filter((o) => o.id !== msg.data.id));
    }
  }, []);

  useAdminOrdersSocket(onWsEvent);

  /* ---------------- Admin Actions ---------------- */

  const act = async (id: number, status: "COMPLETED" | "FAILED") => {
    try {
      await adminUpdateOrderStatus(id, status);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.log("ADMIN UPDATE STATUS ERROR:", e);
    }
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading pending orders…</Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Admin • Pending Orders</Text>
      <Text style={styles.subtitle}>Live trading operations console</Text>

      <FlatList
        data={orders}
        keyExtractor={(i) => String(i.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: 18, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-done" size={30} />
            <Text style={styles.emptyTitle}>Queue is empty</Text>
            <Text style={styles.emptySub}>No pending orders right now.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.asset}>
                  #{item.id} • {item.assetSymbol} • $
                  {item.amountFiat.toFixed(2)} {item.fiatCurrency}
                </Text>

                <Text style={styles.meta}>{item.network}</Text>

                {!!item.userEmail && (
                  <Text style={styles.meta}>User: {item.userEmail}</Text>
                )}

                <Text style={styles.wallet} numberOfLines={1}>
                  Wallet: {item.walletAddress}
                </Text>

                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={[styles.btn, styles.btnFail]}
                onPress={() => act(item.id, "FAILED")}
              >
                <Text style={styles.btnText}>Fail</Text>
              </Pressable>

              <Pressable
                style={[styles.btn, styles.btnOk]}
                onPress={() => act(item.id, "COMPLETED")}
              >
                <Text style={styles.btnText}>Complete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },

  title: { fontSize: 24, fontWeight: "900" },
  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  row: { flexDirection: "row", gap: 10 },

  asset: { fontSize: 14, fontWeight: "900" },
  meta: { marginTop: 4, color: "#6b7280", fontSize: 12 },
  wallet: { marginTop: 8, fontSize: 13, color: "#111827" },
  time: { marginTop: 6, color: "#9ca3af", fontSize: 12 },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  btnOk: { backgroundColor: "#16a34a" },
  btnFail: { backgroundColor: "#dc2626" },

  btnText: { color: "#fff", fontWeight: "900" },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  emptyTitle: { fontSize: 18, fontWeight: "900" },
  emptySub: { color: "#6b7280" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  muted: { marginTop: 10, color: "#6b7280" },
});
