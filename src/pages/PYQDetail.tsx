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
import { getPYQ, getCachedPYQ, downloadUrl, listPYQs, upvotePYQ, trackDownload } from "../lib/api";
import { PYQ } from "../types";
import { formatBranchDisplay, isCommonToAllBranches, parseBranches } from "../lib/constants";
import PdfViewer from "../components/PdfViewer";
import PYQCard, { PYQCardSkeleton } from "../components/PYQCard";
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
  const targetId = (
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

  const initialPyq = useMemo(() => {
    const statePyq = (location.state as { pyq?: PYQ })?.pyq;
    if (statePyq && (statePyq.id === targetId || statePyq.id?.replace(/[-_]/g, "") === targetId.replace(/[-_]/g, ""))) {
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
    }, 8000);

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
        }
      })
      .catch((err) => {
        console.error("Failed to fetch paper catalog for recommendations:", err);
        if (isMounted) setLoadingRelated(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute all related papers based on subject, curriculum syllabus, branch & semester
  const relatedMatches = useMemo(() => {
    if (!pyq) return [];
    return getRelatedPapers(pyq, allPapers, { filter: "all", limit: 24 });
  }, [pyq, allPapers]);

  // Generate canonical unique URL for this PYQ with pyqId as the sole identifier
  const activeId = pyq?.id || targetId;
  const canonicalUrl = `${window.location.origin}/pyq?pyqId=${encodeURIComponent(activeId)}`;

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
      <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] py-12 bg-[#FAF9F6] text-black min-h-[75vh] font-share flex flex-col justify-center" data-testid="pyq-not-found-page">
        <Helmet>
          <title>Paper Not Found | GetPYQ</title>
          <meta name="description" content="The requested examination paper could not be found on GetPYQ." />
        </Helmet>
        <div className="bg-white border-2 border-black rounded-2xl p-8 sm:p-10 shadow-[6px_6px_0px_#000] text-center">
          {/* Brutalist Warning Icon */}
          <div className="w-16 h-16 bg-amber-200 border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#000] mx-auto mb-6">
            <FileText className="w-8 h-8 text-black stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-momo font-bold text-black uppercase tracking-tight">
            Question Paper Not Found
          </h1>

          <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1.5 bg-gray-100 border-2 border-black rounded-lg text-xs font-mono font-black text-gray-800 shadow-[2px_2px_0px_#000]">
            <span>Requested PYQ ID:</span>
            <span className="text-[#2563EB] select-all font-bold">{targetId || "Not Provided"}</span>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto mt-4 mb-8 leading-relaxed">
            The past year question paper requested with ID <span className="font-bold text-black">{targetId || "(empty)"}</span> could not be located in our active database. It may have been relocated, or the URL link may be mistyped.
          </p>

          {/* Action Button Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
            <button
              onClick={() => loadPaper(true)}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white border-2 border-black rounded-lg px-5 py-3 text-xs font-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isRetrying ? "animate-spin" : ""}`} />
              {isRetrying ? "Retrying..." : "Retry Search"}
            </button>

            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white border-2 border-black rounded-lg px-5 py-3 text-xs font-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              Browse All Papers
            </Link>

            <Link
              to="/requests"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black rounded-lg px-5 py-3 text-xs font-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Request Paper
            </Link>

            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-black border-2 border-black rounded-lg px-5 py-3 text-xs font-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              Upload Paper
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 2. Normal PYQ Detail Page UI - Loaded directly without interstitial loading splash
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
      <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-6 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="pyq-detail-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`bput ${pyq?.paper || "paper"}, bput ${branchName} pyq, bput ${semesterNum} previous questions, bput ${pyq?.year || ""} ${pyq?.exam_type || "exam"} paper, bput engineering questions`} />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="GetPYQ" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://i.ibb.co/DH6fNLnr/file-00000000a16482118ce8d70bb897524d.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://i.ibb.co/DH6fNLnr/file-00000000a16482118ce8d70bb897524d.png" />
        <meta name="twitter:url" content={canonicalUrl} />

        {/* Canonical Link */}
        <link rel="canonical" href={canonicalUrl} />

        {/* LearningResource & DigitalDocument Schema.org JSON-LD */}
        {pyq && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DigitalDocument",
              "name": `${pyq.paper} - BPUT Previous Year Question Paper`,
              "headline": `${pyq.paper} (${pyq.exam_type} ${pyq.year}) BPUT Examination Paper`,
              "description": pageDescription,
              "educationalLevel": `Semester ${pyq.semester}`,
              "inLanguage": "en",
              "isAccessibleForFree": true,
              "provider": {
                "@type": "CollegeOrUniversity",
                "name": "Biju Patnaik University of Technology (BPUT)"
              },
              "publisher": {
                "@type": "Organization",
                "name": "GetPYQ",
                "url": "https://getpyq.com"
              },
              "about": [
                pyq.paper,
                pyq.branch,
                "BPUT Question Paper",
                "B.Tech Engineering Examination"
              ]
            })}
          </script>
        )}
      </Helmet>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Attachment Previewer */}
        <div className="lg:col-span-8 border-2 border-black rounded-2xl overflow-hidden bg-white w-full shadow-[4px_4px_0px_#000] flex flex-col min-h-[510px]" data-testid="pyq-preview">
          <PdfViewer fileUrl={fileUrl} title={pyq?.paper || "Question Paper"} fileId={resolvedFileId} file_id={resolvedFileId} loading={loading} />
        </div>

        {/* Right column: Action Panel & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000] text-black">
            
            {/* Header with icon & Paper Title */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center bg-amber-100 shadow-[2px_2px_0px_#000] shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">BPUT Examination Paper</span>
                {pyq ? (
                  <h1 className="text-base sm:text-lg font-momo font-bold leading-tight text-black mt-0.5 break-words" data-testid="pyq-title">
                    {pyq.paper}
                  </h1>
                ) : (
                  <div className="h-6 w-48 bg-gray-200 rounded mt-1 animate-pulse" />
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {pyq ? (
                <>
                  <Badge tone={isCommonToAllBranches(pyq.branch) ? "green" : parseBranches(pyq.branch).length > 1 ? "blue" : "purple"}>
                    {isCommonToAllBranches(pyq.branch) ? (
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 stroke-[2.5]" /> All Branches (Common)
                      </span>
                    ) : (
                      formatBranchDisplay(pyq.branch)
                    )}
                  </Badge>
                  <Badge tone="orange">Semester {pyq.semester}</Badge>
                  <Badge tone="gray">{pyq.year}</Badge>
                  <Badge tone="green">{pyq.exam_type}</Badge>
                </>
              ) : (
                <>
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </>
              )}
            </div>

            <hr className="border-t border-black/10 my-4" />

            {/* Interactive action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onDownload}
                disabled={!pyq}
                data-testid="download-main-btn"
                className="inline-flex w-full h-12 items-center justify-center gap-2 bg-[#2563EB] text-white border-2 border-black rounded-lg text-xs font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:bg-[#1d4ed8] hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4.5 h-4.5 stroke-[2.5]" /> Download This Paper
              </button>

              <button
                onClick={onWhatsAppShare}
                disabled={!pyq && !targetId}
                data-testid="whatsapp-share-btn"
                className="inline-flex w-full h-12 items-center justify-center gap-2 bg-[#22C55E] text-white border-2 border-black rounded-lg text-xs font-share font-bold shadow-[3.5px_3.5px_0px_#000] hover:bg-[#1a9f4c] hover:scale-102 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" /> Share on WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onUpvote}
                  disabled={hasUpvoted || isUpvoting || !pyq}
                  data-testid="pyq-upvote-btn"
                  className={`inline-flex items-center justify-center gap-1.5 h-10 border-2 border-black rounded-lg text-xs font-bold font-share shadow-[2.5px_2.5px_0px_#000] transition-all cursor-pointer ${
                    hasUpvoted
                      ? "bg-amber-100 text-amber-900 border-black cursor-default"
                      : "bg-white hover:bg-stone-50 text-black active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
                  }`}
                  title={hasUpvoted ? "You found this helpful" : "Mark this paper as helpful"}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 stroke-[2.5] ${hasUpvoted ? "fill-amber-500 text-amber-700" : ""}`} />
                  <span>{hasUpvoted ? "Helpful!" : "Helpful"} ({upvotes})</span>
                </button>

                <button
                  type="button"
                  onClick={onCopyLink}
                  data-testid="pyq-copy-link-btn"
                  className="inline-flex items-center justify-center gap-1.5 h-10 bg-white hover:bg-stone-50 text-black border-2 border-black rounded-lg text-xs font-bold font-share shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  title="Copy permanent direct link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Separator / Footer text */}
            <hr className="border-t-2 border-dashed border-black/10 my-5" />

            <div className="space-y-2 text-[10px] font-bold text-gray-500 select-none">
              {(pyq?.fileName || pyq?.file_name) && (
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0">File</span>
                  <span className="font-mono text-gray-700 truncate max-w-[200px]" title={pyq?.fileName || pyq?.file_name}>
                    {pyq?.fileName || pyq?.file_name}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Branch Applicability</span>
                <span className="font-bold text-[#2563EB] text-right truncate max-w-[200px]" title={formatBranchDisplay(pyq?.branch || "")}>
                  {formatBranchDisplay(pyq?.branch || "")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>PYQ ID</span>
                <span className="font-mono text-black font-extrabold">{pyq?.id || targetId || "..."}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contributed By</span>
                <span className="font-bold text-black">{pyq?.uploader_name || "Community Member"}</span>
              </div>
            </div>
          </div>

          {/* Guidelines Notice Card */}
          <div className="bg-[#FFF7ED] border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_#000]">
            <h3 className="font-momo font-bold text-xs text-black mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#F97316] stroke-[2.5]" /> Direct Access Guarantee
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-700 font-medium leading-relaxed">
              Every past paper has a permanent, direct URL. Sharing this link allows any classmate to view and download this exact paper directly without registration.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. Related Question Papers - Content Discovery Section                   */}
      {/* ------------------------------------------------------------------------- */}
      <section className="mt-12 pt-8 border-t-2 border-black" aria-label="Related Question Papers" data-testid="related-papers-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 rounded-lg bg-amber-200 border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] shrink-0">
                <BookOpen className="w-4 h-4 text-black stroke-[2.5]" />
              </span>
              <h2 className="text-xl sm:text-2xl font-momo font-bold tracking-tight text-black">
                Related Question Papers
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-2xl">
              Related BPUT papers for {pyq?.branch || "Engineering"} {pyq?.semester ? `Semester ${pyq.semester}` : ""} and curriculum topics.
            </p>
          </div>

          {relatedMatches.length > 0 && (
            <div className="self-start sm:self-center shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-share bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000]" data-testid="related-papers-count">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold">{relatedMatches.length}</span> Available
              </span>
            </div>
          )}
        </div>

        {/* Content list or Skeleton */}
        {loadingRelated || loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="related-papers-loading">
            {[0, 1, 2].map((idx) => (
              <PYQCardSkeleton key={idx} index={idx} />
            ))}
          </div>
        ) : relatedMatches.length === 0 ? (
          <div className="w-full bg-white border-2 border-black rounded-2xl p-8 text-center shadow-[4px_4px_0px_#000]" data-testid="related-papers-empty">
            <div className="w-12 h-12 bg-amber-100 border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#000]">
              <Layers className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-momo font-bold text-base text-black mb-1">No other related papers yet</h3>
            <p className="text-xs text-gray-600 mb-4 max-w-md mx-auto">
              Be the first to contribute past question papers for {pyq?.branch || "this branch"} semester {pyq?.semester || ""}.
            </p>
            {pyq?.branch && (
              <Link
                to={`/upload?branch=${encodeURIComponent(pyq.branch)}&semester=${encodeURIComponent(pyq.semester || "1")}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#1d4ed8] transition-all"
              >
                Upload Question Paper <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="related-papers-grid">
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
    blue: "bg-blue-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]",
    orange: "bg-amber-200 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]",
    gray: "bg-stone-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]",
    red: "bg-red-200 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]",
    green: "bg-emerald-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]",
    purple: "bg-purple-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold ${map[tone]} select-none inline-flex items-center gap-1`}>
      {children}
    </span>
  );
}
