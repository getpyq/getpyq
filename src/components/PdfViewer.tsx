import React, { useMemo } from "react";
import { FileText } from "lucide-react";

interface PdfViewerProps {
  fileUrl: string;
  title: string;
  fileId?: string;
  file_id?: string; // Support both naming styles
  loading?: boolean;
}

export default function PdfViewer({ fileUrl, title, fileId, file_id, loading }: PdfViewerProps) {
  // Resolve Google Drive file ID from props or parse it dynamically from the fileUrl
  const driveId = useMemo(() => {
    const rawId = fileId || file_id;
    if (rawId && rawId !== "local_offline_mode" && rawId.trim() !== "") {
      return rawId.trim();
    }
    
    // Extract ID from URL if present
    if (fileUrl && !fileUrl.startsWith("data:")) {
      const matchD = fileUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (matchD && matchD[1]) {
        return matchD[1];
      }
      const matchQuery = fileUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchQuery && matchQuery[1]) {
        return matchQuery[1];
      }
    }
    return "";
  }, [fileUrl, fileId, file_id]);

  // Construct Google Drive preview url or fall back directly to direct fileUrl
  const embedUrl = useMemo(() => {
    if (driveId) {
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }
    return fileUrl || "";
  }, [driveId, fileUrl]);

  return (
    <div className="w-full h-full min-h-[510px] bg-white relative flex flex-col font-share">
      {/* Embedded Iframe Container */}
      <div className="flex-1 min-h-[510px] w-full relative bg-white flex flex-col justify-between overflow-hidden">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            className="w-full h-full min-h-[510px] block border-0 p-0 m-0 flex-1 bg-white overflow-hidden"
            style={{ border: "none", padding: 0, margin: 0, background: "#FFFFFF", overflow: "hidden" }}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : loading ? (
          <div className="w-full h-full min-h-[510px] flex flex-col items-center justify-center p-8 bg-stone-50 select-none animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-200 border-2 border-black/10 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-gray-400 stroke-[2]" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-44 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-28"></div>
          </div>
        ) : (
          <div className="w-full h-full min-h-[510px] flex items-center justify-center p-6 text-center text-stone-500 bg-stone-50">
            No valid file reference or PDF data available.
          </div>
        )}
      </div>
    </div>
  );
}
