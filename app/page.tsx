'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Utensils, Star, ShieldCheck, Clock } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import MenuCard from '@/components/MenuCard';
import ReviewCard from '@/components/ReviewCard';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const PILLARS = [
  { icon: Utensils,    title: '100% Vegetarian',  desc: 'Every dish on our menu is pure vegetarian — no exceptions.' },
  { icon: Star,        title: 'Wide Variety',      desc: 'From South Indian dosas to Punjabi curries, pav bhaji and more.' },
  { icon: ShieldCheck, title: 'Hygiene First',     desc: 'Our kitchens follow strict sanitary standards, sanitized daily.' },
  { icon: Clock,       title: 'Fresh Every Day',   desc: 'All dishes are prepared fresh daily for the best taste.' },
];

export default function Home() {
  const [specials, setSpecials]     = useState<any[]>([]);
  const [reviews, setReviews]       = useState<any[]>([]);
  const [menuCount, setMenuCount]   = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.ok ? r.json() : [])
      .then((items: any[]) => {
        setMenuCount(items.length);
        setSpecials(items.filter((i) => i.isBestseller).slice(0, 3));
      })
      .catch(() => {});

    fetch('/api/reviews')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => setReviews(data.filter((r) => r.isApproved).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <>
      <HeroSection />

      {/* ── Signature Specials ───────────────────────────────── */}
      {specials.length > 0 && (
        <section className="py-16 md:py-24 bg-charcoal relative overflow-hidden">
          <div className="ambient-glow-saffron absolute top-1/2 -left-20 w-[500px] h-[500px] rounded-full filter blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="text-center mb-16"
            >
              <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
                Curated Daily
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-playfair text-3xl md:text-5xl font-bold text-cream mb-4">
                Signature Specials
              </motion.h2>
              <motion.div variants={fadeUp} className="section-divider" />
            </motion.div>

            <motion.div
              variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-7"
            >
              {specials.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link href="/menu">
                <button className="btn-premium py-3 px-9 rounded-full text-xs">View Full Menu</button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Brand Philosophy ─────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-charcoal-dark relative overflow-hidden border-y border-gold/8">
        <div className="ambient-glow-maroon absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative rounded-2xl overflow-hidden border border-gold/12 aspect-[4/5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop"
                alt="Crispy golden dosa"
                fill unoptimized className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/85 to-transparent" />
              <div className="absolute bottom-7 left-7">
                <span className="block text-[10px] text-gold uppercase tracking-[0.25em] font-semibold mb-1.5">ESTD 1998</span>
                <h3 className="font-playfair text-lg font-bold text-cream leading-snug">
                  Over 25 Years of<br />Vegetarian Cooking
                </h3>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={stagger} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="space-y-6"
            >
              <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold block">
                Our Philosophy
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-playfair text-3xl md:text-5xl font-bold text-cream leading-tight">
                Good Food,<br />
                <span className="gradient-text-saffron">Honest Cooking</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-sm text-cream/65 leading-relaxed font-light">
                At Raju Food Court, we believe great food doesn't need exaggeration. Since 1996, we have been serving freshly prepared vegetarian meals — from crispy South Indian dosas and soft idlis to hearty Punjabi curries, pav bhaji, and more. Every dish is made fresh daily with quality ingredients and served with care.
              </motion.p>

              <motion.div variants={stagger} className="grid grid-cols-2 gap-5 pt-2">
                {PILLARS.map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} variants={fadeUp} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-lg bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-saffron" />
                    </div>
                    <div>
                      <h4 className="font-playfair text-sm font-bold text-cream mb-1">{title}</h4>
                      <p className="text-[11px] text-cream/45 font-light leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="pt-2">
                <Link href="/about">
                  <button className="btn-premium-filled py-3 px-8 rounded-full text-xs">Discover Our Story</button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-12 bg-charcoal border-b border-gold/8">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-3"
          >
            {[
              { value: '30+',  label: 'Years of Heritage' },
              { value: menuCount !== null ? menuCount : '...', label: 'Menu Items' },
              { value: '100%', label: 'Pure Vegetarian' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center py-6 px-4 ${i < 2 ? 'border-r border-gold/10' : ''}`}
              >
                <div className="font-playfair text-3xl md:text-4xl font-bold text-saffron mb-1">{stat.value}</div>
                <div className="text-[11px] text-cream/45 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="py-16 md:py-24 bg-charcoal relative overflow-hidden">
          <div className="ambient-glow-saffron absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="text-center mb-16"
            >
              <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
                Guest Testimonials
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-playfair text-3xl md:text-5xl font-bold text-cream mb-4">
                Loved By Food Connoisseurs
              </motion.h2>
              <motion.div variants={fadeUp} className="section-divider" />
            </motion.div>

            <motion.div
              variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {reviews.map((review) => (
                <motion.div key={review.id} variants={fadeUp}>
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link href="/reviews">
                <button className="btn-premium py-3 px-9 rounded-full text-xs">Read All Reviews</button>
              </Link>            </motion.div>
          </div>
        </section>
      )}

      {/* ── Visit Us CTA ─────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-6 bg-charcoal-dark border-t border-gold/8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cream mb-4">
            Come Visit Us
          </h2>
          <p className="text-sm text-cream/55 font-light leading-relaxed mb-8">
            No 3/8, Gayakwadi Main Rd, Junction Plot, Rajkot · Open daily 6 PM – 11 PM
          </p>
          <Link href="/contact">
            <button className="btn-premium-filled py-3.5 px-10 rounded-full text-xs">Get Directions</button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
