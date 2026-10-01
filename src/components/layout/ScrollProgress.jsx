import React from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition.js';

export default function ScrollProgress() {
  const { scrollProgress } = useScrollPosition();

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 pointer-events-none bg-transparent">
      {/* Pink ribbon progress track */}
      <div
        className="h-full bg-gradient-to-r from-[#B9A7E8] via-[#F8C8DC] to-[#F4A6C4] shadow-[0_1px_6px_rgba(244,166,196,0.6)] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
