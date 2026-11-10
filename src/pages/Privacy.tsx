import React from "react";
import { ShieldAlert, CheckCircle2, Lock, Sparkles } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Privacy() {
  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[10%] pt-8 pb-16 bg-[#FAFBFD] text-slate-900 flex-grow font-sans" data-testid="privacy-page">
      <SEOHead
        title="Privacy Policy | GetPYQ"
        description="Learn how GetPYQ protects student anonymity, browser storage security, and zero personal tracking data collection."
        keywords="getpyq privacy policy, student data security, zero tracking policy"
        canonicalUrl="https://getpyq.vercel.app/privacy"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Privacy Policy", item: "/privacy" }
        ]}
      />
      {/* Page header */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-200/80 mb-3 shadow-xs select-none">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Security &amp; Privacy
        </span>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Last Updated: 2026 • We respect user anonymity. Zero personal tracking.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Simple Summary */}
        <div className="bg-emerald-50/60 border border-emerald-200/90 p-6 sm:p-8 rounded-2xl relative shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              No Accounts. Strict Privacy.
            </h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed pl-12">
            GetPYQ values student safety. You are never requested to sign up, input personal profiles, share mobile numbers, or link academic registry records. You remain completely anonymous throughout browsing, downloading, and uploading.
          </p>
        </div>

        {/* Local state cache */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            1. Local Browser Storage &amp; Cache
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-7.5">
            All filter tags, recent views, and standard preferences are stored exclusively on your individual web browser&apos;s <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 border border-slate-200 rounded font-mono text-xs">localStorage</code> cache. No profile metrics are synced or aggregated to our backend databases. Deleting browser memory will reset your viewing preferences.
          </p>
        </div>

        {/* Upload records */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0" />
            2. Public Submissions &amp; Metadata Handling
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-7.5">
            When you actively contribution upload a curriculum PDF, the platform stores the document on cloud storage to host search catalogs. No metadata about your home IP address, ISP provider, or geolocation logs is parsed, verified or kept. To prevent malware, documents pass an automated security validation.
          </p>
        </div>

        {/* External services */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:border-emerald-300 transition-all">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            3. Third-Party Integrations &amp; Cookies
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-7.5">
            We use zero targeted marketing cookies. Some assets or analytics counts might utilize lightweight non-invasive providers to calculate general country-level dashboard counters (e.g., total downloads counts). You can browse with clean confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
