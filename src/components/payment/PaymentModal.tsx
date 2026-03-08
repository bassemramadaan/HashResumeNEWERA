import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Banknote, Key, MessageCircle, CheckCircle, X, Loader2, DollarSign, Euro } from 'lucide-react';
import { SaudiRiyalIcon } from '../icons/SaudiRiyalIcon';
import { EmiratesDirhamIcon } from '../icons/EmiratesDirhamIcon';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the backend endpoint
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Invalid or already used code. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Connection error. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Banknote size={32} />
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Unlock Premium Export</h2>
              <p className="text-slate-600 dark:text-slate-400">One-time fee for unlimited PDF exports and premium features.</p>
              
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full mb-2">75% OFF Limited Time Offer</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">25 EGP</span>
                    <span className="text-xl text-slate-400 dark:text-slate-500 line-through font-medium decoration-2">99 EGP</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center mb-3 uppercase tracking-wider">Also Available In</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <SaudiRiyalIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">SAR</span>
                      </div>
                      <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">2.00</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <EmiratesDirhamIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">AED</span>
                      </div>
                      <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">2.00</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">USD</span>
                      </div>
                      <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">1.00</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">EUR</span>
                      </div>
                      <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">1.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>Unlimited PDF exports</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>All premium templates</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>Valid for 6 months</span>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enter your activation code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={18} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. HASH-1234-ABCD"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow uppercase"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-rose-500 font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:text-slate-500 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Unlock Now'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Don't have a code?</p>
              <a 
                href="https://wa.me/201101007965?text=I%20want%20to%20buy%20a%20Hash%20Resume%20code" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 px-6 py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageCircle size={24} />
                Get Code via WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
