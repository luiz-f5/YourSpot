import React, { useState, useEffect } from "react";
import AuthContext from "./ctxAuth";
import { AuthContextType } from "@/src/types/authContext.types";
import { signInFunction, signOutFunction, initDatabase, insertDummyUser } from "./authFunctions";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
//TODO: remove dummy login for production
  useEffect(() => {
    initDatabase();
    insertDummyUser("hi@hi.com", "1234");

    if (Platform.OS === "web") {
      setSession(localStorage.getItem("session"));
      setLoading(false);
    } else {
      SecureStore.getItemAsync("session").then((value) => {
        setSession(value);
        setLoading(false);
      });
    }
  }, []);

  async function signIn(email: string, password: string) {
    const token = await signInFunction(email, password);
    setSession(token);
  }

  async function signOut() {
    await signOutFunction();
    setSession(null);
  }

  const value: AuthContextType = { signIn, signOut, session, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
