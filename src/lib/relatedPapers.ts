import { PYQ } from "../types";

export interface RelatedPaperMatch {
  paper: PYQ;
  matchScore: number;
  matchReason: string;
  badgeTone: "blue" | "orange" | "gray" | "green" | "purple";
  matchType: "course_code" | "subject" | "semester" | "branch";
}

const STOP_WORDS = new Set([
  "and", "or", "of", "in", "to", "for", "the", "a", "an", "with",
  "engineering", "paper", "exam", "sem", "semester", "year", "mid", "end",
  "regular", "back", "examination", "question", "questions", "part",
  "i", "ii", "iii", "iv", "v", "vi", "1", "2", "3", "4", "5", "6", "7", "8",
  "pyq", "pdf", "test", "final", "dept", "department", "course", "sheet"
]);

/**
 * Extracts academic course code if present in the text (e.g. CS201, KCS-301, BCSE102, EC-304)
 */
export function extractCourseCode(text?: string | null): { full: string; prefix: string; num: string } | null {
  if (!text || typeof text !== "string") return null;
  const match = text.match(/\b([A-Za-z]{2,5})\s*[-_]?\s*(\d{2,4}[A-Za-z]?)\b/);
  if (match) {
    const prefix = match[1].toUpperCase();
    const num = match[2];
    return {
      full: `${prefix}${num}`,
      prefix,
      num
    };
  }
  return null;
}

/**
 * Extracts clean, normalized keywords from a paper subject title
 */
export function extractSubjectKeywords(text?: string | null): string[] {
  if (!text || typeof text !== "string") return [];
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = clean.split(" ");
  return Array.from(
    new Set(
      words.filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
    )
  );
}

/**
 * Normalizes subject title by stripping punctuation and numbers
 */
export function normalizeTitle(text?: string | null): string {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type RelatedFilterType = "all" | "subject" | "semester" | "branch";

/**
 * Finds and ranks related papers for a given PYQ
 */
export function getRelatedPapers(
  current: PYQ,
  allPapers: PYQ[],
  options?: {
    filter?: RelatedFilterType;
    limit?: number;
  }
): RelatedPaperMatch[] {
  if (!current || !allPapers || !Array.isArray(allPapers) || allPapers.length === 0) return [];

  const filter = options?.filter || "all";
  const limit = options?.limit || 6;

  const currentPaperStr = String(current.paper || "");
  const currentCode = extractCourseCode(currentPaperStr);
  const currentKeywords = extractSubjectKeywords(currentPaperStr);
  const currentNormTitle = normalizeTitle(currentPaperStr);
  const currentBranch = String(current.branch || "").trim().toLowerCase();
  const currentSem = String(current.semester || "").trim();

  const candidates = allPapers.filter((p) => p && p.id && p.id !== current.id);

  const scored: RelatedPaperMatch[] = [];

  for (const p of candidates) {
    if (!p) continue;
    let score = 0;
    let matchReason = "";
    let badgeTone: "blue" | "orange" | "gray" | "green" | "purple" = "blue";
    let matchType: "course_code" | "subject" | "semester" | "branch" = "branch";

    const pPaperStr = String(p.paper || "");
    const pCode = extractCourseCode(pPaperStr);
    const pKeywords = extractSubjectKeywords(pPaperStr);
    const pNormTitle = normalizeTitle(pPaperStr);
    const pBranch = String(p.branch || "").trim().toLowerCase();
    const pSem = String(p.semester || "").trim();

    // 1. Exact Course Code Match (e.g. CS201 == CS201)
    if (currentCode && pCode && currentCode.full === pCode.full) {
      score += 120;
      matchReason = `Course Code: ${pCode.full}`;
      badgeTone = "blue";
      matchType = "course_code";
    }
    // Same prefix + same branch (e.g. CS2xx and CS3xx in CSE)
    else if (currentCode && pCode && currentCode.prefix === pCode.prefix && currentBranch === pBranch) {
      score += 45;
      if (!matchReason) {
        matchReason = `Code Series: ${currentCode.prefix}`;
        badgeTone = "purple";
        matchType = "course_code";
      }
    }

    // 2. Exact or High Subject Title Match
    if (pNormTitle === currentNormTitle) {
      score += 100;
      matchReason = `Same Subject • ${p.year || "Past Year"}`;
      badgeTone = "green";
      matchType = "subject";
    } else {
      // Check shared keywords
      const commonKeywords = currentKeywords.filter((k) => pKeywords.includes(k));
      if (commonKeywords.length > 0) {
        score += commonKeywords.length * 35;
        if (!matchReason) {
          const capitalizedKey = commonKeywords[0].charAt(0).toUpperCase() + commonKeywords[0].slice(1);
          matchReason = `Similar Subject (${capitalizedKey})`;
          badgeTone = "green";
          matchType = "subject";
        }
      }
    }

    // 3. Same Branch & Same Semester (Curriculum peers)
    const isSameBranch = currentBranch && pBranch && currentBranch === pBranch;
    const isSameSem = currentSem && pSem && currentSem === pSem;

    if (isSameBranch && isSameSem) {
      score += 55;
      if (!matchReason) {
        matchReason = `${p.branch} Sem ${p.semester} Companion`;
        badgeTone = "orange";
        matchType = "semester";
      }
    } else if (isSameBranch) {
      score += 25;
      if (!matchReason) {
        matchReason = `Same Branch (${p.branch})`;
        badgeTone = "purple";
        matchType = "branch";
      }
    } else if (isSameSem) {
      score += 15;
      if (!matchReason) {
        matchReason = `Semester ${p.semester} Peer`;
        badgeTone = "gray";
        matchType = "semester";
      }
    }

    // 4. Same Exam Type subtle weight
    if (p.exam_type && current.exam_type && String(p.exam_type).toLowerCase() === String(current.exam_type).toLowerCase()) {
      score += 5;
    }

    // 5. Community Popularity boost (helps surface best quality papers)
    score += Math.min(10, Math.round((p.upvotes || 0) / 10));

    // Only include if there's any relatedness
    if (score > 10) {
      scored.push({
        paper: p,
        matchScore: score,
        matchReason: matchReason || `${p.branch || "Academic"} Paper`,
        badgeTone,
        matchType
      });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Apply user filter if requested
  let filtered = scored;
  if (filter === "subject") {
    filtered = scored.filter((item) => item.matchType === "subject" || item.matchType === "course_code");
  } else if (filter === "semester") {
    filtered = scored.filter(
      (item) => String(item.paper.semester).trim() === currentSem
    );
  } else if (filter === "branch") {
    filtered = scored.filter(
      (item) => (item.paper.branch || "").trim().toLowerCase() === currentBranch
    );
  }

  // If filtered result is too small in 'all' mode, backfill with branch or semester candidates
  if (filter === "all" && filtered.length < 3) {
    const existingIds = new Set(filtered.map((item) => item.paper.id));
    for (const p of candidates) {
      if (!existingIds.has(p.id)) {
        filtered.push({
          paper: p,
          matchScore: 5,
          matchReason: `${p.branch} • Sem ${p.semester}`,
          badgeTone: "gray",
          matchType: "branch"
        });
        existingIds.add(p.id);
        if (filtered.length >= 4) break;
      }
    }
  }

  return filtered.slice(0, limit);
}
