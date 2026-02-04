import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, Redirect } from "expo-router";
import { styles } from "../styles/auth.styles";

export default function LoginScreen() {
  const { onLogin, authState } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //  Already logged in → redirect to tabs
  if (authState.authenticated) {
    return <Redirect href="./tabs" />;
  }

  const validate = () => {
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email.");
      return false;
    }
    if (!password) {
      Alert.alert("Missing Password", "Please enter your password.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      Keyboard.dismiss();
      setLoading(true);

      const result = await onLogin(email.trim(), password);

      // 🔐 2FA required → OTP flow
      if (result.requires2FA) {
        router.push({
          pathname: "/otp",
          params: { twoFaToken: result.twoFaToken },
        });
        return;
      }

      //  Normal login → home tabs
      router.replace("./tabs");

    } catch (err: any) {
      console.log("LOGIN ERROR:", err);

      if (err?.response?.status === 401) {
        Alert.alert("Login Failed", "Invalid email or password.");
      } else {
        Alert.alert("Connection Error", "Unable to reach server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.page}
      >
        <Text style={styles.title}>Welcome to Izikwen</Text>
        <Text style={styles.subtitle}>
          Secure login to your USDT account
        </Text>

        <View style={styles.card}>
          <TextInput
            placeholder="Email address"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>
              Don’t have an account?
            </Text>

            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.linkAction}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
