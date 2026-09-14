"use client";

import React, { createContext, useContext } from "react";
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
  const router = useRouter();

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
    signOut(() => router.push("/login"));
  };

  return (
    <AuthContext.Provider value={{ farmer, token: null, isLoading: !isLoaded, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
