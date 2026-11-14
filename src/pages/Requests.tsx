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
  BookOpen,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 font-sans text-slate-900 flex-grow" data-testid="requests-page">
      <SEOHead
        title="Request BPUT Question Papers & Solutions PDF | GetPYQ"
        description="Missing a BPUT semester exam question paper? Post a paper request or upvote peer requests to get question papers and solutions uploaded fast."
        keywords="request bput question paper, bput missing paper wishlist, bput pyq request, bput exam papers request, getpyq requests"
        canonicalUrl="https://getpyq.vercel.app/requests"
        branch={branchFilter}
        semester={semesterFilter}
        examType={examTypeFilter}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Request a Paper", item: "/requests" }
        ]}
      />

      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-3.5 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-cabinet font-bold uppercase tracking-wider text-[11px]">BPUT Student Wishlist</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-cabinet font-extrabold text-slate-900 tracking-tight leading-tight">
              Request a BPUT Question Paper
            </h1>
            <p className="font-hand text-lg text-emerald-700 font-semibold">
              ✨ Can&apos;t find a question paper? Put it on the wishlist! ✨
            </p>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Post your request with subject, branch, and semester details so peers and contributors can upload verified question papers for you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-11 px-6 text-xs sm:text-sm font-cabinet font-bold shadow-xs shadow-emerald-600/25 hover:shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
            data-testid="post-request-btn"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 stroke-[2.2]" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 stroke-[2.2]" />
                <span>Post a PYQ Request</span>
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
              className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4"
              data-testid="paper-request-form"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-emerald-600" />
                  <span>Post a New BPUT Paper Request</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium">* Required fields</span>
              </div>

              {/* Branch, Semester, Academic Year, Exam Type */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    Branch *
                  </label>
                  <select
                    value={form.branch}
                    onChange={handleBranchChange}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none bg-white cursor-pointer focus:border-emerald-500"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Semester *
                  </label>
                  <select
                    value={form.semester}
                    onChange={handleSemesterChange}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none bg-white cursor-pointer focus:border-emerald-500"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Year *
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none bg-white cursor-pointer focus:border-emerald-500"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exam Type *
                  </label>
                  <select
                    value={form.exam_type}
                    onChange={(e) => setForm((prev) => ({ ...prev, exam_type: e.target.value }))}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none bg-white cursor-pointer focus:border-emerald-500"
                  >
                    {EXAM_TYPES.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Paper Name *
                </label>
                <select
                  value={selectedSubjectOption}
                  onChange={handleSubjectOptionChange}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none bg-white cursor-pointer focus:border-emerald-500"
                >
                  <option value="">-- Choose from {form.branch} Sem {form.semester} Curriculum --</option>
                  {storedSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="custom">✍️ Type Custom Subject Name...</option>
                </select>

                {isCustomSubject && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customSubjectText}
                      onChange={(e) => {
                        setCustomSubjectText(e.target.value);
                        setForm((prev) => ({ ...prev, subject_name: e.target.value }));
                      }}
                      placeholder="Type custom subject name (e.g. Advanced Operating Systems)..."
                      className="w-full h-10 border border-emerald-300 bg-emerald-50/40 rounded-xl px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Requester Name & Optional Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.requester_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, requester_name: e.target.value }))}
                    placeholder="e.g. Rohan (4th Sem CSE)"
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="e.g. Need with answer key if available..."
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? "Posting..." : "Publish Request"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requested subjects..."
              className="w-full h-9 border border-slate-200 rounded-full pl-9 pr-3 text-xs font-medium outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-medium">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("open")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                statusFilter === "open" ? "bg-white text-amber-700 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("fulfilled")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                statusFilter === "fulfilled" ? "bg-white text-emerald-700 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Fulfilled
            </button>
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Filters:
          </span>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-8 border border-slate-200 rounded-full px-2.5 text-xs font-medium bg-white outline-none cursor-pointer"
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
            className="h-8 border border-slate-200 rounded-full px-2.5 text-xs font-medium bg-white outline-none cursor-pointer"
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
            className="h-8 border border-slate-200 rounded-full px-2.5 text-xs font-medium bg-white outline-none cursor-pointer"
          >
            <option value="all">All Paper Types</option>
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
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer ml-auto"
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
              className="bg-white border border-slate-200/90 rounded-2xl h-44 animate-pulse shadow-xs"
            />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200/90 p-12 rounded-2xl shadow-xs text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-700">
            <FileQuestion className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Request Now</span>
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredRequests.map((req, reqIdx) => {
            const isFulfilled = req.status === "fulfilled";

            return (
              <motion.div
                key={`${req.id || "req"}-${reqIdx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(reqIdx * 0.04, 0.24) }}
                className={`bg-white border border-slate-200/90 hover:border-emerald-300 p-6 rounded-3xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col justify-between relative group ${
                  isFulfilled ? "bg-emerald-50/15" : ""
                }`}
                data-testid="wish-container-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200/70 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {req.branch}
                      </span>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Sem {req.semester}
                      </span>
                      <span className="bg-slate-50 text-slate-600 border border-slate-200/70 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {req.year}
                      </span>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200/70 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {req.exam_type}
                      </span>
                    </div>

                    {isFulfilled ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Fulfilled
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200/70 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                        Open Wish
                      </span>
                    )}
                  </div>

                  <h3 className="font-cabinet font-extrabold text-base sm:text-lg text-slate-900 leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {req.subject_name}
                  </h3>
                  <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                    <span>Requested by <strong className="text-slate-600 font-medium">{req.requester_name}</strong></span>
                  </div>

                  {req.note && (
                    <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-2xl text-xs text-amber-950 mb-3.5 flex items-start gap-2.5 font-normal">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="italic leading-relaxed">&ldquo;{req.note}&rdquo;</span>
                    </div>
                  )}
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
                  <button
                    type="button"
                    onClick={(e) => handleUpvote(req.id, e)}
                    className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                    title="Upvote this request"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{req.upvotes} Upvotes</span>
                  </button>

                  {isFulfilled ? (
                    req.fulfilled_pyq_id && (
                      <Link
                        to={`/pyq?pyqId=${encodeURIComponent(req.fulfilled_pyq_id)}`}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 py-2 text-xs font-cabinet font-bold shadow-xs hover:shadow-md hover:shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <span>View Paper</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUploadMatching(req)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 py-2 text-xs font-cabinet font-bold shadow-xs hover:shadow-md hover:shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Paper</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
