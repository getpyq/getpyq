import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Upload as UploadIcon, Menu, X, Home, BookOpen, FileQuestion, Info, Mail, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200/60 font-sans"
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo - 5% left margin */}
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center select-none group shrink-0 ml-[5%]"
          >
            <img
              src="/assets/aistudio/GetPYQ_Logo_24f73d29.png"
              alt="GetPYQ - BPUT University Archive"
              className="h-8 sm:h-9 w-auto object-contain hover:scale-102 transition-transform"
            />
          </Link>

          {/* Desktop Nav Links - Generous spacing on laptop screens & consistent text-sm */}
          <nav className="hidden md:flex items-center gap-2.5 md:gap-3.5 lg:gap-6 xl:gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 leading-none ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
              data-testid="nav-home"
              end
            >
              <Home className="w-4 h-4 stroke-[2]" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 leading-none ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
              data-testid="nav-browse"
            >
              <BookOpen className="w-4 h-4 stroke-[2]" />
              <span>Browse Library</span>
            </NavLink>

            <NavLink
              to="/requests"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 leading-none ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
              data-testid="nav-requests"
            >
              <FileQuestion className="w-4 h-4 stroke-[2]" />
              <span>Request Paper</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 leading-none ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
              data-testid="nav-about"
            >
              <Info className="w-4 h-4 stroke-[2]" />
              <span>About</span>
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 leading-none ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
              data-testid="nav-contact"
            >
              <Mail className="w-4 h-4 stroke-[2]" />
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Announcement / Notice Modal Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-notices-modal"))}
              title="Notices & Announcements"
              className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs flex items-center justify-center transition-all cursor-pointer relative"
              aria-label="View announcements and exam updates"
              data-testid="nav-notices-btn"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
            </button>

            <Link
              to="/upload"
              data-testid="nav-upload-btn"
              className="h-9 px-4.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold shadow-xs shadow-emerald-600/20 hover:shadow-sm transition-all duration-150 active:scale-95 flex items-center gap-1.5 cursor-pointer leading-none"
            >
              <UploadIcon className="w-4 h-4 stroke-[2.2]" />
              <span>Upload PYQ</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-notices-modal"))}
              title="Notices"
              className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center shadow-xs relative"
              aria-label="View announcements"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
              data-testid="nav-menu-toggle"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5 stroke-[2]" /> : <Menu className="w-5 h-5 stroke-[2]" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden mx-4 mb-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-lg flex flex-col gap-1 relative z-50"
              data-testid="mobile-menu"
            >
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Home</span>
              </Link>
              <Link
                to="/browse"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Browse Library</span>
              </Link>
              <Link
                to="/requests"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <FileQuestion className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Request a Paper</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>About GetPYQ</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contact Support</span>
              </Link>

              <div className="pt-2 border-t border-slate-100 mt-1">
                <Link
                  to="/upload"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-sm font-semibold shadow-xs transition-all"
                >
                  <UploadIcon className="w-4 h-4 stroke-[2.2]" />
                  <span>Upload a PYQ</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
