import React from 'react' 
import Constants from "expo-constants";
import AuthContext from './ctxAuth';
import {useState, useEffect} from 'react'
import { getStorageItem, setStorageItem, deleteStorageItem } from '../database/storage';


export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getStorageItem("session").then((value) => {
      setSession(value);
      setLoading(false);
    });
  }, []);

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
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
}