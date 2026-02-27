import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Key, MessageCircle, CheckCircle, X, Loader2 } from 'lucide-react';

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
      // Call the Google Apps Script endpoint
      const response = await fetch(`https://script.google.com/macros/s/AKfycbwu93DNeKqcO_JYt-qGPi-E6UW7hNoRT7LRdg6_UuAyxNEkQYuYFmXVo55yy68q-GfF9A/exec?code=${encodeURIComponent(code)}`);
      
      // We expect the script to return JSON like { "valid": true } or { "status": "success" }
      const data = await response.json();

      if (data.valid || data.success || data.status === 'success') {
        onSuccess();
      } else {
        setError('Invalid or already used code. Please try again.');
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
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Lock size={32} />
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Unlock Premium Export</h2>
              <p className="text-zinc-600">Get unlimited PDF exports and premium features for 6 months.</p>
              
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-4xl font-black text-zinc-900">25 EGP</span>
                <span className="text-lg text-zinc-400 line-through font-medium">99 EGP</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-zinc-700">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>Unlimited PDF exports</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-700">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>All premium templates</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-700">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>Valid for 6 months</span>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Enter your activation code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={18} className="text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. HASH-1234-ABCD"
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow uppercase"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-rose-500 font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Unlock Now'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
              <p className="text-sm text-zinc-500 mb-3">Don't have a code?</p>
              <a 
                href="https://wa.me/201101007965?text=I%20want%20to%20buy%20a%20Hash%20Resume%20code" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors"
              >
                <MessageCircle size={18} />
                Get Code via WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
