import React from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, ShieldAlert, Scale } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Terms() {
  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="terms-page">
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
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          ✦ Legal Agreement ✦
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
          Please read these terms carefully before accessing, downloading, or contributing paper resources to the GetPYQ database.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Intro Acceptance block */}
        <div className="relative group">
          <div className="absolute inset-0 bg-[#2563EB] border-2 border-black rounded-2xl rotate-0.5 shadow-[4px_4px_0px_#000]" />
          <div className="relative bg-white border-2 border-black rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2 text-black">
              <Scale className="w-5 h-5 text-[#2563EB] stroke-[2.5]" /> 1. Acceptance of Terms
            </h2>
            <div className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed">
              <p>
                By visiting, accessing, or utilizing <strong>GetPYQ</strong>, downloading files, or uploading any educational materials, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these rules, please do not use or interact with the service.
              </p>
            </div>
          </div>
        </div>

        {/* Content Upload block */}
        <div className="relative group">
          <div className="absolute inset-0 bg-[#F97316] border-2 border-black rounded-2xl -rotate-0.5 shadow-[4px_4px_0px_#000]" />
          <div className="relative bg-white border-2 border-black rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2 text-black">
              <CheckCircle2 className="w-5 h-5 text-[#F97316] stroke-[2.5]" /> 2. Content Upload Policy
            </h2>
            <div className="space-y-4 text-gray-700 text-xs sm:text-sm font-medium leading-relaxed animate-fade-in">
              <p>
                We operate as an open academic resource repository relying on public user contributions. When uploading a Previous Year Question (PYQ) document:
              </p>
              <div className="bg-stone-50 border-2 border-black rounded-xl p-4 space-y-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold shrink-0">✦</span>
                  <p className="text-[11px] text-gray-700 font-medium">You confirm that the uploaded paper pertains to BPUT (Biju Patnaik University of Technology) syllabus, semesters, or affiliated college assessments.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold shrink-0">✦</span>
                  <p className="text-[11px] text-gray-700 font-medium">You confirm that you possess the right to share the file for peer studying and educational revision purposes.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold shrink-0">✦</span>
                  <p className="text-[11px] text-gray-700 font-medium">Files must not contain any confidential student sheets, grades, answer papers, personal identifiers, or links to external ads.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#F97316] font-bold shrink-0">✦</span>
                  <p className="text-[11px] text-gray-700 font-medium">No malicious scripts, compromised metadata, or payload executable software such as viruses may be submitted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intellectual Property block */}
        <div className="relative group">
          <div className="absolute inset-0 bg-black border-2 border-black rounded-xl rotate-0.5 shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)]" />
          <div className="relative bg-white border-2 border-black rounded-xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2 text-black">
              <ShieldAlert className="w-5 h-5 text-red-600 stroke-[2.5]" /> 3. IP & DMCA Compliance
            </h2>
            <div className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed">
              <p>
                GetPYQ respects college policies and original creators. If you are an academic director, professor, or content owner whose copyrighted questions or solved guides were shared without approval, please navigate straight to our <strong className="text-[#2563EB] hover:underline"><Link to="/contact">Contact Support</Link></strong> sheet to issue an removal query. We confirm and process removals with total priority within 48-72 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Block */}
        <div className="relative group">
          <div className="absolute inset-0 bg-stone-200 border-2 border-black rounded-xl -rotate-0.5 shadow-[3.5px_3.5px_0px_#000]" />
          <div className="relative bg-white border-2 border-black rounded-xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2 text-black">
              <FileText className="w-5 h-5 text-stone-700 stroke-[2.5]" /> 4. Limitation of Liability
            </h2>
            <div className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed">
              <p>
                All documents, solution files, and material references are served strictly "as-is" for peer studies. GetPYQ does not state any formal correctness guarantees. We hold zero liability for final exam grades, exam score outcomes, website connection speed, dataset changes, or software downtime.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info card footer */}
        <div className="border-t-4 border-dashed border-stone-300 pt-8 text-center">
          <p className="text-xs text-stone-500 font-share font-medium leading-relaxed mb-4">
            Have questions regarding our legal rules? Direct them our way through our support form!
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white border-2 border-black rounded-xl px-6 py-3 text-xs font-share font-bold hover:bg-[#2563EB] transition-all shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Go to Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
