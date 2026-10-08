import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = '#8F7BD1',
  bg = '#FAF5FE'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-[#FFFDFB] rounded-[24px] border border-[#E6DEF8] p-5 shadow-pastel relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#8A7B9C] uppercase tracking-wider">
          {title}
        </span>
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center border border-black/5"
          style={{ backgroundColor: bg, color }}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B5C] tabular-nums">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs">
          {trend && (
            <span className="font-semibold text-[#117A65] bg-[#E8F8F5] px-2 py-0.5 rounded-full inline-flex items-center leading-none tabular-nums">
              {trend}
            </span>
          )}
          <span className="text-[#8A7B9C] leading-none">{subtitle}</span>
        </div>
      </div>
    </motion.div>
  );
}
