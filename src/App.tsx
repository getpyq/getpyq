import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Upload from "./pages/Upload";
import PYQDetail from "./pages/PYQDetail";
import Requests from "./pages/Requests";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Sitemap from "./pages/Sitemap";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Chatbot from "./components/Chatbot";
import NoticeModal from "./components/NoticeModal";

interface PageMeta {
  title: string;
  badge?: string;
  parent?: { label: string; path: string };
  backTo: string;
  backLabel: string;
}

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/browse") {
    return {
      title: "Browse PYQ Library",
      badge: "BPUT Question Papers",
      backTo: "/",
      backLabel: "Home",
    };
  }
  if (pathname === "/upload") {
    return {
      title: "Upload Paper",
      badge: "Community Submission",
      parent: { label: "PYQ Library", path: "/browse" },
      backTo: "/browse",
      backLabel: "PYQ Library",
    };
  }
  if (pathname === "/requests" || pathname === "/request") {
    return {
      title: "Request a Paper",
      badge: "Peer Community Requests",
      parent: { label: "PYQ Library", path: "/browse" },
      backTo: "/browse",
      backLabel: "PYQ Library",
    };
  }
  if (pathname === "/pyq" || pathname.startsWith("/pyq/")) {
    return {
      title: "Paper Viewer",
      badge: "Question Paper & Solutions",
      parent: { label: "PYQ Library", path: "/browse" },
      backTo: "/browse",
      backLabel: "PYQ Library",
    };
  }
  if (pathname === "/about") {
    return {
      title: "About GetPYQ",
      badge: "Mission & Team",
      backTo: "/browse",
      backLabel: "Library",
    };
  }
  if (pathname === "/contact") {
    return {
      title: "Contact Support",
      badge: "Help & Inquiries",
      backTo: "/browse",
      backLabel: "Library",
    };
  }
  if (pathname === "/sitemap") {
    return {
      title: "Website Sitemap",
      badge: "Directory Indices",
      backTo: "/browse",
      backLabel: "Library",
    };
  }
  if (pathname === "/terms") {
    return {
      title: "Terms & Conditions",
      badge: "Terms of Use",
      backTo: "/browse",
      backLabel: "Library",
    };
  }
  if (pathname === "/privacy") {
    return {
      title: "Privacy Policy",
      badge: "Data Protection",
      backTo: "/browse",
      backLabel: "Library",
    };
  }
  if (pathname === "/disclaimer") {
    return {
      title: "Disclaimer Statement",
      badge: "Non-Affiliation Notice",
      backTo: "/browse",
      backLabel: "Library",
    };
  }

  return {
    title: "Page Not Found",
    badge: "404 Error",
    backTo: "/",
    backLabel: "Home",
  };
}

function BackToHomeBar() {
  const location = useLocation();
  if (location.pathname === "/") {
    return null;
  }

  const meta = getPageMeta(location.pathname);

  return (
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-4 pb-1 flex items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Link
          to={meta.backTo}
          className="inline-flex items-center justify-center p-1.5 rounded-lg text-black hover:bg-stone-200/70 hover:text-[#2563EB] active:scale-95 transition-all cursor-pointer shrink-0"
          data-testid="global-back-to-home"
          aria-label={`Back to ${meta.backLabel}`}
          title={`Back to ${meta.backLabel}`}
        >
          <ArrowLeft className="w-4 h-4 shrink-0 stroke-[2.5]" />
        </Link>

        {/* Minimalist divider */}
        <div className="h-3.5 w-[1.5px] bg-black/20 select-none shrink-0" />

        {/* Breadcrumb / Page Location */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-share min-w-0">
          <Link to="/" className="text-gray-500 hover:text-black font-semibold transition-colors shrink-0">
            Home
          </Link>
          <span className="text-gray-400 select-none text-[11px]">/</span>
          {meta.parent && (
            <>
              <Link to={meta.parent.path} className="text-gray-500 hover:text-black font-semibold transition-colors shrink-0 hidden xs:inline">
                {meta.parent.label}
              </Link>
              <span className="text-gray-400 select-none text-[11px] hidden xs:inline">/</span>
            </>
          )}
          <span className="text-black font-bold truncate">
            {meta.title}
          </span>
        </nav>
      </div>

      {/* Clean contextual badge on larger viewports */}
      {meta.badge && (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-black/20 bg-white text-[11px] font-share font-bold text-gray-700 shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,0.06)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
          {meta.badge}
        </span>
      )}
    </div>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

// Intercepts URLs with ?pyqId=... on any page (root, browse, subdomain) or /pyq/:id and routes directly to canonical /pyq?pyqId=...
function PyqQueryParamRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const rawSearch = location.search || window.location.search;
      const params = new URLSearchParams(rawSearch);
      const paramPyqId = (
        params.get("pyqId") ||
        params.get("pyqid") ||
        params.get("pyq_id") ||
        (location.pathname.startsWith("/pyq") ? params.get("id") : "") ||
        ""
      ).trim();

      // Case 1: Query param pyqId present on any route or subdomain
      if (paramPyqId) {
        if (location.pathname !== "/pyq" || params.get("pyqId") !== paramPyqId) {
          navigate(`/pyq?pyqId=${encodeURIComponent(paramPyqId)}`, { replace: true });
          return;
        }
      }

      // Case 2: Direct path /pyq/:id (normalize to /pyq?pyqId=...)
      if (location.pathname.startsWith("/pyq/") && location.pathname.length > 5) {
        const pathId = location.pathname.slice(5).trim();
        if (pathId && pathId !== "") {
          navigate(`/pyq?pyqId=${encodeURIComponent(pathId)}`, { replace: true });
        }
      }
    } catch {
      // ignore
    }
  }, [location.search, location.pathname, navigate]);

  return null;
}

function AdminRedirect() {
  useEffect(() => {
    window.location.replace("/admin.html");
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-8 h-8 border-4 border-black border-t-amber-400 rounded-full animate-spin"></div>
      <p className="font-bold text-sm font-share">Opening Admin Console...</p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{
          type: "tween",
          ease: [0.22, 1, 0.36, 1], // Custom professional easeOutQuint / Expo curve
          duration: 0.38,
        }}
        className="flex-grow flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/request" element={<Requests />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/pyq/:id" element={<PYQDetail />} />
          <Route path="/pyq" element={<PYQDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin.html" element={<AdminRedirect />} />
          <Route path="/database-status" element={<Navigate to="/" replace />} />
          <Route path="/verify-database" element={<Navigate to="/" replace />} />
          {/* Universal 404 Catch-All Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PyqQueryParamRedirect />
      <div className="flex flex-col min-h-screen bg-[#FAF9F6] font-sans antialiased text-black">
        {/* Navigation header */}
        <Navbar />
        
        {/* Navigation fallback action */}
        <BackToHomeBar />
        
        {/* Page body router */}
        <main className="flex-grow flex flex-col">
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </main>
        
        {/* Persistent foot section */}
        <Footer />

        {/* AI PYQ Assistant with direct redirection */}
        <Chatbot />

        {/* Website Announcements, Wishes, Festivals & Exam Updates */}
        <NoticeModal />

        {/* Success / Error notification alerts */}
        <Toaster position="bottom-right" richColors theme="light" />
      </div>
    </BrowserRouter>
  );
}

