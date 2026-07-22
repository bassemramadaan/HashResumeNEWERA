const fs = require('fs');

let code = fs.readFileSync('src/pages/EditorPage.tsx', 'utf8');

// I want to replace everything from `            <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-2 sm:p-4 flex flex-col items-center bg-slate-50/60 scrollbar-none pb-12">`
// up to `      {/* Mobile ATS Info Panel Overlay */}`
const startString = `            <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-2 sm:p-4 flex flex-col items-center bg-slate-50/60 scrollbar-none pb-12">`;
const endString = `      {/* Mobile ATS Info Panel Overlay */}`;

const startIndex = code.indexOf(startString);
const endIndex = code.indexOf(endString);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `            <div className="flex-1 overflow-x-hidden overflow-y-auto pt-14 flex flex-col bg-slate-50/60 backdrop-blur-xs relative border-l border-slate-200/40 h-full">
              {rightPanelMode === "preview" ? (
                <div className="flex-1 p-4 md:p-12 flex flex-col items-center justify-start h-full">
                  <div
                    className="origin-top transition-all duration-500 flex justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.8] xl:scale-[0.9] h-[calc(297mm*0.4)] sm:h-[calc(297mm*0.6)] md:h-[calc(297mm*0.75)] lg:h-[calc(297mm*0.8)] xl:h-[calc(297mm*0.9)]"
                  >
                    <div className="bg-white shadow-md border border-slate-200 overflow-hidden shrink-0 w-[210mm] min-h-[297mm]">
                      <Suspense fallback={<FormLoader />}>
                        <ResumePreview ref={componentRef} />
                      </Suspense>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white h-full overflow-y-auto">
                  <JobMatchAdvisor language={language} />
                </div>
              )}
            </div>
          </div>
        </Panel>
        )}
      </PanelGroup>

      <AnimatePresence>
        {showFullPreview && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-neutral-950/90 backdrop-blur-md">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 shrink-0">
              <h2 className="text-white text-xl font-bold">{language === "ar" ? "معاينة كاملة" : "Full Preview"}</h2>
              <button
                onClick={() => setShowFullPreview(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors border border-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center">
              <div className="bg-white shadow-xl rounded-sm overflow-hidden shrink-0 mb-20 w-[210mm] min-h-[297mm] ring-1 ring-white/20">
                <Suspense fallback={<FormLoader />}>
                  <ResumePreview />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
`;
  code = code.substring(0, startIndex) + replacement + "\n" + code.substring(endIndex);
  fs.writeFileSync('src/pages/EditorPage.tsx', code, 'utf8');
  console.log('done');
} else {
  console.log('not found');
}
