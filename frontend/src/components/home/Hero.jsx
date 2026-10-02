import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Mail, Heart } from 'lucide-react';
import Button from '../ui/Button.jsx';
import FloatingDecor from '../ui/FloatingDecor.jsx';
import ProductIllustration from '../product/ProductIllustration.jsx';
import confetti from 'canvas-confetti';

export default function Hero() {
  const headline = "Letters to your softer self, sealed with lavender wax.";

  const handleCtaClick = (e) => {
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#B9A7E8', '#F8C8DC', '#FFF9F4', '#D4AF37'],
        disableForReducedMotion: true
      });
    } catch {
      // fallback
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#FFF9F4] via-[#FDE8F0]/30 to-[#FFF9F4]">
      {/* Parallax Floating Decorations */}
      <FloatingDecor />

      {/* Animated Gradient Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: [0, 20, -20, 0],
            y: [0, -30, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-[#E6DEF8]/60 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 0.9, 1.1, 1],
            x: [0, -30, 15, 0],
            y: [0, 25, -25, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-[#F8C8DC]/50 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Handwritten Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E6DEF8] shadow-xs">
              <span className="text-base text-[#F4A6C4]">✿</span>
              <span className="font-handwritten text-base text-[#4A3B5C] tracking-wide">
                Slow correspondence in a fast-paced world
              </span>
            </div>

            {/* Staggered Letter-by-Letter Display Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#4A3B5C] leading-[1.15] tracking-tight">
              {headline.split(" ").map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap mr-2.5">
                  {word.split("").map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: (wIdx * 5 + cIdx) * 0.02,
                        ease: "easeOut"
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6B5B7D] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              Receive a monthly envelope of mindful reflection letters, vintage-inspired botanical postage, and keepsake stationery to nurture your quiet morning hours.
            </p>

            {/* CTAs with soft pulse and sparkle */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/products?category=cat-snail-mail">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCtaClick}
                  className="shadow-pastel relative overflow-hidden group"
                >
                  <Mail className="w-5 h-5" />
                  <span>Join the Snail Mail Club</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/products">
                <Button variant="outline" size="lg">
                  <span>Explore Stationery</span>
                </Button>
              </Link>
            </div>

            {/* Social proof trust badge */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#8A7B9C]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#F4A6C4]">★★★★★</span>
                <span className="font-semibold text-[#4A3B5C]">4.95/5</span>
                <span>(1,200+ Penpals)</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>100% Recyclable Cotton Paper</span>
            </div>
          </div>

          {/* Right Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md bg-[#FFFDFB] rounded-[32px] border-2 border-[#E6DEF8] p-5 shadow-pastel-lg"
            >
              {/* Decorative Corner Postage Stamp */}
              <div className="absolute -top-4 -right-3 w-14 h-16 bg-[#FDE8F0] rounded-md border-2 border-dashed border-[#F8C8DC] shadow-sm flex items-center justify-center rotate-6 select-none">
                <span className="text-xl">🐚</span>
              </div>

              {/* Main Illustration */}
              <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FFF9F4] to-[#FAF5FE] p-4">
                <ProductIllustration type="envelope" />
              </div>

              {/* Floating Review Card Overlay */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E6DEF8] shadow-sm flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#E6DEF8] flex items-center justify-center font-serif font-bold text-[#4A3B5C] text-sm shrink-0">
                  C
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#4A3B5C] truncate">
                    "My mailbox finally brings me peace"
                  </p>
                  <p className="text-[11px] text-[#8A7B9C] font-handwritten text-sm">
                    Clara B. · Monthly Penpal since 2024
                  </p>
                </div>
                <Heart className="w-4 h-4 fill-[#F8C8DC] text-[#F4A6C4] shrink-0" />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
