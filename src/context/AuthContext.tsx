import React, { createContext, useContext, useState, useEffect } from "react";
import { User, OTPResponse } from "../types";
import {
  loginUser,
  signupUser,
  sendResetOTP,
  verifyResetOTP,
  resetPassword as apiResetPassword,
} from "../lib/api";

const AUTH_STORAGE_KEY = "getpyq_auth_user_session";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  signup: (data: {
    name: string;
    branch: string;
    regdNo: string;
    email: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  sendOTP: (identifier: string) => Promise<OTPResponse>;
  verifyOTP: (identifier: string, otp: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    identifier: string,
    otp: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup" | "forgot";
  openAuthModal: (mode?: "login" | "signup" | "forgot") => void;
  closeAuthModal: () => void;
  isMyUploadsOpen: boolean;
  openMyUploads: () => void;
  closeMyUploads: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "forgot">("login");
  const [isMyUploadsOpen, setIsMyUploadsOpen] = useState(false);

  // Restore authenticated session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.serialId && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    const res = await loginUser(identifier, password);
    if (!res.user) {
      throw new Error(res.message || "Failed to sign in.");
    }
    setUser(res.user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
    } catch {}
    setIsAuthModalOpen(false);
    return res.user;
  };

  const signup = async (data: {
    name: string;
    branch: string;
    regdNo: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const res = await signupUser(data);
    if (!res.user) {
      throw new Error(res.message || "Registration failed.");
    }
    setUser(res.user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
    } catch {}
    setIsAuthModalOpen(false);
    return res.user;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    setIsMyUploadsOpen(false);
  };

  const sendOTP = async (identifier: string): Promise<OTPResponse> => {
    return await sendResetOTP(identifier);
  };

  const verifyOTP = async (
    identifier: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    return await verifyResetOTP(identifier, otp);
  };

  const resetPassword = async (
    identifier: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return await apiResetPassword(identifier, otp, newPassword);
  };

  const openAuthModal = (mode: "login" | "signup" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openMyUploads = () => {
    setIsMyUploadsOpen(true);
  };

  const closeMyUploads = () => {
    setIsMyUploadsOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        login,
        signup,
        logout,
        sendOTP,
        verifyOTP,
        resetPassword,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isMyUploadsOpen,
        openMyUploads,
        closeMyUploads,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
