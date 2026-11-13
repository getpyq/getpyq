import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, FileText, Image as ImageIcon, Eye, Share2, Copy, Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { PYQ } from "../types";
import { downloadUrl } from "../lib/api";
import { formatBranchDisplay, isCommonToAllBranches, parseBranches } from "../lib/constants";

export default function PYQCard({ 
  pyq, 
  badgeLabel,
  badgeTone = "blue"
}: { 
  pyq: PYQ; 
  badgeLabel?: string;
  badgeTone?: "blue" | "orange" | "gray" | "green" | "purple";
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const isPdf = pyq.file_id || (pyq.content_type || "").toLowerCase().includes("pdf") || pyq.file_url.includes(".pdf");

  const onPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/pyq?pyqId=${encodeURIComponent(pyq.id)}`, { state: { pyq } });
  };

  const onDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = downloadUrl(pyq.id, pyq.file_url, pyq.file_id);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pyq.paper}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to start download.");
    }
  };

  const canonicalShareUrl = `${window.location.origin}/pyq?pyqId=${encodeURIComponent(pyq.id)}`;

  const onCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(canonicalShareUrl);
      setCopied(true);
      toast.success(`Copied link for ${pyq.id}!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const onWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`📚 Check out this BPUT Previous Year Question Paper on GetPYQ:\n\n📄 *${pyq.paper}*\n🎓 Branch: ${pyq.branch}\n📅 Year: ${pyq.year}\n📌 Semester: Sem ${pyq.semester}\n🆔 PYQ ID: *${pyq.id}*\n\n👉 Download/View here: ${canonicalShareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  return (
    <Link
      to={`/pyq?pyqId=${encodeURIComponent(pyq.id)}`}
      state={{ pyq }}
      rel="nofollow"
      data-testid={`pyq-card-${pyq.id}`}
      className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full group relative text-slate-900 no-underline cursor-pointer"
    >
      {badgeLabel && (
        <div className="mb-2.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
            badgeTone === "green" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70" :
            badgeTone === "orange" ? "bg-amber-50 text-amber-700 border border-amber-200/70" :
            badgeTone === "purple" ? "bg-purple-50 text-purple-700 border border-purple-200/70" :
            badgeTone === "gray" ? "bg-slate-100 text-slate-700 border border-slate-200/70" :
            "bg-blue-50 text-blue-700 border border-blue-200/70"
          }`}>
            {badgeLabel}
          </span>
        </div>
      )}

      {/* Header: File icon + Paper Title (Vertically centered with 10% increased font size) */}
      <div className="flex items-center gap-3 mb-3 min-h-[44px]">
        <span 
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isPdf ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}
          title={isPdf ? "PDF Document" : "Image File"}
        >
          {isPdf ? <FileText className="w-4 h-4 stroke-[2]" /> : <ImageIcon className="w-4 h-4 stroke-[2]" />}
        </span>
        <div className="flex-1 min-w-0 flex items-center">
          <h3 
            className="text-[15.5px] sm:text-base font-bold leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 my-auto" 
            data-testid="pyq-paper"
          >
            {pyq.paper}
          </h3>
        </div>
      </div>

      {/* Badges / Category Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
            isCommonToAllBranches(pyq.branch)
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
              : parseBranches(pyq.branch).length > 1
              ? "bg-indigo-50 text-indigo-700 border-indigo-200/70"
              : "bg-slate-100 text-slate-700 border-slate-200/70"
          }`}
          title={isCommonToAllBranches(pyq.branch) ? "Common Subject for All Branches" : `Applicable to: ${formatBranchDisplay(pyq.branch)}`}
        >
          {isCommonToAllBranches(pyq.branch) && <Globe className="w-3 h-3 stroke-[2]" />}
          {formatBranchDisplay(pyq.branch)}
        </span>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
          Sem {pyq.semester}
        </span>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/70">
          {pyq.year}
        </span>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/70">
          {pyq.exam_type}
        </span>
      </div>

      {/* Clean Footer Actions */}
      <div 
        className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span 
          className="text-[11px] font-medium text-slate-400 truncate max-w-[38%]" 
          title={`Contributed by ${pyq.uploader_name || "Anonymous"}`}
        >
          By {pyq.uploader_name || "Anonymous"}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Copy Direct Link Button */}
          <button
            onClick={onCopyLink}
            title="Copy Unique Link"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Preview Button */}
          <button
            onClick={onPreview}
            title="Preview Paper"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={onWhatsAppShare}
            title="Share on WhatsApp"
            className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all flex items-center justify-center cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Download Button - Icon only */}
          <button
            onClick={onDownload}
            title="Download PDF"
            aria-label="Download PDF"
            className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function PYQCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div 
      className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col h-full select-none pointer-events-none animate-pulse"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="h-4 bg-slate-100 rounded-md w-4/5" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3.5">
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
        <div className="h-5 w-14 bg-slate-100 rounded-full" />
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="h-3.5 w-20 bg-slate-100 rounded" />
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-slate-100 rounded-full" />
          <div className="w-7 h-7 bg-slate-100 rounded-full" />
          <div className="w-7 h-7 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
