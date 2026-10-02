import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceChange,
  showSubscriptionOnly,
  onToggleSubscriptionOnly,
  totalProductsCount = 0,
  onReset
}) {
  return (
    <div className="bg-[#FFFDFB] rounded-[28px] border border-[#E6DEF8] p-5 sm:p-6 shadow-pastel mb-8 space-y-6">
      
      {/* Top Row: Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A7B9C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search letters, journals, wax seals, stamps..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6DEF8] rounded-full text-sm text-[#4A3B5C] placeholder-[#8A7B9C] outline-none focus:border-[#B9A7E8] focus:shadow-[0_0_14px_rgba(185,167,232,0.3)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A7B9C] hover:text-[#4A3B5C]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort & Subscription Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#8A7B9C]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E6DEF8] rounded-full text-xs font-semibold text-[#4A3B5C] outline-none focus:border-[#B9A7E8]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#6B5B7D] cursor-pointer select-none px-3 py-2 bg-[#F5F0FC] rounded-full border border-[#E6DEF8] hover:bg-[#E6DEF8]/60 transition-colors">
            <input
              type="checkbox"
              checked={showSubscriptionOnly}
              onChange={(e) => onToggleSubscriptionOnly(e.target.checked)}
              className="accent-[#8F7BD1] rounded cursor-pointer"
            />
            <span>Subscriptions Only ✉</span>
          </label>

          {(searchQuery || selectedCategory !== 'all' || showSubscriptionOnly || priceRange < 150) && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs text-[#8F7BD1] hover:underline px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills (Functional Buttons) */}
      <div className="border-t border-[#F5EDF8] pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7B9C]">
            Collections
          </span>
          <span className="text-xs text-[#8A7B9C]">
            Showing <strong className="text-[#4A3B5C] font-semibold">{totalProductsCount}</strong> treasures
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#B9A7E8] text-[#4A3B5C] font-bold shadow-sm'
                : 'bg-white text-[#6B5B7D] border border-[#E6DEF8] hover:bg-[#FDE8F0]/60'
            }`}
          >
            All Collections
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#B9A7E8] text-[#4A3B5C] font-bold shadow-sm'
                    : 'bg-white text-[#6B5B7D] border border-[#E6DEF8] hover:bg-[#FDE8F0]/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
