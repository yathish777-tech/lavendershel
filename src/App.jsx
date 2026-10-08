import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Providers
import { ProductsProvider, useProducts } from './context/ProductsContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Layout & Global Components
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollProgress from './components/layout/ScrollProgress.jsx';
import CustomCursor from './components/layout/CustomCursor.jsx';
import PageTransition from './components/layout/PageTransition.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import Toast from './components/ui/Toast.jsx';

// Pages
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

function AppContent() {
  const location = useLocation();
  const { toastMessage } = useProducts();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F4] text-[#4A3B5C]">
      {/* Pink ribbon scroll progress bar at top */}
      <ScrollProgress />

      {/* Pastel Custom Cursor with Sparkle Trail */}
      <CustomCursor />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Content with Animated Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/products"
              element={
                <PageTransition>
                  <Product />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              }
            />
            {/* Catch-all fallback */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Global Sticky-note Toast */}
      <Toast toast={toastMessage} />
    </div>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </ProductsProvider>
  );
}
