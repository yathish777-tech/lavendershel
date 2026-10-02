import React from 'react';
import Marquee from '../ui/Marquee.jsx';
import affirmations from '../../data/affirmations.json';

export default function AffirmationMarquee() {
  return (
    <div className="relative py-3.5 bg-gradient-to-r from-[#E6DEF8] via-[#FDE8F0] to-[#E6DEF8] border-y border-[#D4C6F4]/60 shadow-xs overflow-hidden">
      <Marquee speed={35} pauseOnHover={true}>
        {affirmations.map((affirmation, index) => (
          <div
            key={index}
            className="flex items-center gap-4 text-xs sm:text-sm font-handwritten font-bold text-[#4A3B5C] tracking-wider whitespace-nowrap px-4"
          >
            <span className="text-base sm:text-lg">{affirmation}</span>
            <span className="text-[#8F7BD1] text-xs">✧</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
