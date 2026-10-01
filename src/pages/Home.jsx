import React, { useState } from 'react';
import IntroAnimation from '../components/home/IntroAnimation.jsx';
import Hero from '../components/home/Hero.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import FeaturedCarousel from '../components/home/FeaturedCarousel.jsx';
import SnailMailStory from '../components/home/SnailMailStory.jsx';
import SeasonalSpotlight from '../components/home/SeasonalSpotlight.jsx';
import BundlesSection from '../components/home/BundlesSection.jsx';
import AffirmationMarquee from '../components/home/AffirmationMarquee.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import Newsletter from '../components/home/Newsletter.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProductDetail from '../components/product/ProductDetail.jsx';
import SectionDivider from '../components/ui/SectionDivider.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

export default function Home() {
  const { products, categories } = useProducts();
  const [showIntro, setShowIntro] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional Session-Once Intro Envelope Animation */}
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* Hero Section */}
      <Hero />

      {/* Wavy Divider */}
      <SectionDivider fill="#FFFDFB" variant="wave" />

      {/* Categories Showcase */}
      <CategoryShowcase categories={categories} />

      {/* Featured Products Carousel */}
      <FeaturedCarousel
        products={products}
        categories={categories}
        onOpenQuickView={setQuickViewProduct}
      />

      {/* Wavy Divider */}
      <SectionDivider fill="#FFFDFB" variant="cloud" />

      {/* Interactive Sticky/Step "How Monthly Snail Mail Works" Story */}
      <SnailMailStory />

      {/* Seasonal Solstice Limited Spotlight */}
      <SeasonalSpotlight
        products={products}
        onOpenQuickView={setQuickViewProduct}
      />

      {/* Bundles & Gift Sets */}
      <BundlesSection
        products={products}
        onOpenQuickView={setQuickViewProduct}
      />

      {/* Affirmation Marquee Ticker */}
      <AffirmationMarquee />

      {/* Testimonials Card Stack */}
      <Testimonials />

      {/* Newsletter Signup with Envelope animation */}
      <Newsletter />

      {/* Quick View Product Modal */}
      <Modal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        title="Sanctuary Treasure"
        subtitle="Tactile details & mindful craftsmanship"
        maxWidth="max-w-3xl"
      >
        {quickViewProduct && (
          <ProductDetail
            product={quickViewProduct}
            categories={categories}
            allProducts={products}
            onSelectProduct={setQuickViewProduct}
          />
        )}
      </Modal>
    </div>
  );
}
