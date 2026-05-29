'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { CustomerReview } from '@/data/reviews';

interface ReviewCardProps {
  review: CustomerReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      style={{
        background: 'rgba(18,18,18,0.8)',
        border: '1px solid rgba(197,168,128,0.12)',
        borderRadius: 20,
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(197,168,128,0.25)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(197,168,128,0.12)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Decorative quote mark */}
      <div style={{
        position: 'absolute', top: 20, right: 22,
        fontFamily: "'Playfair Display', serif",
        fontSize: '5rem', lineHeight: 1,
        color: 'rgba(197,168,128,0.06)',
        fontWeight: 700,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        "
      </div>

      <div>
        {/* Stars */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              color={i < review.rating ? '#C5A880' : 'rgba(250,246,238,0.15)'}
              fill={i < review.rating ? '#C5A880' : 'transparent'}
            />
          ))}
        </div>

        <p style={{
          fontSize: '13px',
          color: 'rgba(250,246,238,0.78)',
          lineHeight: 1.8,
          fontWeight: 300,
          fontStyle: 'italic',
          marginBottom: 24,
        }}>
          "{review.comment}"
        </p>
      </div>

      <div style={{ borderTop: '1px solid rgba(197,168,128,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: '#FAF6EE', marginBottom: 3 }}>
            {review.name}
          </h4>
          <span style={{ fontSize: '10px', color: '#C5A880', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            {review.role}
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'rgba(250,246,238,0.35)', textAlign: 'right' }}>
          {review.location}
        </span>
      </div>
    </motion.div>
  );
}
