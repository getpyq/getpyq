import React, { useMemo, useState, useEffect } from "react";
import { FileText } from "lucide-react";

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
  fileId?: string;
  file_id?: string;
  loading?: boolean;
}

/**
 * Robust extractor for Google Drive file IDs across all URL variations
 */
export function extractDriveId(input?: string): string {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (trimmed === "local_offline_mode" || trimmed === "") return "";

  // 1. Direct ID (Alphanumeric with dashes/underscores, typically 25-50 chars, no slashes or dots)
  if (!trimmed.includes("/") && !trimmed.includes(".") && !trimmed.includes(":") && trimmed.length >= 20) {
    return trimmed;
  }

  // 2. Standard /file/d/<id>/
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // 3. Query param id=<id>
  const matchParamId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchParamId && matchParamId[1]) return matchParamId[1];

  // 4. /open?id=<id> or /uc?id=<id>
  const matchOpenId = trimmed.match(/\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (matchOpenId && matchOpenId[1]) return matchOpenId[1];

  // 5. /d/<id>/
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  return "";
}

export default function PdfViewer({ fileUrl, title, fileId, file_id, loading }: PdfViewerProps) {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  // Resolve Google Drive file ID from props or fileUrl
  const driveId = useMemo(() => {
    return (
      extractDriveId(fileId) ||
      extractDriveId(file_id) ||
      extractDriveId(fileUrl) ||
      ""
    );
  }, [fileId, file_id, fileUrl]);

  // Google Drive preview embed URL (The proven, CORS-proof way to display Google Drive PDFs)
  const embedUrl = useMemo(() => {
    if (driveId) {
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }
    return fileUrl || "";
  }, [driveId, fileUrl]);

  // Reset iframe loading state when URL changes
  useEffect(() => {
    setIsIframeLoaded(false);
  }, [embedUrl]);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[580px] sm:min-h-[640px] flex items-center justify-center p-8 bg-white select-none">
        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[580px] sm:min-h-[640px] bg-white relative flex flex-col select-none overflow-hidden">
      {embedUrl ? (
        <>
          {/* Subtle loading spinner while iframe renders */}
          {!isIframeLoaded && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-2xs flex items-center justify-center z-10 transition-opacity">
              <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Pure PDF Preview with zero duplicate toolbar or text clutter */}
          <iframe
            src={embedUrl}
            onLoad={() => setIsIframeLoaded(true)}
            className="w-full h-full min-h-[580px] sm:min-h-[640px] block border-0 p-0 m-0 flex-1 bg-white"
            style={{ border: "none", padding: 0, margin: 0, background: "#FFFFFF" }}
            title={title || "BPUT Question Paper"}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </>
      ) : (
        <div className="w-full h-full min-h-[580px] sm:min-h-[640px] flex items-center justify-center p-8 bg-white text-slate-300">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <FileText className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      )}
    </div>
  );
}
