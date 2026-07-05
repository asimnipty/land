import React from "react";
import { 
  FileText, 
  Languages, 
  LogOut 
} from "lucide-react";
import { translations } from "../translations";

interface HeaderProps {
  lang: "bn" | "en";
  setLang: (lang: "bn" | "en") => void;
  user: { uid: string; email: string };
  onLogout: () => void;
}

export default function Header({ lang, setLang, user, onLogout }: HeaderProps) {
  const t = translations[lang];

  return (
    <header className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-md relative print:bg-white print:text-black print:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center shadow-md shrink-0 print:border print:border-emerald-900">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                {lang === "bn" ? "ডিজিটাল সংস্করণ" : "Digital Ledger"}
              </span>
              <span className="text-emerald-300 text-xs">v1.1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
              {t.title}
            </h1>
            <p className="text-emerald-100 text-xs mt-0.5 opacity-90 print:hidden">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="flex items-center flex-wrap gap-2 print:hidden">
          {/* Language switch */}
          <button 
            id="header-lang-switch"
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/50 hover:bg-emerald-700/80 rounded-lg text-sm transition-all border border-emerald-600/30 cursor-pointer"
          >
            <Languages className="h-4 w-4 text-amber-400" />
            <span>{lang === "bn" ? "English" : "বাংলা"}</span>
          </button>

          {/* User Logged In Status / Sign out */}
          <div className="h-8 w-px bg-emerald-700/40 mx-1"></div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] text-emerald-300 leading-none">
                {user.uid === "guest" ? t.guestMode : "Logged In"}
              </p>
              <p className="text-xs font-semibold text-white max-w-[120px] truncate">
                {user.email}
              </p>
            </div>
            <button 
              id="header-logout-btn"
              onClick={onLogout}
              className="p-2 bg-emerald-700/30 hover:bg-red-700/20 hover:text-red-300 rounded-lg text-emerald-200 transition-colors cursor-pointer"
              title={t.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle decorative edge */}
      <div className="h-1 bg-amber-400 w-full"></div>
    </header>
  );
}
