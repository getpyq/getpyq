import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Library, Download, ThumbsUp, GraduationCap, Sparkles, Upload as UploadIcon, Filter, X, FileQuestion } from "lucide-react";
import { getStats, listPYQs, getFilterOptions } from "../lib/api";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import FilterBar, { FilterState } from "../components/FilterBar";
import { PYQ, GetStatsResponse, FilterOptionsResponse } from "../types";
const HERO_IMG = "/assets/images/hero.png";

const COMMUNITY_IMG = "/assets/images/banner.png";

const BRANCH_TABS = [
  {
    id: "all",
    label: "All Branches",
    short: "ALL",
    apiValue: "all",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#EFF6FF]",
    borderColor: "border-[#2563EB]"
  },
  {
    id: "cse",
    label: "Computer Science",
    short: "CSE",
    apiValue: "CSE",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#ECFDF5]",
    borderColor: "border-[#10B981]"
  },
  {
    id: "ece",
    label: "ECE / ETC",
    short: "ECE",
    apiValue: "ECE / ETC",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#F0F9FF]",
    borderColor: "border-[#0EA5E9]"
  },
  {
    id: "ee",
    label: "Electrical Eng",
    short: "EE",
    apiValue: "EE",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#FEF9C3]",
    borderColor: "border-[#EAB308]"
  },
  {
    id: "me",
    label: "Mechanical Eng",
    short: "ME",
    apiValue: "ME",
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#FAF5FF]",
    borderColor: "border-[#A855F7]"
  },
  {
    id: "civil",
    label: "Civil Engineering",
    short: "Civil",
    apiValue: "Civil",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#FFF7ED]",
    borderColor: "border-[#F97316]"
  },
  {
    id: "chemical",
    label: "Chemical Engineering",
    short: "Chemical",
    apiValue: "Chemical",
    image: "https://images.unsplash.com/photo-1541155079789-b1419df7f37b?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#F0FDFA]",
    borderColor: "border-[#0D9488]"
  },
  {
    id: "automobile",
    label: "Automobile Engineering",
    short: "Auto",
    apiValue: "Automobile",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#F0FDF4]",
    borderColor: "border-[#16A34A]"
  },
  {
    id: "metallurgy",
    label: "Material & Metallurgy",
    short: "Metallurgy",
    apiValue: "Material & Metallurgy",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400",
    color: "bg-[#FAFAF9]",
    borderColor: "border-[#78716C]"
  }
];

import SEOHead from "../components/SEOHead";

export default function Home() {
  const [stats, setStats] = useState<GetStatsResponse>({ total_pyqs: 0, total_branches: 0, total_downloads: 0, total_upvotes: 0 });
  const [recentPapers, setRecentPapers] = useState<PYQ[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const [homeFilters, setHomeFilters] = useState({
    branch: "all",
    semester: "all",
    paper: "all",
    year: "all",
    exam_type: "all",
    search: "",
  });
  const [filterSearchInput, setFilterSearchInput] = useState("");
  const [options, setOptions] = useState<FilterOptionsResponse>({
    branches: [],
    papers: [],
    semesters: [],
    years: [],
    exam_types: []
  });
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    getStats().then(setStats).catch((err) => console.error(err));
    getFilterOptions().then(setOptions).catch((err) => console.error(err));
    
    if (window.location.hash === "#community") {
      setTimeout(() => {
        const elem = document.getElementById("community");
        if (elem) elem.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  useEffect(() => {
    setLoadingRecent(true);
    listPYQs({ ...homeFilters, limit: 12 })
      .then((d) => {
        setRecentPapers(d);
        setLoadingRecent(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingRecent(false);
      });
  }, [homeFilters]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse${q.trim() ? `?search=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <div data-testid="home-page" className="bg-[#FAF9F6] min-h-screen">
      <SEOHead
        title="BPUT Previous Year Question Papers PDF | GetPYQ"
        description="Download BPUT previous year question papers for B.Tech branches, semesters and subjects. Explore regular and back-paper PYQs, organized for students."
        keywords="BPUT question papers, BPUT previous year papers, Biju Patnaik University of Technology question papers, BPUT Odisha papers, BPUT PYQ, BPUT B.Tech question papers, BPUT B.Tech 1st sem papers, BPUT B.Tech 2nd sem papers, BPUT B.Tech papers, BPUT BTech 1st sem papers, BPUT engineering question papers, BPUT CSE question papers, BPUT M.Tech papers, BPUT MBA papers, BPUT MCA papers, BPUT B.Pharm papers, bput pyq download, bput question paper pdf, ବିଜୁ ପଟ୍ଟନାୟକ ବୈଷୟିକ ବିଶ୍ୱବିଦ୍ୟାଳୟ question papers"
        canonicalUrl="https://getpyq.vercel.app/"
        ogImage="https://getpyq.vercel.app/favicon-512x512.png"
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-black bg-[#FAF9F6] px-3 sm:px-4 md:px-6 lg:px-0">
        <div className="w-full max-w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-[8%] py-8 lg:py-14 grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center relative">
          <div className="w-full min-w-0 z-10 text-black">
            <span className="inline-flex items-center gap-2 brutal-border bg-white px-3 py-1.5 rounded-full text-[10px] font-bold brutal-shadow-sm mb-6" data-testid="hero-badge">
               <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> BPUT University Exclusive • Free Access
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-[3.5rem] xl:text-[3.8rem] font-momo font-bold leading-[1.08] tracking-tight mb-4 text-black">
              BPUT <span className="text-[#2563EB]">Previous</span> <br />
              Year Questions,{" "}
              <span className="block sm:inline-block mt-2 sm:mt-0 bg-[#F97316] text-white px-3 sm:px-4 py-1 sm:py-1.5 -rotate-1 brutal-border font-momo font-bold w-fit">
                decoded.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-700 mt-4 sm:mt-6 max-w-xl leading-relaxed">
              The dedicated community library for BPUT (Biju Patnaik University of Technology) engineering students. Browse past papers by branch, semester & exam type.
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
              <Link to="/browse" data-testid="hero-browse-link" className="bg-[#F97316] text-white border-2 border-black rounded-lg px-3 sm:px-6 py-3.5 text-xs sm:text-sm font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center flex items-center justify-center gap-2 w-full sm:w-auto transition-all">
                <Library className="w-4 h-4 stroke-[2.5]" />
                <span>Browse PYQs</span>
              </Link>
              <Link to="/upload" data-testid="hero-upload-link" className="bg-white text-black border-2 border-black rounded-lg px-3 sm:px-6 py-3.5 text-xs sm:text-sm font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:bg-gray-100 hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center flex items-center justify-center gap-2 w-full sm:w-auto transition-all">
                <UploadIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Upload PYQ</span>
              </Link>
            </div>
          </div>

          <div className="w-full min-w-0 mt-4 md:mt-0 flex items-center justify-center p-0">
            <img 
              src={HERO_IMG} 
              alt="BPUT Engineering Students Preparing PYQ Exam Papers" 
              className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-full h-auto max-h-[300px] sm:max-h-[360px] md:max-h-[420px] lg:max-h-[540px] object-contain drop-shadow-none mx-auto" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </div>
      </section>



      {/* Recent PYQs Block */}
      <section id="recent-pyqs" className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] py-10 lg:py-12 font-share text-black">
        {/* Centered Head Header segment */}
        <div className="text-center max-w-2xl mx-auto mb-8 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
            ✦ BPUT Exam Archive ✦
          </span>
          <h2 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none">
            Recent BPUT PYQs
          </h2>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
            Search and filter BPUT University question papers uploaded by the student community
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setHomeFilters((prev) => ({ ...prev, search: filterSearchInput.trim() }));
            }}
            className="w-full max-w-md mt-6 flex gap-2 items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black font-semibold" />
              <input
                value={filterSearchInput}
                onChange={(e) => setFilterSearchInput(e.target.value)}
                placeholder="Search BPUT papers e.g. Math, DSA, OS, Thermodynamics..."
                className="w-full h-11 border-2 border-black rounded-xl pl-11 pr-4 bg-white text-black font-share text-xs sm:text-sm font-medium focus:outline-none shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] focus:shadow-[4.5px_4.5px_0px_rgba(0,0,0,1)] transition-all focus:scale-[1.01]"
                title="Search and filter recent BPUT papers"
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
        </div>

        {/* Home dynamic filter selectors container */}
        <FilterBar
          filters={homeFilters}
          options={options}
          onChangeFilter={(k, v) => setHomeFilters((prev) => ({ ...prev, [k]: v }))}
          onReset={() => {
            setHomeFilters({
              branch: "all",
              semester: "all",
              paper: "all",
              year: "all",
              exam_type: "all",
              search: "",
            });
            setFilterSearchInput("");
          }}
          totalResults={recentPapers.length}
          loading={loadingRecent}
        />

        {/* Loading / Results Layout */}
        {loadingRecent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <PYQCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : recentPapers.length === 0 ? (
          <div className="w-full bg-white border-2 border-black rounded-2xl p-8 sm:p-12 text-center shadow-[4px_4px_0px_#000] animate-fade-in" data-testid="home-empty">
            <Filter className="w-12 h-12 mx-auto mb-4 text-[#F97316] animate-bounce" />
            <p className="font-momo text-2xl font-bold mb-1 text-black">No matches found</p>
            <p className="text-gray-600 max-w-sm mx-auto text-sm leading-relaxed mb-6 font-semibold">
              Try clearing serial filters or search terms, or be the first to upload a custom PYQ!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setHomeFilters({
                    branch: "all",
                    semester: "all",
                    paper: "all",
                    year: "all",
                    exam_type: "all",
                    search: "",
                  });
                  setFilterSearchInput("");
                }}
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
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in animate-staggered" data-testid="trending-grid">
              {recentPapers.map((p, idx) => <PYQCard key={`${p.id || "pyq"}-${idx}`} pyq={p} />)}
            </div>

            <div className="mt-12 text-center animate-fade-in">
              <Link to="/browse" className="inline-flex items-center gap-2 bg-black text-white border-2 border-black rounded-lg px-6 py-3.5 text-xs sm:text-sm font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:bg-[#2563EB] hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer">
                Explore Full Library <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Request a Paper Callout Banner */}
      <section className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pb-12">
        <div className="bg-[#2563EB] text-white border-2 border-black p-6 sm:p-8 rounded-2xl shadow-[5px_5px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black text-xs font-black px-3 py-1 rounded-full border border-black shadow-[1.5px_1.5px_0px_#000] uppercase">
              <FileQuestion className="w-3.5 h-3.5 stroke-[2.5]" />
              Need a Missing BPUT Paper?
            </span>
            <h3 className="text-2xl sm:text-3xl font-momo font-bold tracking-tight text-white uppercase">
              Can't Find Your BPUT Question Paper?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm font-semibold leading-relaxed">
              Post a paper request on our community wishlist with your BPUT branch, semester and exam details so fellow students or seniors can upload matching materials for you.
            </p>
          </div>

          <Link
            to="/requests"
            className="inline-flex items-center gap-2 bg-[#F97316] text-white border-2 border-black rounded-xl px-6 py-3.5 text-xs sm:text-sm font-black shadow-[3.5px_3.5px_0px_#000] hover:bg-white hover:text-black hover:scale-[1.02] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0 relative z-10"
            data-testid="home-request-paper-btn"
          >
            Post / View Requests <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>

      {/* Benefits Collaboration Section */}
      <section className="bg-white border-t-2 border-black" id="community">
        <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] py-10 lg:py-12 grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#2563EB] brutal-border rounded-2xl rotate-2" />
            <img src={COMMUNITY_IMG} alt="Engineering students collaborating" className="relative w-full h-[280px] sm:h-[320px] md:h-[350px] lg:h-[380px] object-cover rounded-2xl brutal-border" referrerPolicy="no-referrer" />
          </div>
          <div className="text-black font-share">
            <h2 className="text-2xl sm:text-3xl font-momo font-bold text-black select-none">
              Built by BPUT students • For BPUT students
            </h2>
            <p className="text-gray-700 mt-4 text-xs sm:text-sm font-semibold leading-relaxed">
              Every PYQ on GetPYQ is contributed by BPUT engineering students like you. Upload a paper. Save what helps. Drop a solution. The library grows every semester.
            </p>
            <ul className="mt-6 space-y-3 text-xs sm:text-sm font-semibold text-gray-800">
              {["Filter by branch, paper, semester & year", "Bookmark papers locally — no account needed", "Crowd-sourced solutions section", "Track most-downloaded and trending papers"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-md bg-[#F97316] border-2 border-black flex items-center justify-center text-white text-xs font-black">✓</span> {t}
                </li>
              ))}
            </ul>
            <Link to="/upload" className="inline-flex items-center gap-2 mt-8 bg-black text-white border-2 border-black rounded-lg px-6 py-3.5 font-share font-bold text-xs hover:bg-[#F97316] hover:scale-102 hover:-translate-y-0.5 transition-all shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5" data-testid="community-cta-upload">
              Contribute a PYQ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
