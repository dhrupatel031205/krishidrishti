"use client";
import { SignIn } from "@clerk/nextjs";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 shadow-md mx-auto mb-3">
            <img src="/logo.png" alt="KrishiDrishti" className="h-10 w-10 object-contain rounded-xl" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-stone-900">
            Krishi<span className="text-emerald-700">Drishti</span>
          </span>
          <p className="text-xs text-stone-500 font-medium mt-1">{t("landingIntelligentCrop")}</p>
        </div>
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-2xl border border-stone-200 shadow-sm",
              headerTitle: "text-stone-900 font-bold",
              headerSubtitle: "text-stone-500",
              socialButtonsBlockButton: "border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium rounded-xl",
              formButtonPrimary: "bg-emerald-800 hover:bg-emerald-900 rounded-xl font-semibold",
              footerActionLink: "text-emerald-700 hover:text-emerald-900 font-semibold",
              formFieldInput: "rounded-xl border-stone-300 focus:border-emerald-500 focus:ring-emerald-500/20",
            },
          }}
        />
      </div>
    </div>
  );
}
