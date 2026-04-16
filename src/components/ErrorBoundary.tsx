import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      let errorMessage = "We're sorry, but an unexpected error occurred. Please try refreshing the page.";
      let isFirestoreError = false;

      try {
        if (this.state.error) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            if (parsed.error.includes("permission-denied") || parsed.error.includes("insufficient permissions")) {
              errorMessage = "You don't have permission to perform this action. Please make sure you are signed in with the correct account.";
            } else {
              errorMessage = `A database error occurred: ${parsed.error}`;
            }
          }
        }
      } catch {
        // Not a JSON error message, use default
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 transition-colors">
          <div className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200 max-w-md w-full text-center transition-colors">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isFirestoreError ? "Database Error" : "Something went wrong"}
            </h2>
            <p className="text-slate-600 mb-6">
              {errorMessage}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-slate-100 text-slate-700 px-6 py-2 rounded-full font-medium hover:bg-slate-200 transition-colors"
              >
                Go Home
              </button>
            </div>
            {(import.meta.env.DEV || isFirestoreError) && this.state.error && (
              <div className="mt-8 text-start bg-slate-100 p-4 rounded-lg overflow-auto max-h-48 text-xs font-mono text-slate-700">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
