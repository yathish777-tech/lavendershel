import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F5F0FC] rounded-full border border-[#E6DEF8] ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap select-none ${
              isActive ? 'text-[#4A3B5C] font-semibold' : 'text-[#8A7B9C] hover:text-[#4A3B5C]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(185,167,232,0.3)] border border-[#E6DEF8]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E6DEF8] text-[#4A3B5C]">
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
