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
  // Strong logic: prevents splitting compound branches like 'Material & Metallurgy', 'CSE (AI & ML)', 'ECE / ETC'
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

  // Paper Type: strictly excludes 'mid sem' and 'end sem' per user requirements
  const examList = useMemo(() => {
    const raw = options.exam_types.length
      ? Array.from(new Set([...EXAM_TYPES, ...options.exam_types]))
      : Array.from(EXAM_TYPES);
    return raw.filter((e) => {
      const el = e.toLowerCase().trim();
      return !el.includes("mid") && !el.includes("end");
    });
  }, [options.exam_types]);

  // Dynamically obtain subjects based on selected branch and semester
  const curriculumSubjects = useMemo(() => {
    return getBranchSemesterSubjects(filters.branch, filters.semester);
  }, [filters.branch, filters.semester]);

  // Combined list of curriculum subjects plus any other uploaded papers in options.papers
  const allKnownSubjects = useMemo(() => {
    const set = new Set<string>();
    curriculumSubjects.forEach((s) => set.add(s));
    options.papers.forEach((p) => {
      if (p && p.trim()) set.add(p.trim());
    });
    return Array.from(set);
  }, [curriculumSubjects, options.papers]);

  // Determine if currently in custom/other paper mode
  const isKnownSubject = filters.paper === "all" || filters.paper === "" || allKnownSubjects.includes(filters.paper);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(!isKnownSubject && filters.paper !== "");
  const [customPaperText, setCustomPaperText] = useState<string>(!isKnownSubject ? filters.paper : "");

  // If filters.paper changes externally to a custom string, sync other state
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

  // Count active non-default filters
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
      className="bg-white p-3 sm:p-4 mb-6 w-full border-2 border-black shadow-[4px_4px_0px_#000] rounded-2xl font-share animate-fade-in transition-all"
      data-testid="serial-selectors-container"
    >
      {/* Top Header Row - Single Row Guarantee */}
      <div className="flex items-center justify-between gap-2 flex-nowrap w-full pb-2.5 sm:pb-3 mb-3 border-b-2 border-dashed border-black/10">
        <div className="flex items-center gap-2 shrink min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] shrink-0">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5]" />
          </div>
          <h3 className="font-share font-black text-xs sm:text-sm md:text-base text-black uppercase tracking-wide truncate">
            Filter Library
          </h3>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className={`h-7 sm:h-8 px-2.5 sm:px-3.5 border-2 border-black rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-share font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0 whitespace-nowrap ${
            hasActiveFilters
              ? "bg-[#F97316] text-white shadow-[2px_2px_0px_#000] hover:bg-[#e05e03] hover:scale-102 active:translate-x-0.5 active:translate-y-0.5"
              : "bg-stone-100 text-stone-400 border-stone-300 opacity-60 cursor-not-allowed"
          }`}
          data-testid="clear-filters"
          title="Reset all filter options"
        >
          <RotateCcw
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] ${
              hasActiveFilters ? "animate-spin-once" : ""
            }`}
          />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Selectors Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* 1. Branch */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] sm:text-xs font-share font-bold text-gray-700 flex items-center gap-1 pl-0.5 select-none">
            <GraduationCap className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.5]" />
            Branch
          </label>
          <div className="relative w-full">
            <select
              value={filters.branch}
              onChange={(e) => {
                const newBranch = e.target.value;
                onChangeFilter("branch", newBranch);
              }}
              className={`w-full h-11 border-2 text-xs sm:text-sm font-share font-semibold pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.branch !== "all" && filters.branch !== ""
                  ? "bg-blue-50 border-[#2563EB] text-[#1E40AF] font-bold shadow-[2.5px_2.5px_0px_#2563EB]"
                  : "bg-white border-black text-black hover:bg-amber-50/50 shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000]"
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
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black stroke-[2.5]" />
          </div>
        </div>

        {/* 2. Semester */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] sm:text-xs font-share font-bold text-gray-700 flex items-center gap-1 pl-0.5 select-none">
            <BookOpen className="w-3.5 h-3.5 text-[#F97316] stroke-[2.5]" />
            Semester
          </label>
          <div className="relative w-full">
            <select
              value={filters.semester}
              onChange={(e) => {
                const newSem = e.target.value;
                onChangeFilter("semester", newSem);
              }}
              className={`w-full h-11 border-2 text-xs sm:text-sm font-share font-semibold pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.semester !== "all" && filters.semester !== ""
                  ? "bg-amber-50 border-[#F97316] text-[#C2410C] font-bold shadow-[2.5px_2.5px_0px_#F97316]"
                  : "bg-white border-black text-black hover:bg-amber-50/50 shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000]"
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
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black stroke-[2.5]" />
          </div>
        </div>

        {/* 3. Paper (Branch & Semester Subjects + Other option) */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] sm:text-xs font-share font-bold text-gray-700 flex items-center gap-1 pl-0.5 select-none">
            <FileText className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            Paper
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
              className={`w-full h-11 border-2 text-xs sm:text-sm font-share font-semibold pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                (filters.paper !== "all" && filters.paper !== "") || isOtherSelected
                  ? "bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-[2.5px_2.5px_0px_#059669]"
                  : "bg-white border-black text-black hover:bg-amber-50/50 shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000]"
              }`}
              data-testid="selector-paper"
              title="Select Subject / Paper"
            >
              <option value="all">
                {filters.branch !== "all" && filters.semester !== "all"
                  ? `All Papers (${filters.branch} Sem ${filters.semester})`
                  : filters.branch !== "all"
                  ? `All Papers (${filters.branch})`
                  : filters.semester !== "all"
                  ? `All Papers (Sem ${filters.semester})`
                  : "All Papers"}
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
              {options.papers.filter((p) => p && !curriculumSubjects.includes(p)).length > 0 && (
                <optgroup label="Other Available Papers">
                  {options.papers
                    .filter((p) => p && !curriculumSubjects.includes(p))
                    .map((p) => (
                      <option key={`extra-${p}`} value={p}>
                        {p}
                      </option>
                    ))}
                </optgroup>
              )}
              <option value="other" className="font-bold text-[#2563EB]">
                ✍️ Other (Custom Subject)...
              </option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black stroke-[2.5]" />
          </div>
        </div>

        {/* 4. Academic Year */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] sm:text-xs font-share font-bold text-gray-700 flex items-center gap-1 pl-0.5 select-none">
            <Calendar className="w-3.5 h-3.5 text-purple-600 stroke-[2.5]" />
            Year
          </label>
          <div className="relative w-full">
            <select
              value={filters.year}
              onChange={(e) => onChangeFilter("year", e.target.value)}
              className={`w-full h-11 border-2 text-xs sm:text-sm font-share font-semibold pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.year !== "all" && filters.year !== ""
                  ? "bg-purple-50 border-purple-600 text-purple-800 font-bold shadow-[2.5px_2.5px_0px_#9333EA]"
                  : "bg-white border-black text-black hover:bg-amber-50/50 shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000]"
              }`}
              data-testid="selector-year"
              title="Select Academic Year"
            >
              <option value="all">All Years</option>
              {yearList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black stroke-[2.5]" />
          </div>
        </div>

        {/* 5. Paper Type */}
        <div className="flex flex-col gap-1 w-full col-span-2 sm:col-span-1">
          <label className="text-[10px] sm:text-xs font-share font-bold text-gray-700 flex items-center gap-1 pl-0.5 select-none">
            <Layers className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
            Type
          </label>
          <div className="relative w-full">
            <select
              value={filters.exam_type}
              onChange={(e) => onChangeFilter("exam_type", e.target.value)}
              className={`w-full h-11 border-2 text-xs sm:text-sm font-share font-semibold pl-3 pr-8 rounded-xl outline-none cursor-pointer appearance-none transition-all ${
                filters.exam_type !== "all" && filters.exam_type !== ""
                  ? "bg-rose-50 border-rose-600 text-rose-800 font-bold shadow-[2.5px_2.5px_0px_#E11D48]"
                  : "bg-white border-black text-black hover:bg-amber-50/50 shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000]"
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
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Separate Custom Paper Input Field (Shown only when "Other" is selected) */}
      {isOtherSelected && (
        <div
          className="mt-3 pt-3 border-t-2 border-dashed border-emerald-500/20 animate-fade-in"
          data-testid="separate-custom-paper-container"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 max-w-xl">
            <label className="text-[11px] sm:text-xs font-share font-bold text-gray-800 flex items-center gap-1.5 shrink-0 select-none">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              Custom Paper Name:
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
                className="w-full h-10 border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 placeholder:text-gray-400 text-xs sm:text-sm font-share font-bold pl-3 pr-8 rounded-xl outline-none shadow-[2px_2px_0px_#059669] focus:shadow-[3px_3px_0px_#059669] transition-all"
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer p-0.5"
                  title="Clear custom subject text"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips / Pills */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-share font-bold text-gray-500 uppercase tracking-wider select-none">
            Active Filters:
          </span>

          {filters.branch && filters.branch !== "all" && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-[#1E40AF] border border-black rounded-lg px-2.5 py-1 text-xs font-bold shadow-[1.5px_1.5px_0px_#000]">
              Branch: {filters.branch}
              <button
                type="button"
                onClick={() => onChangeFilter("branch", "all")}
                className="hover:text-red-600 cursor-pointer ml-0.5"
                title="Remove Branch filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}

          {filters.semester && filters.semester !== "all" && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-[#C2410C] border border-black rounded-lg px-2.5 py-1 text-xs font-bold shadow-[1.5px_1.5px_0px_#000]">
              Sem: {filters.semester}
              <button
                type="button"
                onClick={() => onChangeFilter("semester", "all")}
                className="hover:text-red-600 cursor-pointer ml-0.5"
                title="Remove Semester filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}

          {((filters.paper && filters.paper !== "all") || (isOtherSelected && customPaperText)) && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-black rounded-lg px-2.5 py-1 text-xs font-bold shadow-[1.5px_1.5px_0px_#000]">
              Paper: {filters.paper || customPaperText}
              <button
                type="button"
                onClick={() => {
                  setIsOtherSelected(false);
                  setCustomPaperText("");
                  onChangeFilter("paper", "all");
                }}
                className="hover:text-red-600 cursor-pointer ml-0.5"
                title="Remove Paper filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}

          {filters.year && filters.year !== "all" && (
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-black rounded-lg px-2.5 py-1 text-xs font-bold shadow-[1.5px_1.5px_0px_#000]">
              Year: {filters.year}
              <button
                type="button"
                onClick={() => onChangeFilter("year", "all")}
                className="hover:text-red-600 cursor-pointer ml-0.5"
                title="Remove Year filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}

          {filters.exam_type && filters.exam_type !== "all" && (
            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-black rounded-lg px-2.5 py-1 text-xs font-bold shadow-[1.5px_1.5px_0px_#000]">
              Type: {filters.exam_type}
              <button
                type="button"
                onClick={() => onChangeFilter("exam_type", "all")}
                className="hover:text-red-600 cursor-pointer ml-0.5"
                title="Remove Type filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}

          {filters.search && filters.search.trim() !== "" && (
            <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 border border-black rounded-lg px-2.5 py-1 text-xs font-bold shadow-[1.5px_1.5px_0px_#000]">
              Search: "{filters.search}"
              <button
                type="button"
                onClick={() => onChangeFilter("search", "")}
                className="hover:text-red-600 cursor-pointer ml-0.5"
                title="Clear Search term"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#2563EB] hover:text-[#F97316] font-bold underline cursor-pointer ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
