import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Library, Sparkles, Upload as UploadIcon, Filter, FileQuestion, CheckCircle2, ChevronRight } from "lucide-react";
import { getStats, listPYQs, getFilterOptions } from "../lib/api";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import FilterBar from "../components/FilterBar";
import { PYQ, GetStatsResponse, FilterOptionsResponse } from "../types";
import SEOHead from "../components/SEOHead";

const HERO_IMG = "/assets/aistudio/Students_Collaborating_Around_a_Laptop_c243226f.png";
const COMMUNITY_IMG = "/assets/images/banner.png";

const MARQUEE_BRANCHES_ROW_1 = [
  { name: "Computer Science", code: "CSE", slug: "cse", color: "bg-blue-50/90 text-blue-700 border-blue-200/80 hover:bg-blue-100" },
  { name: "Electronics & Telecomm", code: "ECE / ETC", slug: "ece", color: "bg-sky-50/90 text-sky-700 border-sky-200/80 hover:bg-sky-100" },
  { name: "Electrical Eng", code: "EE", slug: "ee", color: "bg-amber-50/90 text-amber-700 border-amber-200/80 hover:bg-amber-100" },
  { name: "Mechanical Eng", code: "ME", slug: "me", color: "bg-purple-50/90 text-purple-700 border-purple-200/80 hover:bg-purple-100" },
  { name: "Civil Engineering", code: "Civil", slug: "civil", color: "bg-orange-50/90 text-orange-700 border-orange-200/80 hover:bg-orange-100" },
  { name: "AI & Machine Learning", code: "CSE (AI & ML)", slug: "cse-aiml", color: "bg-indigo-50/90 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100" },
];

const MARQUEE_BRANCHES_ROW_2 = [
  { name: "Electrical & Electronics", code: "EEE", slug: "eee", color: "bg-yellow-50/90 text-yellow-800 border-yellow-200/80 hover:bg-yellow-100" },
  { name: "Chemical Engineering", code: "Chemical", slug: "chemical", color: "bg-teal-50/90 text-teal-700 border-teal-200/80 hover:bg-teal-100" },
  { name: "Automobile Eng", code: "Automobile", slug: "automobile", color: "bg-rose-50/90 text-rose-700 border-rose-200/80 hover:bg-rose-100" },
  { name: "Metallurgical Eng", code: "Material & Metallurgy", slug: "metallurgy", color: "bg-stone-50/90 text-stone-700 border-stone-200/80 hover:bg-stone-100" },
  { name: "Biotechnology", code: "Biotech", slug: "biotech", color: "bg-lime-50/90 text-lime-800 border-lime-200/80 hover:bg-lime-100" },
];

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
    <div data-testid="home-page" className="bg-[#FAFBFD] min-h-screen font-sans">
      <SEOHead
        title="GetPYQ – BPUT Previous Year Question Papers (PYQ) PDF & Solutions"
        description="GetPYQ is the official community archive of BPUT (Biju Patnaik University of Technology) previous year question papers (PYQ), semester exam papers, syllabus and solution notes for all B.Tech branches."
        keywords="GetPYQ, getpyq, get pyq, bput pyq, pyq bput, bput, pyq, bput question papers, bput previous year question papers, bput exam papers, bput question paper download, bput sem 1 to sem 8 pyq, bput cse ece ee me civil questions, bput question bank, bput engineering pyq, biju patnaik university of technology exam papers, bput notes, bput syllabus, bput question paper 2024 2023 2022, ବିଜୁ ପଟ୍ଟନାୟକ ବୈଷୟିକ ବିଶ୍ୱବିଦ୍ୟାଳୟ question papers"
        canonicalUrl="https://getpyq.vercel.app/"
        ogImage="https://getpyq.vercel.app/favicon-512x512.png"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20 border-b border-slate-200/70">
        {/* Ambient background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
          <div className="w-full min-w-0">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-5 shadow-xs" data-testid="hero-badge">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Free BPUT Exam Archive • All Engineering Branches</span>
            </div>

            {/* Headline */}
            <h1
              className="font-cabinet text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-[900] tracking-[-1px] lg:tracking-[-1.4px] text-[#0f172b] leading-[1.15] lg:leading-[63px] mb-5"
              style={{
                fontFamily: 'cabinetGrotesk, "cabinetGrotesk Fallback", "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: 900,
                color: '#0f172b',
              }}
            >
              BPUT Exam ki tension? <br />
              <span
                className="font-gochi text-4xl sm:text-5xl md:text-6xl lg:text-[63px] font-[400] tracking-[-1px] lg:tracking-[-1.4px] text-[#096] leading-[1.1] lg:leading-[70px] inline-block align-baseline mr-2.5"
                style={{
                  fontFamily: '"Gochi Hand", "Gochi Hand Fallback", "Gochi Hand", cursive, sans-serif',
                  fontWeight: 400,
                  color: '#096',
                }}
              >
                GetPYQ
              </span>
              <span className="inline-block">hai na.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mb-8 font-normal">
              GetPYQ is the modern, open community archive of BPUT (Biju Patnaik University of Technology) previous year question papers. Free PDF downloads of past semester exam papers for CSE, ECE, EE, Mechanical, Civil, and all engineering branches.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/browse"
                data-testid="hero-browse-link"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs shadow-emerald-600/25 hover:shadow-md transition-all duration-150 active:scale-95 flex items-center gap-2"
              >
                <Library className="w-4 h-4" />
                <span>Browse PYQ Library</span>
              </Link>
              <Link
                to="/upload"
                data-testid="hero-upload-link"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-150 active:scale-95 flex items-center gap-2"
              >
                <UploadIcon className="w-4 h-4 stroke-[2]" />
                <span>Upload a Paper</span>
              </Link>
              <Link
                to="/requests"
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700 px-3 py-2 transition-colors flex items-center gap-1"
              >
                <span>Request missing paper</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="w-full flex items-center justify-center relative">
            <div className="relative w-full max-w-[440px] sm:max-w-[500px] md:max-w-[560px]">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-2xl transform scale-90" />
              <img
                src={HERO_IMG}
                alt="GetPYQ Previous Year Questions for BPUT Students"
                className="relative w-full h-auto object-contain mx-auto drop-shadow-md hover:scale-[1.01] transition-transform duration-300 rounded-3xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2 Horizontal Opposite-Scrolling Branch Marquee Rows */}
      <section className="border-b border-slate-200/70 bg-white py-3.5 overflow-hidden select-none" aria-label="Branch shortcuts">
        <div className="space-y-2.5">
          {/* Row 1 - Scrolling Left */}
          <div className="flex w-max animate-marquee gap-3 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex items-center gap-2.5 px-2">
              {MARQUEE_BRANCHES_ROW_1.map((b) => (
                <Link
                  key={`r1-${b.code}`}
                  to={`/branch/${b.slug}`}
                  title={`BPUT ${b.name} (${b.code}) Previous Year Questions`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${b.color} shadow-2xs hover:shadow-xs active:scale-95`}
                >
                  <span>{b.code}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">• {b.name}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2.5 px-2" aria-hidden="true">
              {MARQUEE_BRANCHES_ROW_1.map((b, idx) => (
                <Link
                  key={`r1-dup-${b.code}-${idx}`}
                  to={`/branch/${b.slug}`}
                  tabIndex={-1}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${b.color} shadow-2xs hover:shadow-xs active:scale-95`}
                >
                  <span>{b.code}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">• {b.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2 - Scrolling Right (Opposite Direction!) */}
          <div className="flex w-max animate-marquee-reverse gap-3 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex items-center gap-2.5 px-2">
              {MARQUEE_BRANCHES_ROW_2.map((b) => (
                <Link
                  key={`r2-${b.code}`}
                  to={`/branch/${b.slug}`}
                  title={`BPUT ${b.name} (${b.code}) Previous Year Questions`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${b.color} shadow-2xs hover:shadow-xs active:scale-95`}
                >
                  <span>{b.code}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">• {b.name}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2.5 px-2" aria-hidden="true">
              {MARQUEE_BRANCHES_ROW_2.map((b, idx) => (
                <Link
                  key={`r2-dup-${b.code}-${idx}`}
                  to={`/branch/${b.slug}`}
                  tabIndex={-1}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${b.color} shadow-2xs hover:shadow-xs active:scale-95`}
                >
                  <span>{b.code}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">• {b.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent PYQs Section */}
      <section id="recent-pyqs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-3">
            ✦ BPUT Academic Archive ✦
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recent BPUT Question Papers
          </h2>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm leading-relaxed">
            Search and filter BPUT University question papers uploaded and verified by the student community
          </p>

          {/* Clean Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setHomeFilters((prev) => ({ ...prev, search: filterSearchInput.trim() }));
            }}
            className="w-full max-w-lg mt-6 flex gap-2 items-center mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={filterSearchInput}
                onChange={(e) => setFilterSearchInput(e.target.value)}
                placeholder="Search BPUT papers e.g. Math, DSA, OS, Thermodynamics..."
                className="w-full h-11 border border-slate-200 rounded-full pl-11 pr-4 bg-white text-slate-900 text-xs sm:text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-xs transition-all"
                title="Search and filter recent BPUT papers"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
              title="Execute Search"
            >
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* FilterBar */}
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

        {/* Loading / Cards Grid */}
        {loadingRecent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <PYQCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : recentPapers.length === 0 ? (
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center shadow-xs" data-testid="home-empty">
            <Filter className="w-10 h-10 mx-auto mb-3 text-emerald-600 animate-pulse" />
            <p className="text-xl font-bold text-slate-900 mb-1">No matching question papers</p>
            <p className="text-slate-500 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Try adjusting your branch or semester filters, or be the first to upload this paper for your classmates!
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
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Reset Filters
              </button>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Upload Paper
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="trending-grid">
              {recentPapers.map((p, idx) => (
                <PYQCard key={`${p.id || "pyq"}-${idx}`} pyq={p} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Full Library</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Community Request Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-emerald-700/15 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
              <FileQuestion className="w-3.5 h-3.5" />
              Need a Missing BPUT Paper?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Can't Find Your Question Paper?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Post a paper request on our community wishlist with your branch, semester, and subject details. Fellow students and seniors will upload matching materials.
            </p>
          </div>

          <Link
            to="/requests"
            className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-full px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 shrink-0 relative z-10"
            data-testid="home-request-paper-btn"
          >
            <span>Post / View Requests</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </Link>
        </div>
      </section>

      {/* Built for Students Section */}
      <section className="bg-white border-t border-slate-200/80 py-14" id="community">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img
              src={COMMUNITY_IMG}
              alt="Engineering students collaborating"
              className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover rounded-2xl border border-slate-200 shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-3">
              Student Initiative
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built by BPUT students • For BPUT students
            </h2>
            <p className="text-slate-600 mt-3 text-xs sm:text-sm leading-relaxed">
              Every past paper on GetPYQ is contributed by students just like you. No sign-up friction, no ad clutter, no paid subscriptions. Just direct academic materials when you need them most.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs sm:text-sm font-medium text-slate-700">
              {[
                "Organized by branch, semester, subject and exam year",
                "Instant PDF preview and direct downloading",
                "Permanent shareable URLs for sharing in WhatsApp class groups",
                "Community requests board for missing exam papers",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 mt-7 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-3 font-semibold text-xs transition-all shadow-xs active:scale-95"
              data-testid="community-cta-upload"
            >
              <span>Contribute a Question Paper</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
