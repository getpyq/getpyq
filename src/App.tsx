import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
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
import { AuthProvider } from "./context/AuthContext";


function ScrollToTopOnQueryChange() {
  const { pathname, search } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Path changes are scrolled smoothly in AnimatePresence onExitComplete so exiting pages never snap mid-fade
    if (prevPathRef.current === pathname && search) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevPathRef.current = pathname;
  }, [pathname, search]);

  return null;
}

function RouteTransitionBar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 380);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={`route-bar-${pathname}`}
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left center" }}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-[70] pointer-events-none"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
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

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.996,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.998,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
    >
      <motion.div
        key={location.pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "transform, opacity" }}
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
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <LayoutGroup>
            <RouteTransitionBar />
            <ScrollToTopOnQueryChange />
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

              {/* Success / Error notification alerts */}
              <Toaster position="bottom-right" richColors theme="light" />
            </div>
          </LayoutGroup>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}


