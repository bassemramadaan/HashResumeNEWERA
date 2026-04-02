import React from "react";

export default function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      <div className="space-y-3">
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-20 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
}
