import React from 'react';

export default function SectionDivider({
  fill = '#FFFDFB',
  variant = 'wave',
  flip = false,
  className = ''
}) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none select-none ${flip ? 'rotate-180' : ''} ${className}`}>
      {variant === 'wave' && (
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-8 md:h-14"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
            fill={fill}
          />
        </svg>
      )}

      {variant === 'cloud' && (
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 md:h-16"
        >
          <path
            d="M0,60 C80,40 160,70 240,55 C320,40 400,65 480,50 C560,35 640,65 720,50 C800,35 880,60 960,45 C1040,30 1120,55 1200,40 L1200,120 L0,120 Z"
            fill={fill}
          />
        </svg>
      )}

      {variant === 'scallop' && (
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="relative block w-full h-6 md:h-10"
        >
          <path
            d="M0,20 Q60,50 120,20 Q180,50 240,20 Q300,50 360,20 Q420,50 480,20 Q540,50 600,20 Q660,50 720,20 Q780,50 840,20 Q900,50 960,20 Q1020,50 1080,20 Q1140,50 1200,20 L1200,60 L0,60 Z"
            fill={fill}
          />
        </svg>
      )}
    </div>
  );
}
