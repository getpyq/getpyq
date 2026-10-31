import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { listPYQs, getFilterOptions } from "../lib/api";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import FilterBar, { FilterState } from "../components/FilterBar";
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
    // Sync internal search field text when URL search param changes
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

  // Focus SEO strictly on Branch, Semester, and Year (NOT individual papers)
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

  // Master canonical URL for all browse filters
  const canonicalUrl = "https://getpyq.vercel.app/browse";

  // Do not index search term queries or paper filters to prevent Apps Script fetch bottlenecks
  const shouldNoIndex = Boolean(filters.search || (filters.paper && filters.paper !== "all"));

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
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-6 sm:pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="browse-page">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl={canonicalUrl}
        noIndex={shouldNoIndex}
        breadcrumbs={breadcrumbs}
      />
      {/* Header section fully centered */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          ✦ BPUT Academic Archive ✦
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          Browse BPUT PYQs
        </h1>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
          Instantly filter past papers, exam sheets, and solutions curated for BPUT University examinations
        </p>
      </div>

      {/* Full section-width Search Input Field positioned at the top of the filtering section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateFilter("search", search.trim());
        }}
        className="w-full mb-6 flex gap-2 items-center"
        data-testid="browse-search-form"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black font-semibold" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BPUT papers e.g. Math, CSE, Physics, OS..."
            className="w-full h-11 border-2 border-black rounded-xl pl-11 pr-4 bg-white text-black font-share text-xs sm:text-sm font-medium focus:outline-none shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] focus:shadow-[4.5px_4.5px_0px_rgba(0,0,0,1)] transition-all focus:scale-[1.002]"
            data-testid="browse-search-input"
          />
        </div>
        <button
          type="submit"
          className="w-11 sm:w-12 h-11 shrink-0 bg-[#F97316] hover:bg-[#2563EB] text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          title="Execute Search"
        >
          <Search className="w-4 h-4 text-white stroke-[2.5]" />
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
        <div className="mb-6 text-xs font-mono text-gray-500 font-bold select-none flex items-center justify-between">
          <span>Showing {data.length} {data.length === 1 ? "paper" : "papers"} total</span>
        </div>
      )}

      {/* Main Grid View */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <PYQCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="w-full bg-white border-2 border-black rounded-2xl p-8 sm:p-12 text-center shadow-[4px_4px_0px_#000] animate-fade-in" data-testid="browse-empty">
            <Filter className="w-12 h-12 mx-auto mb-4 text-[#F97316] animate-bounce" />
            <p className="font-momo text-2xl font-bold mb-1 text-black">No matches found</p>
            <p className="text-gray-600 max-w-sm mx-auto text-sm leading-relaxed mb-6 font-semibold">
              Try clearing serial filters or search terms, or be the first to upload a custom PYQ!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white border-2 border-black rounded-lg px-6 py-3 text-xs font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:bg-[#F97316] hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-black text-white border-2 border-black rounded-lg px-6 py-3 text-xs font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:bg-[#F97316] hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Upload Custom PYQ
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in animate-staggered" data-testid="browse-grid">
            {data.map((p, idx) => (
              <PYQCard key={`${p.id || "pyq"}-${idx}`} pyq={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
