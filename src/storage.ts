import { Platform } from "react-native";

//expo doesn't seem to have a proper fallback for securestore on web?
//this is the best i could come up with as a patch

let SecureStore: typeof import("expo-secure-store") | null = null;
if (Platform.OS !== "web") {
  SecureStore = require("expo-secure-store");
}

export async function setStorageItem(key: string, value: string | null) {
  if (Platform.OS === "web") {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } else if (SecureStore) {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export async function getStorageItem(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else if (SecureStore) {
    return await SecureStore.getItemAsync(key);
  }
  return null;
}

export async function deleteStorageItem(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else if (SecureStore) {
    await SecureStore.deleteItemAsync(key);
  }
}
