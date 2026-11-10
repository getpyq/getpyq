import React from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, ShieldAlert, Scale, Sparkles } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Terms() {
  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[10%] pt-8 pb-16 bg-[#FAFBFD] text-slate-900 flex-grow font-sans" data-testid="terms-page">
      <SEOHead
        title="Terms & Conditions | GetPYQ"
        description="Terms of service, guidelines for acceptable use, content licensing, and crowd-uploaded media policies on GetPYQ."
        keywords="getpyq terms of service, acceptable use policy, academic content guidelines"
        canonicalUrl="https://getpyq.vercel.app/terms"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Terms & Conditions", item: "/terms" }
        ]}
      />
      {/* Header section fully centered */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-200/80 mb-3 shadow-xs select-none">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Legal Agreement
        </span>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Please read these terms carefully before accessing, downloading, or contributing paper resources to the GetPYQ archive.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Intro Acceptance block */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 text-slate-900">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <Scale className="w-4.5 h-4.5" />
            </span>
            1. Acceptance of Terms
          </h2>
          <div className="text-slate-600 text-sm leading-relaxed pl-10.5">
            <p>
              By visiting, accessing, or utilizing <strong className="text-slate-900 font-semibold">GetPYQ</strong>, downloading files, or uploading any educational materials, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these rules, please do not use or interact with the service.
            </p>
          </div>
        </div>

        {/* Content Upload block */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 text-slate-900">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </span>
            2. Content Upload Policy
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed pl-10.5">
            <p>
              We operate as an open academic resource repository relying on public user contributions. When uploading a Previous Year Question (PYQ) document:
            </p>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <p className="text-xs text-slate-700">You confirm that the uploaded paper pertains to BPUT (Biju Patnaik University of Technology) syllabus, semesters, or affiliated college assessments.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <p className="text-xs text-slate-700">You confirm that you possess the right to share the file for peer studying and educational revision purposes.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <p className="text-xs text-slate-700">Files must not contain any confidential student sheets, grades, answer papers, personal identifiers, or links to external ads.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <p className="text-xs text-slate-700">No malicious scripts, compromised metadata, or payload executable software such as viruses may be submitted.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intellectual Property block */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 text-slate-900">
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/60">
              <ShieldAlert className="w-4.5 h-4.5" />
            </span>
            3. IP &amp; DMCA Compliance
          </h2>
          <div className="text-slate-600 text-sm leading-relaxed pl-10.5">
            <p>
              GetPYQ respects college policies and original creators. If you are an academic director, professor, or content owner whose copyrighted questions or solved guides were shared without approval, please navigate straight to our <Link to="/contact" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2">Contact Support</Link> desk to issue a removal query. We confirm and process removals with total priority within 48-72 hours.
            </p>
          </div>
        </div>

        {/* Disclaimer Block */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 text-slate-900">
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <FileText className="w-4.5 h-4.5" />
            </span>
            4. Limitation of Liability
          </h2>
          <div className="text-slate-600 text-sm leading-relaxed pl-10.5">
            <p>
              All documents, solution files, and material references are served strictly &ldquo;as-is&rdquo; for peer studies. GetPYQ does not state any formal correctness guarantees. We hold zero liability for final exam grades, exam score outcomes, website connection speed, dataset changes, or software downtime.
            </p>
          </div>
        </div>

        {/* Contact info card footer */}
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-6 text-center mt-8">
          <p className="text-sm text-slate-600 font-medium mb-4">
            Have questions regarding our legal rules? Direct them our way through our support desk.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-xs"
          >
            Go to Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
