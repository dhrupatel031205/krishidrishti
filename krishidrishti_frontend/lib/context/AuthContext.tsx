"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/nextjs";
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
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  farmer: null,
  token: null,
  isLoading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Fetch Clerk JWT and keep it fresh, store in localStorage for getAuthHeaders()
  useEffect(() => {
    if (!isLoaded || !user) {
      setToken(null);
      localStorage.removeItem("krishidrishti_auth");
      return;
    }
    const refresh = async () => {
      try {
        const t = await getToken();
        if (t) {
          setToken(t);
          localStorage.setItem("krishidrishti_auth", JSON.stringify({ token: t }));
        }
      } catch {
        // silent
      }
    };
    refresh();
    // Refresh every 55 minutes (Clerk tokens expire in 60 min)
    const interval = setInterval(refresh, 55 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isLoaded, user, getToken]);

  const farmer: Farmer | null = user
    ? {
        id: user.id,
        name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "Farmer",
        phone: user.phoneNumbers[0]?.phoneNumber || "",
        farmName: (user.publicMetadata?.farmName as string) || "My Farm",
        location: (user.publicMetadata?.location as string) || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }
    : null;

  const logout = () => {
    localStorage.removeItem("krishidrishti_auth");
    signOut(() => router.push("/login"));
  };

  return (
    <AuthContext.Provider value={{ farmer, token, isLoading: !isLoaded, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
