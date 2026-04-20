import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Ticket, Wallet, CheckCircle2, ShieldCheck } from "lucide-react";
import SarIcon from "./SarIcon";
import AedIcon from "./AedIcon";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const currencies = {
  EGP: { symbol: "EGP", price: 25 },
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

  const selected = currencies[currency];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Wallet size={24} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Unlock Premium Export
            </h2>
            <p className="text-sm text-white0 mb-4">
              One-time fee for a single professional PDF export.
            </p>

            <div className="inline-block bg-red-50 text-red-500 text-xs font-bold px-4 py-2 rounded-full mb-2">
              Limited Time Offer
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-1">
              {currency === "EGP" ||
              currency === "SAR" ||
              currency === "AED" ? (
                <span>
                  {selected.price} {selected.symbol}
                </span>
              ) : (
                <span>
                  {selected.symbol}
                  {selected.price}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {Object.keys(currencies).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c as keyof typeof currencies)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${currency === c ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 "}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-6 text-left text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="text-emerald-500" size={18} />
                <span>Single professional PDF export</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="text-emerald-500" size={18} />
                <span>All premium templates</span>
              </div>
            </div>

            <div className="bg-slate-100 rounded-lg p-3 text-start mb-6">
               <p className="text-xs text-slate-500 font-semibold mb-2">Almost there! Complete payment to instantly get your ATS-ready resume.</p>
               <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                  <span>1. Enter Data</span>
                  <span>2. Preview</span>
                  <span className="text-[#ff4d2d]">3. Download</span>
               </div>
               <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ff4d2d] w-[95%] h-full rounded-full"></div>
               </div>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-500" />
                How to get your code
              </h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-600">
                    Click"Get Code via WhatsApp"below to message us.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-600">
                    Complete the payment and receive your unique activation code
                    instantly.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-slate-600">
                    Enter the code below to unlock your download.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 text-left">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter your activation code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="E.G. HASH-1234-ABCD"
                className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying || !code}
              className="w-full bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all mb-6 disabled:opacity-50 text-sm"
            >
              {verifying ? "Verifying..." : "Unlock Now"}
            </button>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  Don't have a code?
                </p>
                <a
                  href="https://wa.me/201101007965?text=I%20want%20to%20buy%20a%20resume%20download%20code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Ticket size={18} />
                  Get Code via WhatsApp
                </a>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-4 mt-2">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 Secured by Stripe & WhatsApp End-to-End Encryption
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
