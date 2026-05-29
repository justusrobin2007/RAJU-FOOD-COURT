'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ShieldCheck, Utensils, Star } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const TIMELINE = [
  {
    year: '1996',
    title: 'A Rolling Cart Dream',
    desc: 'Raju Food Court began as a humble 4-wheeler rolling cart on the streets of Rajkot, serving freshly made dosas and snacks to the local community.',
  },
  {
    year: '2000s',
    title: 'A Proper Small Hotel',
    desc: 'Growing demand led to the establishment of a small dine-in hotel, offering a wider menu and a comfortable space for families and regulars.',
  },
  {
    year: '2010s',
    title: 'Expansion & Growth',
    desc: 'The hotel expanded into a multi-storey building, adding more seating, a broader menu spanning South Indian and Punjabi cuisine, and a loyal customer base.',
  },
  {
    year: 'Today',
    title: 'A Rajkot Landmark',
    desc: 'Raju Food Court is today a key element in Rajkot\'s food scene — a trusted name for pure vegetarian meals, known for quality, variety, and consistency.',
  },
];

const PILLARS = [
  { Icon: Utensils,    title: '100% Vegetarian',  desc: 'Every item on our menu is pure vegetarian. No compromise, no exceptions.' },
  { Icon: Star,        title: 'Wide Variety',      desc: 'From South Indian dosas and idlis to Punjabi curries, pav bhaji, rice dishes and more.' },
  { Icon: ShieldCheck, title: 'Hygiene & Quality', desc: 'Our kitchen follows strict sanitary standards — cleaned and sanitized daily for your safety.' },
];

export default function About() {
  return (
    <div className="pt-20 pb-16 bg-charcoal md:pt-28 md:pb-24 md:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] ambient-glow-saffron rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] ambient-glow-maroon rounded-full filter blur-3xl opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
            Our Story
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-playfair text-4xl md:text-6xl font-bold text-cream">
            The Story of Raju Food Court
          </motion.h1>
          <motion.div variants={fadeUp} className="section-divider mt-5" />
        </motion.div>

        {/* Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-24">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="space-y-5"
          >
            <motion.h2 variants={fadeUp} className="font-playfair text-2xl md:text-3xl font-bold text-cream leading-snug">
              From a Rolling Cart to a Rajkot Landmark
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm text-cream/65 leading-relaxed font-light">
              What started in 1996 as a simple 4-wheeler rolling cart has grown into one of Rajkot's most recognised vegetarian food destinations. Raju Food Court was built on one principle: serve good food, honestly, every single day.
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-cream/65 leading-relaxed font-light">
              Over the decades, we expanded from a small hotel into a full multi-storey establishment. Our menu grew too — from classic South Indian dosas and idlis to a rich Punjabi menu, pav bhaji, rice dishes, and much more. Today, we are proud to be a key part of Rajkot's food culture, trusted by families across generations.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[380px] md:h-[460px] rounded-2xl overflow-hidden border border-gold/12 shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop"
              alt="Food being prepared"
              fill unoptimized className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="block text-[10px] text-gold uppercase tracking-[0.25em] font-semibold mb-1">Est. 1996</span>
              <p className="font-playfair text-base font-bold text-cream leading-snug">Rajkot's Trusted<br />Vegetarian Food Court</p>
            </div>
          </motion.div>
        </div>

        {/* Pillars */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        >
          {PILLARS.map(({ Icon, title, desc }) => (
            <motion.div
              key={title} variants={fadeUp}
              className="glassmorphism p-8 rounded-2xl text-center space-y-4 hover:border-gold/25 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-saffron" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-cream">{title}</h3>
              <p className="text-xs text-cream/55 font-light leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="border-t border-gold/10 pt-20">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="font-playfair text-3xl font-bold text-cream">
              Our Journey
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xs text-cream/45 mt-2 uppercase tracking-widest">
              From a cart to a landmark
            </motion.p>
            <motion.div variants={fadeUp} className="section-divider mt-4" />
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i} variants={fadeUp}
                className="bg-charcoal-light/25 border border-gold/10 p-6 rounded-2xl hover:border-gold/22 transition-colors duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-saffron" />
                  <span className="font-playfair text-xl font-bold text-gold">{item.year}</span>
                </div>
                <h4 className="font-playfair text-sm font-bold text-cream mb-2">{item.title}</h4>
                <p className="text-xs text-cream/55 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
