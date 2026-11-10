import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
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
import BranchDetail from "./pages/BranchDetail";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Chatbot from "./components/Chatbot";
import NoticeModal from "./components/NoticeModal";


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
          <Route path="/branch/:slug" element={<BranchDetail />} />
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
      <div className="flex flex-col min-h-screen bg-[#FAFBFD] font-sans antialiased text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        {/* Navigation header */}
        <Navbar />
        
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

