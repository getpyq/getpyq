import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Upload as UploadIcon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  FolderClock,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";
import { MyUploadsModal } from "./MyUploadsModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
    openAuthModal,
    openMyUploads,
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Show bottom border and shrink vertical padding on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#FAFAFA]/85 backdrop-blur-sm font-sans ${
          isScrolled
            ? "py-3 border-b border-slate-200/80 shadow-xs"
            : "py-4 border-b border-transparent"
        }`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link
              to="/"
              data-testid="nav-logo"
              className="inline-flex items-center select-none group transition-opacity duration-150 hover:opacity-95 cursor-pointer shrink-0"
              aria-label="GetPYQ Home"
            >
              <img
                src="/assets/aistudio/file_00000000a88c8246a0dc76ae28b7dc6b_70fa3769.png"
                alt="GetPYQ - BPUT University Archive"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav
              className="hidden md:flex items-center space-x-1 lg:space-x-4 xl:space-x-5"
              aria-label="Primary Navigation"
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm transition-colors px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-600 font-medium hover:text-emerald-600"
                  }`
                }
                data-testid="nav-home"
                end
              >
                Home
              </NavLink>

              <NavLink
                to="/browse"
                className={({ isActive }) =>
                  `text-sm transition-colors px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-600 font-medium hover:text-emerald-600"
                  }`
                }
                data-testid="nav-browse"
              >
                Browse Library
              </NavLink>

              <NavLink
                to="/requests"
                className={({ isActive }) =>
                  `text-sm transition-colors px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-600 font-medium hover:text-emerald-600"
                  }`
                }
                data-testid="nav-requests"
              >
                Request Paper
              </NavLink>

              <a
                href="https://bputresults.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
                data-testid="nav-bput-results"
              >
                <span>BPUT Results</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider leading-none">
                  New
                </span>
              </a>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm transition-colors px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-600 font-medium hover:text-emerald-600"
                  }`
                }
                data-testid="nav-about"
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-sm transition-colors px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-600 font-medium hover:text-emerald-600"
                  }`
                }
                data-testid="nav-contact"
              >
                Contact
              </NavLink>
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-2.5 shrink-0">
              {isAuthenticated && user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    data-testid="nav-profile-btn"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[110px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ID: <strong className="text-slate-700">{user.serialId}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Regd: <strong className="text-slate-700">{user.regdNo}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {user.branch} • {user.email}
                        </p>
                      </div>

                      <div className="p-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openMyUploads();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition text-left cursor-pointer"
                        >
                          <FolderClock className="w-4 h-4 text-emerald-600" />
                          <span>My Uploaded PYQs</span>
                        </button>

                        <Link
                          to="/upload"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition text-left cursor-pointer"
                        >
                          <UploadIcon className="w-4 h-4 text-emerald-600" />
                          <span>Upload New Paper</span>
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  data-testid="nav-signin-btn"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-4 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
              )}

              <Link
                to="/upload"
                data-testid="nav-upload-btn"
                className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-full shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UploadIcon className="w-4 h-4 stroke-[2.2]" />
                <span>Upload PYQ</span>
              </Link>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
                data-testid="nav-menu-toggle"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                className="md:hidden mt-3 pb-4 pt-3 border-t border-slate-200/80 space-y-2 bg-[#FAFAFA]"
                data-testid="mobile-menu"
              >
                {isAuthenticated && user ? (
                  <div className="p-3 mb-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-600 font-mono">
                          {user.serialId} • {user.regdNo}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setOpen(false);
                          openMyUploads();
                        }}
                        className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        <FolderClock className="w-3.5 h-3.5" />
                        <span>My Uploaded PYQs</span>
                      </button>
                      <button
                        onClick={() => {
                          setOpen(false);
                          logout();
                        }}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : null}

                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Browse Library
                </Link>
                <Link
                  to="/requests"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Request Paper
                </Link>
                <a
                  href="https://bputresults.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                  data-testid="mobile-nav-bput-results"
                >
                  <span>BPUT Results</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider leading-none">
                    New
                  </span>
                </a>
                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Contact
                </Link>

                <div className="pt-2 flex items-center gap-2.5 px-1">
                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        openAuthModal("login");
                      }}
                      className="flex-1 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-slate-700"
                    >
                      Sign In
                    </button>
                  )}
                  <Link
                    to="/upload"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold text-center"
                  >
                    Upload PYQ
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Global Modals for Auth & My Uploads */}
      <AuthModal />
      <MyUploadsModal />
    </>
  );
}
