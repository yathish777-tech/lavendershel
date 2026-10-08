import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Sparkles, Instagram, Pin, Compass } from 'lucide-react';
import WaxSeal from '../ui/WaxSeal.jsx';

export default function Footer() {
  return (
    <footer className="relative bg-[#FFF3EC] border-t border-[#E6DEF8] pt-16 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-dreamy-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E6DEF8]/80">
          
          {/* Col 1: Brand & Note */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <WaxSeal size={40} motif="shell" color="#8F7BD1" />
              <div>
                <span className="font-serif text-xl font-bold text-[#4A3B5C]">
                  Lavendershell
                </span>
                <p className="text-sm text-[#8A7B9C] font-handwritten mt-0.5">
                  letters to your softer self
                </p>
              </div>
            </div>
            <p className="text-xs text-[#6B5B7D] leading-relaxed">
              Curating slow mornings, wax-sealed mail, and tactile stationery to help you romanticize your thoughts and quiet days.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#8A7B9C]">
              <span>Handcrafted with</span>
              <Heart className="w-3.5 h-3.5 fill-[#F8C8DC] text-[#F4A6C4]" />
              <span>for dreamers worldwide</span>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#4A3B5C] mb-3 uppercase tracking-wider">
              Treasures
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5B7D]">
              <li>
                <Link to="/products?category=cat-snail-mail" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Monthly Snail Mail Club
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat-journaling" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Linen Journals & Notebooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat-stationery" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Brass Wax Seals & Stamps
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat-seasonal-editions" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Seasonal Solstice Vaults
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat-bundles" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Gift Bundles & Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Gentle Care */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#4A3B5C] mb-3 uppercase tracking-wider">
              Gentle Care
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5B7D]">
              <li>
                <Link to="/about" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Our Brand Story & Craft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Snail Mail FAQ & Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#4A3B5C] hover:underline transition-colors">
                  Shipping & Subscription Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Postal Community */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#4A3B5C] mb-3 uppercase tracking-wider">
              Stay in Touch
            </h4>
            <p className="text-xs text-[#6B5B7D] mb-3 leading-relaxed">
              Tag <span className="font-medium text-[#4A3B5C]">#LavendershellMail</span> on Instagram to be featured in our monthly penpal zine.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-white text-[#4A3B5C] border border-[#E6DEF8] flex items-center justify-center hover:bg-[#FDE8F0] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#pinterest"
                className="w-8 h-8 rounded-full bg-white text-[#4A3B5C] border border-[#E6DEF8] flex items-center justify-center hover:bg-[#FDE8F0] transition-colors"
                aria-label="Pinterest"
              >
                <Pin className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="w-8 h-8 rounded-full bg-white text-[#4A3B5C] border border-[#E6DEF8] flex items-center justify-center hover:bg-[#FDE8F0] transition-colors"
                aria-label="Contact us"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7B9C]">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Lavendershell Studio. All gentle rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2 text-center sm:text-right">
            <span>Free domestic shipping over ₹999</span>
            <span aria-hidden="true">·</span>
            <span>Hand-poured vegan wax</span>
            <span aria-hidden="true">·</span>
            <span>Plastic-free mailers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
