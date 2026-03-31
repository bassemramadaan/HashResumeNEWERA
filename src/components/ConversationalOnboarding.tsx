import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export default function ConversationalOnboarding({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ field: "", experience: "" });

  const steps = [
    {
      question: "What is your professional field?",
      options: [
        "Software Engineering",
        "Marketing",
        "Design",
        "Finance",
        "Other",
      ],
      key: "field",
    },
    {
      question: "What is your experience level?",
      options: ["Entry Level", "Mid Level", "Senior", "Executive"],
      key: "experience",
    },
  ];

  const handleOptionSelect = (option: string) => {
    setData({ ...data, [steps[step].key]: option });
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Onboarding complete:", data, option);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <Bot size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">
              Resume Assistant
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-slate-500 font-medium">
                Step {step + 1} of {steps.length}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="text-lg text-slate-600 mb-6">
              {steps[step].question}
            </p>
            <div className="grid gap-4">
              {steps[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className="text-start p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 :bg-emerald-900/20 border border-slate-200 hover:border-emerald-500 :border-emerald-500 transition-all font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
