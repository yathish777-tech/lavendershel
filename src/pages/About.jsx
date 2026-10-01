import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Feather, Compass, Flower2, Clock } from 'lucide-react';
import FloatingDecor from '../components/ui/FloatingDecor.jsx';
import WaxSeal from '../components/ui/WaxSeal.jsx';
import SectionDivider from '../components/ui/SectionDivider.jsx';

const TIMELINE = [
  {
    year: "2023",
    title: "The First Wax Seal Melted",
    desc: "In a sunlit kitchen corner in Edinburgh, our founder Clara began penning letters to friends recovering from burnout. The soothing rhythm of melting lavender wax gave birth to Lavendershell."
  },
  {
    year: "2024",
    title: "Launching the Penpal Snail Mail Club",
    desc: "What started as 25 handwritten notes blossomed into a worldwide community of 500+ subscribers who eagerly anticipate the arrival of their monthly themed wax-sealed parcel."
  },
  {
    year: "2025",
    title: "Archival Bamboo & Cotton Paper",
    desc: "We partnered with family-owned paper mills in Italy and Japan to develop fountain-pen proof, bleed-resistant 120gsm journals with gold foil celestial borders."
  },
  {
    year: "2026",
    title: "Sanctuary for Slow Living",
    desc: "Today, Lavendershell reaches dreamers in 34 countries, creating tactile rituals that remind us to unfold gently, one handwritten page at a time."
  }
];

const VALUES = [
  {
    icon: <Feather className="w-5 h-5 text-[#8F7BD1]" />,
    title: "Tactile Slowness",
    desc: "In an era of instant notifications, we champion the physical weight of thick cotton paper, ink, and wax stamps."
  },
  {
    icon: <Heart className="w-5 h-5 text-[#F4A6C4]" />,
    title: "Unconditional Self-Compassion",
    desc: "Our journals and letters carry zero rigid rules. There is no guilt if you skip days—your pages wait for you with warmth."
  },
  {
    icon: <Flower2 className="w-5 h-5 text-[#8F7BD1]" />,
    title: "Earth-Conscious Craft",
    desc: "100% recyclable mailers, vegan botanical wax beads, soy inks, and sustainably harvested bamboo pulp."
  }
];

export default function About() {
  return (
    <div className="min-h-screen py-16 bg-[#FFF9F4] relative overflow-hidden">
      <FloatingDecor />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A6C4]" />
            <span>Our Origin & Craft</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3B5C] leading-tight">
            We believe words written by hand possess a quiet, healing magic.
          </h1>

          <p className="text-sm sm:text-base text-[#6B5B7D] leading-relaxed">
            Lavendershell was born out of a longing for slower mornings, tactile letters that smell like lavender sprigs, and gentle spaces for honest reflection.
          </p>
        </div>

        {/* Founder Story Block */}
        <div className="bg-[#FFFDFB] rounded-[32px] border-2 border-[#E6DEF8] p-8 sm:p-12 shadow-pastel mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-56 h-64 rounded-[28px] bg-gradient-to-br from-[#FAF5FE] to-[#FDE8F0] border-2 border-[#E6DEF8] p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <WaxSeal size={72} motif="shell" color="#8F7BD1" className="mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#4A3B5C]">
                Clara Beauchamp
              </h3>
              <p className="text-xs text-[#8A7B9C] font-handwritten text-base">
                Founder & Letter Writer
              </p>
              <span className="text-[10px] text-[#8F7BD1] mt-2 px-2.5 py-0.5 rounded-full bg-white border border-[#E6DEF8]">
                Edinburgh Studio
              </span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#4A3B5C]">
              "A love letter to slow, tender moments."
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5B7D] leading-relaxed">
              When the digital world became overwhelming, I turned off my screens and began sitting with blank linen notebooks and a brass seal. Pressing warm lavender wax into an envelope brought an unexpected surge of tranquility.
            </p>
            <p className="text-xs sm:text-sm text-[#6B5B7D] leading-relaxed">
              Every parcel we assemble in our studio carries that same prayer: that when you open it with a cup of warm tea, your shoulders drop, your breath deepens, and you remember that you are allowed to bloom at your own gentle pace.
            </p>
          </div>
        </div>

        {/* Brand Values */}
        <div className="mb-20">
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3B5C]">
              What We Hold Sacred
            </h2>
            <p className="text-xs text-[#8A7B9C] mt-1 font-handwritten text-base">
              the heart behind every parcel ✿
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((val, idx) => (
              <div
                key={idx}
                className="bg-[#FFFDFB] rounded-[24px] border border-[#E6DEF8] p-6 shadow-sm hover:shadow-pastel transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF5FE] border border-[#E6DEF8] flex items-center justify-center">
                  {val.icon}
                </div>
                <h4 className="font-serif text-lg font-bold text-[#4A3B5C]">
                  {val.title}
                </h4>
                <p className="text-xs text-[#6B5B7D] leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Timeline */}
        <div className="mb-16">
          <div className="text-center max-w-md mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3B5C]">
              Our Unfolding Journey
            </h2>
            <p className="text-xs text-[#8A7B9C] mt-1">
              From a single kitchen desk to thousands of mailboxes.
            </p>
          </div>

          <div className="relative border-l-2 border-[#D4C6F4] ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
            {TIMELINE.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#8F7BD1] shadow-xs" />

                <span className="text-xs font-bold text-[#8F7BD1] tracking-wider uppercase">
                  {item.year}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#4A3B5C] mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#6B5B7D] mt-1 max-w-lg leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
