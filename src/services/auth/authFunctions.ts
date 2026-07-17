import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";

//TODO: .env shennanigans for the db

let db: SQLite.SQLiteDatabase | null = null;
if (Platform.OS !== "web") {
  db = SQLite.openDatabaseSync("app.db");
}

export function initDatabase() {
  if (!db) return;
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
}

export async function insertDummyUser(email: string, password: string) {
  const hashed = bcrypt.hashSync(password, 10);
  if (db) {
    await db.runAsync("INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)", [email, hashed]);
  } else {
    localStorage.setItem(`user:${email}`, hashed);
  }
}

export async function registerUser(email: string, password: string) {
  const hashed = bcrypt.hashSync(password, 10);
  if (db) {
    await db.runAsync("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed]);
  } else {
    localStorage.setItem(`user:${email}`, hashed);
  }
}

export async function signInFunction(email: string, password: string): Promise<string> {
    if (!email || !password) throw new Error("Preencha todos os campos");

    const secret = Constants.expoConfig?.extra?.AUTH_SECRET || "fallbackToken";
  
    let valid = false;
    if (db) {
      const row = await db.getFirstAsync<{ password: string }>(
        "SELECT password FROM users WHERE email = ?",
        [email]
      );
      if (row && bcrypt.compareSync(password, row.password)) valid = true;
    } else {
      const hashed = localStorage.getItem(`user:${email}`);
      if (hashed && bcrypt.compareSync(password, hashed)) valid = true;
    }
  
    if (!valid) throw new Error("Credenciais inválidas");
    
    const secretKey = new TextEncoder().encode(secret);
    const token = await new jose.SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secretKey);
  
    if (Platform.OS === "web") {
      localStorage.setItem("session", token);
    } else {
      await SecureStore.setItemAsync("session", token);
    }
  
    return token;
  }

export async function signOutFunction(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem("session");
  } else {
    await SecureStore.deleteItemAsync("session");
  }
}
