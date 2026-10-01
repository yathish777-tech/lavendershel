import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import ProductDetail from '../components/product/ProductDetail.jsx';
import Modal from '../components/ui/Modal.jsx';
import { Sparkles, Heart } from 'lucide-react';

export default function Product() {
  const { products, categories } = useProducts();
  const { wishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const categoryParam = searchParams.get('category') || 'all';
  const wishlistParam = searchParams.get('wishlist') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showSubscriptionOnly, setShowSubscriptionOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(150);

  // Active quick view / detail modal
  const [activeProduct, setActiveProduct] = useState(null);

  // Sync state if URL query param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Check if an item id was passed in url query
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      const found = products.find(p => p.id === idParam || p.slug === idParam);
      if (found) setActiveProduct(found);
    }
  }, [searchParams, products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Active check
        if (p.isActive === false) return false;

        // Wishlist filter
        if (wishlistParam && !wishlist.includes(p.id)) return false;

        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Subscription filter
        if (showSubscriptionOnly && !p.isSubscription) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTag = p.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, showSubscriptionOnly, wishlistParam, wishlist]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setShowSubscriptionOnly(false);
    setPriceRange(150);
    searchParams.delete('category');
    searchParams.delete('wishlist');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-[#FFF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner / Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1] shadow-2xs">
            {wishlistParam ? (
              <>
                <Heart className="w-3.5 h-3.5 fill-[#F8C8DC] text-[#F4A6C4]" />
                <span>Your Saved Whispers</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#F4A6C4]" />
                <span>The Complete Catalogue</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3B5C]">
            {wishlistParam ? 'Your Loved Sanctuary Treasures' : 'Stationery, Snail Mail & Journals'}
          </h1>

          <p className="text-sm sm:text-base text-[#6B5B7D] leading-relaxed">
            {wishlistParam
              ? 'A curated space for the pieces that caught your heart. Ready whenever you wish to bring them home.'
              : 'Every piece is crafted to encourage mindful living, handwritten letters, and gentle morning pages.'}
          </p>
        </div>

        {/* Filters Controls */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          showSubscriptionOnly={showSubscriptionOnly}
          onToggleSubscriptionOnly={setShowSubscriptionOnly}
          totalProductsCount={filteredProducts.length}
          onReset={handleResetFilters}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          categories={categories}
          onOpenQuickView={setActiveProduct}
        />

        {/* Product Detail Modal */}
        <Modal
          isOpen={!!activeProduct}
          onClose={() => setActiveProduct(null)}
          title="Sanctuary Treasure"
          subtitle="Tactile details & mindful craftsmanship"
          maxWidth="max-w-4xl"
        >
          {activeProduct && (
            <ProductDetail
              product={activeProduct}
              categories={categories}
              allProducts={products}
              onSelectProduct={setActiveProduct}
            />
          )}
        </Modal>

      </div>
    </div>
  );
}
