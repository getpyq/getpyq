import React, { useState, useEffect } from "react";
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
  Calendar,
  Clock
} from "lucide-react";
import { NoticeItem, NoticeType, getActiveNotices } from "../data/notices";

interface NoticeTypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  headerAccent: string;
  buttonBg: string;
  buttonHoverBg: string;
  buttonTextColor: string;
}

const TYPE_CONFIG: Record<NoticeType, NoticeTypeConfig> = {
  exam_update: {
    icon: CalendarCheck,
    label: "Exam Update",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-950",
    badgeBorder: "border-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-800",
    borderColor: "border-emerald-500",
    headerAccent: "bg-emerald-50",
    buttonBg: "bg-emerald-600",
    buttonHoverBg: "hover:bg-emerald-700",
    buttonTextColor: "text-white"
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-950",
    badgeBorder: "border-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    borderColor: "border-blue-500",
    headerAccent: "bg-blue-50",
    buttonBg: "bg-[#2563EB]",
    buttonHoverBg: "hover:bg-[#1D4ED8]",
    buttonTextColor: "text-white"
  },
  festival: {
    icon: PartyPopper,
    label: "Festival Special",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-950",
    badgeBorder: "border-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
    borderColor: "border-orange-500",
    headerAccent: "bg-orange-50",
    buttonBg: "bg-[#F97316]",
    buttonHoverBg: "hover:bg-[#ea580c]",
    buttonTextColor: "text-black"
  },
  wish: {
    icon: Sparkles,
    label: "Best Wishes",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-950",
    badgeBorder: "border-amber-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-800",
    borderColor: "border-amber-500",
    headerAccent: "bg-amber-50",
    buttonBg: "bg-[#FACC15]",
    buttonHoverBg: "hover:bg-[#eab308]",
    buttonTextColor: "text-black"
  }
};

/**
 * Formats ISO timestamps into a human-friendly date range
 */
function formatDateRange(startIso?: string, endIso?: string): string {
  if (!startIso || !endIso) return "";
  try {
    const s = new Date(startIso);
    const e = new Date(endIso);
    const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${s.toLocaleDateString("en-US", opt)} – ${e.toLocaleDateString("en-US", opt)}`;
  } catch {
    return "";
  }
}

export default function NoticeModal() {
  const [activeQueue, setActiveQueue] = useState<NoticeItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Load notices that fall strictly within starting & ending timestamps on mount
  useEffect(() => {
    const validNotices = getActiveNotices();
    if (validNotices.length === 0) return;

    // Filter out already closed notices from session storage
    let seenIds: string[] = [];
    try {
      const raw = sessionStorage.getItem("getpyq_seen_notice_ids");
      if (raw) seenIds = JSON.parse(raw);
    } catch {}

    const remaining = validNotices.filter((n) => !seenIds.includes(n.id));
    if (remaining.length > 0) {
      setActiveQueue(remaining);
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual trigger from navbar Announcement Bell
  useEffect(() => {
    const handleOpen = () => {
      const allActive = getActiveNotices();
      if (allActive.length > 0) {
        setActiveQueue(allActive);
        setIsOpen(true);
      }
    };
    window.addEventListener("open-notices-modal", handleOpen);
    return () => window.removeEventListener("open-notices-modal", handleOpen);
  }, []);

  // Current notice to display (head of queue)
  const currentNotice = activeQueue[0];

  // Helper to mark current as seen and advance to the next notice in the queue
  const advanceQueue = () => {
    if (!currentNotice) return;

    try {
      const raw = sessionStorage.getItem("getpyq_seen_notice_ids");
      const seenIds: string[] = raw ? JSON.parse(raw) : [];
      if (!seenIds.includes(currentNotice.id)) {
        seenIds.push(currentNotice.id);
        sessionStorage.setItem("getpyq_seen_notice_ids", JSON.stringify(seenIds));
      }
    } catch {}

    const nextQueue = activeQueue.slice(1);
    if (nextQueue.length > 0) {
      // Immediately transition to the next separate notice
      setActiveQueue(nextQueue);
    } else {
      setActiveQueue([]);
      setIsOpen(false);
    }
  };

  const handleDismiss = () => {
    advanceQueue();
  };

  const handleAction = () => {
    if (currentNotice?.buttonUrl) {
      if (currentNotice.buttonUrl.startsWith("http")) {
        window.open(currentNotice.buttonUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(currentNotice.buttonUrl);
      }
    }
    advanceQueue();
  };

  if (!isOpen || !currentNotice) return null;

  const config = TYPE_CONFIG[currentNotice.type] || TYPE_CONFIG.announcement;
  const TypeIcon = config.icon;
  const dateRangeStr = formatDateRange(currentNotice.startDate, currentNotice.endDate);

  return (
    <AnimatePresence mode="wait">
      <div
        key={currentNotice.id}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        data-testid="notice-modal-overlay"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: -15, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 350 }}
          className="relative w-full max-w-lg bg-[#FAF9F6] border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] z-10 text-left my-auto font-share overflow-hidden flex flex-col"
          data-testid="notice-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Accent Strip */}
          <div className={`px-5 py-3.5 border-b-2 border-black flex items-center justify-between gap-3 ${config.headerAccent}`}>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black text-xs font-black shadow-[1.5px_1.5px_0px_#000] ${config.badgeBg} ${config.badgeText}`}
            >
              <TypeIcon className={`w-3.5 h-3.5 stroke-[2.5] ${config.iconColor}`} />
              <span>{currentNotice.badgeText || config.label}</span>
            </span>

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

          {/* Modal Content Body */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-black flex items-center justify-center shrink-0 shadow-[2.5px_2.5px_0px_#000] ${config.iconBg}`}
              >
                <TypeIcon className={`w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] ${config.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-momo font-bold text-lg sm:text-xl text-black leading-snug mb-1.5">
                  {currentNotice.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {currentNotice.description}
                </p>
              </div>
            </div>

            {/* Active Timestamp Badge */}
            {dateRangeStr && (
              <div className="flex items-center gap-2 bg-stone-100 border-2 border-black/20 rounded-xl px-3 py-2 text-[11px] font-mono text-gray-700">
                <Calendar className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span className="font-bold">Active Period:</span>
                <span className="truncate">{dateRangeStr}</span>
              </div>
            )}
          </div>

          {/* Footer Action Buttons with strict 50% / 50% 2-column layout */}
          <div className="p-4 sm:p-5 bg-white border-t-2 border-black">
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Left 50% Button: Dismiss / Close */}
              <button
                type="button"
                onClick={handleDismiss}
                data-testid="notice-dismiss-btn"
                className="w-full h-11 bg-white hover:bg-stone-100 text-black border-2 border-black rounded-xl text-xs font-bold shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center"
              >
                Close
              </button>

              {/* Right 50% Button: Primary Action */}
              <button
                type="button"
                onClick={handleAction}
                data-testid="notice-action-btn"
                className={`w-full h-11 border-2 border-black rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${config.buttonBg} ${config.buttonHoverBg} ${config.buttonTextColor}`}
              >
                <span className="truncate">{currentNotice.buttonLabel || "Explore"}</span>
                {currentNotice.buttonUrl && (
                  currentNotice.buttonUrl.startsWith("http") ? (
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  )
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
