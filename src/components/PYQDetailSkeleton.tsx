import React from "react";
import { Helmet } from "react-helmet-async";
import { FileText, Download, ThumbsUp, Copy, BookOpen, ShieldAlert } from "lucide-react";
import { PYQCardSkeleton } from "./PYQCard";

interface PYQDetailSkeletonProps {
  targetId?: string;
}

export default function PYQDetailSkeleton({ targetId }: PYQDetailSkeletonProps) {
  const displayId = targetId ? targetId.trim() : "";

  return (
    <div
      className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-6 pb-8 bg-[#FAF9F6] text-black flex-grow font-share select-none"
      data-testid="pyq-detail-skeleton"
    >
      <Helmet>
        <title>{displayId ? `Loading PYQ #${displayId} | GetPYQ` : "Loading Question Paper | GetPYQ"}</title>
        <meta name="description" content="Loading official BPUT university past question paper..." />
      </Helmet>

      {/* Top Breadcrumb Navigation Skeleton */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-5 animate-pulse">
        <div className="h-3.5 w-12 bg-stone-200 rounded" />
        <span>/</span>
        <div className="h-3.5 w-24 bg-stone-200 rounded" />
        <span>/</span>
        <div className="h-3.5 w-32 bg-stone-200 rounded" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* Left Column: PDF Document Viewer Skeleton                                */}
        {/* ========================================================================= */}
        <div
          className="lg:col-span-8 border-2 border-black rounded-2xl overflow-hidden bg-white w-full shadow-[4px_4px_0px_#000] flex flex-col min-h-[510px] h-[580px] lg:h-[680px]"
          data-testid="pyq-preview-skeleton"
        >
          {/* Simulated PDF Toolbar */}
          <div className="h-11 border-b-2 border-black bg-stone-100 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-stone-200 border border-black/15 flex items-center justify-center animate-pulse">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <div className="h-4 w-36 bg-stone-200 rounded animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-stone-200 rounded border border-black/10 animate-pulse" />
              <div className="h-6 w-6 bg-stone-200 rounded border border-black/10 animate-pulse hidden sm:block" />
              <div className="h-6 w-6 bg-stone-200 rounded border border-black/10 animate-pulse" />
            </div>
          </div>

          {/* Simulated Document Canvas with A4 Sheet Lines */}
          <div className="flex-1 bg-stone-100/80 p-4 sm:p-8 flex items-center justify-center overflow-hidden relative">
            <div className="w-full max-w-md h-full max-h-[560px] bg-white border-2 border-black/15 rounded-lg shadow-sm p-6 sm:p-8 flex flex-col justify-between animate-pulse">
              {/* Paper Header Lines */}
              <div className="space-y-2 text-center pb-3 border-b border-stone-200">
                <div className="h-4 w-3/4 bg-stone-200 rounded mx-auto" />
                <div className="h-3 w-1/2 bg-stone-200 rounded mx-auto" />
                <div className="h-2.5 w-1/3 bg-stone-200 rounded mx-auto" />
              </div>

              {/* Question Simulation Blocks */}
              <div className="space-y-4 py-2 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-4 bg-stone-300 rounded text-[9px] font-bold flex items-center justify-center text-stone-500">Q1</div>
                    <div className="h-3 w-5/6 bg-stone-200 rounded" />
                  </div>
                  <div className="h-3 w-full bg-stone-200/80 rounded pl-7" />
                  <div className="h-3 w-4/5 bg-stone-200/80 rounded pl-7" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-4 bg-stone-300 rounded text-[9px] font-bold flex items-center justify-center text-stone-500">Q2</div>
                    <div className="h-3 w-3/4 bg-stone-200 rounded" />
                  </div>
                  <div className="h-3 w-full bg-stone-200/80 rounded pl-7" />
                  <div className="h-3 w-2/3 bg-stone-200/80 rounded pl-7" />
                </div>

                {/* Simulated Diagram / Schematic Box */}
                <div className="h-24 sm:h-28 bg-stone-50 border border-dashed border-stone-300 rounded-md flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded bg-stone-200/80 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-stone-400" />
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Loading Document Preview...</span>
                </div>

                <div className="space-y-1.5 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-4 bg-stone-300 rounded text-[9px] font-bold flex items-center justify-center text-stone-500">Q3</div>
                    <div className="h-3 w-4/5 bg-stone-200 rounded" />
                  </div>
                  <div className="h-3 w-full bg-stone-200/80 rounded pl-7" />
                </div>
              </div>

              {/* Page Footer */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400">
                <div className="h-2.5 w-16 bg-stone-200 rounded" />
                <div className="h-2.5 w-12 bg-stone-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column: Action Panel & Metadata Skeleton                          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000] text-black">
            
            {/* Header with icon & Paper Title */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center bg-amber-100 shadow-[2px_2px_0px_#000] shrink-0 mt-0.5 animate-pulse">
                <FileText className="w-5 h-5 text-amber-700 stroke-[2.5]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 space-y-2 py-0.5 animate-pulse">
                <div className="h-5 w-4/5 bg-stone-200 rounded" />
                <div className="h-4 w-3/5 bg-stone-200 rounded" />
              </div>
            </div>

            {/* Badges row with matching dimensions & shadows */}
            <div className="flex flex-wrap gap-1.5 mb-4 animate-pulse">
              <div className="h-6 w-28 bg-emerald-100 border-2 border-black rounded shadow-[1px_1px_0px_#000]" />
              <div className="h-6 w-20 bg-amber-200 border-2 border-black rounded shadow-[1px_1px_0px_#000]" />
              <div className="h-6 w-16 bg-stone-200 border-2 border-black rounded shadow-[1px_1px_0px_#000]" />
              <div className="h-6 w-24 bg-emerald-100 border-2 border-black rounded shadow-[1px_1px_0px_#000]" />
            </div>

            <hr className="border-t border-black/10 my-4" />

            {/* Action Buttons Skeleton with exact dimensions */}
            <div className="flex flex-col gap-3">
              {/* Primary Download Button */}
              <div className="inline-flex w-full h-12 items-center justify-center gap-2 bg-[#2563EB]/40 text-white border-2 border-black rounded-lg text-xs font-share font-bold shadow-[3.5px_3.5px_0px_#000] animate-pulse">
                <Download className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Preparing Download...</span>
              </div>

              {/* WhatsApp Share Button */}
              <div className="inline-flex w-full h-12 items-center justify-center gap-2 bg-[#22C55E]/40 text-white border-2 border-black rounded-lg text-xs font-share font-bold shadow-[3.5px_3.5px_0px_#000] animate-pulse">
                <span>Share Paper</span>
              </div>

              {/* 2-column action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <div className="inline-flex items-center justify-center gap-1.5 h-10 bg-white border-2 border-black rounded-lg text-xs font-bold font-share shadow-[2.5px_2.5px_0px_#000] animate-pulse text-stone-400">
                  <ThumbsUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Helpful</span>
                </div>

                <div className="inline-flex items-center justify-center gap-1.5 h-10 bg-white border-2 border-black rounded-lg text-xs font-bold font-share shadow-[2.5px_2.5px_0px_#000] animate-pulse text-stone-400">
                  <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copy Link</span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <hr className="border-t-2 border-dashed border-black/10 my-5" />

            {/* Metadata Rows Skeleton */}
            <div className="space-y-2.5 text-[10px] font-bold text-gray-500 select-none">
              <div className="flex items-center justify-between">
                <span>File</span>
                <div className="h-3 w-28 bg-stone-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <span>Branch Applicability</span>
                <div className="h-3 w-24 bg-stone-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <span>PYQ ID</span>
                <span className="font-mono text-black font-extrabold">
                  {displayId ? `#${displayId}` : <span className="inline-block h-3 w-16 bg-stone-200 rounded animate-pulse" />}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contributed By</span>
                <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Direct Access Guarantee Notice Card Skeleton */}
          <div className="bg-[#FFF7ED] border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_#000] animate-pulse">
            <h3 className="font-momo font-bold text-xs text-black mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#F97316] stroke-[2.5]" /> Direct Access Guarantee
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-700 font-medium leading-relaxed">
              Every past paper has a permanent, direct URL. Fetching paper archives from database...
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Bottom Section: Related Question Papers Skeleton                          */}
      {/* ========================================================================= */}
      <section className="mt-12 pt-8 border-t-2 border-black" aria-label="Related Question Papers">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-amber-200 border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] shrink-0">
                <BookOpen className="w-4 h-4 text-black stroke-[2.5]" />
              </span>
              <h2 className="text-base sm:text-2xl font-momo font-bold tracking-tight text-black truncate sm:overflow-visible">
                Related Question Papers
              </h2>
            </div>

            <div className="shrink-0 ml-auto">
              <div className="h-7 sm:h-8 w-20 sm:w-24 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] animate-pulse" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-2xl">
            Finding related BPUT previous questions for your curriculum...
          </p>
        </div>

        {/* 3 Related Paper Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="related-papers-skeleton-grid">
          <PYQCardSkeleton index={0} />
          <PYQCardSkeleton index={1} />
          <PYQCardSkeleton index={2} />
        </div>
      </section>
    </div>
  );
}
