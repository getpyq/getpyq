import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Upload as UploadIcon, Menu, X, GraduationCap, Home, BookOpen, FileQuestion, Info, Mail, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-gray-200 font-share" data-testid="navbar">
        <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] h-16 flex items-center justify-between gap-4">
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5 select-none group py-1">
            <div className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center bg-[#2563EB] text-white shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg] group-hover:rotate-[1deg] group-hover:bg-[#F97316] transition-all duration-300 shrink-0">
              <GraduationCap className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-momo text-2xl sm:text-[26px] font-bold text-black leading-none transition-colors duration-300 tracking-tight">
                Get<span className="text-[#2563EB] group-hover:text-[#F97316] transition-colors duration-300">PYQ</span>
              </span>
              <span data-testid="nav-slogan" className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-tight leading-none mt-1 whitespace-nowrap font-momo">
                BPUT University PYQs
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-1 text-sm font-bold transition-colors duration-200 group/navlink flex items-center gap-1.5 ${
                  isActive ? "text-[#2563EB]" : "text-black hover:text-[#2563EB]"
                }`
              }
              data-testid="nav-home"
              end
            >
              {({ isActive }) => (
                <span className="relative inline-flex items-center gap-1.5 py-1">
                  <Home className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>Home</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#2563EB] border-t border-black transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/navlink:scale-x-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `relative py-1 text-sm font-bold transition-colors duration-200 group/navlink flex items-center gap-1.5 ${
                  isActive ? "text-[#2563EB]" : "text-black hover:text-[#2563EB]"
                }`
              }
              data-testid="nav-browse"
            >
              {({ isActive }) => (
                <span className="relative inline-flex items-center gap-1.5 py-1">
                  <BookOpen className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>Browse Library</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#2563EB] border-t border-black transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/navlink:scale-x-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>

            <NavLink
              to="/requests"
              className={({ isActive }) =>
                `relative py-1 text-sm font-bold transition-colors duration-200 group/navlink flex items-center gap-1.5 ${
                  isActive ? "text-[#2563EB]" : "text-black hover:text-[#2563EB]"
                }`
              }
              data-testid="nav-requests"
            >
              {({ isActive }) => (
                <span className="relative inline-flex items-center gap-1.5 py-1">
                  <FileQuestion className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>Request a Paper</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#2563EB] border-t border-black transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/navlink:scale-x-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative py-1 text-sm font-bold transition-colors duration-200 group/navlink flex items-center gap-1.5 ${
                  isActive ? "text-[#2563EB]" : "text-black hover:text-[#2563EB]"
                }`
              }
              data-testid="nav-about"
            >
              {({ isActive }) => (
                <span className="relative inline-flex items-center gap-1.5 py-1">
                  <Info className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>About GetPYQ</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#2563EB] border-t border-black transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/navlink:scale-x-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative py-1 text-sm font-bold transition-colors duration-200 group/navlink flex items-center gap-1.5 ${
                  isActive ? "text-[#2563EB]" : "text-black hover:text-[#2563EB]"
                }`
              }
              data-testid="nav-contact"
            >
              {({ isActive }) => (
                <span className="relative inline-flex items-center gap-1.5 py-1">
                  <Mail className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>Contact</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#2563EB] border-t border-black transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/navlink:scale-x-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>

            <Link
              to="/upload"
              data-testid="nav-upload-btn"
              className="bg-[#2563EB] text-white border-2 border-black rounded-lg px-4 py-2 text-xs font-bold shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-150 active:translate-y-0 active:shadow-brutal-sm flex items-center gap-2 cursor-pointer ml-1"
            >
              <UploadIcon className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" /> Upload PYQ
            </Link>

            {/* Announcement / Notice Modal Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-notices-modal"))}
              title="Notices & Announcements"
              className="p-2 border-2 border-black rounded-lg bg-amber-100 hover:bg-amber-200 text-black shadow-brutal-sm hover:-translate-y-0.5 transition-all duration-150 active:translate-y-0 cursor-pointer ml-0.5 relative"
              aria-label="View announcements and exam updates"
              data-testid="nav-notices-btn"
            >
              <Bell className="w-4 h-4 stroke-[2.5] text-black" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F97316]"></span>
              </span>
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-notices-modal"))}
              title="Notices"
              className="p-2 brutal-border rounded-lg bg-amber-100 text-black cursor-pointer brutal-shadow-sm relative"
              aria-label="View announcements"
            >
              <Bell className="w-5 h-5 text-black stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
              </span>
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 brutal-border rounded-lg bg-white cursor-pointer brutal-shadow-sm hover:scale-105 active:scale-95 transition-all"
              data-testid="nav-menu-toggle"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5 text-black stroke-[2.5]" /> : <Menu className="w-5 h-5 text-black stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="md:hidden mt-2 mx-6 p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-2 relative z-55"
              data-testid="mobile-menu"
            >
              <div className="flex flex-col gap-1.5 font-share">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-black hover:bg-blue-50 hover:text-[#2563EB] hover:translate-x-1 rounded-lg transition-all"
                >
                  <Home className="w-4 h-4 text-[#2563EB] shrink-0 stroke-[2.5]" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/browse"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-black hover:bg-blue-50 hover:text-[#2563EB] hover:translate-x-1 rounded-lg transition-all"
                >
                  <BookOpen className="w-4 h-4 text-[#2563EB] shrink-0 stroke-[2.5]" />
                  <span>Browse Library</span>
                </Link>
                <Link
                  to="/requests"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-black hover:bg-blue-50 hover:text-[#2563EB] hover:translate-x-1 rounded-lg transition-all"
                >
                  <FileQuestion className="w-4 h-4 text-[#2563EB] shrink-0 stroke-[2.5]" />
                  <span>Request a Paper</span>
                </Link>
                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-black hover:bg-blue-50 hover:text-[#2563EB] hover:translate-x-1 rounded-lg transition-all"
                >
                  <Info className="w-4 h-4 text-[#2563EB] shrink-0 stroke-[2.5]" />
                  <span>About GetPYQ</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-black hover:bg-blue-50 hover:text-[#2563EB] hover:translate-x-1 rounded-lg transition-all"
                >
                  <Mail className="w-4 h-4 text-[#2563EB] shrink-0 stroke-[2.5]" />
                  <span>Contact Support</span>
                </Link>
                
                <div className="pt-2 border-t border-black/10 mt-2">
                  <Link
                    to="/upload"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#2563EB] text-white border-2 border-black rounded-lg py-3 text-xs font-bold brutal-shadow-sm hover:bg-blue-700 transition-all"
                  >
                    <UploadIcon className="w-4 h-4 stroke-[2.5]" /> Upload a PYQ
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
