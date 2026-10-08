import React from 'react';
import { motion } from 'framer-motion';

export default function WaxSeal({
  color = '#8F7BD1',
  size = 48,
  motif = 'shell',
  label = '',
  onClick,
  interactive = false,
  className = ''
}) {
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${interactive ? 'cursor-pointer' : ''} ${className}`}
      title={label || "Lavendershell Wax Seal"}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(74,59,92,0.22)]"
      >
        <defs>
          <radialGradient id={`waxGrad-${motif}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF" stopOpacity="0.45" />
            <stop offset="25%" stopColor={color} />
            <stop offset="85%" stopColor="#4A3B5C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2C2138" />
          </radialGradient>
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="1" dy="2" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.35" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Organic scalloped wax edge */}
        <path
          d="M 50,5 
             C 62,3 72,12 80,18 
             C 89,24 96,36 94,48 
             C 93,60 88,72 79,80 
             C 70,89 58,95 46,95 
             C 33,94 21,88 14,79 
             C 6,70 4,56 7,44 
             C 10,32 17,20 28,12 
             C 38,5 42,6 50,5 Z"
          fill={`url(#waxGrad-${motif})`}
        />

        {/* Rim impression */}
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="2"
        />

        {/* Center motif */}
        {motif === 'shell' && (
          <g transform="translate(32, 32) scale(0.36)" fill="rgba(255,255,255,0.75)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5">
            <path d="M 50 15 C 30 15 15 35 15 55 C 15 80 40 90 50 90 C 60 90 85 80 85 55 C 85 35 70 15 50 15 Z" fillOpacity="0.4" />
            <path d="M 50 20 L 50 85" stroke="rgba(255,255,255,0.9)" strokeWidth="4" />
            <path d="M 38 25 Q 40 60 48 85" stroke="rgba(255,255,255,0.8)" strokeWidth="3.5" />
            <path d="M 62 25 Q 60 60 52 85" stroke="rgba(255,255,255,0.8)" strokeWidth="3.5" />
            <path d="M 28 35 Q 35 65 46 87" stroke="rgba(255,255,255,0.7)" strokeWidth="3" />
            <path d="M 72 35 Q 65 65 54 87" stroke="rgba(255,255,255,0.7)" strokeWidth="3" />
          </g>
        )}

        {motif === 'heart' && (
          <g transform="translate(34, 34) scale(0.32)" fill="rgba(255,255,255,0.85)">
            <path d="M50 88.9L42.75 82.3C17 58.95 0 43.55 0 24.5C0 8.9 12.2 0 27.5 0C36.15 0 44.45 4.05 50 10.4C55.55 4.05 63.85 0 72.5 0C87.8 0 100 8.9 100 24.5C100 43.55 83 58.95 57.25 82.35L50 88.9Z" />
          </g>
        )}

        {motif === 'flower' && (
          <g transform="translate(34, 34) scale(0.32)" fill="rgba(255,255,255,0.85)">
            <circle cx="50" cy="50" r="14" fill="#FFEAA7" />
            <circle cx="50" cy="20" r="14" />
            <circle cx="78" cy="35" r="14" />
            <circle cx="78" cy="65" r="14" />
            <circle cx="50" cy="80" r="14" />
            <circle cx="22" cy="65" r="14" />
            <circle cx="22" cy="35" r="14" />
          </g>
        )}

        {motif === 'monogram' && (
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="26"
            fontWeight="bold"
            fill="rgba(255,255,255,0.85)"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}
          >
            LS
          </text>
        )}
      </svg>
    </motion.div>
  );
}
