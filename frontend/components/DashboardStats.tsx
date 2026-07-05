import React from "react";
import { 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Sparkles 
} from "lucide-react";
import { translations } from "../translations";
import { LandRecord, Mouza } from "../types";

interface DashboardStatsProps {
  lang: "bn" | "en";
  filteredRecords: LandRecord[];
  totalLandDecimal: number;
  mouzas: Mouza[];
  onOpenScanner: () => void;
}

export default function DashboardStats({ 
  lang, 
  filteredRecords, 
  totalLandDecimal, 
  mouzas, 
  onOpenScanner 
}: DashboardStatsProps) {
  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">{t.totalRecords}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {lang === "bn" ? filteredRecords.length.toLocaleString('bn-BD') : filteredRecords.length}
          </h3>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
          <FileText className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">{t.totalLand}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {lang === "bn" ? Number(totalLandDecimal.toFixed(2)).toLocaleString('bn-BD') : totalLandDecimal.toFixed(2)}{" "}
            <span className="text-sm font-normal text-slate-500">
              {lang === "bn" ? "শতক" : "Decimals"}
            </span>
          </h3>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase">
            {lang === "bn" ? "নিবন্ধিত মৌজা" : "Registered Mouzas"}
          </p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {lang === "bn" ? mouzas.length.toLocaleString('bn-BD') : mouzas.length}
          </h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
          <CheckCircle className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between bg-gradient-to-br from-emerald-50/50 to-emerald-100/10">
        <div>
          <p className="text-xs font-medium text-emerald-800 uppercase">{lang === "bn" ? "এআই অটো-শনাক্তকরণ" : "AI Ledger Scanning"}</p>
          <p className="text-xs text-slate-500 mt-1">
            {lang === "bn" ? "ক্যামেরা ছবি থেকে ৩০ কলাম রিড করুন" : "Extract 30 parameters with Gemini AI"}
          </p>
        </div>
        <button 
          id="stat-ai-scan-btn"
          onClick={onOpenScanner}
          className="p-2.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 font-semibold text-xs print:hidden shrink-0 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{lang === "bn" ? "এআই স্ক্যান" : "AI Scan"}</span>
        </button>
      </div>
    </div>
  );
}
