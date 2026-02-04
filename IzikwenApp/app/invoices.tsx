import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function InvoicesScreen() {
  const router = useRouter();

  const invoices: any[] = []; // future API data

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Invoices & Receipts</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      {invoices.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.iconBox}>
            <Ionicons name="receipt-outline" size={48} color="#2563eb" />
          </View>

          <Text style={styles.title}>No invoices yet</Text>

          <Text style={styles.sub}>
            Your invoices and receipts will appear here once you complete
            transactions.
          </Text>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.invoiceTitle}>Invoice #{item.id}</Text>
                <Text style={styles.invoiceSub}>{item.date}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>${item.amount}</Text>
                <TouchableOpacity>
                  <Text style={styles.download}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  sub: {
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  invoiceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  invoiceSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  amount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16a34a",
  },

  download: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
    marginTop: 4,
  },
});
