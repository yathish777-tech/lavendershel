import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, BookOpen, Heart, Gift } from 'lucide-react';
import ProductIllustration from '../product/ProductIllustration.jsx';

export default function CategoryShowcase({ categories = [] }) {
  const iconMap = {
    'mail': <Mail className="w-4 h-4 text-[#8F7BD1]" />,
    'sparkles': <Sparkles className="w-4 h-4 text-[#F4A6C4]" />,
    'book-open': <BookOpen className="w-4 h-4 text-[#8F7BD1]" />,
    'heart': <Heart className="w-4 h-4 text-[#F4A6C4]" />,
    'gift': <Gift className="w-4 h-4 text-[#8F7BD1]" />
  };

  const illustrationMap = {
    'cat-snail-mail': 'envelope',
    'cat-seasonal-editions': 'vault',
    'cat-journaling': 'journal',
    'cat-stationery': 'stickers',
    'cat-bundles': 'grandbundle'
  };

  const activeCategories = categories.filter(c => c.isActive !== false);

  return (
    <section className="py-20 bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5FE] border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1]">
            <span>✿ Curated Avenues</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B5C]">
            Explore by Sanctuary Collection
          </h2>
          <p className="text-sm text-[#6B5B7D] leading-relaxed">
            From wax-sealed letters that arrive with the morning light to linen notebooks designed for deep reflection.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className={`group relative bg-[#FFF9F4] rounded-[28px] border border-[#E6DEF8] p-5 shadow-sm hover:shadow-pastel transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E6DEF8] flex items-center justify-center shadow-2xs">
                    {iconMap[cat.icon] || <Sparkles className="w-4 h-4 text-[#8F7BD1]" />}
                  </div>
                  <span className="text-xs font-semibold text-[#8A7B9C] uppercase tracking-wider">
                    Collection {idx + 1}
                  </span>
                </div>
                <span className="w-8 h-8 rounded-full bg-white text-[#4A3B5C] border border-[#E6DEF8] flex items-center justify-center group-hover:bg-[#B9A7E8] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A3B5C] group-hover:text-[#8F7BD1] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5B7D] mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Visual artwork preview */}
              <div className="rounded-2xl overflow-hidden bg-white/70 border border-[#F0E5F5] p-2 mt-auto">
                <div className="h-36 sm:h-44 w-full flex items-center justify-center group-hover:scale-102 transition-transform duration-300">
                  <ProductIllustration type={illustrationMap[cat.id] || 'envelope'} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
