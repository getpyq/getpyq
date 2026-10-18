import { Link } from "react-router-dom";
import { Github, Mail, GraduationCap } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#0A0A0A] text-white mt-0 font-share" data-testid="footer">
      <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" data-testid="footer-logo" className="inline-flex items-center gap-2.5 mb-4 select-none group">
            <div className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center bg-[#2563EB] text-white shadow-[2.5px_2.5px_0px_#FAF9F6] rotate-[-1deg] group-hover:rotate-[1deg] group-hover:bg-[#F97316] transition-all duration-300 shrink-0">
              <GraduationCap className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-momo text-2xl sm:text-[26px] font-bold text-white leading-none transition-colors duration-300 tracking-tight">
                Get<span className="text-[#2563EB] group-hover:text-[#F97316] transition-colors duration-300">PYQ</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-tight leading-none mt-1 whitespace-nowrap font-momo">
                BPUT University PYQs
              </span>
            </div>
          </Link>
          <p className="text-gray-300 leading-relaxed text-xs">
            The open community library of BPUT (Biju Patnaik University of Technology) Previous Year Questions. Share knowledge. Crush exams. No registration required.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-[#F97316] mb-4">Explore</p>
          <ul className="space-y-2 text-xs text-gray-300 font-medium">
            <li><Link to="/browse" className="hover:text-[#F97316] transition-colors">Browse PYQ Library</Link></li>
            <li><Link to="/requests" className="hover:text-[#F97316] transition-colors">Request a Paper</Link></li>
            <li><Link to="/upload" className="hover:text-[#F97316] transition-colors">Upload a Paper</Link></li>
            <li><Link to="/about" className="hover:text-[#F97316] transition-colors">About GetPYQ</Link></li>
            <li><Link to="/contact" className="hover:text-[#F97316] transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold text-[#F97316] mb-4">Guidelines & Legal</p>
          <ul className="space-y-2 text-xs text-gray-300 font-medium">
            <li><Link to="/sitemap" className="hover:text-[#F97316] transition-colors">Sitemap</Link></li>
            <li><Link to="/terms" className="hover:text-[#F97316] transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/disclaimer" className="hover:text-[#F97316] transition-colors">Disclaimer Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-[#F97316] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold text-[#F97316] mb-4">Connect</p>
          <div className="flex flex-wrap gap-2.5 mb-4">
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" title="WhatsApp Channel" className="w-9 h-9 border-2 border-white rounded-lg flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] text-white hover:text-white transition-all duration-200" data-testid="footer-whatsapp-link"><FaWhatsapp className="w-4.5 h-4.5" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub" className="w-9 h-9 border-2 border-white rounded-lg flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] text-white hover:text-black transition-all duration-200"><Github className="w-4 h-4" /></a>
            <a href="mailto:getpyq@gmail.com" title="Email Us" className="w-9 h-9 border-2 border-white rounded-lg flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] text-white hover:text-black transition-all duration-200"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Official non-affiliation disclaimer - 100% full width */}
      <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pb-8">
        <div className="w-full border border-white/10 p-4 rounded-xl bg-white/[0.02] text-gray-400 text-xs leading-relaxed font-normal">
          <span className="font-bold text-[#F97316] inline-block mr-1">Disclaimer :-</span>
          GetPYQ is an independent, student-driven repository dedicated to BPUT (Biju Patnaik University of Technology) students and is not affiliated with, endorsed by, or officially connected to BPUT or its constituent colleges. All question papers are sourced from public student contributions.
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-400 font-medium">
        © {new Date().getFullYear()} GetPYQ • Dedicated to BPUT Engineering Students
      </div>
    </footer>
  );
}
