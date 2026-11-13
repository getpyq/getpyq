import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Download,
  Share2,
  FileQuestion,
  UploadCloud,
  Layers,
  BookmarkCheck,
  ChevronDown,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Users,
  Mail,
  HelpCircle,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import { getStats } from "../lib/api";
import { GetStatsResponse } from "../types";

type CapabilityTab = "students" | "contributors";

const STUDENT_CAPABILITIES = [
  {
    title: "Branch & Semester Precision Filtering",
    tag: "Core Navigation",
    icon: Layers,
    featured: true,
    desc: "Jump directly to CSE, CSE (AI & ML), ECE, EE, EEE, Mechanical, Civil, Chemical, Automobile, Metallurgy, or Biotechnology archives. Filter instantaneously by Semester (1 to 8), Exam Year, and Regular or Back paper type without wading through clutter.",
    actionLabel: "Browse by Branch",
    actionTo: "/browse",
  },
  {
    title: "Native In-Browser PDF Reader",
    tag: "Instant Preview",
    icon: FileText,
    featured: false,
    desc: "Inspect full question papers directly inside a fast, distraction-free reader before downloading—zero redirect loops or invasive popups.",
    actionLabel: "Try Reader",
    actionTo: "/browse",
  },
  {
    title: "Direct Google Drive Downloads",
    tag: "Zero Friction",
    icon: Download,
    featured: false,
    desc: "Download clean, verified exam PDFs with one click straight to your phone or laptop for offline exam-eve revision.",
    actionLabel: null,
    actionTo: null,
  },
  {
    title: "Community Paper Wishlist",
    tag: "Peer Support",
    icon: FileQuestion,
    featured: false,
    desc: "Missing a specific subject or year? Post a request on the live community board and upvote existing requests so seniors can fulfill them.",
    actionLabel: "Request a Paper",
    actionTo: "/requests",
  },
  {
    title: "Peer Solutions & Study Notes",
    tag: "Collaborative",
    icon: Users,
    featured: false,
    desc: "Access handwritten derivations, math solutions, and marking tips contributed alongside question papers by BPUT seniors.",
    actionLabel: null,
    actionTo: null,
  },
  {
    title: "Local Bookmarks & Group Sharing",
    tag: "Study Workflow",
    icon: BookmarkCheck,
    featured: false,
    desc: "Save important papers locally in your browser and share clean WhatsApp links straight to your college department study groups.",
    actionLabel: null,
    actionTo: null,
  },
];

const CONTRIBUTOR_CAPABILITIES = [
  {
    title: "Automated GetPYQ PDF Footer Stamping",
    tag: "Built-In PDF Tool",
    icon: FileText,
    featured: true,
    desc: "Every uploaded PDF is automatically processed in your browser to add a clean, clickable GetPYQ attribution footer before it reaches Google Drive—preserving original page clarity without manual editing.",
    actionLabel: "Upload a Paper",
    actionTo: "/upload",
  },
  {
    title: "Contributor Profile & Upload History",
    tag: "Credit System",
    icon: ShieldCheck,
    featured: false,
    desc: "Register with your BPUT Registration Number to receive a unique student serial ID and track every question paper you publish under your name.",
    actionLabel: "Go to Upload Portal",
    actionTo: "/upload",
  },
  {
    title: "Instant Wishlist Fulfillment",
    tag: "Help Juniors",
    icon: UploadCloud,
    featured: false,
    desc: "Check open student requests by branch and semester, upload the missing PDF, and automatically help hundreds of batchmates preparing for exams.",
    actionLabel: "View Open Requests",
    actionTo: "/requests",
  },
  {
    title: "OTP-Verified Account Recovery",
    tag: "Account Security",
    icon: CheckCircle2,
    featured: false,
    desc: "Sign in smoothly using either your email or BPUT Registration Number, backed by email OTP password reset verification.",
    actionLabel: null,
    actionTo: null,
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Find Your Exact Subject",
    desc: "Select your B.Tech branch, semester, and exam type—or type a subject keyword to locate matching BPUT papers in seconds.",
    icon: Search,
    linkText: "Open PYQ Library",
    to: "/browse",
  },
  {
    step: "02",
    title: "Preview or Download Free",
    desc: "Read the question sheet inline, review peer-submitted solutions, bookmark for later, or save the PDF directly to your device.",
    icon: BookOpen,
    linkText: "Browse All Branches",
    to: "/browse",
  },
  {
    step: "03",
    title: "Request or Contribute Back",
    desc: "Need an older paper? Post it on the Wishlist. Have exam sheets saved? Upload them in under a minute to credit your name.",
    icon: Share2,
    linkText: "Visit Wishlist Board",
    to: "/requests",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is there any fee to search, view, or download exam papers?",
    a: "Never. All BPUT previous year question papers, peer solutions, and branch filters on GetPYQ are 100% free with zero paywalls, zero subscriptions, and direct PDF downloads.",
  },
  {
    q: "Do I need an account just to browse or download question papers?",
    a: "No account is required to search, preview, bookmark, or download any question paper on GetPYQ. Student registration is only needed when you want to upload and publish papers as a credited contributor.",
  },
  {
    q: "Which university's papers are hosted on GetPYQ?",
    a: "GetPYQ is built exclusively for BPUT (Biju Patnaik University of Technology, Odisha). Every branch, semester structure (Sem 1–8), and exam category (Regular, Back, Special) is tailored to BPUT-affiliated engineering colleges.",
  },
  {
    q: "How do I request a paper that is not yet in the archive?",
    a: "Visit the Request Paper page from the top menu, enter the subject name, branch, semester, and target exam year. Your request goes live on the community wishlist where peers and seniors can upvote or upload the matching PDF.",
  },
  {
    q: "How can I contribute past exam papers to help other students?",
    a: "Click Upload PYQ in the navigation bar, sign in with your student contributor account, select your PDF file, choose the matching branch and semester, and submit. The platform automatically stamps a clean GetPYQ reference footer and publishes it directly.",
  },
];

export default function About() {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });
  const [activeTab, setActiveTab] = useState<CapabilityTab>("students");
  const [stats, setStats] = useState<GetStatsResponse>({
    total_pyqs: 0,
    total_branches: 0,
    total_downloads: 0,
    total_upvotes: 0,
  });

  useEffect(() => {
    getStats()
      .then((res) => setStats(res))
      .catch(() => {});
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const capabilities =
    activeTab === "students" ? STUDENT_CAPABILITIES : CONTRIBUTOR_CAPABILITIES;

  return (
    <div
      className="bg-[#FAFBFD] min-h-screen font-sans text-slate-900 flex-grow"
      data-testid="about-page"
    >
      <SEOHead
        title="About GetPYQ – BPUT University Exam Archive & Community"
        description="Learn about GetPYQ, the free open student platform for BPUT (Biju Patnaik University of Technology) engineering previous year question papers and solutions."
        keywords="about getpyq, bput exam paper archive, bput student community, bput engineering pyq portal, biju patnaik university of technology past papers"
        canonicalUrl="https://getpyq.vercel.app/about"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "About GetPYQ", item: "/about" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12 md:space-y-14">
        {/* Compact Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            About{" "}
            <span
              className="font-playpen text-[#059669]"
              style={{ fontFamily: '"Playpen Sans", cursive, sans-serif' }}
            >
              GetPYQ
            </span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            An open academic archive dedicated to making BPUT engineering exam preparation structured, accessible, and free.
          </p>
        </div>

        {/* Live Repository Proof Strip */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70">
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500">
                Indexed Question Papers
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold font-cabinet text-slate-900 mt-1 tabular-nums">
                {stats.total_pyqs > 0 ? `${stats.total_pyqs}+` : "100+"}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500">
                Engineering Branches
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold font-cabinet text-slate-900 mt-1 tabular-nums">
                {stats.total_branches > 0 ? stats.total_branches : 11}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500">
                Community Downloads
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold font-cabinet text-emerald-700 mt-1 tabular-nums">
                {stats.total_downloads > 0
                  ? `${stats.total_downloads.toLocaleString()}+`
                  : "1,000+"}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500">
                Student Access Cost
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold font-cabinet text-slate-900 mt-1 tabular-nums">
                ₹0{" "}
                <span className="text-xs font-sans font-semibold text-slate-500">
                  / Always Free
                </span>
              </p>
            </div>
          </div>

        {/* Section 1: Mission & Core Principles */}
        <section className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-2">
                Our Story & Purpose
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Why we built a dedicated BPUT archive
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Before every BPUT semester examination, students lose hours
                  digging through outdated blog links, unorganized WhatsApp
                  forwards, or overpriced photocopied booklets just to verify
                  previous question patterns.
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">
                    GetPYQ
                  </strong>{" "}
                  replaces that chaos with one structured, community-verified
                  repository built specifically around BPUT&apos;s branch and
                  semester structure—from 1st-semester fundamentals through
                  8th-semester electives.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 sm:p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
              &ldquo;No subscription fees. No invasive popups. Just clean,
              verified previous year question papers shared by BPUT peers so
              everyone walks into the exam hall prepared.&rdquo;
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-2">
                Operating Principles
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                What guides every paper
              </h2>

              <div className="divide-y divide-slate-100">
                {[
                  {
                    num: "01",
                    title: "Open Access Without Paywalls",
                    desc: "Browse, preview, bookmark, and download every PDF freely with zero login barriers for readers.",
                  },
                  {
                    num: "02",
                    title: "Verified Branch & Exam Tagging",
                    desc: "Every sheet is indexed by Branch, Semester (1–8), Academic Year, and Regular or Back exam type.",
                  },
                  {
                    num: "03",
                    title: "Standardized Readable PDFs",
                    desc: "Uploaded papers receive a lightweight, clickable GetPYQ attribution footer while preserving scan sharpness.",
                  },
                ].map((item) => (
                  <div key={item.num} className="py-4 first:pt-1 last:pb-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums shrink-0">
                        {item.num}.
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                100% Independent Student Project
              </span>
              <Link
                to="/disclaimer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <span>Read Disclaimer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: How GetPYQ Works (3-Step Workflow) */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-1.5">
                Student Workflow
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                From search to exam prep in three steps
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Designed for speed—especially the night before your semester paper.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200/80 hover:border-emerald-300/80 rounded-2xl p-6 shadow-xs transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                      Step {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center justify-center">
                      <item.icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Interactive Platform Capabilities Bento Showcase */}
        <section data-testid="features-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-1.5">
                Platform Capabilities
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Engineered for BPUT engineering students
              </h2>
            </div>

            {/* Interactive Segmented Control */}
            <div
              className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200/70 rounded-xl self-start sm:self-auto shrink-0"
              role="tablist"
              aria-label="Platform capabilities view"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "students"}
                onClick={() => setActiveTab("students")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "students"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For Students
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "contributors"}
                onClick={() => setActiveTab("contributors")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "contributors"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For Contributors
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className={`bg-white border border-slate-200/80 hover:border-emerald-300/80 rounded-2xl p-6 shadow-xs transition-colors flex flex-col justify-between ${
                  item.featured ? "sm:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-medium text-slate-500">
                      {item.tag}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 text-emerald-700 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {item.actionLabel && item.actionTo && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                      to={item.actionTo}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Platform Creator */}
        <section data-testid="team-section">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0f172b] via-[#132a3e] to-[#059669] text-white flex items-center justify-center shrink-0 shadow-sm border border-slate-200/60"
                  aria-hidden="true"
                >
                  <span className="font-cabinet text-2xl sm:text-3xl font-extrabold tracking-tight">
                    PK
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold text-emerald-700">
                      Platform Creator
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Odisha, India</span>
                    <span aria-hidden="true">·</span>
                    <span>BPUT Engineering Alum</span>
                  </div>

                  <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">
                    Pabitra Khandual
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2 max-w-2xl font-normal">
                    Full-Stack Engineer who built GetPYQ to give BPUT students a
                    clean, reliable, ad-free place to access past exam papers
                    and share study resources across all affiliated colleges in
                    Odisha.
                  </p>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-2.5 shrink-0">
                <Link
                  to="/contact"
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-xs font-semibold transition-all active:scale-95 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Support</span>
                </Link>
                <Link
                  to="/browse"
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-full px-5 py-2.5 text-xs font-semibold transition-all active:scale-95 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Explore Archive</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Frequently Asked Questions */}
        <section data-testid="faq-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-1.5">
                Common Questions
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5 tracking-tight">
                <HelpCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>Frequently Asked Questions</span>
              </h2>
            </div>

            <Link
              to="/contact"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Have another question? Message us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = !!openFaqs[idx];
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-slate-900 flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums shrink-0">
                        0{idx + 1}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full border border-slate-200/80 flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-7 font-normal max-w-4xl">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
