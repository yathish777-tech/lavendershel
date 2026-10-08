import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard.jsx';
import Skeleton from '../ui/Skeleton.jsx';

export default function ProductGrid({
  products = [],
  categories = [],
  isLoading = false,
  onOpenQuickView,
  className = ''
}) {
  const getCategoryName = (catId) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : '';
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#FFFDFB] rounded-[24px] border border-[#E6DEF8] p-4 shadow-sm space-y-3">
            <Skeleton variant="rect" height="190px" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <div className="pt-2 flex justify-between items-center">
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="circle" width="36px" height="36px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#FFFDFB] rounded-[28px] border border-[#E6DEF8] max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FDE8F0] flex items-center justify-center text-2xl">
          💌
        </div>
        <h3 className="font-serif text-xl font-bold text-[#4A3B5C]">
          No stationery treasures found
        </h3>
        <p className="text-xs sm:text-sm text-[#8A7B9C] mt-2 max-w-sm mx-auto">
          We couldn't find any items matching your selected criteria. Try adjusting your filters or search keyword!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <ProductCard
            product={product}
            onOpenQuickView={onOpenQuickView}
            categoryName={getCategoryName(product.categoryId)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
