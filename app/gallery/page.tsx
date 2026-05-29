'use client';

import { motion } from 'framer-motion';
import GalleryGrid from '@/components/GalleryGrid';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Gallery() {
  return (
    <div className="pt-20 pb-16 bg-charcoal md:pt-28 md:pb-24 md:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] ambient-glow-saffron rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] ambient-glow-maroon rounded-full filter blur-3xl opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
            Visual Storytelling
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-playfair text-4xl md:text-6xl font-bold text-cream">
            Our Culinary Gallery
          </motion.h1>
          <motion.div variants={fadeUp} className="section-divider mt-5" />
          <motion.p variants={fadeUp} className="text-sm text-cream/60 font-light leading-relaxed max-w-xl mx-auto mt-6">
            Witness the passion, craft, and authentic colors of our South Indian recipes — raw spices, ghee roasts, and premium dining atmospheres.
          </motion.p>
        </motion.div>

        <GalleryGrid />
      </div>
    </div>
  );
}
