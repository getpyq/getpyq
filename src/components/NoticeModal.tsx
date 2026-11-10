import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Megaphone,
  Sparkles,
  PartyPopper,
  CalendarCheck,
  X,
  ArrowRight,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { NoticeItem, NoticeType, getActiveNotices } from "../data/notices";
import { fetchNotices } from "../lib/api";

interface NoticeTypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  headerBg: string;
  accentGlow: string;
  buttonBg: string;
  buttonHoverBg: string;
  buttonTextColor: string;
}

const TYPE_CONFIG: Record<NoticeType, NoticeTypeConfig> = {
  wish: {
    icon: Sparkles,
    label: "Best Wishes & Blessings",
    badgeBg: "bg-amber-100 border border-amber-300/70",
    badgeText: "text-amber-900",
    iconBg: "bg-gradient-to-br from-amber-400 to-amber-300",
    iconColor: "text-amber-950",
    headerBg: "bg-gradient-to-r from-amber-50/90 via-yellow-50/70 to-amber-50/40",
    accentGlow: "shadow-[0_4px_20px_rgba(245,158,11,0.2)]",
    buttonBg: "bg-amber-500",
    buttonHoverBg: "hover:bg-amber-600",
    buttonTextColor: "text-slate-950"
  },
  festival: {
    icon: PartyPopper,
    label: "Festive Celebration",
    badgeBg: "bg-orange-100 border border-orange-300/70",
    badgeText: "text-orange-900",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
    iconColor: "text-white",
    headerBg: "bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/40",
    accentGlow: "shadow-[0_4px_20px_rgba(249,115,22,0.2)]",
    buttonBg: "bg-orange-600",
    buttonHoverBg: "hover:bg-orange-700",
    buttonTextColor: "text-white"
  },
  exam_update: {
    icon: CalendarCheck,
    label: "Exam Bulletin & Alert",
    badgeBg: "bg-emerald-100 border border-emerald-300/70",
    badgeText: "text-emerald-900",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-400",
    iconColor: "text-white",
    headerBg: "bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/40",
    accentGlow: "shadow-[0_4px_20px_rgba(16,185,129,0.2)]",
    buttonBg: "bg-emerald-600",
    buttonHoverBg: "hover:bg-emerald-700",
    buttonTextColor: "text-white"
  },
  announcement: {
    icon: Megaphone,
    label: "Official Announcement",
    badgeBg: "bg-sky-100 border border-sky-300/70",
    badgeText: "text-sky-900",
    iconBg: "bg-gradient-to-br from-blue-600 to-indigo-500",
    iconColor: "text-white",
    headerBg: "bg-gradient-to-r from-sky-50/90 via-indigo-50/70 to-sky-50/40",
    accentGlow: "shadow-[0_4px_20px_rgba(37,99,235,0.2)]",
    buttonBg: "bg-blue-600",
    buttonHoverBg: "hover:bg-blue-700",
    buttonTextColor: "text-white"
  }
};

export default function NoticeModal() {
  const [currentNotice, setCurrentNotice] = useState<NoticeItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Helper to sync real-time notices strictly from Google Sheet database
  const syncWithSheet = useCallback(async (isUserTriggered = false) => {
    try {
      const sheetNotices = await fetchNotices(isUserTriggered);
      const activeList = getActiveNotices(sheetNotices);

      if (activeList.length === 0) {
        setIsOpen(false);
        setCurrentNotice(null);
        return null;
      }

      // Check which notices have not yet been dismissed in this session
      let seenIds: string[] = [];
      try {
        const raw = sessionStorage.getItem("getpyq_seen_notice_ids");
        if (raw) seenIds = JSON.parse(raw);
      } catch {}

      const unreadList = activeList.filter((n) => !seenIds.includes(n.id));

      if (isUserTriggered) {
        // If opened manually via bell, show the latest notice
        const noticeToShow = activeList[0];
        setCurrentNotice(noticeToShow);
        setIsOpen(true);
        return noticeToShow;
      } else if (unreadList.length > 0) {
        // Automatically show the first unread notice on page entry
        const noticeToShow = unreadList[0];
        setCurrentNotice(noticeToShow);
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return noticeToShow;
      }
    } catch (err) {
      console.warn("Real-time notice sync from sheet error:", err);
    }
    return null;
  }, []);

  // Fetch real-time data from sheet on initial mount
  useEffect(() => {
    syncWithSheet(false);
  }, [syncWithSheet]);

  // Periodic real-time background sync with Google Sheet
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithSheet(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [syncWithSheet]);

  // Listen for manual trigger from navbar Announcement Bell
  useEffect(() => {
    const handleOpen = () => {
      syncWithSheet(true);
    };
    window.addEventListener("open-notices-modal", handleOpen);
    return () => window.removeEventListener("open-notices-modal", handleOpen);
  }, [syncWithSheet]);

  const handleDismiss = () => {
    if (currentNotice) {
      try {
        const raw = sessionStorage.getItem("getpyq_seen_notice_ids");
        const seenIds: string[] = raw ? JSON.parse(raw) : [];
        if (!seenIds.includes(currentNotice.id)) {
          seenIds.push(currentNotice.id);
          sessionStorage.setItem("getpyq_seen_notice_ids", JSON.stringify(seenIds));
        }
      } catch {}
    }
    setIsOpen(false);
  };

  const handleAction = () => {
    if (!currentNotice) return;
    const targetUrl = currentNotice.url || currentNotice.buttonUrl;
    if (targetUrl) {
      if (targetUrl.startsWith("http")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(targetUrl);
      }
    }
    handleDismiss();
  };

  if (!isOpen || !currentNotice) return null;

  const config = TYPE_CONFIG[currentNotice.type] || TYPE_CONFIG.announcement;
  const TypeIcon = config.icon;
  const actionUrl = currentNotice.url || currentNotice.buttonUrl;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentNotice.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
        data-testid="notice-modal-overlay"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.92, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 10, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 380 }}
          className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-2xl z-10 text-left my-auto font-sans overflow-hidden flex flex-col"
          data-testid="individual-notice-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Strip with Top-Right Close Button */}
          <div className={`px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between gap-3 ${config.headerBg}`}>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
            >
              <TypeIcon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="font-cabinet font-bold uppercase tracking-wider text-[11px]">
                {currentNotice.badgeText || config.label}
              </span>
            </span>

            {/* Top Right Close Icon Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-xs transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
              aria-label="Close bulletin"
              data-testid="close-notice-modal"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Notice Body */}
          <div className="p-6 space-y-4 bg-white">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${config.iconBg}`}
              >
                {currentNotice.type === "wish" ? (
                  <Sparkles className="w-6 h-6 stroke-[2] text-amber-950 animate-pulse" />
                ) : (
                  <TypeIcon className="w-6 h-6 stroke-[2] text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {currentNotice.type === "wish" && (
                  <p className="font-hand text-base text-amber-700 font-semibold mb-0.5">
                    ✨ Exam Blessings &amp; Good Wishes ✨
                  </p>
                )}
                <h3 className="font-cabinet font-extrabold text-lg sm:text-xl text-slate-900 leading-snug mb-2.5 tracking-tight">
                  {currentNotice.title}
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
                  {currentNotice.description}
                </div>
              </div>
            </div>

            {/* Metadata Indicator */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Official GetPYQ Notice
              </span>
              {currentNotice.id && (
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 text-[10px]">
                  Ref #{currentNotice.id}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Action Area */}
          {actionUrl && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAction}
                data-testid="notice-action-btn"
                className={`w-full h-11 rounded-full text-xs sm:text-sm font-cabinet font-bold shadow-xs active:scale-95 hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group ${config.buttonBg} ${config.buttonHoverBg} ${config.buttonTextColor}`}
              >
                <span className="truncate">{currentNotice.buttonLabel || "Explore"}</span>
                {actionUrl.startsWith("http") ? (
                  <ExternalLink className="w-4 h-4 stroke-[2] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 stroke-[2] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
