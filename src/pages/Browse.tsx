import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { listPYQs, getFilterOptions } from "../lib/api";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import FilterBar from "../components/FilterBar";
import SEOHead from "../components/SEOHead";
import { PYQ, FilterOptionsResponse } from "../types";

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<FilterOptionsResponse>({
    branches: [],
    papers: [],
    semesters: [],
    years: [],
    exam_types: []
  });
  const [search, setSearch] = useState(params.get("search") || "");

  const filters = useMemo(() => ({
    branch: params.get("branch") || "all",
    paper: params.get("paper") || "all",
    semester: params.get("semester") || "all",
    year: params.get("year") || "all",
    exam_type: params.get("exam_type") || "all",
    sort: params.get("sort") || "recent",
    search: params.get("search") || "",
  }), [params]);

  useEffect(() => {
    getFilterOptions().then(setOptions).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    listPYQs(filters)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    setSearch(params.get("search") || "");
  }, [params]);

  const updateFilter = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === "all") {
      next.delete(k);
    } else {
      next.set(k, v);
    }
    setParams(next);
  };

  const clearAll = () => {
    setParams(new URLSearchParams());
    setSearch("");
  };

  const pageTitle = useMemo(() => {
    const parts: string[] = [];
    if (filters.branch && filters.branch !== "all") parts.push(filters.branch);
    if (filters.semester && filters.semester !== "all") parts.push(`Semester ${filters.semester}`);
    if (filters.year && filters.year !== "all") parts.push(filters.year);
    if (parts.length > 0) {
      return `BPUT ${parts.join(" - ")} Question Papers PDF | GetPYQ`;
    }
    return "BPUT Question Papers PDF – B.Tech Branches & Semesters | GetPYQ";
  }, [filters.branch, filters.semester, filters.year]);

  const pageDescription = useMemo(() => {
    const branchText = filters.branch && filters.branch !== "all" ? ` for ${filters.branch} engineering` : " for all B.Tech branches (CSE, ECE, EE, Civil, Mechanical)";
    const semText = filters.semester && filters.semester !== "all" ? ` Semester ${filters.semester}` : " (1st to 8th semester)";
    const yearText = filters.year && filters.year !== "all" ? ` from ${filters.year}` : "";
    return `Download official BPUT university previous year question papers PDF${branchText}${semText}${yearText}. Free regular and back-paper PYQs on GetPYQ.`;
  }, [filters.branch, filters.semester, filters.year]);

  const pageKeywords = useMemo(() => {
    const base = "BPUT question papers, BPUT PYQ PDF, BPUT exam papers, BPUT engineering questions, BPUT university past papers";
    if (filters.branch && filters.branch !== "all") {
      return `BPUT ${filters.branch} question papers, BPUT ${filters.branch} PYQ PDF, BPUT ${filters.branch} semester papers, ${base}`;
    }
    return `BPUT B.Tech question papers, BPUT CSE question papers, BPUT ECE papers, BPUT Mechanical papers, BPUT Civil papers, ${base}`;
  }, [filters.branch]);

  const canonicalUrl = "https://getpyq.vercel.app/browse";
  // Index only the clean canonical /browse page, noindex filtered query combinations
  const shouldNoIndex = Boolean(
    filters.search ||
    (filters.semester && filters.semester !== "all") ||
    (filters.year && filters.year !== "all") ||
    (filters.paper && filters.paper !== "all") ||
    (filters.branch && filters.branch !== "all") ||
    (filters.exam_type && filters.exam_type !== "all")
  );

  const breadcrumbs = useMemo(() => {
    const list = [
      { name: "Home", item: "/" },
      { name: "B.Tech Question Papers", item: "/browse" },
    ];
    if (filters.branch && filters.branch !== "all") {
      list.push({ name: filters.branch, item: `/browse?branch=${encodeURIComponent(filters.branch)}` });
    }
    if (filters.semester && filters.semester !== "all") {
      list.push({
        name: `Sem ${filters.semester}`,
        item: filters.branch && filters.branch !== "all"
          ? `/browse?branch=${encodeURIComponent(filters.branch)}&semester=${filters.semester}`
          : `/browse?semester=${filters.semester}`
      });
    }
    if (filters.year && filters.year !== "all") {
      list.push({ name: filters.year, item: `/browse?year=${filters.year}` });
    }
    return list;
  }, [filters.branch, filters.semester, filters.year]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 font-sans text-slate-900 flex-grow" data-testid="browse-page">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl={canonicalUrl}
        noIndex={shouldNoIndex}
        breadcrumbs={breadcrumbs}
      />

      {/* Header section */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-3 select-none">
          ✦ BPUT Academic Archive ✦
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 select-none tracking-tight leading-tight mb-2">
          Browse BPUT PYQs
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Instantly filter past papers, exam sheets, and solutions curated for BPUT University examinations
        </p>
      </div>

      {/* Full-width Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateFilter("search", search.trim());
        }}
        className="w-full mb-6 flex gap-2 items-center"
        data-testid="browse-search-form"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-medium" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BPUT papers e.g. Math, CSE, Physics, OS..."
            className="w-full h-11 border border-slate-200/90 rounded-full pl-11 pr-4 bg-white text-slate-900 text-xs sm:text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-xs transition-all"
            data-testid="browse-search-input"
          />
        </div>
        <button
          type="submit"
          className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 shrink-0"
          title="Execute Search"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Filter Section Bar */}
      <FilterBar
        filters={filters}
        options={options}
        onChangeFilter={(k, v) => updateFilter(k as string, v)}
        onReset={clearAll}
        totalResults={data.length}
        loading={loading}
      />

      {!loading && data.length > 0 && (
        <div className="mb-4 text-xs text-slate-400 font-medium select-none flex items-center justify-between">
          <span>Showing {data.length} {data.length === 1 ? "paper" : "papers"} total</span>
        </div>
      )}

      {/* Main Grid View */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <PYQCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center shadow-xs" data-testid="browse-empty">
            <Filter className="w-10 h-10 mx-auto mb-3 text-emerald-600 animate-pulse" />
            <p className="text-xl font-bold text-slate-900 mb-1">No matches found</p>
            <p className="text-slate-500 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed mb-6">
              Try adjusting your search terms or filters, or be the first to contribute a custom PYQ!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Reset Search Filters
              </button>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Upload Custom PYQ
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="browse-grid">
            {data.map((p, idx) => (
              <PYQCard key={`${p.id || "pyq"}-${idx}`} pyq={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
