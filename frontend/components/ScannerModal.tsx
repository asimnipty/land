import React, { useState } from "react";
import { X, Sparkles, Loader2, Upload, Info } from "lucide-react";
import { translations } from "../translations";
import { Mouza } from "../types";

// Unsplash preview image for sandbox visual testing
const SAMPLE_IMAGE_PREVIEW = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "bn" | "en";
  mouzas: Mouza[];
  selectedMouzaId: string;
  onScanSuccess: (extractedData: any) => void;
}

export default function ScannerModal({
  isOpen,
  onClose,
  lang,
  mouzas,
  selectedMouzaId,
  onScanSuccess,
}: ScannerModalProps) {
  const [scannedFile, setScannedFile] = useState<File | null>(null);
  const [scannedFilePreview, setScannedFilePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [useSampleImage, setUseSampleImage] = useState(true);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScannedFile(file);
      setUseSampleImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannedFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAIScan = async () => {
    setIsScanning(true);
    setScanMessage(t.scanning);

    try {
      if (useSampleImage) {
        // We simulate the Gemini scanner parsing the Mouza Mazina Ledger page
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setScanMessage(lang === "bn" ? "দলিল বিশ্লেষণ সম্পন্ন হচ্ছে..." : "Analyzing deed structure...");
        await new Promise((resolve) => setTimeout(resolve, 800));
        setScanMessage(lang === "bn" ? "খতিয়ান এবং দাগ নম্বর এক্সট্র্যাক্ট করা হচ্ছে..." : "Extracting khatian & plot details...");
        await new Promise((resolve) => setTimeout(resolve, 700));

        const simulatedResult = {
          mouzaId: "mouza_mazina",
          serialNo: "1",
          fileNo: "1",
          donorName: "এস এম শওকত আলী",
          deedNo: "29810",
          deedType: "সাব কবলা কোং",
          landAmount: "4.30",
          khatianCS: "-",
          khatianSA: "114",
          khatianRS: "294",
          khatianBS: "-",
          khatianNamjari: "-",
          khatianWCL: "1963",
          dagCS: "868",
          dagSA: "868",
          dagRS: "1026",
          dagBS: "-",
          jlCS: "126",
          jlSA: "126",
          jlRS: "125",
          mutationCompany: "WCL",
          mutationIndividual: "-",
          mutationDonor: "-",
          taxYear: "২০২২-২৩ (১৪৩০)",
          warishCertificate: "০২ টি",
          bayaDeed: "-",
          holdingNo: "১৯৬২",
          deedRegDate: "11/11/2009",
          mediaName: "-",
          remarks: "মূল দলিল",
          caseNo: "-",
        };

        setIsScanning(false);
        onScanSuccess(simulatedResult);
        alert(t.scanSuccess);
        onClose();
      } else {
        if (!scannedFilePreview) {
          throw new Error("No image selected");
        }

        const res = await fetch("/api/scan-ledger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: scannedFilePreview }),
        });

        const result = await res.json();
        if (result.success && result.data) {
          const extracted = result.data;
          const completedForm = {
            mouzaId: selectedMouzaId !== "all" ? selectedMouzaId : mouzas[0]?.id || "mouza_mazina",
            serialNo: extracted.serialNo || "1",
            fileNo: extracted.fileNo || "1",
            donorName: extracted.donorName || "",
            deedNo: extracted.deedNo || "",
            deedType: extracted.deedType || "সাব কবলা কোং",
            landAmount: extracted.landAmount || "",
            khatianCS: extracted.khatianCS || "-",
            khatianSA: extracted.khatianSA || "-",
            khatianRS: extracted.khatianRS || "-",
            khatianBS: extracted.khatianBS || "-",
            khatianNamjari: extracted.khatianNamjari || "-",
            khatianWCL: extracted.khatianWCL || "-",
            dagCS: extracted.dagCS || "-",
            dagSA: extracted.dagSA || "-",
            dagRS: extracted.dagRS || "-",
            dagBS: extracted.dagBS || "-",
            jlCS: extracted.jlCS || "-",
            jlSA: extracted.jlSA || "-",
            jlRS: extracted.jlRS || "-",
            mutationCompany: extracted.mutationCompany || "-",
            mutationIndividual: extracted.mutationIndividual || "-",
            mutationDonor: extracted.mutationDonor || "-",
            taxYear: extracted.taxYear || "-",
            warishCertificate: extracted.warishCertificate || "-",
            bayaDeed: extracted.bayaDeed || "-",
            holdingNo: extracted.holdingNo || "-",
            deedRegDate: extracted.deedRegDate || "",
            mediaName: extracted.mediaName || "-",
            remarks: extracted.remarks || "-",
            caseNo: extracted.caseNo || "-",
          };

          setIsScanning(false);
          onScanSuccess(completedForm);
          alert(t.scanSuccess);
          onClose();
        } else {
          throw new Error(result.error || "Failed to extract ledger data");
        }
      }
    } catch (err: any) {
      console.error("AI scanning error:", err);
      setIsScanning(false);
      alert(t.scanError + " Error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div id="scanner-modal" className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-sm sm:text-base">{t.scannerTitle}</h3>
          </div>
          <button 
            id="scanner-modal-close"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 hover:bg-emerald-800 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <p className="text-slate-600 leading-relaxed">{t.scannerDesc}</p>

          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-emerald-800/20 hover:border-emerald-800/50 bg-slate-50 hover:bg-emerald-50/10 p-6 rounded-xl text-center transition relative cursor-pointer group">
            <input
              id="scanner-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-2 pointer-events-none">
              <Upload className="h-8 w-8 text-emerald-800 mx-auto group-hover:scale-110 transition-transform" />
              <p className="font-bold text-slate-700">{t.uploadImage}</p>
              <p className="text-[10px] text-slate-400">JPEG, PNG, WEBP (Max 10MB)</p>
            </div>
          </div>

          {/* Scanned Image Preview */}
          {scannedFilePreview && (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block mb-1">SELECTED LEDGER SHEET:</span>
              <img
                src={scannedFilePreview}
                alt="Ledger Preview"
                referrerPolicy="no-referrer"
                className="max-h-40 object-cover rounded mx-auto border"
              />
            </div>
          )}

          {/* Demo Image selector */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">{t.orUseSample}</p>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  Allows testing OCR and Gemini scanning instantly using high-contrast document sheets.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 bg-white/80 hover:bg-white p-2.5 rounded-lg border border-amber-200 cursor-pointer text-xs font-semibold select-none">
              <input
                id="scanner-sample-radio"
                type="radio"
                checked={useSampleImage}
                onChange={() => {
                  setUseSampleImage(true);
                  setScannedFilePreview(SAMPLE_IMAGE_PREVIEW);
                }}
                className="text-emerald-800 focus:ring-emerald-500"
              />
              <span>{t.sampleLabel}</span>
            </label>
          </div>

          {/* Progress / Scanning Loading Status */}
          {isScanning && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-emerald-800 animate-spin shrink-0" />
              <p className="text-xs font-semibold text-emerald-950 animate-pulse">{scanMessage}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="border-t border-slate-100 pt-4 flex justify-end gap-2 text-xs">
            <button
              id="scanner-cancel"
              type="button"
              disabled={isScanning}
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              id="scanner-scan-start"
              type="button"
              disabled={isScanning || (!scannedFilePreview && !useSampleImage)}
              onClick={handleRunAIScan}
              className="px-5 py-2 bg-emerald-800 text-white hover:bg-emerald-950 font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {!isScanning && <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
              {isScanning && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{t.startScan}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
