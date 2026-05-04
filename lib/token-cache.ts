import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/expo";


const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        return item;
      } catch (error) {
        console.error("tokenCache.getToken error:", error);
        return null;
      }
    },
    saveToken: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.error("tokenCache.saveToken error:", error);
      }
    },
    clearToken: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error("tokenCache.clearToken error:", error);
      }
    },
  };
};

export const tokenCache = createTokenCache();

