import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { BRANCH_SEO_DATA, getBranchSEOInfo } from "../data/branchSeo";

export interface BreadcrumbItem {
  name: string;
  item: string; // Absolute URL or relative path
}

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  breadcrumbs?: BreadcrumbItem[];
  noIndex?: boolean;
  /** Optional live page context for dynamic SERP keyword & description optimization */
  branch?: string;
  semester?: string;
  year?: string;
  examType?: string;
  searchQuery?: string;
}

export const CANONICAL_ORIGIN = "https://getpyq.vercel.app";
const SITE_BRAND_NAME = "GetPYQ - BPUT Previous Year Question Papers";
const DEFAULT_IMAGE = "https://getpyq.vercel.app/favicon-512x512.png";
const DEFAULT_KEYWORDS =
  "GetPYQ, GetPYQ - BPUT Previous Year Question Papers, BPUT, BPUT PYQ, PYQ BPUT, Biju Patnaik University of Technology, CSE, AIML, Mechanical, ME, Civil, CE, Chemical, CHE, Automobile, Electrical, EE, EEE, Electrical and Electronics, ETC, ECE, Telecommunication, Biotech, Metallurgy, MME, 1st Sem, 2nd Sem, 3rd Sem, 4th Sem, 5th Sem, 6th Sem, 7th Sem, 8th Sem";

const SEM_ORDINALS: Record<string, string> = {
  "1": "1st",
  "2": "2nd",
  "3": "3rd",
  "4": "4th",
  "5": "5th",
  "6": "6th",
  "7": "7th",
  "8": "8th",
};

const TOP_SERP_BRANCHES = ["CSE", "AIML", "ECE", "ETC", "EE", "EEE", "Mechanical", "ME", "Civil", "CE"];

interface ResolvedPageContext {
  cleanPath: string;
  branchRaw: string;
  branchInfo: ReturnType<typeof getBranchSEOInfo>;
  semesterNum: string;
  semesterOrdinal: string;
  year: string;
  examType: string;
  searchQuery: string;
}

function normalizeSemesterNum(raw?: string | null): string {
  if (!raw || raw === "all") return "";
  const match = String(raw).trim().match(/[1-8]/);
  return match ? match[0] : "";
}

function resolvePageContext(
  pathname: string,
  search: string,
  props: Pick<SEOHeadProps, "branch" | "semester" | "year" | "examType" | "searchQuery">
): ResolvedPageContext {
  const cleanPath = (pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(search || "");

  const routeBranchSlug = cleanPath.startsWith("/branch/")
    ? cleanPath.replace("/branch/", "").split("/")[0]
    : "";

  const propBranch = props.branch && props.branch !== "all" ? props.branch.trim() : "";
  const queryBranch = params.get("branch") && params.get("branch") !== "all" ? params.get("branch")!.trim() : "";
  const branchRaw = propBranch || routeBranchSlug || queryBranch;
  const branchInfo = branchRaw ? getBranchSEOInfo(branchRaw) : null;

  const propSem = normalizeSemesterNum(props.semester);
  const querySem = normalizeSemesterNum(params.get("semester") || params.get("sem"));
  const semesterNum = propSem || querySem;
  const semesterOrdinal = semesterNum ? SEM_ORDINALS[semesterNum] || `${semesterNum}th` : "";

  const propYear = props.year && props.year !== "all" ? props.year.trim() : "";
  const queryYear = params.get("year") && params.get("year") !== "all" ? params.get("year")!.trim() : "";
  const year = propYear || queryYear;

  const propExamType = props.examType && props.examType !== "all" ? props.examType.trim() : "";
  const queryExamType =
    params.get("exam_type") && params.get("exam_type") !== "all" ? params.get("exam_type")!.trim() : "";
  const examType = propExamType || queryExamType;

  const propSearch = props.searchQuery ? props.searchQuery.trim() : "";
  const querySearch = (params.get("search") || "").trim();
  const searchQuery = propSearch || querySearch;

  return {
    cleanPath,
    branchRaw,
    branchInfo,
    semesterNum,
    semesterOrdinal,
    year,
    examType,
    searchQuery,
  };
}

function buildDynamicRouteKeywords(ctx: ResolvedPageContext): string[] {
  const { cleanPath, branchRaw, branchInfo, semesterNum, semesterOrdinal, year, examType, searchQuery } = ctx;
  const dynamicTerms: string[] = [];

  // Prioritize exact high-traffic branch + semester target phrases first
  if (branchInfo && semesterNum) {
    const aliases = Array.from(new Set([branchInfo.code, branchInfo.name, ...(branchInfo.aliases || [])]));
    dynamicTerms.push(
      `BPUT ${branchInfo.code} Sem ${semesterNum}`,
      `BPUT ${branchInfo.code} ${semesterOrdinal} Sem PYQ`,
      `BPUT ${branchInfo.name} Sem ${semesterNum}`,
      `BPUT ${branchInfo.name} ${semesterOrdinal} Sem Question Papers`
    );
    aliases.forEach((alias) => {
      dynamicTerms.push(`BPUT ${alias} Sem ${semesterNum}`);
      dynamicTerms.push(`BPUT ${alias} ${semesterOrdinal} Sem PYQ`);
    });
  } else if (semesterNum && !branchInfo) {
    dynamicTerms.push(
      `BPUT Sem ${semesterNum} PYQ`,
      `BPUT ${semesterOrdinal} Sem Question Papers`,
      `BPUT Semester ${semesterNum} Previous Year Question Papers PDF`
    );
    TOP_SERP_BRANCHES.forEach((b) => {
      dynamicTerms.push(`BPUT ${b} Sem ${semesterNum}`, `BPUT ${b} ${semesterOrdinal} Sem PYQ`);
    });
  }

  dynamicTerms.push(
    "GetPYQ",
    "GetPYQ - BPUT Previous Year Question Papers",
    "BPUT",
    "BPUT PYQ",
    "PYQ BPUT",
    "BPUT Previous Year Question Papers",
    "Biju Patnaik University of Technology",
    "BPUT B.Tech Question Papers"
  );

  if (branchInfo) {
    const aliases = Array.from(new Set([branchInfo.code, branchInfo.name, ...(branchInfo.aliases || [])]));
    aliases.forEach((alias) => {
      dynamicTerms.push(`BPUT ${alias} PYQ`);
      dynamicTerms.push(`BPUT ${alias} Previous Year Question Papers`);
      dynamicTerms.push(`BPUT ${alias} Question Papers`);
    });

    for (const [semNum, ordinal] of Object.entries(SEM_ORDINALS)) {
      dynamicTerms.push(`BPUT ${branchInfo.code} Sem ${semNum}`);
      dynamicTerms.push(`BPUT ${branchInfo.code} ${ordinal} Sem PYQ`);
      if (branchInfo.aliases && branchInfo.aliases.length > 0) {
        dynamicTerms.push(`BPUT ${branchInfo.aliases[0]} Sem ${semNum}`);
        if (branchInfo.aliases[1]) {
          dynamicTerms.push(`BPUT ${branchInfo.aliases[1]} Sem ${semNum}`);
        }
      }
    }
  } else if (branchRaw) {
    dynamicTerms.push(`BPUT ${branchRaw} PYQ`, `BPUT ${branchRaw} Question Papers`);
    if (semesterNum) {
      dynamicTerms.push(`BPUT ${branchRaw} Sem ${semesterNum}`, `BPUT ${branchRaw} ${semesterOrdinal} Sem PYQ`);
    }
  }

  if (year) {
    dynamicTerms.push(`BPUT PYQ ${year}`, `BPUT Question Paper ${year}`);
    if (branchInfo) {
      dynamicTerms.push(`BPUT ${branchInfo.code} PYQ ${year}`);
    }
  }

  if (examType) {
    dynamicTerms.push(`BPUT ${examType} Question Papers`, `BPUT ${examType} PYQ PDF`);
  }

  if (searchQuery) {
    dynamicTerms.push(`BPUT ${searchQuery} PYQ`, `BPUT ${searchQuery} Question Paper`);
  }

  // Route-specific high-traffic keywords
  if (cleanPath === "/browse") {
    dynamicTerms.push(
      "Browse BPUT PYQ Library",
      "BPUT B.Tech Question Bank",
      "BPUT Regular Back Papers PDF"
    );
    if (!branchInfo) {
      Object.values(BRANCH_SEO_DATA).forEach((b) => {
        dynamicTerms.push(`BPUT ${b.code} PYQ`);
      });
    }
    if (!semesterNum) {
      for (const [semNum, ordinal] of Object.entries(SEM_ORDINALS)) {
        dynamicTerms.push(`BPUT ${ordinal} Sem PYQ`, `BPUT Sem ${semNum}`);
      }
    }
  } else if (cleanPath === "/requests") {
    dynamicTerms.push(
      "Request BPUT Question Paper",
      "BPUT Missing PYQ Board",
      "BPUT Exam Paper Request",
      "BPUT Regular & Back Paper Request"
    );
  } else if (cleanPath === "/upload") {
    dynamicTerms.push(
      "Upload BPUT PYQ PDF",
      "Contribute BPUT Question Papers",
      "Share BPUT Exam Papers",
      "BPUT B.Tech Study Archive"
    );
  } else if (cleanPath === "/about") {
    dynamicTerms.push(
      "About GetPYQ",
      "BPUT Student Community Archive",
      "BPUT Odisha Engineering PYQ Portal"
    );
  } else if (cleanPath === "/sitemap") {
    dynamicTerms.push("GetPYQ Sitemap", "BPUT All Branches PYQ Index");
    Object.values(BRANCH_SEO_DATA).forEach((b) => {
      dynamicTerms.push(`BPUT ${b.code} PYQ`);
    });
    for (const [semNum, ordinal] of Object.entries(SEM_ORDINALS)) {
      dynamicTerms.push(`BPUT ${ordinal} Sem PYQ`, `BPUT Sem ${semNum}`);
    }
  } else if (cleanPath === "/pyq") {
    dynamicTerms.push("BPUT PYQ PDF Download", "BPUT Question Paper Viewer", "BPUT Past Exam Sheet");
  } else if (cleanPath === "/" && !branchInfo) {
    Object.values(BRANCH_SEO_DATA).forEach((b) => {
      dynamicTerms.push(`BPUT ${b.code} PYQ`);
      if (b.aliases?.[0]) {
        dynamicTerms.push(`BPUT ${b.aliases[0]} Question Papers`);
      }
    });
    if (!semesterNum) {
      for (const [semNum, ordinal] of Object.entries(SEM_ORDINALS)) {
        dynamicTerms.push(`BPUT ${ordinal} Sem PYQ`, `BPUT Sem ${semNum}`);
      }
    }
  }

  return dynamicTerms;
}

function buildDynamicDescription(
  ctx: ResolvedPageContext,
  fallbackDescription: string,
  noIndex: boolean
): string {
  const { cleanPath, branchRaw, branchInfo, semesterNum, semesterOrdinal, year, examType } = ctx;

  // Keep custom descriptions intact for utility/legal/404 pages unless filters are active
  if (
    cleanPath === "/privacy" ||
    cleanPath === "/terms" ||
    cleanPath === "/disclaimer" ||
    cleanPath === "/contact" ||
    (noIndex && cleanPath !== "/browse")
  ) {
    return fallbackDescription;
  }

  const branchLabel = branchInfo ? `${branchInfo.name} (${branchInfo.code})` : branchRaw;
  const yearPhrase = year ? ` (${year})` : "";
  const examPhrase = examType ? `${examType.toLowerCase()} ` : "regular & back ";

  // Context 1: Specific Branch + Specific Semester
  if (branchLabel && semesterNum) {
    if (cleanPath === "/requests") {
      return `Request or upvote missing BPUT ${branchLabel} ${semesterOrdinal} Sem (Sem ${semesterNum}) previous year question papers PDF on GetPYQ.`;
    }
    return `Download BPUT ${branchLabel} ${semesterOrdinal} Sem (Sem ${semesterNum}) previous year question papers PDF${yearPhrase}. Free ${examPhrase}exam PYQs on GetPYQ.`;
  }

  // Context 2: Specific Branch across all 8 semesters
  if (branchLabel) {
    if (cleanPath === "/requests") {
      return `Missing a BPUT ${branchLabel} semester exam paper? Submit or upvote ${branchInfo?.code || branchRaw} PYQ requests for 1st Sem to 8th Sem on GetPYQ.`;
    }
    return `Download BPUT ${branchLabel} previous year question papers PDF for 1st Sem to 8th Sem${yearPhrase}. Free Biju Patnaik University ${examPhrase}PYQs on GetPYQ.`;
  }

  // Context 3: Specific Semester across all B.Tech branches
  if (semesterNum) {
    if (cleanPath === "/requests") {
      return `Request missing BPUT ${semesterOrdinal} Sem (Sem ${semesterNum}) question papers PDF across CSE, ECE, EE, Mechanical, Civil & AIML on GetPYQ.`;
    }
    return `Download BPUT ${semesterOrdinal} Sem (Sem ${semesterNum}) previous year question papers PDF${yearPhrase} for CSE, AIML, ECE, EE, EEE, Mechanical (ME) & Civil on GetPYQ.`;
  }

  // Context 4: Route-level dynamic SERP descriptions
  if (cleanPath === "/") {
    return "GetPYQ - BPUT Previous Year Question Papers (PYQ) PDF for CSE, AIML, ECE, ETC, EE, EEE, Mechanical (ME), Civil (CE), Chemical, Automobile, Metallurgy & Biotech (1st–8th Sem).";
  }

  if (cleanPath === "/browse") {
    return "Browse & download BPUT previous year question papers PDF for CSE, AIML, ECE, ETC, EE, EEE, Mechanical (ME), Civil & Biotech across 1st Sem to 8th Sem on GetPYQ.";
  }

  if (cleanPath === "/requests") {
    return "Request missing BPUT previous year question papers PDF across CSE, ECE, EE, Mechanical, Civil & 1st Sem to 8th Sem. Upvote peer requests on GetPYQ.";
  }

  if (cleanPath === "/upload") {
    return "Upload & share BPUT previous year question papers PDF for CSE, AIML, ECE, EE, EEE, Mechanical, Civil & all 1st–8th Sem engineering branches on GetPYQ.";
  }

  if (cleanPath === "/sitemap") {
    return "Complete GetPYQ directory of BPUT B.Tech previous year question papers by branch (CSE, AIML, ECE, EE, EEE, ME, Civil, Chemical, Biotech) and 1st–8th Sem.";
  }

  return fallbackDescription;
}

function buildDynamicTitle(ctx: ResolvedPageContext, baseTitle: string): string {
  const { cleanPath, branchInfo, branchRaw, semesterNum, semesterOrdinal, year } = ctx;

  if (cleanPath.startsWith("/branch/") && branchInfo && semesterNum) {
    return `BPUT ${branchInfo.name} (${branchInfo.code}) ${semesterOrdinal} Sem PYQ | GetPYQ`;
  }

  if (cleanPath === "/browse" && (branchInfo || branchRaw || semesterNum || year)) {
    const parts: string[] = [];
    if (branchInfo) {
      parts.push(`${branchInfo.code}`);
    } else if (branchRaw) {
      parts.push(branchRaw);
    }
    if (semesterNum) {
      parts.push(`${semesterOrdinal} Sem`);
    }
    if (year) {
      parts.push(year);
    }
    if (parts.length > 0) {
      return `BPUT ${parts.join(" ")} Previous Year Question Papers PDF | GetPYQ`;
    }
  }

  return baseTitle;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  jsonLd,
  breadcrumbs,
  noIndex = false,
  branch,
  semester,
  year,
  examType,
  searchQuery,
}: SEOHeadProps) {
  const location = useLocation();

  const pageContext = React.useMemo(
    () =>
      resolvePageContext(location.pathname, location.search, {
        branch,
        semester,
        year,
        examType,
        searchQuery,
      }),
    [location.pathname, location.search, branch, semester, year, examType, searchQuery]
  );

  const resolvedTitle = React.useMemo(
    () => buildDynamicTitle(pageContext, title),
    [pageContext, title]
  );

  const resolvedDescription = React.useMemo(
    () => buildDynamicDescription(pageContext, description, noIndex),
    [pageContext, description, noIndex]
  );

  // Dynamically merge path-specific & branch/semester meta keywords with any explicit page keywords
  const resolvedKeywords = React.useMemo(() => {
    const pathTerms = buildDynamicRouteKeywords(pageContext);
    const baseList = (keywords || DEFAULT_KEYWORDS)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const combined: string[] = [];

    for (const term of [...pathTerms, ...baseList]) {
      const key = term.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(term);
      }
    }

    return combined.join(", ");
  }, [pageContext, keywords]);

  // Normalize canonical URL to always point to production origin
  const resolvedCanonical = React.useMemo(() => {
    if (canonicalUrl) {
      if (canonicalUrl.startsWith("http")) {
        try {
          const parsed = new URL(canonicalUrl);
          const cleanP = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
          return `${CANONICAL_ORIGIN}${cleanP}`;
        } catch {
          return canonicalUrl;
        }
      }
      const cleanRelative = canonicalUrl === "/" ? "/" : canonicalUrl.replace(/\/+$/, "");
      return `${CANONICAL_ORIGIN}${cleanRelative.startsWith("/") ? "" : "/"}${cleanRelative}`;
    }

    const cleanPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
    return `${CANONICAL_ORIGIN}${cleanPath}`;
  }, [canonicalUrl, location.pathname]);

  // Construct WebPage schema dynamically for current route & context
  const webPageSchema = React.useMemo(() => {
    if (noIndex) return null;
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: resolvedTitle,
      description: resolvedDescription,
      url: resolvedCanonical,
      keywords: resolvedKeywords,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_BRAND_NAME,
        url: `${CANONICAL_ORIGIN}/`,
      },
    };
  }, [noIndex, resolvedTitle, resolvedDescription, resolvedCanonical, resolvedKeywords]);

  // Construct BreadcrumbList schema if breadcrumbs are provided
  const breadcrumbSchema = React.useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, idx) => {
        const fullUrl = crumb.item.startsWith("http")
          ? crumb.item
          : `${CANONICAL_ORIGIN}${crumb.item.startsWith("/") ? "" : "/"}${crumb.item}`;
        return {
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.name,
          item: fullUrl,
        };
      }),
    };
  }, [breadcrumbs]);

  // Consolidate JSON-LD schemas
  const structuredDataList = React.useMemo(() => {
    const list: Array<Record<string, any>> = [];
    if (webPageSchema) {
      list.push(webPageSchema);
    }
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        list.push(...jsonLd);
      } else {
        list.push(jsonLd);
      }
    }
    if (breadcrumbSchema) {
      list.push(breadcrumbSchema);
    }
    return list;
  }, [webPageSchema, jsonLd, breadcrumbSchema]);

  return (
    <Helmet>
      {/* Primary Page Title and Core Meta */}
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta name="author" content="GetPYQ" />

      {/* Crawlers & Search Engine Directives */}
      {noIndex ? (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
          <meta name="bingbot" content="noindex, nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={resolvedCanonical} />

      {/* OpenGraph / Social Share Cards */}
      <meta property="og:site_name" content={SITE_BRAND_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content={resolvedTitle} />

      {/* Twitter / X Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GetPYQ" />
      <meta name="twitter:creator" content="@GetPYQ" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={resolvedTitle} />
      <meta name="twitter:url" content={resolvedCanonical} />

      {/* Schema.org JSON-LD Structured Data */}
      {structuredDataList.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
