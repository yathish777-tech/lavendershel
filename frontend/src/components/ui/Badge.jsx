import React from 'react';

export default function Badge({
  children,
  variant = 'lavender',
  size = 'sm',
  className = ''
}) {
  const variants = {
    lavender: "bg-[#E6DEF8] text-[#4A3B5C] border border-[#D4C6F4]",
    pink: "bg-[#FDE8F0] text-[#8F476B] border border-[#F8C8DC]",
    gold: "bg-[#FEF9E7] text-[#9A7D0A] border border-[#F9E79F]",
    neutral: "bg-[#F5F2F9] text-[#6B5B7D] border border-[#E9E4F0]",
    success: "bg-[#E8F8F5] text-[#117A65] border border-[#A3E4D7]"
  };

  const sizes = {
    xs: "text-[10px] px-2 py-0.5",
    sm: "text-xs px-2.5 py-0.5",
    md: "text-xs px-3 py-1"
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-wide whitespace-nowrap ${variants[variant] || variants.lavender} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
