import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileQuestion, Home, Search, Compass, ArrowLeft } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-[10%] py-12 sm:py-16 bg-[#FAF9F6] text-black flex-grow font-share flex flex-col justify-center items-center" data-testid="not-found-page">
      <SEOHead
        title="404 - Page Not Found | GetPYQ"
        description="The requested page, examination paper, or directory URL could not be found on GetPYQ."
        noIndex={true}
      />

      <div className="max-w-xl w-full bg-white border-2 border-black rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_#000] text-center relative overflow-hidden">
        {/* Accent corner decorative pill */}
        <div className="inline-flex items-center gap-2 bg-amber-200 text-black font-share text-xs font-bold px-3.5 py-1.5 rounded-full border-2 border-black mb-6 shadow-[2px_2px_0px_#000] select-none">
          <FileQuestion className="w-4 h-4 text-black stroke-[2.5]" /> Error 404 • Missing Resource
        </div>

        {/* Large 404 Monogram */}
        <h1 className="font-momo font-black text-6xl sm:text-7xl md:text-8xl text-black tracking-tight leading-none mb-3 select-none">
          4<span className="text-[#F97316]">0</span>4
        </h1>

        <h2 className="font-momo font-bold text-xl sm:text-2xl text-black mb-3">
          Question Paper or Page Not Found
        </h2>

        <p className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed mb-8 max-w-md mx-auto">
          The link you followed or shared may be outdated, mistyped, or the requested examination resource might have been archived or updated.
        </p>

        {/* Quick Recovery Navigation Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[#2563EB] text-white border-2 border-black rounded-xl py-3 px-4 text-xs font-bold shadow-[2.5px_2.5px_0px_#000] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <Home className="w-4 h-4 stroke-[2.5]" /> Return Home
          </Link>
          <Link
            to="/browse"
            className="flex items-center justify-center gap-2 bg-amber-200 text-black border-2 border-black rounded-xl py-3 px-4 text-xs font-bold shadow-[2.5px_2.5px_0px_#000] hover:bg-amber-300 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <Search className="w-4 h-4 stroke-[2.5]" /> Browse PYQ Library
          </Link>
        </div>

        {/* Secondary Sitemap Directory Link */}
        <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-center gap-3 text-xs">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-black font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" /> Go Back
          </button>
          <span className="text-gray-300 select-none">•</span>
          <Link
            to="/sitemap"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-black font-bold transition-colors"
          >
            <Compass className="w-3.5 h-3.5 stroke-[2.5]" /> Directory Sitemap
          </Link>
        </div>
      </div>
    </div>
  );
}
