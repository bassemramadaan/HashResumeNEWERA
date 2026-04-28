import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Ticket, ShieldCheck, Loader2, Zap } from "lucide-react";
import SarIcon from "./SarIcon";
import AedIcon from "./AedIcon";

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
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState<keyof typeof currencies>("EGP");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);

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
    const defaultPrice = currencies[curr].price;
    if (curr === "EGP" || !exchangeRates) return defaultPrice;
    
    // Base price is 49 EGP
    const priceInEGP = 49;
    const rate = exchangeRates[curr];
    return Math.ceil(priceInEGP * rate);
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
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden tracking-tight flex flex-col md:flex-row"
        >
          {/* LEFT PANEL: Value Prop */}
          <div className="bg-slate-900 text-white p-8 md:w-5/12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
             {/* Background glow */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl"></div>
             
             <div className="relative z-10 space-y-6">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Zap className="text-yellow-400" size={24} fill="currentColor" />
               </div>
               
               <div>
                  <h2 className="text-2xl font-black mb-2 text-white font-display">Premium Export</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You're one step away from downloading your professional, ATS-optimized resume.
                  </p>
               </div>

               <div className="space-y-4">
                 {[
                   "Lifetime access to your data",
                   "One-time payment",
                   "ATS-optimized PDF format",
                   "All premium templates unlocked"
                 ].map((feature, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <div className="mt-0.5 bg-emerald-500/20 rounded-full p-1 shrink-0">
                       <Check className="text-emerald-400" size={12} strokeWidth={3} />
                     </div>
                     <span className="text-sm font-medium text-slate-300">{feature}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="mt-8 relative z-10 flex items-start gap-2 text-xs text-slate-500">
               <ShieldCheck size={16} className="shrink-0 mt-0.5" />
               <span>Secured by Stripe & WhatsApp End-to-End Encryption</span>
             </div>
          </div>

          {/* RIGHT PANEL: Payment/Action */}
          <div className="p-6 md:p-8 md:w-7/12 flex flex-col relative w-full">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Mobile Title (hidden on desktop since left panel has it) */}
            <div className="md:hidden mb-6">
               <h2 className="text-xl font-black text-slate-900 font-display">Premium Export</h2>
               <p className="text-sm text-slate-500 mt-1">Unlock your ATS-ready resume.</p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-8 relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">Total Price</h3>
                   <p className="text-xs text-slate-500 font-medium">One-time payment</p>
                 </div>
                 
                 <div className="text-2xl font-black text-slate-900 flex items-center justify-start gap-1 tracking-tight">
                  {currency === "EGP" || currency === "SAR" || currency === "AED" ? (
                    <span>{dynamicPrice} {selected.symbol}</span>
                  ) : (
                    <span>{selected.symbol}{dynamicPrice}</span>
                  )}
                 </div>
               </div>

               <div className="flex flex-wrap gap-2">
                 {Object.keys(currencies).map((c) => (
                   <button
                     key={c}
                     onClick={() => setCurrency(c as keyof typeof currencies)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                       currency === c 
                         ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
                         : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                     }`}
                   >
                     {c}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex-1 flex flex-col space-y-8">
              {/* WhatsApp Option */}
              <div>
                 <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                   1. Get your code
                 </h4>
                 <a
                    href="https://wa.me/201101007965?text=I%20want%20to%20buy%20a%20resume%20download%20code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#25D366]/20 group"
                  >
                    <Ticket size={18} className="group-hover:scale-110 transition-transform" />
                    Buy Code via WhatsApp
                  </a>
              </div>

              {/* Code Input */}
              <div className="relative">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200"></div>
                 </div>
                 <div className="relative flex justify-center text-xs">
                   <span className="bg-white px-3 text-slate-400 font-medium">Wait for code, then</span>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  2. Unlock download
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code (e.g. HASH-A1B2)"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all font-mono uppercase tracking-wider"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !code.trim()}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shrink-0"
                  >
                    {verifying ? <Loader2 size={16} className="animate-spin" /> : "Unlock"}
                  </button>
                </div>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-3 flex items-center gap-1.5 font-medium"
                  >
                    <X size={14} className="rounded-full bg-red-100 p-0.5" />{error}
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
