import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BRANCHES } from "../lib/constants";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  Hash,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    sendOTP,
    resetPassword,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupBranch, setSignupBranch] = useState("CSE");
  const [signupRegdNo, setSignupRegdNo] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Forgot password form state
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setErrorMsg("");
      setSuccessMsg("");
      if (authModalMode !== "forgot") {
        setForgotStep("request");
      }
    }
  }, [authModalMode, isAuthModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await login(loginIdentifier, loginPassword);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await signup({
        name: signupName,
        branch: signupBranch,
        regdNo: signupRegdNo,
        email: signupEmail,
        password: signupPassword,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await sendOTP(forgotIdentifier);
      setMaskedEmail(res.email || forgotIdentifier);
      setSuccessMsg(res.message);
      setForgotStep("verify");
    } catch (err: any) {
      setErrorMsg(err.message || "Could not dispatch verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(forgotIdentifier, otpCode, newPassword);
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode("login");
        setLoginIdentifier(forgotIdentifier);
        setLoginPassword("");
        setForgotStep("request");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Password reset failed. Please check OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              {mode === "login" && <Lock className="w-4 h-4" />}
              {mode === "signup" && <Sparkles className="w-4 h-4" />}
              {mode === "forgot" && <KeyRound className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {mode === "login" && "Sign In to GetPYQ"}
                {mode === "signup" && "Student Contributor Registration"}
                {mode === "forgot" && "Reset Password with Email OTP"}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === "login" && "Access contributor uploads & history"}
                {mode === "signup" && "Get your unique BPUT student serial ID"}
                {mode === "forgot" && "Secure OTP dispatch to your email"}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Login / Signup) */}
        {mode !== "forgot" && (
          <div className="flex border-b border-slate-100 p-1 bg-slate-100/50">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Alert / Notice Messages */}
        <div className="px-6 pt-4">
          {errorMsg && (
            <div className="p-3 mb-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Mode 1: LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="p-6 pt-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email OR BPUT Registration Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul@example.com or 2101201045"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                You can sign in with either your registered email or your BPUT registration number.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setForgotIdentifier(loginIdentifier);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-500">Need to upload PYQs? </span>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Register as Contributor
              </button>
            </div>
          </form>
        )}

        {/* Mode 2: SIGNUP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="p-6 pt-2 space-y-3.5 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch / Discipline <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={signupBranch}
                  onChange={(e) => setSignupBranch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition appearance-none"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                BPUT Registration Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 2101201045"
                  value={signupRegdNo}
                  onChange={(e) => setSignupRegdNo(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition uppercase"
                />
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="mt-0.5 text-[10px] text-slate-500">
                You can use this number to sign in anytime!
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition lowercase"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Used for password resets and verification OTPs.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Get ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-1 text-center">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Mode 3: FORGOT PASSWORD / EMAIL OTP */}
        {mode === "forgot" && (
          <div className="p-6 pt-2">
            {forgotStep === "request" ? (
              <form onSubmit={handleRequestOTPSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered Email or BPUT Registration Number. We will dispatch a 6-digit verification code to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email or BPUT Regd. No.
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. rahul@example.com or 2101201045"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">OTP Sent to Email</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Code sent to <span className="font-mono font-medium text-slate-700">{maskedEmail}</span>. Valid for 15 minutes.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 text-center text-lg tracking-widest font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep("request")}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Change Email / Regd No
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
