import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createMouza } from "../db";
import { translations } from "../translations";
import { Mouza } from "../types";

interface MouzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "bn" | "en";
  userId: string;
  onMouzaCreated: (created: Mouza) => void;
}

export default function MouzaModal({ 
  isOpen, 
  onClose, 
  lang, 
  userId, 
  onMouzaCreated 
}: MouzaModalProps) {
  const [newMouzaBn, setNewMouzaBn] = useState("");
  const [newMouzaEn, setNewMouzaEn] = useState("");
  const [newDistrictBn, setNewDistrictBn] = useState("");
  const [newDistrictEn, setNewDistrictEn] = useState("");
  const [newUpazilaBn, setNewUpazilaBn] = useState("");
  const [newUpazilaEn, setNewUpazilaEn] = useState("");
  const [mouzaSubmitting, setMouzaSubmitting] = useState(false);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleCreateMouza = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMouzaBn || !newMouzaEn) return;
    setMouzaSubmitting(true);
    try {
      const created = await createMouza({
        nameBn: newMouzaBn,
        nameEn: newMouzaEn,
        districtBn: newDistrictBn || "গাজীপুর",
        districtEn: newDistrictEn || "Gazipur",
        upazilaBn: newUpazilaBn || "কালীগঞ্জ",
        upazilaEn: newUpazilaEn || "Kaliganj"
      }, userId);
      
      onMouzaCreated(created);
      
      // Reset
      setNewMouzaBn("");
      setNewMouzaEn("");
      setNewDistrictBn("");
      setNewDistrictEn("");
      setNewUpazilaBn("");
      setNewUpazilaEn("");
      onClose();
    } catch (err) {
      console.error("Failed to create Mouza:", err);
    } finally {
      setMouzaSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div id="mouza-modal" className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base">{t.createNewMouza}</h3>
          <button 
            id="mouza-modal-close"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 hover:bg-emerald-800 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreateMouza} className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-slate-600 block">{t.mouzaNameBn} *</label>
            <input 
              id="mouza-input-name-bn"
              type="text" 
              required
              value={newMouzaBn}
              onChange={(e) => setNewMouzaBn(e.target.value)}
              placeholder="যেমন: মাঝিনা"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-600 block">{t.mouzaNameEn} *</label>
            <input 
              id="mouza-input-name-en"
              type="text" 
              required
              value={newMouzaEn}
              onChange={(e) => setNewMouzaEn(e.target.value)}
              placeholder="e.g. Mazina"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 block">{t.upazilaBn}</label>
              <input 
                id="mouza-input-upazila-bn"
                type="text" 
                value={newUpazilaBn}
                onChange={(e) => setNewUpazilaBn(e.target.value)}
                placeholder="যেমন: কালীগঞ্জ"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 block">{t.upazilaEn}</label>
              <input 
                id="mouza-input-upazila-en"
                type="text" 
                value={newUpazilaEn}
                onChange={(e) => setNewUpazilaEn(e.target.value)}
                placeholder="e.g. Kaliganj"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 block">{t.districtBn}</label>
              <input 
                id="mouza-input-district-bn"
                type="text" 
                value={newDistrictBn}
                onChange={(e) => setNewDistrictBn(e.target.value)}
                placeholder="যেমন: গাজীপুর"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 block">{t.districtEn}</label>
              <input 
                id="mouza-input-district-en"
                type="text" 
                value={newDistrictEn}
                onChange={(e) => setNewDistrictEn(e.target.value)}
                placeholder="e.g. Gazipur"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="border-t border-slate-100 pt-4 flex justify-end gap-2 text-xs">
            <button 
              id="mouza-modal-cancel"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button 
              id="mouza-modal-save"
              type="submit"
              disabled={mouzaSubmitting}
              className="px-5 py-2 bg-emerald-800 text-white hover:bg-emerald-950 font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
            >
              {mouzaSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
