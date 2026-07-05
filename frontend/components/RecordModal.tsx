import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import { createRecord, updateRecord } from "../db";
import { translations } from "../translations";
import { LandRecord, Mouza } from "../types";

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "bn" | "en";
  mouzas: Mouza[];
  editingRecord: LandRecord | null;
  userId: string;
  onRecordSaved: () => void;
}

type TabKey = "basic" | "khatians" | "plots" | "mutation" | "registry";

export default function RecordModal({
  isOpen,
  onClose,
  lang,
  mouzas,
  editingRecord,
  userId,
  onRecordSaved,
}: RecordModalProps) {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [recordSubmitting, setRecordSubmitting] = useState(false);

  // 30 core fields
  const [mouzaId, setMouzaId] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [donorName, setDonorName] = useState("");
  const [deedNo, setDeedNo] = useState("");
  const [deedType, setDeedType] = useState("");
  const [landAmount, setLandAmount] = useState("");

  const [khatianCS, setKhatianCS] = useState("-");
  const [khatianSA, setKhatianSA] = useState("-");
  const [khatianRS, setKhatianRS] = useState("-");
  const [khatianBS, setKhatianBS] = useState("-");
  const [khatianNamjari, setKhatianNamjari] = useState("-");
  const [khatianWCL, setKhatianWCL] = useState("-");

  const [dagCS, setDagCS] = useState("-");
  const [dagSA, setDagSA] = useState("-");
  const [dagRS, setDagRS] = useState("-");
  const [dagBS, setDagBS] = useState("-");

  const [jlCS, setJlCS] = useState("-");
  const [jlSA, setJlSA] = useState("-");
  const [jlRS, setJlRS] = useState("-");

  const [mutationCompany, setMutationCompany] = useState("-");
  const [mutationIndividual, setMutationIndividual] = useState("-");
  const [mutationDonor, setMutationDonor] = useState("-");

  const [taxYear, setTaxYear] = useState("-");
  const [warishCertificate, setWarishCertificate] = useState("-");
  const [bayaDeed, setBayaDeed] = useState("-");
  const [holdingNo, setHoldingNo] = useState("-");
  const [deedRegDate, setDeedRegDate] = useState("");
  const [mediaName, setMediaName] = useState("-");
  const [remarks, setRemarks] = useState("-");
  const [caseNo, setCaseNo] = useState("-");

  // Sync state when editingRecord changes or when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("basic");
      if (editingRecord) {
        setMouzaId(editingRecord.mouzaId || "");
        setSerialNo(editingRecord.serialNo || "");
        setFileNo(editingRecord.fileNo || "");
        setDonorName(editingRecord.donorName || "");
        setDeedNo(editingRecord.deedNo || "");
        setDeedType(editingRecord.deedType || "");
        setLandAmount(editingRecord.landAmount || "");

        setKhatianCS(editingRecord.khatianCS || "-");
        setKhatianSA(editingRecord.khatianSA || "-");
        setKhatianRS(editingRecord.khatianRS || "-");
        setKhatianBS(editingRecord.khatianBS || "-");
        setKhatianNamjari(editingRecord.khatianNamjari || "-");
        setKhatianWCL(editingRecord.khatianWCL || "-");

        setDagCS(editingRecord.dagCS || "-");
        setDagSA(editingRecord.dagSA || "-");
        setDagRS(editingRecord.dagRS || "-");
        setDagBS(editingRecord.dagBS || "-");

        setJlCS(editingRecord.jlCS || "-");
        setJlSA(editingRecord.jlSA || "-");
        setJlRS(editingRecord.jlRS || "-");

        setMutationCompany(editingRecord.mutationCompany || "-");
        setMutationIndividual(editingRecord.mutationIndividual || "-");
        setMutationDonor(editingRecord.mutationDonor || "-");

        setTaxYear(editingRecord.taxYear || "-");
        setWarishCertificate(editingRecord.warishCertificate || "-");
        setBayaDeed(editingRecord.bayaDeed || "-");
        setHoldingNo(editingRecord.holdingNo || "-");
        setDeedRegDate(editingRecord.deedRegDate || "");
        setMediaName(editingRecord.mediaName || "-");
        setRemarks(editingRecord.remarks || "-");
        setCaseNo(editingRecord.caseNo || "-");
      } else {
        // Preset default empty fields
        setMouzaId(mouzas[0]?.id || "");
        setSerialNo("");
        setFileNo("");
        setDonorName("");
        setDeedNo("");
        setDeedType("সাব কবলা কোং");
        setLandAmount("");

        setKhatianCS("-");
        setKhatianSA("-");
        setKhatianRS("-");
        setKhatianBS("-");
        setKhatianNamjari("-");
        setKhatianWCL("-");

        setDagCS("-");
        setDagSA("-");
        setDagRS("-");
        setDagBS("-");

        setJlCS("-");
        setJlSA("-");
        setJlRS("-");

        setMutationCompany("-");
        setMutationIndividual("-");
        setMutationDonor("-");

        setTaxYear("-");
        setWarishCertificate("-");
        setBayaDeed("-");
        setHoldingNo("-");
        setDeedRegDate("");
        setMediaName("-");
        setRemarks("-");
        setCaseNo("-");
      }
    }
  }, [isOpen, editingRecord, mouzas]);

  if (!isOpen) return null;

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !deedNo || !landAmount || !mouzaId) {
      alert(lang === "bn" ? "দয়া করে তারকাচিহ্নিত (*) আবশ্যিক ক্ষেত্রগুলো পূরণ করুন।" : "Please fill in all mandatory fields (*).");
      return;
    }

    setRecordSubmitting(true);
    const formInput = {
      mouzaId,
      serialNo,
      fileNo,
      donorName,
      deedNo,
      deedType,
      landAmount,
      khatianCS,
      khatianSA,
      khatianRS,
      khatianBS,
      khatianNamjari,
      khatianWCL,
      dagCS,
      dagSA,
      dagRS,
      dagBS,
      jlCS,
      jlSA,
      jlRS,
      mutationCompany,
      mutationIndividual,
      mutationDonor,
      taxYear,
      warishCertificate,
      bayaDeed,
      holdingNo,
      deedRegDate,
      mediaName,
      remarks,
      caseNo,
    };

    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, formInput, userId);
      } else {
        await createRecord(formInput, userId);
      }
      onRecordSaved();
      onClose();
    } catch (err) {
      console.error("Error saving land record:", err);
    } finally {
      setRecordSubmitting(false);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "basic", label: lang === "bn" ? "প্রাথমিক ও দলিল" : "Basic & Deed" },
    { key: "khatians", label: lang === "bn" ? "খতিয়ান সমূহ" : "Khatians" },
    { key: "plots", label: lang === "bn" ? "দাগ ও জেএল" : "Plots & JL" },
    { key: "mutation", label: lang === "bn" ? "মিউটেশন ও খাজনা" : "Mutation & Tax" },
    { key: "registry", label: lang === "bn" ? "রেজিস্ট্রি ও বায়া" : "Registry & Baya" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div id="record-modal" className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">
              {editingRecord ? t.editRecord : t.addRecord}
            </h3>
          </div>
          <button 
            id="record-modal-close"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 hover:bg-emerald-800 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-4 pt-2 flex gap-1 border-b overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              id={`record-tab-btn-${tab.key}`}
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all shrink-0 cursor-pointer ${
                activeTab === tab.key 
                  ? "bg-white border-t-2 border-emerald-800 text-emerald-950 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSaveRecord} className="flex-grow overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.mouza} *</label>
                  <select
                    id="record-form-mouza"
                    value={mouzaId}
                    onChange={(e) => setMouzaId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {mouzas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {lang === "bn" ? m.nameBn : m.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.donorName} *</label>
                  <input
                    id="record-form-donor"
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="যেমন: আব্দুর রহমান মৃধা"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.deedNo} *</label>
                  <input
                    id="record-form-deedno"
                    type="text"
                    required
                    value={deedNo}
                    onChange={(e) => setDeedNo(e.target.value)}
                    placeholder="যেমন: ১৫৪৩২"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.landAmount} *</label>
                  <input
                    id="record-form-landamount"
                    type="text"
                    required
                    value={landAmount}
                    onChange={(e) => setLandAmount(e.target.value)}
                    placeholder="যেমন: ৪.৩০"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.serialNo}</label>
                  <input
                    id="record-form-serialno"
                    type="text"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    placeholder="যেমন: ১"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.fileNo}</label>
                  <input
                    id="record-form-fileno"
                    type="text"
                    value={fileNo}
                    onChange={(e) => setFileNo(e.target.value)}
                    placeholder="যেমন: ৪"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.deedType}</label>
                  <input
                    id="record-form-deedtype"
                    type="text"
                    value={deedType}
                    onChange={(e) => setDeedType(e.target.value)}
                    placeholder="যেমন: সাব কবলা"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KHATIANS */}
          {activeTab === "khatians" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.khatianCS}</label>
                <input
                  id="record-form-khatiancs"
                  type="text"
                  value={khatianCS}
                  onChange={(e) => setKhatianCS(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.khatianSA}</label>
                <input
                  id="record-form-khatiansa"
                  type="text"
                  value={khatianSA}
                  onChange={(e) => setKhatianSA(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.khatianRS}</label>
                <input
                  id="record-form-khatianrs"
                  type="text"
                  value={khatianRS}
                  onChange={(e) => setKhatianRS(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.khatianBS}</label>
                <input
                  id="record-form-khatianbs"
                  type="text"
                  value={khatianBS}
                  onChange={(e) => setKhatianBS(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.khatianNamjari}</label>
                <input
                  id="record-form-khatiannamjari"
                  type="text"
                  value={khatianNamjari}
                  onChange={(e) => setKhatianNamjari(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.khatianWCL}</label>
                <input
                  id="record-form-khatianwcl"
                  type="text"
                  value={khatianWCL}
                  onChange={(e) => setKhatianWCL(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PLOTS & JL */}
          {activeTab === "plots" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                <h4 className="font-bold text-slate-700 mb-3 block text-[10px] uppercase">দাগ নম্বরসমূহ (Plots)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.dagCS}</label>
                    <input
                      id="record-form-dagcs"
                      type="text"
                      value={dagCS}
                      onChange={(e) => setDagCS(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.dagSA}</label>
                    <input
                      id="record-form-dagsa"
                      type="text"
                      value={dagSA}
                      onChange={(e) => setDagSA(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.dagRS}</label>
                    <input
                      id="record-form-dagrs"
                      type="text"
                      value={dagRS}
                      onChange={(e) => setDagRS(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.dagBS}</label>
                    <input
                      id="record-form-dagbs"
                      type="text"
                      value={dagBS}
                      onChange={(e) => setDagBS(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                <h4 className="font-bold text-slate-700 mb-3 block text-[10px] uppercase">জে এল নম্বর (JL Numbers)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.jlCS}</label>
                    <input
                      id="record-form-jlcs"
                      type="text"
                      value={jlCS}
                      onChange={(e) => setJlCS(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.jlSA}</label>
                    <input
                      id="record-form-jlsa"
                      type="text"
                      value={jlSA}
                      onChange={(e) => setJlSA(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">{t.jlRS}</label>
                    <input
                      id="record-form-jlrs"
                      type="text"
                      value={jlRS}
                      onChange={(e) => setJlRS(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MUTATIONS & TAX REVENUE */}
          {activeTab === "mutation" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.mutationCompany}</label>
                <input
                  id="record-form-mutcompany"
                  type="text"
                  value={mutationCompany}
                  onChange={(e) => setMutationCompany(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.mutationIndividual}</label>
                <input
                  id="record-form-mutindividual"
                  type="text"
                  value={mutationIndividual}
                  onChange={(e) => setMutationIndividual(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.mutationDonor}</label>
                <input
                  id="record-form-mutdonor"
                  type="text"
                  value={mutationDonor}
                  onChange={(e) => setMutationDonor(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.taxYear}</label>
                <input
                  id="record-form-taxyear"
                  type="text"
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 5: REGISTRY & BAYA */}
          {activeTab === "registry" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.holdingNo}</label>
                  <input
                    id="record-form-holdingno"
                    type="text"
                    value={holdingNo}
                    onChange={(e) => setHoldingNo(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.deedRegDate}</label>
                  <input
                    id="record-form-deedregdate"
                    type="text"
                    value={deedRegDate}
                    onChange={(e) => setDeedRegDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.warishCertificate}</label>
                  <input
                    id="record-form-warish"
                    type="text"
                    value={warishCertificate}
                    onChange={(e) => setWarishCertificate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.mediaName}</label>
                  <input
                    id="record-form-medianame"
                    type="text"
                    value={mediaName}
                    onChange={(e) => setMediaName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.bayaDeed}</label>
                  <input
                    id="record-form-bayadeed"
                    type="text"
                    value={bayaDeed}
                    onChange={(e) => setBayaDeed(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">{t.caseNo}</label>
                  <input
                    id="record-form-caseno"
                    type="text"
                    value={caseNo}
                    onChange={(e) => setCaseNo(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">{t.remarks}</label>
                <textarea
                  id="record-form-remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Hidden Submit Button for Enter Key Handling */}
          <button type="submit" className="hidden" />
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            {activeTab === "basic" ? "* Mandatory Fields" : "Review All Tabs Before Saving"}
          </p>

          <div className="flex gap-2 text-xs">
            <button
              id="record-modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              id="record-modal-submit-btn"
              type="button"
              onClick={handleSaveRecord}
              disabled={recordSubmitting}
              className="px-5 py-2 bg-emerald-800 text-white hover:bg-emerald-950 font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
            >
              {recordSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{t.save}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
