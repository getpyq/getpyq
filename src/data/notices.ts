export type NoticeType = "announcement" | "wish" | "festival" | "exam_update";

export interface NoticeItem {
  id: string;
  noticeId?: string;
  type: NoticeType;
  title: string;
  description: string;
  badgeText?: string;
  buttonLabel: string;
  buttonUrl?: string; // e.g. "/browse", "/upload", or external URL
  url?: string;
  startDate?: string;
  endDate?: string;
  startTimestamp?: string; // ISO starting timestamp
  endTimestamp?: string; // ISO ending timestamp
  active: boolean;
}

/**
 * Notice & Announcement items purely driven by real-time Google Sheet data.
 * No hardcoded demo notices are used.
 */
export const ACTIVE_NOTICES: NoticeItem[] = [];

/**
 * Returns only notices that are active AND within their starting and ending timestamps.
 * Strictly uses real-time notices from Google Sheet.
 */
export function getActiveNotices(customList?: NoticeItem[]): NoticeItem[] {
  if (!customList || customList.length === 0) {
    return [];
  }
  const now = new Date().getTime();
  return customList.filter((n) => {
    if (!n.active) return false;
    const start = n.startTimestamp || n.startDate;
    const end = n.endTimestamp || n.endDate;
    if (start && new Date(start).getTime() > now) return false;
    if (end && new Date(end).getTime() < now) return false;
    return true;
  });
}
