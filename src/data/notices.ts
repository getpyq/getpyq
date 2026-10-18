export type NoticeType = "announcement" | "wish" | "festival" | "exam_update";

export interface NoticeItem {
  id: string;
  type: NoticeType;
  title: string;
  description: string;
  badgeText?: string;
  buttonLabel: string;
  buttonUrl?: string; // Optional URL (e.g. "/browse", "/upload", or external)
  startDate: string; // ISO starting timestamp (notice only shows on/after this time)
  endDate: string; // ISO ending timestamp (notice only shows on/before this time)
  active: boolean;
}

/**
 * Notice & Announcement items with start and end timestamps.
 * A notice only displays when: now >= startDate && now <= endDate && active === true.
 */
export const ACTIVE_NOTICES: NoticeItem[] = [
  {
    id: "notice-exam-update-2026",
    type: "exam_update",
    title: "BPUT Semester Examination Schedule & Question Bank",
    description: "Upcoming regular and back semester examinations are approaching! All branch question archives from 2020 through 2025 have been verified and indexed for 1st to 8th semesters.",
    badgeText: "Exam Alert 2026",
    buttonLabel: "View Exam Papers",
    buttonUrl: "/browse",
    startDate: "2026-10-01T00:00:00Z",
    endDate: "2026-11-30T23:59:59Z",
    active: true
  },
  {
    id: "notice-branch-announcement",
    type: "announcement",
    title: "Specialized Engineering Disciplines Now Live",
    description: "We have updated the repository with dedicated branch-wise and semester-wise papers for CSE (AI & ML), CSE (Data Science), ECE / ETC, EEE, and Production Engineering.",
    badgeText: "Curriculum Update",
    buttonLabel: "Explore Branches",
    buttonUrl: "/browse",
    startDate: "2026-10-10T00:00:00Z",
    endDate: "2026-12-15T23:59:59Z",
    active: true
  },
  {
    id: "notice-festive-wish",
    type: "festival",
    title: "Warm Festive Greetings from Team GetPYQ!",
    description: "Wishing all engineering students, faculty mentors, and student contributors a vibrant, joyous, and prosperous festive season! Celebrate safely and study smart.",
    badgeText: "Festive Greetings",
    buttonLabel: "Contribute a Paper",
    buttonUrl: "/upload",
    startDate: "2026-10-15T00:00:00Z",
    endDate: "2026-11-20T23:59:59Z",
    active: true
  },
  {
    id: "notice-academic-wish",
    type: "wish",
    title: "Best Wishes for Top SGPA & CGPA Scores!",
    description: "Consistent practice with previous year question papers is the highest-yield revision strategy. Believe in yourself and excel in your engineering semester exams!",
    badgeText: "Good Luck",
    buttonLabel: "Start Studying",
    buttonUrl: "/browse",
    startDate: "2026-10-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    active: true
  }
];

/**
 * Returns only notices that are active AND within their starting and ending timestamps.
 */
export function getActiveNotices(): NoticeItem[] {
  const now = new Date().getTime();
  return ACTIVE_NOTICES.filter((n) => {
    if (!n.active) return false;
    if (n.startDate && new Date(n.startDate).getTime() > now) return false;
    if (n.endDate && new Date(n.endDate).getTime() < now) return false;
    return true;
  });
}
