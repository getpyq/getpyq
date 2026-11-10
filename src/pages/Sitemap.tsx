import React from "react";
import { Link } from "react-router-dom";
import { 
  Compass, 
  GraduationCap, 
  ShieldAlert, 
  ArrowRight
} from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function Sitemap() {
  const sitemapMainLinks = [
    { name: "Home Dashboard", path: "/", desc: "Explore statistical highlights, trending question papers, and quick branches search." },
    { name: "Browse PYQ Library", path: "/browse", desc: "Filter and sort papers by branch, semester, year, and examination type." },
    { name: "Upload Paper", path: "/upload", desc: "Contribute question papers or master solution PDFs to help fellow peers." },
    { name: "Request a Paper", path: "/requests", desc: "Cannot find a paper? Submit a quick request for peers to share." },
    { name: "About GetPYQ", path: "/about", desc: "Discover our student-driven open-education program and meeting the team." },
    { name: "Contact Support", path: "/contact", desc: "Got questions, copyright reports, or suggestions? Drop us a note anytime." }
  ];

  const sitemapBranches = [
    { code: "CSE", name: "Computer Science & Engineering", path: "/branch/cse" },
    { code: "CSE (AI & ML)", name: "Artificial Intelligence & ML", path: "/branch/cse-aiml" },
    { code: "ECE / ETC", name: "Electronics & Telecommunication", path: "/branch/ece" },
    { code: "EE", name: "Electrical Engineering", path: "/branch/ee" },
    { code: "EEE", name: "Electrical & Electronics Engineering", path: "/branch/eee" },
    { code: "ME", name: "Mechanical Engineering", path: "/branch/me" },
    { code: "Civil", name: "Civil Engineering", path: "/branch/civil" },
    { code: "Chemical", name: "Chemical Engineering", path: "/branch/chemical" },
    { code: "Automobile", name: "Automobile Engineering", path: "/branch/automobile" },
    { code: "Metallurgy", name: "Material & Metallurgy Engineering", path: "/branch/metallurgy" },
    { code: "Biotech", name: "Biotechnology Engineering", path: "/branch/biotech" }
  ];

  const sitemapPolicyLinks = [
    { name: "Disclaimer Statement", path: "/disclaimer", desc: "Read our non-affiliation and source verification policies." },
    { name: "Terms & Conditions", path: "/terms", desc: "Understand guidelines for acceptable use and crowd-uploaded media files." },
    { name: "Privacy Policy", path: "/privacy", desc: "How we securely handle local state storage, session stats, and analytics." }
  ];

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[10%] pt-8 pb-16 bg-[#FAFBFD] text-slate-900 flex-grow font-sans box-border overflow-hidden" data-testid="sitemap-page">
      <SEOHead
        title="Website Sitemap & Academic Directory Indices | GetPYQ"
        description="Comprehensive index of all BPUT engineering branches, semester subjects, past papers, policies, and community portals on GetPYQ."
        keywords="bput sitemap, bput question papers directory, bput branches index, bput engineering archive list"
        canonicalUrl="https://getpyq.vercel.app/sitemap"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Sitemap", item: "/sitemap" }
        ]}
      />
      {/* Title block */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-200/80 mb-3 shadow-xs select-none">
          Directory Indices
        </span>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight mb-2">
          Website Sitemap
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
          Discover the complete structural navigation hierarchy, academic branch directories, and compliance portals indexing GetPYQ.
        </p>
      </div>

      {/* SITEMAP INDEX DETAILS */}
      <div className="grid md:grid-cols-12 gap-6 w-full box-border">
        {/* Core Navigation List */}
        <div className="md:col-span-8 space-y-6 min-w-0 w-full">
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs w-full box-border">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2.5 text-slate-900">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                <Compass className="w-4.5 h-4.5" />
              </span>
              Core Portals
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {sitemapMainLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex flex-col p-4 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 rounded-xl transition-all min-w-0"
                >
                  <span className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700 flex items-center justify-between gap-1">
                    <span className="truncate">{link.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </span>
                  <span className="text-xs text-slate-500 font-normal mt-1 leading-normal break-words">
                    {link.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Documents */}
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs w-full box-border">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2.5 text-slate-900">
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                <ShieldAlert className="w-4.5 h-4.5" />
              </span>
              Sitemap Guidelines &amp; Compliance
            </h2>

            <div className="space-y-2.5 w-full">
              {sitemapPolicyLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex items-center justify-between p-4 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 rounded-xl transition-all min-w-0 gap-3 w-full"
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <span className="font-semibold text-sm text-slate-900 block group-hover:text-emerald-700 truncate">
                      {link.name}
                    </span>
                    <span className="text-xs text-slate-500 font-normal block mt-0.5 break-words">
                      {link.desc}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Categories Grid */}
        <div className="md:col-span-4 min-w-0 w-full">
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs h-full w-full box-border">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-900">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                <GraduationCap className="w-4.5 h-4.5" />
              </span>
              Study Branches
            </h2>

            <p className="text-slate-500 text-xs font-normal leading-relaxed mb-4 border-b border-slate-100 pb-3">
              Direct indices to past year questions sorted explicitly for your BPUT engineering branch.
            </p>

            <div className="space-y-1.5 w-full">
              {sitemapBranches.map((b, idx) => (
                <Link
                  key={idx}
                  to={b.path}
                  className="flex items-center justify-between px-3 py-2 border border-slate-100 hover:border-emerald-300 rounded-lg hover:bg-emerald-50/40 group transition-all text-xs min-w-0 gap-2 w-full"
                >
                  <span className="font-mono font-bold text-emerald-600 shrink-0 text-xs">
                    {b.code}
                  </span>
                  <span className="font-medium text-slate-800 truncate flex-1 text-left text-xs min-w-0">
                    {b.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-700 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick FAQ / Community suggestion callout */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xs text-center mt-10 w-full box-border">
        <h3 className="font-bold text-lg mb-1.5 text-slate-900">Have a Feature or Paper Suggestion?</h3>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl mx-auto">
          GetPYQ is built exclusively for BPUT students. If you want us to add a specific subject syllabus, support new branches, or suggest improvements, let us know!
        </p>
        <Link to="/contact" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs">
          Send Your Suggestions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
