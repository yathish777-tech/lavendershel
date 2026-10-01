import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard.jsx';
import Button from '../ui/Button.jsx';

export default function BundlesSection({ products = [], onOpenQuickView }) {
  const bundles = products
    .filter(p => p.categoryId === 'cat-bundles' && p.isActive !== false)
    .slice(0, 3);

  return (
    <section className="py-20 bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5FE] border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1] mb-2">
              <Gift className="w-3.5 h-3.5 text-[#F4A6C4]" />
              <span>Tied with Silk Ribbon</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B5C]">
              Gift Sets & Cozy Bundles
            </h2>
            <p className="text-sm text-[#6B5B7D] mt-1 max-w-lg">
              The grandest gift for yourself or a kindred spirit—curated with coordinated journals, wax seals, and letter hampers.
            </p>
          </div>

          <Link to="/products?category=cat-bundles">
            <Button variant="outline" size="sm">
              <span>View All Gift Sets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <ProductCard
              key={bundle.id}
              product={bundle}
              onOpenQuickView={onOpenQuickView}
              categoryName="Gift Set"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
