import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, Link, useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  Download,
  FileText,
  ShieldAlert,
  RefreshCw,
  Search,
  PlusCircle,
  Upload,
  BookOpen,
  Layers,
  ArrowRight,
  ThumbsUp,
  Copy,
  Check,
  Globe
} from "lucide-react";
import { getPYQ, getCachedPYQ, downloadUrl, listPYQs, upvotePYQ, trackDownload, isPaperMatch } from "../lib/api";
import { PYQ } from "../types";
import { formatBranchDisplay, isCommonToAllBranches, parseBranches } from "../lib/constants";
import PdfViewer from "../components/PdfViewer";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
import PYQDetailSkeleton from "../components/PYQDetailSkeleton";
import { getRelatedPapers } from "../lib/relatedPapers";
import ErrorBoundary from "../components/ErrorBoundary";

function WhatsAppIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function PYQDetail() {
  const { id: pathId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Extract ID strictly using pyqId primary key (never file_id from URL)
  const rawId = (
    searchParams.get("pyqId") ||
    searchParams.get("pyqid") ||
    searchParams.get("pyq_id") ||
    new URLSearchParams(window.location.search).get("pyqId") ||
    new URLSearchParams(window.location.search).get("pyqid") ||
    new URLSearchParams(window.location.search).get("pyq_id") ||
    pathId ||
    searchParams.get("id") ||
    new URLSearchParams(window.location.search).get("id") ||
    ""
  ).trim();

  let targetId = rawId;
  try {
    targetId = decodeURIComponent(rawId);
  } catch {}

  const initialPyq = useMemo(() => {
    const statePyq = (location.state as { pyq?: PYQ })?.pyq;
    if (statePyq && isPaperMatch(statePyq, targetId)) {
      return statePyq;
    }
    return getCachedPYQ(targetId);
  }, [location.state, targetId]);

  const [pyq, setPyq] = useState<PYQ | null>(initialPyq);
  const [loading, setLoading] = useState<boolean>(!initialPyq && Boolean(targetId));
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Related papers discovery state
  const [allPapers, setAllPapers] = useState<PYQ[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(true);

  // User engagement state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [isUpvoting, setIsUpvoting] = useState<boolean>(false);

  const loadPaper = useCallback(async (forceReload: boolean = false) => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    const immediate = !forceReload ? (initialPyq || getCachedPYQ(targetId)) : null;
    if (immediate) {
      setPyq(immediate);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (forceReload) setIsRetrying(true);

    // Timeout safety to ensure no unresponsive blank state hangs indefinitely
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(false);
      setIsRetrying(false);
    }, 14000);

    try {
      const data = await getPYQ(targetId);
      if (data) {
        setPyq(data);
      } else {
        setPyq(null);
      }
    } catch (err) {
      console.error("Failed to load PYQ details:", err);
      setPyq(null);
    } finally {
      if (timerRef.current) clearTimeout(timerRef.current);
      setLoading(false);
      setIsRetrying(false);
    }
  }, [targetId, initialPyq]);

  useEffect(() => {
    loadPaper();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loadPaper]);

  // Fetch full paper catalog once to power client-side content discovery & recommendations
  useEffect(() => {
    let isMounted = true;
    setLoadingRelated(true);
    listPYQs()
      .then((papers) => {
        if (isMounted) {
          setAllPapers(papers);
          setLoadingRelated(false);
          if (targetId) {
            setPyq((current) => {
              if (current) return current;
              const found = papers.find((p) => isPaperMatch(p, targetId));
              return found || null;
            });
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch paper catalog for recommendations:", err);
        if (isMounted) setLoadingRelated(false);
      });
    return () => {
      isMounted = false;
    };
  }, [targetId]);

  // Compute all related papers based on subject, curriculum syllabus, branch & semester
  const relatedMatches = useMemo(() => {
    if (!pyq) return [];
    return getRelatedPapers(pyq, allPapers, { filter: "all", limit: 24 });
  }, [pyq, allPapers]);

  // Generate canonical unique URL for this PYQ with pyqId as the sole identifier
  const PRODUCTION_ORIGIN = "https://getpyq.vercel.app";
  const activeId = pyq?.id || targetId;
  const canonicalUrl = `${PRODUCTION_ORIGIN}/pyq?pyqId=${encodeURIComponent(activeId)}`;

  const onWhatsAppShare = () => {
    if (!activeId) return;
    const title = pyq ? `"${pyq.paper}" (${pyq.exam_type} - ${pyq.branch})` : `PYQ ID: ${activeId}`;
    const shareText = `📚 Check out this BPUT Past Year Question Paper on GetPYQ!\n\n📄 Subject: ${title}\n🆔 PYQ ID: *${activeId}*\n\n🔗 Open & Download here:\n${canonicalUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (pyq) {
      setUpvotes(pyq.upvotes || 0);
      try {
        const votedKey = `pyq_voted_${pyq.id}`;
        setHasUpvoted(localStorage.getItem(votedKey) === "true");
      } catch {
        setHasUpvoted(false);
      }
    } else {
      setUpvotes(0);
      setHasUpvoted(false);
    }
  }, [pyq?.id, pyq?.upvotes]);

  const resolvedFileId = pyq ? (pyq.file_id || pyq.fileId || (pyq as any).fileID || "") : "";
  const fileUrl = useMemo(() => {
    if (!pyq) return "";
    return downloadUrl(pyq.id, pyq.file_url, resolvedFileId, false);
  }, [pyq?.id, pyq?.file_url, resolvedFileId]);

  const onUpvote = async () => {
    if (!pyq || hasUpvoted || isUpvoting) return;
    setIsUpvoting(true);
    setUpvotes((prev) => prev + 1);
    setHasUpvoted(true);
    try {
      localStorage.setItem(`pyq_voted_${pyq.id}`, "true");
      const updated = await upvotePYQ(pyq.id);
      if (updated && typeof updated.upvotes === "number") {
        setUpvotes(updated.upvotes);
      }
      toast.success("Helpful vote recorded!");
    } catch (err) {
      console.warn("Upvote recording failed:", err);
      toast.success("Thanks for voting!");
    } finally {
      setIsUpvoting(false);
    }
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopiedLink(true);
      toast.success("Unique PYQ link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const onDownload = () => {
    if (!pyq) return;
    trackDownload(pyq.id);
    const win = window.open(fileUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${pyq.paper || "bput-pyq"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("Download started!");
  };

  // --------------------------------------------------------------------------------
  // 1. Not Found State - Displayed ONLY when lookup finishes and no paper exists
  // --------------------------------------------------------------------------------
  if (!loading && !pyq) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-900 min-h-[70vh] font-sans flex flex-col justify-center" data-testid="pyq-not-found-page">
        <Helmet>
          <title>Paper Not Found | GetPYQ</title>
          <meta name="description" content="The requested examination paper could not be found on GetPYQ." />
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </Helmet>
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xs text-center max-w-xl mx-auto">
          {/* Icon */}
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-700">
            <FileText className="w-7 h-7 stroke-[2]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Question Paper Not Found
          </h1>

          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-mono text-slate-700">
            <span>ID:</span>
            <span className="text-emerald-700 select-all font-bold">{targetId || "Not Provided"}</span>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mt-4 mb-8 leading-relaxed font-normal">
            The question paper requested with ID <span className="font-semibold text-slate-800">{targetId || "(empty)"}</span> could not be located in our active database. It may have been relocated or mistyped.
          </p>

          {/* Action Button Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-md mx-auto">
            <button
              onClick={() => loadPaper(true)}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
              <span>{isRetrying ? "Retrying..." : "Retry Search"}</span>
            </button>

            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse All Papers</span>
            </Link>

            <Link
              to="/requests"
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Request Paper</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 2. Skeleton Loading State - Matches PYQ Detail layout to prevent layout shift
  // --------------------------------------------------------------------------------
  if (loading && !pyq) {
    return <PYQDetailSkeleton targetId={targetId} />;
  }

  // --------------------------------------------------------------------------------
  // 3. Normal PYQ Detail Page UI
  // --------------------------------------------------------------------------------
  const paperTitle = pyq?.paper || "BPUT Question Paper";
  const examType = pyq?.exam_type || "Examination";
  const branchName = pyq?.branch || "Engineering";
  const semesterNum = pyq?.semester ? `Sem ${pyq.semester}` : "";
  const yearText = pyq?.year || "";
  const pageTitle = `${paperTitle} (${examType}) - BPUT ${branchName} ${semesterNum} | GetPYQ`;
  const pageDescription = `Download and view BPUT previous year question paper for ${paperTitle}. BPUT Branch: ${branchName}, Semester: ${pyq?.semester || "All"}, Year: ${yearText}, Exam: ${examType}. Free PDF access on GetPYQ.`;

  return (
    <ErrorBoundary fallbackMessage="Unable to display this question paper. Please verify the URL or explore from the paper library.">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[10%] pt-6 pb-12 bg-[#FAFBFD] text-slate-900 flex-grow font-sans" data-testid="pyq-detail-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {/* Do not index individual papers in search engines to prevent Apps Script data retrieval bottlenecks */}
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="GetPYQ" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://getpyq.vercel.app/favicon-512x512.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://getpyq.vercel.app/favicon-512x512.png" />
        <meta name="twitter:url" content={canonicalUrl} />

        {/* Canonical Link consolidates search equity into the main browse library */}
        <link rel="canonical" href="https://getpyq.vercel.app/browse" />
      </Helmet>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left column: Attachment Previewer (Pure light-themed container with only the PDF preview) */}
        <div className="lg:col-span-8 border border-slate-200/90 rounded-3xl overflow-hidden bg-white w-full shadow-xs flex flex-col min-h-[580px] sm:min-h-[640px]" data-testid="pyq-preview">
          <PdfViewer fileUrl={fileUrl} title={pyq?.paper || "Question Paper"} fileId={resolvedFileId} file_id={resolvedFileId} loading={loading} />
        </div>

        {/* Right column: Action Panel & Metadata */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs text-slate-900">
            
            {/* Header with icon & Paper Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-base sm:text-lg font-cabinet font-extrabold leading-snug text-slate-900 break-words tracking-tight" data-testid="pyq-title">
                  {pyq.paper}
                </h1>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge tone={isCommonToAllBranches(pyq.branch) ? "green" : parseBranches(pyq.branch).length > 1 ? "blue" : "purple"}>
                {isCommonToAllBranches(pyq.branch) ? (
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3 h-3 stroke-[2]" /> All Branches (Common)
                  </span>
                ) : (
                  formatBranchDisplay(pyq.branch)
                )}
              </Badge>
              <Badge tone="orange">Semester {pyq.semester}</Badge>
              <Badge tone="gray">{pyq.year}</Badge>
              <Badge tone="green">{pyq.exam_type}</Badge>
            </div>

            <hr className="border-t border-slate-100 my-4" />

            {/* Interactive action buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onDownload}
                disabled={!pyq}
                data-testid="download-main-btn"
                className="inline-flex w-full h-11 items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 stroke-[2.2]" /> Download Paper PDF
              </button>

              <button
                onClick={onWhatsAppShare}
                disabled={!pyq && !targetId}
                data-testid="whatsapp-share-btn"
                className="inline-flex w-full h-11 items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <WhatsAppIcon className="w-4.5 h-4.5 fill-current" /> Share on WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onUpvote}
                  disabled={hasUpvoted || isUpvoting || !pyq}
                  data-testid="pyq-upvote-btn"
                  className={`inline-flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    hasUpvoted
                      ? "bg-amber-50 text-amber-800 border-amber-200/80 cursor-default"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 active:scale-95 disabled:opacity-60"
                  }`}
                  title={hasUpvoted ? "You found this helpful" : "Mark this paper as helpful"}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? "fill-amber-500 text-amber-600" : ""}`} />
                  <span>{hasUpvoted ? "Helpful!" : "Helpful"} ({upvotes})</span>
                </button>

                <button
                  type="button"
                  onClick={onCopyLink}
                  data-testid="pyq-copy-link-btn"
                  className="inline-flex items-center justify-center gap-1.5 h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                  title="Copy permanent direct link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Separator / Metadata */}
            <hr className="border-t border-slate-100 my-4" />

            <div className="space-y-2.5 text-xs text-slate-500 select-none">
              <div className="flex items-center justify-between">
                <span>Branch</span>
                <span className="font-semibold text-slate-900 text-right truncate max-w-[200px]" title={formatBranchDisplay(pyq?.branch || "")}>
                  {formatBranchDisplay(pyq?.branch || "")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>PYQ ID</span>
                <span className="font-mono text-slate-900 font-bold">{pyq?.id || targetId || "..."}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contributed By</span>
                <span className="font-medium text-slate-800">{pyq?.uploader_name || "Community Member"}</span>
              </div>
            </div>
          </div>

          {/* Direct Access Guarantee Notice Card */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
            <h3 className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" /> Direct Access Guarantee
            </h3>
            <p className="text-xs text-emerald-800/90 leading-relaxed font-normal">
              Every past paper has a permanent, direct URL. Sharing this link allows any classmate to view and download this exact paper directly without registration.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. Related Question Papers - Content Discovery Section                   */}
      {/* ------------------------------------------------------------------------- */}
      <section className="mt-12 pt-8 border-t border-slate-200/80" aria-label="Related Question Papers" data-testid="related-papers-section">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-1">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 stroke-[2]" />
              </span>
              <h2 className="text-lg sm:text-xl font-cabinet font-extrabold tracking-tight text-slate-900 truncate">
                Related Question Papers
              </h2>
            </div>

            {relatedMatches.length > 0 && (
              <div className="shrink-0 ml-auto pl-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 whitespace-nowrap" data-testid="related-papers-count">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span><strong className="font-mono">{relatedMatches.length}</strong> Available</span>
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 font-normal max-w-2xl">
            Related BPUT papers for {pyq?.branch || "Engineering"} {pyq?.semester ? `Semester ${pyq.semester}` : ""} and curriculum topics.
          </p>
        </div>

        {/* Content list or Skeleton */}
        {loadingRelated || loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="related-papers-loading">
            {[0, 1, 2].map((idx) => (
              <PYQCardSkeleton key={idx} index={idx} />
            ))}
          </div>
        ) : relatedMatches.length === 0 ? (
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-xs" data-testid="related-papers-empty">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-emerald-700">
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">No other related papers yet</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              Be the first to contribute past question papers for {pyq?.branch || "this branch"} semester {pyq?.semester || ""}.
            </p>
            {pyq?.branch && (
              <Link
                to={`/upload?branch=${encodeURIComponent(pyq.branch)}&semester=${encodeURIComponent(pyq.semester || "1")}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
              >
                Upload Question Paper <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="related-papers-grid">
            {relatedMatches.map(({ paper }, idx) => (
              <PYQCard
                key={`${paper.id || "paper"}-${idx}`}
                pyq={paper}
              />
            ))}
          </div>
        )}
      </section>
    </div>
    </ErrorBoundary>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  tone?: "blue" | "orange" | "gray" | "red" | "green" | "purple";
}

function Badge({ children, tone = "blue" }: BadgeProps) {
  const map = {
    blue: "bg-blue-50 text-blue-700 border border-blue-200/70",
    orange: "bg-amber-50 text-amber-700 border border-amber-200/70",
    gray: "bg-slate-100 text-slate-600 border border-slate-200/70",
    red: "bg-rose-50 text-rose-700 border border-rose-200/70",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/70",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[tone]} select-none inline-flex items-center gap-1 leading-normal`}>
      {children}
    </span>
  );
}
