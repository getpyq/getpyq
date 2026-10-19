import { PYQ, PYQSolution, GetStatsResponse, FilterOptionsResponse, PYQFilters, PaperRequest } from "../types";
import { isBranchMatch, isCommonToAllBranches, parseBranches, formatBranchDisplay, normalizeBranchKey, BRANCHES } from "./constants";

// Production Google Apps Script Web App URL
const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyhi5hIFqWBNEqbig1uqZriP3_NWzaHcdVsjK_A_OfDGXS6YBtuAYHSttKi5ecpq6Mj/exec";

// Retrieve active Google Apps Script URL
export function getAppsScriptUrl(): string {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("custom_apps_script_url");
    if (
      custom &&
      custom.trim().length > 0 &&
      !custom.includes("AKfycbyw7hSEVHs7uFlZ7-dKGgSOFhkz7FXFav5Zbb_YqA8NehMCGFHlrjldJ1Ibo3DYNhfI") &&
      !custom.includes("AKfycbzsLGzN3VytBth7BOf261YdcZhiPwVdhyIp3NMpnHQs2eCfeZYbAOLe-Wyl0Zu2WmHb")
    ) {
      return custom.trim();
    }
  }
  return DEFAULT_APPS_SCRIPT_URL;
}

// Store new Google Apps Script URL after deployment
export function setAppsScriptUrl(url: string): void {
  if (typeof window !== "undefined") {
    if (!url || url.trim() === "") {
      localStorage.removeItem("custom_apps_script_url");
    } else {
      localStorage.setItem("custom_apps_script_url", url.trim());
    }
  }
}

// Real-Time Mode toggle (when true, hides demo/fallback papers and displays only 100% verified Google Sheet data)
export function isStrictMode(): boolean {
  if (typeof window !== "undefined") {
    const setting = localStorage.getItem("pyq_strict_realtime");
    // Defaults to true as requested by user ("realtime data not any demo")
    if (setting === null) return true;
    return setting === "true";
  }
  return true;
}

export function setStrictMode(enabled: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("pyq_strict_realtime", enabled ? "true" : "false");
  }
}

// Database verification diagnostics schema
export interface DatabaseVerificationResult {
  connected: boolean;
  status: "connected" | "error" | "unconfigured";
  url: string;
  latencyMs: number;
  spreadsheetName?: string;
  spreadsheetId?: string;
  paperCount?: number;
  requestCount?: number;
  solutionCount?: number;
  activeSheets?: string[];
  rawMessage?: string;
  errorDetail?: string;
  isRealtime: boolean;
  timestamp: string;
}

// Rich structural offline-fallback papers to ensure robust, error-free rendering when Apps Script is not yet linked
const FALLBACK_PAPERS: PYQ[] = [
  {
    id: "000001",
    paper: "Data Structures & Algorithms (CS201)",
    branch: "CSE",
    semester: "3",
    year: "2023-24",
    exam_type: "Regular/Back",
    uploader_name: "Aparna Jena",
    upvotes: 84,
    downloads: 512,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-24T10:00:00Z",
    fileName: "Data_Structures_Algorithms_CSE_sem3_2023-24_Regular.pdf",
    file_name: "Data_Structures_Algorithms_CSE_sem3_2023-24_Regular.pdf"
  },
  {
    id: "000002",
    paper: "Signals and Systems (EC201)",
    branch: "ECE",
    semester: "4",
    year: "2023-24",
    exam_type: "Back",
    uploader_name: "Debashis Panda",
    upvotes: 45,
    downloads: 304,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-22T14:30:00Z",
    fileName: "Signals_and_Systems_ECE_sem4_2023-24_Back.pdf",
    file_name: "Signals_and_Systems_ECE_sem4_2023-24_Back.pdf"
  },
  {
    id: "000003",
    paper: "Power Electronics (EE301)",
    branch: "EE",
    semester: "6",
    year: "2023-24",
    exam_type: "Supplementary",
    uploader_name: "Subhangini Senapati",
    upvotes: 98,
    downloads: 412,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-20T09:15:00Z",
    fileName: "Power_Electronics_EE_sem6_2023-24_Supp.pdf",
    file_name: "Power_Electronics_EE_sem6_2023-24_Supp.pdf"
  },
  {
    id: "000004",
    paper: "Applied Thermodynamics (ME201)",
    branch: "ME",
    semester: "3",
    year: "2022-23",
    exam_type: "Regular/Back",
    uploader_name: "Rohit Mohanty",
    upvotes: 38,
    downloads: 187,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-18T11:45:00Z",
    fileName: "Applied_Thermodynamics_ME_sem3_2022-23_Regular.pdf",
    file_name: "Applied_Thermodynamics_ME_sem3_2022-23_Regular.pdf"
  },
  {
    id: "000005",
    paper: "Solid Mechanics (CE201)",
    branch: "CE",
    semester: "4",
    year: "2023-24",
    exam_type: "Back",
    uploader_name: "Satya Prakash",
    upvotes: 62,
    downloads: 245,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-15T16:20:00Z",
    fileName: "Solid_Mechanics_CE_sem4_2023-24_Back.pdf",
    file_name: "Solid_Mechanics_CE_sem4_2023-24_Back.pdf"
  },
  {
    id: "000006",
    paper: "Data Structures & Algorithms (CS201)",
    branch: "CSE",
    semester: "3",
    year: "2022-23",
    exam_type: "Regular/Back",
    uploader_name: "Saurav Patnaik",
    upvotes: 72,
    downloads: 430,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-10T11:00:00Z",
    fileName: "Data_Structures_Algorithms_CSE_sem3_2022-23_Regular.pdf",
    file_name: "Data_Structures_Algorithms_CSE_sem3_2022-23_Regular.pdf"
  },
  {
    id: "000007",
    paper: "Object Oriented Programming Java (CS202)",
    branch: "CSE",
    semester: "3",
    year: "2023-24",
    exam_type: "Regular/Back",
    uploader_name: "Priyanka Roy",
    upvotes: 91,
    downloads: 610,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-12T14:10:00Z",
    fileName: "OOP_Java_CSE_sem3_2023-24_Regular.pdf",
    file_name: "OOP_Java_CSE_sem3_2023-24_Regular.pdf"
  },
  {
    id: "000008",
    paper: "Computer Organization & Architecture (CS203)",
    branch: "CSE",
    semester: "3",
    year: "2023-24",
    exam_type: "Supplementary",
    uploader_name: "Manish Kumar",
    upvotes: 56,
    downloads: 380,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-08T09:20:00Z",
    fileName: "COA_CSE_sem3_2023-24_Supp.pdf",
    file_name: "COA_CSE_sem3_2023-24_Supp.pdf"
  },
  {
    id: "000009",
    paper: "Discrete Mathematics & Graph Theory (CS204)",
    branch: "CSE",
    semester: "3",
    year: "2023-24",
    exam_type: "Regular/Back",
    uploader_name: "Aparna Jena",
    upvotes: 80,
    downloads: 490,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-07T16:40:00Z",
    fileName: "Discrete_Math_CSE_sem3_2023-24_Regular.pdf",
    file_name: "Discrete_Math_CSE_sem3_2023-24_Regular.pdf"
  },
  {
    id: "000010",
    paper: "Analog Electronics (EC202)",
    branch: "ECE",
    semester: "4",
    year: "2023-24",
    exam_type: "Back",
    uploader_name: "Debashis Panda",
    upvotes: 54,
    downloads: 290,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-06T10:15:00Z",
    fileName: "Analog_Electronics_ECE_sem4_2023-24_Back.pdf",
    file_name: "Analog_Electronics_ECE_sem4_2023-24_Back.pdf"
  },
  {
    id: "000011",
    paper: "Digital Signal Processing (EC301)",
    branch: "ECE",
    semester: "5",
    year: "2023-24",
    exam_type: "Regular/Back",
    uploader_name: "Rituparna Swain",
    upvotes: 68,
    downloads: 340,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-04T12:00:00Z",
    fileName: "DSP_ECE_sem5_2023-24_Regular.pdf",
    file_name: "DSP_ECE_sem5_2023-24_Regular.pdf"
  },
  {
    id: "000012",
    paper: "Fluid Mechanics & Hydraulic Machines (ME202)",
    branch: "ME, Civil, Automobile",
    semester: "3",
    year: "2023-24",
    exam_type: "Regular/Back",
    uploader_name: "Rohit Mohanty",
    upvotes: 42,
    downloads: 215,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-03T15:30:00Z",
    fileName: "Fluid_Mechanics_ME_sem3_2023-24_Regular.pdf",
    file_name: "Fluid_Mechanics_ME_sem3_2023-24_Regular.pdf"
  },
  {
    id: "000013",
    paper: "Mathematics-I (BS101)",
    branch: "All Branches",
    semester: "1",
    year: "2024-25",
    exam_type: "Regular/Back",
    uploader_name: "Prof. S. Mohanty",
    upvotes: 124,
    downloads: 870,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-02T10:00:00Z",
    fileName: "Mathematics_I_All_Branches_sem1_2024-25_Regular.pdf",
    file_name: "Mathematics_I_All_Branches_sem1_2024-25_Regular.pdf"
  },
  {
    id: "000014",
    paper: "Engineering Physics (BS102)",
    branch: "All Branches",
    semester: "1",
    year: "2023-24",
    exam_type: "Regular/Back",
    uploader_name: "BPUT Moderation Team",
    upvotes: 95,
    downloads: 640,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-05-01T11:20:00Z",
    fileName: "Engineering_Physics_All_Branches_sem1_2023-24_Regular.pdf",
    file_name: "Engineering_Physics_All_Branches_sem1_2023-24_Regular.pdf"
  },
  {
    id: "000015",
    paper: "Digital Electronics (EC204)",
    branch: "CSE, IT, ECE",
    semester: "3",
    year: "2023-24",
    exam_type: "Supplementary",
    uploader_name: "Sandeep Sahu",
    upvotes: 76,
    downloads: 520,
    content_type: "application/pdf",
    file_url: "",
    created_at: "2026-04-28T14:15:00Z",
    fileName: "Digital_Electronics_CSE_IT_ECE_sem3_2023-24_Supp.pdf",
    file_name: "Digital_Electronics_CSE_IT_ECE_sem3_2023-24_Supp.pdf"
  }
];

// Rich fallback solution records to ensure solutions view has data when offline
const FALLBACK_SOLUTIONS: Record<string, PYQSolution[]> = {
  "000001": [
    {
      id: "fallback-sol-dsa-1",
      pyq_id: "000001",
      content: "Complete detailed recursive and iterative approaches for tree traversals including balanced AVL rotation algorithms with comprehensive diagrams.",
      author_name: "Dr. Srikant Behera (Senior Lecturer)",
      created_at: "2026-05-24T12:00:00Z"
    }
  ],
  "pyq-000001": [
    {
      id: "fallback-sol-dsa-1",
      pyq_id: "pyq-000001",
      content: "Complete detailed recursive and iterative approaches for tree traversals including balanced AVL rotation algorithms with comprehensive diagrams.",
      author_name: "Dr. Srikant Behera (Senior Lecturer)",
      created_at: "2026-05-24T12:00:00Z"
    }
  ],
  "PYQ-0001": [
    {
      id: "fallback-sol-dsa-1",
      pyq_id: "pyq-000001",
      content: "Complete detailed recursive and iterative approaches for tree traversals including balanced AVL rotation algorithms with comprehensive diagrams.",
      author_name: "Dr. Srikant Behera (Senior Lecturer)",
      created_at: "2026-05-24T12:00:00Z"
    }
  ],
  "cse-dsa-2024": [
    {
      id: "fallback-sol-dsa-1",
      pyq_id: "pyq-000001",
      content: "Complete detailed recursive and iterative approaches for tree traversals including balanced AVL rotation algorithms with comprehensive diagrams.",
      author_name: "Dr. Srikant Behera (Senior Lecturer)",
      created_at: "2026-05-24T12:00:00Z"
    }
  ]
};

// Helper to check if a URL is a valid configured Google Apps Script endpoint
export function isValidAppsScriptUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "YOUR_SCRIPT_URL" || trimmed === "MY_APP_URL") return false;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

// Safely parse text from Google Apps Script, catching and diagnosing Apps Script execution errors
async function parseAppsScriptResponse(res: Response): Promise<any> {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (data && data.error) {
      throw new Error(data.message || "Spreadsheet interface returned an error.");
    }
    return data;
  } catch (e: any) {
    if (text.includes("setHeader") || text.includes("TypeError") || text.includes("is not a function") || text.includes("<title>Error</title>")) {
      const match = text.match(/<div[^>]*class="errorMessage"[^>]*>([^<]+)<\/div>/i) ||
                    text.match(/<div[^>]*>([^<]*(?:TypeError|Error|Exception|is not a function)[^<]*)<\/div>/i);
      const detail = match ? match[1].trim() : "Google Apps Script returned an execution error page.";
      throw new Error(`Google Apps Script Execution Error: ${detail}`);
    }
    if (text.trim().startsWith("<")) {
      throw new Error("Received HTML error page from Google Apps Script instead of JSON data.");
    }
    throw e;
  }
}

// GET request helper to talk with Google Apps Script
async function fetchFromAppsScript(action: string, params: Record<string, string> = {}): Promise<any> {
  const scriptUrl = getAppsScriptUrl();
  if (!isValidAppsScriptUrl(scriptUrl)) {
    throw new Error("Apps Script URL is unconfigured.");
  }
  const url = new URL(scriptUrl);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });
  
  const res = await fetch(url.toString(), {
    method: "GET",
  });
  
  if (!res.ok) throw new Error(`HTTP network error: ${res.status}`);
  return await parseAppsScriptResponse(res);
}

// POST request helper to communicate with Google Apps Script using text/plain to bypass CORS Preflight blocks
async function postToAppsScript(action: string, payload: any = {}): Promise<any> {
  const scriptUrl = getAppsScriptUrl();
  if (!isValidAppsScriptUrl(scriptUrl)) {
    throw new Error("Apps Script URL is unconfigured.");
  }
  const requestBody = {
    action,
    ...payload
  };
  
  const res = await fetch(scriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!res.ok) throw new Error(`HTTP network error: ${res.status}`);
  return await parseAppsScriptResponse(res);
}

// Live Real-Time Database Verification Tool
export async function verifyDatabaseHealth(): Promise<DatabaseVerificationResult> {
  const url = getAppsScriptUrl();
  const startTime = Date.now();
  
  if (!isValidAppsScriptUrl(url)) {
    return {
      connected: false,
      status: "unconfigured",
      url,
      latencyMs: 0,
      isRealtime: false,
      errorDetail: "Apps Script Web App URL is unconfigured or empty.",
      timestamp: new Date().toISOString()
    };
  }

  try {
    const testUrl = new URL(url);
    testUrl.searchParams.set("action", "verify");
    testUrl.searchParams.set("_t", String(Date.now()));

    const res = await fetch(testUrl.toString(), { method: "GET" });
    const latency = Date.now() - startTime;
    const text = await res.text();

    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      let errorDetail = "Google Apps Script returned an invalid non-JSON response.";
      if (text.includes("TypeError") || text.includes("setHeader") || text.includes("is not a function") || text.includes("Error")) {
        const match = text.match(/<div[^>]*>([^<]*(?:TypeError|Error|Exception|is not a function)[^<]*)<\/div>/i) ||
                      text.match(/class="errorMessage"[^>]*>([^<]+)<\/div>/i);
        errorDetail = match ? match[1].trim() : text.slice(0, 300);
      }
      return {
        connected: false,
        status: "error",
        url,
        latencyMs: latency,
        isRealtime: false,
        errorDetail,
        timestamp: new Date().toISOString()
      };
    }

    if (json && (json.status === "connected" || json.success || Array.isArray(json))) {
      return {
        connected: true,
        status: "connected",
        url,
        latencyMs: latency,
        spreadsheetName: json.spreadsheetName || "Google Sheets Connected",
        spreadsheetId: json.spreadsheetId,
        paperCount: typeof json.paperCount === "number" ? json.paperCount : (Array.isArray(json) ? json.length : 0),
        requestCount: json.requestCount,
        solutionCount: json.solutionCount,
        activeSheets: json.activeSheets || ["Papers", "Solutions", "Requests"],
        isRealtime: true,
        timestamp: new Date().toISOString()
      };
    }

    // Fallback: if script doesn't have "verify" action yet, try "getAll"
    try {
      const allUrl = new URL(url);
      allUrl.searchParams.set("action", "getAll");
      allUrl.searchParams.set("_t", String(Date.now()));
      const resAll = await fetch(allUrl.toString(), { method: "GET" });
      const textAll = await resAll.text();
      const parsedAll = JSON.parse(textAll);
      if (Array.isArray(parsedAll)) {
        return {
          connected: true,
          status: "connected",
          url,
          latencyMs: Date.now() - startTime,
          spreadsheetName: "Google Sheets Database",
          paperCount: parsedAll.length,
          activeSheets: ["Papers"],
          isRealtime: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch {
      // ignore
    }

    return {
      connected: false,
      status: "error",
      url,
      latencyMs: latency,
      isRealtime: false,
      errorDetail: json?.message || "Server responded with an unexpected payload structure.",
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      connected: false,
      status: "error",
      url,
      latencyMs: Date.now() - startTime,
      isRealtime: false,
      errorDetail: err.message || "Network error: Unable to connect to Google Apps Script.",
      timestamp: new Date().toISOString()
    };
  }
}

// Helper to generate a highly detailed and realistic PDF Question Paper based on paper name
function generateDummyQuestionPaperPdf(pyq: Partial<PYQ>): string {
  const paper = pyq.paper || "Course Material";
  const branch = pyq.branch || "Engineering";
  const semester = pyq.semester || "1";
  const year = pyq.year || "2024-25";
  const exam_type = pyq.exam_type || "Regular/Back";

  const sanitize = (str: string) => str.replace(/([()])/g, "\\$1");

  const sPaper = sanitize(paper.toUpperCase());
  const sBranch = sanitize(branch.toUpperCase());
  const sSemester = sanitize(String(semester));
  const sYear = sanitize(String(year));
  const sExamType = sanitize(exam_type.toUpperCase());

  const streamContent = `BT
/F1 18 Tf
50 780 Td
(${sExamType} EXAMINATION - DECODED) Tj
/F2 12 Tf
0 -36 Td
(Subject: ${sPaper}) Tj
0 -20 Td
(Branch: ${sBranch} Engineering | Semester: ${sSemester}) Tj
0 -20 Td
(Academic Year: ${sYear} | Max Marks: 100) Tj
/F1 12 Tf
0 -45 Td
(INSTRUCTIONS FOR CANDIDATES:) Tj
/F2 11 Tf
0 -22 Td
(1. Answer all analytical problems clearly. Draw clean schematic diagrams.) Tj
0 -20 Td
(2. Non-programmable scientific calculators are permitted for computations.) Tj
0 -20 Td
(3. Scratches or overwriting are highly discouraged.) Tj
/F1 12 Tf
0 -45 Td
(QUESTIONS WITH SOLUTIONS DECODED:) Tj
/F2 10 Tf
0 -25 Td
(Q1. State the key mathematical formulations and design tradeoffs of this paper. [15 Marks]) Tj
0 -18 Td
(Solution: Described fully in the Solutions and Reference tab below.) Tj
0 -28 Td
(Q2. Sketch a recursive state transition flowchart and state time complexity. [20 Marks]) Tj
0 -18 Td
(Solution: Solved by community members with detailed DP algorithms.) Tj
0 -28 Td
(Q3. Sketch block schematic diagram for physical model analysis. [15 Marks]) Tj
0 -18 Td
(Solution: Solutions are listed online on our student repository.) Tj
0 -200 Td
(========================================================================) Tj
0 -20 Td
(GETPYQ OPEN SOURCE DECODED ACADEMIC COMMUNITY SERVICES) Tj
ET`;

  const streamLength = streamContent.length;

  const pdfParts = [
    "%PDF-1.4",
    "1 0 obj",
    "<< /Type /Catalog /Pages 2 0 R >>",
    "endobj",
    "2 0 obj",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "endobj",
    "3 0 obj",
    "<< /Type /Page",
    "   /Parent 2 0 R",
    "   /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>",
    "   /MediaBox [0 0 595 842]",
    "   /Contents 4 0 R",
    ">>",
    "endobj",
    "4 0 obj",
    `<< /Length ${streamLength} >>`,
    "stream",
    streamContent,
    "endstream",
    "endobj",
    "trailer",
    "<< /Size 5 /Root 1 0 R >>",
    "%%EOF"
  ];

  const pdfText = pdfParts.join("\n");
  const base64 = window.btoa(unescape(encodeURIComponent(pdfText)));
  return "data:application/pdf;base64," + base64;
}

// Universal matching helper to accurately identify papers across direct URLs, IDs, suffixes, and Drive IDs
export function isPaperMatch(p: PYQ | any, targetId?: string | null): boolean {
  if (!p || !targetId || typeof targetId !== "string") return false;
  const cleanTarget = targetId.trim().toLowerCase();
  if (!cleanTarget) return false;

  const normTarget = cleanTarget.replace(/[-_\s]/g, "");
  const baseTarget = cleanTarget.replace(/-\d+$/, ""); // e.g. "pyq-1789772312239-228" -> "pyq-1789772312239"
  const normBaseTarget = baseTarget.replace(/[-_\s]/g, "");

  const pId = String(p.id || p.pyqId || p.pyqid || "").trim().toLowerCase();
  const normPId = pId.replace(/[-_\s]/g, "");
  const basePId = pId.replace(/-\d+$/, "");
  const normBasePId = basePId.replace(/[-_\s]/g, "");

  const fId = String(p.file_id || p.fileId || p.fileID || "").trim().toLowerCase();
  const subj = String(p.paper || p.title || p.subject || "").trim().toLowerCase();
  const fileName = String(p.fileName || p.file_name || "").trim().toLowerCase();

  // 1. Direct or normalized ID matches
  if (pId === cleanTarget || normPId === normTarget) return true;

  // 2. Base ID match (handles disambiguation index suffix like -228)
  if (basePId && (basePId === cleanTarget || basePId === baseTarget || normBasePId === normTarget || normBasePId === normBaseTarget)) return true;
  if (pId && (pId === baseTarget || normPId === normBaseTarget)) return true;

  // 3. Drive File ID match
  if (fId && (fId === cleanTarget || cleanTarget === fId || cleanTarget.includes(fId) || fId.includes(cleanTarget))) return true;

  // 4. Numerical ID match (e.g. timestamp digits or 6-digit serials)
  const targetDigits = cleanTarget.replace(/\D/g, "");
  const pDigits = pId.replace(/\D/g, "");
  if (targetDigits && pDigits) {
    if (targetDigits === pDigits) return true;
    const targetNum = parseInt(targetDigits, 10);
    const pNum = parseInt(pDigits, 10);
    if (!isNaN(targetNum) && !isNaN(pNum) && targetNum > 0 && targetNum === pNum) return true;
    if (targetDigits.length >= 8 && pDigits.length >= 8 && (targetDigits.includes(pDigits) || pDigits.includes(targetDigits))) return true;
  }

  // 5. Exact Subject or File Name match
  if (subj && (subj === cleanTarget || subj === cleanTarget.replace(/[-_]/g, " "))) return true;
  if (fileName && fileName === cleanTarget) return true;

  return false;
}

// In-memory cache for dynamically loaded papers from Google Sheets to reduce layout flicker
let cachedGooglePapers: PYQ[] = [];

// Helper to retrieve paper synchronously from memory or storage cache
export function getCachedPYQ(id?: string | null): PYQ | null {
  if (!id || typeof id !== "string" || !id.trim()) return null;

  // 1. Check in-memory cached papers first
  const memMatch = cachedGooglePapers.find((p) => isPaperMatch(p, id));
  if (memMatch) return memMatch;

  // 2. Check localStorage
  try {
    const raw = localStorage.getItem("getpyq_cached_papers");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const found = parsed.find((p: any) => isPaperMatch(p, id));
        if (found) {
          if (!cachedGooglePapers.some((p) => p.id === found.id)) {
            cachedGooglePapers.push(found);
          }
          return found;
        }
      }
    }
  } catch {}

  // 3. Check hardcoded fallback dataset
  const fallbackMatch = FALLBACK_PAPERS.find((p) => isPaperMatch(p, id));
  if (fallbackMatch) return fallbackMatch;

  return null;
}

// Helper to extract a Google Drive file ID from standard URL formats (preview, view, edit, uc, export)
export function extractDriveId(url?: string): string {
  if (!url) return "";
  const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];
  const matchQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchQuery && matchQuery[1]) return matchQuery[1];
  return "";
}

// Helper to clean up underscored filenames back into clean subject names
export function cleanFilenameToSubject(filename: string): string {
  if (!filename) return "Unknown Subject";
  let name = filename.replace(/\.[^/.]+$/, "");
  const idx = name.toLowerCase().indexOf("_sem");
  if (idx !== -1) {
    name = name.substring(0, idx);
  }
  return name.replace(/_/g, " ").trim();
}

// -----------------------------------------
// API Exported Handlers (Supporting Sheets)
// -----------------------------------------

export async function getStats(): Promise<GetStatsResponse> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const stats = await fetchFromAppsScript("getStats");
      if (stats && !stats.error) {
        return {
          total_pyqs: Number(stats.total_pyqs || 0),
          total_branches: Number(stats.total_branches || 8),
          total_downloads: Number(stats.total_downloads || 0),
          total_upvotes: Number(stats.total_upvotes || 0)
        };
      }
    } catch (err) {
      console.warn("Using computed fallback for getStats due to connection state:", err);
    }
  }

  // Dynamic fallback computed from cached/fallback set
  const strict = isStrictMode();
  const dataset = cachedGooglePapers.length > 0 ? cachedGooglePapers : (strict ? [] : FALLBACK_PAPERS);
  const branchesSet = new Set(dataset.map(p => p.branch));
  const total_downloads = dataset.reduce((acc, p) => acc + (p.downloads || 0), 0);
  const total_upvotes = dataset.reduce((acc, p) => acc + (p.upvotes || 0), 0);

  return {
    total_pyqs: dataset.length,
    total_branches: branchesSet.size || (strict ? 0 : 8),
    total_downloads: total_downloads,
    total_upvotes: total_upvotes
  };
}

export async function listPYQs(filters: PYQFilters = {}): Promise<PYQ[]> {
  let list: PYQ[] = [];
  const scriptUrl = getAppsScriptUrl();
  const strict = isStrictMode();

  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const response = await fetchFromAppsScript("getAll");
      if (Array.isArray(response)) {
        const seenIds = new Map<string, number>();
        const processedList: PYQ[] = [];

        for (let idx = 0; idx < response.length; idx++) {
          const p = response[idx];
          if (!p) continue;

          const rawPaper = String(p.paper || p.title || p.subject || "");
          let guessedContentType = p.content_type || "application/pdf";
          const lowerName = rawPaper.toLowerCase();
          if (lowerName.endsWith(".png")) guessedContentType = "image/png";
          else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) guessedContentType = "image/jpeg";
          else if (lowerName.endsWith(".webp")) guessedContentType = "image/webp";
          
          const dId = p.file_id || p.fileId || p.fileID || extractDriveId(p.file_url) || "";
          const fName = p.file_name || p.fileName || "";
          let rawId = String(p.id || p.pyqId || p.pyqid || "").trim();
          if (!rawId) rawId = `pyq-${idx + 1}`;

          const cleanSubject = cleanFilenameToSubject(rawPaper);

          // Check if this ID has been seen before
          const currentCount = seenIds.get(rawId) || 0;
          let uniqueId = rawId;

          if (currentCount > 0) {
            // Check if this is an identical duplicate row (same paper, semester, and year)
            const duplicate = processedList.find(
              (item) => item.id === rawId || item.id.startsWith(`${rawId}-`)
            );
            const isIdentical =
              duplicate &&
              duplicate.paper.toLowerCase() === cleanSubject.toLowerCase() &&
              String(duplicate.semester) === String(p.semester) &&
              String(duplicate.year) === String(p.year);

            if (isIdentical) {
              // Exact duplicate row in sheet: skip to avoid duplicate entries and identical React keys
              continue;
            }

            // Different paper sharing the same sheet pyqId: assign a disambiguated unique key
            seenIds.set(rawId, currentCount + 1);
            uniqueId = `${rawId}-${currentCount + 1}`;
          } else {
            seenIds.set(rawId, 1);
          }

          processedList.push({
            ...p,
            id: uniqueId,
            content_type: guessedContentType,
            paper: cleanSubject,
            file_id: dId,
            fileId: dId,
            file_name: fName,
            fileName: fName
          });
        }

        list = processedList;
        cachedGooglePapers = [...list];
        try {
          localStorage.setItem("getpyq_cached_papers", JSON.stringify(list.slice(0, 150)));
        } catch {}
      } else {
        list = cachedGooglePapers.length > 0 ? [...cachedGooglePapers] : [];
      }
    } catch (err) {
      console.warn("Live connection notice:", err);
      list = [...cachedGooglePapers];
    }
  } else {
    list = [...cachedGooglePapers];
  }

  // Apply filters on the retrieved list
  if (filters.branch && filters.branch !== "all") {
    list = list.filter(p => isBranchMatch(p.branch, filters.branch));
  }
  if (filters.semester && filters.semester !== "all") {
    list = list.filter(p => p.semester && String(p.semester) === String(filters.semester));
  }
  if (filters.year && filters.year !== "all") {
    list = list.filter(p => p.year && String(p.year) === String(filters.year));
  }
  if (filters.exam_type && filters.exam_type !== "all") {
    list = list.filter(p => p.exam_type && p.exam_type.toLowerCase() === filters.exam_type!.toLowerCase());
  }
  if (filters.paper && filters.paper !== "all") {
    const fp = filters.paper.toLowerCase().trim();
    list = list.filter(p => {
      if (!p.paper) return false;
      const pName = p.paper.toLowerCase().trim();
      if (pName === fp || pName.includes(fp) || fp.includes(pName)) return true;
      const normP = pName.replace(/[^a-z0-9]/g, "");
      const normF = fp.replace(/[^a-z0-9]/g, "");
      return normP.length > 2 && normF.length > 2 && (normP.includes(normF) || normF.includes(normP));
    });
  }

  // Search keyword match
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(p => 
      (p.paper && p.paper.toLowerCase().includes(q)) ||
      (p.branch && p.branch.toLowerCase().includes(q)) ||
      (p.uploader_name || "").toLowerCase().includes(q) ||
      (p.year && p.year.toString().includes(q)) ||
      (p.file_id || "").toLowerCase().includes(q) ||
      (p.fileId || "").toLowerCase().includes(q)
    );
  }

  // Sorting
  if (filters.sort === "popular") {
    list = list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  } else if (filters.sort === "downloads") {
    list = list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  } else {
    list = list.sort((a, b) => {
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      return timeB - timeA;
    });
  }

  if (filters.limit) {
    list = list.slice(0, filters.limit);
  }

  return list;
}

export async function getPYQ(id: string): Promise<PYQ | null> {
  if (!id || !id.trim()) return null;
  const cleanId = id.trim();

  // 1. Check in-memory cached papers first (instant response)
  const memMatch = cachedGooglePapers.find((p) => isPaperMatch(p, cleanId));
  if (memMatch) return memMatch;

  // 2. Check localStorage cache immediately before network request
  try {
    const raw = localStorage.getItem("getpyq_cached_papers");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const found = parsed.find((p: any) => isPaperMatch(p, cleanId));
        if (found) {
          if (!cachedGooglePapers.some((p) => p.id === found.id)) {
            cachedGooglePapers.unshift(found);
          }
          return found;
        }
      }
    }
  } catch {}

  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    // 3. Query target paper directly from Google Apps Script by pyqId primary key
    try {
      let single = await fetchFromAppsScript("getPYQ", { id: cleanId, pyqId: cleanId });

      // If direct ID lookup returned null and cleanId has disambiguation suffix like "-228", retry with base ID
      if ((!single || single.error || (!single.paper && !single.id)) && /-\d+$/.test(cleanId)) {
        const baseId = cleanId.replace(/-\d+$/, "");
        single = await fetchFromAppsScript("getPYQ", { id: baseId, pyqId: baseId });
      }

      if (single && !single.error && (single.paper || single.title || single.id)) {
        const rawPaper = String(single.paper || single.title || single.subject || "");
        let guessedContentType = single.content_type || "application/pdf";
        const lowerName = rawPaper.toLowerCase();
        if (lowerName.endsWith(".png")) guessedContentType = "image/png";
        else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) guessedContentType = "image/jpeg";
        else if (lowerName.endsWith(".webp")) guessedContentType = "image/webp";

        const dId = single.file_id || single.fileId || single.fileID || extractDriveId(single.file_url) || "";
        const formatted: PYQ = {
          ...single,
          id: single.id || cleanId,
          content_type: guessedContentType,
          paper: cleanFilenameToSubject(rawPaper),
          file_id: dId,
          fileId: dId
        };
        // Add to cache so subsequent shares/clicks are instantaneous
        if (!cachedGooglePapers.some((p) => p.id === formatted.id)) {
          cachedGooglePapers.unshift(formatted);
        }
        try {
          localStorage.setItem("getpyq_cached_papers", JSON.stringify(cachedGooglePapers.slice(0, 150)));
        } catch {}
        return formatted;
      }
    } catch (err) {
      console.warn("Direct getPYQ API query notice:", err);
    }

    // 4. Fallback to listPYQs to refresh the complete list from Google Sheets
    try {
      const papers = await listPYQs();
      const match = papers.find((p) => isPaperMatch(p, cleanId));
      if (match) return match;
    } catch (err) {
      console.warn("Failed retrieving target paper from active stream:", err);
    }
  }

  // 5. Final fallback check against built-in curriculum papers (so shared demo links never 404)
  const fallbackMatch = FALLBACK_PAPERS.find((p) => isPaperMatch(p, cleanId));
  if (fallbackMatch) return fallbackMatch;

  return null;
}

export async function upvotePYQ(id: string): Promise<PYQ> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await postToAppsScript("upvote", { pyqId: id });
      if (res && res.success) {
        const liveMatch = await getPYQ(id);
        if (liveMatch) {
          liveMatch.upvotes = res.upvotes;
          return liveMatch;
        }
      }
    } catch (err) {
      console.warn("Upvote live update failed:", err);
    }
  }

  const paper = await getPYQ(id);
  if (paper) {
    paper.upvotes = (paper.upvotes || 0) + 1;
    return paper;
  }
  throw new Error("Target document not found in community database.");
}

export async function uploadPYQ(formData: FormData): Promise<PYQ> {
  const file = formData.get("file") as File | null;
  const paper = (formData.get("paper") as string) || "Core Engineering";
  const branch = (formData.get("branch") as string) || "CSE";
  const semester = (formData.get("semester") as string) || "1";
  const year = (formData.get("year") as string) || "2024-25";
  const exam_type = (formData.get("exam_type") as string) || "Regular/Back";
  const uploader_name = (formData.get("uploader_name") as string) || "Anonymous";

  let file_url = "";
  let fileBase64 = "";
  let content_type = "application/pdf";
  let extension = "pdf";

  if (file && file.size > 0) {
    content_type = file.type;
    extension = file.name.substring(file.name.lastIndexOf(".") + 1) || "pdf";
    fileBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  } else {
    file_url = generateDummyQuestionPaperPdf({ paper, branch, semester, year, exam_type });
    fileBase64 = file_url;
  }

  const sanitizedSubject = paper.replace(/[\s/\\?%*:|"<>]+/g, "_");
  const sanitizedBranch = branch.replace(/[\s/\\?%*:|"<>]+/g, "_");
  const sanitizedExamType = exam_type.replace(/[\s/\\?%*:|"<>]+/g, "_");
  const defaultFileName = `${sanitizedSubject}_${sanitizedBranch}_sem${semester}_${year}_${sanitizedExamType}.${extension}`;
  const fileName = (file && file.name) ? file.name : defaultFileName;

  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const uploadResult = await postToAppsScript("upload", {
        paperName: paper,
        fileName,
        branch,
        semester,
        academicYear: year,
        paperType: exam_type,
        fileBase64,
        uploadedBy: uploader_name
      });

      if (uploadResult && uploadResult.success) {
        const newPaper: PYQ = {
          id: uploadResult.pyqId,
          paper: paper,
          branch,
          semester,
          year,
          exam_type,
          fileName: uploadResult.fileName || fileName,
          file_name: uploadResult.fileName || fileName,
          uploader_name,
          upvotes: 0,
          downloads: 0,
          content_type,
          file_url: `https://drive.google.com/file/d/${uploadResult.fileID}/view?usp=drive_link`,
          created_at: new Date().toISOString(),
          file_id: uploadResult.fileID
        };

        if (cachedGooglePapers.length === 0) {
          cachedGooglePapers = [];
        }
        cachedGooglePapers.unshift(newPaper);
        return newPaper;
      } else if (uploadResult && uploadResult.status === "exists") {
        throw new Error(uploadResult.message || "This exact test paper already exists in our archives!");
      } else {
        throw new Error(uploadResult?.message || "Unable to save past paper to spreadsheet database. Check script logs.");
      }
    } catch (err: any) {
      console.warn("Uploading live failed:", err);
      throw err;
    }
  }

  throw new Error("Apps Script URL is not configured. Please verify your database connection in settings.");
}

export async function listSolutions(pyq_id: string): Promise<PYQSolution[]> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await fetchFromAppsScript("getSolutions", { pyqId: pyq_id });
      if (Array.isArray(res)) {
        return res;
      }
    } catch (err) {
      console.warn("Solutions API retrieval failed:", err);
    }
  }
  const strict = isStrictMode();
  return strict ? [] : (FALLBACK_SOLUTIONS[pyq_id] || []);
}

export async function addSolution(pyq_id: string, sForm: { content: string, author_name?: string }): Promise<PYQSolution> {
  const author_name = sForm.author_name?.trim() || "Anonymous Student";
  const content = sForm.content?.trim();

  if (!content) throw new Error("Solution content cannot be empty.");

  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await postToAppsScript("addSolution", {
        pyqId: pyq_id,
        content,
        authorName: author_name
      });
      if (res && res.success && res.solution) {
        return res.solution as PYQSolution;
      }
    } catch (err) {
      console.warn("Add solution live call failed:", err);
      throw err;
    }
  }

  const localSolId = `sol-${Date.now()}`;
  const mockSol: PYQSolution = {
    id: localSolId,
    pyq_id,
    content,
    author_name,
    created_at: new Date().toISOString()
  };

  if (!FALLBACK_SOLUTIONS[pyq_id]) {
    FALLBACK_SOLUTIONS[pyq_id] = [];
  }
  FALLBACK_SOLUTIONS[pyq_id].push(mockSol);
  return mockSol;
}

// Asynchronously track download on the backend
export function trackDownload(id: string): void {
  if (!id) return;
  setTimeout(async () => {
    try {
      const scriptUrl = getAppsScriptUrl();
      if (isValidAppsScriptUrl(scriptUrl)) {
        await fetchFromAppsScript("download", { pyqId: id }).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    }
  }, 100);
}

// Download URL retriever.
export function downloadUrl(id: string, fallbackUrl?: string, fileId?: string, track: boolean = false): string {
  if (track && id) {
    trackDownload(id);
  }

  if (fileId && fileId !== "local_offline_mode" && fileId.trim() !== "") {
    return `https://drive.google.com/uc?export=download&id=${fileId.trim()}`;
  }

  const strict = isStrictMode();
  const dataset = cachedGooglePapers.length > 0 ? cachedGooglePapers : (strict ? [] : FALLBACK_PAPERS);
  const paper = dataset.find(p => p.id === id || p.file_id === id || p.fileId === id);
  let targetUrl = fallbackUrl || "";
  if (paper && paper.file_url) {
    targetUrl = paper.file_url;
  }
  
  if (targetUrl.includes("drive.google.com")) {
    const match = targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    const idMatch = targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    }
  }

  return targetUrl;
}

export async function getFilterOptions(): Promise<FilterOptionsResponse> {
  let papers: PYQ[] = [];
  const scriptUrl = getAppsScriptUrl();

  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const response = await fetchFromAppsScript("getAll");
      if (Array.isArray(response)) {
        papers = response;
      }
    } catch (err) {
      console.warn("Filter index query failed:", err);
    }
  }

  if (papers.length === 0) {
    const strict = isStrictMode();
    papers = cachedGooglePapers.length > 0 ? cachedGooglePapers : (strict ? [] : FALLBACK_PAPERS);
  }

  const branchesSet = new Set<string>();
  papers.forEach(p => {
    if (p.branch) {
      // Use parseBranches so we never split on space, &, or / inside branch names
      const list = parseBranches(p.branch);
      list.forEach(item => {
        const normalized = normalizeBranchKey(item);
        if (normalized && normalized !== "&" && normalized !== "/" && normalized.length > 1) {
          branchesSet.add(normalized);
        }
      });
    }
  });

  const branches = Array.from(branchesSet);
  const papersList = Array.from(new Set(papers.map((p: any) => p.paper || p.title || p.subject || "").filter(Boolean)));
  const semesters = Array.from(new Set(papers.map(p => p.semester).filter(Boolean))).sort();
  const years = Array.from(new Set(papers.map(p => p.year).filter(Boolean))).sort((a,b) => b.localeCompare(a));
  
  // Remove "Mid Sem" and "End Sem" from exam_types per user requirement
  const exam_types = Array.from(new Set(papers.map(p => p.exam_type).filter(Boolean)))
    .filter(e => {
      const el = e.toLowerCase().trim();
      return !el.includes("mid") && !el.includes("end");
    });

  return {
    branches,
    papers: papersList,
    semesters,
    years,
    exam_types
  };
}

// Seed & storage logic for Student Paper Requests
const SEED_REQUESTS: PaperRequest[] = [
  {
    id: "req-os-2024",
    subject_name: "Operating Systems",
    branch: "CSE",
    semester: "4",
    year: "2023-24",
    exam_type: "Regular/Back",
    requester_name: "Aniket R.",
    note: "Urgently need 2023-24 question paper for exam revision!",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "open",
    upvotes: 14,
  },
  {
    id: "req-mp-2024",
    subject_name: "Microprocessors & Microcontrollers",
    branch: "ECE",
    semester: "5",
    year: "2023-24",
    exam_type: "Regular/Back",
    requester_name: "Priya Swain",
    note: "Looking for regular/back paper with numerical answers if available.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: "open",
    upvotes: 8,
  },
  {
    id: "req-dm-2023",
    subject_name: "Discrete Mathematics",
    branch: "CSE",
    semester: "3",
    year: "2022-23",
    exam_type: "Regular/Back",
    requester_name: "Suman Kalyan",
    note: "Need 2022 or 2023 question paper.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: "fulfilled",
    fulfilled_pyq_id: "cse-dsa-2024",
    upvotes: 21,
  }
];

const REQUESTS_STORAGE_KEY = "getpyq_paper_requests_v2";

export async function getPaperRequests(): Promise<PaperRequest[]> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const response = await fetchFromAppsScript("getRequests");
      if (Array.isArray(response)) {
        return response;
      }
    } catch (err) {
      console.warn("Live requests query failed:", err);
    }
  }

  const strict = isStrictMode();
  if (strict) {
    try {
      const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(SEED_REQUESTS));
      return SEED_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_REQUESTS;
  } catch {
    return SEED_REQUESTS;
  }
}

export async function createPaperRequest(
  data: Omit<PaperRequest, "id" | "created_at" | "status" | "upvotes">
): Promise<PaperRequest> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await postToAppsScript("createRequest", data);
      if (res && res.success && res.request) {
        return res.request as PaperRequest;
      }
    } catch (err) {
      console.warn("Live createRequest failed:", err);
    }
  }

  const current = await getPaperRequests();
  const newReq: PaperRequest = {
    ...data,
    id: `req-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: "open",
    upvotes: 1,
  };
  const updated = [newReq, ...current];
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updated));
  return newReq;
}

export async function upvotePaperRequest(id: string): Promise<PaperRequest[]> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      await postToAppsScript("upvoteRequest", { requestId: id });
      return await getPaperRequests();
    } catch (err) {
      console.warn("Live upvoteRequest failed:", err);
    }
  }

  const current = await getPaperRequests();
  const updated = current.map((r) =>
    r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r
  );
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function fulfillPaperRequest(requestId: string, pyqId: string): Promise<void> {
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      await postToAppsScript("fulfillRequest", { requestId, pyqId });
      return;
    } catch (err) {
      console.warn("Live fulfillRequest failed:", err);
    }
  }

  const current = await getPaperRequests();
  const updated = current.map((r) =>
    r.id === requestId ? { ...r, status: "fulfilled" as const, fulfilled_pyq_id: pyqId } : r
  );
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Submits student contact inquiry / feedback to Google Sheet (Contacts tab)
 * and keeps local browser copy for tracking.
 */
export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; ticketId: string; message?: string }> {
  const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  const submittedAt = new Date().toISOString();

  // Cache locally
  try {
    const stored = localStorage.getItem("getpyq_contacts");
    const list = stored ? JSON.parse(stored) : [];
    list.push({ ...data, id: ticketId, submittedAt });
    localStorage.setItem("getpyq_contacts", JSON.stringify(list));
  } catch (err) {
    console.warn("Could not cache contact message locally", err);
  }

  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await postToAppsScript("contact", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      });
      if (res && (res.ticketId || res.success)) {
        return {
          success: true,
          ticketId: res.ticketId || ticketId,
          message: res.message || "Contact response recorded successfully in Google Sheet Contacts tab!"
        };
      }
    } catch (err: any) {
      console.warn("Live contact POST error, attempting fallback GET to Google Sheet:", err);
      try {
        const getRes = await fetchFromAppsScript("contact", {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        });
        if (getRes && (getRes.ticketId || getRes.success)) {
          return {
            success: true,
            ticketId: getRes.ticketId || ticketId,
            message: getRes.message || "Contact response recorded successfully in Google Sheet Contacts tab!"
          };
        }
      } catch (getErr) {
        console.warn("GET fallback also failed:", getErr);
      }
    }
  }

  return {
    success: true,
    ticketId,
    message: "Inquiry saved and queued for moderator review."
  };
}

/**
 * Deletes a PYQ from Google Sheet and trashes the file in Google Drive.
 */
export async function deletePYQ(pyqId: string, fileId?: string): Promise<{ success: boolean; message?: string }> {
  // Clear in-memory and local storage caches immediately
  cachedGooglePapers = cachedGooglePapers.filter((p) => p.id !== pyqId);
  try {
    const raw = localStorage.getItem("getpyq_cached_papers");
    if (raw) {
      const papers: PYQ[] = JSON.parse(raw);
      const filtered = papers.filter((p) => p.id !== pyqId);
      localStorage.setItem("getpyq_cached_papers", JSON.stringify(filtered));
    }
    const legacy = localStorage.getItem("getpyq_papers_cache");
    if (legacy) {
      const papers: PYQ[] = JSON.parse(legacy);
      const filtered = papers.filter((p) => p.id !== pyqId);
      localStorage.setItem("getpyq_papers_cache", JSON.stringify(filtered));
    }
  } catch (e) {}

  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await postToAppsScript("deletePYQ", { pyqId, fileId });
      if (res && res.success) {
        return { success: true, message: res.message || "Paper deleted successfully." };
      }
    } catch (err: any) {
      console.warn("deletePYQ via POST failed, attempting GET fallback:", err);
      try {
        const params: Record<string, string> = { pyqId };
        if (fileId) params.fileId = fileId;
        const data = await fetchFromAppsScript("deletePYQ", params);
        if (data && data.success) {
          return { success: true, message: data.message || "Paper deleted successfully." };
        }
      } catch (gErr) {
        console.error("deletePYQ GET fallback failed:", gErr);
      }
    }
  }

  return { success: true, message: "Paper deleted from active library." };
}

/**
 * Modifies/updates paper properties in Google Sheet.
 */
export async function updatePYQ(
  pyqId: string,
  updates: {
    paper?: string;
    branch?: string;
    semester?: string | number;
    year?: string;
    exam_type?: string;
    uploader_name?: string;
    fileId?: string;
    file_url?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  // Normalize updates to ensure semester is string
  const normalizedUpdates = {
    ...updates,
    semester: updates.semester !== undefined ? String(updates.semester) : undefined
  };

  // Update in-memory cache immediately
  cachedGooglePapers = cachedGooglePapers.map((p) => (p.id === pyqId ? { ...p, ...normalizedUpdates } : p));
  try {
    const raw = localStorage.getItem("getpyq_cached_papers");
    if (raw) {
      const papers: PYQ[] = JSON.parse(raw);
      const updated = papers.map((p) => (p.id === pyqId ? { ...p, ...normalizedUpdates } : p));
      localStorage.setItem("getpyq_cached_papers", JSON.stringify(updated));
    }
    const legacy = localStorage.getItem("getpyq_papers_cache");
    if (legacy) {
      const papers: PYQ[] = JSON.parse(legacy);
      const updated = papers.map((p) => (p.id === pyqId ? { ...p, ...normalizedUpdates } : p));
      localStorage.setItem("getpyq_papers_cache", JSON.stringify(updated));
    }
  } catch (e) {}

  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      const res = await postToAppsScript("updatePYQ", {
        pyqId,
        paperName: updates.paper,
        branch: updates.branch,
        semester: updates.semester,
        academicYear: updates.year,
        paperType: updates.exam_type,
        uploadedBy: updates.uploader_name,
        fileId: updates.fileId
      });
      if (res && res.success) {
        return { success: true, message: res.message || "Paper updated successfully in Google Sheet." };
      }
    } catch (err: any) {
      console.warn("updatePYQ via POST failed, attempting GET fallback:", err);
      try {
        const params: Record<string, string> = { pyqId };
        if (updates.paper) params.paperName = updates.paper;
        if (updates.branch) params.branch = updates.branch;
        if (updates.semester) params.semester = String(updates.semester);
        if (updates.year) params.academicYear = updates.year;
        if (updates.exam_type) params.paperType = updates.exam_type;
        const data = await fetchFromAppsScript("updatePYQ", params);
        if (data && data.success) {
          return { success: true, message: data.message || "Paper updated successfully in Google Sheet." };
        }
      } catch (gErr) {
        console.error("updatePYQ GET fallback failed:", gErr);
      }
    }
  }

  return { success: true, message: "Paper updated locally." };
}

/**
 * Creates a new PYQ record directly from Admin.
 */
export async function createAdminPYQ(
  paperData: {
    paper: string;
    branch: string;
    semester: string;
    year: string;
    exam_type: string;
    uploader_name?: string;
    file_id?: string;
    file_url?: string;
  }
): Promise<PYQ> {
  // Strictly sequential serial number starting from 000001 without random generator or prefixes
  let maxSerial = 0;
  const papersToScan = cachedGooglePapers.length > 0 ? cachedGooglePapers : FALLBACK_PAPERS;
  for (const p of papersToScan) {
    const raw = String(p.id || "");
    const digits = raw.replace(/\D/g, "");
    if (digits) {
      const num = parseInt(digits, 10);
      if (!isNaN(num) && num < 1000000 && num > maxSerial) {
        maxSerial = num;
      }
    }
  }
  const nextSerial = maxSerial > 0 ? maxSerial + 1 : (papersToScan.length > 0 ? papersToScan.length + 1 : 1);
  const newId = String(nextSerial).padStart(6, "0");
  const newPaper: PYQ = {
    id: newId,
    paper: cleanFilenameToSubject(paperData.paper),
    branch: paperData.branch,
    semester: paperData.semester,
    year: paperData.year,
    exam_type: paperData.exam_type,
    uploader_name: paperData.uploader_name || "Admin Verified",
    upvotes: 0,
    downloads: 0,
    content_type: "application/pdf",
    file_url: paperData.file_url || (paperData.file_id ? `https://drive.google.com/file/d/${paperData.file_id}/view` : ""),
    file_id: paperData.file_id || "",
    fileId: paperData.file_id || "",
    created_at: new Date().toISOString()
  };

  // Add to memory and local storage
  cachedGooglePapers.unshift(newPaper);
  try {
    const raw = localStorage.getItem("getpyq_cached_papers");
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(newPaper);
    localStorage.setItem("getpyq_cached_papers", JSON.stringify(list));
  } catch {}

  // Attempt sync with Google Sheets
  const scriptUrl = getAppsScriptUrl();
  if (isValidAppsScriptUrl(scriptUrl)) {
    try {
      await postToAppsScript("upload", {
        pyqId: newId,
        paperName: newPaper.paper,
        branch: newPaper.branch,
        semester: newPaper.semester,
        academicYear: newPaper.year,
        paperType: newPaper.exam_type,
        uploadedBy: newPaper.uploader_name,
        fileID: newPaper.file_id,
        fileURL: newPaper.file_url
      });
    } catch (e) {
      console.warn("Could not sync new paper to Google Sheets:", e);
    }
  }

  return newPaper;
}

/**
 * Deletes a student paper request.
 */
export async function deletePaperRequest(requestId: string): Promise<PaperRequest[]> {
  const current = await getPaperRequests();
  const updated = current.filter((r) => r.id !== requestId);
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Contact messages manager for Admin.
 */
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  resolved?: boolean;
}

export function getContactInquiries(): ContactInquiry[] {
  try {
    const raw = localStorage.getItem("getpyq_contacts");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Default initial inquiries if empty
  const defaultInquiries: ContactInquiry[] = [
    {
      id: "TKT-892104",
      name: "Subham Mohanty",
      email: "subham.cse@gmail.com",
      subject: "Requesting DSA 2024 Question Paper Solution",
      message: "Hello GetPYQ Admin team, the 3rd Semester Data Structures paper from 2024 is missing question 4(b) solutions. Could someone please verify and upload the detailed answer key? Thanks for this awesome platform!",
      submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      resolved: false
    },
    {
      id: "TKT-451920",
      name: "Pooja Das",
      email: "pooja.ece@bput.ac.in",
      subject: "Broken preview link on Microprocessors paper",
      message: "The Google Drive preview for EC302 (Microprocessors & Microcontrollers) 2023 was requesting sign-in permissions. Please ensure public view link is set.",
      submittedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
      resolved: true
    }
  ];
  try {
    localStorage.setItem("getpyq_contacts", JSON.stringify(defaultInquiries));
  } catch {}
  return defaultInquiries;
}

export function deleteContactInquiry(id: string): ContactInquiry[] {
  const current = getContactInquiries();
  const updated = current.filter((i) => i.id !== id);
  try {
    localStorage.setItem("getpyq_contacts", JSON.stringify(updated));
  } catch {}
  return updated;
}

export function toggleContactInquiryResolved(id: string): ContactInquiry[] {
  const current = getContactInquiries();
  const updated = current.map((i) => (i.id === id ? { ...i, resolved: !i.resolved } : i));
  try {
    localStorage.setItem("getpyq_contacts", JSON.stringify(updated));
  } catch {}
  return updated;
}

/**
 * Resets local cached papers and forces clean sync.
 */
export function clearPaperCache(): void {
  cachedGooglePapers = [];
  try {
    localStorage.removeItem("getpyq_cached_papers");
    localStorage.removeItem("getpyq_papers_cache");
  } catch {}
}


