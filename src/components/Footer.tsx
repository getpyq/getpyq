import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Github, Mail, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const TICKER_TEXT = "FOR STUDENTS, BY STUDENTS ◆ BPUT UNIVERSITY PYQ ARCHIVE ◆ 100% FREE & DIRECT PDF ACCESS ◆ CSE, ECE, EE, CIVIL, ME, ALL BRANCHES ◆ VERIFIED PREVIOUS YEAR PAPERS ◆ NO ADS & NO SIGN-UP REQUIRED";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#FAFBFD] text-slate-900 border-t border-slate-200/80 overflow-hidden font-sans select-none" data-testid="footer">
      {/* Top Infinite Marquee Ticker (Light Theme - Matching jugaadbro.app) */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xs py-3 overflow-hidden select-none">
        <div className="flex w-max animate-marquee">
          <div className="flex items-center space-x-8 px-4 text-[11px] font-bold text-emerald-700 tracking-[0.25em] uppercase whitespace-nowrap">
            <span>{TICKER_TEXT}</span>
            <span className="text-emerald-400">◆</span>
            <span>{TICKER_TEXT}</span>
            <span className="text-emerald-400">◆</span>
          </div>
          <div className="flex items-center space-x-8 px-4 text-[11px] font-bold text-emerald-700 tracking-[0.25em] uppercase whitespace-nowrap" aria-hidden="true">
            <span>{TICKER_TEXT}</span>
            <span className="text-emerald-400">◆</span>
            <span>{TICKER_TEXT}</span>
            <span className="text-emerald-400">◆</span>
          </div>
        </div>
      </div>

      {/* Technical Background Matrix & Soft Ambient Aurora (Light Theme from jugaadbro.app) */}
      <div className="absolute inset-0 footer-bg-grid-light opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] footer-aurora-light rounded-full blur-3xl pointer-events-none" />

      {/* Giant Architectural Background Text Watermark */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 footer-giant-bg-text-light select-none pointer-events-none z-0 tracking-tight">
        GETPYQ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Pre-Footer Hero Banner CTA (Light Card matching jugaadbro.app) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-slate-200/50 max-w-3xl mx-auto mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-4 shadow-2xs">
            🎓 The #1 BPUT Student Community
          </span>

          <h2
            className="font-cabinet text-3xl sm:text-4xl lg:text-[44px] font-[900] text-[#0f172b] tracking-tight mb-3 leading-tight"
            style={{
              fontFamily: 'cabinetGrotesk, "cabinetGrotesk Fallback", "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 900,
              color: '#0f172b',
            }}
          >
            BPUT Exam ki tension?{" "}
            <span
              className="font-gochi text-4xl sm:text-5xl lg:text-[54px] font-[400] text-[#096] inline-block mr-1 align-baseline"
              style={{
                fontFamily: '"Gochi Hand", "Gochi Hand Fallback", "Gochi Hand", cursive, sans-serif',
                fontWeight: 400,
                color: '#096',
              }}
            >
              GetPYQ
            </span>{" "}
            hai na.
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-xl mx-auto font-normal">
            Access previous year question papers, syllabus, and study resources for all BPUT engineering semesters. 100% free, direct PDF downloads.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-3 text-xs sm:text-sm font-cabinet font-bold shadow-xs shadow-emerald-600/25 hover:shadow-md transition-all duration-150 active:scale-95"
            >
              <span>Browse PYQ Library</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 rounded-full px-6 py-3 text-xs sm:text-sm font-cabinet font-bold shadow-2xs transition-all duration-150 active:scale-95"
            >
              <span>Upload a Paper</span>
            </Link>
          </div>
        </div>

        {/* 4-Column Navigation & Brand Info in Clean Light Theme */}
        <div className="border-t border-slate-200/80 pt-12 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" data-testid="footer-logo" className="inline-flex items-center gap-2 mb-4 select-none group">
              <div className="bg-white p-1 rounded-xl inline-flex items-center group-hover:scale-105 transition-transform shadow-xs border border-slate-100">
                <img
                  src="/assets/aistudio/Navy_and_Green_Graduation_Logo_824bf272.png"
                  alt="GetPYQ - BPUT University Archive"
                  className="h-8 sm:h-9 w-auto object-contain rounded-lg"
                />
              </div>
              <span
                className="font-playpen text-xl sm:text-2xl font-bold tracking-tight select-none leading-none"
                style={{ fontFamily: '"Playpen Sans", cursive, sans-serif' }}
              >
                <span className="text-[#0e1b38]">Get</span>
                <span className="text-[#059669]">PYQ</span>
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed text-xs">
              The open community library of BPUT (Biju Patnaik University of Technology) Previous Year Questions. Share knowledge, prep smarter, and crack semester exams.
            </p>
          </div>

          {/* Col 2: Explore */}
          <div>
            <p className="text-xs font-bold font-cabinet text-slate-900 uppercase tracking-wider mb-4">Explore</p>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link to="/browse" className="hover:text-emerald-700 transition-colors">
                  Browse PYQ Library
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-emerald-700 transition-colors">
                  Request a Paper
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-emerald-700 transition-colors">
                  Upload a Paper
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-700 transition-colors">
                  About GetPYQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-700 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Legal */}
          <div>
            <p className="text-xs font-bold font-cabinet text-slate-900 uppercase tracking-wider mb-4">Guidelines &amp; Legal</p>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link to="/sitemap" className="hover:text-emerald-700 transition-colors">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-700 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-emerald-700 transition-colors">
                  Disclaimer Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-700 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Social */}
          <div>
            <p className="text-xs font-bold font-cabinet text-slate-900 uppercase tracking-wider mb-4">Community</p>
            <p className="text-slate-500 text-xs mb-3 font-normal">Join student study groups and exam alerts:</p>
            <div className="flex items-center gap-2.5 mb-4">
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Channel"
                className="w-9 h-9 rounded-full bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50 flex items-center justify-center text-slate-600 hover:text-emerald-700 transition-all duration-150 shadow-2xs active:scale-95"
                data-testid="footer-whatsapp-link"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-600" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-9 h-9 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-150 shadow-2xs active:scale-95"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:getpyq@gmail.com"
                title="Email Us"
                className="w-9 h-9 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all duration-150 shadow-2xs active:scale-95"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/70 text-[11px] text-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Exam Season Archive Active</span>
            </div>
          </div>
        </div>

        {/* BPUT Engineering Branches Directory */}
        <div className="border-t border-slate-200/80 pt-6 pb-6">
          <p className="text-[11px] font-bold font-cabinet text-slate-800 uppercase tracking-wider mb-2.5">
            BPUT Engineering Branches Directory:
          </p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-500">
            <Link to="/branch/cse" className="hover:text-emerald-700 transition-colors font-medium">Computer Science (CSE)</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/cse-aiml" className="hover:text-emerald-700 transition-colors font-medium">AI &amp; ML</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/ece" className="hover:text-emerald-700 transition-colors font-medium">Electronics (ECE / ETC)</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/ee" className="hover:text-emerald-700 transition-colors font-medium">Electrical (EE)</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/eee" className="hover:text-emerald-700 transition-colors font-medium">Electrical &amp; Electronics (EEE)</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/me" className="hover:text-emerald-700 transition-colors font-medium">Mechanical (ME)</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/civil" className="hover:text-emerald-700 transition-colors font-medium">Civil (CE)</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/chemical" className="hover:text-emerald-700 transition-colors font-medium">Chemical</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/automobile" className="hover:text-emerald-700 transition-colors font-medium">Automobile</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/metallurgy" className="hover:text-emerald-700 transition-colors font-medium">Material &amp; Metallurgy</Link>
            <span className="text-slate-300">•</span>
            <Link to="/branch/biotech" className="hover:text-emerald-700 transition-colors font-medium">Biotechnology</Link>
          </div>
        </div>

        {/* Disclaimer Box in Light Theme */}
        <div className="w-full border border-slate-200/80 p-4 rounded-2xl bg-white/70 backdrop-blur-xs text-slate-500 text-xs leading-relaxed mb-8 shadow-xs">
          <strong className="font-semibold text-emerald-700 mr-1.5">Disclaimer:</strong>
          GetPYQ is an independent, student-driven academic repository dedicated to BPUT (Biju Patnaik University of Technology) engineering students. It is not affiliated with, endorsed by, or officially connected to BPUT or its constituent colleges. All question papers are contributed by public student peers for educational reference.
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} GetPYQ • Dedicated to BPUT Engineering Students
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Made with</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span className="text-slate-700 font-semibold">For Students, By Students</span>
          </div>

          <button
            onClick={scrollToTop}
            title="Back to top"
            className="w-8 h-8 rounded-full bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
