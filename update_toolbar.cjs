const fs = require('fs');

let code = fs.readFileSync('src/pages/EditorPage.tsx', 'utf8');

// 1. We find the `<div className="h-14 bg-white/95 backdrop-blur-sm border-b border-neutral-200/80 ..."`
// which is the header of the right panel, and we modify it.
const toolbarSearch = /<div className="h-14 bg-white\/95 backdrop-blur-sm border-b border-neutral-200\/80 flex items-center justify-between px-4 sm:px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200 transform-gpu shadow-xs">([\s\S]*?)<\/div>\s*<div className="flex-1 overflow-x-hidden/m;

// We will replace this entire header with our new toolbar + ATS toggle combined.
code = code.replace(toolbarSearch, `<div className="h-14 bg-white/95 backdrop-blur-sm border-b border-neutral-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200 transform-gpu shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LayoutTemplate size={14} />
                  <span>{language === "ar" ? "القالب" : "Template"}</span>
                </button>
                <button
                  onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Globe size={14} />
                  <span>{language === "ar" ? "EN" : "عربي"}</span>
                </button>
                <button
                  onClick={() => setMobileZoom(prev => Math.min(prev + 0.1, 1.5))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ZoomIn size={14} />
                  <span className="hidden sm:inline">Zoom</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRightPanelMode(rightPanelMode === "preview" ? "ats" : "preview")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer relative",
                    rightPanelMode === "ats"
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Sparkles size={13} className={cn(rightPanelMode === "ats" ? "text-brand-600" : "text-slate-400")} />
                  <span>{language === "ar" ? "فاحص ATS" : "ATS Checker"}</span>
                </button>
                <button
                  onClick={handleExportClick}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Download size={14} />
                  <span>{language === "ar" ? "تصدير" : "Export"}</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-x-hidden`);

fs.writeFileSync('src/pages/EditorPage.tsx', code, 'utf8');
console.log('done');
