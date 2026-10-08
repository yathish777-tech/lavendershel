import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useScrollPosition } from '../../hooks/useScrollPosition.js';

export default function Navbar() {
  const location = useLocation();
  const { totalItemsCount, openCart, cartBounce } = useCart();
  const { wishlistCount } = useWishlist();
  const { scrollPosition } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isScrolled = scrollPosition > 20;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/products' },
    { label: 'Snail Mail', path: '/products?category=cat-snail-mail' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-panel py-2.5 shadow-sm border-b border-[#E6DEF8]/70'
            : 'bg-[#FFF9F4]/90 backdrop-blur-md py-4 border-b border-[#F0E5F5]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* ZONE 1: Brand Wordmark (Single text element in display face) */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="Lavendershell Home"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#4A3B5C] tracking-tight group-hover:text-[#8F7BD1] transition-colors">
              Lavendershell
            </span>
            <span className="text-sm font-handwritten text-[#F4A6C4] hidden sm:inline -rotate-6">
              ✿ mail & musings
            </span>
          </Link>

          {/* ZONE 2: Clean typography navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5B7D]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`relative py-1 transition-colors hover:text-[#4A3B5C] ${
                  isActive(link.path)
                    ? 'text-[#4A3B5C] font-semibold'
                    : ''
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbarIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B9A7E8] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ZONE 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              to="/products?wishlist=true"
              className="relative p-2 text-[#6B5B7D] hover:text-[#4A3B5C] hover:bg-[#FDE8F0]/60 rounded-full transition-colors"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#F8C8DC] text-[#F4A6C4]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#F4A6C4] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <motion.button
              animate={cartBounce ? { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, -8, 8, -4, 0] } : {}}
              transition={{ duration: 0.5 }}
              onClick={openCart}
              className="relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#B9A7E8] text-[#4A3B5C] font-semibold text-xs sm:text-sm shadow-[0_4px_14px_rgba(185,167,232,0.35)] hover:bg-[#A995E0] transition-colors"
              aria-label={`Shopping bag with ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 rounded-full bg-white text-[#4A3B5C] text-xs font-bold flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            </motion.button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-full text-[#4A3B5C] hover:bg-[#E6DEF8]/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FFFDFB] border-b border-[#E6DEF8] px-6 py-5 shadow-pastel z-30"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-2 px-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#E6DEF8]/60 text-[#4A3B5C] font-semibold'
                      : 'text-[#6B5B7D] hover:bg-[#FDE8F0]/50 hover:text-[#4A3B5C]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#F0E5F5] flex items-center justify-between">
                <span className="text-xs text-[#8A7B9C]">Handcrafted with love ✿</span>
                <span className="text-xs text-[#8A7B9C]">v1.0 Storefront</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
