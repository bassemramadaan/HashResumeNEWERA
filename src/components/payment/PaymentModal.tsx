import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, MessageCircle, ShieldCheck, Loader2, Crown, CreditCard, Lock } from "lucide-react";
import SarIcon from "./SarIcon";
import AedIcon from "./AedIcon";
import { useLanguageStore } from "../../store/useLanguageStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const currencies = {
  EGP: { symbol: "EGP", price: 49 },
  SAR: {
    symbol: <SarIcon className="w-[1em] h-[1em] inline-block shrink-0" />,
    price: 2,
  },
  AED: {
    symbol: <AedIcon className="w-[1em] h-[1em] inline-block shrink-0" />,
    price: 2,
  },
  EUR: { symbol: "€", price: 1 },
  USD: { symbol: "$", price: 1 },
};

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState<keyof typeof currencies>("EGP");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
  const [plan, setPlan] = useState<"single" | "bundle">("single");

  useEffect(() => {
    if (isOpen && !exchangeRates) {
      fetch("https://open.er-api.com/v6/latest/EGP")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.rates) {
            setExchangeRates({
              EGP: 1,
              SAR: data.rates.SAR,
              AED: data.rates.AED,
              EUR: data.rates.EUR,
              USD: data.rates.USD,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch exchange rates", err));
    }
  }, [isOpen, exchangeRates]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError("Please enter a code.");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const url = `https://script.google.com/macros/s/AKfycbxzY_w_K7mzU-AYqds3vvLARGwAQjvbWi88v0c8U0FXKE8KfFQ4XxlhZc3ExkRM8XLMVg/exec?code=${encodeURIComponent(code)}&t=${Date.now()}`;
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success === true) {
        onSuccess();
      } else {
        setError(result.message || "Invalid or used code.");
      }
    } catch (e) {
      console.error("Verification error:", e);
      setError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const getDynamicPrice = (curr: keyof typeof currencies) => {
    const isBundle = plan === "bundle";
    const baseEgp = 49;
    const bundleEgp = 79;
    const targetEgp = isBundle ? bundleEgp : baseEgp;

    if (curr === "EGP" || !exchangeRates) {
        if(curr === "EGP") return targetEgp;
        return isBundle ? Math.ceil(currencies[curr].price * 1.6) : currencies[curr].price; // rough fallback without rates
    }
    
    const rate = exchangeRates[curr];
    return Math.ceil(targetEgp * rate);
  };

  const selected = currencies[currency];
  const dynamicPrice = getDynamicPrice(currency);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden tracking-tight flex flex-col md:flex-row"
        >
          {/* LEFT PANEL: Value Prop */}
          <div className="bg-slate-900 text-white p-8 lg:p-10 md:w-5/12 flex flex-col relative overflow-hidden hidden md:flex">
             {/* Background glow */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
             
             <div className="relative z-10 flex-1 flex flex-col justify-center space-y-8">
               <div>
                 <div className="w-16 h-16 bg-gradient-to-b from-[#ff4d2d] to-orange-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(255,77,45,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] mb-6">
                   <Crown className="text-white drop-shadow-sm" size={32} />
                 </div>
                 
                 <h2 className="text-3xl lg:text-4xl font-black mb-3 text-white font-display tracking-tight leading-tight">
                   {isAr ? "ادفع فقط عند التحميل" : "Pay only when you download"}
                 </h2>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   {isAr ? "جرب كل الأدوات مجاناً. ادفع فقط عندما تكون مستعداً للتحميل بنسبة 100%." : "Try everything for free. Only pay when you're 100% ready."}
                 </p>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/10">
                 {[
                   isAr ? "يصلك ملف PDF + Word" : "PDF + Word included",
                   isAr ? "بدون علامة مائية" : "No watermark",
                   isAr ? "تعديلات غير محدودة قبل الدفع" : "Unlimited edits before payment",
                   isAr ? "دفع لمرة واحدة.. لا اشتراكات" : "One-time payment.. No subscriptions"
                 ].map((feature, i) => (
                   <div key={i} className="flex items-start gap-4">
                     <div className="mt-0.5 bg-emerald-500/20 rounded-full p-1 shrink-0">
                       <Check className="text-emerald-400" size={14} strokeWidth={3} />
                     </div>
                     <span className="text-sm font-medium text-slate-300">{feature}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="mt-10 relative z-10 flex items-center gap-3 text-xs text-slate-500 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
               <ShieldCheck size={20} className="shrink-0 text-emerald-500" />
               <span className="leading-tight">Secured by Stripe (Coming Soon) & WhatsApp End-to-End Encryption. We do not store payment details.</span>
             </div>
          </div>

          {/* RIGHT PANEL: Payment/Action */}
          <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col relative w-full bg-slate-50/50">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Mobile Title */}
            <div className="md:hidden mb-6 mt-4">
               <div className="w-12 h-12 bg-gradient-to-b from-[#ff4d2d] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                 <Crown className="text-white drop-shadow-sm" size={24} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Elite Export</h2>
               <p className="text-sm text-slate-500 mt-1">Unlock your ATS-ready resume.</p>
            </div>

            {/* Plan Selection */}
            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => setPlan("single")}
                className={`flex-1 p-4 rounded-2xl border-2 text-start transition-all ${plan === "single" ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-900">{isAr ? "سيرة ذاتية فقط" : "Resume Only"}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === "single" ? 'border-indigo-500' : 'border-slate-300'}`}>
                    {plan === "single" && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                  </div>
                </div>
                <span className="text-xs text-slate-500">{isAr ? "احصل على ملف PDF جاهز للـ ATS" : "Get your ATS-ready PDF"}</span>
              </button>
              
              <button 
                onClick={() => setPlan("bundle")}
                className={`flex-1 p-4 rounded-2xl border-2 text-start transition-all ${plan === "bundle" ? 'border-indigo-500 bg-indigo-50/50 relative overflow-hidden' : 'border-slate-100 hover:border-slate-200'}`}
              >
                {plan === "bundle" && <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-500 pointer-events-none"><Crown size={48} /></div>}
                <div className="flex justify-between items-start mb-1 relative z-10">
                  <span className="font-bold text-slate-900">{isAr ? "باقة التوفير" : "Bundle pack"}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === "bundle" ? 'border-indigo-500' : 'border-slate-300'}`}>
                    {plan === "bundle" && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                  </div>
                </div>
                <span className="text-xs text-slate-500 relative z-10">{isAr ? "سيرة ذاتية + خطاب تعيين (+30 ج.م)" : "Resume + Cover Letter (+30 EGP)"}</span>
              </button>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-3xl p-6 border border-indigo-100/50 mb-8 relative overflow-hidden shadow-sm">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-500 pointer-events-none">
                 <CreditCard size={80} />
               </div>
               <div className="relative z-10">
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                   <div>
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{isAr ? "إجمالي السعر" : "Total Price"}</h3>
                     <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/50 text-[10px] font-bold text-slate-600 uppercase shadow-sm">
                        <Lock size={12} className="text-indigo-500" /> {isAr ? "دفع لمرة واحدة فقط" : "One-time payment"}
                     </div>
                   </div>
                   
                   <div className="text-4xl sm:text-3xl font-black text-indigo-600 flex items-center justify-start gap-1 tracking-tight">
                    {currency === "EGP" || currency === "SAR" || currency === "AED" ? (
                      <span>{dynamicPrice} <span className="text-xl sm:text-base opacity-80">{selected.symbol}</span></span>
                    ) : (
                      <span><span className="text-xl sm:text-base opacity-80">{selected.symbol}</span>{dynamicPrice}</span>
                    )}
                   </div>
                 </div>

                 <div className="flex flex-wrap gap-1 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50">
                   {Object.keys(currencies).map((c) => (
                     <button
                       key={c}
                       onClick={() => setCurrency(c as keyof typeof currencies)}
                       className={`flex-1 min-w-[3rem] px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                         currency === c 
                           ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100" 
                           : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                       }`}
                     >
                       {c}
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            <div className="flex-1 flex flex-col space-y-8 pb-4">
              {/* WhatsApp Option */}
              <div>
                 <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">1</span>
                   Get your unlock code
                 </h4>
                 <a
                    href={`https://wa.me/201101007965?text=I%20want%20to%20buy%20${plan === "bundle" ? 'the%20Resume%20+%20Cover%20Letter%20Bundle' : 'a%20Resume%20Code'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-sm shadow-[0_8px_16px_-6px_rgba(37,211,102,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] group hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                    Buy Code via WhatsApp
                  </a>
              </div>

              {/* Code Input */}
              <div className="relative pt-2">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200"></div>
                 </div>
                 <div className="relative flex justify-center text-xs">
                   <span className="bg-slate-50 px-4 py-1 text-slate-400 font-bold uppercase tracking-widest rounded-full border border-slate-200 bg-white">Wait for code</span>
                 </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                   Unlock download
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code (e.g. HASH-A1B2)"
                    className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 bg-white/50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all font-mono uppercase tracking-wider shadow-sm"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !code.trim()}
                    className="px-8 py-3.5 bg-gradient-to-b from-[#ff4d2d] to-orange-600 hover:from-orange-500 hover:to-[#e63e1d] disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shrink-0 shadow-[0_8px_16px_-6px_rgba(255,77,45,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 disabled:shadow-none disabled:transform-none"
                  >
                    {verifying ? <Loader2 size={18} className="animate-spin" /> : (
                      <>
                        <Lock size={16} /> Unlock
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-3 flex items-center gap-1.5 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100"
                  >
                    <X size={14} className="rounded-full bg-red-100 p-0.5 shrink-0" />{error}
                  </motion.p>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

