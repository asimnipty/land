import React from "react";
import { Search, Plus, Filter, LayoutGrid, List, Printer } from "lucide-react";
import { translations } from "../translations";
import { Mouza } from "../types";

interface SearchFiltersProps {
  lang: "bn" | "en";
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMouzaId: string;
  setSelectedMouzaId: (id: string) => void;
  selectedDeedType: string;
  setSelectedDeedType: (type: string) => void;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  mouzas: Mouza[];
  deedTypes: string[];
  onOpenRecordModal: () => void;
  onOpenMouzaModal: () => void;
  onPrintReport: () => void;
}

export default function SearchFilters({
  lang,
  searchTerm,
  setSearchTerm,
  selectedMouzaId,
  setSelectedMouzaId,
  selectedDeedType,
  setSelectedDeedType,
  viewMode,
  setViewMode,
  mouzas,
  deedTypes,
  onOpenRecordModal,
  onOpenMouzaModal,
  onPrintReport,
}: SearchFiltersProps) {
  const t = translations[lang];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 print:hidden">
      {/* Top action triggers */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="h-4.5 w-4.5 text-emerald-800" />
          <span>{t.searchFilters}</span>
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Mouza */}
          <button
            id="filter-add-mouza"
            onClick={onOpenMouzaModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addMouza}</span>
          </button>

          {/* Add Record */}
          <button
            id="filter-add-record"
            onClick={onOpenRecordModal}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addRecord}</span>
          </button>

          {/* Print/PDF */}
          <button
            id="filter-print"
            onClick={onPrintReport}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{t.exportLedger}</span>
          </button>
        </div>
      </div>

      {/* Grid of inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Mouza Select */}
        <div>
          <select
            id="filter-select-mouza"
            value={selectedMouzaId}
            onChange={(e) => setSelectedMouzaId(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-medium"
          >
            <option value="all">{t.allMouzas}</option>
            {mouzas.map((m) => (
              <option key={m.id} value={m.id}>
                {lang === "bn" ? m.nameBn : m.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Deed Type Select */}
        <div>
          <select
            id="filter-select-deed"
            value={selectedDeedType}
            onChange={(e) => setSelectedDeedType(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-medium"
          >
            <option value="all">{t.allDeedTypes}</option>
            {deedTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center justify-end gap-1 shrink-0">
          <span className="text-xs text-slate-400 font-semibold uppercase mr-2">
            {lang === "bn" ? "প্রদর্শন ভিউ:" : "View Mode:"}
          </span>
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border">
            <button
              id="view-toggle-table"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title={t.traditionalLedger}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              id="view-toggle-grid"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title={t.modernGrid}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
