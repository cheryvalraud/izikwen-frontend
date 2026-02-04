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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/auth.styles";

export default function RegisterScreen() {
  const { onRegister } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    if (!firstName || !lastName || !country || !email || !password || !confirm) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return false;
    }
    if (!validateEmail(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return false;
    }
    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      Keyboard.dismiss();
      setLoading(true);

      await onRegister(email.trim(), password);

      Alert.alert("Account created 🎉", "You can now log in.", [
        { text: "Login", onPress: () => router.replace("/login") },
      ]);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert("Account exists", "This email is already registered.");
      } else {
        Alert.alert("Registration failed", "Please try again.");
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
        {/* TOP BACK BUTTON */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 10 }}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Create your Izikwen account</Text>
        <Text style={styles.subtitle}>
          Secure access to your USDT wallet
        </Text>

        <View style={styles.card}>
          <TextInput placeholder="First name" style={styles.input} value={firstName} onChangeText={setFirstName} />
          <TextInput placeholder="Last name" style={styles.input} value={lastName} onChangeText={setLastName} />
          <TextInput placeholder="Country" style={styles.input} value={country} onChangeText={setCountry} />
          <TextInput placeholder="Email address" style={styles.input} autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput placeholder="Confirm password" style={styles.input} secureTextEntry value={confirm} onChangeText={setConfirm} />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
          </TouchableOpacity>
        </View>

        {/* BOTTOM LOGIN LINK */}
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ textAlign: "center", color: "#2563EB", fontWeight: "600" }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
