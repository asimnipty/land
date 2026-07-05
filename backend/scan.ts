import { GoogleGenAI, Type } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function scanLedger(imageBase64: string): Promise<any> {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. Please configure GEMINI_API_KEY in Settings > Secrets.");
  }

  // Strip base64 headers if present (e.g. "data:image/jpeg;base64,")
  const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Data,
    },
  };

  const textPart = {
    text: `Analyze this land record register sheet (written in Bengali). 
Extract the values from the rows/table into the structured format. 
Please attempt to transcribe Bengali characters accurately. For numbers, if they are written in Bengali digits (like ১, ২, ৩, ৪.৩০), convert them to standard English digits (like 1, 2, 3, 4.30) to make digital calculations possible. Keep text fields in Bengali if they are written in Bengali (e.g. S. M. Showkat Ali as এস এম শওকত আলী).
Provide the extracted data for the land record. If there are multiple rows, extract the primary or first row's information.`,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          serialNo: { type: Type.STRING, description: "ক্রমিক নং - Serial number of record, e.g. 1" },
          fileNo: { type: Type.STRING, description: "ফাইল নং - File number, e.g. 1" },
          donorName: { type: Type.STRING, description: "দাতার নাম - Donor/grantor name, e.g. এস এম শওকত আলী" },
          deedNo: { type: Type.STRING, description: "দলিল নং - Deed/Document number, e.g. 29810" },
          deedType: { type: Type.STRING, description: "দলিলের ধরন - Type of deed, e.g. সাব কবলা কোং" },
          landAmount: { type: Type.STRING, description: "জমির পরিমান - Land amount in decimal, e.g. 4.30" },
          khatianCS: { type: Type.STRING, description: "সি. এস খতিয়ান, or '-' if empty" },
          khatianSA: { type: Type.STRING, description: "এস. এ খতিয়ান" },
          khatianRS: { type: Type.STRING, description: "আর. এস খতিয়ান" },
          khatianBS: { type: Type.STRING, description: "বি.এস. খতিয়ান" },
          khatianNamjari: { type: Type.STRING, description: "খারিজা খতিয়ান" },
          khatianWCL: { type: Type.STRING, description: "WCL খতিয়ান" },
          dagCS: { type: Type.STRING, description: "সি এস দাগ নং" },
          dagSA: { type: Type.STRING, description: "এস এ দাগ নং" },
          dagRS: { type: Type.STRING, description: "আর. এস. দাগ" },
          dagBS: { type: Type.STRING, description: "বি. এস. দাগ নং" },
          jlCS: { type: Type.STRING, description: "জে. এল. নং -> সি. এস." },
          jlSA: { type: Type.STRING, description: "জে. এল. নং -> এস. এ." },
          jlRS: { type: Type.STRING, description: "জে. এল. নং -> আর. এস." },
          mutationCompany: { type: Type.STRING, description: "মিউটেশন -> কোম্পানী" },
          mutationIndividual: { type: Type.STRING, description: "মিউটেশন -> ব্যক্তি" },
          mutationDonor: { type: Type.STRING, description: "মিউটেশন -> দাতা" },
          taxYear: { type: Type.STRING, description: "খাজনার সাল, e.g. ২০২২-২৩" },
          warishCertificate: { type: Type.STRING, description: "ওয়ারিস সনদ, e.g. ০২ টি" },
          bayaDeed: { type: Type.STRING, description: "বায়া দলিল" },
          holdingNo: { type: Type.STRING, description: "হোল্ডিং নং" },
          deedRegDate: { type: Type.STRING, description: "দলিল রেজি: তারিখ, format DD/MM/YYYY or similar" },
          mediaName: { type: Type.STRING, description: "মিডিয়ার নাম" },
          remarks: { type: Type.STRING, description: "মন্তব্য, e.g. মূল দলিল" },
          caseNo: { type: Type.STRING, description: "কেইস নং" }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response text received from Gemini.");
  }

  return JSON.parse(response.text);
}

export function isGeminiInitialized(): boolean {
  return !!ai;
}
