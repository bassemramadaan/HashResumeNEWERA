import React from "react";

export default function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-4 sm:p-6 bg-white border border-slate-200/80 rounded-2.5xl shadow-3xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-3 bg-slate-150 rounded-md w-2/3"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 rounded w-1/5"></div>
        <div className="h-28 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
      </div>
    </div>
  );
}

