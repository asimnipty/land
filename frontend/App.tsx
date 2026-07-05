import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  Sparkles, 
  Loader2, 
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { auth } from "./firebase";
import { Mouza, LandRecord } from "./types";
import { translations } from "./translations";
import { getMouzas, getRecords, deleteRecord } from "./db";

// Import modular components
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import SearchFilters from "./components/SearchFilters";
import LedgerTable from "./components/LedgerTable";
import BentoGrid from "./components/BentoGrid";
import MouzaModal from "./components/MouzaModal";
import RecordModal from "./components/RecordModal";
import ScannerModal from "./components/ScannerModal";
import InspectDrawer from "./components/InspectDrawer";

export default function App() {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useState<"bn" | "en">("bn");

  // Core Data state
  const [mouzas, setMouzas] = useState<Mouza[]>([]);
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Search and Filter controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMouzaId, setSelectedMouzaId] = useState("all");
  const [selectedDeedType, setSelectedDeedType] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Dialog / Modal / Drawer toggles
  const [isMouzaModalOpen, setIsMouzaModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  // Active items for editing or details inspection
  const [editingRecord, setEditingRecord] = useState<LandRecord | null>(null);
  const [inspectRecord, setInspectRecord] = useState<LandRecord | null>(null);

  const t = translations[lang];

  // Auth Listener
  useEffect(() => {
    const guestUser = localStorage.getItem("land_guest_session");
    if (guestUser) {
      setUser({ uid: "guest", email: "guest@digitalledger.gov" });
      setAuthLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "officer@digitalledger.gov"
          });
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  // Fetch Mouzas and Land Records when user logs in (or guest session starts)
  useEffect(() => {
    if (user) {
      loadCoreData();
    }
  }, [user]);

  const loadCoreData = async () => {
    if (!user) return;
    setRecordsLoading(true);
    try {
      const fetchedMouzas = await getMouzas(user.uid);
      setMouzas(fetchedMouzas);

      const fetchedRecords = await getRecords(user.uid);
      setRecords(fetchedRecords);
    } catch (err) {
      console.error("Error fetching land records:", err);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
    localStorage.removeItem("land_guest_session");
    setUser(null);
    setMouzas([]);
    setRecords([]);
  };

  const handleDeleteRecord = async (id: string) => {
    const confirmed = window.confirm(t.deleteConfirm);
    if (!confirmed || !user) return;
    try {
      await deleteRecord(id, user.uid);
      await loadCoreData();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  // Unique deed types for filtering dropdown list
  const deedTypesList: string[] = Array.from(
    new Set(records.map((r) => r.deedType).filter(Boolean))
  );

  // Multi-criteria filtering: searching across names, deeds, plots, khatians, and file numbers
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      [
        r.donorName,
        r.deedNo,
        r.fileNo,
        r.serialNo,
        r.khatianCS,
        r.khatianSA,
        r.khatianRS,
        r.khatianBS,
        r.khatianNamjari,
        r.khatianWCL,
        r.dagCS,
        r.dagSA,
        r.dagRS,
        r.dagBS,
      ]
        .map((field) => (field || "").toLowerCase())
        .some((val) => val.includes(searchTerm.toLowerCase()));

    const matchesMouza = selectedMouzaId === "all" || r.mouzaId === selectedMouzaId;
    const matchesDeed = selectedDeedType === "all" || r.deedType === selectedDeedType;

    return matchesSearch && matchesMouza && matchesDeed;
  });

  // Math totals calculation
  const totalLandDecimal = filteredRecords.reduce((sum, r) => {
    const val = parseFloat(r.landAmount) || 0;
    return sum + val;
  }, 0);

  const handleOpenEditRecord = (record: LandRecord) => {
    setEditingRecord(record);
    setIsRecordModalOpen(true);
  };

  const handleOpenAddRecord = () => {
    setEditingRecord(null);
    setIsRecordModalOpen(true);
  };

  const handleOpenInspect = (record: LandRecord) => {
    setInspectRecord(record);
    setIsInspectOpen(true);
  };

  const handleScanSuccess = (extractedForm: any) => {
    // Populate form data & open Record Modal
    setEditingRecord(extractedForm);
    setIsRecordModalOpen(true);
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-800 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 animate-pulse">
            {lang === "bn" ? "প্রবেশদ্বার লোড হচ্ছে..." : "Loading Register Portal..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        lang={lang}
        setLang={setLang}
        onLogin={(loggedUser) => setUser(loggedUser)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-12 relative overflow-x-hidden">
      {/* Top Banner and Header */}
      <Header
        lang={lang}
        setLang={setLang}
        user={user}
        onLogout={handleLogout}
      />

      {/* Guest Mode Banner warning */}
      {user.uid === "guest" && (
        <div className="bg-amber-500/10 text-amber-900 border-b border-amber-500/20 px-4 py-2 text-xs sm:text-sm text-center font-semibold flex items-center justify-center gap-1.5 print:hidden">
          <Info className="h-4.5 w-4.5 text-amber-700 shrink-0" />
          <span>{t.guestWarning}</span>
        </div>
      )}

      {/* Main Content Stage */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
        {/* Core Stats Overview */}
        <DashboardStats
          lang={lang}
          filteredRecords={filteredRecords}
          totalLandDecimal={totalLandDecimal}
          mouzas={mouzas}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* Unified Search & Filters bar */}
        <SearchFilters
          lang={lang}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMouzaId={selectedMouzaId}
          setSelectedMouzaId={setSelectedMouzaId}
          selectedDeedType={selectedDeedType}
          setSelectedDeedType={setSelectedDeedType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          mouzas={mouzas}
          deedTypes={deedTypesList}
          onOpenRecordModal={handleOpenAddRecord}
          onOpenMouzaModal={() => setIsMouzaModalOpen(true)}
          onPrintReport={handlePrintReport}
        />

        {/* Registry Records list / Main Book section */}
        {recordsLoading ? (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-800 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">{t.loading}</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-700 text-sm sm:text-base">{t.noRecords}</h3>
            <p className="text-xs text-slate-500">{t.noRecordsDesc}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table or Bento Cards List depending on toggle state */}
            {viewMode === "table" ? (
              <LedgerTable
                lang={lang}
                records={filteredRecords}
                mouzas={mouzas}
                onInspect={handleOpenInspect}
                onEdit={handleOpenEditRecord}
                onDelete={handleDeleteRecord}
              />
            ) : (
              <BentoGrid
                lang={lang}
                records={filteredRecords}
                mouzas={mouzas}
                onInspect={handleOpenInspect}
                onEdit={handleOpenEditRecord}
                onDelete={handleDeleteRecord}
              />
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      
      {/* 1. Add Mouza Modal */}
      <MouzaModal
        isOpen={isMouzaModalOpen}
        onClose={() => setIsMouzaModalOpen(false)}
        lang={lang}
        userId={user.uid}
        onMouzaCreated={async (newMouza) => {
          await loadCoreData();
          // Auto-select the newly created Mouza to filter instantly
          setSelectedMouzaId(newMouza.id);
        }}
      />

      {/* 2. Add / Edit Record Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        lang={lang}
        mouzas={mouzas}
        editingRecord={editingRecord}
        userId={user.uid}
        onRecordSaved={loadCoreData}
      />

      {/* 3. AI Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        lang={lang}
        mouzas={mouzas}
        selectedMouzaId={selectedMouzaId}
        onScanSuccess={handleScanSuccess}
      />

      {/* 4. Details Inspection side drawer */}
      <InspectDrawer
        isOpen={isInspectOpen}
        onClose={() => {
          setIsInspectOpen(false);
          setInspectRecord(null);
        }}
        record={inspectRecord}
        lang={lang}
        mouzas={mouzas}
      />
    </div>
  );
}
