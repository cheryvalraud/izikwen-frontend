import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TwoFAScreen() {
  return (
    <View style={styles.page}>
      <Ionicons name="key-outline" size={48} />
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.sub}>
        Add an extra layer of security to protect your account.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" },
  title: { fontSize: 22, fontWeight: "800", marginTop: 10 },
  sub: { color: "#6b7280", marginTop: 4, textAlign: "center" },
});
