import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if device supports fine hover pointer
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    if (!mediaQuery.matches || motionQuery.matches) {
      return;
    }

    document.body.classList.add('has-custom-cursor');

    let counter = 0;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if target or parent is clickable
      const target = e.target;
      const clickable = target.closest('a, button, input, select, textarea, [role="button"]');
      setIsPointer(!!clickable);

      // Spawn subtle sparkles every 4 moves
      counter++;
      if (counter % 3 === 0) {
        const id = Date.now() + Math.random();
        const offsetX = (Math.random() - 0.5) * 16;
        const offsetY = (Math.random() - 0.5) * 16;
        setSparkles(prev => [
          ...prev.slice(-10),
          { id, x: e.clientX + offsetX, y: e.clientY + offsetY }
        ]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id));
        }, 600);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (prefersReducedMotion || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center mix-blend-multiply"
        style={{
          width: isPointer ? 34 : 20,
          height: isPointer ? 34 : 20,
          x: position.x - (isPointer ? 17 : 10),
          y: position.y - (isPointer ? 17 : 10),
          backgroundColor: isPointer ? 'rgba(248, 200, 220, 0.55)' : 'rgba(185, 167, 232, 0.75)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 0 12px rgba(185, 167, 232, 0.5)',
          transition: 'width 0.18s ease-out, height 0.18s ease-out, background-color 0.2s ease-out'
        }}
      >
        {isPointer && (
          <span className="text-[10px] select-none">✿</span>
        )}
      </motion.div>

      {/* Sparkle Trail */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0.9, scale: 0.6, x: sparkle.x, y: sparkle.y }}
            animate={{ opacity: 0, scale: 1.2, y: sparkle.y - 12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="fixed top-0 left-0 text-[11px] text-[#B9A7E8] font-bold select-none"
            style={{ x: sparkle.x, y: sparkle.y }}
          >
            ✦
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
