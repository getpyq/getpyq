import React from "react";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Privacy() {
  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="privacy-page">
      <SEOHead
        title="Privacy Policy | GetPYQ"
        description="Learn how GetPYQ protects student anonymity, browser storage security, and zero personal tracking data collection."
        keywords="getpyq privacy policy, student data security, zero tracking policy"
      />
      {/* Page header */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          ✦ Security & Privacy ✦
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
          Last Updated: May 24, 2026 • We respect user anonymity. Zero tracking.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Simple Summary */}
        <div className="bg-[#F0FDFA] border-2 border-black p-6 sm:p-8 rounded-2xl relative shadow-[4px_4px_0px_#000]">
          <h2 className="text-lg sm:text-xl font-momo font-bold text-black mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600 stroke-[2.5]" />
            No Accounts. Strict Privacy.
          </h2>
          <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
            GetPYQ values student safety. You are not requested to sign up, input profiles, share mobile numbers, or link academic registry records. You remain completely anonymous throughout browsing, downloading, and uploading.
          </p>
        </div>

        {/* Local state cache */}
        <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-2xl relative shadow-[4px_4px_0px_#000]">
          <h2 className="text-xs sm:text-sm font-momo font-bold text-black mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" />
            1. Local Browser Storage & Cache
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
            All configuration tags, recent views, and standard preferences are stored exclusively on your individual web browser's <code className="bg-amber-100 px-1 border border-black rounded font-mono text-black">localStorage</code> cache. No profile metrics are synced or aggregated to our backend databases. Deleting browser memory will reset your viewing preferences.
          </p>
        </div>

        {/* Upload records */}
        <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-2xl relative shadow-[4px_4px_0px_#000]">
          <h2 className="text-xs sm:text-sm font-momo font-bold text-black mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600 stroke-[2.5] shrink-0" />
            2. Public Submissions & Metadata Handling
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
            When you actively contribution upload a curriculum PDF, the platform stores the document on state storage to host search catalogs. No metadata about your home IP address, ISP provider, or geolocation logs is parsed, verified or kept. To prevent malware, documents pass an automated security validation.
          </p>
        </div>

        {/* External services */}
        <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-2xl relative shadow-[4px_4px_0px_#000]">
          <h2 className="text-xs sm:text-sm font-momo font-bold text-black mb-2 flex items-center gap-2">
            3. Third-Party Integrations & Cookies
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
            We use zero targeted marketing cookies. Some assets or analytics counts might utilize lightweight non-invasive providers to calculate general country-level dashboard counters (e.g., total downloads counts). You can browse with clean confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
