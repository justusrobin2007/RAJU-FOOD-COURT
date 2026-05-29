'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const duration = 1600;
    const intervalTime = 16;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinished(true), 350);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100vh', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#0F0F0F',
          }}
        >
          {/* Ambient glows — inline so they always show */}
          <div style={{
            position: 'absolute', top: '20%', left: '20%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,122,0,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '20%', right: '20%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(94,25,20,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}
          >
            <p style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em',
              color: '#C5A880', textTransform: 'uppercase', marginBottom: 12,
              fontFamily: 'Outfit, sans-serif',
            }}>
              Pure Vegetarian · Rajkot
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              fontWeight: 700, color: '#FAF6EE',
              letterSpacing: '0.05em', marginBottom: 32,
            }}>
              RAJU FOOD COURT
            </h1>

            {/* Progress bar */}
            <div style={{
              width: 220, height: 2, margin: '0 auto 12px',
              background: 'rgba(197,168,128,0.12)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #FF7A00, #C5A880)',
                  width: `${progress}%`,
                }}
              />
            </div>

            <span style={{
              fontFamily: 'monospace', fontSize: '11px',
              color: 'rgba(197,168,128,0.7)', letterSpacing: '0.15em',
            }}>
              {Math.round(progress)}%
            </span>
          </motion.div>

          <div style={{
            position: 'absolute', bottom: 40, textAlign: 'center',
            fontSize: '10px', letterSpacing: '0.25em',
            color: 'rgba(250,246,238,0.3)', textTransform: 'uppercase',
            fontFamily: 'Outfit, sans-serif',
          }}>
            Crafting Culinary Masterpieces
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
