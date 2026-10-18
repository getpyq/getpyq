export interface PYQ {
  id: string;
  paper: string;
  branch: string;
  semester: string;
  year: string;
  exam_type: string;
  uploader_name: string;
  upvotes: number;
  downloads: number;
  content_type: string;
  file_url: string; // can be a data URI, normal URL, or PDF path
  created_at: string;
  file_id?: string;
  fileId?: string;
  file_name?: string;
  fileName?: string;
}

export interface PYQSolution {
  id: string;
  pyq_id: string;
  content: string;
  author_name: string;
  created_at: string;
}

export interface GetStatsResponse {
  total_pyqs: number;
  total_branches: number;
  total_downloads: number;
  total_upvotes: number;
}

export interface FilterOptionsResponse {
  branches: string[];
  papers: string[];
  semesters: string[];
  years: string[];
  exam_types: string[];
}

export interface PYQFilters {
  branch?: string;
  paper?: string;
  semester?: string;
  year?: string;
  exam_type?: string;
  sort?: "recent" | "popular" | "downloads" | string;
  search?: string;
  limit?: number;
}

export interface PaperRequest {
  id: string;
  subject_name: string;
  branch: string;
  semester: string;
  year: string;
  exam_type: string;
  requester_name: string;
  subject_code?: string;
  note?: string;
  created_at: string;
  status: "open" | "fulfilled";
  fulfilled_pyq_id?: string;
  upvotes: number;
}

