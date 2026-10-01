import React from 'react';

export default function ProductIllustration({
  type = 'envelope',
  className = '',
  accentColor = '#B9A7E8'
}) {
  const illustrations = {
    envelope: (
      <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} fill="none">
        <rect width="400" height="300" rx="24" fill="#FDF7FA" />
        {/* Soft background glow */}
        <circle cx="200" cy="150" r="110" fill="#E6DEF8" fillOpacity="0.45" />
        {/* Envelope back */}
        <rect x="80" y="80" width="240" height="150" rx="16" fill="#FFFDFB" stroke="#D4C6F4" strokeWidth="2" />
        {/* Interior pattern stripes */}
        <path d="M90 90 L310 90 L200 170 Z" fill="#FDE8F0" fillOpacity="0.6" />
        {/* Letter paper peeking out */}
        <rect x="100" y="55" width="200" height="110" rx="8" fill="#FFFFFF" stroke="#E6DEF8" strokeWidth="1.5" />
        {/* Handwritten text lines */}
        <line x1="120" y1="80" x2="280" y2="80" stroke="#8A7B9C" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
        <line x1="120" y1="100" x2="260" y2="100" stroke="#8A7B9C" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
        <line x1="120" y1="120" x2="220" y2="120" stroke="#8A7B9C" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
        {/* Little heart stamp on paper */}
        <path d="M 270,72 C 265,65 255,67 255,75 C 255,83 270,92 270,92 C 270,92 285,83 285,75 C 285,67 275,65 270,72 Z" fill="#F4A6C4" />
        {/* Envelope front folds */}
        <path d="M80 230 L200 145 L320 230" stroke="#D4C6F4" strokeWidth="2" fill="#FAF5FD" />
        <path d="M80 80 L80 230 L160 175 Z" fill="#F5EEFA" opacity="0.6" />
        <path d="M320 80 L320 230 L240 175 Z" fill="#F5EEFA" opacity="0.6" />
        {/* Wax Seal Center */}
        <circle cx="200" cy="150" r="24" fill="#8F7BD1" />
        <circle cx="200" cy="150" r="20" fill="#B9A7E8" />
        <circle cx="200" cy="150" r="16" fill="#8F7BD1" />
        <path d="M194 146 C194 140 206 140 206 146 C206 156 194 158 200 162" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
        {/* Botanical sprig */}
        <path d="M225 155 Q255 170 270 200" stroke="#7A9A7B" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="242" cy="165" rx="5" ry="2.5" transform="rotate(-30 242 165)" fill="#A8C3A9" />
        <ellipse cx="258" cy="180" rx="5" ry="2.5" transform="rotate(35 258 180)" fill="#A8C3A9" />
        {/* Sparkles */}
        <path d="M100 65 L103 74 L112 77 L103 80 L100 89 L97 80 L88 77 L97 74 Z" fill="#E2A76F" />
        <path d="M305 195 L307 202 L314 204 L307 206 L305 213 L303 206 L296 204 L303 202 Z" fill="#F4A6C4" />
      </svg>
    ),

    journal: (
      <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} fill="none">
        <rect width="400" height="300" rx="24" fill="#FAF6FC" />
        <circle cx="200" cy="150" r="105" fill="#FDE8F0" fillOpacity="0.5" />
        {/* Book shadow */}
        <rect x="130" y="65" width="160" height="200" rx="14" fill="#4A3B5C" opacity="0.08" transform="rotate(5 210 165)" />
        {/* Book Cover */}
        <rect x="120" y="55" width="160" height="195" rx="12" fill="#B9A7E8" stroke="#9F8BE0" strokeWidth="2" />
        {/* Book Spine */}
        <path d="M120 55 C120 55 130 55 136 55 L136 250 C130 250 120 250 120 250 Z" fill="#8F7BD1" />
        {/* Page Block gilded edge */}
        <rect x="272" y="62" width="8" height="181" fill="#F9E79F" rx="2" />
        {/* Celestial Gold Foil Motif */}
        <circle cx="205" cy="140" r="28" fill="#FDE8F0" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M205 122 L208 135 L221 138 L208 141 L205 154 L202 141 L189 138 L202 135 Z" fill="#D4AF37" />
        <circle cx="185" cy="160" r="2" fill="#D4AF37" />
        <circle cx="225" cy="120" r="2.5" fill="#D4AF37" />
        {/* Double Satin Ribbon Markers */}
        <path d="M200 248 C195 270 215 285 210 295" stroke="#F4A6C4" strokeWidth="5" strokeLinecap="round" />
        <path d="M208 248 C205 265 225 275 220 290" stroke="#8F7BD1" strokeWidth="4" strokeLinecap="round" />
        {/* Pen Resting Next to it */}
        <line x1="90" y1="100" x2="110" y2="220" stroke="#F8C8DC" strokeWidth="7" strokeLinecap="round" />
        <polygon points="110,220 108,230 114,222" fill="#D4AF37" />
      </svg>
    ),

    waxkit: (
      <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} fill="none">
        <rect width="400" height="300" rx="24" fill="#FDFBF7" />
        <circle cx="200" cy="150" r="100" fill="#E6DEF8" fillOpacity="0.4" />
        {/* Brass Stamp */}
        <g transform="translate(140, 50)">
          {/* Rose quartz handle */}
          <rect x="20" y="20" width="24" height="90" rx="12" fill="#F8C8DC" stroke="#F4A6C4" strokeWidth="1.5" />
          <ellipse cx="32" cy="20" rx="14" ry="8" fill="#FDE8F0" />
          {/* Brass connector & head */}
          <rect x="18" y="105" width="28" height="20" rx="3" fill="#D4AF37" />
          <circle cx="32" cy="130" r="22" fill="#D4AF37" stroke="#B7950B" strokeWidth="2" />
          {/* Shell carved on die */}
          <path d="M26 125 C26 118 38 118 38 125 C38 135 26 135 32 138" stroke="#7D6608" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Melting Spoon */}
        <g transform="translate(210, 110) rotate(-25)">
          <line x1="0" y1="40" x2="80" y2="40" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="90" cy="40" rx="18" ry="14" fill="#D4AF37" />
          <ellipse cx="90" cy="40" rx="14" ry="10" fill="#8F7BD1" />
        </g>
        {/* Wax Pearls scattered */}
        <circle cx="130" cy="220" r="10" fill="#B9A7E8" stroke="#FFF" strokeWidth="2" />
        <circle cx="152" cy="235" r="9" fill="#F8C8DC" stroke="#FFF" strokeWidth="2" />
        <circle cx="170" cy="218" r="10" fill="#FFF9F4" stroke="#D4C6F4" strokeWidth="2" />
        <circle cx="260" cy="225" r="11" fill="#8F7BD1" stroke="#FFF" strokeWidth="2" />
        <circle cx="282" cy="215" r="8" fill="#F4A6C4" stroke="#FFF" strokeWidth="2" />
      </svg>
    ),

    stickers: (
      <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} fill="none">
        <rect width="400" height="300" rx="24" fill="#FAF6FD" />
        <circle cx="200" cy="150" r="110" fill="#FDE8F0" fillOpacity="0.6" />
        {/* Sticker backing sheet */}
        <rect x="90" y="50" width="220" height="200" rx="16" fill="#FFFFFF" stroke="#E6DEF8" strokeWidth="2" />
        {/* Header strip */}
        <path d="M90 50 Q200 45 310 50 L310 80 L90 80 Z" fill="#E6DEF8" />
        <text x="200" y="70" textAnchor="middle" fill="#4A3B5C" fontSize="12" fontFamily="'Caveat', cursive" fontWeight="bold">
          ✿ gentle affirmations ✿
        </text>
        {/* Cloud Sticker */}
        <path d="M120 120 A10 10 0 0 1 140 110 A14 14 0 0 1 165 115 A10 10 0 0 1 170 130 L120 130 Z" fill="#FDE8F0" stroke="#F8C8DC" strokeWidth="2" />
        {/* Heart Sticker */}
        <path d="M 245,105 C 240,98 230,100 230,108 C 230,116 245,125 245,125 C 245,125 260,116 260,108 C 260,100 250,98 245,105 Z" fill="#B9A7E8" stroke="#8F7BD1" strokeWidth="2" />
        {/* Stamp Sticker */}
        <rect x="120" y="160" width="55" height="65" rx="6" fill="#F5F0FC" stroke="#D4C6F4" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="147" cy="190" r="14" fill="#F8C8DC" />
        {/* Holographic Quote Bubble */}
        <rect x="190" y="160" width="105" height="55" rx="18" fill="#FFF9F4" stroke="#B9A7E8" strokeWidth="2" />
        <text x="242" y="192" textAnchor="middle" fill="#8F7BD1" fontSize="11" fontFamily="'Caveat', cursive" fontWeight="bold">
          you are enough ♡
        </text>
      </svg>
    ),

    grandbundle: (
      <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} fill="none">
        <rect width="400" height="300" rx="24" fill="#FDF8FB" />
        <circle cx="200" cy="150" r="115" fill="#E6DEF8" fillOpacity="0.5" />
        {/* Keepsake Gift Box Base */}
        <rect x="100" y="100" width="200" height="135" rx="14" fill="#FFFDFB" stroke="#D4C6F4" strokeWidth="2" />
        {/* Box Lid */}
        <rect x="92" y="85" width="216" height="32" rx="8" fill="#FDE8F0" stroke="#F8C8DC" strokeWidth="2" />
        {/* Silk Ribbon Vertical */}
        <rect x="185" y="85" width="30" height="150" fill="#B9A7E8" />
        {/* Big Bow at top */}
        <path d="M200 85 C175 60 160 85 185 85 Z" fill="#B9A7E8" />
        <path d="M200 85 C225 60 240 85 215 85 Z" fill="#B9A7E8" />
        <ellipse cx="200" cy="85" rx="8" ry="7" fill="#8F7BD1" />
        {/* Trailing ribbon curls */}
        <path d="M195 85 Q170 120 160 145" stroke="#B9A7E8" strokeWidth="4" strokeLinecap="round" />
        <path d="M205 85 Q230 115 240 140" stroke="#B9A7E8" strokeWidth="4" strokeLinecap="round" />
        {/* Gift tag */}
        <g transform="translate(225, 120) rotate(15)">
          <polygon points="0,0 35,0 45,15 35,30 0,30" fill="#FFF" stroke="#E6DEF8" strokeWidth="1.5" />
          <circle cx="8" cy="15" r="3" fill="#B9A7E8" />
          <text x="22" y="19" textAnchor="middle" fill="#4A3B5C" fontSize="10" fontFamily="'Caveat', cursive">with love</text>
        </g>
      </svg>
    )
  };

  // Fallback to envelope if type not matched
  const graphic = illustrations[type] || illustrations.envelope;

  return (
    <div className={`aspect-[4/3] w-full flex items-center justify-center overflow-hidden rounded-2xl ${className}`}>
      {graphic}
    </div>
  );
}
