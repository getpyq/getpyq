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
    } catch (err) {
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
    const message = encodeURIComponent(`📚 Check out this BPUT Previous Year Question Paper on GetPYQ:\n\n📄 *${pyq.paper}*\n🎓 BPUT Branch: ${pyq.branch}\n📅 Year: ${pyq.year}\n📌 Semester: Sem ${pyq.semester}\n🆔 PYQ ID: *${pyq.id}*\n\n👉 Download/View here: ${canonicalShareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  return (
    <Link
      to={`/pyq?pyqId=${encodeURIComponent(pyq.id)}`}
      state={{ pyq }}
      data-testid={`pyq-card-${pyq.id}`}
      className="brutal-card group flex flex-col p-3.5 h-full cursor-pointer hover:bg-white text-black no-underline"
    >
      {badgeLabel && (
        <div className="mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shadow-[1px_1px_0px_#000] ${
            badgeTone === "green" ? "bg-emerald-100 text-emerald-950 border-emerald-400" :
            badgeTone === "orange" ? "bg-amber-100 text-amber-950 border-amber-400" :
            badgeTone === "purple" ? "bg-purple-100 text-purple-950 border-purple-400" :
            badgeTone === "gray" ? "bg-stone-200 text-stone-900 border-stone-400" :
            "bg-blue-100 text-blue-950 border-blue-400"
          }`}>
            {badgeLabel}
          </span>
        </div>
      )}

      {/* Title block with file format indicator */}
      <div className="flex items-start gap-2 mb-2">
        <span 
          className={`p-1.5 rounded-lg border-2 border-black shrink-0 ${
            isPdf ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#DBEAFE] text-[#2563EB]"
          }`}
          title={isPdf ? "PDF Document" : "Image File"}
        >
          {isPdf ? <FileText className="w-3.5 h-3.5 stroke-[2.5]" /> : <ImageIcon className="w-3.5 h-3.5 stroke-[2.5]" />}
        </span>
        <div className="flex-1 min-w-0">
          <h3 
            className="font-momo text-base font-bold leading-tight text-black group-hover:text-[#2563EB] transition-colors line-clamp-2" 
            data-testid="pyq-paper"
          >
            {pyq.paper}
          </h3>
        </div>
      </div>

      {/* Tags / Badges */}
      <div className="flex flex-wrap gap-1 mb-2.5 font-share">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
            isCommonToAllBranches(pyq.branch)
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : parseBranches(pyq.branch).length > 1
              ? "bg-indigo-50 text-indigo-800 border-indigo-300"
              : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
          }`}
          title={isCommonToAllBranches(pyq.branch) ? "Common Subject for All Branches" : `Applicable to: ${formatBranchDisplay(pyq.branch)}`}
        >
          {isCommonToAllBranches(pyq.branch) && <Globe className="w-2.5 h-2.5 stroke-[2.5]" />}
          {formatBranchDisplay(pyq.branch)}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF7ED] text-[#9A3412] border border-[#FFEDD5]">
          Sem {pyq.semester}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5F5F4] text-[#44403C] border border-[#E7E5E4]">
          {pyq.year}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF5FF] text-[#6B21A8] border border-[#F3E8FF]">
          {pyq.exam_type}
        </span>
      </div>

      {/* Modern Brutalist Minimal Action Footer */}
      <div 
        className="pt-2.5 border-t border-dashed border-gray-300 flex items-center justify-between gap-2 mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span 
          className="text-[10px] font-share font-semibold text-gray-500 truncate max-w-[40%]" 
          title={`Contributed by ${pyq.uploader_name || "Anonymous"}`}
        >
          By {pyq.uploader_name || "Anonymous"}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Copy Direct Link Button */}
          <button
            onClick={onCopyLink}
            title="Copy Unique Paper Link"
            className="p-1.5 rounded-lg border-2 border-black bg-purple-50 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_#000]"
          >
            {copied ? <Check className="w-3.5 h-3.5 stroke-[3] text-green-600" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* Preview Button */}
          <button
            onClick={onPreview}
            title="Preview Paper"
            className="p-1.5 rounded-lg border-2 border-black bg-blue-50 text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_#000]"
          >
            <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            title="Download PDF"
            className="p-1.5 rounded-lg border-2 border-black bg-orange-50 text-[#EA580C] hover:bg-[#EA580C] hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_#000]"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={onWhatsAppShare}
            title="Share on WhatsApp"
            className="p-1.5 rounded-lg border-2 border-black bg-emerald-50 text-[#16A34A] hover:bg-[#16A34A] hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_#000]"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function PYQCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div 
      className="brutal-card flex flex-col p-3.5 h-full bg-white select-none pointer-events-none animate-pulse"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Title block with file format indicator and paper name */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gray-200 border border-black/10 shrink-0" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
          <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
        </div>
      </div>

      {/* Tags / Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3 font-share">
        <div className="h-5 w-12 bg-gray-200 rounded-md border border-black/5"></div>
        <div className="h-5 w-14 bg-gray-200 rounded-md border border-black/5"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-md border border-black/5"></div>
        <div className="h-5 w-12 bg-gray-200 rounded-md border border-black/5"></div>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-dashed border-gray-300 flex items-center justify-between gap-2 mt-auto">
        <div className="h-3.5 w-24 bg-gray-200 rounded"></div>
        <div className="flex items-center gap-1.5">
          <div className="w-[30px] h-[30px] bg-gray-100 rounded-lg border border-black/10"></div>
          <div className="w-[30px] h-[30px] bg-gray-100 rounded-lg border border-black/10"></div>
          <div className="w-[30px] h-[30px] bg-gray-100 rounded-lg border border-black/10"></div>
        </div>
      </div>
    </div>
  );
}
