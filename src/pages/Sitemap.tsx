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
    { code: "CSE", name: "Computer Science", path: "/browse?branch=CSE" },
    { code: "CSE (AI & ML)", name: "CSE (AI & ML)", path: "/browse?branch=CSE (AI & ML)" },
    { code: "CSE (Data Science)", name: "CSE (Data Science)", path: "/browse?branch=CSE (Data Science)" },
    { code: "ECE / ETC", name: "Electronics & Telecommunication (ECE / ETC)", path: "/browse?branch=ECE / ETC" },
    { code: "IT", name: "Information Tech", path: "/browse?branch=IT" },
    { code: "EE", name: "Electrical Eng", path: "/browse?branch=EE" },
    { code: "EEE", name: "Electrical & Electronics (EEE)", path: "/browse?branch=EEE" },
    { code: "ME", name: "Mechanical Eng", path: "/browse?branch=ME" },
    { code: "Civil", name: "Civil Engineering", path: "/browse?branch=Civil" },
    { code: "Production", name: "Production Engineering", path: "/browse?branch=Production" },
    { code: "Chemical", name: "Chemical Engineering", path: "/browse?branch=Chemical" },
    { code: "Automobile", name: "Automobile Engineering", path: "/browse?branch=Automobile" },
    { code: "Metallurgy", name: "Material & Metallurgy", path: "/browse?branch=Material & Metallurgy" },
    { code: "Biotech", name: "Biotechnology", path: "/browse?branch=Biotech" }
  ];

  const sitemapPolicyLinks = [
    { name: "Disclaimer Statement", path: "/disclaimer", desc: "Read our non-affiliation and source verification policies." },
    { name: "Terms & Conditions", path: "/terms", desc: "Understand guidelines for acceptable use and crowd-uploaded media files." },
    { name: "Privacy Policy", path: "/privacy", desc: "How we securely handle local state storage, session stats, and analytics." }
  ];

  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-8 pb-8 flex-grow font-share" data-testid="sitemap-page">
      <SEOHead
        title="Website Sitemap & Academic Directory Indices | GetPYQ"
        description="Comprehensive index of all BPUT engineering branches, semester subjects, past papers, policies, and community portals on GetPYQ."
        keywords="bput sitemap, bput question papers directory, bput branches index, bput engineering archive list"
      />
      {/* Title block */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          ✦ Directory Indices ✦
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          Website Sitemap
        </h1>
        <p className="text-gray-650 mt-3 text-xs sm:text-sm font-share font-medium leading-relaxed">
          Discover the complete structural navigation hierarchy, academic branch directories, and compliance portals indexing GetPYQ.
        </p>
      </div>

      {/* SITEMAP INDEX DETAILS */}
      <div className="grid md:grid-cols-12 gap-8 animate-fade-in">
        {/* Core Navigation List */}
        <div className="md:col-span-8 space-y-6 animate-fade-in">
          <div className="bg-white border-2 border-black p-6 rounded-2xl relative shadow-[4px_4px_0px_#000]">
            <h2 className="text-xl sm:text-2xl font-momo font-bold mb-6 flex items-center gap-2 text-black">
              <Compass className="w-6 h-6 text-blue-600 stroke-[2.5]" />
              Core Portals
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {sitemapMainLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex flex-col p-4 border-2 border-gray-200 hover:border-black hover:bg-stone-50 rounded-xl transition-all"
                >
                  <span className="font-share font-bold text-xs text-black group-hover:text-blue-600 flex items-center gap-1">
                    {link.name} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all stroke-[2.5]" />
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium mt-1.5 leading-normal">
                    {link.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Documents */}
          <div className="bg-white border-2 border-black p-6 rounded-2xl relative shadow-[4px_4px_0px_#000]">
            <h2 className="text-xl sm:text-2xl font-momo font-bold mb-6 flex items-center gap-2 text-black">
              <ShieldAlert className="w-6 h-6 text-orange-500 stroke-[2.5]" />
              Sitemap Guidelines & Compliance
            </h2>

            <div className="space-y-3">
              {sitemapPolicyLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex items-center justify-between p-3.5 border-2 border-gray-100 hover:border-black hover:bg-stone-50 rounded-xl transition-all"
                >
                  <div>
                    <span className="font-share font-bold text-xs text-black block group-hover:text-amber-600">
                      {link.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium block mt-1">
                      {link.desc}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors stroke-[2.5]" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Categories Grid */}
        <div className="md:col-span-4 animate-fade-in">
          <div className="bg-white border-2 border-black p-6 rounded-2xl relative shadow-[4px_4px_0px_#000] h-full">
            <h2 className="text-lg sm:text-xl font-momo font-bold mb-4 flex items-center gap-2 text-black">
              <GraduationCap className="w-5.5 h-5.5 text-emerald-600 stroke-[2.5]" />
              Study Branches
            </h2>

            <p className="text-gray-500 text-[10px] font-medium leading-relaxed mb-4 border-b border-gray-150 pb-2">
              Direct indices to past year questions sorted explicitly for your BPUT engineering branch.
            </p>

            <div className="space-y-2">
              {sitemapBranches.map((b, idx) => (
                <Link
                  key={idx}
                  to={b.path}
                  className="flex items-center justify-between px-3 py-2 border-2 border-gray-100 hover:border-black rounded-lg hover:bg-emerald-50/50 group transition-all text-xs"
                >
                  <span className="font-mono font-bold text-gray-400 group-hover:text-emerald-700 min-w-[#45px]">
                    {b.code}
                  </span>
                  <span className="font-share font-bold text-black truncate flex-1 pl-2 text-left">
                    {b.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-emerald-700 stroke-[2.5]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick FAQ / Community suggestion callout */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-[4px_4px_0px_#000] text-center mt-10">
        <h3 className="font-momo font-bold text-lg mb-2 text-black">Have a Feature or Paper Suggestion?</h3>
        <p className="text-gray-700 text-xs font-medium leading-relaxed mb-5 max-w-xl mx-auto">
          GetPYQ is built exclusively for BPUT students. If you want us to add a specific subject syllabus, support new branches, or suggest improvements, let us know!
        </p>
        <Link to="/contact" className="inline-flex items-center gap-2 bg-[#F97316] text-white border-2 border-black rounded-lg px-6 py-3 text-xs font-share font-bold shadow-[3px_3px_0px_#000] hover:bg-[#2563EB] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer">
          Send Your Suggestions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
