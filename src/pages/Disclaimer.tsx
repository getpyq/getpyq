import React from "react";
import { AlertTriangle, ShieldCheck, GraduationCap } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Disclaimer() {
  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="disclaimer-page">
      <SEOHead
        title="Disclaimer Statement | GetPYQ"
        description="Non-affiliation notice, academic fair use, and copyright transparency regarding BPUT question papers on GetPYQ."
        keywords="bput disclaimer, non affiliation notice, academic fair use"
      />
      {/* Header block */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          ✦ Non-Affiliation Notice ✦
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          Disclaimer Statement
        </h1>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
          Transparency and academic integrity at GetPYQ for BPUT students.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Core Disclaimer requested by user */}
        <div className="bg-[#FFF7ED] border-2 border-black p-6 sm:p-8 rounded-2xl relative shadow-[4px_4px_0px_#000]">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
            <div className="p-3 bg-[#F97316] text-white border-2 border-black rounded-lg shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <AlertTriangle className="w-8 h-8 shrink-0 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-momo font-bold text-black mb-2">Notice of Independence</h2>
              <p className="text-xs sm:text-sm text-gray-850 font-medium leading-relaxed">
                GetPYQ is an independent, student-driven initiative dedicated exclusively to BPUT (Biju Patnaik University of Technology) engineering students and is not affiliated with, endorsed by, or officially
                connected to Biju Patnaik University of Technology (BPUT) or any of its constituent or affiliated colleges. All question papers are sourced from public student contributions.
              </p>
            </div>
          </div>
        </div>

        {/* Sourced Materials Accordion / Detail Card */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-black p-5 sm:p-7 rounded-2xl relative shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <h3 className="font-momo font-bold text-base sm:text-lg text-black">Crowdsourced Sourcing</h3>
              <span className="p-2 bg-emerald-100 text-black border-2 border-black rounded-md shrink-0 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </span>
            </div>
            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              The documents available in this system are uploaded by student volunteer networks, peer research groups, and senior candidates aiming to enhance reference material accessibility. No official institutional database connections are utilized.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 sm:p-7 rounded-2xl relative shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <h3 className="font-momo font-bold text-base sm:text-lg text-black">Academic Tool Only</h3>
              <span className="p-2 bg-blue-100 text-black border-2 border-black rounded-md shrink-0 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </span>
            </div>
            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              GetPYQ does not publish pre-exam question leaks, answers, or official testing telemetry. All papers are historic archived exams and served purely as study guide mock sheets. Use of the materials is subject to your institution's code of conduct.
            </p>
          </div>
        </div>

        <div className="text-center bg-[#FAF9F6] border-2 border-black p-4 rounded-xl text-xs text-gray-700 font-share font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none">
          For any formal inquiries about our database structure or file uploads, please submit a message through the support forms.
        </div>
      </div>
    </div>
  );
}
