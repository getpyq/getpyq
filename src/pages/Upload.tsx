import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  FileQuestion,
  Eye,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Globe,
  Layers,
  Home
} from "lucide-react";
import { uploadPYQ, fulfillPaperRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { stampPdfFooter } from "../lib/pdfFooterStamper";
import {
  BRANCHES,
  SEMESTERS,
  YEARS,
  EXAM_TYPES,
  COMMON_PAPERS,
  getBranchSemesterSubjects,
  isCommonToAllBranches,
  parseBranches,
  formatBranchDisplay
} from "../lib/constants";
import { motion, AnimatePresence } from "motion/react";
import SEOHead from "../components/SEOHead";

const UPLOAD_IMG = "https://static.prod-images.emergentagent.com/jobs/d9247485-9eba-4be5-85c5-f51a4558b9d1/images/4968edd818717381bac4c50a47e0828034ae78c6ef52868f85e822cf8014a4e3.png";

export default function Upload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const requestId = searchParams.get("request_id") || "";
  const requestPaperName = searchParams.get("paper") || "Requested Paper";

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stampingStatus, setStampingStatus] = useState<string>("");

  // Branch applicability mode: "single" | "all" | "specific"
  const [branchMode, setBranchMode] = useState<"single" | "all" | "specific">("single");
  const [selectedSpecificBranches, setSelectedSpecificBranches] = useState<string[]>([]);

  const [form, setForm] = useState({
    paper: searchParams.get("paper") || "",
    branch: searchParams.get("branch") || "CSE",
    semester: searchParams.get("semester") || "1",
    year: searchParams.get("year") || "2024-25",
    exam_type: searchParams.get("exam_type") || "Regular/Back",
    uploader_name: user?.name || "",
  });

  // Always keep uploader_name in sync with authenticated user
  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({ ...prev, uploader_name: user.name }));
    }
  }, [user]);

  const [isCustomPaper, setIsCustomPaper] = useState(Boolean(searchParams.get("paper")));
  const [selectedPaperOption, setSelectedPaperOption] = useState(
    searchParams.get("paper") ? "custom" : ""
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [newPaperId, setNewPaperId] = useState("");
  const [confetti, setConfetti] = useState<any[]>([]);

  useEffect(() => {
    if (searchParams.get("paper")) {
      setIsCustomPaper(true);
      setSelectedPaperOption("custom");
    }
    const paramBranch = searchParams.get("branch");
    if (paramBranch) {
      if (isCommonToAllBranches(paramBranch)) {
        setBranchMode("all");
        update("branch", "All Branches");
      } else if (paramBranch.includes(",")) {
        setBranchMode("specific");
        const list = parseBranches(paramBranch);
        setSelectedSpecificBranches(list);
        update("branch", list.join(", "));
      } else {
        setBranchMode("single");
        update("branch", paramBranch);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showConfirmModal && !submitting) {
        setShowConfirmModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmModal, submitting]);

  const resetForm = () => {
    setFile(null);
    setForm({
      paper: "",
      branch: "CSE",
      semester: "1",
      year: "2024-25",
      exam_type: "Regular/Back",
      uploader_name: "",
    });
    setBranchMode("single");
    setSelectedSpecificBranches([]);
    setIsCustomPaper(false);
    setSelectedPaperOption("");
    setShowSuccess(false);
    setShowConfirmModal(false);
    setTermsAccepted(true);
    setNewPaperId("");
  };

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleBranchModeChange = (mode: "single" | "all" | "specific") => {
    setBranchMode(mode);
    setSelectedPaperOption("");
    setIsCustomPaper(false);
    update("paper", "");

    if (mode === "single") {
      update("branch", BRANCHES[0]);
    } else if (mode === "all") {
      update("branch", "All Branches");
    } else if (mode === "specific") {
      update("branch", selectedSpecificBranches.join(", "));
    }
  };

  const toggleSpecificBranch = (b: string) => {
    const next = selectedSpecificBranches.includes(b)
      ? selectedSpecificBranches.filter((item) => item !== b)
      : [...selectedSpecificBranches, b];

    setSelectedSpecificBranches(next);
    update("branch", next.join(", "));
    setSelectedPaperOption("");
    setIsCustomPaper(false);
    update("paper", "");
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    update("branch", val);
    setSelectedPaperOption("");
    setIsCustomPaper(false);
    update("paper", "");
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    update("semester", val);
    setSelectedPaperOption("");
    setIsCustomPaper(false);
    update("paper", "");
  };

  const handlePaperOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPaperOption(val);
    if (val === "custom") {
      setIsCustomPaper(true);
      update("paper", "");
    } else {
      setIsCustomPaper(false);
      update("paper", val);
    }
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(f.type) && !/\.(pdf|jpg|jpeg|png|webp)$/i.test(f.name)) {
      toast.error("Only PDF or image files (PDF/JPG/PNG/WEBP) are allowed");
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      toast.error("File is too large (max 25MB limit)");
      return;
    }
    setFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    onFile(e.dataTransfer.files?.[0]);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Contributor sign-in required to publish previous year question papers.");
      openAuthModal("login");
      return;
    }
    if (!file) {
      toast.error("Please choose or drop a question paper file (PDF or image).");
      return;
    }
    if (branchMode === "specific" && selectedSpecificBranches.length === 0) {
      toast.error("Please select at least one branch for this multi-branch paper.");
      return;
    }
    if (!form.paper.trim()) {
      toast.error("Paper Name field is required");
      return;
    }
    setTermsAccepted(true);
    setShowConfirmModal(true);
  };

  const handleConfirmPublish = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in before publishing.");
      openAuthModal("login");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions to publish.");
      return;
    }
    setSubmitting(true);
    try {
      let fileToUpload = file;
      if (file) {
        setStampingStatus("Adding GetPYQ footer to PDF...");
        try {
          const { file: stampedFile, pageCount } = await stampPdfFooter(file);
          fileToUpload = stampedFile;
          toast.success(`GetPYQ footer applied to all ${pageCount} page${pageCount > 1 ? "s" : ""}!`);
        } catch (stampErr) {
          console.warn("Could not stamp PDF footer, proceeding with original file:", stampErr);
        }
      }

      setStampingStatus("Uploading to Google Drive...");
      const fd = new FormData();
      if (fileToUpload) {
        fd.append("file", fileToUpload);
      }
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, v as string);
      });
      // Attach verified student contributor details
      fd.set("uploader_name", user.name);
      fd.append("userId", user.serialId);
      fd.append("regdNo", user.regdNo);
      fd.append("userBranch", user.branch);

      const res = await uploadPYQ(fd);
      setShowConfirmModal(false);
      if (requestId && res?.id) {
        await fulfillPaperRequest(requestId, res.id);
        toast.success(`Fulfilled student request for ${requestPaperName}!`);
      } else {
        toast.success(`PYQ uploaded successfully by ${user.name} (${user.serialId})!`);
      }
      
      const colors = ["#F97316", "#2563EB", "#25D366", "#EAB308", "#EC4899", "#A855F7"];
      const shapes = ["square", "circle", "triangle"];
      const pCount = 70;
      const generated = Array.from({ length: pCount }).map((_, i) => {
        return {
          id: i,
          tx: (Math.random() - 0.5) * 850,
          ty: -180 - Math.random() * 450,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.floor(Math.random() * 12) + 12,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          delay: Math.random() * 0.4,
          rotation: Math.random() * 360,
        };
      });
      setConfetti(generated);
      setNewPaperId(res.id);
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setSubmitting(false);
      setStampingStatus("");
    }
  };

  const candidates = useMemo(() => {
    if (branchMode === "all") {
      return getBranchSemesterSubjects("All Branches", form.semester);
    }
    if (branchMode === "specific") {
      const branchesStr = selectedSpecificBranches.join(", ");
      return getBranchSemesterSubjects(branchesStr, form.semester);
    }
    return getBranchSemesterSubjects(form.branch, form.semester);
  }, [branchMode, form.branch, form.semester, selectedSpecificBranches]);

  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-6 sm:pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="upload-page">
      <SEOHead
        title="Upload BPUT Question Papers & Solutions PDF | GetPYQ"
        description="Upload and contribute BPUT previous year question papers, mid-sem exams, and master solutions. Share resources with BPUT B.Tech students across all engineering branches."
        keywords="upload bput question paper, contribute bput pyq, bput question paper submission, share bput papers, bput btech paper upload, getpyq upload"
        canonicalUrl="https://getpyq.vercel.app/upload"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Upload PYQ", item: "/upload" }
        ]}
      />
      {/* Fulfilling Request Banner */}
      {requestId && (
        <div className="max-w-5xl mx-auto mb-6 bg-amber-100 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] text-white border-2 border-black rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] shrink-0">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-[#2563EB]">
                Fulfilling Student Paper Request
              </div>
              <div className="text-sm font-black text-black">
                Paper: {requestPaperName}
              </div>
            </div>
          </div>
          <span className="bg-white text-black border border-black text-[10px] font-bold px-2.5 py-1 rounded-md shadow-[1px_1px_0px_#000] shrink-0">
            Auto-Prefilled
          </span>
        </div>
      )}

      {/* Centered header block */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-3 select-none">
          ✦ BPUT Paper Archive ✦
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 select-none tracking-tight leading-tight mb-2">
          Upload a BPUT PYQ
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Help fellow students by contributing past BPUT (Biju Patnaik University of Technology) examination papers
        </p>

        {/* Authentication Requirement Banner */}
        {!isAuthenticated && (
          <div className="mt-6 max-w-5xl mx-auto p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Student Contributor Sign-In Required
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  To ensure quality archives and celebrate our student contributors, question paper uploads are reserved for verified student accounts. Sign in or create your contributor account to receive credit on every paper you share!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Sign In / Register to Upload</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleInitialSubmit} className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-start" data-testid="upload-form">
        {/* Dragzone */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200/90 shadow-xs rounded-3xl flex flex-col justify-between md:h-full">
          <div className="h-full flex flex-col justify-center">
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              data-testid="dropzone"
              className={`cursor-pointer aspect-square md:aspect-auto md:min-h-[380px] lg:min-h-[440px] w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-emerald-50/20 hover:border-emerald-400 transition-all flex flex-col items-center justify-center text-center p-6 ${
                drag ? "bg-emerald-50/40 border-emerald-500 border-solid" : ""
              }`}
            >
              {file ? (
                <div className="space-y-4 w-full max-w-sm flex flex-col items-center justify-center animate-fade-in" data-testid="file-preview">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                    <FileText className="w-7 h-7 stroke-[2]" />
                  </div>
                  <div>
                    <p className="font-semibold break-all text-xs text-slate-900">{file.name}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer rounded-full px-3 py-1 bg-rose-50 hover:bg-rose-100 transition-colors"
                    data-testid="remove-file"
                  >
                    <X className="w-3.5 h-3.5" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
                    <UploadCloud className="w-7 h-7 stroke-[2]" />
                  </div>
                  <p className="font-bold text-base text-slate-900 select-none">Drop your file here</p>
                  <p className="text-xs text-slate-400 font-normal mt-1 select-none max-w-xs">or click to browse — PDF or Image (max 25MB)</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 mt-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2 text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Choose File
                  </button>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                data-testid="file-input"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-5 flex items-start gap-2 select-none font-normal leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Files are stored securely. Please ensure all uploaded papers pertain to BPUT University syllabus.</span>
          </p>
        </div>

        {/* Metadata Inputs */}
        <div className="space-y-4">
          {/* Branch Applicability Mode */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Branch Applicability
              </label>
              <span className="text-xs font-medium text-emerald-700">
                {branchMode === "all" ? "🌐 All Branches" : branchMode === "specific" ? selectedSpecificBranches.length > 0 ? `🔀 ${selectedSpecificBranches.length} Branches` : "🔀 Select Branches" : "🎓 Single Branch"}
              </span>
            </div>

            {/* Segmented Mode Selector */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-full text-center text-xs">
              <button
                type="button"
                onClick={() => handleBranchModeChange("single")}
                className={`py-1.5 px-1 rounded-full cursor-pointer transition-all ${
                  branchMode === "single"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Single Branch
              </button>
              <button
                type="button"
                onClick={() => handleBranchModeChange("all")}
                className={`py-1.5 px-1 rounded-full cursor-pointer transition-all ${
                  branchMode === "all"
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Branches (Common)
              </button>
              <button
                type="button"
                onClick={() => handleBranchModeChange("specific")}
                className={`py-1.5 px-1 rounded-full cursor-pointer transition-all ${
                  branchMode === "specific"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Specific Branches
              </button>
            </div>

            {/* Mode-Specific Branch Pickers */}
            {branchMode === "single" && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    data-testid="branch-select"
                    value={form.branch}
                    onChange={handleBranchChange}
                    className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2.5 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
                  >
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Semester</label>
                  <select
                    data-testid="semester-select"
                    value={form.semester}
                    onChange={handleSemesterChange}
                    className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2.5 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {branchMode === "all" && (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-semibold mb-1">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Common Subject for All Branches (Sem {form.semester})</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Semester</label>
                  <select
                    data-testid="semester-select"
                    value={form.semester}
                    onChange={handleSemesterChange}
                    className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2.5 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {branchMode === "specific" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Click to select branches that share this subject:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BRANCHES.map((b) => {
                      const isSelected = selectedSpecificBranches.includes(b);
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => toggleSpecificBranch(b)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {isSelected ? `✓ ${b}` : `+ ${b}`}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-2">
                    Active branches: <span className="text-emerald-700 font-semibold">{selectedSpecificBranches.length ? selectedSpecificBranches.join(", ") : "None selected (click branches to add)"}</span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Semester</label>
                  <select
                    data-testid="semester-select"
                    value={form.semester}
                    onChange={handleSemesterChange}
                    className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2.5 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Examination Year">
              <select
                data-testid="year-select"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2.5 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>

            <Field label="Paper Type">
              <select
                data-testid="exam-select"
                value={form.exam_type}
                onChange={(e) => update("exam_type", e.target.value)}
                className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2.5 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
              >
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Subject *">
            <select
              value={selectedPaperOption}
              onChange={handlePaperOptionChange}
              data-testid="paper-select"
              className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-3 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
              required
            >
              <option value="">
                -- Choose Subject ({formatBranchDisplay(form.branch)} Sem {form.semester}) --
              </option>
              {candidates.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="custom">✍️ Other (Type Custom Subject Name)</option>
            </select>
          </Field>

          {(isCustomPaper || !candidates.length) && (
            <Field label="Custom Subject Name *">
              <input
                data-testid="paper-input"
                value={form.paper}
                onChange={(e) => update("paper", e.target.value)}
                placeholder="e.g. Design & Analysis of Algorithms"
                className="w-full h-10 border border-emerald-300 bg-emerald-50/40 text-emerald-950 text-xs font-medium px-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
            </Field>
          )}

          {isAuthenticated && user ? (
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
              <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>Verified Contributor Credit</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Auto-Attributed
                </span>
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                      ({user.role})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    ID: <strong>{user.serialId}</strong> • Regd No: <strong>{user.regdNo}</strong> • {user.branch}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-700/90 mt-2.5 pt-2 border-t border-emerald-200/60 leading-tight">
                Your name will be prominently credited on this question paper for the BPUT student community.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    Sign In Required to Publish
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Please sign in or register with your BPUT registration number. Your name will be credited as contributor automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                  >
                    <span>Sign In to Continue</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Declaration checkbox */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs leading-relaxed text-slate-700 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="upload-declaration-checkbox"
              required
              defaultChecked
              className="mt-0.5 shrink-0 scale-105 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="upload-declaration-checkbox" className="cursor-pointer font-normal select-none">
              Declaration: I confirm that the uploaded file is a genuine exam paper, is entirely correct & legible, and does not contain confidential personal ID sheets or answer logs.
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            data-testid="submit-upload"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? "Uploading Paper..." : "Publish PYQ"} <UploadCloud className="w-4 h-4" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {/* ============================================================ */}
        {/* Confirmation Dialog with Review & Terms & Conditions */}
        {/* ============================================================ */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
            data-testid="confirmation-dialog-overlay"
            onClick={() => {
              if (!submitting) setShowConfirmModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 350 }}
              className="relative w-full max-w-[95vw] sm:max-w-lg bg-white border border-slate-200/90 p-5 sm:p-7 rounded-3xl shadow-2xl z-10 text-left my-auto font-sans max-h-[90vh] sm:max-h-[92vh] flex flex-col scale-[0.98] origin-center sm:scale-100"
              data-testid="confirmation-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 shrink-0">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-3 py-1 rounded-full border border-emerald-200/70 mb-2 select-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Confirmation &amp; Terms
                  </span>
                  <h2 className="text-xl sm:text-2xl font-cabinet font-extrabold text-slate-900 tracking-tight leading-tight">
                    Confirm Paper Publication
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Please review paper details and accept the BPUT upload terms before publishing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submitting}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  aria-label="Close dialog"
                  data-testid="close-confirm-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 pr-1 flex-1">
                {/* Summary Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-start gap-3 mb-3 pb-2.5 border-b border-slate-200/60">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        BPUT Question Paper
                      </span>
                      <h3 className="font-cabinet font-bold text-sm sm:text-base text-slate-900 break-words leading-snug">
                        {form.paper}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white border border-slate-200/70 rounded-xl p-2.5">
                      <span className="text-[10px] font-medium text-slate-400 block">University</span>
                      <span className="font-semibold text-slate-900">BPUT Odisha</span>
                    </div>
                    <div className="bg-white border border-slate-200/70 rounded-xl p-2.5">
                      <span className="text-[10px] font-medium text-slate-400 block">Branch</span>
                      <span className="font-semibold text-emerald-700">{formatBranchDisplay(form.branch)}</span>
                    </div>
                    <div className="bg-white border border-slate-200/70 rounded-xl p-2.5">
                      <span className="text-[10px] font-medium text-slate-400 block">Semester</span>
                      <span className="font-semibold text-slate-900">Sem {form.semester}</span>
                    </div>
                    <div className="bg-white border border-slate-200/70 rounded-xl p-2.5">
                      <span className="text-[10px] font-medium text-slate-400 block">Exam Year</span>
                      <span className="font-semibold text-slate-900">{form.year}</span>
                    </div>
                    <div className="bg-white border border-slate-200/70 rounded-xl p-2.5">
                      <span className="text-[10px] font-medium text-slate-400 block">Exam Type</span>
                      <span className="font-semibold text-amber-700">{form.exam_type}</span>
                    </div>
                    <div className="bg-white border border-slate-200/70 rounded-xl p-2.5">
                      <span className="text-[10px] font-medium text-slate-400 block">Contributor</span>
                      <span className="font-semibold text-slate-900 truncate block">
                        {form.uploader_name?.trim() || "Anonymous"}
                      </span>
                    </div>
                  </div>

                  {/* Attached File Preview */}
                  {file && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5 truncate">
                        <UploadCloud className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>

                {/* Automated GetPYQ PDF Footer Stamping Notice */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 font-bold text-[10px]">
                    PDF
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-blue-950 text-[11px]">
                      Automated GetPYQ Footer Stamping
                    </p>
                    <p className="text-[11px] text-blue-800 leading-snug">
                      Every page of this document will be branded with the clickable GetPYQ footer (<em>GetPYQ | BPUT Previous Year Questions • https://getpyq.vercel.app</em>) before being stored on Google Drive.
                    </p>
                  </div>
                </div>

                {/* Terms & Conditions Notice Box */}
                <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-4 text-xs">
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-200/50">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 stroke-[2]" />
                    <span className="font-cabinet font-bold uppercase tracking-wider text-emerald-950 text-[11px]">
                      Terms &amp; Community Guidelines
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 font-normal leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span><strong>BPUT Exclusivity:</strong> This paper belongs exclusively to the BPUT University syllabus or an affiliated college examination.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span><strong>Genuine &amp; Legible:</strong> The paper text, diagrams, and question numbers are authentic, clearly readable, and complete.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span><strong>Privacy &amp; Compliance:</strong> The document is free of personal student scores, roll numbers, or confidential evaluation markings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span><strong>Open Resource:</strong> You agree to provide this resource for free academic use under GetPYQ&apos;s <Link to="/terms" target="_blank" className="font-semibold text-emerald-700 underline hover:text-emerald-800 inline-flex items-center gap-0.5">Terms <ExternalLink className="w-2.5 h-2.5" /></Link> and <Link to="/disclaimer" target="_blank" className="font-semibold text-emerald-700 underline hover:text-emerald-800 inline-flex items-center gap-0.5">Disclaimer <ExternalLink className="w-2.5 h-2.5" /></Link>.</span>
                    </li>
                  </ul>
                </div>

                {/* Checkbox for Explicit Agreement */}
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-terms-agreement"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 rounded accent-emerald-600 cursor-pointer"
                    data-testid="modal-terms-checkbox"
                  />
                  <label htmlFor="confirm-terms-agreement" className="text-xs font-medium text-slate-800 cursor-pointer leading-snug select-none">
                    I confirm that I have reviewed the details above, accept the Terms &amp; Conditions, and verify that this is an authentic BPUT examination paper.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submitting}
                  data-testid="cancel-publish-btn"
                  className="w-full sm:w-auto px-5 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel / Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPublish}
                  disabled={!termsAccepted || submitting}
                  data-testid="confirm-publish-btn"
                  className="w-full sm:w-auto px-6 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-xs shadow-emerald-600/25 hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{stampingStatus || "Publishing Paper..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                      <span>Confirm &amp; Publish PYQ</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs select-none">
            {/* Confetti container relative to center */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              {confetti.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 150, scale: 0, rotate: 0 }}
                  animate={{
                    x: p.tx,
                    y: p.ty,
                    scale: [0, 1.3, 1, 0.7, 0],
                    rotate: p.rotation + 720,
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeOut",
                    delay: p.delay,
                  }}
                  className="absolute"
                  style={{
                    backgroundColor: p.color,
                    width: p.size,
                    height: p.size,
                    borderRadius: p.shape === "circle" ? "50%" : p.shape === "triangle" ? "0%" : "4px",
                    clipPath: p.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                  }}
                />
              ))}
            </div>

            {/* Success Dialog */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 350 }}
              className="relative w-full max-w-[95vw] sm:max-w-md bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 text-center font-sans"
            >
              {/* Bouncy Check icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
                className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full mx-auto flex items-center justify-center mb-5 shadow-xs"
              >
                <CheckCircle2 className="w-9 h-9 stroke-[2]" />
              </motion.div>

              <h2 className="font-cabinet font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
                Published PYQ!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Thank you for contributing. Your question paper is now recorded in the archives &amp; ready to help candidates.
              </p>

              {newPaperId && (
                <div className="mb-5 p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned PYQ ID:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-white px-2.5 py-1 border border-slate-200 rounded-lg shadow-2xs">
                    {newPaperId}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-2.5">
                {newPaperId && (
                  <Link
                    to={`/pyq?pyqId=${encodeURIComponent(newPaperId)}`}
                    data-testid="view-uploaded-pyq-btn"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-11 px-6 text-xs sm:text-sm font-semibold shadow-xs shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Uploaded PYQ</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  data-testid="upload-another-btn"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full h-11 px-6 text-xs sm:text-sm font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Another Paper</span>
                </button>
                <Link
                  to="/"
                  data-testid="go-to-home-btn"
                  className="w-full inline-flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-semibold py-2 transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Go to Home</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 block pl-0.5 mb-1 select-none">{label}</span>
      {children}
    </label>
  );
}
