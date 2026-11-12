import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Upload as UploadIcon,
  Menu,
  X,
  Home,
  BookOpen,
  FileQuestion,
  Info,
  Mail,
  User as UserIcon,
  LogOut,
  FolderClock,
  ChevronDown,
  ShieldCheck,
  Sparkles,
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

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200/60 font-sans"
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo - clean aligned margin & GetPYQ brand text in Playpen Sans */}
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-2 select-none group shrink-0 ml-0"
          >
            <img
              src="/assets/aistudio/Navy_and_Green_Graduation_Logo_824bf272.png"
              alt="GetPYQ - BPUT University Archive Logo"
              className="h-8 sm:h-9 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
            <span
              className="font-playpen text-xl sm:text-2xl font-bold tracking-tight select-none leading-none"
              style={{ fontFamily: '"Playpen Sans", cursive, sans-serif' }}
            >
              <span className="text-[#0e1b38]">Get</span>
              <span className="text-[#059669]">PYQ</span>
            </span>
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
            {/* Authenticated User Menu OR Sign In Button */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-xs transition cursor-pointer text-left"
                  data-testid="nav-profile-btn"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="max-w-[110px] leading-tight">
                    <span className="block text-xs font-bold text-slate-800 truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                className="h-9 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>
            )}

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
              {/* Contributor Profile Header in Mobile Menu */}
              {isAuthenticated && user ? (
                <div className="p-3 mb-1 bg-emerald-50/70 border border-emerald-200 rounded-xl">
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
              ) : (
                <div className="p-2.5 mb-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Contributor Login</p>
                    <p className="text-[10px] text-slate-500">Sign in to upload and manage papers</p>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      openAuthModal("login");
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Sign In
                  </button>
                </div>
              )}

              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Home</span>
              </Link>
              <Link
                to="/browse"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Browse Library</span>
              </Link>
              <Link
                to="/requests"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <FileQuestion className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Request a Paper</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
              >
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>About GetPYQ</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-all"
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

      {/* Global Modals for Auth & My Uploads */}
      <AuthModal />
      <MyUploadsModal />
    </>
  );
}
