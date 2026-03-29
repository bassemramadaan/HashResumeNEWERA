import React from 'react';

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Navbar Skeleton */}
      <div className="sticky top-6 left-0 right-0 flex justify-center z-50 px-4 mb-8">
        <div className="w-full max-w-3xl h-16 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse flex items-center px-6 gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <div className="flex-1 flex gap-4">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-full hidden sm:block"></div>
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-full hidden md:block"></div>
          </div>
          <div className="w-24 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-12 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            <div className="h-12 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse delay-75"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse delay-100"></div>
            <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse delay-150"></div>
            <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse delay-200"></div>
          </div>
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse delay-300"></div>
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="w-full h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}
