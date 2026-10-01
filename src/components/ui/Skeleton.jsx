import React from 'react';

export default function Skeleton({
  variant = 'rect',
  width,
  height,
  className = ''
}) {
  const variantStyles = {
    circle: 'rounded-full',
    rect: 'rounded-2xl',
    text: 'rounded-md h-4'
  };

  return (
    <div
      style={{ width, height }}
      className={`relative overflow-hidden bg-gradient-to-r from-[#F5EDF8] via-[#FDE8F0]/70 to-[#F5EDF8] animate-pulse ${variantStyles[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
