import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "KrishiDrishti | Intelligent Crop Health & Smart Agriculture",
  description:
    "AI-powered intelligent agriculture platform focused on crop disease detection, soil-based crop recommendation, smart irrigation, weather intelligence, sustainability scoring, IoT monitoring, and an AI farmer assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-[#fbfaf8] text-stone-900">
          <AuthProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
