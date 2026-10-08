import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaxSeal from '../ui/WaxSeal.jsx';
import confetti from 'canvas-confetti';

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState('sealed'); // 'sealed' -> 'popping' -> 'opened' -> 'complete'
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // If user has seen intro this session, skip immediately
    const seen = sessionStorage.getItem('lavendershell_intro_seen');
    if (seen === 'true') {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => {
      setStage('popping');
      // Sparkle burst on wax pop
      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#B9A7E8', '#F8C8DC', '#FFF9F4', '#D4AF37'],
          disableForReducedMotion: true
        });
      } catch {
        // fallback
      }
    }, 1200);

    const t2 = setTimeout(() => {
      setStage('opened');
    }, 2000);

    const t3 = setTimeout(() => {
      finishIntro();
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const finishIntro = () => {
    sessionStorage.setItem('lavendershell_intro_seen', 'true');
    setStage('complete');
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    setSkipped(true);
    finishIntro();
  };

  if (skipped) return null;

  return (
    <AnimatePresence>
      {stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FFF9F4] via-[#FDE8F0] to-[#E6DEF8] overflow-hidden"
        >
          {/* Ambient gentle background sparkles */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#E6DEF8] blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F8C8DC] blur-3xl animate-pulse delay-700" />
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 z-20 px-4 py-1.5 text-xs font-medium rounded-full bg-white/70 backdrop-blur-md text-[#4A3B5C] border border-[#E6DEF8] hover:bg-white hover:shadow-sm transition-all"
          >
            Skip intro ✿
          </button>

          {/* Central Floating Envelope Animation */}
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-80 sm:w-96 h-56 sm:h-64 flex items-center justify-center"
          >
            {/* Letter Paper Sliding Out */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={stage === 'opened' ? { y: -75, opacity: 1 } : { y: 0, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-64 sm:w-76 h-44 bg-white rounded-2xl border border-[#E6DEF8] shadow-pastel p-4 flex flex-col items-center justify-center text-center z-10"
            >
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#4A3B5C]">
                Lavendershell
              </span>
              <span className="font-handwritten text-base text-[#F4A6C4] mt-1">
                A softer way to stay in touch
              </span>
              <div className="mt-2 text-[11px] text-[#8A7B9C] flex items-center gap-1.5 font-sans">
                <span>✦</span>
                <span>Welcome to our sanctuary</span>
                <span>✦</span>
              </div>
            </motion.div>

            {/* Envelope Body */}
            <div className="relative w-full h-full bg-[#FFFDFB] rounded-[24px] border-2 border-[#D4C6F4] shadow-pastel-lg overflow-hidden z-20 flex flex-col justify-end">
              {/* Envelope Pattern Inside */}
              <div className="absolute inset-0 bg-[#FAF5FE]" />

              {/* Diagonal Fold Lines SVG */}
              <svg viewBox="0 0 380 250" className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M0,0 L190,135 L380,0" fill="#FDE8F0" opacity="0.4" stroke="#D4C6F4" strokeWidth="1.5" />
                <path d="M0,250 L190,120 L380,250" fill="#FFFDFB" stroke="#D4C6F4" strokeWidth="1.5" />
                <path d="M0,0 L0,250 L150,140 Z" fill="#FBF7FE" opacity="0.7" />
                <path d="M380,0 L380,250 L230,140 Z" fill="#FBF7FE" opacity="0.7" />
              </svg>

              {/* Flap that opens */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={stage === 'opened' ? { rotateX: 180, y: -20, opacity: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute top-0 inset-x-0 h-32 z-30 pointer-events-none"
              >
                <svg viewBox="0 0 380 135" className="w-full h-full">
                  <path d="M0,0 L190,135 L380,0 Z" fill="#FFFDFB" stroke="#D4C6F4" strokeWidth="2" />
                </svg>
              </motion.div>

              {/* Wax Seal Center that pops */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.div
                  animate={stage === 'popping' || stage === 'opened' ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <WaxSeal size={56} motif="shell" color="#8F7BD1" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
