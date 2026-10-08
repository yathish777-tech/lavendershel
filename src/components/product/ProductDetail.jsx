import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Truck, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import ImageGallery from './ImageGallery.jsx';
import VariantSelector from './VariantSelector.jsx';
import SubscriptionToggle from './SubscriptionToggle.jsx';
import ReviewList from './ReviewList.jsx';
import RelatedProducts from './RelatedProducts.jsx';
import Rating from '../ui/Rating.jsx';
import Button from '../ui/Button.jsx';
import confetti from 'canvas-confetti';
import { formatPrice } from '../../utils/formatPrice.js';

export default function ProductDetail({
  product,
  categories = [],
  allProducts = [],
  onSelectProduct
}) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [purchaseType, setPurchaseType] = useState(product?.isSubscription ? 'subscription' : 'onetime');
  const [selectedPlan, setSelectedPlan] = useState(product?.subscriptionPlans?.[1] || product?.subscriptionPlans?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isFav = isWishlisted(product.id);
  const categoryName = categories.find(c => c.id === product.categoryId)?.name || '';

  const effectivePrice = purchaseType === 'subscription' && selectedPlan
    ? selectedPlan.price
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      variant: selectedVariant,
      isSubscription: purchaseType === 'subscription',
      subscriptionPlan: purchaseType === 'subscription' ? selectedPlan : null
    });

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        colors: ['#B9A7E8', '#F8C8DC', '#FFEAA7']
      });
    } catch {
      // fallback
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div className="space-y-8">
      {/* 2-Column Product Core */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div>
          <ImageGallery
            product={product}
            images={product.images}
            illustrationType={product.illustrationType || 'envelope'}
            productName={product.name}
            tags={product.tags}
          />
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#8A7B9C] mb-1.5">
              <span>{categoryName}</span>
              <div className="flex items-center gap-1.5">
                <Rating value={product.rating || 5} size="xs" />
                <span className="font-semibold text-[#4A3B5C] tabular-nums">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3B5C] leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-2xl font-bold text-[#4A3B5C] tabular-nums">
                {formatPrice(effectivePrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-[#8A7B9C] line-through tabular-nums">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {purchaseType === 'subscription' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E6DEF8] text-[#4A3B5C] font-medium">
                  {selectedPlan?.interval || 'monthly'}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#6B5B7D] leading-relaxed">
            {product.description}
          </p>

          {/* Subscription vs One-Time selector */}
          <SubscriptionToggle
            isSubscriptionProduct={product.isSubscription}
            subscriptionPlans={product.subscriptionPlans}
            purchaseType={purchaseType}
            onPurchaseTypeChange={setPurchaseType}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            oneTimePrice={product.price}
          />

          {/* Variants */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
          />

          {/* Quantity & CTA Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between bg-white border border-[#E6DEF8] rounded-full px-3 py-1.5 max-w-[130px] shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full text-[#4A3B5C] hover:bg-[#FDE8F0] flex items-center justify-center font-bold text-base"
              >
                -
              </button>
              <span className="text-sm font-semibold text-[#4A3B5C] tabular-nums px-2">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                className="w-7 h-7 rounded-full text-[#4A3B5C] hover:bg-[#FDE8F0] flex items-center justify-center font-bold text-base"
              >
                +
              </button>
            </div>

            {/* Primary Buy CTA */}
            <Button
              variant={isAdded ? "cream" : "primary"}
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <span className="flex items-center gap-2 text-[#117A65]">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Added with Love!</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {purchaseType === 'subscription' ? 'Start Snail Mail Plan' : 'Add to Bag'} — {formatPrice(effectivePrice * quantity)}
                  </span>
                </span>
              )}
            </Button>

            {/* Wishlist button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                isFav
                  ? 'border-[#F8C8DC] bg-[#FDE8F0] text-[#F4A6C4]'
                  : 'border-[#E6DEF8] bg-white text-[#8A7B9C] hover:text-[#4A3B5C]'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Reassurance points */}
          <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-[#8A7B9C]">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#8F7BD1]" />
              <span>Ships in protective envelope</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A6C4]" />
              <span>Hand-stamped wax seal</span>
            </div>
          </div>
        </div>
      </div>

      {/* "What's Inside" Visual Breakdown */}
      {product.contentsSummary && product.contentsSummary.length > 0 && (
        <div className="bg-[#FAF6FE] p-6 rounded-[24px] border border-[#E6DEF8] space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#8F7BD1]" />
            <h3 className="font-serif text-lg font-bold text-[#4A3B5C]">
              What's Inside This Parcel
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.contentsSummary.map((item, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#F0E5F5] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E6DEF8] text-[#4A3B5C] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#4A3B5C]">{item.title}</h4>
                  <p className="text-xs text-[#6B5B7D] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <ReviewList
        productName={product.name}
        initialRating={product.rating}
        count={product.reviewCount}
      />

      {/* Related Products */}
      <RelatedProducts
        currentProductId={product.id}
        products={allProducts}
        categories={categories}
        onSelectProduct={onSelectProduct}
      />
    </div>
  );
}
