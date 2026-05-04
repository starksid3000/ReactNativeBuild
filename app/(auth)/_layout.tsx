import "@/global.css";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // If still loading auth state, show nothing
  if (!isLoaded) {
    return null;
  }

  // If user is already signed in, redirect to home (tabs)
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
