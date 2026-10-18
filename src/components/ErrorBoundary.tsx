import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[60vh] flex items-center justify-center p-6 bg-[#FAF9F6] font-share">
          <div className="max-w-md w-full bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000] text-center">
            <div className="w-14 h-14 bg-red-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-7 h-7 text-red-600 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold font-momo text-black mb-2">
              Something went wrong loading this view
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              {this.props.fallbackMessage ||
                "A temporary rendering error occurred. Please try reloading the page or head back to the question paper repository."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <Link
                to="/browse"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 text-black font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-amber-200 transition-all"
              >
                <Home className="w-4 h-4" />
                Browse Papers
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
