import React, { useState } from 'react';
import ProductIllustration from './ProductIllustration.jsx';

export default function ImageGallery({
  illustrationType = 'envelope',
  productName = '',
  tags = []
}) {
  const [activeView, setActiveView] = useState(0);

  // Gallery view mock variations
  const views = [
    { title: 'Full Front Perspective', type: illustrationType },
    { title: 'Artisan Close-up', type: illustrationType === 'envelope' ? 'letterset' : illustrationType },
    { title: 'Stationery Packaging', type: 'grandbundle' }
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Preview with soft border */}
      <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FFF9F4] to-[#FDE8F0]/30 border border-[#E6DEF8] p-3 shadow-pastel">
        <ProductIllustration type={views[activeView]?.type || illustrationType} />
        {tags?.[0] && (
          <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/95 text-[#4A3B5C] border border-[#E6DEF8] shadow-xs">
            {tags[0]}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2.5 overflow-x-auto py-1">
        {views.map((v, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveView(idx)}
            className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
              activeView === idx
                ? 'border-[#8F7BD1] shadow-sm scale-105'
                : 'border-[#E6DEF8] opacity-70 hover:opacity-100'
            }`}
          >
            <ProductIllustration type={v.type} />
          </button>
        ))}
      </div>
    </div>
  );
}
