export interface BranchSEOInfo {
  slug: string;
  code: string;
  name: string;
  fullName: string;
  degree: string;
  shortDesc: string;
  keywords: string;
  aliases: string[];
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
    aliases: ["CSE", "CS", "IT", "Computer Science", "Computer Science and Engineering"],
    shortDesc: "Download BPUT Computer Science & Engineering (CSE) previous year question papers PDF from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT CSE PYQ, BPUT Computer Science question papers, BPUT CS PYQ, BPUT IT PYQ, BPUT CSE 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ, Biju Patnaik University of Technology CSE exam papers",
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
    aliases: ["AIML", "AI & ML", "CSE AIML", "Artificial Intelligence and Machine Learning"],
    shortDesc: "Download BPUT AIML / CSE (AI & ML) previous year question papers, regular & back exam papers PDF from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT AIML PYQ, BPUT AI ML question papers, BPUT CSE AIML PYQ, BPUT Artificial Intelligence Machine Learning semester papers, BPUT AIML 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ",
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
    aliases: ["ECE", "ETC", "Telecommunication", "Electronics and Telecommunication", "Electronics and Communication"],
    shortDesc: "Download BPUT ECE / ETC (Electronics & Telecommunication Engineering) previous year question papers PDF across 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT ECE PYQ, BPUT ETC PYQ, BPUT Telecommunication question papers, BPUT Electronics and Telecommunication PYQ, BPUT ECE ETC 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem question papers",
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
    aliases: ["EE", "Electrical", "Electrical Engineering"],
    shortDesc: "Download BPUT Electrical Engineering (EE) previous year question papers, regular & back exam papers PDF from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT EE PYQ, BPUT Electrical Engineering question papers, BPUT Electrical PYQ, BPUT EE 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem exam papers",
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
    aliases: ["EEE", "Electrical & Electronics", "Electrical and Electronics Engineering"],
    shortDesc: "Download BPUT Electrical & Electronics Engineering (EEE) semester exam question papers PDF from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT EEE PYQ, BPUT Electrical and Electronics question papers, BPUT Electrical & Electronics PYQ, BPUT EEE 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ",
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
    aliases: ["ME", "Mechanical", "Mechanical Engineering", "Mech"],
    shortDesc: "Download BPUT Mechanical Engineering (ME) previous year question papers PDF across 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT ME PYQ, BPUT Mechanical Engineering question papers, BPUT Mechanical PYQ, BPUT ME 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem question papers",
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
    aliases: ["Civil", "CE", "Civil Engineering"],
    shortDesc: "Download BPUT Civil Engineering (CE) previous year question papers PDF for 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT Civil PYQ, BPUT CE PYQ, BPUT Civil Engineering question papers, BPUT Civil 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem exam papers",
    color: "from-orange-600 to-red-600",
    accentBg: "bg-orange-50 text-orange-700 border-orange-200/80",
    textAccent: "text-orange-700"
  },
  chemical: {
    slug: "chemical",
    code: "Chemical",
    name: "Chemical Engineering",
    fullName: "BPUT B.Tech Chemical Engineering (CHE)",
    degree: "B.Tech Chemical",
    aliases: ["Chemical", "CHE", "Chemical Engineering"],
    shortDesc: "Download BPUT Chemical Engineering (CHE) previous year question papers and semester exam PDFs from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT Chemical PYQ, BPUT CHE PYQ, BPUT Chemical Engineering question papers, BPUT Chemical 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ",
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
    aliases: ["Automobile", "Automobile Engineering", "AE"],
    shortDesc: "Download BPUT Automobile Engineering previous year question papers PDF from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT Automobile PYQ, BPUT Automobile Engineering question papers, BPUT Automobile 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ",
    color: "from-rose-600 to-pink-600",
    accentBg: "bg-rose-50 text-rose-700 border-rose-200/80",
    textAccent: "text-rose-700"
  },
  metallurgy: {
    slug: "metallurgy",
    code: "Material & Metallurgy",
    name: "Material & Metallurgical Engineering",
    fullName: "BPUT B.Tech Material & Metallurgical Engineering (MME)",
    degree: "B.Tech Metallurgy",
    aliases: ["Metallurgy", "MME", "Material & Metallurgy", "Metallurgical Engineering"],
    shortDesc: "Download BPUT Metallurgy / MME (Material & Metallurgical Engineering) previous year question papers PDF from 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT Metallurgy PYQ, BPUT MME PYQ, BPUT Material and Metallurgy question papers, BPUT Metallurgical Engineering 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ",
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
    aliases: ["Biotech", "Biotechnology", "BT", "Bio-Tech"],
    shortDesc: "Download BPUT Biotechnology (Biotech) previous year question papers PDF across 1st Sem to 8th Sem on GetPYQ.",
    keywords: "GetPYQ, BPUT Biotech PYQ, BPUT Biotechnology question papers, BPUT Biotech 1st Sem 2nd Sem 3rd Sem 4th Sem 5th Sem 6th Sem 7th Sem 8th Sem PYQ",
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
  if (clean === "aiml" || clean.includes("artificial")) {
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
  if (clean.includes("chem") || clean === "che") {
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
