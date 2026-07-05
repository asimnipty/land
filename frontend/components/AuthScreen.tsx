import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { 
  FileText, 
  Languages, 
  ShieldAlert, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import { auth } from "../firebase";
import { translations } from "../translations";

interface AuthScreenProps {
  lang: "bn" | "en";
  setLang: (lang: "bn" | "en") => void;
  onLogin: (user: { uid: string; email: string }) => void;
}

export default function AuthScreen({ lang, setLang, onLogin }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const t = translations[lang];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (cred.user) {
          onLogin({ uid: cred.user.uid, email: cred.user.email || "" });
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (cred.user) {
          onLogin({ uid: cred.user.uid, email: cred.user.email || "" });
        }
      }
      localStorage.removeItem("land_guest_session");
    } catch (err: any) {
      console.error("Auth error:", err);
      setAuthError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("land_guest_session", "true");
    onLogin({ uid: "guest", email: "guest@digitalledger.gov" });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60"></div>

      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div id="auth-card" className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header branding */}
          <div className="bg-gradient-to-b from-emerald-800 to-emerald-950 p-6 text-center relative text-white">
            <div className="mx-auto w-16 h-16 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center shadow-lg mb-3">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              মৌজা ভূমি রেকর্ড রেজিস্টার
            </h1>
            <p className="text-emerald-200 text-xs mt-1">
              Land Ledger & Khatian Register Portal
            </p>
            
            {/* Language Switcher in Login */}
            <button 
              id="auth-lang-switch"
              type="button"
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="absolute top-4 right-4 flex items-center gap-1 text-xs bg-emerald-700/50 hover:bg-emerald-700 hover:text-white px-2 py-1 rounded-md text-emerald-100 transition-all border border-emerald-600/30"
            >
              <Languages className="h-3 w-3" />
              {lang === "bn" ? "English" : "বাংলা"}
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 text-center">
                {isSignUp ? t.signup : t.login}
              </h2>
              
              {authError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">{t.email}</label>
                <input 
                  id="auth-email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., land.officer@gmail.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">{t.password}</label>
                <input 
                  id="auth-password"
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>

              <button 
                id="auth-submit-btn"
                type="submit"
                disabled={authSubmitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2 rounded-lg text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                {authSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  isSignUp ? t.signup : t.login
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button 
                id="auth-toggle-btn"
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-emerald-800 hover:underline font-medium"
              >
                {isSignUp ? t.hasAccount : t.noAccount}
              </button>
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">{t.or}</span>
              </div>
            </div>

            {/* Guest Login CTA */}
            <button 
              id="auth-guest-btn"
              type="button"
              onClick={handleGuestLogin}
              className="w-full border border-emerald-800 text-emerald-800 hover:bg-emerald-50 font-semibold py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {lang === "bn" ? "গেস্ট হিসেবে সরাসরি প্রবেশ করুন (কোন পাসওয়ার্ড ছাড়া)" : "Explore in Guest Mode (Offline)"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center p-4 text-xs text-slate-500">
        © {new Date().getFullYear()} গণপ্রজাতন্ত্রী বাংলাদেশ ভূমি রেকর্ড ও সার্ভে অধিদপ্তর (ডিজিটাল সেবা)
      </div>
    </div>
  );
}
