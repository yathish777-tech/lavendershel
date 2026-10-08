import React, { useState } from 'react';

export default function Marquee({
  children,
  speed = 30, // seconds
  direction = 'left',
  pauseOnHover = true,
  className = ''
}) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={`overflow-hidden flex select-none ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="flex shrink-0 items-center gap-8 py-3 animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {children}
      </div>
      <div
        className="flex shrink-0 items-center gap-8 py-3 animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        aria-hidden="true"
      >
        {children}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}
