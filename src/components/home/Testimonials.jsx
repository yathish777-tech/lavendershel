import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Quote } from 'lucide-react';
import testimonials from '../../data/testimonials.json';
import Rating from '../ui/Rating.jsx';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-[#FAF5FE] to-[#FFF9F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1]">
            <Heart className="w-3.5 h-3.5 text-[#F4A6C4]" />
            <span>Gentle Kindred Voices</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B5C]">
            Treasured Reflections from Penpals
          </h2>
          <p className="text-sm text-[#6B5B7D]">
            Real thoughts shared by our community members who slow down with our monthly correspondence.
          </p>
        </div>

        {/* Animated Card Stack Container */}
        <div className="max-w-2xl mx-auto relative px-4">
          <div className="relative min-h-[300px] flex items-center justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.92, y: 20, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20, rotate: 2 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full bg-[#FFFDFB] rounded-[32px] border-2 border-[#E6DEF8] p-8 sm:p-10 shadow-pastel-lg relative space-y-6"
              >
                {/* Pastel Washi Tape decoration at top */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#FDE8F0]/90 border-b border-white/60 shadow-xs -rotate-1 select-none"
                  style={{ clipPath: 'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)' }}
                />

                <div className="flex items-center justify-between">
                  <Rating value={current.rating} size="sm" />
                  <span className="text-xs text-[#8A7B9C] font-medium font-sans">
                    {current.date}
                  </span>
                </div>

                <p className="font-serif text-lg sm:text-xl text-[#4A3B5C] leading-relaxed italic">
                  "{current.quote}"
                </p>

                <div className="pt-4 border-t border-[#F0E5F5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm text-[#4A3B5C] border border-[#E6DEF8]"
                      style={{ backgroundColor: current.avatarBg }}
                    >
                      {current.avatarInitial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#4A3B5C]">
                        {current.name}
                      </h4>
                      <p className="text-xs text-[#8A7B9C]">
                        {current.location} · {current.handle}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-[#8F7BD1] font-semibold hidden sm:inline">
                    {current.product}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-[#E6DEF8] text-[#4A3B5C] hover:bg-[#FDE8F0] shadow-xs flex items-center justify-center transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentIndex === i
                      ? 'w-7 bg-[#8F7BD1]'
                      : 'w-2.5 bg-[#D4C6F4] hover:bg-[#B9A7E8]'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-[#E6DEF8] text-[#4A3B5C] hover:bg-[#FDE8F0] shadow-xs flex items-center justify-center transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
