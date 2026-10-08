import React, { useState } from 'react';
import ProductImage from './ProductImage.jsx';

export default function ImageGallery({
  product = null,
  images = null,
  illustrationType = 'envelope',
  productName = '',
  tags = []
}) {
  const [activeView, setActiveView] = useState(0);

  // Extract images from props or product
  const rawImages = images || product?.images || [];
  const imageList = Array.isArray(rawImages) ? rawImages.filter(url => typeof url === 'string' && url.trim().length > 0) : [];

  const resolvedIllustration = illustrationType || product?.illustrationType || 'envelope';
  const resolvedName = productName || product?.name || 'Lavendershell item';
  const resolvedTags = tags?.length ? tags : product?.tags || [];

  // Fallback illustrated views if no real images exist
  const illustrationViews = [
    { title: 'Full Front Perspective', type: resolvedIllustration },
    { title: 'Artisan Close-up', type: resolvedIllustration === 'envelope' ? 'letterset' : resolvedIllustration },
    { title: 'Stationery Packaging', type: 'grandbundle' }
  ];

  const hasPhotos = imageList.length > 0;
  const currentImageSrc = hasPhotos ? (imageList[activeView] || imageList[0]) : null;
  const currentIllustration = hasPhotos ? resolvedIllustration : (illustrationViews[activeView]?.type || resolvedIllustration);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Preview with soft border */}
      <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FFF9F4] to-[#FDE8F0]/30 border border-[#E6DEF8] p-3 shadow-pastel">
        <ProductImage
          src={currentImageSrc}
          illustrationType={currentIllustration}
          alt={resolvedName}
          className="w-full h-full rounded-2xl"
          imgClassName="object-cover"
        />

        {resolvedTags?.[0] && (
          <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/95 text-[#4A3B5C] border border-[#E6DEF8] shadow-xs">
            {resolvedTags[0]}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2.5 overflow-x-auto py-1">
        {hasPhotos ? (
          imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveView(idx)}
              className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white shrink-0 ${
                activeView === idx
                  ? 'border-[#8F7BD1] shadow-sm scale-105 ring-2 ring-[#B9A7E8]/40'
                  : 'border-[#E6DEF8] opacity-75 hover:opacity-100'
              }`}
            >
              <ProductImage
                src={imgUrl}
                illustrationType={resolvedIllustration}
                alt={`${resolvedName} view ${idx + 1}`}
                className="w-full h-full rounded-lg"
              />
            </button>
          ))
        ) : (
          illustrationViews.map((v, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveView(idx)}
              className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 ${
                activeView === idx
                  ? 'border-[#8F7BD1] shadow-sm scale-105'
                  : 'border-[#E6DEF8] opacity-70 hover:opacity-100'
              }`}
            >
              <ProductImage
                illustrationType={v.type}
                alt={v.title}
                className="w-full h-full"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
