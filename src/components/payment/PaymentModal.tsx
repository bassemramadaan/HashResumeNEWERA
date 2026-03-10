import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Check, Ticket } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) { setError('Please enter a code.'); return; }
    setVerifying(true);
    setError('');
    try {
      const url = `https://script.google.com/macros/s/AKfycbwM0LeQLtMxG7NohWc46lj6ITfRaaE-rl1JSYMjndnNX6xcGMHYmZS0MRBWf7gv10eymw/exec?code=${encodeURIComponent(code)}&t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success === true) {
        onSuccess();
      } else {
        setError(result.message || 'Invalid or used code.');
      }
    } catch (e) {
      console.error('Verification error:', e);
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

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

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CreditCard size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Unlock Premium</h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">25 EGP</span>
              <span className="text-xl text-slate-400 line-through">100 EGP</span>
            </div>
            
            <div className="mb-6">
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code from WhatsApp"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button 
              onClick={handleVerify}
              disabled={verifying || !code}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Verify & Download'}
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have a code? <button onClick={() => window.open('https://script.google.com/macros/s/AKfycbwM0LeQLtMxG7NohWc46lj6ITfRaaE-rl1JSYMjndnNX6xcGMHYmZS0MRBWf7gv10eymw/exec', '_blank')} className="text-indigo-500 hover:underline">Pay here</button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
