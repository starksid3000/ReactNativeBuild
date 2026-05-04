import React from "react";
import { View } from "react-native";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return <View className="auth-card">{children}</View>;
}
