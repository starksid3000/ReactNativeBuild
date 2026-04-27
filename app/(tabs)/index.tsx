import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-7xl font-sans-extrabold">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded font-sans-bold bg-primary text-white p-4"
      >
        OnBoard
      </Link>
      <Link
        href="/(auth)/signin"
        className="mt-4 rounded font-sans-extrabold bg-primary text-white p-4"
      >
        SignIn
      </Link>
      <Link
        href="/(auth)/signup"
        className="mt-4 rounded font-sans-extrabold bg-primary text-white p-4"
      >
        SignUp
      </Link>
    </SafeAreaView>
  );
}
