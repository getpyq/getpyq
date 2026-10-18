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
  // FAQ accordion state: track which FAQ indices are expanded
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
      color: "text-blue-600 bg-blue-100 border-blue-300",
      desc: "Quickly browse papers by CSE, ECE, Civil, Mechanical, Electrical, and more without scrolling through thousands of unrelated files."
    },
    {
      title: "Clean Document Reader",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-100 border-emerald-300",
      desc: "All question sheets are rendered inside a lightning-fast native PDF viewer directly on your screen. No annoying redirections or slow loads."
    },
    {
      title: "Crowdsourced Community Solutions",
      icon: Users,
      color: "text-orange-600 bg-orange-100 border-orange-300",
      desc: "Don't just view the questions—see step-by-step math formulas, derivations, and solutions added by senior students or top academic peers."
    },
    {
      title: "Instant Direct PDF Downloads",
      icon: Download,
      color: "text-purple-600 bg-purple-100 border-purple-300",
      desc: "Download genuine examination question papers with a single click directly to your phone, tablet, or laptop at full Google Drive speeds."
    },
    {
      title: "BPUT Student Paper Wishlist",
      icon: FileQuestion,
      color: "text-amber-600 bg-amber-100 border-amber-300",
      desc: "Can't locate an exam paper? Submit a paper request so seniors and peers can upload the exact question sheet you need."
    },
    {
      title: "Instant WhatsApp Peer Sharing",
      icon: Share2,
      color: "text-green-600 bg-green-100 border-green-300",
      desc: "Share direct paper links straight to college and branch WhatsApp study groups with preformatted paper details and year tags."
    },
    {
      title: "Community Contribution Portal",
      icon: UploadCloud,
      color: "text-indigo-600 bg-indigo-100 border-indigo-300",
      desc: "Easily upload question papers from your recent semester exams to help juniors build the most comprehensive BPUT question bank."
    },
    {
      title: "Multi-Semester & Exam Filters",
      icon: Layers,
      color: "text-rose-600 bg-rose-100 border-rose-300",
      desc: "Filter seamlessly by Year (2018–2025), Semester (1 to 8), Branch, and Exam Type (Regular, Back, or Special examinations)."
    },
    {
      title: "Offline Access & Local Bookmarks",
      icon: BookmarkCheck,
      color: "text-teal-600 bg-teal-100 border-teal-300",
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
      a: "Simply head over to the Requests page from the top navigation. Click 'Post a PYQ Request', select your branch, semester, exam year, and subject name. Once posted, fellow students and contributors across BPUT colleges can view your request and upload the paper."
    },
    {
      q: "How can I contribute my own semester exam papers?",
      a: "Navigate to the Upload page. You can drag and drop your question paper PDF or clear images, enter the subject, branch, semester, and exam details, and click submit. Once processed, it becomes immediately available to the entire BPUT community."
    },
    {
      q: "What if a paper contains an error or copyrighted content?",
      a: "We take academic correctness and rights very seriously. If you spot a broken download link, blurry image, incorrect course code, or copyright issue, please visit our Report page or click the Report button on any paper to request immediate review and removal."
    },
    {
      q: "Do I need to sign up or create an account to use GetPYQ?",
      a: "No sign-up is required! You can browse, search, preview PDFs, download files, and share links directly without registering or handing over personal credentials."
    }
  ];

  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-8 pb-6 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="about-page">
      <SEOHead
        title="About GetPYQ – Open BPUT Engineering Exam Archive"
        description="Learn about GetPYQ, a free student-driven initiative providing open access to BPUT previous year questions, semester syllabus, and peer solutions."
        keywords="about getpyq, bput exam paper archive, bput student community, bput free questions"
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
      {/* Header section fully centered */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> BPUT Academic Mission
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          About GetPYQ
        </h1>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
          An open-access academic project dedicated to making BPUT (Biju Patnaik University of Technology) engineering preparation transparent, completely free, and collaborative.
        </p>
      </div>

      {/* Main Philosophy Section - Neobrutalist Grid */}
      <div className="grid md:grid-cols-12 gap-8 mb-12">
        <div className="md:col-span-7 relative">
          <div className="absolute inset-0 bg-[#2563EB] border-2 border-black rounded-2xl rotate-1 shadow-[4px_4px_0px_#000]" />
          <div className="relative bg-white border-2 border-black rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2563EB] stroke-[2.5]" /> Mission & Vision
            </h2>
            <div className="space-y-4 text-gray-700 text-xs sm:text-sm font-medium leading-relaxed">
              <p>
                As BPUT engineering students, we spend hours scouring random forums, sketchy WhatsApp groups, or overpriced paper booklets just to find basic previous year examination questions before semester tests. 
              </p>
              <p>
                <strong>GetPYQ</strong> was launched to tear down those barriers. It is a completely free, crowd-sourced digital repository dedicated exclusively to BPUT (Biju Patnaik University of Technology) engineering students across all branches and semesters to contribute past papers, save materials offline, and collaborate on step-by-step solutions.
              </p>
              <p className="border-l-4 border-[#F97316] pl-4 font-black italic bg-[#FAF9F6] py-2 rounded-r-md text-black">
                "No subscription fees. No invasive ads. No login required. Just BPUT engineering peers helping each other crush their semesters."
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <div className="absolute inset-0 bg-[#F97316] border-2 border-black rounded-2xl -rotate-1 shadow-[4px_4px_0px_#000]" />
          <div className="relative bg-white border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F97316] stroke-[2.5]" /> Core Values
              </h2>
              <div className="space-y-4 font-share">
                {[
                  { title: "Universal Access", desc: "No registration forms or credit card walls. Direct access to knowledge." },
                  { title: "Brilliant Clarity", desc: "All question sheets are processed as clean, highly readable files or crisp SVGs." },
                  { title: "Peer Verification", desc: "Upvotes and public comments ensure correct answers and quality papers." }
                ].map((val, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-black text-white text-[10px] font-share font-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_#000]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-black">{val.title}</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-normal">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6 md:mt-0">
              <Link to="/browse" className="inline-flex items-center justify-center gap-2 w-full bg-black text-white border-2 border-black rounded-lg py-3 text-xs font-share font-bold hover:bg-[#2563EB] transition-all shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
                Explore the Archive
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* All Features of GetPYQ with heading on right side of icon */}
      <section className="mb-14 font-share" data-testid="features-section">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black uppercase text-[#2563EB] tracking-wider">Comprehensive Toolset</span>
          <h2 className="text-2xl sm:text-3xl font-momo font-bold text-black select-none mt-1">
            All Features of GetPYQ
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm font-medium mt-1">
            Engineered specifically to solve the academic challenges of BPUT engineering students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GETPYQ_FEATURES.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute inset-0 bg-black border-2 border-black rounded-xl translate-x-1 translate-y-1 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform shadow-[2px_2px_0px_#000]" />
              <div className="relative bg-white border-2 border-black rounded-xl p-5 h-full flex flex-col justify-between">
                <div>
                  {/* Heading strictly on right side of icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${item.color}`}>
                      <item.icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <h3 className="font-momo font-bold text-base text-black leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Improved Platform Creator Container */}
      <section className="mb-14 font-share" data-testid="team-section">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-black uppercase text-[#F97316] tracking-wider">Meet The Visionary</span>
          <h2 className="text-2xl sm:text-3xl font-momo font-bold text-black select-none mt-1">
            Platform Creator
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-black border-2 border-black rounded-2xl translate-x-1.5 translate-y-1.5 shadow-[4px_4px_0px_#000]" />
            <div className="relative bg-white border-2 border-black rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Creator Avatar with stylized frame */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-black shadow-[3px_3px_0px_#000] bg-amber-100">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300"
                      alt="Pabitra Khandual"
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-[#22C55E] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                    Verified
                  </span>
                </div>

                {/* Creator Details */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-stone-100 px-2.5 py-0.5 rounded border border-black/30">
                      <MapPin className="w-3 h-3 text-[#F97316]" /> Odisha, India
                    </span>
                  </div>

                  <h3 className="font-momo font-bold text-xl sm:text-2xl text-black leading-tight">
                    Pabitra Khandual
                  </h3>
                  <p className="text-xs font-share font-bold text-[#2563EB] mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> Full-Stack Engineer & BPUT Alum
                  </p>

                  <p className="text-gray-700 text-xs font-medium leading-relaxed mt-3">
                    Created GetPYQ to empower fellow BPUT engineering students with an ad-free, instant, and open-source platform. Committed to democratizing examination resources across all affiliated colleges in Odisha.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (placed directly without big outer container) */}
      <section className="mb-4 font-share" data-testid="faq-section">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black/10">
          <h2 className="text-xl sm:text-2xl font-momo font-bold flex items-center gap-3 text-black">
            <HelpCircle className="w-8 h-8 text-black bg-amber-100 rounded-lg p-1.5 stroke-[2.5] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" /> 
            Frequently Asked Questions
          </h2>
          <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider hidden sm:inline-block">
            Click question to expand
          </span>
        </div>

        <div className="space-y-3.5">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = !!openFaqs[idx];
            return (
              <div 
                key={idx} 
                className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2.5px_2.5px_0px_#000] transition-all hover:border-[#2563EB]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-amber-50/50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-momo font-bold text-sm sm:text-base text-black flex items-start gap-2.5">
                    <span className="text-[#2563EB] font-momo font-bold shrink-0">Q.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <div className="w-7 h-7 rounded-md border-2 border-black bg-[#FAF9F6] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
                    <ChevronDown className={`w-4 h-4 text-black stroke-[2.5] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 bg-[#FAF9F6]/60 border-t border-black/10">
                    <p className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed pl-5 border-l-2 border-[#2563EB]/40">
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
