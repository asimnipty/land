export interface Mouza {
  id: string;
  nameBn: string;
  nameEn: string;
  districtBn: string;
  districtEn: string;
  upazilaBn: string;
  upazilaEn: string;
}

export interface LandRecord {
  id: string;
  mouzaId: string;
  serialNo: string;        // ক্রমিক নং
  fileNo: string;          // ফাইল নং
  donorName: string;       // দাতার নাম
  deedNo: string;          // দলিল নং
  deedType: string;        // দলিলের ধরন (সাব কবলা, হেবা, দানপত্র ইত্যাদি)
  landAmount: string;      // জমির পরিমান (শতক বা একর)
  
  // Khatians
  khatianCS: string;       // সি. এস খতিয়ান
  khatianSA: string;       // এস. এ খতিয়ান
  khatianRS: string;       // আর. এস খতিয়ান
  khatianBS: string;       // বি.এস. খতিয়ান
  khatianNamjari: string;  // খারিজা খতিয়ান
  khatianWCL: string;      // WCL খতিয়ান

  // Plots / Dags
  dagCS: string;           // সি এস দাগ নং
  dagSA: string;           // এস এ দাগ নং
  dagRS: string;           // আর. এস. দাগ
  dagBS: string;           // বি. এস. দাগ নং

  // JL Numbers
  jlCS: string;            // জে. এল. নং -> সি. এস.
  jlSA: string;            // জে. এল. নং -> এস. এ.
  jlRS: string;            // জে. এল. নং -> আর. এস.

  // Mutations
  mutationCompany: string;    // মিউটেশন -> কোম্পানী
  mutationIndividual: string; // মিউটেশন -> ব্যক্তি
  mutationDonor: string;      // মিউটেশন -> দাতা

  // Other details
  taxYear: string;            // খাজনার সাল
  warishCertificate: string;  // ওয়ারিস সনদ
  bayaDeed: string;           // বায়া দলিল
  holdingNo: string;          // হোল্ডিং নং
  deedRegDate: string;        // দলিল রেজি: তারিখ
  mediaName: string;          // মিডিয়ার নাম
  remarks: string;            // মন্তব্য
  caseNo: string;             // কেইস নং
  
  // Metadata
  createdBy: string;          // User ID
  createdAt: number;
  updatedAt: number;
}

export interface LandRecordInput extends Omit<LandRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> {}
