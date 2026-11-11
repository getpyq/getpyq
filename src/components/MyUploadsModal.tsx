import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserUploadedPYQs, downloadUrl } from "../lib/api";
import { PYQ } from "../types";
import {
  X,
  FileText,
  Download,
  ThumbsUp,
  ExternalLink,
  Upload,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

export function MyUploadsModal() {
  const { user, isMyUploadsOpen, closeMyUploads } = useAuth();
  const [uploads, setUploads] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserUploadedPYQs(user);
      setUploads(data);
    } catch (err) {
      console.warn("Failed loading user uploads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMyUploadsOpen && user) {
      fetchUploads();
    }
  }, [isMyUploadsOpen, user]);

  if (!isMyUploadsOpen || !user) return null;

  const totalDownloads = uploads.reduce((acc, p) => acc + (p.downloads || 0), 0);
  const totalUpvotes = uploads.reduce((acc, p) => acc + (p.upvotes || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeMyUploads();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>
                  ID: <strong className="text-slate-700 font-mono">{user.serialId}</strong>
                </span>
                <span>•</span>
                <span>
                  Regd: <strong className="text-slate-700 font-mono">{user.regdNo}</strong>
                </span>
                <span>•</span>
                <span>{user.branch}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchUploads}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Refresh uploads list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={closeMyUploads}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 px-6 py-3 bg-emerald-50/40 border-b border-emerald-100/60">
          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Papers</span>
            <span className="text-lg font-black text-slate-900">{uploads.length}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Downloads</span>
            <span className="text-lg font-black text-emerald-700">{totalDownloads}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Community Upvotes</span>
            <span className="text-lg font-black text-amber-600">{totalUpvotes}</span>
          </div>
        </div>

        {/* Uploads List Container */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              My Uploaded Question Papers ({uploads.length})
            </h3>
            <Link
              to="/upload"
              onClick={closeMyUploads}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Paper</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs">Fetching your uploaded papers...</p>
            </div>
          ) : uploads.length === 0 ? (
            <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">No Papers Uploaded Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Be a helpful contributor to the BPUT student community! Upload previous year question papers from your mid sem or semester exams.
              </p>
              <Link
                to="/upload"
                onClick={closeMyUploads}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Paper Now</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {uploads.map((paper) => {
                const downloadLink = downloadUrl(paper.id, paper.file_url, paper.file_id || paper.fileId, true);
                const previewLink = `/pyq?pyqId=${paper.id}`;

                return (
                  <div
                    key={paper.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {paper.paper}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700">{paper.branch}</span>
                          <span>•</span>
                          <span>Sem {paper.semester}</span>
                          <span>•</span>
                          <span>{paper.year}</span>
                          <span>•</span>
                          <span className="text-slate-600">{paper.exam_type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1" title="Downloads">
                          <Download className="w-3 h-3 text-slate-400" />
                          <span>{paper.downloads || 0}</span>
                        </span>
                        <span className="flex items-center gap-1" title="Upvotes">
                          <ThumbsUp className="w-3 h-3 text-slate-400" />
                          <span>{paper.upvotes || 0}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={previewLink}
                          onClick={closeMyUploads}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                        <a
                          href={downloadLink}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Contributor Account</span>
          </span>
          <button
            onClick={closeMyUploads}
            className="px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
