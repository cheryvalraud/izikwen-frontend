import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { api } from "../service/api";

// Auth navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  TwoFA: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, "TwoFA">;

export default function TwoFAScreen({ navigation }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    try {
      if (!code || code.length < 6) {
        Alert.alert("Invalid Code", "Please enter the 6-digit code.");
        return;
      }

      setLoading(true);

      const token = await SecureStore.getItemAsync("twoFaToken");

      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        navigation.replace("Login");
        return;
      }

      const res = await api.post(
        "/auth/2fa/verify",
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      await SecureStore.deleteItemAsync("twoFaToken");

      navigation.replace("Home");

    } catch (err: any) {
      console.error("2FA error:", err?.response?.data || err?.message);
      Alert.alert("Invalid Code", "The verification code is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code from your authenticator app
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        textAlign="center"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={verifyOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

//  Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    letterSpacing: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
