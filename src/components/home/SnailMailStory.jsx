import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, Stamp, CheckCircle2 } from 'lucide-react';
import WaxSeal from '../ui/WaxSeal.jsx';
import Button from '../ui/Button.jsx';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: 1,
    title: "A Heartfelt Letter is Penned",
    subtitle: "Written in intentional, slow prose",
    description: "Each month revolves around a gentle theme—like 'Unfolding Without Hurrying' or 'Sanctuaries of Stillness'. We print each letter onto 120gsm textured Italian cotton paper.",
    badge: "Step 01 · The Penning",
    illustration: "letter"
  },
  {
    step: 2,
    title: "Hand-Sealed in Lavender Wax",
    subtitle: "Old-world tactile craftsmanship",
    description: "We melt botanical lavender wax beads and hand-stamp each envelope with our signature seashell brass seal. No two seals are ever identical.",
    badge: "Step 02 · The Seal",
    illustration: "seal"
  },
  {
    step: 3,
    title: "Mindful Prompt Cards & Stickers Added",
    subtitle: "Tools for your quiet morning ritual",
    description: "Tucked behind the letter are 3 guided contemplation cards, an exclusive holographic affirmation sticker, and collectible botanical art stamps.",
    badge: "Step 03 · The Keepsakes",
    illustration: "prompt"
  },
  {
    step: 4,
    title: "Delivered Right to Your Mailbox",
    subtitle: "A joy beyond bills and flyers",
    description: "Shipped between the 3rd and 5th of every month. Opening your mailbox transforms into a slow, sacred act of reconnecting with yourself.",
    badge: "Step 04 · The Arrival",
    illustration: "mailbox"
  }
];

export default function SnailMailStory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-[#FFFDFB] border-y border-[#E6DEF8]/80 relative overflow-hidden">
      {/* Background floral glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#FDE8F0]/50 blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5FE] border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1]">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A6C4]" />
            <span>The Postal Ritual</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B5C]">
            How Monthly Snail Mail Works
          </h2>
          <p className="text-sm text-[#6B5B7D] leading-relaxed">
            A step-by-step glimpse into how our physical correspondence parcels are crafted and sent straight to your front door.
          </p>
        </div>

        {/* Step-by-Step Interactive Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-6 space-y-4">
            {STEPS.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-[24px] border transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#FAF5FE] border-[#B9A7E8] shadow-pastel'
                      : 'bg-white border-[#F0E5F5] hover:border-[#E6DEF8] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#8F7BD1] text-white shadow-xs'
                          : 'bg-[#F5F0FC] text-[#8A7B9C]'
                      }`}
                    >
                      {s.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F7BD1]">
                          {s.badge}
                        </span>
                        {isActive && (
                          <span className="text-xs text-[#F4A6C4] font-handwritten text-base">
                            unfolding now ✿
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#4A3B5C]">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[#8A7B9C] mb-2 font-medium">
                        {s.subtitle}
                      </p>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs sm:text-sm text-[#6B5B7D] leading-relaxed pt-1 border-t border-[#E6DEF8]/60"
                        >
                          {s.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link to="/products?category=cat-snail-mail">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <Mail className="w-4 h-4" />
                  <span>Subscribe to Snail Mail ($18/mo)</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Envelope Story Visual Graphic */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-[#FFF9F4] rounded-[32px] border-2 border-[#E6DEF8] p-6 shadow-pastel-lg flex flex-col items-center justify-center overflow-hidden">
              
              {/* Dynamic Step Graphic */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.88, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -15 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="w-full h-full flex flex-col items-center justify-center text-center p-4"
                >
                  {/* Step 1 Visual */}
                  {activeStep === 0 && (
                    <div className="space-y-4">
                      <div className="w-48 h-56 mx-auto bg-white rounded-2xl border-2 border-[#E6DEF8] shadow-md p-4 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="w-12 h-3 bg-[#E6DEF8] rounded-full mx-auto" />
                          <div className="w-full h-1 bg-[#F0E5F5] rounded" />
                          <div className="w-4/5 h-1 bg-[#F0E5F5] rounded" />
                          <div className="w-full h-1 bg-[#F0E5F5] rounded" />
                        </div>
                        <p className="font-handwritten text-lg text-[#8F7BD1] rotate-1">
                          "Breathe gently, dear soul..."
                        </p>
                        <div className="text-[10px] text-[#8A7B9C] text-right">
                          — Lavendershell
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8A7B9C] block">
                        Textured 120gsm Italian Cotton
                      </span>
                    </div>
                  )}

                  {/* Step 2 Visual */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <div className="relative w-52 h-40 mx-auto bg-white rounded-2xl border-2 border-[#E6DEF8] shadow-md flex items-center justify-center">
                        {/* Fold lines */}
                        <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full pointer-events-none">
                          <path d="M0,0 L100,75 L200,0" fill="#FDE8F0" opacity="0.5" stroke="#D4C6F4" strokeWidth="1.5" />
                          <path d="M0,150 L100,65 L200,150" fill="#FFF" stroke="#D4C6F4" strokeWidth="1.5" />
                        </svg>
                        <div className="relative z-10 scale-125">
                          <WaxSeal size={52} motif="shell" color="#8F7BD1" />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8A7B9C] block">
                        Hand-Poured Lavender Wax Stamp
                      </span>
                    </div>
                  )}

                  {/* Step 3 Visual */}
                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-24 h-32 bg-[#FDE8F0] rounded-xl border border-[#F8C8DC] shadow-sm p-2 flex flex-col justify-between -rotate-6">
                          <span className="text-[9px] font-bold text-[#8A7B9C]">PROMPT</span>
                          <p className="font-handwritten text-xs text-[#4A3B5C]">What gave you peace today?</p>
                          <span className="text-[9px] text-[#8A7B9C]">Card 1 of 3</span>
                        </div>
                        <div className="w-24 h-32 bg-[#FAF5FE] rounded-xl border border-[#E6DEF8] shadow-sm p-2 flex flex-col items-center justify-center rotate-6">
                          <span className="text-2xl">✨</span>
                          <span className="font-handwritten text-xs text-[#8F7BD1] font-bold mt-1">
                            blooming ♡
                          </span>
                          <span className="text-[9px] text-[#8A7B9C] mt-2">Holo Vinyl</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8A7B9C] block">
                        3x Prompts & Holographic Sticker
                      </span>
                    </div>
                  )}

                  {/* Step 4 Visual */}
                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <div className="w-48 h-44 mx-auto bg-gradient-to-br from-[#E6DEF8] to-[#FDE8F0] rounded-2xl border border-white shadow-md p-4 flex flex-col items-center justify-center">
                        <span className="text-4xl mb-2">📮</span>
                        <h4 className="font-serif text-base font-bold text-[#4A3B5C]">
                          In Your Mailbox
                        </h4>
                        <span className="text-xs text-[#6B5B7D] mt-1 font-medium">
                          Delivered 3rd - 5th Monthly
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#8A7B9C] block">
                        Worldwide Slow Postal Dispatch
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
