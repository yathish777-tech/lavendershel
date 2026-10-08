import React, { useState } from 'react';
import ProductIllustration from './ProductIllustration.jsx';

/**
 * Reusable ProductImage component for Lavendershell.
 * Used everywhere across Storefront and Admin:
 * - Product Cards
 * - Quick View
 * - Product Detail Gallery & Thumbnails
 * - Cart Drawer
 * - Wishlist
 * - Related Products
 * - Featured Carousel
 * - Admin Product Table
 * - Admin Edit Modal Preview
 *
 * Behavior:
 * 1. If product.images has a URL (or src prop is passed), display the real photo with object-cover and lazy loading.
 * 2. While the image is loading, if images is empty, or on load error, smoothly display the vector illustration placeholder with pastel shimmer.
 * 3. Never renders a broken image icon.
 */
export default function ProductImage({
  product = null,
  src = null,
  images = null,
  illustrationType = null,
  alt = '',
  className = '',
  imgClassName = '',
  showShimmer = true
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 1. Resolve image source URL (first item in images[] is the main image)
  let targetUrl = src;
  if (!targetUrl && Array.isArray(images) && images.length > 0) {
    targetUrl = images[0];
  }
  if (!targetUrl && product) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      targetUrl = product.images[0];
    } else if (typeof product.image === 'string' && product.image.trim()) {
      targetUrl = product.image;
    }
  }

  // 2. Resolve illustration motif fallback
  const resolvedIllustration =
    illustrationType ||
    product?.illustrationType ||
    'envelope';

  const resolvedAlt = alt || product?.name || 'Lavendershell stationery treasure';

  const hasValidUrl = Boolean(
    targetUrl &&
    typeof targetUrl === 'string' &&
    targetUrl.trim().length > 0 &&
    !hasError
  );

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FFF9F4] to-[#FDE8F0]/30 select-none ${className}`}>
      {/* Fallback Illustrated Vector Artwork (shown while loading, on error, or when no image exists) */}
      {(!hasValidUrl || !isLoaded) && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <ProductIllustration type={resolvedIllustration} className="w-full h-full" />
          {/* Gentle pastel shimmer while loading */}
          {hasValidUrl && !isLoaded && showShimmer && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
          )}
        </div>
      )}

      {/* Real Uploaded Photography */}
      {hasValidUrl && (
        <img
          src={targetUrl}
          alt={resolvedAlt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
