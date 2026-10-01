import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Accordion({
  items = [],
  allowMultiple = false,
  className = ''
}) {
  const [openIndexes, setOpenIndexes] = useState([0]);

  const toggleIndex = (index) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div
            key={index}
            className="border border-[#E6DEF8] rounded-2xl bg-[#FFFDFB] overflow-hidden transition-all shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleIndex(index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-[#FDE8F0]/30 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-serif font-semibold text-base sm:text-lg text-[#4A3B5C]">
                {item.question || item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="w-7 h-7 rounded-full bg-[#F5F0FC] text-[#8F7BD1] flex items-center justify-center shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-[#6B5B7D] leading-relaxed border-t border-[#F5EDF8]">
                    {item.answer || item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
