'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface MenuCardProps {
  item: any;
}

export default function MenuCard({ item }: MenuCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ingredients: string[] = Array.isArray(item.ingredients)
    ? item.ingredients
    : (() => { try { return JSON.parse(item.ingredients || '[]'); } catch { return []; } })();

  return (
    <>
      {/* ── Card ── */}
      <motion.div
        onClick={() => setIsModalOpen(true)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        style={{
          background: 'rgba(18,18,18,0.8)',
          border: '1px solid rgba(197,168,128,0.12)',
          borderRadius: 20,
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backdropFilter: 'blur(12px)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(197,168,128,0.28)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(197,168,128,0.12)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,15,0.7) 0%, transparent 60%)' }} />
          {item.isBestseller && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: '#FF7A00', color: '#0F0F0F',
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 100,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Sparkles size={10} /> Bestseller
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#FAF6EE', lineHeight: 1.3 }}>
              {item.name}
            </h3>
            <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#C5A880', flexShrink: 0 }}>
              {formatPrice(item.price)}
            </span>
          </div>

          <p style={{
            fontSize: '12px', color: 'rgba(250,246,238,0.55)', lineHeight: 1.7, fontWeight: 300, flexGrow: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.description}
          </p>

          {/* Spice level only — no cart button */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            {item.spiceLevel === 0
              ? <span style={{ fontSize: '9px', color: 'rgba(250,246,238,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Mild</span>
              : Array.from({ length: item.spiceLevel }).map((_, i) => <Flame key={i} size={13} color="#FF7A00" fill="#FF7A00" />)
            }
          </div>
        </div>
      </motion.div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{
                background: '#141414',
                border: '1px solid rgba(197,168,128,0.18)',
                borderRadius: 24,
                overflow: 'hidden',
                maxWidth: 680,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute', top: 14, right: 14, zIndex: 20,
                  width: 32, height: 32, borderRadius: '50%',
                  border: '1px solid rgba(197,168,128,0.2)',
                  background: 'rgba(15,15,15,0.9)',
                  color: '#FAF6EE', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} />
              </button>

              {/* Image side */}
              <div style={{ position: 'relative', width: '45%', minHeight: 280, flexShrink: 0 }}>
                <Image src={item.image} alt={item.name} fill unoptimized style={{ objectFit: 'cover' }} />
              </div>

              {/* Info side */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#C5A880', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {item.category}
                  </span>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#FAF6EE', margin: '8px 0 10px' }}>
                    {item.name}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'rgba(250,246,238,0.65)', lineHeight: 1.75, fontWeight: 300, marginBottom: 18 }}>
                    {item.description}
                  </p>

                  {ingredients.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '10px', fontWeight: 600, color: '#C5A880', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Ingredients
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {ingredients.map((ing: string, i: number) => (
                          <span key={i} style={{
                            fontSize: '10px', background: 'rgba(197,168,128,0.08)',
                            border: '1px solid rgba(197,168,128,0.15)', color: 'rgba(250,246,238,0.75)',
                            padding: '3px 10px', borderRadius: 100, fontWeight: 300,
                          }}>
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price only — no cart button */}
                <div style={{ borderTop: '1px solid rgba(197,168,128,0.1)', paddingTop: 18, marginTop: 18 }}>
                  <span style={{ fontSize: '10px', color: 'rgba(250,246,238,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>
                    Price
                  </span>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700, color: '#FF7A00' }}>
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
