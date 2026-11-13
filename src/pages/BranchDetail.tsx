import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Search,
  FileQuestion,
  Layers,
  ChevronRight,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { listPYQs } from "../lib/api";
import { PYQ } from "../types";
import { SEMESTERS } from "../lib/constants";
import { BRANCH_SEO_DATA, getBranchSEOInfo, BranchSEOInfo } from "../data/branchSeo";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import SEOHead from "../components/SEOHead";
import { matchesPaperSearch } from "../lib/search";

export default function BranchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  const branchInfo: BranchSEOInfo = useMemo(() => {
    return getBranchSEOInfo(slug || "cse") || BRANCH_SEO_DATA.cse;
  }, [slug]);

  const [papers, setPapers] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>(() => searchParams.get("semester") || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    listPYQs({ branch: branchInfo.code, limit: 100 })
      .then((data) => {
        setPapers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load branch papers:", err);
        setLoading(false);
      });
  }, [branchInfo.code]);

  // Filter papers by semester and robust keyword search
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchSem = selectedSemester === "all" || String(p.semester) === selectedSemester;
      const matchQuery = !searchQuery.trim() || matchesPaperSearch(p, searchQuery);
      return matchSem && matchQuery;
    });
  }, [papers, selectedSemester, searchQuery]);

  // Other engineering branches for cross-linking
  const otherBranches = useMemo(() => {
    return Object.values(BRANCH_SEO_DATA).filter((b) => b.slug !== branchInfo.slug);
  }, [branchInfo.slug]);

  const pageTitle = `BPUT ${branchInfo.name} (${branchInfo.code}) Question Papers | GetPYQ`;
  const pageDescription = `GetPYQ - BPUT Previous Year Question Papers PDF for ${branchInfo.name} (${branchInfo.code}) across 1st Sem to 8th Sem. Regular and back exam papers.`;
  const canonicalUrl = `https://getpyq.vercel.app/branch/${branchInfo.slug}`;

  // Rich FAQ Schema for Google SERP Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How can I download BPUT ${branchInfo.code} previous year question papers?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can download official BPUT ${branchInfo.name} question papers directly as PDFs on GetPYQ. Select your semester (Sem 1 to Sem 8), click on the paper name, and download in one click with zero paywalls.`
        }
      },
      {
        "@type": "Question",
        "name": `Which semesters are available for BPUT ${branchInfo.code}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `GetPYQ covers all 8 semesters for BPUT ${branchInfo.name}, including regular and back-paper examination questions from 2018 to 2025.`
        }
      },
      {
        "@type": "Question",
        "name": `Are solutions and answer keys available for BPUT ${branchInfo.code} question papers?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, many papers uploaded by verified BPUT student contributors and university mentors include handwritten solution notes, markings, and answer keys.`
        }
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `BPUT ${branchInfo.name} Question Papers Archive`,
    "description": pageDescription,
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "GetPYQ",
      "url": "https://getpyq.vercel.app/"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 font-sans text-slate-900 flex-grow" data-testid={`branch-page-${branchInfo.slug}`}>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={branchInfo.keywords}
        canonicalUrl={canonicalUrl}
        jsonLd={[collectionSchema, faqSchema]}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Engineering Branches", item: "/browse" },
          { name: branchInfo.code, item: `/branch/${branchInfo.slug}` }
        ]}
      />

      {/* Hero Header */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${branchInfo.accentBg}`}>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{branchInfo.code}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                BPUT University Syllabus
              </span>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                Sem 1 to Sem 8
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-cabinet font-extrabold text-slate-900 tracking-tight leading-tight">
              BPUT {branchInfo.name} Previous Year Question Papers
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {branchInfo.shortDesc} Free PDF downloads of past semester exam papers, question banks, regular &amp; back-papers for BPUT engineering students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-11 px-6 text-xs sm:text-sm font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <span>Contribute {branchInfo.code} Paper</span>
            </Link>
            <Link
              to={`/requests?branch=${encodeURIComponent(branchInfo.code)}`}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full h-11 px-5 text-xs font-semibold active:scale-95 transition-all"
            >
              <span>Request Missing Paper</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        {/* Semester Selection Pills */}
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2 uppercase tracking-wider">
            Filter by Semester:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSemester("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedSemester === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Semesters ({papers.length})
            </button>
            {SEMESTERS.map((sem) => {
              const semCount = papers.filter((p) => String(p.semester) === sem).length;
              return (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedSemester === sem
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Sem {sem} {semCount > 0 && <span className="opacity-75 text-[11px]">({semCount})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search within this branch */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${branchInfo.code} subjects (e.g. Mathematics, Algorithms, Dynamics)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Papers List */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-cabinet font-bold text-slate-900 flex items-center gap-2">
            <span>{branchInfo.code} Examination Papers</span>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {filteredPapers.length} {filteredPapers.length === 1 ? "paper" : "papers"}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PYQCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPapers.map((pyq) => (
              <PYQCard
                key={pyq.id}
                pyq={pyq}
                badgeLabel={`Sem ${pyq.semester}`}
                badgeTone="green"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-700">
              <FileQuestion className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">
              No {branchInfo.code} papers found matching this filter
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Be the first student to upload a {branchInfo.code} paper or submit a request for your peers.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2 text-xs font-semibold"
              >
                Upload Paper
              </Link>
              <Link
                to={`/requests?branch=${encodeURIComponent(branchInfo.code)}`}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-5 py-2 text-xs font-semibold"
              >
                Request Paper
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Browse by Semester (1st Sem to 8th Sem) — No hardcoded subjects, all PYQs loaded dynamically */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs mb-12">
        <h2 className="text-lg sm:text-xl font-cabinet font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span>BPUT {branchInfo.code} Question Papers by Semester (1st Sem – 8th Sem)</span>
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Select a semester to filter live BPUT {branchInfo.name} ({branchInfo.code}) regular &amp; back previous year question papers:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { sem: "1", label: "1st Sem" },
            { sem: "2", label: "2nd Sem" },
            { sem: "3", label: "3rd Sem" },
            { sem: "4", label: "4th Sem" },
            { sem: "5", label: "5th Sem" },
            { sem: "6", label: "6th Sem" },
            { sem: "7", label: "7th Sem" },
            { sem: "8", label: "8th Sem" },
          ].map((item) => {
            const active = selectedSemester === item.sem;
            return (
              <button
                key={item.sem}
                type="button"
                onClick={() => {
                  setSelectedSemester(item.sem);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  active
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border-slate-200/80 hover:border-emerald-300"
                }`}
              >
                <span className="block text-xs font-bold">{branchInfo.code} {item.label}</span>
                <span className={`block text-[11px] mt-0.5 ${active ? "text-emerald-100" : "text-slate-500"}`}>
                  BPUT Semester {item.sem} PYQ
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Explore Other Branches */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-12">
        <h2 className="text-lg sm:text-xl font-cabinet font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Explore Other BPUT Engineering Branches</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {otherBranches.map((b) => (
            <Link
              key={b.slug}
              to={`/branch/${b.slug}`}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-2xl shadow-2xs transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${b.accentBg}`}>
                  {b.code}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 line-clamp-2 group-hover:text-emerald-800">
                {b.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) for Google Search Rich Snippet */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg sm:text-xl font-cabinet font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span>Frequently Asked Questions — BPUT {branchInfo.code}</span>
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              How can I download BPUT {branchInfo.code} previous year question papers?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You can download official BPUT {branchInfo.name} question papers directly as PDFs on GetPYQ. Select your semester (Sem 1 to Sem 8), click on the paper name, and download in one click with zero paywalls.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Which semesters are available for BPUT {branchInfo.code}?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              GetPYQ covers all 8 semesters for BPUT {branchInfo.name}, including regular and back-paper examination questions from 2018 to 2025.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Are solutions and answer keys available for BPUT {branchInfo.code} question papers?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, many papers uploaded by verified BPUT student contributors and university mentors include handwritten solution notes, markings, and answer keys.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
