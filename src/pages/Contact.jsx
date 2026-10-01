import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, MapPin, Instagram, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import WaxSeal from '../components/ui/WaxSeal.jsx';
import faqData from '../data/faq.json';
import { api } from '../services/api.js';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Snail Mail Question');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');
    await api.submitContactMessage({ name, email, subject, message });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#B9A7E8', '#F8C8DC', '#FFF9F4', '#8F7BD1']
      });
    } catch {
      // fallback
    }

    setStatus('sent');
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('Snail Mail Question');
    setMessage('');
    setStatus('idle');
  };

  return (
    <div className="min-h-screen py-16 bg-[#FFF9F4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6DEF8] text-xs font-semibold text-[#8F7BD1] shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-[#F4A6C4]" />
            <span>Penpal Inquiries & Gentle Notes</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3B5C]">
            We Would Love to Hear From You
          </h1>

          <p className="text-sm sm:text-base text-[#6B5B7D] leading-relaxed">
            Have a question about your monthly subscription, a custom wedding seal, or just want to send a sweet note? Our studio replies within 24-48 hours.
          </p>
        </div>

        {/* 2-Column Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#FFFDFB] rounded-[32px] border-2 border-[#E6DEF8] p-8 sm:p-10 shadow-pastel">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                /* Envelope Sent Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto"
                  >
                    <WaxSeal size={64} motif="heart" color="#8F7BD1" />
                  </motion.div>
                  <h3 className="font-serif text-2xl font-bold text-[#4A3B5C]">
                    Your Note is in Flight! ✿
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5B7D] max-w-sm mx-auto leading-relaxed">
                    Thank you, {name}. Your message has reached our Edinburgh studio desk. We will answer with gentle care shortly.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Send Another Letter
                  </Button>
                </motion.div>
              ) : (
                /* Active Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-[#8F7BD1]" />
                    <h3 className="font-serif text-xl font-bold text-[#4A3B5C]">
                      Send a Message to the Studio
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Clara Oswald"
                    />
                    <Input
                      label="Your Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. clara@example.com"
                    />
                  </div>

                  <Input
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    options={[
                      { label: "Snail Mail Subscription Inquiry", value: "Snail Mail Question" },
                      { label: "Order Tracking & Delivery", value: "Order Tracking" },
                      { label: "Bespoke Wax Seals & Gifting", value: "Custom Wax Seal" },
                      { label: "Wholesale & Penpal Collaboration", value: "Wholesale" },
                      { label: "Just a gentle love note ♡", value: "Gentle Note" }
                    ]}
                  />

                  <Input
                    label="Your Message"
                    multiline
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write what is on your mind..."
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === 'sending'}
                      className="w-full sm:w-auto"
                    >
                      <Send className="w-4 h-4" />
                      <span>{status === 'sending' ? 'Folding Envelope...' : 'Send Letter With Love ✿'}</span>
                    </Button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Studio Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF5FE] rounded-[28px] border border-[#E6DEF8] p-6 sm:p-8 space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#4A3B5C]">
                Studio Details
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-[#6B5B7D]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8F7BD1] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4A3B5C] block">Lavendershell Studio</strong>
                    <span>42 Whispering Meadows Lane, Edinburgh, EH3 9PL, United Kingdom</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F4A6C4] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4A3B5C] block">Direct Postal Correspondence</strong>
                    <span className="text-[#8F7BD1]">hello@lavendershell.co</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6DEF8]">
                <span className="text-xs font-semibold text-[#4A3B5C] block mb-2">
                  Find our slow correspondence community:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="#instagram"
                    className="px-3.5 py-1.5 rounded-full bg-white border border-[#E6DEF8] text-xs font-medium text-[#4A3B5C] hover:bg-[#FDE8F0] flex items-center gap-1.5 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#F4A6C4]" />
                    <span>@lavendershell</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Snail Mail Guarantee note */}
            <div className="p-6 rounded-[24px] bg-[#FFF9F4] border border-[#E6DEF8] text-xs text-[#8A7B9C] space-y-1.5">
              <p className="font-semibold text-[#4A3B5C]">Our 100% Gentle Promise</p>
              <p className="leading-relaxed">
                If your parcel ever arrives damaged by bad weather or gets lost in international transit, we will immediately re-pen and send a replacement letter at zero cost to you.
              </p>
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F7BD1]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3B5C]">
              Frequently Whispered Questions
            </h2>
          </div>

          <Accordion items={faqData} allowMultiple={false} />
        </div>

      </div>
    </div>
  );
}
