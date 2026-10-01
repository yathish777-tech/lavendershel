import React from 'react';

export default function VariantSelector({
  variants = [],
  selectedVariant,
  onSelectVariant
}) {
  if (!variants || variants.length <= 1) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#4A3B5C]">Select Style / Color:</span>
        <span className="text-[#8F7BD1] font-medium">{selectedVariant?.name}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVariant(v)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isSelected
                  ? 'border-[#8F7BD1] bg-[#F5F0FC] text-[#4A3B5C] font-semibold shadow-xs'
                  : 'border-[#E6DEF8] bg-white text-[#6B5B7D] hover:border-[#B9A7E8]'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: v.color || '#B9A7E8' }}
              />
              <span>{v.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
