import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function AuthButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: AuthButtonProps) {
  return (
    <Pressable
      className="auth-button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          opacity: disabled || loading ? 0.6 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className="auth-button-text">{title}</Text>
      )}
    </Pressable>
  );
}
