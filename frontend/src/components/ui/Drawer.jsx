import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  side = 'right',
  width = 'max-w-md',
  className = ''
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    closed: {
      x: side === 'right' ? '100%' : '-100%',
      opacity: 0.5
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2C2138]/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className={`fixed inset-y-0 ${side === 'right' ? 'right-0' : 'left-0'} flex max-w-full pl-10`}>
            <motion.div
              variants={slideVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`w-screen ${width} bg-[#FFFDFB] shadow-2xl flex flex-col h-full border-l border-[#E6DEF8] ${className}`}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#F0E5F5] flex items-center justify-between bg-gradient-to-r from-[#FFFDFB] to-[#FDE8F0]/40">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#4A3B5C] flex items-center gap-2">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-[#8A7B9C] mt-0.5">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F5F0FC] text-[#4A3B5C] hover:bg-[#E6DEF8] flex items-center justify-center transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
