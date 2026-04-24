import "@/global.css";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary text-white p-4" >OnBoard</Link>
      <Link href="/(auth)/signin" className="mt-4 rounded bg-primary text-white p-4" >SignIn</Link>
      <Link href="/(auth)/signup" className="mt-4 rounded bg-primary text-white p-4" >SignUp</Link>
      <Link href="/subscription/spotify">Spotify subscription</Link>
      <Link
        href={{
          pathname: "/subscription/[id]",
          params: { id: "claude" },
        }}>claude max subscription</Link>
    </View>
  );
}
