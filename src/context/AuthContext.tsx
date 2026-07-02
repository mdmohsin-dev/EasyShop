"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role } from "@/lib/types";
import { getUsers, saveUsers, getSession, saveSession, seedAdminIfEmpty } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string, role: Role) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedAdminIfEmpty();
    const allUsers = getUsers();
    setUsers(allUsers);
    const sessionId = getSession();
    if (sessionId) {
      const found = allUsers.find((u) => u.id === sessionId) || null;
      setUser(found);
    }
    setLoading(false);
  }, []);

  function login(email: string, password: string) {
    const allUsers = getUsers();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Email or password is incorrect." };
    setUser(found);
    saveSession(found.id);
    return { ok: true };
  }

  function register(name: string, email: string, password: string, role: Role) {
    const allUsers = getUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    const updated = [...allUsers, newUser];
    saveUsers(updated);
    setUsers(updated);
    setUser(newUser);
    saveSession(newUser.id);
    return { ok: true };
  }

  function logout() {
    setUser(null);
    saveSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, users, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
