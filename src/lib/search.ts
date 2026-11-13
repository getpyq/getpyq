import { PYQ } from "../types";
import { normalizeBranchKey, formatBranchDisplay } from "./constants";

const STOP_WORDS = new Set([
  "bput",
  "pyq",
  "pyqs",
  "question",
  "questions",
  "paper",
  "papers",
  "pdf",
  "pdfs",
  "download",
  "previous",
  "year",
  "years",
  "past",
  "exam",
  "exams",
  "examination",
  "getpyq",
  "for",
  "of",
  "and",
  "in",
  "the",
  "with",
  "all",
  "btech",
  "b.tech",
]);

const SUBJECT_ALIASES: Record<string, string[]> = {
  dsa: ["data structure", "data structures", "algorithms"],
  ds: ["data structure", "data structures", "discrete"],
  os: ["operating system", "operating systems"],
  dbms: ["database management", "database"],
  db: ["database management", "database"],
  cn: ["computer network", "computer networks", "data communication"],
  coa: ["computer organization", "computer architecture"],
  toc: ["theory of computation", "formal language", "automata"],
  flat: ["formal language", "automata", "theory of computation"],
  cd: ["compiler design"],
  se: ["software engineering"],
  oop: ["object oriented", "java", "c++"],
  oops: ["object oriented", "java", "c++"],
  ai: ["artificial intelligence"],
  ml: ["machine learning"],
  aiml: ["artificial intelligence", "machine learning"],
  iot: ["internet of things"],
  som: ["strength of material", "solid mechanics", "mechanics of solid"],
  tom: ["theory of machine", "kinematics", "dynamics"],
  fm: ["fluid mechanics", "hydraulic"],
  td: ["thermodynamics"],
  thermo: ["thermodynamics"],
  ht: ["heat transfer"],
  kom: ["kinematics of machine"],
  dom: ["dynamics of machine"],
  md: ["machine design"],
  bee: ["basic electrical"],
  be: ["basic electronics"],
  aec: ["analog electronic"],
  de: ["digital electronic", "digital system", "digital logic"],
  dld: ["digital logic", "digital system", "digital electronic"],
  dsp: ["digital signal processing"],
  ss: ["signals and systems"],
  em: ["electromagnetic", "engineering mechanics", "engineering mathematics"],
  emt: ["electromagnetic theory"],
  ps: ["power system", "power systems"],
  pe: ["power electronics"],
  cs: ["control system", "computer science"],
  m1: ["mathematics-i", "mathematics 1", "mathematics i"],
  m2: ["mathematics-ii", "mathematics 2", "mathematics ii"],
  m3: ["mathematics-iii", "mathematics 3", "mathematics iii", "mathematics - iii"],
  math: ["mathematics", "math"],
  maths: ["mathematics", "math"],
  phy: ["physics"],
  chem: ["chemistry"],
  eng: ["english"],
  uhv: ["universal human values"],
  evs: ["environmental", "ecology"],
  ob: ["organizational behaviour"],
  ee: ["electrical engineering", "engineering economics"],
  ece: ["electronics", "telecommunication", "etc"],
  etc: ["electronics", "telecommunication", "ece"],
  eee: ["electrical & electronics", "electrical and electronics"],
  me: ["mechanical"],
  mech: ["mechanical"],
  ce: ["civil"],
  cse: ["computer science", "cs"],
  it: ["information technology", "cse", "computer science"],
};

function parseSemesterToken(token: string): string | null {
  const clean = token.toLowerCase().replace(/[^a-z0-9]/g, "");
  let m = clean.match(/^(?:sem|semester|s)?([1-8])(?:st|nd|rd|th)?$/);
  if (m && (clean.startsWith("sem") || clean.startsWith("s") || /(?:st|nd|rd|th)$/.test(clean))) {
    return m[1];
  }
  return null;
}

export function normalizeSearchText(value?: string | number | null): string {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase().replace(/[_/\\-]+/g, " ").replace(/\s+/g, " ").trim();
}

function buildSearchableText(pyq: PYQ): string {
  const parts = [
    pyq.paper,
    pyq.branch,
    formatBranchDisplay(pyq.branch),
    normalizeBranchKey(pyq.branch || ""),
    pyq.semester ? `sem ${pyq.semester} semester ${pyq.semester} s${pyq.semester}` : "",
    pyq.year,
    pyq.exam_type,
    pyq.uploader_name,
    pyq.fileName,
    pyq.file_name,
    pyq.file_id,
    pyq.fileId,
    pyq.id,
  ];
  return normalizeSearchText(parts.filter(Boolean).join(" "));
}

/**
 * Computes a relevance score (>= 0) for how well a PYQ matches a user search query.
 * Returns 0 when the paper does not match.
 * Supports multi-word queries, subject abbreviations (DSA, OS, DBMS, SOM, M1...),
 * semester tokens ("3rd sem", "sem 3"), branch aliases ("computer science" -> CSE),
 * and ignores generic filler words like "bput", "pyq", "pdf" when specific terms exist.
 */
export function scorePaperSearch(pyq: PYQ, rawQuery: string): number {
  const q = normalizeSearchText(rawQuery);
  if (!q) return 1;

  const title = normalizeSearchText(pyq.paper);
  const fullText = buildSearchableText(pyq);

  // Fast path: full normalized phrase match
  if (title === q) return 100;
  if (title.includes(q)) return 85;
  if (fullText.includes(q)) return 70;

  // Tokenize query; normalize combined phrases like "3rd sem" or "sem 3"
  const compactSemQuery = q
    .replace(/\b([1-8])(?:st|nd|rd|th)?\s*(?:sem|semester)\b/g, "sem$1")
    .replace(/\b(?:sem|semester)\s*([1-8])(?:st|nd|rd|th)?\b/g, "sem$1");

  const rawTokens = compactSemQuery
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;
  if (tokens.length === 0) return 1;

  let score = 0;

  for (const token of tokens) {
    // Check semester token (e.g., sem3, 3rd)
    const semDigit = parseSemesterToken(token);
    if (semDigit) {
      if (String(pyq.semester || "").trim() === semDigit) {
        score += 18;
        continue;
      }
    }

    // Direct match in title or searchable text
    if (title.includes(token)) {
      score += 22;
      continue;
    }
    if (fullText.includes(token)) {
      score += 14;
      continue;
    }

    // Alias / abbreviation expansion (e.g., "dsa" -> "data structures", "mech" -> "mechanical")
    const aliases = SUBJECT_ALIASES[token];
    if (aliases && aliases.some((alias) => title.includes(alias) || fullText.includes(alias))) {
      score += 16;
      continue;
    }

    // Any token failed to match -> reject (strict AND matching across meaningful terms)
    return 0;
  }

  return score;
}

export function matchesPaperSearch(pyq: PYQ, rawQuery: string): boolean {
  return scorePaperSearch(pyq, rawQuery) > 0;
}
