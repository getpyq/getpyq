import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  UserCheck,
  Database,
  FileUp,
  ExternalLink,
  Trash2,
  ArrowRight,
  Lock,
} from "lucide-react";
import SEOHead from "../components/SEOHead";

const POLICY_SECTIONS = [
  {
    number: "01",
    icon: Lock,
    title: "Browsing Without an Account",
    summary: "Search, preview, bookmark, and download every PYQ with zero sign-up required.",
    points: [
      "Every BPUT question paper, peer solution, and branch archive can be browsed, viewed in-browser, and downloaded completely anonymously.",
      "We do not collect personal identity records, tracking profiles, or behavioral ad identifiers from visitors who simply browse or download PDFs.",
      "Paper requests and community upvotes work seamlessly without requiring personal analytics profiles.",
    ],
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Optional Contributor Accounts",
    summary: "Information collected only when you choose to register as a GetPYQ contributor.",
    points: [
      "When you voluntarily create a contributor account to upload question papers, we store your Name, Email Address, Engineering Branch, and BPUT Registration Number.",
      "Upon registration, the system assigns a unique Student Serial ID so your uploaded papers are properly credited under your name and accessible in your 'My Uploaded PYQs' dashboard.",
      "Your password is kept strictly for account authentication and is never displayed publicly on any paper card or archive listing.",
    ],
  },
  {
    number: "03",
    icon: Database,
    title: "Local Browser Storage & Preferences",
    summary: "What stays strictly on your own device.",
    points: [
      "Filter selections, saved bookmarks, upvote history, and active contributor session state are stored locally in your browser's localStorage for instant responsiveness.",
      "We do not run third-party advertising cookies, retargeting pixels, or cross-site tracking scripts.",
      "Clearing your browser site data or localStorage immediately removes all locally stored bookmarks and session preferences.",
    ],
  },
  {
    number: "04",
    icon: FileUp,
    title: "Uploaded PDFs & Google Drive Storage",
    summary: "How submitted question papers and metadata are processed.",
    points: [
      "Uploaded PDFs are processed directly in your browser to add a clean GetPYQ attribution footer before being saved to our public Google Drive archive and cataloged in our database.",
      "We store paper metadata (subject name, branch, semester, exam year, exam type, and contributor credit name) solely to power search and filtering.",
      "Please avoid uploading PDFs that contain personal student roll numbers, admit cards, or private notes you do not wish to share publicly.",
    ],
  },
  {
    number: "05",
    icon: ExternalLink,
    title: "External Links & Companion Tools",
    summary: "Third-party destinations linked from GetPYQ.",
    points: [
      "GetPYQ links to external resources such as Google Drive PDF downloads and the BPUT Results portal (bputresults.vercel.app) for student convenience.",
      "Once you open an external link, your visit is governed by that destination's own privacy practices and terms.",
      "Aggregate download and upvote counts are recorded solely as anonymous numerical counters to highlight popular exam papers.",
    ],
  },
  {
    number: "06",
    icon: Trash2,
    title: "Your Rights, Updates & Removal Requests",
    summary: "Full control over your contributor profile and uploaded papers.",
    points: [
      "You may request correction or removal of your contributor account details or ask us to unpublish/anonymize a paper you submitted at any time.",
      "If any paper was uploaded in error or contains sensitive personal details, reach out via our Contact page with the paper link or subject details for prompt review.",
    ],
  },
];

export default function Privacy() {
  return (
    <div
      className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans pb-20"
      data-testid="privacy-page"
    >
      <SEOHead
        title="Privacy Policy | GetPYQ"
        description="Read the GetPYQ Privacy Policy covering anonymous browsing, optional contributor accounts, localStorage usage, PDF uploads, and student data protection."
        keywords="getpyq privacy policy, bput pyq privacy, student data protection, anonymous browsing"
        canonicalUrl="https://getpyq.vercel.app/privacy"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Privacy Policy", item: "/privacy" },
        ]}
      />

      {/* Editorial Page Header */}
      <section className="border-b border-slate-200/80 bg-[#FAFAFA] pt-8 sm:pt-12 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-emerald-700 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold tracking-[0.16em] uppercase">
                  Transparency &amp; Student Safety
                </span>
              </div>
              <h1 className="font-cabinet text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.08]">
                Privacy Policy
              </h1>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                GetPYQ is built to keep BPUT exam preparation fast, free, and respectful of your privacy. Here is a clear breakdown of what we collect, what stays on your device, and how uploaded papers are handled.
              </p>
            </div>

            <div className="shrink-0 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 text-left md:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Last Updated
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                November 2026
              </p>
            </div>
          </div>

          {/* Key Commitments Strip */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Zero Ad Tracking
              </p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                No ad networks, third-party trackers, or behavioral profiling cookies.
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Browse Anonymously
              </p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Downloading and previewing question papers never requires an account.
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Minimal Contributor Data
              </p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Registration details are used solely to credit your uploaded papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-5">
        {POLICY_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <article
              key={section.number}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 sm:block shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-cabinet text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      <span className="font-mono text-xs text-emerald-700 mr-2">
                        {section.number}.
                      </span>
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {section.summary}
                  </p>

                  <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                    {section.points.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}

        {/* Bottom Contact Callout */}
        <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-cabinet text-xl font-bold text-slate-900">
              Questions or Data Removal Requests?
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Need to update your contributor profile, remove an accidentally uploaded document, or report a privacy concern? Get in touch and we will assist promptly.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/terms"
              className="px-4 py-2.5 rounded-full bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Terms of Use
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
