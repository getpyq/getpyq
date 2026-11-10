import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileQuestion, Home, Search, Compass, ArrowLeft } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[10%] py-16 sm:py-24 bg-[#FAFBFD] text-slate-900 flex-grow font-sans flex flex-col justify-center items-center" data-testid="not-found-page">
      <SEOHead
        title="404 - Page Not Found | GetPYQ"
        description="The requested page, examination paper, or directory URL could not be found on GetPYQ."
        noIndex={true}
      />

      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm text-center relative overflow-hidden">
        {/* Accent corner decorative pill */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-6 shadow-xs select-none">
          <FileQuestion className="w-3.5 h-3.5 text-amber-600" /> Error 404 • Missing Resource
        </div>

        {/* Large 404 Monogram */}
        <h1 className="font-extrabold text-6xl sm:text-7xl text-slate-900 tracking-tight leading-none mb-3 select-none">
          4<span className="text-emerald-600">0</span>4
        </h1>

        <h2 className="font-bold text-xl sm:text-2xl text-slate-900 mb-2">
          Page or Paper Not Found
        </h2>

        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The link you followed or shared may be outdated, mistyped, or the requested examination resource might have been archived or updated.
        </p>

        {/* Quick Recovery Navigation Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 px-4 text-sm font-semibold shadow-xs transition-all"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/browse"
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl py-2.5 px-4 text-sm font-semibold shadow-xs transition-all"
          >
            <Search className="w-4 h-4" /> Browse PYQs
          </Link>
        </div>

        {/* Secondary Sitemap Directory Link */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-xs">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
          <span className="text-slate-300 select-none">•</span>
          <Link
            to="/sitemap"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <Compass className="w-3.5 h-3.5" /> Directory Sitemap
          </Link>
        </div>
      </div>
    </div>
  );
}
