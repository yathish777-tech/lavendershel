import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import ProductIllustration from './ProductIllustration.jsx';
import confetti from 'canvas-confetti';

export default function ProductCard({
  product,
  onOpenQuickView,
  showCategory = true,
  categoryName = ''
}) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  // 3D tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const isFav = isWishlisted(product.id);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6;
    const rY = ((x - centerX) / centerX) * 6;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 700);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);

    // Sparkle confetti
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 22,
        spread: 45,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#B9A7E8', '#F8C8DC', '#FFEAA7', '#FFF9F4'],
        disableForReducedMotion: true
      });
    } catch {
      // fallback
    }

    setJustAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(false);
    }, 1400);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", damping: 20, stiffness: 260 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="group relative flex flex-col bg-[#FFFDFB] rounded-[24px] border border-[#E6DEF8] p-3.5 sm:p-4 shadow-pastel hover:shadow-pastel-hover transition-all duration-300"
    >
      {/* Visual illustration / Artwork container with zoom on hover */}
      <div
        onClick={() => onOpenQuickView && onOpenQuickView(product)}
        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF9F4] to-[#FDE8F0]/40 cursor-pointer"
      >
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          <ProductIllustration type={product.illustrationType || 'envelope'} />
        </div>

        {/* Subtle top promotional badge if featured or bestseller */}
        {product.badges?.[0] && (
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full bg-white/95 text-[#4A3B5C] border border-[#E6DEF8] shadow-xs">
              {product.badges[0]}
            </span>
          </div>
        )}

        {/* Wishlist Button with Heart Burst */}
        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-[#4A3B5C] border border-[#E6DEF8] flex items-center justify-center shadow-xs hover:bg-[#FDE8F0] active:scale-90 transition-transform z-10"
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            animate={heartBurst ? { scale: [1, 1.45, 0.85, 1.15, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-[#F4A6C4] text-[#F4A6C4]' : 'text-[#8A7B9C] hover:text-[#F4A6C4]'
              }`}
            />
          </motion.div>

          {/* Mini heart particle burst */}
          {heartBurst && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <motion.span
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -22, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="text-xs text-[#F4A6C4]"
              >
                ♡
              </motion.span>
            </div>
          )}
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView && onOpenQuickView(product);
            }}
            className="w-full py-2 bg-white/95 backdrop-blur-md rounded-full text-xs font-semibold text-[#4A3B5C] border border-[#E6DEF8] shadow-sm hover:bg-[#E6DEF8] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col pt-3 pb-1">
        {/* Category & Rating as unboxed text */}
        <div className="flex items-center justify-between text-xs text-[#8A7B9C] mb-1">
          <span className="truncate max-w-[150px]">
            {categoryName || (product.isSubscription ? 'Monthly Subscription' : 'Stationery')}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[#F4A6C4]">★</span>
            <span className="font-semibold text-[#4A3B5C] tabular-nums">{product.rating}</span>
            <span className="text-[11px] text-[#8A7B9C]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenQuickView && onOpenQuickView(product)}
          className="font-serif font-semibold text-base text-[#4A3B5C] line-clamp-1 group-hover:text-[#8F7BD1] transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-[#6B5B7D] line-clamp-2 mt-1 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Add to Cart row */}
        <div className="mt-auto pt-2 border-t border-[#F5EDF8] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#4A3B5C] tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#8A7B9C] line-through tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            {product.isSubscription && (
              <span className="text-[10px] text-[#8F7BD1] font-medium">/mo</span>
            )}
          </div>

          {/* Morphing Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
              justAdded
                ? 'bg-[#A3E4D7] text-[#117A65] px-3.5 py-1.5'
                : 'bg-[#B9A7E8] text-[#4A3B5C] hover:bg-[#A995E0] px-3.5 py-1.5 shadow-sm'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added!</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
