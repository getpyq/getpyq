import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Sparkles,
  Upload as UploadIcon,
  Filter,
  FileQuestion,
  CheckCircle2,
  GraduationCap,
  Code2,
  Cpu,
  Zap,
  Cog,
  Building2,
  BrainCircuit,
  Gauge,
  FlaskConical,
  Car,
  Layers,
  Dna,
  ChevronRight,
} from "lucide-react";
import { getStats, listPYQs, getFilterOptions } from "../lib/api";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import FilterBar from "../components/FilterBar";
import { PYQ, GetStatsResponse, FilterOptionsResponse } from "../types";
import SEOHead from "../components/SEOHead";

const HERO_IMG = "/assets/aistudio/Students_Collaborating_Around_a_Laptop_c243226f.png";
const COMMUNITY_IMG = "/assets/images/banner.png";

const MARQUEE_BRANCHES_ROW_1 = [
  { name: "Computer Science", code: "CSE", slug: "cse", icon: Code2, iconBox: "bg-blue-50 text-blue-600 border-blue-200/70" },
  { name: "Electronics & Telecomm", code: "ECE / ETC", slug: "ece", icon: Cpu, iconBox: "bg-sky-50 text-sky-600 border-sky-200/70" },
  { name: "Electrical Engineering", code: "EE", slug: "ee", icon: Zap, iconBox: "bg-amber-50 text-amber-600 border-amber-200/70" },
  { name: "Mechanical Engineering", code: "ME", slug: "me", icon: Cog, iconBox: "bg-purple-50 text-purple-600 border-purple-200/70" },
  { name: "Civil Engineering", code: "Civil", slug: "civil", icon: Building2, iconBox: "bg-orange-50 text-orange-600 border-orange-200/70" },
  { name: "AI & Machine Learning", code: "CSE (AI & ML)", slug: "cse-aiml", icon: BrainCircuit, iconBox: "bg-indigo-50 text-indigo-600 border-indigo-200/70" },
];

const MARQUEE_BRANCHES_ROW_2 = [
  { name: "Electrical & Electronics", code: "EEE", slug: "eee", icon: Gauge, iconBox: "bg-yellow-50 text-yellow-700 border-yellow-200/70" },
  { name: "Chemical Engineering", code: "Chemical", slug: "chemical", icon: FlaskConical, iconBox: "bg-teal-50 text-teal-600 border-teal-200/70" },
  { name: "Automobile Engineering", code: "Automobile", slug: "automobile", icon: Car, iconBox: "bg-rose-50 text-rose-600 border-rose-200/70" },
  { name: "Material & Metallurgy", code: "Metallurgy", slug: "metallurgy", icon: Layers, iconBox: "bg-stone-100 text-stone-700 border-stone-200/80" },
  { name: "Biotechnology", code: "Biotech", slug: "biotech", icon: Dna, iconBox: "bg-emerald-50 text-emerald-700 border-emerald-200/70" },
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
    <div data-testid="home-page" className="bg-[#FAFAFA] min-h-screen font-sans">
      <SEOHead
        title="GetPYQ – BPUT Previous Year Question Papers (PYQ) PDF & Solutions"
        description="GetPYQ is the official community archive of BPUT (Biju Patnaik University of Technology) previous year question papers (PYQ), semester exam papers, syllabus and solution notes for all B.Tech branches."
        keywords="GetPYQ, getpyq, get pyq, bput pyq, pyq bput, bput, pyq, bput question papers, bput previous year question papers, bput exam papers, bput question paper download, bput sem 1 to sem 8 pyq, bput cse ece ee me civil questions, bput question bank, bput engineering pyq, biju patnaik university of technology exam papers, bput notes, bput syllabus, bput question paper 2024 2023 2022, ବିଜୁ ପଟ୍ଟନାୟକ ବୈଷୟିକ ବିଶ୍ୱବିଦ୍ୟାଳୟ question papers"
        canonicalUrl="https://getpyq.vercel.app/"
        ogImage="https://getpyq.vercel.app/favicon-512x512.png"
      />

      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-6 pb-10 sm:pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2.5 text-emerald-700" data-testid="hero-badge">
                <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-emerald-700">
                  Built By Students, For Students
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="font-cabinet text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.1] [text-wrap:balance]">
                  Crack Every BPUT Exam
                  <br />
                  Smarter with{" "}
                  <span
                    className="font-playpen text-emerald-600 font-bold text-[1.06em] inline-block relative"
                    style={{
                      fontFamily: '"Playpen Sans", cursive, sans-serif',
                    }}
                  >
                    GetPYQ
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 180 12"
                      className="absolute -bottom-1 left-0 w-full h-2.5 text-emerald-500/40 pointer-events-none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M3 8.5Q90 1 177 8.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="text-slate-900 font-black">.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl pt-2">
                  Stop hunting across broken links. Access verified BPUT previous year question papers, peer solutions, and semester PDFs for every engineering branch—100% free in one click.
                </p>
              </div>

              <div className="flex flex-row flex-nowrap sm:flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
                <Link
                  to="/browse"
                  data-testid="hero-browse-link"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-base rounded-full shadow-xs hover:shadow transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Browse PYQ Library</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  to="/upload"
                  data-testid="hero-upload-link"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-base rounded-full border border-slate-300 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <UploadIcon className="w-4 h-4 shrink-0" />
                  <span>Upload a Paper</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
              <img
                src={HERO_IMG}
                alt="GetPYQ Previous Year Questions for BPUT Students"
                referrerPolicy="no-referrer"
                className="w-full max-w-[680px] lg:max-w-none lg:w-[106%] lg:-mr-2 xl:-mr-6 h-auto object-contain select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2 Horizontal Opposite-Scrolling Branch Marquee Rows */}
      <section className="border-y border-slate-200/70 bg-[#FAFAFA] py-5 overflow-hidden select-none" aria-label="Branch shortcuts">
        <div className="space-y-3 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          {/* Row 1 - Scrolling Left */}
          <div className="flex w-max animate-marquee">
            {[0, 1].map((dupGroup) => (
              <div
                key={`r1-group-${dupGroup}`}
                className="flex items-center gap-3 pr-3"
                aria-hidden={dupGroup === 1 ? true : undefined}
              >
                {[...MARQUEE_BRANCHES_ROW_1, ...MARQUEE_BRANCHES_ROW_1].map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <Link
                      key={`r1-${dupGroup}-${b.code}-${idx}`}
                      to={`/branch/${b.slug}`}
                      tabIndex={dupGroup === 1 ? -1 : undefined}
                      title={`Browse BPUT ${b.name} (${b.code}) Question Papers`}
                      className="group inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${b.iconBox}`}>
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {b.code}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                          {b.name}
                        </span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Row 2 - Scrolling Right (Opposite Direction) */}
          <div className="flex w-max animate-marquee-reverse">
            {[0, 1].map((dupGroup) => (
              <div
                key={`r2-group-${dupGroup}`}
                className="flex items-center gap-3 pr-3"
                aria-hidden={dupGroup === 1 ? true : undefined}
              >
                {[...MARQUEE_BRANCHES_ROW_2, ...MARQUEE_BRANCHES_ROW_2].map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <Link
                      key={`r2-${dupGroup}-${b.code}-${idx}`}
                      to={`/branch/${b.slug}`}
                      tabIndex={dupGroup === 1 ? -1 : undefined}
                      title={`Browse BPUT ${b.name} (${b.code}) Question Papers`}
                      className="group inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${b.iconBox}`}>
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {b.code}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                          {b.name}
                        </span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            ))}
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
