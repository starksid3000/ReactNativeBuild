import React from "react";
import { Text, TextInput, View } from "react-native";

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default";
  editable?: boolean;
}

export default function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
}: FormInputProps) {
  return (
    <View className="auth-input-wrapper">
      <Text className="auth-input-label">{label}</Text>
      <TextInput
        className="auth-input"
        placeholder={placeholder}
        placeholderTextColor="rgba(8, 17, 38, 0.4)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error && <Text className="auth-input-error">{error}</Text>}
    </View>
  );
}
