import React, { useState } from "react";
import { toast } from "sonner";
import { Mail, HelpCircle, Send, Check, Loader2 } from "lucide-react";
import { submitContactMessage } from "../lib/api";
import SEOHead from "../components/SEOHead";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

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
      toast.error("Please enter a valid academic or personal email address.");
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
      toast.success(res.message || "Message recorded directly in Google Sheet!");

      // Reset form fields
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
    <div className="w-full max-w-full mx-auto px-6 sm:px-10 md:px-12 lg:px-[10%] pt-8 pb-8 bg-[#FAF9F6] text-black flex-grow font-share" data-testid="contact-page">
      <SEOHead
        title="Contact Support & Inquiries | GetPYQ"
        description="Have questions, DMCA inquiries, feedback, or paper corrections? Contact the GetPYQ student support desk."
        keywords="contact getpyq, getpyq support, report paper error, bput student helpdesk"
      />
      {/* Header section fully centered */}
      <div className="mb-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-200 text-black font-share text-xs font-bold px-4 py-1.5 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_#000] select-none">
          ✦ Support Desk ✦
        </span>
        <h1 className="font-momo font-bold text-3xl sm:text-4xl md:text-5xl text-black select-none leading-none mb-1">
          Contact Support
        </h1>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm font-share font-medium leading-relaxed">
          Reach out to our volunteer moderator network for BPUT paper requests, solutions, or portal feedback.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
        {/* Contact Form Section */}
        <div className="lg:col-span-7 relative">
          <div className="absolute inset-0 bg-[#F97316] border-2 border-black rounded-2xl rotate-1 shadow-[4px_4px_0px_#000]" />
          <div className="relative bg-white border-2 border-black rounded-2xl p-6 sm:p-8">
            {success ? (
              <div className="text-center py-8" data-testid="contact-success-state">
                <div className="w-16 h-16 bg-[#25D366] rounded-full mx-auto animate-bounce border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] mb-6 text-white text-3xl font-bold">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-momo font-bold mb-2 text-black">Message Received!</h3>
                <p className="text-gray-700 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed mb-6">
                  Thank you for reaching out. A volunteer moderator will review your feedback within 24-48 business hours.
                </p>
                <div className="bg-[#FAF9F6] border-2 border-black p-4 rounded-xl max-w-xs mx-auto mb-8 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <p className="text-[9px] font-share font-bold text-gray-500 leading-none">Reference Ticket ID</p>
                  <p className="text-lg font-share font-black text-[#F97316] select-all mt-1">{ticketId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-black text-white px-6 h-11 rounded-lg border-2 border-black text-xs font-share font-bold hover:bg-[#2563EB] transition-all cursor-pointer shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6" data-testid="contact-form">
                <h2 className="text-xl font-momo font-bold mb-4 text-black text-center sm:text-left">Send Us a Message</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-share font-bold text-[#F97316] pl-1 mb-1 leading-none select-none">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Priyesh Sen"
                      className="w-full h-11 border-2 border-black bg-white text-black text-xs font-share font-medium px-3 rounded-lg outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] focus:-translate-y-0.5 transition-all"
                      data-testid="contact-input-name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-share font-bold text-[#F97316] pl-1 mb-1 leading-none select-none">
                      Your Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. priyesh@edu.in"
                      className="w-full h-11 border-2 border-black bg-white text-black text-xs font-share font-medium px-3 rounded-lg outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] focus:-translate-y-0.5 transition-all"
                      data-testid="contact-input-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-share font-bold text-[#F97316] pl-1 mb-1 leading-none select-none">
                    What are you contacting about?
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full h-11 border-2 border-black bg-white text-black text-xs font-share font-medium px-2 rounded-lg outline-none cursor-pointer focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] focus:-translate-y-0.5 transition-all"
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
                  <label className="block text-[10px] font-share font-bold text-[#F97316] pl-1 mb-1 leading-none select-none">
                    Detailed Message / Request <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Type your message, query, or campus coordinates here..."
                    className="w-full border-2 border-black bg-white text-black text-xs font-share font-medium p-3 rounded-lg outline-none focus:bg-amber-50 focus:shadow-[2px_2px_0px_#000] focus:-translate-y-0.5 transition-all resize-y"
                    data-testid="contact-input-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-black text-white border-2 border-black text-xs font-share font-bold rounded-lg hover:bg-[#2563EB] disabled:opacity-50 transition-all cursor-pointer shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
                  data-testid="contact-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0 stroke-[2.5]" /> Submit My Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Coordinates Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000]" data-testid="contact-meta-info">
            <h3 className="font-momo font-bold text-lg sm:text-xl mb-5 text-black">Official Channels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border-2 border-black text-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#000]">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[9px] font-share font-bold text-gray-500 leading-none mb-1">Email Inquiry</p>
                  <a href="mailto:getpyq@gmail.com" className="font-share font-bold text-xs sm:text-sm text-black select-all hover:text-[#2563EB] transition-colors">
                    getpyq@gmail.com
                  </a>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Average response time: 24h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-[#2563EB] border-2 border-black rounded-2xl rotate-1 shadow-[3px_3px_0px_#000]" />
            <div className="relative bg-white border-2 border-black rounded-2xl p-6">
              <h3 className="font-momo font-bold text-base sm:text-lg mb-2 flex items-center gap-2 text-black">
                <HelpCircle className="w-5 h-5 text-[#2563EB]" /> Fast Contribution
              </h3>
              <p className="text-gray-700 text-xs font-medium leading-relaxed">
                Looking to upload a paper you got on a WhatsApp group? Don't stress! You can upload it instantly directly from our Contribute page without asking for credentials first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
