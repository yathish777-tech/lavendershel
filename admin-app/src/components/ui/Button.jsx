import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8F7BD1] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const sizeClasses = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2 shadow-sm",
    lg: "text-base px-7 py-3 gap-2.5 shadow-md",
    icon: "p-2.5"
  };

  const variantClasses = {
    primary: "bg-[#B9A7E8] text-[#4A3B5C] font-semibold hover:bg-[#A995E0] active:bg-[#9680D6] shadow-[0_4px_16px_rgba(185,167,232,0.4)] hover:shadow-[0_6px_22px_rgba(185,167,232,0.5)] border border-[#C9BAEE]/50",
    secondary: "bg-[#F8C8DC] text-[#4A3B5C] font-semibold hover:bg-[#F4A6C4] active:bg-[#ED8BAC] shadow-[0_4px_14px_rgba(248,200,220,0.45)] border border-[#FAD6E4]/60",
    outline: "border-2 border-[#B9A7E8] text-[#4A3B5C] hover:bg-[#E6DEF8]/40 active:bg-[#E6DEF8]/60 bg-transparent",
    cream: "bg-[#FFFDFB] text-[#4A3B5C] font-semibold hover:bg-[#FDE8F0] shadow-[0_4px_14px_rgba(74,59,92,0.06)] border border-[#E6DEF8]",
    ghost: "text-[#4A3B5C] hover:bg-[#E6DEF8]/50 active:bg-[#E6DEF8]/80 bg-transparent",
    danger: "bg-[#FADBD8] text-[#922B21] hover:bg-[#F5B7B1] border border-[#F1948A]"
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </motion.button>
  );
}
