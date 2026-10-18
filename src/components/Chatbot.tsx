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
  if (b.includes("Data Science")) return "📊";
  if (b === "CSE") return "💻";
  if (b.includes("ECE") || b.includes("ETC")) return "📡";
  if (b === "EEE") return "⚡";
  if (b === "EE") return "🔌";
  if (b === "ME") return "⚙️";
  if (b === "Civil") return "🏗️";
  if (b === "Production") return "🏭";
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
      {/* Floating Toggle Button with Green Active Indicator at Top Right */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Assistant" : "Open Assistant"}
          data-testid="chatbot-toggle-btn"
          className="group relative flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-3.5 rounded-full border-2 border-black shadow-[3.5px_3.5px_0px_#000] hover:shadow-[4.5px_4.5px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-share font-bold text-xs"
        >
          <Bot className="w-5 h-5 stroke-[2.5]" />
          <span className="hidden sm:inline font-momo tracking-wide">PYQ Assistant</span>
          <span className="inline sm:hidden font-momo">Help</span>

          {/* Green Color Active Badge Top Right Position */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4" title="Assistant Active">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#22C55E] border-2 border-black shadow-[1px_1px_0px_#000]" />
          </span>
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className="fixed bottom-18 right-2.5 sm:bottom-24 sm:right-6 w-[80vw] max-w-[340px] sm:max-w-none sm:w-[430px] max-h-[71vh] sm:max-h-[84vh] h-[490px] sm:h-[580px] bg-[#FAF9F6] border-2 border-black rounded-xl sm:rounded-2xl shadow-[4.5px_4.5px_0px_#000] sm:shadow-[6px_6px_0px_#000] z-50 flex flex-col overflow-hidden font-share text-black animate-in fade-in zoom-in-95 duration-200"
          data-testid="chatbot-modal"
        >
          {/* Header - Clean with no BPUT or Online badge */}
          <div className="bg-[#2563EB] text-white border-b-2 border-black p-2.5 sm:p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_#000]">
                <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5] text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-momo font-bold text-xs sm:text-sm leading-tight text-white">
                  GetPYQ Assistant
                </h3>
                <p className="text-[9px] sm:text-[10px] text-blue-100 font-medium">Academic question papers & student helpline</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={resetChat}
                title="Restart Chat"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-white/30 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-white/30 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 space-y-3 sm:space-y-4 bg-[#FAF9F6]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-amber-200 border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000] mt-0.5">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5]" />
                  </div>
                )}

                <div className={`max-w-[90%] sm:max-w-[88%] ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border-2 border-black text-[11px] sm:text-xs font-medium shadow-[2px_2px_0px_#000] ${
                      msg.sender === "user"
                        ? "bg-[#2563EB] text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {formatMessageText(msg.text, msg.sender === "user")}
                  </div>

                  {/* Clean Menu Options (No badges like Branches, Sem 1-8, Quick, Wishlist) */}
                  {msg.menuOptions && msg.menuOptions.length > 0 && (
                    <div className="mt-2 sm:mt-2.5 space-y-1 sm:space-y-1.5">
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Select a Menu Option:
                      </p>
                      {msg.menuOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSend(opt.actionQuery)}
                          className="w-full bg-white hover:bg-blue-50 text-black border-2 border-black rounded-lg p-2 sm:p-2.5 text-left shadow-[2px_2px_0px_#000] hover:shadow-[2.5px_2.5px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-2 sm:gap-2.5 group"
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-stone-100 border border-black/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                              {renderIcon(opt.iconType)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-momo font-bold text-[11px] sm:text-xs text-black group-hover:text-[#2563EB] transition-colors block">
                                {opt.label}
                              </span>
                              {opt.desc && (
                                <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium truncate mt-0.5">
                                  {opt.desc}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matching PYQ Paper cards if found */}
                  {msg.papers && msg.papers.length > 0 && (
                    <div className="mt-2 sm:mt-2.5 space-y-1.5 sm:space-y-2">
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">
                        Matching Papers Found ({msg.papers.length})
                      </p>
                      {msg.papers.slice(0, 4).map((p, pIdx) => (
                        <div
                          key={`${p.id || "paper"}-${pIdx}`}
                          className="bg-white border-2 border-black rounded-lg p-2 sm:p-2.5 shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2 text-left hover:bg-blue-50/50 transition-all"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-momo font-bold text-[11px] sm:text-xs text-black truncate" title={p.paper}>
                              {p.paper}
                            </h4>
                            <div className="flex items-center gap-1 sm:gap-1.5 mt-1 flex-wrap">
                              <span className="text-[8px] sm:text-[9px] font-bold px-1 py-0.2 sm:px-1.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                                {formatBranchDisplay(p.branch)}
                              </span>
                              <span className="text-[8px] sm:text-[9px] font-bold px-1 py-0.2 sm:px-1.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                Sem {p.semester}
                              </span>
                              <span className="text-[8px] sm:text-[9px] font-mono text-gray-500">
                                {p.year}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRedirect(`/pyq/${p.id}`)}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md border-2 border-black text-[9px] sm:text-[10px] font-bold shadow-[1.5px_1.5px_0px_#000] shrink-0 flex items-center gap-1 cursor-pointer transition-all active:translate-x-0.5"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Redirection Action Buttons */}
                  {msg.redirects && msg.redirects.length > 0 && (
                    <div className="mt-2 sm:mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
                      {msg.redirects.map((red, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRedirect(red.path)}
                          className={`inline-flex items-center gap-1 sm:gap-1.5 border-2 border-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                            red.primary
                              ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              : "bg-white text-black hover:bg-amber-100"
                          }`}
                        >
                          <span>{red.label}</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[8px] sm:text-[9px] text-gray-400 font-mono block mt-1 sm:mt-1.5">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-stone-800 border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000] mt-0.5">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 sm:gap-2.5 items-center text-[11px] sm:text-xs text-gray-500 font-semibold">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-amber-200 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5]" />
                </div>
                <div className="bg-white border-2 border-black px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Form (Quick navigation strip removed) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-white border-t-2 border-black flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search subject, branch, semester or query..."
              className="flex-1 bg-[#FAF9F6] border-2 border-black rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-share font-semibold text-black placeholder:text-gray-400 placeholder:text-[11px] sm:placeholder:text-xs focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000] transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2563EB] disabled:bg-gray-300 text-white rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
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
  } else if (q.includes("data science") || q.includes("datascience") || q.includes(" ds ") || q.endsWith(" ds") || q.startsWith("ds ")) {
    matchedBranch = "CSE (Data Science)";
  } else if (q.includes("eee") || q.includes("electrical & elec") || q.includes("electrical and elec")) {
    matchedBranch = "EEE";
  } else if (
    q.includes("etc") ||
    q.includes("ece") ||
    q.includes("telecommunication") ||
    (q.includes("electronic") && !q.includes("electrical"))
  ) {
    matchedBranch = "ECE / ETC";
  } else if (q.includes("production") || q.includes("prod eng") || q.includes("pe ")) {
    matchedBranch = "Production";
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
