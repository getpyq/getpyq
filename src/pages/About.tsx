import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  Award, 
  Download,
  Share2,
  FileQuestion,
  UploadCloud,
  Layers,
  BookmarkCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  Code2
} from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function About() {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const GETPYQ_FEATURES = [
    {
      title: "Branch Wise Filtering",
      icon: Award,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      desc: "Quickly browse papers by CSE, ECE, Civil, Mechanical, Electrical, and more without scrolling through thousands of unrelated files."
    },
    {
      title: "Clean Document Reader",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      desc: "All question sheets are rendered inside a lightning-fast native PDF viewer directly on your screen. No annoying redirections or slow loads."
    },
    {
      title: "Crowdsourced Community Solutions",
      icon: Users,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      desc: "Don't just view the questions—see step-by-step math formulas, derivations, and solutions added by senior students or top academic peers."
    },
    {
      title: "Instant Direct PDF Downloads",
      icon: Download,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      desc: "Download genuine examination question papers with a single click directly to your phone, tablet, or laptop at full Google Drive speeds."
    },
    {
      title: "BPUT Student Paper Wishlist",
      icon: FileQuestion,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      desc: "Can't locate an exam paper? Submit a paper request so seniors and peers can upload the exact question sheet you need."
    },
    {
      title: "Instant WhatsApp Peer Sharing",
      icon: Share2,
      color: "text-green-600 bg-green-50 border-green-100",
      desc: "Share direct paper links straight to college and branch WhatsApp study groups with preformatted paper details and year tags."
    },
    {
      title: "Community Contribution Portal",
      icon: UploadCloud,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      desc: "Easily upload question papers from your recent semester exams to help juniors build the most comprehensive BPUT question bank."
    },
    {
      title: "Multi-Semester & Exam Filters",
      icon: Layers,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      desc: "Filter seamlessly by Year (2018–2025), Semester (1 to 8), Branch, and Exam Type (Regular, Back, or Special examinations)."
    },
    {
      title: "Offline Access & Local Bookmarks",
      icon: BookmarkCheck,
      color: "text-teal-600 bg-teal-50 border-teal-100",
      desc: "Bookmark papers instantly in your browser to study and revise anytime without needing to log in or create an account."
    }
  ];

  const FAQ_ITEMS = [
    {
      q: "Is there a charge to search or download exam papers?",
      a: "Absolutely not. All BPUT past papers, solutions, and filters are 100% free of charge. Our platform operates entirely as an open resource project for BPUT engineering students with zero fees."
    },
    {
      q: "Which university's papers are hosted on GetPYQ?",
      a: "GetPYQ is exclusively dedicated to BPUT (Biju Patnaik University of Technology, Odisha). All question papers, branches, semesters, and syllabus patterns hosted on the platform are strictly for BPUT-affiliated colleges and examinations."
    },
    {
      q: "How can I post a request if a question paper is missing?",
      a: "Simply navigate to the 'Request a Paper' tab on the navigation bar, choose your branch and semester, and submit your paper name. The request will appear live on the community board for peers to fulfill."
    },
    {
      q: "Can I contribute past papers that I have saved?",
      a: "Yes! Click the 'Upload PYQ' button on the top right, select or drag your PDF/image file, choose the matching department and semester, and publish it instantly to help batchmates."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 font-sans text-slate-900 flex-grow" data-testid="about-page">
      <SEOHead
        title="About GetPYQ – BPUT University Exam Archive & Community"
        description="Learn about GetPYQ, the free open student platform for BPUT (Biju Patnaik University of Technology) engineering previous year question papers and solutions."
        keywords="about getpyq, bput exam paper archive, bput student community, bput engineering pyq portal, biju patnaik university of technology past papers"
        canonicalUrl="https://getpyq.vercel.app/about"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "About GetPYQ", item: "/about" }
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          }))
        }}
      />

      {/* Header section */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-3 select-none">
          <Sparkles className="w-3.5 h-3.5" /> BPUT Academic Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 select-none tracking-tight leading-tight mb-2">
          About GetPYQ
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          An open-access academic initiative dedicated to making BPUT (Biju Patnaik University of Technology) engineering exam preparation transparent, completely free, and collaborative.
        </p>
      </div>

      {/* Main Philosophy Section */}
      <div className="grid md:grid-cols-12 gap-6 lg:gap-8 mb-12">
        <div className="md:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> Mission & Vision
          </h2>
          <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <p>
              As BPUT engineering students, we spend hours scouring random forums, sketchy WhatsApp groups, or overpriced paper booklets just to find basic previous year examination questions before semester tests.
            </p>
            <p>
              <strong className="text-slate-900 font-semibold">GetPYQ</strong> was launched to tear down those barriers. It is a completely free, crowd-sourced digital repository dedicated exclusively to BPUT (Biju Patnaik University of Technology) engineering students across all branches and semesters to contribute past papers, save materials offline, and collaborate.
            </p>
            <div className="border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-50/50 rounded-r-xl text-xs sm:text-sm font-medium text-emerald-950 italic">
              "No subscription fees. No invasive ads. No login required. Just BPUT engineering peers helping each other crush their semester exams."
            </div>
          </div>
        </div>

        <div className="md:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Core Values
            </h2>
            <div className="space-y-4">
              {[
                { title: "Universal Access", desc: "No registration forms or credit card walls. Direct access to all academic resources." },
                { title: "Genuine Clarity", desc: "All question sheets are processed as clean, highly readable PDF documents." },
                { title: "Peer Driven", desc: "Direct community feedback ensures correct year, subject, and branch classification." }
              ].map((val, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center border border-emerald-200/70">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-xs text-slate-900">{val.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 mt-6">
            <Link to="/browse" className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer">
              Explore the Archive
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="mb-14" data-testid="features-section">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase text-emerald-700 tracking-wider">Comprehensive Toolset</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            All Features of GetPYQ
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Engineered specifically to solve the academic challenges of BPUT engineering students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GETPYQ_FEATURES.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                    <item.icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Creator Container */}
      <section className="mb-14" data-testid="team-section">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-semibold uppercase text-emerald-700 tracking-wider">Meet The Developer</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Platform Creator
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300"
                    alt="Pabitra Khandual"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 bg-emerald-600 text-white text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full shadow-xs">
                  Verified
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Odisha, India
                  </span>
                </div>

                <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">
                  Pabitra Khandual
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Full-Stack Engineer & BPUT Alum
                </p>

                <p className="text-slate-500 text-xs leading-relaxed mt-3 font-normal">
                  Created GetPYQ to empower fellow BPUT engineering students with an ad-free, instant, and open-source platform. Committed to democratizing examination resources across all affiliated colleges in Odisha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mb-4" data-testid="faq-section">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Click question to expand
          </span>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = !!openFaqs[idx];
            return (
              <div 
                key={idx} 
                className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs transition-all hover:border-emerald-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold shrink-0">Q.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 bg-slate-50/40 border-t border-slate-100">
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-4 border-l-2 border-emerald-500 font-normal">
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
  );
}
