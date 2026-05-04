import { useAuth, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-foreground mb-8">Settings</Text>

      <View className="bg-card p-4 rounded-3xl mb-6 flex-row items-center">
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : require("../../assets/images/avatar.png")}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-sans-bold text-foreground">
            {user?.fullName || "User Name"}
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress || "email@example.com"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-destructive/10 p-4 rounded-2xl flex-row items-center justify-between"
      >
        <Text className="text-destructive font-sans-bold text-lg">Sign Out</Text>
        <View className="bg-destructive/20 w-8 h-8 rounded-full items-center justify-center">
          <Text className="text-destructive">→</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
