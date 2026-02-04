import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70 + insets.bottom,
          backgroundColor: "#020817",
          borderTopWidth: 0,
          paddingBottom: insets.bottom + 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={26}
              color={focused ? "#38BDF8" : "#64748B"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="wallet-outline"
              size={26}
              color={focused ? "#38BDF8" : "#64748B"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="buy"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: "#38BDF8",
                padding: 14,
                borderRadius: 999,
                marginBottom: 30,
                shadowColor: "#38BDF8",
                shadowOpacity: 0.6,
                shadowRadius: 12,
                elevation: 10,
              }}
            >
              <Ionicons name="flash-outline" size={28} color="#020817" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="receipt-outline"
              size={26}
              color={focused ? "#38BDF8" : "#64748B"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={26}
              color={focused ? "#38BDF8" : "#64748B"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null, // hides from bottom bar
        }}
      />
    </Tabs>
  );
}
