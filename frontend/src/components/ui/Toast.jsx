import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <Check className="w-4 h-4 text-[#8F7BD1]" />,
    error: <AlertCircle className="w-4 h-4 text-[#E74C3C]" />,
    info: <Sparkles className="w-4 h-4 text-[#F4A6C4]" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, rotate: 2 }}
          transition={{ type: "spring", damping: 20, stiffness: 280 }}
          className="pointer-events-auto relative max-w-sm bg-[#FFFDFB] border border-[#E6DEF8] p-4 rounded-xl shadow-[0_8px_20px_rgba(74,59,92,0.18)]"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF9F4 100%)'
          }}
        >
          {/* Pastel Washi Tape at top */}
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FDE8F0]/80 border-b border-white/60 shadow-sm rotate-1 select-none"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)'
            }}
          />

          <div className="flex items-center gap-3 pt-1">
            <div className="w-7 h-7 rounded-full bg-[#E6DEF8]/60 flex items-center justify-center shrink-0">
              {icons[toast.type] || icons.info}
            </div>
            <div className="flex-1 text-sm font-medium text-[#4A3B5C]">
              {toast.message}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-[#8A7B9C] hover:text-[#4A3B5C] text-xs px-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
