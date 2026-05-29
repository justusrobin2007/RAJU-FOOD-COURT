'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { handleMagnetic, resetMagnetic } from '@/lib/animations';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function HeroSection() {
  return (
    <section
      style={{ position: 'relative', height: '100vh', minHeight: '640px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=1920&auto=format&fit=crop"
          alt="South Indian cuisine"
          fill
          priority
          unoptimized
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.72) 50%, rgba(15,15,15,1) 100%)',
        }} />
      </div>

      {/* Ambient glows */}
      <div
        className="ambient-glow-saffron"
        style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1 }}
      />
      <div
        className="ambient-glow-maroon"
        style={{ position: 'absolute', bottom: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1 }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.35em',
            color: '#C5A880',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Est. 1996 · Pure Vegetarian · Rajkot
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 700,
            color: '#FAF6EE',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: '12px',
          }}
        >
          The Soul of Madras
        </motion.h1>

        <motion.h1
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="gradient-text-saffron"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: '28px',
            display: 'block',
          }}
        >
          In Gujarat
        </motion.h1>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{
            fontSize: 'clamp(13px, 1.5vw, 16px)',
            color: 'rgba(250,246,238,0.65)',
            lineHeight: 1.8,
            fontWeight: 300,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}
        >
          Golden ghee-roasted dosas, house spice blends, and a wide selection of vegetarian specialties — crafted daily with time-honored recipes.
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}
        >
          <Link href="/menu">
            <button
              onMouseMove={handleMagnetic}
              onMouseLeave={resetMagnetic}
              className="btn-premium-filled"
              style={{ padding: '14px 36px', borderRadius: '100px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              Explore Menu
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C5A880' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #C5A880, transparent)' }}
        />
      </motion.div>
    </section>
  );
}
