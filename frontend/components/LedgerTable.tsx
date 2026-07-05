import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { translations } from "../translations";
import { LandRecord, Mouza } from "../types";

interface LedgerTableProps {
  lang: "bn" | "en";
  records: LandRecord[];
  mouzas: Mouza[];
  onInspect: (record: LandRecord) => void;
  onEdit: (record: LandRecord) => void;
  onDelete: (id: string) => void;
}

export default function LedgerTable({
  lang,
  records,
  mouzas,
  onInspect,
  onEdit,
  onDelete,
}: LedgerTableProps) {
  const t = translations[lang];

  return (
    <div id="ledger-book-container" className="bg-amber-50/20 border-2 border-amber-900/10 rounded-2xl overflow-hidden shadow-md">
      {/* Table Title and Book Decor */}
      <div className="bg-amber-900/90 text-amber-50 p-4 border-b border-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            {t.traditionalLedger}
          </h3>
          <p className="text-[10px] text-amber-200 mt-0.5 font-medium">
            {lang === "bn" ? "ঐতিহ্যবাহী রেজিস্টার খাতার পাতাসমূহ (৩০ কলামভিত্তিক বিবরণ)" : "Traditional book registers containing comprehensive 30 columns"}
          </p>
        </div>
        <span className="text-[10px] bg-amber-950/60 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40 shrink-0">
          {lang === "bn" ? `${records.length.toLocaleString('bn-BD')} টি নথি ভুক্ত` : `${records.length} records registered`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table id="ledger-book-table" className="w-full text-[11px] sm:text-xs text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-amber-900/10 text-amber-950 font-bold text-[10px] border-b border-amber-900/20">
              <th className="p-3 border-r border-amber-900/10 text-center">{t.serialNo}</th>
              <th className="p-3 border-r border-amber-900/10 text-center">{t.fileNo}</th>
              <th className="p-3 border-r border-amber-900/10">{t.mouza}</th>
              <th className="p-3 border-r border-amber-900/10">{t.donorName}</th>
              <th className="p-3 border-r border-amber-900/10 text-center">{t.deedNo}</th>
              <th className="p-3 border-r border-amber-900/10">{t.deedType}</th>
              <th className="p-3 border-r border-amber-900/10 text-right">{t.landAmount}</th>
              <th className="p-3 border-r border-amber-900/10 text-center">{t.khatianSA}</th>
              <th className="p-3 border-r border-amber-900/10 text-center">{t.khatianRS}</th>
              <th className="p-3 border-r border-amber-900/10 text-center">{t.dagRS}</th>
              <th className="p-3 border-r border-amber-900/10 text-center">{t.taxYear}</th>
              <th className="p-3 text-center print:hidden">{lang === "bn" ? "অ্যাকশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/10">
            {records.map((r, i) => {
              const currentMouza = mouzas.find((m) => m.id === r.mouzaId);
              return (
                <tr 
                  key={r.id} 
                  className={`hover:bg-amber-100/50 transition-colors ${i % 2 === 0 ? "bg-amber-50/5" : "bg-white"}`}
                >
                  <td className="p-3 border-r border-amber-900/10 text-center font-bold text-amber-950">{r.serialNo}</td>
                  <td className="p-3 border-r border-amber-900/10 text-center text-slate-600">{r.fileNo}</td>
                  <td className="p-3 border-r border-amber-900/10 font-medium text-slate-800">
                    {lang === "bn" ? currentMouza?.nameBn : currentMouza?.nameEn}
                  </td>
                  <td className="p-3 border-r border-amber-900/10 font-bold text-slate-850">{r.donorName}</td>
                  <td className="p-3 border-r border-amber-900/10 text-center font-semibold text-amber-900">{r.deedNo}</td>
                  <td className="p-3 border-r border-amber-900/10 text-slate-600">{r.deedType}</td>
                  <td className="p-3 border-r border-amber-900/10 text-right font-bold text-emerald-800">{r.landAmount}</td>
                  <td className="p-3 border-r border-amber-900/10 text-center text-slate-600 font-semibold">{r.khatianSA || "-"}</td>
                  <td className="p-3 border-r border-amber-900/10 text-center text-slate-600 font-semibold">{r.khatianRS || "-"}</td>
                  <td className="p-3 border-r border-amber-900/10 text-center text-slate-600 font-semibold">{r.dagRS || "-"}</td>
                  <td className="p-3 border-r border-amber-900/10 text-center text-slate-500">{r.taxYear || "-"}</td>
                  <td className="p-3 text-center print:hidden">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        id={`action-view-${r.id}`}
                        onClick={() => onInspect(r)}
                        className="p-1 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 rounded transition-colors cursor-pointer"
                        title={t.viewDetails}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        id={`action-edit-${r.id}`}
                        onClick={() => onEdit(r)}
                        className="p-1 hover:bg-amber-100 text-amber-850 rounded transition-colors cursor-pointer"
                        title={t.edit}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        id={`action-delete-${r.id}`}
                        onClick={() => onDelete(r.id)}
                        className="p-1 hover:bg-red-50 text-red-600 hover:text-red-800 rounded transition-colors cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
