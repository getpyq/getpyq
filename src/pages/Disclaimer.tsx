import React from "react";
import { AlertTriangle, ShieldCheck, GraduationCap, Sparkles } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Disclaimer() {
  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[10%] pt-8 pb-16 bg-[#FAFBFD] text-slate-900 flex-grow font-sans" data-testid="disclaimer-page">
      <SEOHead
        title="Disclaimer Statement | GetPYQ"
        description="Non-affiliation notice, academic fair use, and copyright transparency regarding BPUT question papers on GetPYQ."
        keywords="bput disclaimer, non affiliation notice, academic fair use"
        canonicalUrl="https://getpyq.vercel.app/disclaimer"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Disclaimer", item: "/disclaimer" }
        ]}
      />
      {/* Header block */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-amber-200/80 mb-3 shadow-xs select-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Non-Affiliation Notice
        </span>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight mb-2">
          Disclaimer Statement
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Transparency and academic integrity at GetPYQ for BPUT students.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Core Disclaimer requested by user */}
        <div className="bg-amber-50/60 border border-amber-200/90 p-6 sm:p-8 rounded-2xl relative shadow-xs">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
            <div className="p-3 bg-amber-100 text-amber-800 border border-amber-300/80 rounded-xl shrink-0">
              <AlertTriangle className="w-7 h-7 shrink-0" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Notice of Independence</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                GetPYQ is an independent, student-driven initiative dedicated exclusively to BPUT (Biju Patnaik University of Technology) engineering students and is not affiliated with, endorsed by, or officially
                connected to Biju Patnaik University of Technology (BPUT) or any of its constituent or affiliated colleges. All question papers are sourced from public student contributions.
              </p>
            </div>
          </div>
        </div>

        {/* Sourced Materials Accordion / Detail Card */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Crowdsourced Sourcing
              </h3>
              <span className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The documents available in this system are uploaded by student volunteer networks, peer research groups, and senior candidates aiming to enhance reference material accessibility. No official institutional database connections are utilized.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Academic Tool Only
              </h3>
              <span className="p-2 bg-blue-50 text-blue-600 border border-blue-200/60 rounded-xl shrink-0">
                <GraduationCap className="w-5 h-5" />
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              GetPYQ does not publish pre-exam question leaks, answers, or official testing telemetry. All papers are historic archived exams and served purely as study guide mock sheets. Use of the materials is subject to your institution&apos;s code of conduct.
            </p>
          </div>
        </div>

        <div className="text-center bg-white border border-slate-200/80 p-5 rounded-2xl text-xs sm:text-sm text-slate-500 font-medium shadow-xs">
          For any formal inquiries about our database structure or file uploads, please submit a message through the support forms.
        </div>
      </div>
    </div>
  );
}
