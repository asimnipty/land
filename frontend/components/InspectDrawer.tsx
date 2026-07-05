import React from "react";
import { X, Calendar, User, FileText, Compass, DollarSign, ExternalLink } from "lucide-react";
import { translations } from "../translations";
import { LandRecord, Mouza } from "../types";

interface InspectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: LandRecord | null;
  lang: "bn" | "en";
  mouzas: Mouza[];
}

export default function InspectDrawer({
  isOpen,
  onClose,
  record,
  lang,
  mouzas,
}: InspectDrawerProps) {
  const t = translations[lang];

  if (!isOpen || !record) return null;

  const currentMouza = mouzas.find((m) => m.id === record.mouzaId);

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex justify-end">
      <div 
        id="inspect-drawer" 
        className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header */}
        <div className="bg-emerald-900 p-4 text-white flex justify-between items-center shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
              {t.viewDetails}
            </span>
            <h3 className="font-bold text-sm sm:text-base">
              {record.donorName} ({t.deedNo}: {record.deedNo})
            </h3>
          </div>
          <button
            id="inspect-drawer-close"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-emerald-800 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Mouza Stamp */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{t.mouza}:</p>
              <h4 className="font-bold text-slate-800 mt-0.5 text-sm sm:text-base">
                {lang === "bn" ? currentMouza?.nameBn : currentMouza?.nameEn}
              </h4>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{t.upazila}:</p>
                <p className="text-slate-700 font-medium text-xs sm:text-sm">
                  {lang === "bn" ? currentMouza?.upazilaBn : currentMouza?.upazilaEn}
                </p>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{t.district}:</p>
                <p className="text-slate-700 font-medium text-xs sm:text-sm">
                  {lang === "bn" ? currentMouza?.districtBn : currentMouza?.districtEn}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Basic & Deed Information */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2 border-slate-100">
              <Calendar className="h-4 w-4 text-emerald-800" />
              <span>{t.basicInfo}</span>
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.serialNo}</span>
                <p className="font-semibold text-slate-800">{record.serialNo}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.fileNo}</span>
                <p className="font-semibold text-slate-800">{record.fileNo}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.donorName}</span>
                <p className="font-semibold text-slate-800">{record.donorName}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.deedNo}</span>
                <p className="font-semibold text-slate-800">{record.deedNo}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.deedType}</span>
                <p className="font-semibold text-slate-800">{record.deedType}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.landAmount}</span>
                <p className="font-bold text-emerald-800">
                  {record.landAmount} {lang === "bn" ? "শতক" : "Decimals"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Khatians (6 params) */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2 border-slate-100">
              <FileText className="h-4 w-4 text-emerald-800" />
              <span>{t.khatianInfo}</span>
            </h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.khatianCS}</span>
                <p className="font-bold text-slate-800 mt-0.5">{record.khatianCS || "-"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.khatianSA}</span>
                <p className="font-bold text-slate-800 mt-0.5">{record.khatianSA || "-"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.khatianRS}</span>
                <p className="font-bold text-slate-800 mt-0.5">{record.khatianRS || "-"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.khatianBS}</span>
                <p className="font-bold text-slate-800 mt-0.5">{record.khatianBS || "-"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.khatianNamjari}</span>
                <p className="font-bold text-slate-800 mt-0.5">{record.khatianNamjari || "-"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">{t.khatianWCL}</span>
                <p className="font-bold text-slate-800 mt-0.5">{record.khatianWCL || "-"}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Plots & JL Numbers (4+3 params) */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2 border-slate-100">
              <Compass className="h-4 w-4 text-emerald-800" />
              <span>{t.dagInfo}</span>
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="font-semibold text-slate-500 text-[10px] uppercase">দাগ নম্বরসমূহ (Plots):</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.dagCS}</span>
                    <p className="font-semibold text-slate-800">{record.dagCS || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.dagSA}</span>
                    <p className="font-semibold text-slate-800">{record.dagSA || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.dagRS}</span>
                    <p className="font-semibold text-slate-800">{record.dagRS || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.dagBS}</span>
                    <p className="font-semibold text-slate-800">{record.dagBS || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-slate-500 text-[10px] uppercase">জে এল নম্বর (JL Numbers):</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.jlCS}</span>
                    <p className="font-semibold text-slate-800">{record.jlCS || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.jlSA}</span>
                    <p className="font-semibold text-slate-800">{record.jlSA || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">{t.jlRS}</span>
                    <p className="font-semibold text-slate-800">{record.jlRS || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Mutation & Revenue (3+1 params) */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2 border-slate-100">
              <DollarSign className="h-4 w-4 text-emerald-800" />
              <span>{t.mutationInfo}</span>
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.mutationCompany}</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.mutationCompany || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.mutationIndividual}</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.mutationIndividual || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.mutationDonor}</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.mutationDonor || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.taxYear}</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.taxYear || "-"}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Baya Deeds & Historical records */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2 border-slate-200">
              <ExternalLink className="h-4 w-4 text-emerald-800" />
              <span>{t.bayaInfo}</span>
            </h5>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 block">{t.warishCertificate}</span>
                <p className="font-semibold text-slate-800">{record.warishCertificate || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.holdingNo}</span>
                <p className="font-semibold text-slate-800">{record.holdingNo || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.bayaDeed}</span>
                <p className="font-semibold text-slate-800">{record.bayaDeed || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.deedRegDate}</span>
                <p className="font-semibold text-slate-800">{record.deedRegDate || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.mediaName}</span>
                <p className="font-semibold text-slate-800">{record.mediaName || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.caseNo}</span>
                <p className="font-semibold text-slate-800">{record.caseNo || "-"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block">{t.remarks}</span>
                <p className="font-semibold text-slate-800 mt-0.5 italic text-xs">{record.remarks || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            id="inspect-drawer-footer-close"
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-emerald-800 hover:bg-emerald-950 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm"
          >
            {lang === "bn" ? "ঠিক আছে" : "Close Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
