export interface BranchSEOInfo {
  slug: string;
  code: string;
  name: string;
  fullName: string;
  degree: string;
  shortDesc: string;
  keywords: string;
  color: string;
  accentBg: string;
  textAccent: string;
}

export const BRANCH_SEO_DATA: Record<string, BranchSEOInfo> = {
  cse: {
    slug: "cse",
    code: "CSE",
    name: "Computer Science & Engineering",
    fullName: "BPUT B.Tech Computer Science & Engineering (CSE)",
    degree: "B.Tech Computer Science",
    shortDesc: "Download official BPUT Computer Science & Engineering (CSE) previous year question papers PDF from Semester 1 to Semester 8.",
    keywords: "bput cse pyq, bput cse question papers, bput computer science previous year questions, bput cse 3rd sem 4th sem 5th sem 6th sem 7th sem 8th sem pyq, cse bput exam papers",
    color: "from-blue-600 to-indigo-600",
    accentBg: "bg-blue-50 text-blue-700 border-blue-200/80",
    textAccent: "text-blue-700"
  },
  "cse-aiml": {
    slug: "cse-aiml",
    code: "CSE (AI & ML)",
    name: "Artificial Intelligence & Machine Learning",
    fullName: "BPUT B.Tech CSE (Artificial Intelligence & Machine Learning)",
    degree: "B.Tech AI & ML",
    shortDesc: "Download official BPUT CSE (AI & ML) previous year question papers, semester exam papers, and question bank PDF.",
    keywords: "bput aiml pyq, bput cse ai ml question papers, bput artificial intelligence question papers, bput machine learning semester papers, bput cse aiml pyq pdf",
    color: "from-indigo-600 to-purple-600",
    accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    textAccent: "text-indigo-700"
  },
  ece: {
    slug: "ece",
    code: "ECE / ETC",
    name: "Electronics & Telecommunication",
    fullName: "BPUT B.Tech Electronics & Telecommunication Engineering (ECE / ETC)",
    degree: "B.Tech ECE / ETC",
    shortDesc: "Download official BPUT Electronics & Telecommunication Engineering (ECE / ETC) previous year question papers PDF for all semesters.",
    keywords: "bput ece pyq, bput etc question papers, bput electronics telecommunication previous year question papers, bput ece 3rd 4th 5th 6th sem pyq",
    color: "from-sky-600 to-cyan-600",
    accentBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    textAccent: "text-sky-700"
  },
  ee: {
    slug: "ee",
    code: "EE",
    name: "Electrical Engineering",
    fullName: "BPUT B.Tech Electrical Engineering (EE)",
    degree: "B.Tech Electrical",
    shortDesc: "Download official BPUT Electrical Engineering (EE) previous year question papers, regular & back exam papers PDF.",
    keywords: "bput ee pyq, bput electrical engineering question papers, bput ee semester exam papers, bput electrical past papers download",
    color: "from-amber-600 to-orange-600",
    accentBg: "bg-amber-50 text-amber-800 border-amber-200/80",
    textAccent: "text-amber-700"
  },
  eee: {
    slug: "eee",
    code: "EEE",
    name: "Electrical & Electronics Engineering",
    fullName: "BPUT B.Tech Electrical & Electronics Engineering (EEE)",
    degree: "B.Tech EEE",
    shortDesc: "Download official BPUT Electrical & Electronics Engineering (EEE) semester exam question papers PDF with solutions.",
    keywords: "bput eee pyq, bput electrical electronics question papers, bput eee exam papers, bput eee semester 3 4 5 6 7 8 pyq",
    color: "from-yellow-600 to-amber-600",
    accentBg: "bg-yellow-50 text-yellow-800 border-yellow-200/80",
    textAccent: "text-yellow-800"
  },
  me: {
    slug: "me",
    code: "ME",
    name: "Mechanical Engineering",
    fullName: "BPUT B.Tech Mechanical Engineering (ME)",
    degree: "B.Tech Mechanical",
    shortDesc: "Download official BPUT Mechanical Engineering (ME) previous year question papers PDF, syllabus, and solved papers.",
    keywords: "bput me pyq, bput mechanical engineering question papers, bput mechanical previous year question papers, bput me 3rd 4th 5th 6th 7th sem pyq",
    color: "from-purple-600 to-pink-600",
    accentBg: "bg-purple-50 text-purple-700 border-purple-200/80",
    textAccent: "text-purple-700"
  },
  civil: {
    slug: "civil",
    code: "Civil",
    name: "Civil Engineering",
    fullName: "BPUT B.Tech Civil Engineering (CE)",
    degree: "B.Tech Civil",
    shortDesc: "Download official BPUT Civil Engineering previous year question papers PDF for all 8 semesters.",
    keywords: "bput civil pyq, bput civil engineering question papers, bput ce question bank, bput civil semester papers download",
    color: "from-orange-600 to-red-600",
    accentBg: "bg-orange-50 text-orange-700 border-orange-200/80",
    textAccent: "text-orange-700"
  },
  chemical: {
    slug: "chemical",
    code: "Chemical",
    name: "Chemical Engineering",
    fullName: "BPUT B.Tech Chemical Engineering",
    degree: "B.Tech Chemical",
    shortDesc: "Download official BPUT Chemical Engineering previous year question papers and semester exam PDFs.",
    keywords: "bput chemical pyq, bput chemical engineering question papers, bput chemical exam papers download",
    color: "from-teal-600 to-emerald-600",
    accentBg: "bg-teal-50 text-teal-700 border-teal-200/80",
    textAccent: "text-teal-700"
  },
  automobile: {
    slug: "automobile",
    code: "Automobile",
    name: "Automobile Engineering",
    fullName: "BPUT B.Tech Automobile Engineering",
    degree: "B.Tech Automobile",
    shortDesc: "Download official BPUT Automobile Engineering previous year question papers PDF and study notes.",
    keywords: "bput automobile pyq, bput automobile engineering question papers, bput automobile exam papers",
    color: "from-rose-600 to-pink-600",
    accentBg: "bg-rose-50 text-rose-700 border-rose-200/80",
    textAccent: "text-rose-700"
  },
  metallurgy: {
    slug: "metallurgy",
    code: "Material & Metallurgy",
    name: "Material & Metallurgical Engineering",
    fullName: "BPUT B.Tech Material & Metallurgical Engineering",
    degree: "B.Tech Metallurgy",
    shortDesc: "Download official BPUT Material & Metallurgy Engineering previous year question papers PDF.",
    keywords: "bput metallurgy pyq, bput material metallurgy question papers, bput mme question papers download",
    color: "from-stone-600 to-zinc-600",
    accentBg: "bg-stone-50 text-stone-700 border-stone-200/80",
    textAccent: "text-stone-700"
  },
  biotech: {
    slug: "biotech",
    code: "Biotech",
    name: "Biotechnology",
    fullName: "BPUT B.Tech Biotechnology",
    degree: "B.Tech Biotech",
    shortDesc: "Download official BPUT Biotechnology previous year question papers PDF for all engineering semesters.",
    keywords: "bput biotech pyq, bput biotechnology question papers, bput biotech semester exam papers",
    color: "from-lime-600 to-green-600",
    accentBg: "bg-lime-50 text-lime-800 border-lime-200/80",
    textAccent: "text-lime-800"
  }
};

/**
 * Normalizes any route param or branch code to the official BranchSEOInfo object
 */
export function getBranchSEOInfo(rawParam: string): BranchSEOInfo | null {
  if (!rawParam) return null;
  const clean = rawParam.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  if (BRANCH_SEO_DATA[rawParam.toLowerCase()]) {
    return BRANCH_SEO_DATA[rawParam.toLowerCase()];
  }

  // Check matching aliases
  for (const info of Object.values(BRANCH_SEO_DATA)) {
    const slugClean = info.slug.replace(/[^a-z0-9]/g, "");
    const codeClean = info.code.toLowerCase().replace(/[^a-z0-9]/g, "");
    const nameClean = info.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (clean === slugClean || clean === codeClean || clean === nameClean) {
      return info;
    }
  }

  // Handle common variations
  if (clean.includes("cse") && (clean.includes("ai") || clean.includes("ml"))) {
    return BRANCH_SEO_DATA["cse-aiml"];
  }
  if (clean.includes("cse") || clean.includes("computerscience")) {
    return BRANCH_SEO_DATA["cse"];
  }
  if (clean.includes("ece") || clean.includes("etc") || clean.includes("telecom")) {
    return BRANCH_SEO_DATA["ece"];
  }
  if (clean.includes("eee")) {
    return BRANCH_SEO_DATA["eee"];
  }
  if (clean === "ee" || (clean.includes("electrical") && !clean.includes("electronics"))) {
    return BRANCH_SEO_DATA["ee"];
  }
  if (clean === "me" || clean.includes("mechanic")) {
    return BRANCH_SEO_DATA["me"];
  }
  if (clean === "civil" || clean === "ce") {
    return BRANCH_SEO_DATA["civil"];
  }
  if (clean.includes("chem")) {
    return BRANCH_SEO_DATA["chemical"];
  }
  if (clean.includes("auto")) {
    return BRANCH_SEO_DATA["automobile"];
  }
  if (clean.includes("metal") || clean.includes("material") || clean === "mme") {
    return BRANCH_SEO_DATA["metallurgy"];
  }
  if (clean.includes("bio")) {
    return BRANCH_SEO_DATA["biotech"];
  }

  return null;
}
