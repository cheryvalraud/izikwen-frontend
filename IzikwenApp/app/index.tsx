import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { authState } = useAuth();

  if (authState.authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="./tabs" />;
}
