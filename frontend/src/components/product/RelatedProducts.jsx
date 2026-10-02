import React from 'react';
import Carousel from '../ui/Carousel.jsx';
import ProductCard from './ProductCard.jsx';

export default function RelatedProducts({
  currentProductId,
  products = [],
  categories = [],
  onSelectProduct
}) {
  const related = products
    .filter(p => p.id !== currentProductId && p.isActive !== false)
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <div className="pt-8 border-t border-[#F0E5F5]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-serif text-lg font-bold text-[#4A3B5C]">
          You Might Also Cherish
        </h4>
        <span className="text-xs text-[#8F7BD1] font-medium font-handwritten text-base">
          kindred treasures ✿
        </span>
      </div>

      <Carousel gap={16} itemClassName="w-64 sm:w-72">
        {related.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onOpenQuickView={onSelectProduct}
            categoryName={categories.find(c => c.id === prod.categoryId)?.name || ''}
          />
        ))}
      </Carousel>
    </div>
  );
}
