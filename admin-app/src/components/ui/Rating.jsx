import React from 'react';
import { Star } from 'lucide-react';

export default function Rating({
  value = 5,
  max = 5,
  size = 'sm',
  showText = false,
  text = '',
  interactive = false,
  onChange,
  className = ''
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(i + 1)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
              aria-label={`Rate ${i + 1} stars`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  filled
                    ? 'fill-[#F4A6C4] text-[#F4A6C4]'
                    : half
                    ? 'fill-[#FDE8F0] text-[#F4A6C4]'
                    : 'fill-transparent text-[#D4C6F4]'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs text-[#8A7B9C] ml-1 font-medium tabular-nums">
          {text || value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
