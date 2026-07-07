import fs from "fs";

const file = "src/pages/EditorPage.tsx";
let code = fs.readFileSync(file, "utf8");

// 1. Add LockedOverlay
const overlayCode = `
const LockedOverlay = ({ lang }: { lang: string }) => {
  const isAr = lang === "ar";
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/70">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto text-brand-500 mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h3 className="font-black text-xl text-slate-800">
          {isAr ? "السيرة الذاتية مقفلة" : "Resume Locked"}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {isAr 
            ? "لقد قمت بتحميل النسخة النهائية. لا يمكنك تعديل هذه النسخة مجدداً."
            : "You have downloaded the final version. You cannot edit this version again."}
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-2">
          <p className="text-xs text-amber-800 font-bold leading-relaxed mb-3">
            {isAr
              ? "إذا كنت ترغب في إجراء تعديل بسيط، يمكنك التواصل معنا عبر الواتساب."
              : "If you need to make a simple edit, you can contact us via WhatsApp."}
          </p>
          <a
            href="https://wa.me/201101007965?text=Hello,%20I%20need%20a%20quick%20edit%20to%20my%20Hash%20Resume."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-white transition-all active:scale-[0.98] shadow-md shadow-emerald-500/10 cursor-pointer"
            style={{ backgroundColor: '#128C7E' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            {isAr ? "طلب تعديل عبر الواتساب" : "Request Edit via WhatsApp"}
          </a>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace("export default function EditorPage() {", overlayCode + "\nexport default function EditorPage() {");

// 2. Inject LockedOverlay inside the form container (Mobile)
code = code.replace(
  /<main ref=\{formRef\} onScroll=\{handleFormScroll\} className="w-full h-full overflow-y-auto pb-6 relative scrollbar-none editor-form-scrollable">/g,
  `<main ref={formRef} onScroll={handleFormScroll} className="w-full h-full overflow-y-auto pb-6 relative scrollbar-none editor-form-scrollable">\n            {data.isLocked && <LockedOverlay lang={language} />}`
);

// 3. Inject LockedOverlay inside the form container (Desktop)
code = code.replace(
  /<div ref=\{formRef\} onScroll=\{handleFormScroll\} className="flex-1 overflow-y-auto scrollbar-none relative editor-form-scrollable">/g,
  `<div ref={formRef} onScroll={handleFormScroll} className="flex-1 overflow-y-auto scrollbar-none relative editor-form-scrollable">\n              {data.isLocked && <LockedOverlay lang={language} />}`
);

fs.writeFileSync(file, code);
