import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';
import Button from '../ui/Button.jsx';
import WaxSeal from '../ui/WaxSeal.jsx';
import { api } from '../../services/api.js';
import confetti from 'canvas-confetti';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sealed'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');
    await api.subscribeNewsletter(email);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#B9A7E8', '#F8C8DC', '#FFEAA7']
      });
    } catch {
      // fallback
    }

    setStatus('sealed');
  };

  return (
    <section className="py-20 bg-[#FFF9F4] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#FFFDFB] rounded-[36px] border-2 border-[#E6DEF8] p-8 sm:p-14 shadow-pastel-lg text-center overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E6DEF8]/50 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#FDE8F0]/50 blur-3xl pointer-events-none" />

          {/* Animated Envelope Icon at top */}
          <motion.div
            animate={status === 'sealed' ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
            className="w-16 h-16 rounded-full bg-[#FAF5FE] border border-[#E6DEF8] mx-auto mb-4 flex items-center justify-center shadow-xs text-[#8F7BD1]"
          >
            {status === 'sealed' ? (
              <WaxSeal size={42} motif="heart" color="#8F7BD1" />
            ) : (
              <Mail className="w-8 h-8" />
            )}
          </motion.div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#4A3B5C]">
            Receive Our Gentle Penpal Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5B7D] max-w-md mx-auto mt-2 leading-relaxed">
            Every fortnight on Sunday dusk, we send a digital love letter with stationery sneak peeks, slow prompts, and soothing playlist curations.
          </p>

          {/* Form or Sealed Success Animation */}
          <div className="mt-8 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {status === 'sealed' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-[#FAF5FE] border border-[#B9A7E8] text-center space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#8F7BD1]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your seat in our penpal circle is sealed! ✿</span>
                  </div>
                  <p className="text-xs text-[#6B5B7D]">
                    We've sent a gentle welcome note to <strong className="text-[#4A3B5C]">{email}</strong>.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your favorite email address..."
                      className="w-full px-5 py-3.5 text-xs sm:text-sm bg-white border border-[#E6DEF8] rounded-full outline-none focus:border-[#B9A7E8] focus:shadow-[0_0_15px_rgba(185,167,232,0.3)] text-[#4A3B5C] placeholder-[#8A7B9C]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={status === 'sending'}
                    className="shrink-0"
                  >
                    <span>Join Penpals</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </AnimatePresence>

            <span className="text-[11px] text-[#8A7B9C] block mt-3">
              Zero spam. Only tenderness. Unsubscribe in one gentle tap anytime.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
