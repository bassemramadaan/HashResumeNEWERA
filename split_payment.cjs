const fs = require('fs');
let code = fs.readFileSync('src/components/payment/PaymentModal.tsx', 'utf8');

if (!code.includes('const [step, setStep]')) {
  code = code.replace(
    'const [selectedPackage, setSelectedPackage] = useState<"single" | "bundle">("single");',
    'const [selectedPackage, setSelectedPackage] = useState<"single" | "bundle">("single");\n  const [step, setStep] = useState<1 | 2 | 3>(1);'
  );
  
  // replace fragments
  // Around line 498:
  //                 <>
  //                   {/* Top Header Block */}
  
  const stepParts = `
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                      {/* Top Header Block */}
                      <div className="flex flex-col items-center text-center mt-2 mb-5">
                        <div className="relative p-1.5 bg-white rounded-xl shadow-xs border border-slate-150/40 mb-3 text-slate-500">
                          <img src={LOGO_URL} alt="Hash Resume Logo" className="h-7 w-auto opacity-95" loading="lazy" />
                        </div>
                        
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">
                          {isAr ? "تحميل وترقية السيرة الذاتية" : "Upgrade to Premium Export"}
                        </h2>
                        <p className="text-slate-400 font-medium text-[11px] mt-1 px-4 leading-normal">
                          {isAr 
                            ? "تحميل غير محدود وبأعلى جودة واجتياز تلقائي لأنظمة الـ ATS" 
                            : "Pristine export status with automatic ATS system integration"}
                        </p>
                        
                        {/* Simplified, Calmer Package Switcher */}
                        <div className="mt-4 w-full bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60 max-w-sm shadow-inner shadow-slate-100/50">
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => { setSelectedPackage("single"); setError(""); }}
                              className={cn(
                                "py-2.5 rounded-xl border text-center flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 overflow-hidden",
                                selectedPackage === "single"
                                  ? "bg-white border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-slate-800 scale-[1.02] z-10"
                                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                              )}
                            >
                              <span className="text-[11px] font-bold">{isAr ? "كود تحميل واحد" : "Single Code"}</span>
                              <span className="text-sm font-black text-slate-800 mt-0.5">50 <span className="text-[9px] font-bold text-slate-500">{isAr ? "ج.م" : "EGP"}</span></span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => { setSelectedPackage("bundle"); setError(""); }}
                              className={cn(
                                "py-2.5 rounded-xl border text-center flex flex-col items-center justify-center relative cursor-pointer overflow-hidden transition-all duration-300",
                                selectedPackage === "bundle"
                                  ? "bg-gradient-to-b from-white to-orange-50/30 border-orange-200 shadow-[0_4px_12px_rgba(255,77,45,0.08)] text-slate-800 scale-[1.02] z-10"
                                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                              )}
                            >
                              <div className={cn(
                                "absolute top-0 right-0 font-black text-[7px] px-2 py-0.5 rounded-bl-lg transition-colors",
                                selectedPackage === "bundle" ? "bg-gradient-to-r from-rose-500 to-[#FF4D2D] text-white" : "bg-slate-200 text-slate-500"
                              )}>
                                {isAr ? "توفير ٦٠٪" : "SAVE 60%"}
                              </div>
                              <span className="text-[11px] font-bold">{isAr ? "باقة ٣ أكواد" : "3-Codes Bundle"}</span>
                              <span className="text-sm font-black text-[#FF4D2D] mt-0.5">120 <span className="text-[9px] font-bold opacity-70">{isAr ? "ج.م" : "EGP"}</span></span>
                            </button>
                          </div>
                        </div>

                        {/* Visual Voucher Representation */}
                        <div className="mt-4 w-full">
                          <VoucherTicket
                            language={language}
                            type={selectedPackage}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-black text-xs text-white uppercase tracking-wider bg-gradient-to-r from-orange-500 to-[#FF4D2D] hover:from-orange-600 hover:to-[#E64528] active:scale-[0.98] transition-all shadow-md shadow-orange-500/20 cursor-pointer mb-2"
                      >
                        {isAr ? "متابعة للدفع" : "Continue to Payment"} &rarr;
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && !pendingRef && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                      {/* Step Header */}
                      <div className="flex items-center gap-3 mb-4 text-[#FF4D2D]">
                        <button onClick={() => setStep(1)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                          <ArrowLeft size={18} />
                        </button>
                        <h3 className="text-sm font-black text-slate-800">{isAr ? "اختر طريقة الدفع" : "Choose Payment Method"}</h3>
                      </div>
                      
                      {/* Redesigned Payment Method Tabs (Extremely Cohesive & Simplified) */}
                      <div className="grid grid-cols-3 gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 mb-6">
                        {[
                          { id: "instapay", label: isAr ? "انستاباي" : "InstaPay", icon: Zap },
                          { id: "vodafone", label: isAr ? "فودافون كاش" : "Vodafone", icon: Smartphone },
                          { id: "code", label: isAr ? "كود تفعيل" : "Verification Code", icon: CreditCard },
                        ].map((item) => {
                          const Icon = item.icon;
                          const isSelected = selectedMethod === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => { setSelectedMethod(item.id as PaymentMethod); setError(""); }}
                              className={cn(
                                "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer relative",
                                isSelected 
                                  ? "bg-white text-slate-800 shadow-xs border border-slate-200/40" 
                                  : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              <Icon size={14} className={cn("mb-1 transition-transform duration-200", isSelected ? "text-[#FF4D2D] scale-105" : "text-slate-400")} />
                              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight leading-none animate-fade-in">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Dynamic Content Panels */}
`;

  let step2Footer = `
                      {selectedMethod !== "code" && (
                        <button
                          onClick={() => setStep(3)}
                          className="w-full h-12 mt-4 flex items-center justify-center gap-2 rounded-xl font-black text-xs text-slate-800 uppercase tracking-wider bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          {isAr ? "لقد قمت بالتحويل بنجاح" : "I have transferred the money"}
                        </button>
                      )}
                    </motion.div>
                  )}

                  {((step === 3 && selectedMethod !== "code") || pendingRef) && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                      {/* Step Header */}
                      {!pendingRef && (
                        <div className="flex items-center gap-3 mb-4 text-[#FF4D2D]">
                          <button onClick={() => setStep(2)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                            <ArrowLeft size={18} />
                          </button>
                          <h3 className="text-sm font-black text-slate-800">{isAr ? "تأكيد المعاملة" : "Confirm Transaction"}</h3>
                        </div>
                      )}
                      
                      <div className="relative">
                        {pendingRef ? (
`;

  // Start replacing
  code = code.replace(
    'import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw, Sparkles, AlertCircle, Share2 } from "lucide-react";',
    'import { X, MessageCircle, Loader2, Lock, CheckCircle2, CreditCard, Smartphone, ShieldCheck, Zap, Copy, Check, RefreshCw, Sparkles, AlertCircle, Share2, ArrowLeft } from "lucide-react";'
  );

  // Replace from <div className="flex flex-col items-center text-center mt-2 mb-5">
  // up to <div className="relative"> (before {pendingRef ?)
  
  const topBlockStart = code.indexOf('{/* Top Header Block */}');
  const dynamicContentStart = code.indexOf('{/* Dynamic Content Panels */}');
  const pendingRefStart = code.indexOf('{pendingRef ? (', dynamicContentStart);

  if (topBlockStart !== -1 && pendingRefStart !== -1) {
    code = code.substring(0, topBlockStart) + stepParts + code.substring(pendingRefStart);
  }

  // Now replace the end of Step 2 (before the form details for step 3)
  // Step 2 Form details
  const step2FormStart = code.indexOf('{/* Step 2 Form details */}');
  const submissionButtonStart = code.indexOf('{/* Submission Button */}');
  
  if (step2FormStart !== -1) {
    code = code.substring(0, step2FormStart) + step2Footer + '\n' + code.substring(step2FormStart).replace('{/* Step 2 Form details */}', '{/* Step 3 Form details */}');
  }

  // Now fix the code panel closing tags etc. if needed.
  // We'll write to a new file and then run vite build. If it fails, I'll fix manually.
  fs.writeFileSync('src/components/payment/PaymentModal.tsx', code);
}
