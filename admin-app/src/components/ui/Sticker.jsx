import React from 'react';
import { motion } from 'framer-motion';

export default function Sticker({
  text,
  icon,
  rotation = -4,
  variant = 'pink',
  className = '',
  size = 'md'
}) {
  const variantStyles = {
    pink: 'bg-[#FDE8F0] text-[#7A3654] border-2 border-white shadow-[0_4px_12px_rgba(248,200,220,0.4)]',
    lavender: 'bg-[#E6DEF8] text-[#4A3B5C] border-2 border-white shadow-[0_4px_12px_rgba(185,167,232,0.4)]',
    cream: 'bg-[#FFF9F4] text-[#4A3B5C] border-2 border-[#E6DEF8] shadow-sm',
    holographic: 'bg-gradient-to-r from-[#E6DEF8] via-[#FDE8F0] to-[#E6DEF8] text-[#4A3B5C] border-2 border-white shadow-[0_4px_16px_rgba(185,167,232,0.45)]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      style={{ rotate: `${rotation}deg` }}
      whileHover={{ scale: 1.08, rotate: `${rotation > 0 ? rotation + 3 : rotation - 3}deg` }}
      className={`inline-flex items-center gap-1.5 font-handwritten font-bold rounded-2xl select-none transition-shadow ${variantStyles[variant] || variantStyles.pink} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span className="tracking-wide text-sm md:text-base">{text}</span>
    </motion.div>
  );
}
