import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({
  children,
  className = '',
  itemClassName = '',
  gap = 24,
  showArrows = true
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    const amount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Scrollable Container with touch momentum and snap */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-1"
        style={{
          gap: `${gap}px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {/* Floating navigation buttons */}
      {showArrows && (
        <>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-white/95 text-[#4A3B5C] border border-[#E6DEF8] shadow-pastel flex items-center justify-center hover:bg-[#FDE8F0] active:scale-95 transition-all z-10"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-white/95 text-[#4A3B5C] border border-[#E6DEF8] shadow-pastel flex items-center justify-center hover:bg-[#FDE8F0] active:scale-95 transition-all z-10"
              aria-label="Next items"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}
