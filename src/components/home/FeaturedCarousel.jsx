import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../ui/Carousel.jsx';
import ProductCard from '../product/ProductCard.jsx';
import Button from '../ui/Button.jsx';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedCarousel({
  products = [],
  categories = [],
  onOpenQuickView
}) {
  const featured = products
    .filter(p => p.isFeatured && p.isActive !== false);

  const getCategoryName = (catId) => {
    return categories.find(c => c.id === catId)?.name || '';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFF9F4] to-[#FAF5FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1] mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A6C4]" />
              <span>Beloved by our Penpals</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B5C]">
              Featured Treasures
            </h2>
            <p className="text-sm text-[#6B5B7D] mt-1 max-w-lg">
              The journals, wax stamp kits, and monthly care parcels currently gracing desks around the globe.
            </p>
          </div>

          <Link to="/products">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <span>View All Treasures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <Carousel gap={24} itemClassName="w-72 sm:w-80">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={onOpenQuickView}
              categoryName={getCategoryName(product.categoryId)}
            />
          ))}
        </Carousel>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/products">
            <Button variant="outline" size="sm">
              <span>View All Treasures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
