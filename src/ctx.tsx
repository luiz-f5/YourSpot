import React, { createContext, useContext, useState, useEffect } from "react";
import Constants from "expo-constants";
import { setStorageItem, getStorageItem, deleteStorageItem } from "@/src/storage";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getStorageItem("session").then((value) => {
      setSession(value);
      setLoading(false);
    });
  }, []);

//TODO:better organize this 
  async function signIn(email: string, password: string) {
    if (!email || !password) throw new Error("Preencha todos os campos");
    const secret = Constants.expoConfig?.extra?.AUTH_SECRET || "fallbackToken";
    const dummyEmail = Constants.expoConfig?.extra?.AUTH_EMAIL || null;
    const dummyPassword = Constants.expoConfig?.extra?.AUTH_PASSWORD || null;

    if (dummyEmail && dummyPassword) {
      if (email !== dummyEmail || password !== dummyPassword) {
        throw new Error("Credenciais inválidas");
      }
    }

    await setStorageItem("session", secret);
    setSession(secret);
  }

  async function signOut() {
    await deleteStorageItem("session");
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
