import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { createOrder } from "../../service/OrderService";
import { useAuth } from "../../context/AuthContext";

const USD_TO_HTG = 133;

export default function BuyScreen() {
  const [usd, setUsd] = useState("");
  const [wallet, setWallet] = useState("");
  const [method, setMethod] = useState<"card" | "paypal" | "moncash">("card");
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();

  const theme = useTheme();

  const usdValue = parseFloat(usd || "0");
  const htgValue = usdValue * USD_TO_HTG;
  const usdtValue = usdValue;

  const handleBuy = async () => {
    if (!usdValue || !wallet || !authState?.authenticated) return;

    try {
      setLoading(true);

      const res = await createOrder({
        assetSymbol: "USDT",
        amountFiat: usdValue,
        fiatCurrency: "USD",
        walletAddress: wallet,
        network: "TRON",
      });

      console.log("ORDER:", res);
      Keyboard.dismiss();
    } catch (err) {
      console.log("ORDER ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* Header */}
            <Text style={[styles.title, { color: theme.text }]}>
              Buy USDT
            </Text>
            <Text style={[styles.subtitle, { color: theme.subtext }]}>
              Fast • Secure • Reliable
            </Text>

            {/* Amount Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.label, { color: theme.subtext }]}>
                Amount
              </Text>

              <View style={styles.amountRow}>
                <TextInput
                  style={[styles.amountInput, { color: theme.text }]}
                  placeholder="0.00"
                  placeholderTextColor={theme.subtext}
                  keyboardType="numeric"
                  value={usd}
                  onChangeText={setUsd}
                />
                <Text style={[styles.currency, { color: theme.subtext }]}>
                  USD
                </Text>
              </View>

              <View
                style={[
                  styles.convertBox,
                  {
                    backgroundColor: theme.isDark ? "#022c22" : "#ecfeff",
                  },
                ]}
              >
                <Text
                  style={[styles.convertText, { color: theme.text }]}
                >
                  ≈ {htgValue.toFixed(0)} HTG
                </Text>
                <Text
                  style={[styles.convertSub, { color: theme.subtext }]}
                >
                  You will receive ≈ {usdtValue.toFixed(2)} USDT
                </Text>
              </View>
            </View>

            {/* Payment Selector */}
            <Text
              style={[styles.sectionTitle, { color: theme.text }]}
            >
              Payment Method
            </Text>

            <View style={styles.paymentRow}>
              <PaymentOption
                theme={theme}
                label="Card"
                icon={<FontAwesome5 name="credit-card" size={20} color={theme.text} />}
                active={method === "card"}
                onPress={() => setMethod("card")}
              />
              <PaymentOption
                theme={theme}
                label="PayPal"
                icon={<Ionicons name="logo-paypal" size={22} color={theme.text} />}
                active={method === "paypal"}
                onPress={() => setMethod("paypal")}
              />
              <PaymentOption
                theme={theme}
                label="MonCash"
                icon={<Ionicons name="cash-outline" size={22} color={theme.text} />}
                active={method === "moncash"}
                onPress={() => setMethod("moncash")}
              />
            </View>

            {/* Wallet */}
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.label, { color: theme.subtext }]}>
                Wallet Address
              </Text>
              <TextInput
                placeholder="TRON / ERC20 Wallet"
                placeholderTextColor={theme.subtext}
                style={[styles.walletInput, { color: theme.text }]}
                value={wallet}
                onChangeText={setWallet}
                autoCapitalize="none"
              />
            </View>

            {/* Buy Button */}
            <TouchableOpacity
              style={[
                styles.buyButton,
                (!usdValue || !wallet) && { opacity: 0.5 },
              ]}
              onPress={handleBuy}
              disabled={!usdValue || !wallet || loading}
            >
              <LinearGradient
                colors={["#22c55e", "#22d3ee"]}
                style={styles.gradient}
              >
                <Text style={styles.buyText}>
                  Buy {usdValue ? usdtValue.toFixed(2) : "0"} USDT
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          {/* Loading Overlay */}
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#22d3ee" />
              <Text style={styles.loadingText}>
                Processing transaction...
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

/* Payment Option Component */
function PaymentOption({ label, icon, active, onPress, theme }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.paymentBox,
        {
          backgroundColor: theme.card,
          borderColor: active ? "#22d3ee" : theme.border,
          borderWidth: 1,
        },
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.paymentText, { color: theme.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- THEME ---------------- */

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

/* Styles */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  subtitle: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    borderWidth: 1,
  },
  label: {
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "800",
    flex: 1,
  },
  currency: {
    fontSize: 18,
  },
  convertBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
  },
  convertText: {
    fontSize: 18,
    fontWeight: "700",
  },
  convertSub: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginHorizontal: 20,
  },
  paymentBox: {
    width: "32%",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  paymentText: {
    marginTop: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  walletInput: {
    fontSize: 16,
  },
  buyButton: {
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  buyText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#020817",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
