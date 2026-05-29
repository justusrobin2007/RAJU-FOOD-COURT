'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Images } from 'lucide-react';

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
}

// Assigns a span pattern that cycles through to create visual variety
// Pattern: tall, normal, normal, wide, normal, normal, tall, normal, wide...
function getSpan(index: number): { col: string; row: string } {
  const pattern = index % 9;
  if (pattern === 0) return { col: 'lg:col-span-1', row: 'lg:row-span-2' }; // tall
  if (pattern === 3) return { col: 'lg:col-span-2', row: 'lg:row-span-1' }; // wide
  if (pattern === 6) return { col: 'lg:col-span-1', row: 'lg:row-span-2' }; // tall
  if (pattern === 8) return { col: 'lg:col-span-2', row: 'lg:row-span-1' }; // wide
  return { col: 'lg:col-span-1', row: 'lg:row-span-1' };                    // normal
}

export default function GalleryGrid() {
  const [photos, setPhotos]       = useState<GalleryPhoto[]>([]);
  const [loading, setLoading]     = useState(true);
  const [lightbox, setLightbox]   = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.ok ? r.json() : [])
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glassmorphism rounded-2xl animate-pulse bg-charcoal-light/20" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-24 border border-gold/8 bg-charcoal-light/10 rounded-2xl">
        <Images className="w-12 h-12 text-cream/15 mx-auto mb-4" />
        <p className="font-playfair text-xl font-bold text-cream/40 mb-2">Gallery Coming Soon</p>
        <p className="text-sm text-cream/30 font-light">Photos will appear here once added by the admin.</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
        {photos.map((photo, index) => {
          const { col, row } = getSpan(index);
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
              onClick={() => setLightbox(photo)}
              className={`relative rounded-2xl overflow-hidden group border border-gold/10 hover:border-gold/25 transition-all duration-300 cursor-pointer ${col} ${row}`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || 'Gallery photo'}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Caption on hover */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-playfair text-sm font-bold text-cream leading-snug">{photo.caption}</p>
                </div>
              )}

              {/* Zoom hint */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-charcoal/70 border border-gold/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3.5 h-3.5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-2 0h-4m2-2v4" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-gold/15 shadow-2xl"
            >
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                <Image
                  src={lightbox.url}
                  alt={lightbox.caption || 'Gallery photo'}
                  fill
                  unoptimized
                  className="object-contain bg-charcoal-dark"
                />
              </div>
              {lightbox.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-charcoal to-transparent">
                  <p className="font-playfair text-base font-bold text-cream">{lightbox.caption}</p>
                </div>
              )}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal/80 border border-gold/20 flex items-center justify-center text-cream hover:text-saffron hover:border-saffron transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
