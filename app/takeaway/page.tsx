'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const STEPS = [
  { num: '01', Icon: ShoppingBag, title: 'Choose Dishes',     desc: 'Browse our digital menu and add signature dosas, soft idlis, or chef-special vegetarian dishes to your cart.' },
  { num: '02', Icon: Clock,       title: 'Set Details',       desc: 'Enter your contact details and specify your preferred pickup time.' },
  { num: '03', Icon: MessageSquare, title: 'WhatsApp Confirm', desc: 'Submit to sync your order and instantly launch a pre-filled WhatsApp confirmation.' },
];

export default function Takeaway() {
  const setCartOpen = useCartStore((state) => state.setIsOpen);
  const totalItems  = useCartStore((state) => state.getTotalItems());

  return (
    <div className="pt-20 pb-16 bg-charcoal md:pt-28 md:pb-24 md:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] ambient-glow-maroon rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] ambient-glow-saffron rounded-full filter blur-3xl opacity-15 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
            Quick Counter Service
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-playfair text-4xl md:text-6xl font-bold text-cream">
            Takeaway Orders
          </motion.h1>
          <motion.div variants={fadeUp} className="section-divider mt-5" />
          <motion.p variants={fadeUp} className="text-sm text-cream/60 font-light leading-relaxed max-w-lg mx-auto mt-6">
            Skip the queue. Select your items, schedule a pickup time, and confirm via WhatsApp. Your food will be packed hot and fresh.
          </motion.p>
        </motion.div>

        {/* ── Steps ── */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
        >
          {STEPS.map(({ num, Icon, title, desc }) => (
            <motion.div
              key={num} variants={fadeUp}
              className="glassmorphism p-6 rounded-2xl relative hover:border-gold/25 transition-colors duration-300"
            >
              <span className="absolute top-5 right-5 font-playfair text-3xl font-bold text-gold/10 select-none">{num}</span>
              <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-saffron" />
              </div>
              <h3 className="font-playfair text-base font-bold text-cream mb-2">{title}</h3>
              <p className="text-xs text-cream/55 font-light leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Status Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="glassmorphism p-8 rounded-2xl max-w-md mx-auto"
        >
          <h2 className="font-playfair text-xl font-bold text-cream mb-6 text-center">Order Summary</h2>

          <div className="flex items-center justify-between border-y border-gold/10 py-5 mb-6">
            <div>
              <p className="text-[10px] text-cream/45 uppercase tracking-wider mb-1">Current Items</p>
              <p className="font-playfair text-2xl font-bold text-cream">{totalItems} <span className="text-sm font-normal text-cream/50">dishes</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-cream/45 uppercase tracking-wider mb-1">Status</p>
              <p className="text-sm font-semibold text-gold flex items-center gap-1.5 justify-end">
                <CheckCircle className="w-4 h-4 text-saffron" /> Order Pending
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/menu" className="flex-1">
              <button className="btn-premium-filled w-full py-3 rounded-full text-xs">
                Go to Menu
              </button>
            </Link>
            {totalItems > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                className="btn-premium flex-1 py-3 rounded-full text-xs"
              >
                Open Cart
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Hours note ── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-cream/35 font-light"
        >
          <Clock className="w-3.5 h-3.5 text-saffron" />
          Counter open every day: 11:00 AM – 10:30 PM
        </motion.div>

      </div>
    </div>
  );
}
