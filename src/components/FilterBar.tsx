import React, { useState, useEffect, useMemo } from "react";
import {
  Filter,
  RotateCcw,
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
  Layers,
  ChevronDown,
  X,
  Edit3
} from "lucide-react";
import { BRANCHES, SEMESTERS, YEARS, EXAM_TYPES, getBranchSemesterSubjects, normalizeBranchKey } from "../lib/constants";
import { FilterOptionsResponse } from "../types";

export interface FilterState {
  branch: string;
  semester: string;
  paper: string;
  year: string;
  exam_type: string;
  search?: string;
}

interface FilterBarProps {
  filters: FilterState;
  options: FilterOptionsResponse;
  onChangeFilter: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  totalResults?: number;
  loading?: boolean;
}

export default function FilterBar({
  filters,
  options,
  onChangeFilter,
  onReset,
  totalResults,
  loading = false,
}: FilterBarProps) {
  const branchList = useMemo(() => {
    const set = new Set<string>(BRANCHES);
    if (options.branches && options.branches.length > 0) {
      options.branches.forEach((b) => {
        const norm = normalizeBranchKey(b);
        if (norm && norm !== "&" && norm !== "/" && norm.length > 1) {
          set.add(norm);
        }
      });
    }
    return Array.from(set);
  }, [options.branches]);

  const semList = options.semesters.length
    ? Array.from(new Set([...SEMESTERS, ...options.semesters]))
    : SEMESTERS;

  const yearList = options.years.length
    ? Array.from(new Set([...YEARS, ...options.years])).sort((a, b) =>
        b.localeCompare(a)
      )
    : YEARS;

  const examList = useMemo(() => {
    const raw = options.exam_types.length
      ? Array.from(new Set([...EXAM_TYPES, ...options.exam_types]))
      : Array.from(EXAM_TYPES);
    return raw.filter((e) => {
      const el = e.toLowerCase().trim();
      return !el.includes("mid") && !el.includes("end") && !el.includes("suppl");
    });
  }, [options.exam_types]);

  const curriculumSubjects = useMemo(() => {
    return getBranchSemesterSubjects(filters.branch, filters.semester);
  }, [filters.branch, filters.semester]);

  const allKnownSubjects = curriculumSubjects;
  const isKnownSubject = filters.paper === "all" || filters.paper === "" || allKnownSubjects.includes(filters.paper);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(!isKnownSubject && filters.paper !== "");
  const [customPaperText, setCustomPaperText] = useState<string>(!isKnownSubject ? filters.paper : "");

  useEffect(() => {
    if (filters.paper && filters.paper !== "all" && !allKnownSubjects.includes(filters.paper)) {
      setIsOtherSelected(true);
      setCustomPaperText(filters.paper);
    } else if (filters.paper === "all" || filters.paper === "") {
      if (!isOtherSelected) {
        setCustomPaperText("");
      }
    } else if (allKnownSubjects.includes(filters.paper)) {
      setIsOtherSelected(false);
      setCustomPaperText("");
    }
  }, [filters.paper, allKnownSubjects]);

  const handleReset = () => {
    setIsOtherSelected(false);
    setCustomPaperText("");
    onReset();
  };

  const activeFiltersCount = [
    filters.branch !== "all" && filters.branch !== "",
    filters.semester !== "all" && filters.semester !== "",
    (filters.paper !== "all" && filters.paper !== "") || isOtherSelected,
    filters.year !== "all" && filters.year !== "",
    filters.exam_type !== "all" && filters.exam_type !== "",
    Boolean(filters.search && filters.search.trim() !== ""),
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div
      className="bg-white p-4 sm:p-5 mb-6 w-full border border-slate-200/90 rounded-2xl shadow-xs font-sans transition-all"
      data-testid="serial-selectors-container"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 flex-nowrap w-full pb-3 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Filter className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
              Filter Question Papers
            </h3>
            {typeof totalResults === "number" && (
              <p className="text-[10px] text-slate-400">
                {totalResults} {totalResults === 1 ? "paper" : "papers"} found
              </p>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className={`h-8 px-3 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0 ${
            hasActiveFilters
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 active:scale-95"
              : "bg-slate-100 text-slate-400 border border-slate-200/60 opacity-60 cursor-not-allowed"
          }`}
          data-testid="clear-filters"
          title="Reset all filter options"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* 1. Branch */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 pl-0.5 select-none">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            Branch
          </label>
          <div className="relative w-full">
            <select
              value={filters.branch}
              onChange={(e) => onChangeFilter("branch", e.target.value)}
              className={`w-full h-10 border text-xs font-medium pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.branch !== "all" && filters.branch !== ""
                  ? "bg-emerald-50/60 border-emerald-500 text-emerald-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500"
              }`}
              data-testid="selector-branch"
              title="Select Branch"
            >
              <option value="all">All Branches</option>
              {branchList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 2. Semester */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 pl-0.5 select-none">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Semester
          </label>
          <div className="relative w-full">
            <select
              value={filters.semester}
              onChange={(e) => onChangeFilter("semester", e.target.value)}
              className={`w-full h-10 border text-xs font-medium pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.semester !== "all" && filters.semester !== ""
                  ? "bg-blue-50/60 border-blue-500 text-blue-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500"
              }`}
              data-testid="selector-semester"
              title="Select Semester"
            >
              <option value="all">All Semesters</option>
              {semList.map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 3. Subject */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 pl-0.5 select-none">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Subject
          </label>
          <div className="relative w-full">
            <select
              value={isOtherSelected ? "other" : filters.paper}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "other") {
                  setIsOtherSelected(true);
                  onChangeFilter("paper", customPaperText || "");
                } else {
                  setIsOtherSelected(false);
                  setCustomPaperText("");
                  onChangeFilter("paper", val);
                }
              }}
              className={`w-full h-10 border text-xs font-medium pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                (filters.paper !== "all" && filters.paper !== "") || isOtherSelected
                  ? "bg-emerald-50/60 border-emerald-500 text-emerald-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500"
              }`}
              data-testid="selector-paper"
              title="Select Subject"
            >
              <option value="all">
                {filters.branch !== "all" && filters.semester !== "all"
                  ? `All Subjects (${filters.branch} Sem ${filters.semester})`
                  : filters.branch !== "all"
                  ? `All Subjects (${filters.branch})`
                  : filters.semester !== "all"
                  ? `All Subjects (Sem ${filters.semester})`
                  : "All Subjects"}
              </option>
              {curriculumSubjects.length > 0 && (
                <optgroup
                  label={
                    filters.branch !== "all" && filters.semester !== "all"
                      ? `${filters.branch} Sem ${filters.semester} Subjects (${curriculumSubjects.length})`
                      : filters.branch !== "all"
                      ? `${filters.branch} Curriculum Subjects`
                      : filters.semester !== "all"
                      ? `Semester ${filters.semester} Subjects`
                      : "Curriculum Subjects"
                  }
                >
                  {curriculumSubjects.map((s) => (
                    <option key={`curr-${s}`} value={s}>
                      {s}
                    </option>
                  ))}
                </optgroup>
              )}
              <option value="other" className="font-semibold text-emerald-700">
                ✍️ Other (Custom Subject)...
              </option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 4. Examination Year */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 pl-0.5 select-none">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            Year
          </label>
          <div className="relative w-full">
            <select
              value={filters.year}
              onChange={(e) => onChangeFilter("year", e.target.value)}
              className={`w-full h-10 border text-xs font-medium pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.year !== "all" && filters.year !== ""
                  ? "bg-purple-50/60 border-purple-500 text-purple-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500"
              }`}
              data-testid="selector-year"
              title="Select Examination Year"
            >
              <option value="all">All Years</option>
              {yearList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 5. Paper Type */}
        <div className="flex flex-col gap-1 w-full col-span-2 sm:col-span-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 pl-0.5 select-none">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            Exam Type
          </label>
          <div className="relative w-full">
            <select
              value={filters.exam_type}
              onChange={(e) => onChangeFilter("exam_type", e.target.value)}
              className={`w-full h-10 border text-xs font-medium pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.exam_type !== "all" && filters.exam_type !== ""
                  ? "bg-emerald-50/60 border-emerald-500 text-emerald-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-emerald-500"
              }`}
              data-testid="selector-exam-type"
              title="Select Paper Type"
            >
              <option value="all">All Types</option>
              {examList.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      {/* Separate Custom Paper Input Field */}
      {isOtherSelected && (
        <div
          className="mt-3 pt-3 border-t border-slate-100"
          data-testid="separate-custom-paper-container"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 max-w-xl">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0 select-none">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              Custom Subject:
            </label>
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={customPaperText}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomPaperText(val);
                  onChangeFilter("paper", val);
                }}
                placeholder="Type custom subject name..."
                className="w-full h-9 border border-emerald-300 bg-emerald-50/40 text-emerald-950 placeholder:text-slate-400 text-xs font-medium pl-3 pr-8 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                data-testid="input-custom-paper"
                autoFocus
              />
              {customPaperText && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomPaperText("");
                    onChangeFilter("paper", "");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                  title="Clear custom subject text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips / Pills */}
      {hasActiveFilters && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider select-none mr-1">
            Active:
          </span>

          {filters.branch && filters.branch !== "all" && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Branch: {filters.branch}
              <button
                type="button"
                onClick={() => onChangeFilter("branch", "all")}
                className="hover:text-emerald-950 cursor-pointer ml-0.5"
                title="Remove Branch filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.semester && filters.semester !== "all" && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Sem: {filters.semester}
              <button
                type="button"
                onClick={() => onChangeFilter("semester", "all")}
                className="hover:text-blue-950 cursor-pointer ml-0.5"
                title="Remove Semester filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {((filters.paper && filters.paper !== "all") || (isOtherSelected && customPaperText)) && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Subject: {filters.paper || customPaperText}
              <button
                type="button"
                onClick={() => {
                  setIsOtherSelected(false);
                  setCustomPaperText("");
                  onChangeFilter("paper", "all");
                }}
                className="hover:text-emerald-950 cursor-pointer ml-0.5"
                title="Remove Subject filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.year && filters.year !== "all" && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Year: {filters.year}
              <button
                type="button"
                onClick={() => onChangeFilter("year", "all")}
                className="hover:text-purple-950 cursor-pointer ml-0.5"
                title="Remove Year filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.exam_type && filters.exam_type !== "all" && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Type: {filters.exam_type}
              <button
                type="button"
                onClick={() => onChangeFilter("exam_type", "all")}
                className="hover:text-slate-950 cursor-pointer ml-0.5"
                title="Remove Exam Type filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.search && filters.search.trim() !== "" && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Search: "{filters.search}"
              <button
                type="button"
                onClick={() => onChangeFilter("search", "")}
                className="hover:text-slate-950 cursor-pointer ml-0.5"
                title="Clear Search term"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
