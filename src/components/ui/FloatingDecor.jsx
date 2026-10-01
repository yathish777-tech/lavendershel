import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingDecor() {
  const elements = [
    { type: 'heart', top: '12%', left: '4%', delay: 0, duration: 6, size: 22, color: '#F8C8DC' },
    { type: 'sparkle', top: '18%', right: '8%', delay: 1, duration: 5, size: 26, color: '#B9A7E8' },
    { type: 'star', top: '35%', left: '8%', delay: 2, duration: 7, size: 18, color: '#E2A76F' },
    { type: 'cloud', top: '55%', right: '5%', delay: 0.5, duration: 8, size: 40, color: '#E6DEF8' },
    { type: 'flower', top: '72%', left: '6%', delay: 1.5, duration: 6.5, size: 24, color: '#F4A6C4' },
    { type: 'sparkle', top: '85%', right: '10%', delay: 2.5, duration: 5.5, size: 20, color: '#B9A7E8' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: el.top,
            left: el.left,
            right: el.right,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === 'heart' && (
            <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill={el.color} opacity="0.6">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}

          {el.type === 'sparkle' && (
            <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill={el.color} opacity="0.7">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
            </svg>
          )}

          {el.type === 'star' && (
            <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill={el.color} opacity="0.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          )}

          {el.type === 'flower' && (
            <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill={el.color} opacity="0.65">
              <circle cx="12" cy="12" r="3.5" fill="#FFEAA7" />
              <circle cx="12" cy="5" r="3.5" />
              <circle cx="19" cy="12" r="3.5" />
              <circle cx="12" cy="19" r="3.5" />
              <circle cx="5" cy="12" r="3.5" />
            </svg>
          )}

          {el.type === 'cloud' && (
            <svg width={el.size} height={el.size * 0.6} viewBox="0 0 100 60" fill={el.color} opacity="0.45">
              <path d="M20,50 A15,15 0 0,1 15,20 A22,22 0 0,1 55,10 A25,25 0 0,1 85,25 A18,18 0 0,1 80,50 Z"/>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
