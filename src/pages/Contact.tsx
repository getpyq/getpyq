import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, HelpCircle, Send, Check, Home, MessageSquare } from "lucide-react";
import { submitContactMessage } from "../lib/api";
import SEOHead from "../components/SEOHead";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "feedback",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim()
      });

      setTicketId(res.ticketId);
      setIsSubmitting(false);
      setSuccess(true);
      toast.success(res.message || "Message recorded directly!");

      setForm({
        name: "",
        email: "",
        subject: "feedback",
        message: ""
      });
    } catch (err: any) {
      console.error("Failed to submit contact message", err);
      setIsSubmitting(false);
      toast.error("An error occurred while saving your inquiry. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 font-sans text-slate-900 flex-grow" data-testid="contact-page">
      <SEOHead
        title="Contact GetPYQ – Student Support, Feedback & Inquiries"
        description="Have questions, DMCA copyright inquiries, paper corrections, or feedback? Get in touch with the GetPYQ student community moderation desk."
        keywords="contact getpyq, getpyq support, report paper error, bput student helpdesk, getpyq contact email"
        canonicalUrl="https://getpyq.vercel.app/contact"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Contact Support", item: "/contact" }
        ]}
      />

      {/* Header section */}
      <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-3 select-none">
          ✦ Support Desk ✦
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 select-none tracking-tight leading-tight mb-2">
          Contact Support
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Reach out to our volunteer moderator network for BPUT paper requests, solutions, or portal feedback.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* Contact Form Section */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          {success ? (
            <div className="text-center py-6" data-testid="contact-success-state">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center mb-4">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-2 text-slate-900">Message Received!</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6 font-normal">
                Thank you for reaching out. Your feedback has been recorded and will be reviewed promptly.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl max-w-xs mx-auto mb-6">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Reference Ticket ID</p>
                <p className="text-base font-mono font-bold text-emerald-700 select-all mt-1">{ticketId}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Link
                  to="/"
                  data-testid="contact-go-to-home-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 h-10 rounded-full text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Go to Home</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 h-10 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" data-testid="contact-form">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Send Us a Message</h2>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Priyesh Sen"
                    className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-3 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    data-testid="contact-input-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. priyesh@gmail.com"
                    className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-3 rounded-xl outline-none focus:border-emerald-500 transition-all"
                    data-testid="contact-input-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  What are you contacting about?
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full h-10 border border-slate-200 bg-white text-slate-800 text-xs font-medium px-3 rounded-xl outline-none cursor-pointer focus:border-emerald-500 transition-all"
                  data-testid="contact-select-subject"
                >
                  <option value="feedback">General Feedback & Suggestions</option>
                  <option value="university">Requesting BPUT Subject / Branch Addition</option>
                  <option value="solutions">Submitting Solutions Guide</option>
                  <option value="volunteer">Become a Student Moderator</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Message / Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your question, request, or feedback in detail..."
                  className="w-full border border-slate-200 bg-white text-slate-800 text-xs font-medium p-3 rounded-xl outline-none focus:border-emerald-500 transition-all"
                  data-testid="contact-input-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer flex items-center justify-center gap-2"
                data-testid="contact-submit-btn"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Email Us Directly</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              Prefer writing a quick email? You can message our admin team directly:
            </p>
            <a
              href="mailto:getpyq@gmail.com"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              getpyq@gmail.com
            </a>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Looking for a Missing Paper?</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              You can post your subject request on our public wishlist so students or seniors can upload it:
            </p>
            <Link
              to="/requests"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <span>Go to Request Board</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
