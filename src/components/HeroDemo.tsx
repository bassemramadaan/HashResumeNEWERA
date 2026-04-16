import React from "react";

export default function HeroDemo() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12 bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 p-4 flex gap-2 border-b border-slate-200">
        <div className="w-4 h-4 rounded-full bg-rose-400"></div>
        <div className="w-4 h-4 rounded-full bg-amber-400"></div>
        <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
      </div>
      <div className="p-8 h-80 flex items-center justify-center">
        {/* Placeholder for GIF/Demo */}
        <div className="text-center text-white0">
          <p className="font-bold text-2xl mb-2">Interactive Demo</p>
          <p>Resume building in seconds</p>
        </div>
      </div>
    </div>
  );
}
