import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bot, 
  User, 
  X, 
  Send, 
  RotateCcw,
  ArrowRight, 
  UploadCloud,
  FileQuestion,
  Search,
  ChevronRight,
  Layers,
  Calendar
} from "lucide-react";
import { listPYQs } from "../lib/api";
import { PYQ } from "../types";
import { BRANCHES, formatBranchDisplay, isBranchMatch } from "../lib/constants";

function getBranchEmoji(b: string): string {
  if (b.includes("AI & ML")) return "🤖";
  if (b === "CSE") return "💻";
  if (b.includes("ECE") || b.includes("ETC")) return "📡";
  if (b === "EEE") return "⚡";
  if (b === "EE") return "🔌";
  if (b === "ME") return "⚙️";
  if (b === "Civil") return "🏗️";
  if (b === "IT") return "🌐";
  if (b === "Chemical") return "🧪";
  if (b === "Automobile") return "🚗";
  if (b.includes("Material") || b.includes("Metallurgy")) return "🔬";
  if (b === "Biotech") return "🧬";
  return "🏛️";
}

interface MenuOption {
  id: string;
  label: string;
  desc?: string;
  actionQuery: string;
  iconType?: "branch" | "semester" | "upload" | "request";
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  menuOptions?: MenuOption[];
  redirects?: Array<{
    label: string;
    path: string;
    type?: "paper" | "filter" | "page";
    primary?: boolean;
  }>;
  papers?: PYQ[];
}

// Clean menu options: Removed "Explore Full Archive" card, and removed all badges (Branches, Sem 1-8, Quick, Wishlist)
const MAIN_MENU_OPTIONS: MenuOption[] = [
  {
    id: "browse-branches",
    label: "Browse by Branch",
    desc: "CSE, ECE / ETC, EE, ME, Civil & all disciplines",
    actionQuery: "Browse by Branch",
    iconType: "branch"
  },
  {
    id: "filter-semesters",
    label: "Filter by Semester",
    desc: "1st through 8th Semester examination papers",
    actionQuery: "Filter by Semester",
    iconType: "semester"
  },
  {
    id: "upload-guide",
    label: "Upload & Contribute Paper",
    desc: "Share papers to help fellow batchmates",
    actionQuery: "How to upload a paper?",
    iconType: "upload"
  },
  {
    id: "request-paper",
    label: "Request a Missing Paper",
    desc: "Ask the student community for unseen papers",
    actionQuery: "Request a missing paper",
    iconType: "request"
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [allPapers, setAllPapers] = useState<PYQ[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load papers on mount for instant lookup
  useEffect(() => {
    listPYQs({ limit: 100 })
      .then((data) => setAllPapers(data))
      .catch((err) => console.error("Chatbot: failed to load papers", err));
  }, []);

  // Initialize welcome greeting on first open
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "👋 **Hello! Welcome to GetPYQ Student Assistant.**\n\nI can help you find previous year examination papers, navigate your engineering branch, or guide you through uploading and requesting papers.\n\nChoose an option from the menu below or type any subject name to get started:",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          menuOptions: MAIN_MENU_OPTIONS,
          redirects: [
            { label: "📚 Open Full Library", path: "/browse", type: "page", primary: true },
            { label: "📤 Upload a PYQ", path: "/upload", type: "page" }
          ]
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleRedirect = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Process response with realistic delay
    setTimeout(() => {
      const response = generateBotResponse(query, allPapers);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 320);
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "bot",
        text: "👋 **Chat reset! How can I assist your examination prep today?**\n\nChoose an option from the menu or type any subject or question below:",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        menuOptions: MAIN_MENU_OPTIONS,
        redirects: [
          { label: "📚 Open Full Library", path: "/browse", type: "page", primary: true }
        ]
      }
    ]);
  };

  const renderIcon = (type?: string) => {
    switch (type) {
      case "branch":
        return <Layers className="w-4 h-4 text-[#2563EB]" />;
      case "semester":
        return <Calendar className="w-4 h-4 text-[#16A34A]" />;
      case "upload":
        return <UploadCloud className="w-4 h-4 text-[#F97316]" />;
      case "request":
        return <FileQuestion className="w-4 h-4 text-[#9333EA]" />;
      default:
        return <Search className="w-4 h-4 text-black" />;
    }
  };

  /**
   * Formats text with markdown bold (**text**) and bullet lists (• bullet)
   * into clean, accessible JSX for higher quality presentation.
   */
  const formatMessageText = (text: string, isUser: boolean) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const isBullet = line.trim().startsWith("• ");
      const lineContent = isBullet ? line.trim().substring(2) : line;

      // Parse bold segments
      const parts = lineContent.split(/(\*\*[^*]+\*\*)/g);
      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2);
          return (
            <strong 
              key={pIdx} 
              className={isUser ? "font-bold text-white" : "font-bold text-black"}
            >
              {boldText}
            </strong>
          );
        }
        return <span key={pIdx}>{part}</span>;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isUser ? "bg-white" : "bg-[#2563EB]"}`} />
            <span className="leading-relaxed">{parsedParts}</span>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="leading-relaxed my-0.5">
          {parsedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Button with Green Active Indicator */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Assistant" : "Open Assistant"}
          data-testid="chatbot-toggle-btn"
          className="group relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer font-sans font-semibold text-xs"
        >
          <Bot className="w-4 h-4 stroke-[2.2]" />
          <span className="hidden sm:inline">PYQ Assistant</span>
          <span className="inline sm:hidden">Help</span>

          {/* Active Ping Dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3" title="Assistant Active">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white" />
          </span>
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[86vw] max-w-[360px] sm:max-w-none sm:w-[420px] max-h-[75vh] sm:max-h-[82vh] h-[500px] sm:h-[560px] bg-white border border-slate-200/90 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden font-sans text-slate-900 animate-in fade-in zoom-in-95 duration-200"
          data-testid="chatbot-modal"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm leading-tight text-white">
                  GetPYQ Assistant
                </h3>
                <p className="text-[10px] text-slate-400 font-normal">Academic question papers helpline</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={resetChat}
                title="Restart Chat"
                className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                )}

                <div className={`max-w-[88%] ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs font-normal leading-relaxed shadow-xs ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-800 border border-slate-200/80"
                    }`}
                  >
                    {formatMessageText(msg.text, msg.sender === "user")}
                  </div>

                  {/* Menu Options */}
                  {msg.menuOptions && msg.menuOptions.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Select an option:
                      </p>
                      {msg.menuOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSend(opt.actionQuery)}
                          className="w-full bg-white hover:bg-emerald-50/50 text-slate-900 border border-slate-200/80 hover:border-emerald-300 rounded-xl p-2.5 text-left shadow-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                              {renderIcon(opt.iconType)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors block">
                                {opt.label}
                              </span>
                              {opt.desc && (
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {opt.desc}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matching PYQ Paper cards */}
                  {msg.papers && msg.papers.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-left">
                        Matching Papers Found ({msg.papers.length})
                      </p>
                      {msg.papers.slice(0, 4).map((p, pIdx) => (
                        <div
                          key={`${p.id || "paper"}-${pIdx}`}
                          className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs flex items-center justify-between gap-2 text-left hover:border-emerald-300 transition-all"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-xs text-slate-900 truncate" title={p.paper}>
                              {p.paper}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {formatBranchDisplay(p.branch)}
                              </span>
                              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                Sem {p.semester}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">
                                {p.year}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRedirect(`/pyq?pyqId=${encodeURIComponent(p.id)}`)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-xs shrink-0 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Redirection Action Buttons */}
                  {msg.redirects && msg.redirects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.redirects.map((red, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRedirect(red.path)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 ${
                            red.primary
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span>{red.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 font-mono block mt-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200/80 px-3 py-2 rounded-2xl shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search subject, branch, semester..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/**
 * Intelligent helper to parse natural language queries, identify branch, semester, subject, or menu intent,
 * and construct impressive, user-friendly responses with direct redirection actions.
 */
function generateBotResponse(query: string, papers: PYQ[]): ChatMessage {
  const q = query.toLowerCase().trim();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 1. Menu Request
  if (q.includes("menu") || q === "help" || q === "options" || q === "start" || q === "home") {
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: "📋 **Main Navigation Menu**\n\nSelect an option below to explore our question paper repository or access student services:",
      timestamp: time,
      menuOptions: MAIN_MENU_OPTIONS,
      redirects: [
        { label: "📚 Explore All Papers", path: "/browse", type: "page", primary: true },
        { label: "📤 Upload Question Paper", path: "/upload", type: "page" }
      ]
    };
  }

  // 2. Branch Menu Request
  if (q.includes("branch") || q.includes("branches") || q.includes("browse by branch") || q.includes("engineering branch")) {
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: `🏛️ **Browse by Branch (${BRANCHES.length} Branches)**\n\nChoose your engineering branch to view verified previous year papers and semester collections:`,
      timestamp: time,
      redirects: BRANCHES.map((b) => ({
        label: `${getBranchEmoji(b)} ${b}`,
        path: `/browse?branch=${encodeURIComponent(b)}`,
        type: "filter" as const,
        primary: false
      }))
    };
  }

  // 3. Semester Menu Request
  if (q.includes("semester") && (q.includes("filter") || q.includes("select") || q.includes("list") || q.includes("all") || q.includes("academic") || q.includes("sem"))) {
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: "🎓 **Filter by Semester**\n\nChoose your semester to explore all regular and back examination papers across all branches:",
      timestamp: time,
      redirects: [
        { label: "1st Semester", path: "/browse?semester=1", type: "filter", primary: false },
        { label: "2nd Semester", path: "/browse?semester=2", type: "filter", primary: false },
        { label: "3rd Semester", path: "/browse?semester=3", type: "filter", primary: false },
        { label: "4th Semester", path: "/browse?semester=4", type: "filter", primary: false },
        { label: "5th Semester", path: "/browse?semester=5", type: "filter", primary: false },
        { label: "6th Semester", path: "/browse?semester=6", type: "filter", primary: false },
        { label: "7th Semester", path: "/browse?semester=7", type: "filter", primary: false },
        { label: "8th Semester", path: "/browse?semester=8", type: "filter", primary: false }
      ]
    };
  }

  // 4. Upload Intent
  if (q.includes("upload") || q.includes("contribute") || q.includes("submit paper") || q.includes("add paper")) {
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: "🌟 **Contribute & Support Fellow Students!**\n\nGetPYQ is an open student community. You can upload original examination papers in under 30 seconds without creating an account or logging in:\n\n• **Accepted Formats:** PDF files or clear camera scans\n• **Required Details:** Branch, Semester, Exam Year, and Type (Regular/Back)\n• **Moderation:** Reviewed and published by volunteers within 24 hours.\n\nReady to upload your question paper?",
      timestamp: time,
      redirects: [
        { label: "🚀 Open Upload Page", path: "/upload", type: "page", primary: true },
        { label: "📚 View Full Library", path: "/browse", type: "page" }
      ]
    };
  }

  // 5. Request Intent
  if (q.includes("request") || q.includes("missing") || q.includes("not found") || q.includes("unavailable") || q.includes("wishlist")) {
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: "📋 **Looking for an Unlisted Question Paper?**\n\nIf the exam paper you need isn't in our archive yet, submit a request on our community wishlist board!\n\n• Students and seniors regularly review pending requests\n• Matched papers are verified and uploaded directly to the archive\n• Upvoting helps prioritize urgently needed papers",
      timestamp: time,
      redirects: [
        { label: "📝 Go to Paper Requests Board", path: "/requests", type: "page", primary: true },
        { label: "🔍 Browse Current Library", path: "/browse", type: "page" }
      ]
    };
  }

  // 6. Contact / Support / Email Intent
  if (q.includes("contact") || q.includes("email") || q.includes("support") || q.includes("admin")) {
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: "✉️ **Get in Touch with GetPYQ Support**\n\nHave questions, feedback, or need moderation assistance? You can reach our volunteer team directly:\n\n• **Direct Email:** getpyq@gmail.com\n• **Support Desk:** Submit through our contact portal for a response within 24 hours.",
      timestamp: time,
      redirects: [
        { label: "✉️ Open Contact Desk", path: "/contact", type: "page", primary: true },
        { label: "📖 Learn About GetPYQ", path: "/about", type: "page" }
      ]
    };
  }

  // 7. Detect Branch
  let matchedBranch: string | null = null;
  // Check specialized sub-branches first before general keywords
  if (q.includes("ai") || q.includes("ml") || q.includes("aiml") || q.includes("artificial intelligence") || q.includes("machine learning")) {
    matchedBranch = "CSE (AI & ML)";
  } else if (q.includes("eee") || q.includes("electrical & elec") || q.includes("electrical and elec")) {
    matchedBranch = "EEE";
  } else if (
    q.includes("etc") ||
    q.includes("ece") ||
    q.includes("telecommunication") ||
    (q.includes("electronic") && !q.includes("electrical"))
  ) {
    matchedBranch = "ECE / ETC";
  } else {
    for (const b of BRANCHES) {
      if (q.includes(b.toLowerCase())) {
        matchedBranch = b;
        break;
      }
    }
  }

  if (!matchedBranch) {
    if (q.includes("computer") || q.includes("cse") || q.includes("cs")) matchedBranch = "CSE";
    else if (q.includes("electrical") || q.includes("ee")) matchedBranch = "EE";
    else if (q.includes("mechanical") || q.includes("mech") || q.includes("me")) matchedBranch = "ME";
    else if (q.includes("civil")) matchedBranch = "Civil";
    else if (q.includes("chemical")) matchedBranch = "Chemical";
    else if (q.includes("auto")) matchedBranch = "Automobile";
  }

  // 8. Detect Semester (1-8)
  let matchedSem: string | null = null;
  const semPatterns = [
    /(?:sem(?:ester)?|s)\s*([1-8])/i,
    /([1-8])(?:st|nd|rd|th)?\s*sem/i,
    /semester\s*([1-8])/i
  ];
  for (const p of semPatterns) {
    const match = q.match(p);
    if (match && match[1]) {
      matchedSem = match[1];
      break;
    }
  }

  // 9. Search matching papers by title or keywords
  const matchedPapers = papers.filter((p) => {
    const paperName = (p.paper || "").toLowerCase();
    const sem = p.semester;

    // Filter by branch if found using unified isBranchMatch (including ECE / ETC equivalence)
    if (matchedBranch && !isBranchMatch(p.branch, matchedBranch)) {
      return false;
    }
    // Filter by sem if found
    if (matchedSem && sem !== matchedSem) {
      return false;
    }

    // Keyword match
    const cleanKeywords = q
      .replace(/sem(ester)?/g, "")
      .replace(/[1-8](st|nd|rd|th)?/g, "")
      .replace(/cse|ece|ee|me|civil|it|branch/g, "")
      .replace(/find|paper|papers|pyq|pyqs|download|view|search|show|get/g, "")
      .trim()
      .split(/\s+/)
      .filter((k) => k.length > 2);

    if (cleanKeywords.length === 0) return true; // Branch/sem query
    return cleanKeywords.some((k) => paperName.includes(k));
  });

  // Construct response based on matches
  if (matchedPapers.length > 0) {
    const filterPath = `/browse?${matchedBranch ? `branch=${encodeURIComponent(matchedBranch)}&` : ""}${matchedSem ? `semester=${encodeURIComponent(matchedSem)}` : ""}`.replace(/[&?]$/, "");
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: `✨ **Found ${matchedPapers.length} question paper(s) for your search!**\n\nHere are top matching papers${matchedBranch ? ` for ${matchedBranch}` : ""}${matchedSem ? ` Semester ${matchedSem}` : ""}. Click **Open** on any paper to view questions or download:`,
      timestamp: time,
      papers: matchedPapers.slice(0, 4),
      redirects: [
        { 
          label: `🔍 View All ${matchedBranch || ""} ${matchedSem ? `Sem ${matchedSem}` : ""} Papers`, 
          path: filterPath || "/browse", 
          type: "filter",
          primary: true
        },
        { label: "📤 Upload Another Paper", path: "/upload", type: "page" }
      ]
    };
  }

  // If specific branch/sem matched but no exact paper in local cache, redirect to library with those filters
  if (matchedBranch || matchedSem) {
    const filterPath = `/browse?${matchedBranch ? `branch=${encodeURIComponent(matchedBranch)}&` : ""}${matchedSem ? `semester=${encodeURIComponent(matchedSem)}` : ""}`.replace(/[&?]$/, "");
    return {
      id: "bot-" + Date.now(),
      sender: "bot",
      text: `🎯 **Custom Filter Prepared!**\n\nI have configured search filters for **${matchedBranch || "all branches"}** ${matchedSem ? `Semester ${matchedSem}` : ""}. Click below to browse available papers in this category:`,
      timestamp: time,
      redirects: [
        { label: `👉 View ${matchedBranch || ""} ${matchedSem ? `Sem ${matchedSem}` : ""} in Library`, path: filterPath, type: "filter", primary: true },
        { label: "📝 Request Missing Paper", path: "/requests", type: "page" }
      ]
    };
  }

  // Default friendly fallback with organized menu
  return {
    id: "bot-" + Date.now(),
    sender: "bot",
    text: `🔍 **I couldn't locate specific question papers for "${query}".**\n\nYou can explore our catalog using the menu below, or browse the entire repository with custom filters:`,
    timestamp: time,
    menuOptions: MAIN_MENU_OPTIONS,
    redirects: [
      { label: "📚 Open Full Library", path: "/browse", type: "page", primary: true },
      { label: "📝 Post Paper Request", path: "/requests", type: "page" }
    ]
  };
}
