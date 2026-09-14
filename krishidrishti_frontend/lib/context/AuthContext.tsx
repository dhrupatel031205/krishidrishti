"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  farmName: string;
  location: string;
  email: string;
}

interface AuthContextType {
  farmer: Farmer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (data: SignupData) => Promise<{ error?: string }>;
  logout: () => void;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  farmName: string;
  location: string;
  password: string;
}

const AuthContext = createContext<AuthContextType>({
  farmer: null,
  isLoading: true,
  login: async () => ({}),
  signup: async () => ({}),
  logout: () => {},
});

const STORAGE_KEY = "krishidrishti_auth";
const USERS_KEY = "krishidrishti_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFarmer(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users: (Farmer & { password: string })[] = raw ? JSON.parse(raw) : [];
      const match = users.find((u) => u.email === email && u.password === password);
      if (!match) return { error: "Invalid email or password." };
      const { password: _, ...farmerData } = match;
      setFarmer(farmerData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farmerData));
      return {};
    } catch {
      return { error: "Login failed. Please try again." };
    }
  };

  const signup = async (data: SignupData): Promise<{ error?: string }> => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users: (Farmer & { password: string })[] = raw ? JSON.parse(raw) : [];
      if (users.find((u) => u.email === data.email)) {
        return { error: "An account with this email already exists." };
      }
      const newFarmer: Farmer = {
        id: `farmer-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        farmName: data.farmName,
        location: data.location,
        email: data.email,
      };
      users.push({ ...newFarmer, password: data.password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setFarmer(newFarmer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFarmer));
      return {};
    } catch {
      return { error: "Signup failed. Please try again." };
    }
  };

  const logout = () => {
    setFarmer(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ farmer, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
