import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "./firebase";
import { Mouza, LandRecord } from "./types";
import { INITIAL_MOUZAS, SEED_RECORDS } from "./initialData";

const MOUZAS_COLLECTION = "mouzas";
const RECORDS_COLLECTION = "records";

// LocalStorage Fallback Helpers
const getLocalMouzas = (): Mouza[] => {
  const data = localStorage.getItem("land_mouzas");
  if (!data) {
    localStorage.setItem("land_mouzas", JSON.stringify(INITIAL_MOUZAS));
    return INITIAL_MOUZAS;
  }
  return JSON.parse(data);
};

const saveLocalMouzas = (mouzas: Mouza[]) => {
  localStorage.setItem("land_mouzas", JSON.stringify(mouzas));
};

const getLocalRecords = (): LandRecord[] => {
  const data = localStorage.getItem("land_records");
  if (!data) {
    const defaultRecords: LandRecord[] = SEED_RECORDS.map(r => ({
      ...r,
      createdBy: "guest",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));
    localStorage.setItem("land_records", JSON.stringify(defaultRecords));
    return defaultRecords;
  }
  return JSON.parse(data);
};

const saveLocalRecords = (records: LandRecord[]) => {
  localStorage.setItem("land_records", JSON.stringify(records));
};

// Hybrid Storage Functions
export async function getMouzas(userId?: string): Promise<Mouza[]> {
  if (!userId || userId === "guest") {
    return getLocalMouzas();
  }

  try {
    const q = query(collection(db, MOUZAS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Pre-seed Firestore with default mouzas
      const loadedMouzas: Mouza[] = [];
      for (const m of INITIAL_MOUZAS) {
        const docRef = await addDoc(collection(db, MOUZAS_COLLECTION), {
          ...m,
          createdBy: userId
        });
        loadedMouzas.push({ ...m, id: docRef.id });
      }
      return loadedMouzas;
    }

    const mouzas: Mouza[] = [];
    querySnapshot.forEach((doc) => {
      mouzas.push({ id: doc.id, ...doc.data() } as Mouza);
    });
    return mouzas;
  } catch (error) {
    console.error("Firestore error loading mouzas, falling back to LocalStorage:", error);
    return getLocalMouzas();
  }
}

export async function createMouza(mouza: Omit<Mouza, "id">, userId?: string): Promise<Mouza> {
  if (!userId || userId === "guest") {
    const localMouzas = getLocalMouzas();
    const newMouza: Mouza = {
      ...mouza,
      id: "local_mouza_" + Date.now()
    };
    localMouzas.push(newMouza);
    saveLocalMouzas(localMouzas);
    return newMouza;
  }

  try {
    const docRef = await addDoc(collection(db, MOUZAS_COLLECTION), {
      ...mouza,
      createdBy: userId,
      createdAt: Date.now()
    });
    return {
      ...mouza,
      id: docRef.id
    };
  } catch (error) {
    console.error("Firestore error creating mouza, saving to local storage:", error);
    const localMouzas = getLocalMouzas();
    const newMouza: Mouza = {
      ...mouza,
      id: "local_mouza_err_" + Date.now()
    };
    localMouzas.push(newMouza);
    saveLocalMouzas(localMouzas);
    return newMouza;
  }
}

export async function getRecords(userId?: string): Promise<LandRecord[]> {
  if (!userId || userId === "guest") {
    return getLocalRecords();
  }

  try {
    const q = query(collection(db, RECORDS_COLLECTION), where("createdBy", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Pre-seed Firestore with seed records
      const loadedRecords: LandRecord[] = [];
      for (const r of SEED_RECORDS) {
        const newRecord = {
          ...r,
          createdBy: userId,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        const docRef = await addDoc(collection(db, RECORDS_COLLECTION), newRecord);
        loadedRecords.push({ ...newRecord, id: docRef.id });
      }
      return loadedRecords;
    }

    const records: LandRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as LandRecord);
    });
    // Sort by createdAt descending
    return records.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Firestore error loading records, falling back to LocalStorage:", error);
    return getLocalRecords();
  }
}

export async function createRecord(
  recordInput: Omit<LandRecord, "id" | "createdAt" | "updatedAt" | "createdBy">,
  userId?: string
): Promise<LandRecord> {
  const now = Date.now();
  const createdBy = userId || "guest";

  if (!userId || userId === "guest") {
    const localRecords = getLocalRecords();
    const newRecord: LandRecord = {
      ...recordInput,
      id: "local_record_" + now,
      createdBy,
      createdAt: now,
      updatedAt: now
    };
    localRecords.unshift(newRecord);
    saveLocalRecords(localRecords);
    return newRecord;
  }

  try {
    const newDocData = {
      ...recordInput,
      createdBy,
      createdAt: now,
      updatedAt: now
    };
    const docRef = await addDoc(collection(db, RECORDS_COLLECTION), newDocData);
    return {
      ...newDocData,
      id: docRef.id
    };
  } catch (error) {
    console.error("Firestore error creating record, saving to local storage:", error);
    const localRecords = getLocalRecords();
    const newRecord: LandRecord = {
      ...recordInput,
      id: "local_record_err_" + now,
      createdBy,
      createdAt: now,
      updatedAt: now
    };
    localRecords.unshift(newRecord);
    saveLocalRecords(localRecords);
    return newRecord;
  }
}

export async function updateRecord(
  id: string, 
  updatedFields: Partial<LandRecord>, 
  userId?: string
): Promise<void> {
  if (!userId || userId === "guest" || id.startsWith("local_") || id.startsWith("seed_")) {
    const localRecords = getLocalRecords();
    const index = localRecords.findIndex(r => r.id === id);
    if (index !== -1) {
      localRecords[index] = {
        ...localRecords[index],
        ...updatedFields,
        updatedAt: Date.now()
      };
      saveLocalRecords(localRecords);
    }
    return;
  }

  try {
    const docRef = doc(db, RECORDS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updatedFields,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Firestore error updating record, applying to local storage:", error);
    const localRecords = getLocalRecords();
    const index = localRecords.findIndex(r => r.id === id);
    if (index !== -1) {
      localRecords[index] = {
        ...localRecords[index],
        ...updatedFields,
        updatedAt: Date.now()
      };
      saveLocalRecords(localRecords);
    }
  }
}

export async function deleteRecord(id: string, userId?: string): Promise<void> {
  if (!userId || userId === "guest" || id.startsWith("local_") || id.startsWith("seed_")) {
    const localRecords = getLocalRecords();
    const filtered = localRecords.filter(r => r.id !== id);
    saveLocalRecords(filtered);
    return;
  }

  try {
    const docRef = doc(db, RECORDS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Firestore error deleting record, applying to local storage:", error);
    const localRecords = getLocalRecords();
    const filtered = localRecords.filter(r => r.id !== id);
    saveLocalRecords(filtered);
  }
}
