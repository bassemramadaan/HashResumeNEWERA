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
    console.error("Uncaught error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      let errorMessage = "We're sorry, but an unexpected error occurred. Please try refreshing the page.";
      let errorTitle = "Something went wrong";
      let isAr = false;

      try {
        const stored = localStorage.getItem('language-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          const lang = parsed.state.language || 'en';
          isAr = lang === 'ar';
        }
      } catch {
        // use default
      }

      if (isAr) {
        errorTitle = "عذراً، حدث خطأ غير متوقع";
        errorMessage = "حدث خطأ أثناء تحميل الصفحة أو معالجة طلبك المعين. يرجى ضغط زر التحديث أو العودة للرئيسية.";
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 transition-colors">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center transition-colors">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {errorTitle}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              {errorMessage}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#001639] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#E64528] transition-colors cursor-pointer text-sm shadow-md hover:shadow-orange-500/10 active:scale-95 duration-150"
              >
                {isAr ? "إعادة تحميل الصفحة" : "Refresh Page"}
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors cursor-pointer text-sm active:scale-95 duration-150"
              >
                {isAr ? "الرئيسية" : "Go Home"}
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 text-start bg-slate-50 p-4 rounded-xl overflow-auto max-h-48 text-xs font-mono text-slate-500 border border-slate-150">
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
