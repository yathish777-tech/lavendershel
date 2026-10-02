import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import ProductIllustration from '../product/ProductIllustration.jsx';
import { formatPrice } from '../../utils/formatPrice.js';

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-[#F0E5F5] shadow-xs"
    >
      {/* Thumbnail */}
      <div className="w-18 h-18 rounded-xl bg-gradient-to-br from-[#FFF9F4] to-[#FDE8F0]/40 overflow-hidden shrink-0 border border-[#E6DEF8] p-1 flex items-center justify-center">
        <ProductIllustration type={item.illustrationType || 'envelope'} />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-semibold text-[#4A3B5C] truncate">
              {item.name}
            </h4>
            <button
              onClick={() => onRemove(item.cartItemId)}
              className="text-[#8A7B9C] hover:text-[#922B21] transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Variant or subscription badge */}
          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-[#8A7B9C]">
            {item.variant && <span>{item.variant.name}</span>}
            {item.isSubscription && (
              <span className="text-[10px] text-[#8F7BD1] font-semibold">
                · {item.subscriptionPlan?.name || 'Monthly'}
              </span>
            )}
          </div>
        </div>

        {/* Stepper & Price row */}
        <div className="flex items-center justify-between pt-1">
          {/* Stepper */}
          <div className="flex items-center border border-[#E6DEF8] rounded-full px-2 py-0.5 bg-[#FFFDFB]">
            <button
              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
              className="w-5 h-5 text-xs text-[#4A3B5C] hover:text-[#8F7BD1] font-bold flex items-center justify-center"
            >
              -
            </button>
            <span className="text-xs font-semibold text-[#4A3B5C] px-2 tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
              className="w-5 h-5 text-xs text-[#4A3B5C] hover:text-[#8F7BD1] font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>

          <span className="text-xs font-bold text-[#4A3B5C] tabular-nums">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
