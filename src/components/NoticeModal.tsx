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
    badgeBg: "bg-amber-200",
    badgeText: "text-amber-950",
    iconBg: "bg-gradient-to-br from-amber-300 to-yellow-200",
    iconColor: "text-amber-900",
    headerBg: "bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200",
    accentGlow: "shadow-[0_0_20px_rgba(250,204,21,0.35)]",
    buttonBg: "bg-[#FACC15]",
    buttonHoverBg: "hover:bg-[#eab308]",
    buttonTextColor: "text-black"
  },
  festival: {
    icon: PartyPopper,
    label: "Festive Celebration",
    badgeBg: "bg-orange-200",
    badgeText: "text-orange-950",
    iconBg: "bg-gradient-to-br from-orange-300 to-amber-200",
    iconColor: "text-orange-950",
    headerBg: "bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200",
    accentGlow: "shadow-[0_0_20px_rgba(249,115,22,0.35)]",
    buttonBg: "bg-[#F97316]",
    buttonHoverBg: "hover:bg-[#ea580c]",
    buttonTextColor: "text-white"
  },
  exam_update: {
    icon: CalendarCheck,
    label: "Exam Bulletin & Alert",
    badgeBg: "bg-emerald-200",
    badgeText: "text-emerald-950",
    iconBg: "bg-gradient-to-br from-emerald-300 to-teal-200",
    iconColor: "text-emerald-950",
    headerBg: "bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200",
    accentGlow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    buttonBg: "bg-emerald-600",
    buttonHoverBg: "hover:bg-emerald-700",
    buttonTextColor: "text-white"
  },
  announcement: {
    icon: Megaphone,
    label: "Official Announcement",
    badgeBg: "bg-blue-200",
    badgeText: "text-blue-950",
    iconBg: "bg-gradient-to-br from-blue-300 to-indigo-200",
    iconColor: "text-blue-950",
    headerBg: "bg-gradient-to-r from-blue-200 via-sky-100 to-blue-200",
    accentGlow: "shadow-[0_0_20px_rgba(37,99,235,0.35)]",
    buttonBg: "bg-[#2563EB]",
    buttonHoverBg: "hover:bg-[#1D4ED8]",
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
      <div
        key={currentNotice.id}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto"
        data-testid="notice-modal-overlay"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.94, y: 14, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: -14, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 360 }}
          className={`relative w-full max-w-lg bg-[#FAF9F6] border-3 sm:border-4 border-black rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_#000] sm:shadow-[8px_8px_0px_#000] z-10 text-left my-auto font-share overflow-hidden flex flex-col ${config.accentGlow}`}
          data-testid="individual-notice-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header Strip */}
          <div className={`px-5 py-3.5 sm:py-4 border-b-2 sm:border-b-3 border-black flex items-center justify-between gap-3 ${config.headerBg}`}>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000] ${config.badgeBg} ${config.badgeText}`}
            >
              <TypeIcon className={`w-3.5 h-3.5 stroke-[2.5] ${config.iconColor}`} />
              <span>{currentNotice.badgeText || config.label}</span>
            </span>

            {/* Clean Close X Button */}
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-red-50 hover:text-red-600 flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
              aria-label="Close notice"
              data-testid="close-notice-modal"
              title="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Main Notice Body */}
          <div className="p-5 sm:p-6 md:p-7 space-y-4 bg-[#FAF9F6]">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#000] ${config.iconBg}`}
              >
                {currentNotice.type === "wish" ? (
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-amber-950" />
                ) : (
                  <TypeIcon className={`w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] ${config.iconColor}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-momo font-extrabold text-lg sm:text-xl md:text-2xl text-black leading-tight mb-2 tracking-tight">
                  {currentNotice.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-semibold">
                  {currentNotice.description}
                </p>
              </div>
            </div>

            {/* Individual Reference Identifier */}
            {currentNotice.id && (
              <div className="flex items-center justify-end text-[10px] sm:text-[11px] font-mono font-bold text-gray-500 pt-1">
                <span>Ref: #{currentNotice.id}</span>
              </div>
            )}
          </div>

          {/* Responsive-Friendly Bottom Action Area */}
          <div className="p-4 sm:p-5 bg-white border-t-2 sm:border-t-3 border-black">
            {actionUrl ? (
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* Left Button: Close */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  data-testid="notice-dismiss-btn"
                  className="w-full h-11 sm:h-12 bg-white hover:bg-stone-100 text-black border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center"
                >
                  Close
                </button>

                {/* Right Button: Primary Action */}
                <button
                  type="button"
                  onClick={handleAction}
                  data-testid="notice-action-btn"
                  className={`w-full h-11 sm:h-12 border-2 border-black rounded-xl text-xs sm:text-sm font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${config.buttonBg} ${config.buttonHoverBg} ${config.buttonTextColor}`}
                >
                  <span className="truncate">{currentNotice.buttonLabel || "Explore"}</span>
                  {actionUrl.startsWith("http") ? (
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDismiss}
                data-testid="notice-dismiss-btn"
                className="w-full h-11 sm:h-12 bg-white hover:bg-stone-100 text-black border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center"
              >
                Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
