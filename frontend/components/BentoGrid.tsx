import React from "react";
import { Eye, Edit, Trash2, Calendar, FileText, Compass, TrendingUp } from "lucide-react";
import { translations } from "../translations";
import { LandRecord, Mouza } from "../types";

interface BentoGridProps {
  lang: "bn" | "en";
  records: LandRecord[];
  mouzas: Mouza[];
  onInspect: (record: LandRecord) => void;
  onEdit: (record: LandRecord) => void;
  onDelete: (id: string) => void;
}

export default function BentoGrid({
  lang,
  records,
  mouzas,
  onInspect,
  onEdit,
  onDelete,
}: BentoGridProps) {
  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((r) => {
        const currentMouza = mouzas.find((m) => m.id === r.mouzaId);
        return (
          <div 
            key={r.id}
            id={`bento-card-${r.id}`}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-emerald-700/20 group relative overflow-hidden"
          >
            {/* Top row */}
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-emerald-100">
                  {lang === "bn" ? currentMouza?.nameBn : currentMouza?.nameEn}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {t.serialNo}: {r.serialNo}
                </span>
              </div>

              {/* Title / Donor */}
              <h4 className="font-bold text-slate-800 text-sm sm:text-base mt-3 group-hover:text-emerald-900 transition-colors">
                {r.donorName}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {t.deedType}: <span className="font-semibold text-slate-600">{r.deedType}</span>
              </p>

              {/* Bento Inner Parameters Details */}
              <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase flex justify-center gap-0.5">
                    <Calendar className="h-2.5 w-2.5" />
                    {t.deedNo}
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5 text-xs sm:text-sm">{r.deedNo}</p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold uppercase flex justify-center gap-0.5">
                    <FileText className="h-2.5 w-2.5" />
                    {lang === "bn" ? "খতিয়ান" : "Khatian"}
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5 text-xs sm:text-sm">{r.khatianRS || r.khatianSA || "-"}</p>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase flex justify-center gap-0.5">
                    <Compass className="h-2.5 w-2.5" />
                    {lang === "bn" ? "দাগ নং" : "Plot"}
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5 text-xs sm:text-sm">{r.dagRS || r.dagSA || "-"}</p>
                </div>
              </div>

              {/* Land amount display */}
              <div className="flex items-center gap-1.5 mt-4 text-emerald-800 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50 w-fit">
                <TrendingUp className="h-4 w-4 text-emerald-700" />
                <span className="text-xs font-bold">
                  {r.landAmount} {lang === "bn" ? "শতক" : "Decimals"}
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-slate-100 pt-4 mt-5 flex justify-between items-center text-slate-500">
              <span className="text-[10px] font-mono">
                {r.deedRegDate || "No Date"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  id={`bento-btn-view-${r.id}`}
                  onClick={() => onInspect(r)}
                  className="p-1.5 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 rounded-lg transition-colors cursor-pointer"
                  title={t.viewDetails}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  id={`bento-btn-edit-${r.id}`}
                  onClick={() => onEdit(r)}
                  className="p-1.5 hover:bg-amber-50 text-amber-850 rounded-lg transition-colors cursor-pointer"
                  title={t.edit}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  id={`bento-btn-delete-${r.id}`}
                  onClick={() => onDelete(r.id)}
                  className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-800 rounded-lg transition-colors cursor-pointer"
                  title={t.delete}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
