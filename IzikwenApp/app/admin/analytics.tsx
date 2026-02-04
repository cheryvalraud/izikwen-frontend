import { View, Text, StyleSheet } from "react-native";

export default function AdminAnalytics() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>System Analytics</Text>
      <Text style={styles.subtitle}>Live platform metrics</Text>

      <View style={styles.grid}>
        <StatCard label="Total Orders" value="1,245" />
        <StatCard label="Revenue" value="$82,340" />
        <StatCard label="Pending" value="6" />
        <StatCard label="Completed" value="1,201" />
        <StatCard label="Failed" value="38" />
        <StatCard label="Success Rate" value="96.9%" />
      </View>
    </View>
  );
}

function StatCard({ label, value }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#6b7280", marginBottom: 16 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  value: { fontSize: 22, fontWeight: "900" },
  label: { color: "#6b7280", marginTop: 4 },
});
