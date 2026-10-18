import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FileQuestion,
  PlusCircle,
  ThumbsUp,
  UploadCloud,
  CheckCircle2,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  GraduationCap,
  Calendar,
  BookOpen,
  Clock,
  X
} from "lucide-react";
import { getPaperRequests, createPaperRequest, upvotePaperRequest } from "../lib/api";
import { BRANCHES, SEMESTERS, YEARS, EXAM_TYPES, getBranchSemesterSubjects } from "../lib/constants";
import { PaperRequest } from "../types";
import { motion, AnimatePresence } from "motion/react";
import SEOHead from "../components/SEOHead";

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PaperRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubjectOption, setSelectedSubjectOption] = useState("");
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectText, setCustomSubjectText] = useState("");
  const [form, setForm] = useState({
    subject_name: "",
    branch: "CSE",
    semester: "4",
    year: "2023-24",
    exam_type: "Regular/Back",
    requester_name: "",
    note: "",
  });

  // Stored curriculum subjects for the currently selected branch & semester
  const storedSubjects = React.useMemo(() => {
    return getBranchSemesterSubjects(form.branch, form.semester);
  }, [form.branch, form.semester]);

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranch = e.target.value;
    setForm((prev) => ({ ...prev, branch: newBranch }));
    if (!isCustomSubject) {
      setSelectedSubjectOption("");
      setForm((prev) => ({ ...prev, subject_name: "" }));
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSem = e.target.value;
    setForm((prev) => ({ ...prev, semester: newSem }));
    if (!isCustomSubject) {
      setSelectedSubjectOption("");
      setForm((prev) => ({ ...prev, subject_name: "" }));
    }
  };

  const handleSubjectOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSubjectOption(val);
    if (val === "custom") {
      setIsCustomSubject(true);
      setForm((prev) => ({ ...prev, subject_name: customSubjectText }));
    } else {
      setIsCustomSubject(false);
      setForm((prev) => ({ ...prev, subject_name: val }));
    }
  };

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "fulfilled">("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getPaperRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updated = await upvotePaperRequest(id);
      setRequests(updated);
      toast.success("Upvoted request!");
    } catch {
      toast.error("Failed to upvote.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = (isCustomSubject ? customSubjectText : form.subject_name).trim();
    if (!finalSubject) {
      toast.error(isCustomSubject ? "Please type your custom subject / paper name." : "Please select a subject from the dropdown.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newReq = await createPaperRequest({
        subject_name: finalSubject,
        branch: form.branch,
        semester: form.semester,
        year: form.year,
        exam_type: form.exam_type,
        requester_name: form.requester_name.trim() || "Anonymous Student",
        note: form.note.trim(),
      });

      toast.success(`Request for ${newReq.subject_name} posted!`);
      setShowForm(false);
      setForm({
        subject_name: "",
        branch: "CSE",
        semester: "4",
        year: "2023-24",
        exam_type: "Regular/Back",
        requester_name: "",
        note: "",
      });
      setSelectedSubjectOption("");
      setIsCustomSubject(false);
      setCustomSubjectText("");
      loadRequests();
    } catch (e) {
      console.error(e);
      toast.error("Could not post paper request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadMatching = (req: PaperRequest) => {
    const params = new URLSearchParams({
      paper: req.subject_name,
      branch: req.branch,
      semester: req.semester,
      year: req.year,
      exam_type: req.exam_type,
      request_id: req.id,
    });
    navigate(`/upload?${params.toString()}`);
  };

  // Filter logic
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      !search.trim() ||
      r.subject_name.toLowerCase().includes(search.toLowerCase()) ||
      r.requester_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.note && r.note.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && r.status === "open") ||
      (statusFilter === "fulfilled" && r.status === "fulfilled");

    const matchesBranch = branchFilter === "all" || r.branch === branchFilter;
    const matchesSemester = semesterFilter === "all" || r.semester === semesterFilter;
    const matchesExamType = examTypeFilter === "all" || r.exam_type === examTypeFilter;

    return matchesSearch && matchesStatus && matchesBranch && matchesSemester && matchesExamType;
  });

  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-6 sm:pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="requests-page">
      <SEOHead
        title="Request BPUT Question Papers & Solutions | GetPYQ"
        description="Missing a BPUT semester exam question paper? Submit a paper request or upvote existing peer requests to get question papers and solutions uploaded fast."
        keywords="request bput paper, bput exam paper request, bput question paper solutions, bput question paper peer requests"
      />
      {/* Top Banner Header */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 rounded-2xl shadow-[5px_5px_0px_#000] mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-black px-3 py-1 rounded-full text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              BPUT Student Wishlist
            </div>
            <h1 className="text-2xl sm:text-4xl font-momo font-bold text-black tracking-tight uppercase">
              Request a BPUT Question Paper
            </h1>
            <p className="text-gray-700 text-xs sm:text-sm font-semibold leading-relaxed">
              Can't find a question paper in our BPUT library? Post your request here with subject, branch, semester & exam details so peers and contributors can upload matching materials for you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white border-2 border-black rounded-xl h-12 px-5 text-xs sm:text-sm font-black shadow-[3.5px_3.5px_0px_#000] hover:bg-[#F97316] hover:scale-[1.02] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
            data-testid="post-request-btn"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 stroke-[2.5]" /> Close Form
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 stroke-[2.5]" /> Post a PYQ Request
              </>
            )}
          </button>
        </div>
      </div>

      {/* Embedded / Expandable Post Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-8"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white border-2 border-black p-5 sm:p-7 rounded-2xl shadow-[4px_4px_0px_#000] space-y-5 font-share"
              data-testid="paper-request-form"
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-black/10 pb-3">
                <h2 className="text-lg font-momo font-bold uppercase text-black flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-[#2563EB]" />
                  Post a New BPUT Paper Request
                </h2>
                <span className="text-xs text-gray-500 font-bold">* Required fields</span>
              </div>

              {/* 1. Branch, Semester, Academic Year, Exam Type */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Branch */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                    Branch *
                  </label>
                  <select
                    value={form.branch}
                    onChange={handleBranchChange}
                    className="w-full h-11 border-2 border-black rounded-xl px-3 text-sm font-semibold outline-none bg-white shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#F97316]" />
                    Semester *
                  </label>
                  <select
                    value={form.semester}
                    onChange={handleSemesterChange}
                    className="w-full h-11 border-2 border-black rounded-xl px-3 text-sm font-semibold outline-none bg-white shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-600" />
                    Academic Year *
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full h-11 border-2 border-black rounded-xl px-3 text-sm font-semibold outline-none bg-white shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exam Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    Exam Type *
                  </label>
                  <select
                    value={form.exam_type}
                    onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
                    className="w-full h-11 border-2 border-black rounded-xl px-3 text-sm font-semibold outline-none bg-white shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {EXAM_TYPES.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Select Paper / Subject dropdown (same UI as Upload PYQ page) */}
              <div className="space-y-3 pt-2 border-t-2 border-dashed border-black/10">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                    Select Paper / Subject *
                  </label>
                  <select
                    value={selectedSubjectOption}
                    onChange={handleSubjectOptionChange}
                    data-testid="subject-select"
                    className="w-full h-11 border-2 border-black bg-white text-black text-xs sm:text-sm font-semibold px-3 rounded-xl outline-none cursor-pointer focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] transition-all shadow-[2px_2px_0px_#000]"
                    required
                  >
                    <option value="">
                      -- Choose Subject ({form.branch} Sem {form.semester}) --
                    </option>
                    {storedSubjects.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="custom">✍️ Other (Type Custom Subject Name)</option>
                  </select>
                </div>

                {/* Custom Paper Name input - shown if custom is selected or if no stored subjects */}
                {(isCustomSubject || !storedSubjects.length) && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                    data-testid="custom-subject-input-box"
                  >
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      Custom Paper Name *
                    </label>
                    <input
                      data-testid="custom-subject-input"
                      value={customSubjectText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomSubjectText(val);
                        setForm((prev) => ({ ...prev, subject_name: val }));
                      }}
                      placeholder="e.g. Design & Analysis of Algorithms"
                      className="w-full h-11 border-2 border-black bg-white text-black text-xs sm:text-sm font-semibold px-3 rounded-xl outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] transition-all shadow-[2px_2px_0px_#000]"
                      required
                      autoFocus
                    />
                  </motion.div>
                )}
              </div>

              {/* Requester Name & Additional Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul S."
                    value={form.requester_name}
                    onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                    className="w-full h-11 border-2 border-black rounded-xl px-3 text-sm font-semibold outline-none focus:bg-amber-50/50 shadow-[2px_2px_0px_#000]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Note / Specific Details (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Looking for question paper or solutions with question 4..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full h-11 border-2 border-black rounded-xl px-3 text-sm font-semibold outline-none focus:bg-amber-50/50 shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-11 px-4 border-2 border-black rounded-xl text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-[#2563EB] text-white border-2 border-black rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_#000] hover:bg-[#F97316] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing Request..." : "Submit Request"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Bar: Search & Filters */}
      <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000] mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search requested paper name, student, or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border-2 border-black rounded-xl text-xs sm:text-sm font-semibold outline-none shadow-[2px_2px_0px_#000] focus:bg-amber-50/40"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Toggle */}
          <div className="w-full sm:w-auto flex items-center bg-stone-100 border-2 border-black p-1 rounded-xl shadow-[2px_2px_0px_#000]">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`flex-1 sm:flex-initial text-center px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "all" ? "bg-black text-white" : "text-black hover:bg-black/10"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("open")}
              className={`flex-1 sm:flex-initial text-center px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "open" ? "bg-[#F97316] text-white" : "text-black hover:bg-black/10"
              }`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("fulfilled")}
              className={`flex-1 sm:flex-initial text-center px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "fulfilled" ? "bg-emerald-600 text-white" : "text-black hover:bg-black/10"
              }`}
            >
              Fulfilled
            </button>
          </div>
        </div>

        {/* Filters Grid matching FilterBar */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-dashed border-black/10">
          <span className="text-xs font-black uppercase text-gray-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-9 border-2 border-black rounded-lg px-2.5 text-xs font-bold bg-white shadow-[1.5px_1.5px_0px_#000] outline-none cursor-pointer"
          >
            <option value="all">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="h-9 border-2 border-black rounded-lg px-2.5 text-xs font-bold bg-white shadow-[1.5px_1.5px_0px_#000] outline-none cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>

          <select
            value={examTypeFilter}
            onChange={(e) => setExamTypeFilter(e.target.value)}
            className="h-9 border-2 border-black rounded-lg px-2.5 text-xs font-bold bg-white shadow-[1.5px_1.5px_0px_#000] outline-none cursor-pointer"
          >
            <option value="all">All Exam Types</option>
            {EXAM_TYPES.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>

          {(branchFilter !== "all" || semesterFilter !== "all" || examTypeFilter !== "all" || search) && (
            <button
              type="button"
              onClick={() => {
                setBranchFilter("all");
                setSemesterFilter("all");
                setExamTypeFilter("all");
                setSearch("");
              }}
              className="text-xs font-bold text-[#F97316] underline hover:text-black cursor-pointer ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Requests List Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border-2 border-black rounded-2xl h-48 animate-pulse shadow-[4px_4px_0px_#000]"
            />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border-2 border-black p-12 rounded-2xl shadow-[4px_4px_0px_#000] text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 border-2 border-black rounded-full flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
            <FileQuestion className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-lg font-momo font-bold uppercase text-black">No requests found</h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto font-semibold">
            There are no matching paper requests right now. Be the first to post a request for your subject!
          </p>
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setSearch("");
              setStatusFilter("all");
              setBranchFilter("all");
              setSemesterFilter("all");
              setExamTypeFilter("all");
            }}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold shadow-[2.5px_2.5px_0px_#000] hover:bg-[#F97316] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" /> Post Request Now
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredRequests.map((req, reqIdx) => {
            const isFulfilled = req.status === "fulfilled";

            return (
              <div
                key={`${req.id || "req"}-${reqIdx}`}
                className={`bg-white border-2 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between transition-all hover:translate-y-[-2px] relative ${
                  isFulfilled ? "border-emerald-600/80 bg-emerald-50/20" : ""
                }`}
              >
                <div>
                  {/* Top Bar Tags matching Filter Bar Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#2563EB] text-white text-xs font-black px-2.5 py-0.5 rounded-md border border-black shadow-[1.5px_1.5px_0px_#000]">
                        {req.branch}
                      </span>
                      <span className="bg-amber-100 text-[#C2410C] border border-black text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Sem {req.semester}
                      </span>
                      <span className="bg-purple-100 text-purple-800 border border-black text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {req.year}
                      </span>
                      <span className="bg-stone-100 text-stone-800 border border-black text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {req.exam_type}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {isFulfilled ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#000] inline-flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Fulfilled
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-[#C2410C] border border-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#000] shrink-0">
                        Open Request
                      </span>
                    )}
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-base sm:text-lg font-momo font-bold text-black leading-snug mb-1">
                    {req.subject_name}
                  </h3>
                  <div className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
                    <span>Requested by {req.requester_name}</span>
                  </div>

                  {/* Note Callout */}
                  {req.note && (
                    <div className="bg-amber-50/70 border border-black/20 p-2.5 rounded-xl text-xs text-gray-800 font-semibold mb-4 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                      <span>"{req.note}"</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-3 mt-2">
                  <button
                    type="button"
                    onClick={(e) => handleUpvote(req.id, e)}
                    className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-amber-100 text-black border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Upvote this request"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#2563EB] fill-blue-100" />
                    <span>{req.upvotes} Upvotes</span>
                  </button>

                  {isFulfilled ? (
                    req.fulfilled_pyq_id && (
                      <Link
                        to={`/pyq?pyqId=${encodeURIComponent(req.fulfilled_pyq_id)}`}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 text-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_#000] hover:bg-emerald-700 transition-all cursor-pointer"
                      >
                        View Paper <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUploadMatching(req)}
                      className="inline-flex items-center gap-1.5 bg-[#F97316] text-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_#000] hover:bg-[#2563EB] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
                      Upload Paper
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
