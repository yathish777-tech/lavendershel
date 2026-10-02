import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import Button from '../ui/Button.jsx';
import ProductIllustration from '../product/ProductIllustration.jsx';
import { formatPrice } from '../../utils/formatPrice.js';

export default function SeasonalSpotlight({ products = [], onOpenQuickView }) {
  const seasonalProduct = products.find(p => p.categoryId === 'cat-seasonal-editions') || products[3];

  if (!seasonalProduct) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#FFF9F4] via-[#FDE8F0]/40 to-[#E6DEF8]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDFB] rounded-[32px] border-2 border-[#E6DEF8] p-8 sm:p-12 shadow-pastel-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-[28px] overflow-hidden bg-gradient-to-br from-[#FAF5FE] to-[#FFF9F4] border border-[#E6DEF8] p-6 shadow-sm">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#E6DEF8] text-[10px] font-bold uppercase tracking-wider text-[#8F7BD1]">
                <Clock className="w-3 h-3 text-[#F4A6C4]" />
                <span>Limited Solstice Run</span>
              </div>
              <div className="pt-6">
                <ProductIllustration type={seasonalProduct.illustrationType || 'vault'} />
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDE8F0] border border-[#F8C8DC] text-xs font-semibold text-[#8F476B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seasonal Special Edition</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#4A3B5C] leading-tight">
              {seasonalProduct.name}
            </h2>

            <p className="text-sm sm:text-base text-[#6B5B7D] leading-relaxed">
              {seasonalProduct.description} Adorned with hand-pressed wild lavender sprigs, rose quartz, and individually numbered archival seals.
            </p>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-bold text-[#4A3B5C] tabular-nums">
                {formatPrice(seasonalProduct.price)}
              </span>
              {seasonalProduct.compareAtPrice && (
                <span className="text-base text-[#8A7B9C] line-through tabular-nums">
                  {formatPrice(seasonalProduct.compareAtPrice)}
                </span>
              )}
              <span className="text-xs text-[#8F7BD1] font-semibold">
                Only {seasonalProduct.stock} parcels crafted
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenQuickView && onOpenQuickView(seasonalProduct)}
              >
                <span>Discover the Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Link to="/products?category=cat-seasonal-editions">
                <Button variant="outline" size="lg">
                  <span>Browse All Seasonal</span>
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
